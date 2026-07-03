/**
 * 🌏 i18n — ตัวเลือกภาษาตาม "ไฟล์ app.variant.json" (baked เข้า JS bundle ตอน build)
 *
 * อ่านจากไฟล์ที่ commit ไว้โดยตรง ไม่พึ่ง Constants.expoConfig ตอน runtime
 * (release build บางเคส extra ไม่ถูกฝัง → เคยทำให้แอป global กลายเป็นไทย)
 * ค่านี้ถูกฝังตอน Metro bundle จึงตรงกับ branch ที่ build เสมอ
 *
 * แอปไทย (ป้าอ้วนสุ่มให้) = "thai" · แอปสากล (Auntie's Random) = "global"
 *
 * วิธีใช้:
 *   import { t, IS_GLOBAL } from '@/i18n';
 *   <Text>{t('สวัสดีจ้ะ', 'Hey there, sweetie!')}</Text>
 *   const menu = IS_GLOBAL ? MENU_EN : MENU_TH;   // สำหรับชุดข้อมูลทั้งก้อน
 */
import variantConfig from '../../app.variant.json';

export const IS_GLOBAL: boolean = variantConfig.variant === 'global';

/** เลือกค่าตามภาษาของแอป — ใช้ได้ทั้ง string และข้อมูลชนิดอื่น */
export function t<T>(th: T, en: T): T {
  return IS_GLOBAL ? en : th;
}
