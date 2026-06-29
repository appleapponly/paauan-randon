/**
 * 📺 ศูนย์รวมค่าโฆษณา + สินค้า Pro (จุดเดียวจบ แก้ที่นี่ที่เดียว)
 *
 * ตอนนี้ใช้ "Test ID ของ Google" → เห็นโฆษณาจริงตอนทดสอบโดยไม่ผิดนโยบาย
 * เมื่อสมัคร AdMob เสร็จ ค่อยเปลี่ยน BANNER / INTERSTITIAL เป็น ad unit จริง
 * และเปลี่ยน android_app_id ใน app.json เป็นของจริงด้วย
 */
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// true = ใช้ Test ID เสมอ (ยังไม่ขึ้น production จริง) — สลับเป็น false เมื่อมี ad unit จริง
const USE_TEST_ADS = true;

// 🔁 ad unit จริง (ใส่ทีหลังเมื่อสมัคร AdMob เสร็จ) — ต้องแยก Android/iOS
const REAL_BANNER = Platform.select({ android: '', ios: '' }) ?? '';
const REAL_INTERSTITIAL = Platform.select({ android: '', ios: '' }) ?? '';

export const AD_UNITS = {
  banner: USE_TEST_ADS || !REAL_BANNER ? TestIds.BANNER : REAL_BANNER,
  interstitial:
    USE_TEST_ADS || !REAL_INTERSTITIAL ? TestIds.INTERSTITIAL : REAL_INTERSTITIAL,
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

// ราคา "สำรอง" ไว้โชว์ตอนยังดึงราคาจริงจาก Play ไม่ได้ (เน็ตล่ม / ยังไม่สร้างสินค้า)
export const PRO_FALLBACK_PRICE = {
  yearly: '฿49 / ปี',
  monthly: '฿7 / เดือน',
};

// 🎲 จำนวนครั้งที่กดปุ่มสุ่มก่อนเด้ง interstitial — สุ่มในช่วง 2-4 ครั้ง
export const INTERSTITIAL_MIN = 2;
export const INTERSTITIAL_MAX = 4;
