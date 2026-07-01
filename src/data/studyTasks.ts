/**
 * 📚 คลังภารกิจการเรียน + คำพูดป้าให้กำลังใจ (หน้า "สุ่มการเรียน" / "สุ่มเวลาพัก" / จับเวลา)
 */
import type { PaaUanLine } from './paaUanLines';

export interface StudyTask {
  id: string;
  text: string;
  emoji: string;
  /** ถ้ามี = ภารกิจนี้สุ่มจำนวนด้วย (เช่น อ่านกี่หน้า) */
  quantity?: { unit: string; amounts: number[] };
}

export const PRESET_STUDY_TASKS: StudyTask[] = [
  { id: 'read', text: 'อ่านหนังสือ', emoji: '📖', quantity: { unit: 'หน้า', amounts: [5, 10, 15, 20] } },
  { id: 'problems', text: 'ทำโจทย์', emoji: '✏️', quantity: { unit: 'ข้อ', amounts: [10, 15, 20, 30] } },
  { id: 'exercise', text: 'ทำแบบฝึกหัด', emoji: '📝', quantity: { unit: 'ข้อ', amounts: [10, 15, 20] } },
  { id: 'vocab', text: 'ท่องศัพท์', emoji: '🔤', quantity: { unit: 'คำ', amounts: [10, 20, 30] } },
  { id: 'sentence', text: 'แต่งประโยค', emoji: '🖊️', quantity: { unit: 'ประโยค', amounts: [5, 10] } },
  { id: 'exam', text: 'ทำข้อสอบเก่า', emoji: '🧾' },
  { id: 'reviewwrong', text: 'ทบทวนข้อที่ทำผิด', emoji: '🔍' },
  { id: 'listen', text: 'ฟังภาษาอังกฤษ', emoji: '🎧' },
  { id: 'mindmap', text: 'ทำ mind map', emoji: '🗺️' },
  { id: 'summary', text: 'สรุปเนื้อหา', emoji: '📋' },
  { id: 'teachself', text: 'อธิบายบทเรียนให้ตัวเองฟัง', emoji: '🗣️' },
  { id: 'readaloud', text: 'อ่านออกเสียง', emoji: '📢' },
  { id: 'note', text: 'จดโน้ตย่อ', emoji: '🗒️' },
  { id: 'video', text: 'ดูคลิปติว', emoji: '📺' },
];

export const DEFAULT_STUDY_IDS = [
  'read', 'problems', 'vocab', 'exam', 'reviewwrong', 'summary', 'mindmap', 'listen',
];

/** เชียร์ตอนได้ภารกิจ (ใช้ {result} แทนภารกิจ เช่น "อ่านหนังสือ 10 หน้า") */
export const studyMissionLines: PaaUanLine[] = [
  { text: 'ภารกิจวันนี้: {result} จ้า! ตั้งใจนะลูก ป้าเชียร์อยู่ 📣', mood: 'happy' },
  { text: '{result} เลย! สมองดีขึ้นทุกวัน อนาคตสดใสแน่นอน', mood: 'happy' },
  { text: 'ป้าจัด {result} ให้! ทำให้ครบแล้วค่อยพักนะจ๊ะ', mood: 'teasing' },
  { text: 'เอาเลย {result}! อย่าเพิ่งเล่นมือถือล่ะ ป้าเห็นนะ 😏', mood: 'sassy' },
  { text: '{result} จ้า! เก่งขึ้นอีกนิดทุกวัน เดี๋ยวก็เก่งมากเอง', mood: 'happy' },
];

/** ข้อความให้กำลังใจ "ระหว่างจับเวลาทำงาน" (หมุนเวียนบนจอ Pomodoro) */
export const studyEncourageLines: string[] = [
  'ตั้งใจนะลูก ป้านั่งเป็นเพื่อนอยู่นี่แล้ว',
  'โฟกัสไว้ อีกนิดเดียวก็พักแล้ว สู้ ๆ!',
  'เก่งมากลูก ทำไปเรื่อย ๆ อย่าเพิ่งท้อ',
  'สมาธิดีจัง ป้าภูมิใจในตัวหนูจริง ๆ',
  'อย่าหยิบมือถือนะ เดี๋ยวหลุดโฟกัส ป้าดูอยู่ 👀',
  'ทุกนาทีที่ตั้งใจ คือความสำเร็จที่กำลังก่อตัว',
  'หายใจลึก ๆ แล้วลุยต่อ หนูทำได้อยู่แล้ว',
];

/** สุ่มกิจกรรมพักสนุก ๆ */
export const BREAK_ACTIVITIES: string[] = [
  'ลุกยืดเส้นยืดสาย',
  'ดื่มน้ำสัก 1 แก้ว',
  'มองไกล ๆ พักสายตา',
  'เดินเล่นรอบห้อง',
  'หลับตางีบสั้น ๆ',
  'ฟังเพลงโปรด 1 เพลง',
  'กินผลไม้สักชิ้น',
  'สูดอากาศริมหน้าต่าง',
];

/** เชียร์ตอนพัก (ใช้ {result} แทนกิจกรรมพัก) */
export const breakLines: PaaUanLine[] = [
  { text: 'พักหน่อยนะลูก ลอง {result} สิ เดี๋ยวสดชื่นเลย ☕', mood: 'happy' },
  { text: 'เก่งมาก! พักก่อน {result} แล้วค่อยลุยต่อจ้ะ', mood: 'happy' },
  { text: 'ป้าให้พัก! {result} ซะ อย่าฝืนสมองมากนะ', mood: 'teasing' },
  { text: 'พักสมองบ้าง {result} แล้วเดี๋ยวจำได้ดีขึ้นอีกจ้า', mood: 'happy' },
];

/** ป้าฉลองตอนหมดเวลาทำงาน */
export const timerDoneWorkLines: string[] = [
  'เก่งมากลูก! ครบเซสชันแล้ว พักหน่อยนะ ป้าภูมิใจ ❤️',
  'สู้ได้ดีมาก! สมองทำงานหนักมาแล้ว ให้รางวัลตัวเองด้วยการพักซะ',
  'เยี่ยมไปเลย! ตั้งใจแบบนี้ป้าชอบมาก พักแป๊บนึงนะ',
];

/** ป้าเรียกกลับมาโฟกัสตอนหมดเวลาพัก */
export const timerDoneBreakLines: string[] = [
  'พักพอแล้วนะลูก กลับมาลุยต่อกันเลย! ป้าเชียร์อยู่',
  'สดชื่นขึ้นแล้วใช่มั้ย? มาโฟกัสต่ออีกเซสชันกันเถอะ 💪',
  'หมดเวลาพักแล้วจ้า เอาใหม่ ตั้งใจอีกรอบนะคนเก่ง',
];
