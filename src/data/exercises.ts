/**
 * 🏃 คลังท่าออกกำลังกาย — ใช้ในหน้า "สุ่มออกกำลังกาย" (กระดานงูตกช่อง)
 *
 * แต่ละท่ามี "โหมด" (cardio/strength/hiit/custom) และ "รูปแบบจำนวน" (variants)
 * เช่น วิ่ง สุ่มได้ทั้ง "กี่กิโล" หรือ "กี่นาที" → มี 2 variants
 * ท่าที่ผู้ใช้เพิ่มเอง = โหมด custom, นับเป็น "นาที" ทั้งหมด
 * ท่าแปลก ๆ (burpee/lunge ฯลฯ) มี howto ให้ป้าอธิบายวิธีทำ
 */
import type { PaaUanLine } from './paaUanLines';

export type ExerciseMode = 'cardio' | 'strength' | 'hiit' | 'custom';
export type ExUnit = 'reps' | 'min' | 'km' | 'sec' | 'set';

export interface ExVariant {
  unit: ExUnit;
  amounts: number[];
}

export interface Exercise {
  id: string;
  name: string;
  emoji: string;
  mode: ExerciseMode;
  variants: ExVariant[];
  /** วิธีทำ (สำหรับท่าที่ไม่คุ้น) — ป้าอธิบายบนการ์ด */
  howto?: string;
}

/** ป้ายกำกับหน่วย (ต่อท้ายตัวเลขบนการ์ดภารกิจ) */
export const UNIT_LABEL: Record<ExUnit, string> = {
  reps: 'ครั้ง',
  min: 'นาที',
  km: 'กม.',
  sec: 'วินาที',
  set: 'เซ็ต',
};

/** ชื่อโหมด (ไทย) ใช้จัดกลุ่มในหน้าเลือกท่า — custom เป็นรูปดาวไม่มีชื่อ */
export const MODE_LABEL: Record<ExerciseMode, string> = {
  cardio: 'คาร์ดิโอ (Cardio)',
  strength: 'สร้างกล้าม (Strength)',
  hiit: 'HIIT',
  custom: '⭐',
};

export const MODE_ORDER: ExerciseMode[] = ['cardio', 'strength', 'hiit', 'custom'];

const reps = (amounts: number[]): ExVariant => ({ unit: 'reps', amounts });
const mins = (amounts: number[]): ExVariant => ({ unit: 'min', amounts });
const km = (amounts: number[]): ExVariant => ({ unit: 'km', amounts });
const secs = (amounts: number[]): ExVariant => ({ unit: 'sec', amounts });

