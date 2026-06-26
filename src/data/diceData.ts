/**
 * 🎲 คลังผล "ลูกเต๋าตัดสินใจ"
 * ทอยแล้วป้าจะฟันธงให้ — แต่ละหน้ามีคำตัดสิน (verdict) + คำพูดกวน ๆ ของป้า
 * เพิ่มหน้าใหม่ได้โดยเติมอ็อบเจกต์เข้าอาเรย์ (ไม่จำกัด 6 หน้า)
 */
import { PaaUanMood } from './paaUanLines';

export interface DiceVerdict {
  /** คำฟันธงตัวใหญ่ที่โชว์กลางจอ */
  verdict: string;
  /** อีโมจิประกอบ */
  emoji: string;
  /** คำพูดป้าอ้วนที่ขึ้นในบับเบิลคู่กับผลนี้ */
  comment: string;
  mood: PaaUanMood;
}

export const DICE_VERDICTS: DiceVerdict[] = [
  {
    verdict: 'เอาเลย!',
    emoji: '🔥',
    comment: 'ลุยเลยลูก! ป้าหนุนหลังให้ ไม่ต้องลังเล',
    mood: 'happy',
  },
  {
    verdict: 'อย่าเพิ่ง',
    emoji: '✋',
    comment: 'ใจเย็น ๆ ก่อน ป้าว่ายังไม่ใช่จังหวะนะ',
    mood: 'thinking',
  },
  {
    verdict: 'คิดดี ๆ',
    emoji: '🤔',
    comment: 'เรื่องนี้ต้องใช้สมองหน่อย อย่าใจร้อนนัก',
    mood: 'thinking',
  },
  {
    verdict: 'ถามใจตัวเอง',
    emoji: '💗',
    comment: 'ลึก ๆ ลูกก็รู้คำตอบอยู่แล้วใช่มั้ยล่ะ',
    mood: 'teasing',
  },
  {
    verdict: 'ไปเลยจ้า',
    emoji: '🚀',
    comment: 'มัวรออะไร โอกาสไม่ได้มาบ่อย ๆ นะจ๊ะ',
    mood: 'sassy',
  },
  {
    verdict: 'พักก่อน',
    emoji: '☕',
    comment: 'เหนื่อยก็พักเถอะลูก เดี๋ยวค่อยว่ากันใหม่',
    mood: 'happy',
  },
];
