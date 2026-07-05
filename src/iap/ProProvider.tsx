/**
 * 🛒 ProProvider — เชื่อม In-App Purchase (expo-iap) กับสถานะ Pro ของแอป
 *
 * หน้าที่:
 *  1) ต่อ Play Store แล้วดึงราคาสินค้า subscription (รายปี/รายเดือน)
 *  2) ตรวจว่า user มี subscription ที่ยัง active อยู่ไหม → setPro (fail-open)
 *  3) ให้ฟังก์ชัน buy(sku) / restore() กับหน้าซื้อ Pro
 *
 * ⚠️ ทดสอบการ "ซื้อจริง" ได้เฉพาะตอนอัปขึ้น Play Console (internal testing) เท่านั้น
 * บน APK ที่ลงเอง การซื้อจะไม่สำเร็จ แต่แอปต้องไม่พัง (ครอบ try/catch + fail-open)
 */
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useIAP } from 'expo-iap';
import { PRO_SKU_LIST, PRO_SKUS } from '@/ads/adConfig';
import { useProStore } from '@/store/useProStore';
import { t } from '@/i18n';

interface ProContextValue {
  /** ราคาที่โชว์ได้จริงจาก Play (sku → ราคา) ถ้าว่าง = ยังดึงไม่ได้ */
  prices: Record<string, string>;
  connected: boolean;
  buy: (sku: string) => Promise<void>;
  restore: () => Promise<void>;
}

const ProContext = createContext<ProContextValue | null>(null);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const setPro = useProStore((s) => s.setPro);

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    availablePurchases,
    getAvailablePurchases,
    getActiveSubscriptions,
    hasActiveSubscriptions,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      // ซื้อ/ต่ออายุสำเร็จ → ปลด Pro ทันที
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

  // ต่อ Play ได้แล้ว → ดึงราคาสินค้า + ตรวจสิทธิ์ปัจจุบัน (fail-open)
  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        await fetchProducts({ skus: PRO_SKU_LIST, type: 'subs' });
      } catch (e) {
        console.error('[IAP] fetchProducts failed', e); // ดึงราคาไม่ได้ → ใช้ราคาสำรองในหน้าซื้อ
      }
      try {
        await getActiveSubscriptions(PRO_SKU_LIST);
        const active = await hasActiveSubscriptions(PRO_SKU_LIST);
        setPro(active); // มี = Pro, ไม่มี = Free
      } catch (e) {
        console.error('[IAP] getActiveSubscriptions/hasActiveSubscriptions failed', e); // เช็คไม่ได้ → คงสถานะเดิม (ไม่ปิดสิทธิ์คนจ่ายจริง)
      }
      try {
        // ดึงรายการซื้อค้าง มาเช็ค acknowledge ซ้ำ (ดู effect ข้างล่าง)
        await getAvailablePurchases();
      } catch (e) {
        console.error('[IAP] getAvailablePurchases failed', e); // ดึงไม่ได้ก็ข้าม รอบหน้าเช็คใหม่
      }
    })();
  }, [
    connected,
    fetchProducts,
    getActiveSubscriptions,
    hasActiveSubscriptions,
    getAvailablePurchases,
    setPro,
  ]);

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
    return out;
  }, [subscriptions]);

  const buy = useCallback(
    async (sku: string) => {
      try {
        // Android subscription ต้องส่ง offerToken ของออฟเฟอร์แรก
        const sub = (subscriptions as any[]).find((s) => s?.id === sku);
        // ถ้ายังโหลดสินค้าไม่ได้ → ซื้อไม่ได้แน่นอน บอกสาเหตุที่พบบ่อยแทนปล่อยให้ Play เด้ง error งง ๆ
        if (!sub) {
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
        const offerToken =
          sub?.subscriptionOfferDetailsAndroid?.[0]?.offerToken;
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
    [requestPurchase, subscriptions]
  );

  const restore = useCallback(async () => {
    try {
      await getActiveSubscriptions(PRO_SKU_LIST);
      const active = await hasActiveSubscriptions(PRO_SKU_LIST);
      setPro(active);
      Alert.alert(
        active ? t('กู้คืนสำเร็จ', 'Restored!') : t('ไม่พบการสมัคร', 'No subscription found'),
        active
          ? t('ปลดโฆษณาให้แล้วจ้ะ ขอบใจที่รักป้า ❤️', 'Ads are gone! Thanks for loving Auntie ❤️')
          : t('ยังไม่พบสมาชิก Pro บนบัญชีนี้นะลูก', "No Pro membership on this account yet, hon")
      );
    } catch {
      Alert.alert(
        t('กู้คืนไม่ได้', "Couldn't restore"),
        t('เช็คอินเทอร์เน็ตแล้วลองใหม่นะลูก', 'Check your internet and try again, sweetie')
      );
    }
  }, [getActiveSubscriptions, hasActiveSubscriptions, setPro]);

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
