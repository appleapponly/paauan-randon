/**
 * 📳 haptics — จุดรวมการสั่นทั้งแอป (expo-haptics)
 * ทุกฟังก์ชัน: no-op บน web + catch ทิ้งเสมอ → ไม่มีทางทำแอปพัง
 */
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS !== 'web';

/** สั่นเบา ๆ ตอนกดปุ่ม */
export function tapLight() {
  if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** สั่นติ๊กสั้น ๆ — จังหวะวงล้อ/ลูกบิดกาชาหมุน */
export function tick() {
  if (enabled) Haptics.selectionAsync().catch(() => {});
}

/** สั่นฉลองตอนได้ผลลัพธ์ */
export function success() {
  if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
