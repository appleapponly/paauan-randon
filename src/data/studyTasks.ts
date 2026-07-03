/**
 * 📚 คลังภารกิจการเรียน + คำพูดป้าให้กำลังใจ (หน้า "สุ่มการเรียน" / "สุ่มเวลาพัก" / จับเวลา)
 * แอปไทย/global สลับชุดด้วย t
 */
import type { PaaUanLine } from './paaUanLines';
import { t } from '@/i18n';

export interface StudyTask {
  id: string;
  text: string;
  emoji: string;
  /** ลำดับขั้น: 1=รับข้อมูล(input) 2=ฝึก/ทำ(process) 3=สรุป(output) — ใช้เรียงลำดับโฟกัส */
  phase: 1 | 2 | 3;
  /** ถ้ามี = ภารกิจนี้สุ่มจำนวนด้วย (เช่น อ่านกี่หน้า) */
  quantity?: { unit: string; amounts: number[] };
}

export const PRESET_STUDY_TASKS: StudyTask[] = t<StudyTask[]>(
  [
    // ---- 1) รับข้อมูล ----
    { id: 'read', text: 'อ่านหนังสือ', emoji: '📖', phase: 1, quantity: { unit: 'หน้า', amounts: [5, 10, 15, 20] } },
    { id: 'vocab', text: 'ท่องศัพท์', emoji: '🔤', phase: 1, quantity: { unit: 'คำ', amounts: [10, 20, 30] } },
    { id: 'listen', text: 'ฟังภาษาอังกฤษ', emoji: '🎧', phase: 1 },
    { id: 'video', text: 'ดูคลิปติว', emoji: '📺', phase: 1 },
    // ---- 2) ฝึก/ทำ ----
    { id: 'problems', text: 'ทำโจทย์', emoji: '✏️', phase: 2, quantity: { unit: 'ข้อ', amounts: [10, 15, 20, 30] } },
    { id: 'exercise', text: 'ทำแบบฝึกหัด', emoji: '📝', phase: 2, quantity: { unit: 'ข้อ', amounts: [10, 15, 20] } },
    { id: 'exam', text: 'ทำข้อสอบเก่า', emoji: '🧾', phase: 2 },
    { id: 'reviewwrong', text: 'ทบทวนข้อที่ทำผิด', emoji: '🔍', phase: 2 },
    { id: 'sentence', text: 'แต่งประโยค', emoji: '🖊️', phase: 2, quantity: { unit: 'ประโยค', amounts: [5, 10] } },
    { id: 'teachself', text: 'อธิบายบทเรียนให้ตัวเองฟัง', emoji: '🗣️', phase: 2 },
    { id: 'readaloud', text: 'อ่านออกเสียง', emoji: '📢', phase: 2 },
    // ---- 3) สรุป ----
    { id: 'mindmap', text: 'ทำ mind map', emoji: '🗺️', phase: 3 },
    { id: 'summary', text: 'สรุปเนื้อหา', emoji: '📋', phase: 3 },
    { id: 'note', text: 'จดโน้ตย่อ', emoji: '🗒️', phase: 3 },
  ],
  [
    // ---- 1) Input ----
    { id: 'read', text: 'Read a book', emoji: '📖', phase: 1, quantity: { unit: 'pages', amounts: [5, 10, 15, 20] } },
    { id: 'vocab', text: 'Memorize vocab', emoji: '🔤', phase: 1, quantity: { unit: 'words', amounts: [10, 20, 30] } },
    { id: 'listen', text: 'Listening practice', emoji: '🎧', phase: 1 },
    { id: 'video', text: 'Watch a study video', emoji: '📺', phase: 1 },
    // ---- 2) Practice ----
    { id: 'problems', text: 'Solve problems', emoji: '✏️', phase: 2, quantity: { unit: 'problems', amounts: [10, 15, 20, 30] } },
    { id: 'exercise', text: 'Do workbook exercises', emoji: '📝', phase: 2, quantity: { unit: 'exercises', amounts: [10, 15, 20] } },
    { id: 'exam', text: 'Take a practice test', emoji: '🧾', phase: 2 },
    { id: 'reviewwrong', text: 'Review your mistakes', emoji: '🔍', phase: 2 },
    { id: 'sentence', text: 'Write sentences', emoji: '🖊️', phase: 2, quantity: { unit: 'sentences', amounts: [5, 10] } },
    { id: 'teachself', text: 'Explain the lesson to yourself', emoji: '🗣️', phase: 2 },
    { id: 'readaloud', text: 'Read out loud', emoji: '📢', phase: 2 },
    // ---- 3) Output ----
    { id: 'mindmap', text: 'Make a mind map', emoji: '🗺️', phase: 3 },
    { id: 'summary', text: 'Summarize the material', emoji: '📋', phase: 3 },
    { id: 'note', text: 'Write short notes', emoji: '🗒️', phase: 3 },
  ]
);

export const DEFAULT_STUDY_IDS = [
  'read', 'problems', 'vocab', 'exam', 'reviewwrong', 'summary', 'mindmap', 'listen',
];

