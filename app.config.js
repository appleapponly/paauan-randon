/**
 * 🌏 app.config.js — สลับตัวตนแอปตาม "ไฟล์ app.variant.json" (ไม่ใช่ env)
 *
 * ทำไมใช้ไฟล์ commit ไม่ใช่ env:
 *   gradle จะ re-evaluate ไฟล์นี้ตอน bundle JS ด้วย ถ้าพึ่ง env (ที่ตั้งเฉพาะตอน prebuild)
 *   ค่าจะหลุดกลับเป็น default ตอน build จริง → แอป global กลายเป็นไทย. อ่านจากไฟล์ = ค่าคงที่เสมอ
 *
 * - variant "thai"  (ค่าเริ่มต้น) → ป้าอ้วนสุ่มให้ (com.paauan.randon)
 * - variant "global"             → Auntie's Random (com.paauan.auntie)
 *
 * แยก build ต่อ branch: แต่ละ branch commit ค่า variant ต่างกันในไฟล์นี้
 * (branch ไทย = "thai" · branch global = "global")
 */
const { variant } = require('./app.variant.json');

module.exports = ({ config }) => {
  if (variant === 'global') {
    return {
      ...config,
      name: "Auntie's Random",
      android: {
        ...config.android,
        package: 'com.paauan.auntie',
      },
      // ⚠️ TODO: เมื่อสร้างแอปใหม่ใน AdMob (สำหรับ com.paauan.auntie) แล้ว
      // ให้เปลี่ยน androidAppId ใน plugins ของแอป global โดยเฉพาะ
      extra: { ...config.extra, variant },
    };
  }

  return { ...config, extra: { ...config.extra, variant } };
};
