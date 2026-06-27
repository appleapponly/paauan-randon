/**
 * 🧳 สุ่มที่เที่ยว — คลังสถานที่เที่ยว (ไทยเป็นหลัก + ต่างประเทศนิดหน่อย)
 * กดสุ่ม → ได้ที่เที่ยว 1 ที่ + ป้าคอมเมนต์
 *
 * เพิ่มที่เที่ยวใหม่: เติมเข้าไปในอาเรย์ได้เลย
 */
export interface TravelSpot {
  emoji: string;
  name: string;
}

export const TRAVEL_SPOTS: TravelSpot[] = [
  { emoji: '⛰️', name: 'เชียงใหม่' },
  { emoji: '🌫️', name: 'ปาย แม่ฮ่องสอน' },
  { emoji: '🍵', name: 'เชียงราย' },
  { emoji: '🏝️', name: 'ภูเก็ต' },
  { emoji: '🛶', name: 'กระบี่' },
  { emoji: '🏖️', name: 'เกาะเสม็ด' },
  { emoji: '🌅', name: 'หัวหิน' },
  { emoji: '🎡', name: 'พัทยา' },
  { emoji: '🌳', name: 'เขาใหญ่' },
  { emoji: '🏛️', name: 'อยุธยา' },
  { emoji: '🛕', name: 'สุโขทัย' },
  { emoji: '🏔️', name: 'น่าน' },
  { emoji: '⛺', name: 'ภูกระดึง เลย' },
  { emoji: '🥥', name: 'เกาะสมุย' },
  { emoji: '🌙', name: 'เกาะพะงัน' },
  { emoji: '🐠', name: 'เกาะเต่า' },
  { emoji: '🏞️', name: 'เกาะช้าง ตราด' },
  { emoji: '🍤', name: 'จันทบุรี' },
  { emoji: '🌊', name: 'ระยอง' },
  { emoji: '🌉', name: 'กาญจนบุรี' },
  { emoji: '🚣', name: 'สังขละบุรี' },
  { emoji: '🌸', name: 'ราชบุรี (สวนผึ้ง)' },
  { emoji: '🐮', name: 'นครราชสีมา (เขาใหญ่)' },
  { emoji: '🪷', name: 'อุดรธานี (ทะเลบัวแดง)' },
  { emoji: '🦕', name: 'ขอนแก่น' },
  { emoji: '🕯️', name: 'อุบลราชธานี' },
  { emoji: '🐉', name: 'หนองคาย' },
  { emoji: '🏯', name: 'ภูชี้ฟ้า เชียงราย' },
  { emoji: '🌄', name: 'ดอยอินทนนท์' },
  { emoji: '⛵', name: 'เกาะลันตา' },
  { emoji: '💎', name: 'เกาะพีพี' },
  { emoji: '🏜️', name: 'ประจวบฯ (ชะอำ)' },
  { emoji: '🌾', name: 'เพชรบูรณ์ (เขาค้อ)' },
  { emoji: '🌺', name: 'ปางอุ๋ง' },
  { emoji: '🗼', name: 'กรุงเทพฯ (เที่ยวในเมือง)' },
  { emoji: '🗻', name: 'ญี่ปุ่น' },
  { emoji: '🇰🇷', name: 'เกาหลี' },
  { emoji: '🧋', name: 'ไต้หวัน' },
  { emoji: '🍜', name: 'เวียดนาม' },
  { emoji: '🦁', name: 'สิงคโปร์' },
];