export const PRESET_EXERCISES: Exercise[] = [
  // ===== Cardio =====
  { id: 'run', name: 'วิ่ง', emoji: '🏃', mode: 'cardio', variants: [km([1, 2, 3, 5]), mins([10, 15, 20, 30])] },
  { id: 'walk', name: 'เดินเร็ว', emoji: '🚶', mode: 'cardio', variants: [mins([15, 20, 30, 45]), km([1, 2, 3])] },
  { id: 'bike', name: 'ปั่นจักรยาน', emoji: '🚴', mode: 'cardio', variants: [km([3, 5, 8, 10]), mins([15, 20, 30])] },
  {
    id: 'rope', name: 'กระโดดเชือก', emoji: '🪢', mode: 'cardio', variants: [reps([50, 100, 150, 200]), mins([3, 5, 10])],
    howto: 'แกว่งเชือกด้วยข้อมือ กระโดดเบา ๆ ให้เชือกลอดใต้เท้า ลงด้วยปลายเท้า',
  },
  {
    id: 'jumpingjack', name: 'จั๊มปิ้งแจ็ค', emoji: '🤸', mode: 'cardio', variants: [reps([20, 30, 40, 50])],
    howto: 'กระโดดกางขาพร้อมยกแขนขึ้นเหนือหัว แล้วกระโดดหุบขาลดแขนลง ทำสลับเร็ว ๆ',
  },
  { id: 'stairs', name: 'ขึ้นบันได', emoji: '🪜', mode: 'cardio', variants: [mins([5, 10, 15]), reps([50, 100])] },
  { id: 'dance', name: 'เต้นออกกำลัง', emoji: '💃', mode: 'cardio', variants: [mins([10, 15, 20, 30])] },

  // ===== Strength =====
  { id: 'pushup', name: 'วิดพื้น (push up)', emoji: '💪', mode: 'strength', variants: [reps([10, 15, 20, 25, 30])] },
  { id: 'situp', name: 'ซิทอัพ (sit-up)', emoji: '🧎', mode: 'strength', variants: [reps([15, 20, 25, 30, 40])] },
  { id: 'squat', name: 'สควอต (squat)', emoji: '🦵', mode: 'strength', variants: [reps([15, 20, 25, 30, 40])],
    howto: 'ยืนแยกขากว้างเท่าไหล่ ย่อตัวลงเหมือนนั่งเก้าอี้ หลังตรง เข่าไม่เลยปลายเท้า แล้วยืนขึ้น',
  },
  {
    id: 'plank', name: 'แพลงก์ (plank)', emoji: '🏋️', mode: 'strength', variants: [secs([30, 45, 60, 90])],
    howto: 'วางศอกกับปลายเท้าลงพื้น เกร็งลำตัวให้ตรงเป็นเส้นเดียว ค้างไว้ อย่าให้เอวตก',
  },
  {
    id: 'lunge', name: 'ลันจ์ (lunge)', emoji: '🚶‍♀️', mode: 'strength', variants: [reps([10, 15, 20, 24])],
    howto: 'ก้าวขาหนึ่งไปข้างหน้า ย่อเข่าลงจนต้นขาขนานพื้น (เข่าหลังเกือบแตะพื้น) แล้วดันกลับ สลับขา',
  },
  { id: 'dumbbell', name: 'ยกดัมเบล', emoji: '🏋️‍♀️', mode: 'strength', variants: [reps([12, 15, 20]), secs([30, 45, 60])] },
  {
    id: 'pullup', name: 'ดึงข้อ (pull-up)', emoji: '🧗', mode: 'strength', variants: [reps([5, 8, 10, 12])],
    howto: 'จับราวเหนือหัว มือกว้างเท่าไหล่ ดึงตัวขึ้นจนคางพ้นราว แล้วค่อย ๆ ลดตัวลง',
  },
  { id: 'kneepushup', name: 'วิดพื้นเข่า', emoji: '🙇', mode: 'strength', variants: [reps([10, 15, 20, 25])],
    howto: 'วิดพื้นแบบใช้เข่ายันพื้นแทนปลายเท้า (เบากว่าวิดพื้นปกติ เหมาะกับมือใหม่)',
  },

  // ===== HIIT =====
  {
    id: 'burpee', name: 'เบอร์พี (burpee)', emoji: '🔥', mode: 'hiit', variants: [reps([8, 10, 15, 20])],
    howto: 'ย่อลงเอามือแตะพื้น → ถีบขาไปด้านหลังเป็นท่าวิดพื้น → เก็บขากลับ → กระโดดขึ้นสูงพร้อมยกแขน ทำต่อเนื่อง',
  },
  {
    id: 'mountain', name: 'เมาน์เทนไคลเมอร์', emoji: '⛰️', mode: 'hiit', variants: [reps([20, 30, 40]), secs([30, 45, 60])],
    howto: 'อยู่ท่าวิดพื้นแขนตรง แล้วสลับดึงเข่าเข้าหาอกทีละข้างเร็ว ๆ เหมือนวิ่งอยู่กับที่',
  },
  {
    id: 'highknees', name: 'ยกเข่าสูง (high knees)', emoji: '🦿', mode: 'hiit', variants: [secs([30, 45, 60]), reps([30, 40, 50])],
    howto: 'วิ่งอยู่กับที่ ยกเข่าขึ้นสูงระดับเอวสลับซ้าย-ขวาเร็ว ๆ แกว่งแขนช่วย',
  },
  {
    id: 'jumpsquat', name: 'จั๊มพ์สควอต', emoji: '⚡', mode: 'hiit', variants: [reps([10, 15, 20, 25])],
    howto: 'ย่อสควอตลง แล้วกระโดดขึ้นให้สุดแรง ลงมาย่อรับแรงแล้วกระโดดต่อ',
  },
  {
    id: 'skater', name: 'สเก็ตเตอร์', emoji: '⛸️', mode: 'hiit', variants: [reps([20, 30, 40]), secs([30, 45])],
    howto: 'กระโดดไปด้านข้างลงด้วยขาเดียว เอาอีกขาไขว้ไปด้านหลัง สลับซ้าย-ขวาเหมือนสเก็ตน้ำแข็ง',
  },
  {
    id: 'plankjack', name: 'แพลงก์แจ็ค', emoji: '🤾', mode: 'hiit', variants: [reps([15, 20, 30]), secs([30, 45])],
    howto: 'อยู่ท่าแพลงก์ แล้วกระโดดกาง-หุบขาสลับไปมา (เหมือนจั๊มปิ้งแจ็คแต่อยู่ท่าแพลงก์)',
  },
];

