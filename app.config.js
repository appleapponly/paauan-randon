/**
 * 🌏 app.config.js — สลับตัวตนแอปตามตัวแปร APP_VARIANT (โค้ดชุดเดียว build ได้ 2 แอป)
 *
 * - ไม่ตั้ง (ค่าเริ่มต้น) = "thai"  → ป้าอ้วนสุ่มให้ (com.paauan.randon) เหมือนเดิมทุกอย่าง
 * - APP_VARIANT=global          → Auntie's Random (com.paauan.auntie) เวอร์ชันสากล
 *
 * Expo โหลด app.json ก่อนแล้วส่งเข้ามาเป็น config → ไฟล์นี้ override เฉพาะจุดที่ต่าง
 * (CI ยัง patch versionCode ลง app.json ได้เหมือนเดิม เพราะค่าถูก spread ต่อมาที่นี่)
 *
 * ในโค้ดแอปอ่าน variant ได้จาก Constants.expoConfig.extra.variant (ดู src/i18n)
 */
module.exports = ({ config }) => {
  const variant = process.env.APP_VARIANT === 'global' ? 'global' : 'thai';

  if (variant === 'global') {
    return {
      ...config,
      name: "Auntie's Random",
      android: {
        ...config.android,
        package: 'com.paauan.auntie',
      },
      // ⚠️ TODO: เมื่อสร้างแอปใหม่ใน AdMob (สำหรับ com.paauan.auntie) แล้ว
      // ให้เปลี่ยน androidAppId ใน plugins ตรงนี้เป็นของแอป global โดยเฉพาะ
      extra: { ...config.extra, variant },
    };
  }

  return { ...config, extra: { ...config.extra, variant } };
};
