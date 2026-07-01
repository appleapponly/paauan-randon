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
      } catch {
        /* acknowledge ไม่ได้ก็ไม่ปิดสิทธิ์ผู้ใช้ ครั้งถัดไปที่เปิดแอปจะเช็คซ้ำ */
      }
    },
    onPurchaseError: (e) => {
      if (e?.code !== 'user-cancelled') {
        // โชว์ code จริงจาก Play เพื่อวินิจฉัยได้ (เช่น item-unavailable, developer-error)
        Alert.alert(
          'ซื้อไม่สำเร็จ',
          `${e?.message ?? 'ลองใหม่อีกครั้งนะลูก'} 🙏\n(code: ${e?.code ?? '-'})`
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
      } catch {
        /* ดึงราคาไม่ได้ → ใช้ราคาสำรองในหน้าซื้อ */
      }
      try {
        await getActiveSubscriptions(PRO_SKU_LIST);
        const active = await hasActiveSubscriptions(PRO_SKU_LIST);
        setPro(active); // มี = Pro, ไม่มี = Free
      } catch {
        /* เช็คไม่ได้ → คงสถานะเดิม (ไม่ปิดสิทธิ์คนจ่ายจริง) */
      }
    })();
  }, [connected, fetchProducts, getActiveSubscriptions, hasActiveSubscriptions, setPro]);

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
            'สินค้ายังไม่พร้อมขาย',
            'ป้ายังดึงราคาจาก Play ไม่ได้ ลองเช็ค:\n' +
              '• ติดตั้งแอปผ่าน "ลิงก์ tester" ของ Play เท่านั้น (ไม่ใช่ลง APK เอง)\n' +
              '• บัญชี Google ในเครื่องต้องเป็น License tester\n' +
              '• ถ้าเพิ่งสร้าง/Activate สินค้า รอ Play ประมวลผล 2-3 ชม.\n' +
              '• Base plan ต้องขึ้นสถานะ Active'
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
            'ซื้อไม่สำเร็จ',
            `${e?.message ?? 'ลองใหม่อีกครั้งนะลูก'} 🙏\n(code: ${e?.code ?? '-'})`
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
        active ? 'กู้คืนสำเร็จ' : 'ไม่พบการสมัคร',
        active ? 'ปลดโฆษณาให้แล้วจ้ะ ขอบใจที่รักป้า ❤️' : 'ยังไม่พบสมาชิก Pro บนบัญชีนี้นะลูก'
      );
    } catch {
      Alert.alert('กู้คืนไม่ได้', 'เช็คอินเทอร์เน็ตแล้วลองใหม่นะลูก');
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
