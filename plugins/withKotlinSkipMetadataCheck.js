/**
 * 🩹 Expo config plugin: สั่งให้ Kotlin "ข้ามการเช็คเวอร์ชัน metadata"
 *
 * ทำไม: play-services-ads (มากับ react-native-google-mobile-ads) ถูกคอมไพล์ด้วย
 * Kotlin metadata 2.3.0 แต่ RN 0.85 ใช้ Kotlin 2.1.20 คอมไพล์ → อ่านไม่ได้ build พัง
 *
 * การอัป Kotlin เป็น 2.3.0 ทำให้ module อื่น (เช่น safe-area-context) compiler crash
 * จึงคง Kotlin 2.1.20 ไว้ แล้วใส่ flag -Xskip-metadata-version-check ให้คอมไพเลอร์
 * ยอมอ่าน metadata เวอร์ชันใหม่กว่าได้ (flag มาตรฐานสำหรับกรณีนี้)
 *
 * แทรกบล็อก allprojects เข้าไปท้าย android/build.gradle ตอน prebuild
 */
const { withProjectBuildGradle } = require('@expo/config-plugins');

const MARKER = '-Xskip-metadata-version-check';
const SNIPPET = `

// ⬇️ เพิ่มโดย withKotlinSkipMetadataCheck — ให้ Kotlin 2.1.x อ่าน metadata ใหม่กว่าได้
allprojects {
    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
        kotlinOptions {
            freeCompilerArgs += ["${MARKER}"]
        }
    }
}
`;

module.exports = function withKotlinSkipMetadataCheck(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (
      cfg.modResults.language === 'groovy' &&
      !cfg.modResults.contents.includes(MARKER)
    ) {
      cfg.modResults.contents += SNIPPET;
    }
    return cfg;
  });
};
