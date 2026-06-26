import { ViewStyle } from 'react-native';
import { colors } from './colors';

/**
 * สไตล์ "การ์ตูนเส้นหนา" (neo-brutalism) ที่ใช้ซ้ำทั้งแอป:
 * กล่องขอบดำหนา + เงาทึบเลื่อนลงขวา (ไม่เบลอ) ให้ดูเป็นการ์ตูน
 *
 * @param bg     สีพื้นของกล่อง
 * @param offset ระยะเงาเลื่อน (ค่ามาก = เงาลึก)
 */
export function cartoonBox(bg: string, offset = 5): ViewStyle {
  return {
    backgroundColor: bg,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 18,
    // เงาทึบแบบการ์ตูน — iOS ใช้ shadow*, Android ใช้ elevation ไม่ได้ทำ offset
    // เลยจำลองด้วย shadow ทิศเดียว ไม่เบลอ (shadowRadius: 0)
    shadowColor: colors.shadow,
    shadowOffset: { width: offset, height: offset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: offset, // Android: ให้มีเงานูนพอประมาณ
  };
}

/**
 * เลือกสีตัวอักษรให้อ่านออกบนพื้นสีที่กำหนด
 * พื้นสว่าง (ทอง/ครีม/ขาว) → ใช้ดำหมึก, พื้นเข้ม → ใช้ขาว
 */
export function textOn(bg: string): string {
  const light = [colors.gold, colors.cream, colors.white].some(
    (c) => c.toLowerCase() === bg.toLowerCase()
  );
  return light ? colors.ink : colors.white;
}
