/**
 * 🌏 i18n — ตัวเลือกภาษาตาม "ตัวแปรตอน build" (ไม่ใช่ภาษาเครื่อง)
 *
 * แอปไทย (ป้าอ้วนสุ่มให้) กับแอปสากล (Auntie's Random) เป็นคนละแอปบน Play
 * ภาษาจึงตายตัวต่อแอป: thai → ไทย, global → อังกฤษ (ดู app.config.js)
 *
 * วิธีใช้:
 *   import { t, IS_GLOBAL } from '@/i18n';
 *   <Text>{t('สวัสดีจ้ะ', 'Hey there, sweetie!')}</Text>
 *   const menu = IS_GLOBAL ? MENU_EN : MENU_TH;   // สำหรับชุดข้อมูลทั้งก้อน
 */
import Constants from 'expo-constants';

export const IS_GLOBAL: boolean =
  (Constants.expoConfig?.extra as { variant?: string } | undefined)?.variant === 'global';

/** เลือกค่าตามภาษาของแอป — ใช้ได้ทั้ง string และข้อมูลชนิดอื่น */
export function t<T>(th: T, en: T): T {
  return IS_GLOBAL ? en : th;
}
