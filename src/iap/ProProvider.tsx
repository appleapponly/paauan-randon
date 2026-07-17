/**
 * 🛒 ProProvider — เชื่อม In-App Purchase (expo-iap) กับสถานะ Pro ของแอป
 *
 * หน้าที่:
 *  1) ต่อ Play Store แล้วดึงราคาสินค้า: subscription (รายปี/รายเดือน) + ซื้อขาด (lifetime)
 *  2) ตัดสินสิทธิ์ Pro = "มี subscription active" OR "เคยซื้อขาด" → setPro
 *  3) ให้ฟังก์ชัน buy(sku) / restore() กับหน้าซื้อ Pro
 *
 * ⚠️ กติกาสำคัญ (เคยมีบั๊ก "ซื้อแล้ว Pro หลุด"):
 *    - **ปลดสิทธิ์ทันทีที่เจอ** แต่ **ถอนสิทธิ์ได้เฉพาะตอนเช็คครบสำเร็จจริง ๆ** (fail-open)
 *    - ห้ามถอนสิทธิ์ใน session ที่เพิ่งซื้อสำเร็จ (Play propagate ไม่ทัน → เคยดึง Pro คืนทั้งที่จ่ายแล้ว)
 *    - คนซื้อขาด "ไม่มี subscription" → ตัดสินจาก hasActiveSubscriptions อย่างเดียวไม่ได้เด็ดขาด
 *
 * ⚠️ ทดสอบการ "ซื้อจริง" ได้เฉพาะตอนอัปขึ้น Play Console (internal testing) เท่านั้น
 * บน APK ที่ลงเอง การซื้อจะไม่สำเร็จ แต่แอปต้องไม่พัง (ครอบ try/catch + fail-open)
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useIAP } from 'expo-iap';
import { PRO_SKU_LIST, PRO_SKUS, PRO_LIFETIME_SKU } from '@/ads/adConfig';
import { useProStore } from '@/store/useProStore';
import { t } from '@/i18n';

interface ProContextValue {
  /** ราคาที่โชว์ได้จริงจาก Play (sku → ราคา) ถ้าว่าง = ยังดึงไม่ได้ */
  prices: Record<string, string>;
  connected: boolean;
  /** ซื้อได้ทั้ง subscription และสินค้าซื้อขาด — แยก type ให้เองจาก sku */
  buy: (sku: string) => Promise<void>;
  restore: () => Promise<void>;
}