/** ท่าที่เลือกไว้ตั้งต้น (คละโหมด) — ที่เหลือย้ายเข้าได้จากหน้าเลือกท่า */
export const DEFAULT_SELECTED_IDS = [
  'run', 'walk', 'jumpingjack', 'pushup', 'squat', 'plank', 'burpee', 'highknees',
];

/**
 * คำเชียร์ป้า แยกตามโหมด (ใช้ {result} แทนภารกิจ เช่น "push up 20 ครั้ง")
 */
export const exerciseLinesByMode: Record<ExerciseMode, PaaUanLine[]> = {
  cardio: [
    { text: 'จัดไป {result} เลยลูก! เผาผลาญให้เหงื่อชุ่มไปเลย 💦', mood: 'happy' },
    { text: '{result} จ้า! หัวใจเต้นแรง ๆ สุขภาพดีขึ้นแน่นอน', mood: 'happy' },
  ],
  strength: [
    { text: '{result}! กล้ามขึ้นแน่นอนลูก สู้ ๆ 💪', mood: 'happy' },
    { text: 'ป้าท้า {result} เลย! เกร็งไว้ อย่าโกงจำนวนนะ 😏', mood: 'teasing' },
  ],
  hiit: [
    { text: 'โหดหน่อย {result}! แต่ป้าเชื่อว่าหนูทำได้ 🔥', mood: 'happy' },
    { text: '{result} จ้า! ระเบิดพลังให้สุด อย่ายอมแพ้นะ', mood: 'sassy' },
  ],
  custom: [
    { text: '{result} จ้า! ท่าที่หนูเลือกเอง ตั้งใจทำนะลูก', mood: 'happy' },
    { text: 'ป้าจัด {result} ให้! ออกแรงหน่อย เดี๋ยวแข็งแรงเอง', mood: 'happy' },
  ],
};

/** คำเชียร์ตอนได้ครบชุด (3 ท่า) — ไม่มี {result} */
export const exerciseComboLines: PaaUanLine[] = [
  { text: 'ชุดนี้จัดเต็มเลยลูก! ทำให้ครบทั้ง 3 ท่านะ ป้าเชียร์อยู่ 📣', mood: 'happy' },
  { text: 'ได้ 3 ท่าแล้วจ้า! ค่อย ๆ ทำทีละท่า อย่าลืมวอร์มก่อนนะ', mood: 'happy' },
  { text: 'โปรแกรมวันนี้มาแล้ว! เหนื่อยหน่อยแต่หุ่นดีแน่ สู้ ๆ ลูก 💪', mood: 'teasing' },
  { text: 'ป้าจัดโปรแกรมให้แล้ว! ทำครบ 3 ท่ารับรองฟิตขึ้นเยอะ', mood: 'sassy' },
];
