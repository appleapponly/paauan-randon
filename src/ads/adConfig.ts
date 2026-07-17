/**
 * 📺 ศูนย์รวมค่าโฆษณา + สินค้า Pro (จุดเดียวจบ แก้ที่นี่ที่เดียว)
 *
 * ad unit จริง "แยกตาม variant" (ไทย/สากล) — เพราะ ad unit ผูกกับ package name
 * ใน AdMob ถ้าเอา ID ของแอปไทยไปใช้ในแอป EN = package ไม่ตรง → โฆษณาไม่ขึ้น/โดนแบน
 *
 * กติกาเปิดโฆษณาจริง: variant ไหน "มี ad unit จริงครบ" → ใช้ของจริงอัตโนมัติ
 *                     variant ไหนยังไม่มี (เว้นว่าง) → fallback เป็น Test ID เอง
 *   - แอปไทย (com.paauan.randon)  → AdMob app ~1622805485
 *   - แอป EN  (com.paauan.auntie) → AdMob app ~7277628861
 *   (androidAppId ของแต่ละ variant ตั้งใน app.config.js — ต้องตรงกับชุด ad unit ที่นี่)
 */
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';
import { t, IS_GLOBAL } from '@/i18n';

// 🐞 ตั้ง true เพื่อ "บังคับ" ใช้ test ad ทุก variant (ตอน dev/debug) — production ต้องเป็น false
//    (อย่ากดโฆษณาจริงของตัวเองเด็ดขาด AdMob แบนได้)
const FORCE_TEST_ADS = false;

// 🔁 ad unit จริง แยกตาม variant — ยังไม่มีให้เว้น '' (จะ fallback เป็น Test ID อัตโนมัติ)
const REAL_BANNER = IS_GLOBAL
  ? (Platform.select({ android: 'ca-app-pub-4108810718545537/6905104097', ios: '' }) ?? '')
  : (Platform.select({ android: 'ca-app-pub-4108810718545537/2080568112', ios: '' }) ?? '');
const REAL_INTERSTITIAL = IS_GLOBAL
  ? (Platform.select({ android: 'ca-app-pub-4108810718545537/9316844122', ios: '' }) ?? '')
  : (Platform.select({ android: 'ca-app-pub-4108810718545537/6724344532', ios: '' }) ?? '');

export const AD_UNITS = {
  banner: !FORCE_TEST_ADS && REAL_BANNER ? REAL_BANNER : TestIds.BANNER,
  interstitial:
    !FORCE_TEST_ADS && REAL_INTERSTITIAL ? REAL_INTERSTITIAL : TestIds.INTERSTITIAL,
};

/**
 * 🛒 รหัสสินค้า subscription ใน Play Console (ต้องตั้งชื่อให้ตรงเป๊ะตอนสร้างสินค้า)
 * - รายปี 49 บาท
 * - รายเดือน 7 บาท
 */
export const PRO_SKUS = {
  yearly: 'paauan_pro_yearly',
  monthly: 'paauan_pro_monthly',
};
export const PRO_SKU_LIST = [PRO_SKUS.yearly, PRO_SKUS.monthly];

/**
 * 💎 สินค้า "ซื้อขาด" — จ่ายครั้งเดียวใช้ตลอดชีพ
 * ⚠️ ใน Play Console ต้องสร้างเป็น **One-time product** (In-app product) ไม่ใช่ Subscription
 *    และต้องเป็นแบบ "ซื้อได้ครั้งเดียว" (non-consumable — ห้าม consume ทิ้ง)
 */
export const PRO_LIFETIME_SKU = 'paauan_pro_lifetime';

// ราคา "สำรอง" ไว้โชว์ตอนยังดึงราคาจริงจาก Play ไม่ได้ (เน็ตล่ม / ยังไม่สร้างสินค้า)
// ราคาจริงมาจาก Play เสมอ — อันนี้แค่กันช่องว่าง (แอป global ต้องตั้งราคาใน Play Console ของแอปนั้น)
export const PRO_FALLBACK_PRICE = {
  yearly: t('฿49 / ปี', '$4.99 / yr'),
  monthly: t('฿7 / เดือน', '$0.99 / mo'),
  lifetime: t('฿199 ครั้งเดียว', '$19.99 one-time'),
};

// 🎲 จำนวนครั้งที่กดปุ่มสุ่มก่อนเด้ง interstitial — สุ่มในช่วง 2-4 ครั้ง
export const INTERSTITIAL_MIN = 2;
export const INTERSTITIAL_MAX = 4;
