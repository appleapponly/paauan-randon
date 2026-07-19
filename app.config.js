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

// AdMob app id ของแอป global (com.paauan.auntie) — ของแอปไทยอยู่ใน app.json ตามเดิม
// ⚠️ ต้องตรงกับชุด ad unit ใน src/ads/adConfig.ts (บล็อก IS_GLOBAL) ไม่งั้นโฆษณาไม่ขึ้น
const GLOBAL_ADMOB_APP_ID = 'ca-app-pub-4108810718545537~7277628861';

/** สลับ androidAppId ใน plugin react-native-google-mobile-ads เป็นของแอป global */
function withGlobalAdMobId(plugins) {
  return plugins.map((p) =>
    Array.isArray(p) && p[0] === 'react-native-google-mobile-ads'
      ? [p[0], { ...p[1], androidAppId: GLOBAL_ADMOB_APP_ID }]
      : p
  );
}

module.exports = ({ config }) => {
  if (variant === 'global') {
    return {
      ...config,
      name: "Auntie's Random",
      android: {
        ...config.android,
        package: 'com.paauan.auntie',
      },
      ios: {
        ...config.ios,
        bundleIdentifier: 'com.paauan.auntie',
      },
      plugins: withGlobalAdMobId(config.plugins),
      extra: { ...config.extra, variant },
    };
  }

  return { ...config, extra: { ...config.extra, variant } };
};
