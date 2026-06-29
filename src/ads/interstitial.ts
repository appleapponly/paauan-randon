/**
 * 🎬 ตัวจัดการ Interstitial (โฆษณาเต็มจอ) — singleton ระดับ module
 *
 * กลไก: นับจำนวนครั้งที่ "กดปุ่มสุ่ม" (ทุกเครื่องสุ่มรวมกัน) เมื่อครบเป้าที่สุ่มไว้ (2-4 ครั้ง)
 * และโฆษณาโหลดพร้อม → เด้งเต็มจอ แล้วตั้งเป้าใหม่ + โหลดตัวถัดไปไว้ล่วงหน้า
 *
 * - เป็น Pro → ไม่ทำงานเลย
 * - โฆษณายังโหลดไม่เสร็จ → ข้ามรอบนี้ (ไม่ค้างผู้ใช้)
 */
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNITS, INTERSTITIAL_MIN, INTERSTITIAL_MAX } from './adConfig';
import { getIsPro } from '@/store/useProStore';

let ad: InterstitialAd | null = null;
let loaded = false;
let spinCount = 0;
let target = randTarget();

function randTarget() {
  return (
    INTERSTITIAL_MIN +
    Math.floor(Math.random() * (INTERSTITIAL_MAX - INTERSTITIAL_MIN + 1))
  );
}

function load() {
  if (getIsPro()) return;
  ad = InterstitialAd.createForAdRequest(AD_UNITS.interstitial, {
    requestNonPersonalizedAdsOnly: true,
  });
  loaded = false;
  ad.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
  });
  ad.addAdEventListener(AdEventType.CLOSED, () => {
    loaded = false;
    load(); // โหลดตัวถัดไปไว้ล่วงหน้า
  });
  ad.addAdEventListener(AdEventType.ERROR, () => {
    loaded = false;
  });
  ad.load();
}

/** เรียกครั้งเดียวตอนเปิดแอป (หลัง mobileAds().initialize()) */
export function initInterstitial() {
  if (getIsPro()) return;
  load();
}

/** เรียกทุกครั้งที่ผู้ใช้กดปุ่มสุ่ม — ครบเป้าแล้วเด้งโฆษณา */
export function registerSpin() {
  if (getIsPro()) return;
  spinCount += 1;
  if (spinCount < target) return;

  if (ad && loaded) {
    spinCount = 0;
    target = randTarget();
    try {
      ad.show();
    } catch {
      // โชว์ไม่ได้ก็ปล่อยผ่าน ไม่ขัดจังหวะผู้ใช้
    }
  } else {
    // ยังไม่พร้อม → ลองโหลดใหม่ ไว้เด้งรอบหน้า
    if (!ad) load();
  }
}