const ProContext = createContext<ProContextValue | null>(null);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const setPro = useProStore((s) => s.setPro);

  // เช็คสิทธิ์ครบสำเร็จแล้วหรือยัง — ถ้ายัง ห้ามถอนสิทธิ์ใครเด็ดขาด (fail-open)
  const [checked, setChecked] = useState(false);
  // เพิ่งซื้อสำเร็จใน session นี้ — กัน Play propagate ไม่ทันแล้วดึง Pro คืนทั้งที่จ่ายเงินแล้ว
  const justPurchased = useRef(false);

  const {
    connected,
    products,
    subscriptions,
    activeSubscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    availablePurchases,
    getAvailablePurchases,
    getActiveSubscriptions,
    hasActiveSubscriptions,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      // ซื้อ/ต่ออายุสำเร็จ → ปลด Pro ทันที + ล็อกไม่ให้ถอนสิทธิ์ใน session นี้
      justPurchased.current = true;
      setPro(true);
      // ⚠️ สำคัญ: subscription ต้อง "acknowledge" ภายใน 3 วัน ไม่งั้น Google คืนเงิน/ยกเลิกอัตโนมัติ
      //    (อาการ: "purchase was cancelled because it was not acknowledged")
      try {
        await finishTransaction({ purchase, isConsumable: false });
      } catch (e) {
        // ⚠️ ห้าม silent เฉย ๆ — เคยเจอบั๊กจริงที่ catch กลืน error จนไม่รู้ว่า ack ล้มเหลวทำไม
        // (log ตรง ๆ ไม่ guard __DEV__ เพราะ release build ก็ต้องเห็น เผื่อดึงจาก crash log ได้)
        console.error('[IAP] finishTransaction failed in onPurchaseSuccess', e);
        // acknowledge ไม่ได้ก็ไม่ปิดสิทธิ์ผู้ใช้ ครั้งถัดไปที่เปิดแอปจะเช็คซ้ำ (ดู sweep ข้างล่าง)
      }
      // รีเฟรชรายการซื้อ ให้ ownsLifetime/สิทธิ์สะท้อนของจริงทันที ไม่ต้องรอเปิดแอปใหม่
      try {
        await getAvailablePurchases();
      } catch (e) {
        console.error('[IAP] getAvailablePurchases after purchase failed', e);
      }
    },
    onPurchaseError: (e) => {
      if (e?.code !== 'user-cancelled') {
        // โชว์ code จริงจาก Play เพื่อวินิจฉัยได้ (เช่น item-unavailable, developer-error)
        Alert.alert(
          t('ซื้อไม่สำเร็จ', 'Purchase failed'),
          `${e?.message ?? t('ลองใหม่อีกครั้งนะลูก', 'Give it another try, sweetie')} 🙏\n(code: ${e?.code ?? '-'})`
        );
      }
    },
  });

  // ต่อ Play ได้แล้ว → ดึงราคาสินค้าทั้ง 2 ชนิด + โหลดสถานะสิทธิ์เข้า state
  // (ไม่ setPro ที่นี่ — ปล่อยให้ effect "ตัดสินสิทธิ์" ข้างล่างตัดสินจากข้อมูลครบชุด)
  useEffect(() => {
    if (!connected) return;
    let cancelled = false;
    (async () => {
      try {
        await fetchProducts({ skus: PRO_SKU_LIST, type: 'subs' });
      } catch (e) {
        console.error('[IAP] fetchProducts(subs) failed', e); // ดึงราคาไม่ได้ → ใช้ราคาสำรองในหน้าซื้อ
      }
      try {
        await fetchProducts({ skus: [PRO_LIFETIME_SKU], type: 'in-app' });
      } catch (e) {
        console.error('[IAP] fetchProducts(in-app) failed', e);
      }

      // ทั้ง 2 อย่างนี้ต้องสำเร็จ "ทั้งคู่" ถึงจะเชื่อผลว่า "ไม่มีสิทธิ์" ได้
      let ok = true;
      try {
        await getActiveSubscriptions(PRO_SKU_LIST);
      } catch (e) {
        ok = false;
        console.error('[IAP] getActiveSubscriptions failed', e);
      }
      try {
        await getAvailablePurchases(); // ใช้ทั้งเช็คซื้อขาด + acknowledge ตกค้าง
      } catch (e) {
        ok = false;
        console.error('[IAP] getAvailablePurchases failed', e);
      }
      if (!cancelled && ok) setChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [connected, fetchProducts, getActiveSubscriptions, getAvailablePurchases]);

  /** 💎 เคยซื้อขาดไหม — ดูจากรายการซื้อที่ Play คืนมา (ซื้อขาดไม่มีวันหมดอายุ) */
  const ownsLifetime = useMemo(
    () => ((availablePurchases as any[]) ?? []).some((p) => p?.productId === PRO_LIFETIME_SKU),
    [availablePurchases]
  );

  // ⚖️ ตัดสินสิทธิ์ Pro — sub active หรือ ซื้อขาด อย่างใดอย่างหนึ่งก็พอ
  useEffect(() => {
    const entitled = ((activeSubscriptions as any[]) ?? []).length > 0 || ownsLifetime;
    if (entitled) {
      setPro(true); // เจอสิทธิ์ = ปลดทันที ไม่ต้องรออะไร
    } else if (checked && !justPurchased.current) {
      // ถอนสิทธิ์เฉพาะตอน "เช็คครบสำเร็จ + ไม่ได้เพิ่งซื้อ" เท่านั้น
      setPro(false);
    }
  }, [activeSubscriptions, ownsLifetime, checked, setPro]);

  // 🧹 กวาด acknowledge ตกค้างทุกครั้งที่เปิดแอป — กันเคส onPurchaseSuccess ack ไม่สำเร็จ
  // (เช่น แอปถูกปิด/เน็ตหลุดพอดี) ไม่งั้น Google จะยกเลิก+คืนเงินอัตโนมัติภายใน 3 วัน
  useEffect(() => {
    (async () => {
      for (const p of (availablePurchases as any[]) ?? []) {
        try {
          // ยังไม่ ack (หรือไม่รู้สถานะ) → ลอง ack ซ้ำ; ถ้า ack ไปแล้ว Play จะ error เฉย ๆ ไม่มีผลข้างเคียง
          if (p?.isAcknowledgedAndroid !== true) {
            await finishTransaction({ purchase: p, isConsumable: false });
          }
        } catch (e) {
          console.error('[IAP] re-acknowledge sweep failed for purchase', p?.productId ?? p, e); // ack ไม่ได้รอบนี้ → รอบเปิดแอปหน้าลองใหม่
        }
      }
    })();
  }, [availablePurchases, finishTransaction]);

  const prices = useMemo(() => {
    const out: Record<string, string> = {};
    for (const s of subscriptions as any[]) {
      // ดึงราคาแบบ localized; ถ้าว่าง ("") จะถูกข้ามไปใช้ราคาสำรอง (อย่าใช้ ?? เพราะ "" ไม่ใช่ null)
      const offer =
        s?.subscriptionOfferDetailsAndroid?.[0]?.pricingPhases?.pricingPhaseList?.[0]
          ?.formattedPrice;
      const price = offer || s?.displayPrice || s?.price;
      if (s?.id && price) out[s.id] = String(price);
    }
    // สินค้าซื้อขาดอยู่คนละถัง (products) และราคาอ่านตรง ๆ จาก displayPrice ได้เลย
    for (const p of (products as any[]) ?? []) {
      const price = p?.displayPrice || p?.price;
      if (p?.id && price) out[p.id] = String(price);
    }
    return out;
  }, [subscriptions, products]);

  const buy = useCallback(
    async (sku: string) => {
      const isLifetime = sku === PRO_LIFETIME_SKU;
      try {
        // หาสินค้าจากถังที่ถูกชนิด (ซื้อขาดอยู่ใน products, subscription อยู่ใน subscriptions)
        const item = isLifetime
          ? ((products as any[]) ?? []).find((p) => p?.id === sku)
          : ((subscriptions as any[]) ?? []).find((s) => s?.id === sku);
        // ถ้ายังโหลดสินค้าไม่ได้ → ซื้อไม่ได้แน่นอน บอกสาเหตุที่พบบ่อยแทนปล่อยให้ Play เด้ง error งง ๆ
        if (!item) {
          Alert.alert(
            t('สินค้ายังไม่พร้อมขาย', 'Product not available yet'),
            t(
              'ป้ายังดึงราคาจาก Play ไม่ได้ ลองเช็ค:\n' +
                '• ติดตั้งแอปผ่าน "ลิงก์ tester" ของ Play เท่านั้น (ไม่ใช่ลง APK เอง)\n' +
                '• บัญชี Google ในเครื่องต้องเป็น License tester\n' +
                '• ถ้าเพิ่งสร้าง/Activate สินค้า รอ Play ประมวลผล 2-3 ชม.\n' +
                '• Base plan ต้องขึ้นสถานะ Active',
              "Auntie couldn't load prices from Google Play. Please check your connection and try again in a moment."
            )
          );
          return;
        }

        if (isLifetime) {
          // ซื้อขาด: ไม่มี offerToken ส่ง sku ตรง ๆ ได้เลย
          await requestPurchase({
            type: 'in-app',
            request: { google: { skus: [sku] }, apple: { sku } },
          });
          return;
        }

        // Android subscription ต้องส่ง offerToken ของออฟเฟอร์แรก
        const offerToken = item?.subscriptionOfferDetailsAndroid?.[0]?.offerToken;
        await requestPurchase({
          type: 'subs',
          request: {
            google: {
              skus: [sku],
              ...(offerToken
                ? { subscriptionOffers: [{ sku, offerToken }] }
                : {}),
            },
            apple: { sku },
          },
        });
      } catch (e: any) {
        if (e?.code !== 'user-cancelled') {
          Alert.alert(
            t('ซื้อไม่สำเร็จ', 'Purchase failed'),
            `${e?.message ?? t('ลองใหม่อีกครั้งนะลูก', 'Give it another try, sweetie')} 🙏\n(code: ${e?.code ?? '-'})`
          );
        }
      }
    },
    [requestPurchase, subscriptions, products]
  );

  const restore = useCallback(async () => {
    try {
      // ต้องเช็คทั้ง 2 ทาง — คนซื้อขาดไม่มี subscription ถ้าดูแต่ sub จะขึ้น "ไม่พบ" ทั้งที่จ่ายแล้ว
      await getActiveSubscriptions(PRO_SKU_LIST);
      const activeSub = await hasActiveSubscriptions(PRO_SKU_LIST);
      await getAvailablePurchases();
      // อ่านผลซื้อขาดจาก Play ตรง ๆ (state ยังไม่ทันอัปเดตใน callback นี้)
      const lifetime = ((availablePurchases as any[]) ?? []).some(
        (p) => p?.productId === PRO_LIFETIME_SKU
      );
      const entitled = activeSub || lifetime || ownsLifetime;
      setPro(entitled);
      Alert.alert(
        entitled ? t('กู้คืนสำเร็จ', 'Restored!') : t('ไม่พบการซื้อ', 'No purchase found'),
        entitled
          ? t('ปลดโฆษณาให้แล้วจ้ะ ขอบใจที่รักป้า ❤️', 'Ads are gone! Thanks for loving Auntie ❤️')
          : t('ยังไม่พบสมาชิก Pro บนบัญชีนี้นะลูก', "No Pro membership on this account yet, hon")
      );
    } catch {
      Alert.alert(
        t('กู้คืนไม่ได้', "Couldn't restore"),
        t('เช็คอินเทอร์เน็ตแล้วลองใหม่นะลูก', 'Check your internet and try again, sweetie')
      );
    }
  }, [
    getActiveSubscriptions,
    hasActiveSubscriptions,
    getAvailablePurchases,
    availablePurchases,
    ownsLifetime,
    setPro,
  ]);

  const value = useMemo<ProContextValue>(
    () => ({ prices, connected, buy, restore }),
    [prices, connected, buy, restore]
  );

  return <ProContext.Provider value={value}>{children}</ProContext.Provider>;
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error('usePro must be used within ProProvider');
  return ctx;
}
