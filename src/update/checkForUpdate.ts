/**
 * 🔔 แจ้งเตือนอัปเดต (JS ล้วน — ไม่ใช้ native lib)
 *
 * บทเรียนเก่า: `expo-in-app-updates` เคยทำแอปจอดำค้าง → ทำเองด้วย JS ปลอดภัยกว่า
 * วิธี: fetch version.json บน GitHub → เทียบเลขเวอร์ชัน → ถ้ามีใหม่กว่า เด้ง Alert ให้ไปอัปเดต
 *
 * version.json (วางที่ root ของ repo) ตัวอย่าง:
 *   { "latest": "1.1.0", "min": "1.0.0", "notes": "เพิ่มเซียมซี 40 ใบ" }
 * - latest = เวอร์ชันล่าสุด (มากกว่าปัจจุบัน → ชวนอัปเดต)
 * - min    = เวอร์ชันต่ำสุดที่ยังใช้ได้ (ปัจจุบันต่ำกว่า → บังคับอัปเดต กดปิดไม่ได้)
 *
 * ⚠️ fail-open: เน็ตล่ม / โหลดไม่ได้ → เงียบ ไม่รบกวนผู้ใช้
 */
import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';
import { t, IS_GLOBAL } from '@/i18n';

// เวอร์ชันปัจจุบันของแอป — ดึงจาก app.json (expo.version) อัตโนมัติ
const APP_VERSION: string =
  (Constants.expoConfig?.version as string) ?? '1.0.0';

// ที่อยู่ version.json (repo เดียวใช้ร่วมทั้ง 2 แอป)
const VERSION_URL =
  'https://raw.githubusercontent.com/appleapponly/paauan-randon/master/version.json';
// ลิงก์ Play Store — อิง variant (คนละ listing/package) ไม่พึ่ง Constants ตอน runtime
const PLAY_URL = `https://play.google.com/store/apps/details?id=${
  IS_GLOBAL ? 'com.paauan.auntie' : 'com.paauan.randon'
}`;

/** เทียบ semver: คืน 1 ถ้า a>b, -1 ถ้า a<b, 0 ถ้าเท่ากัน */
function cmp(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

export async function checkForUpdate() {
  try {
    const res = await fetch(`${VERSION_URL}?t=${Date.now()}`); // กัน cache
    if (!res.ok) return;
    const data = (await res.json()) as {
      latest?: string;
      min?: string;
      notes?: string;
    };

    const openStore = () => Linking.openURL(PLAY_URL);

    // บังคับอัปเดต: เวอร์ชันปัจจุบันต่ำกว่าขั้นต่ำ
    if (data.min && cmp(APP_VERSION, data.min) < 0) {
      Alert.alert(
        t('ต้องอัปเดตก่อนนะลูก', 'Time to update, sweetie'),
        t(
          'เวอร์ชันนี้เก่าไปแล้ว ป้าอัปเกรดของใหม่ให้ ไปโหลดกันจ้ะ',
          "This version's too old — Auntie's got a fresh one waiting for you!"
        ),
        [{ text: t('อัปเดตเลย', 'Update now'), onPress: openStore }],
        { cancelable: false }
      );
      return;
    }

    // ชวนอัปเดต: มีเวอร์ชันใหม่กว่า (notes ใน version.json เป็นไทย → แอป global ใช้ข้อความกลาง)
    if (data.latest && cmp(data.latest, APP_VERSION) > 0) {
      Alert.alert(
        t('มีของใหม่จากป้าแล้ว! 🎉', 'Auntie brought you something new! 🎉'),
        t(
          data.notes || 'อัปเดตเวอร์ชันใหม่เพื่อฟีเจอร์และของเล่นใหม่ ๆ นะลูก',
          'Update to get the latest features and goodies, hon!'
        ),
        [
          { text: t('ไว้ก่อน', 'Later'), style: 'cancel' },
          { text: t('อัปเดตเลย', 'Update now'), onPress: openStore },
        ]
      );
    }
  } catch {
    /* fail-open: เงียบไว้ ไม่กวนผู้ใช้ */
  }
}