/** เชียร์ตอนได้ภารกิจ (ใช้ {result} แทนภารกิจ เช่น "อ่านหนังสือ 10 หน้า") */
export const studyMissionLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ภารกิจวันนี้: {result} จ้า! ตั้งใจนะลูก ป้าเชียร์อยู่ 📣', mood: 'happy' },
    { text: '{result} เลย! สมองดีขึ้นทุกวัน อนาคตสดใสแน่นอน', mood: 'happy' },
    { text: 'ป้าจัด {result} ให้! ทำให้ครบแล้วค่อยพักนะจ๊ะ', mood: 'teasing' },
    { text: 'เอาเลย {result}! อย่าเพิ่งเล่นมือถือล่ะ ป้าเห็นนะ 😏', mood: 'sassy' },
    { text: '{result} จ้า! เก่งขึ้นอีกนิดทุกวัน เดี๋ยวก็เก่งมากเอง', mood: 'happy' },
  ],
  [
    { text: "Today's mission: {result}! Focus up, sweetie — Auntie's cheering 📣", mood: 'happy' },
    { text: '{result}! A little smarter every day — bright future ahead', mood: 'happy' },
    { text: 'Auntie assigns you {result}! Finish it all, then you can rest', mood: 'teasing' },
    { text: "Get to it — {result}! And no phone, I can see you 😏", mood: 'sassy' },
    { text: "{result}, hon! Tiny steps every day add up to brilliance", mood: 'happy' },
  ]
);

/** ข้อความให้กำลังใจ "ระหว่างจับเวลาทำงาน" (หมุนเวียนบนจอ Pomodoro) */
export const studyEncourageLines: string[] = t<string[]>(
  [
    'ตั้งใจนะลูก ป้านั่งเป็นเพื่อนอยู่นี่แล้ว',
    'โฟกัสไว้ อีกนิดเดียวก็พักแล้ว สู้ ๆ!',
    'เก่งมากลูก ทำไปเรื่อย ๆ อย่าเพิ่งท้อ',
    'สมาธิดีจัง ป้าภูมิใจในตัวหนูจริง ๆ',
    'อย่าหยิบมือถือนะ เดี๋ยวหลุดโฟกัส ป้าดูอยู่ 👀',
    'ทุกนาทีที่ตั้งใจ คือความสำเร็จที่กำลังก่อตัว',
    'หายใจลึก ๆ แล้วลุยต่อ หนูทำได้อยู่แล้ว',
  ],
  [
    "Stay focused, sweetie — Auntie's sitting right here with you",
    'Keep going — break time is almost here. You got this!',
    "You're doing great, hon. One step at a time",
    'Look at that concentration! Auntie is so proud of you',
    "Don't you dare touch that phone — Auntie's watching 👀",
    'Every focused minute is success quietly stacking up',
    'Deep breath, and back at it. You were made for this',
  ]
);

/** สุ่มกิจกรรมพักสนุก ๆ */
export const BREAK_ACTIVITIES: string[] = t<string[]>(
  [
    'ลุกยืดเส้นยืดสาย',
    'ดื่มน้ำสัก 1 แก้ว',
    'มองไกล ๆ พักสายตา',
    'เดินเล่นรอบห้อง',
    'หลับตางีบสั้น ๆ',
    'ฟังเพลงโปรด 1 เพลง',
    'กินผลไม้สักชิ้น',
    'สูดอากาศริมหน้าต่าง',
  ],
  [
    'Stand up and stretch',
    'Drink a glass of water',
    'Rest your eyes — look far away',
    'Take a little walk around',
    'Close your eyes for a mini nap',
    'Listen to one favorite song',
    'Have a piece of fruit',
    'Get some fresh air by the window',
  ]
);

/** เชียร์ตอนพัก (ใช้ {result} แทนกิจกรรมพัก) */
export const breakLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'พักหน่อยนะลูก ลอง {result} สิ เดี๋ยวสดชื่นเลย ☕', mood: 'happy' },
    { text: 'เก่งมาก! พักก่อน {result} แล้วค่อยลุยต่อจ้ะ', mood: 'happy' },
    { text: 'ป้าให้พัก! {result} ซะ อย่าฝืนสมองมากนะ', mood: 'teasing' },
    { text: 'พักสมองบ้าง {result} แล้วเดี๋ยวจำได้ดีขึ้นอีกจ้า', mood: 'happy' },
  ],
  [
    { text: 'Break time, sweetie! Try this: {result}. So refreshing ☕', mood: 'happy' },
    { text: 'Great work! Rest first — {result} — then back at it', mood: 'happy' },
    { text: "Auntie orders a break! {result} — don't overwork that brain", mood: 'teasing' },
    { text: 'Rest that mind — {result} — and everything sticks better', mood: 'happy' },
  ]
);

/** ป้าฉลองตอนหมดเวลาทำงาน */
export const timerDoneWorkLines: string[] = t<string[]>(
  [
    'เก่งมากลูก! ครบเซสชันแล้ว พักหน่อยนะ ป้าภูมิใจ ❤️',
    'สู้ได้ดีมาก! สมองทำงานหนักมาแล้ว ให้รางวัลตัวเองด้วยการพักซะ',
    'เยี่ยมไปเลย! ตั้งใจแบบนี้ป้าชอบมาก พักแป๊บนึงนะ',
  ],
  [
    "Great job, honey! Full session done — take a breather. Auntie's so proud ❤️",
    'You fought hard! Your brain earned it — reward yourself with a rest',
    'Wonderful! Auntie loves seeing you this focused. Now rest a little',
  ]
);

/** ป้าเรียกกลับมาโฟกัสตอนหมดเวลาพัก */
export const timerDoneBreakLines: string[] = t<string[]>(
  [
    'พักพอแล้วนะลูก กลับมาลุยต่อกันเลย! ป้าเชียร์อยู่',
    'สดชื่นขึ้นแล้วใช่มั้ย? มาโฟกัสต่ออีกเซสชันกันเถอะ 💪',
    'หมดเวลาพักแล้วจ้า เอาใหม่ ตั้งใจอีกรอบนะคนเก่ง',
  ],
  [
    "That's enough rest, sweetie — back to it! Auntie's cheering for you",
    'Feeling refreshed? Let\'s focus for one more session 💪',
    "Break's over, hon! One more round — you've got this, smarty",
  ]
);
