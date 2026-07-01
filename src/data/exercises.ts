/**
 * 🏃 คลังท่าออกกำลังกาย — ใช้ในหน้า "สุ่มออกกำลังกาย" (กระดานงูตกช่อง)
 *
 * แต่ละท่ามี "โหมด" (cardio/strength/hiit) และ "รูปแบบจำนวน" (variants)
 * เช่น วิ่ง สุ่มได้ทั้ง "กี่กิโล" หรือ "กี่นาที" → มี 2 variants
 * ตอนสุ่ม: เลือกท่า → เลือก variant → เลือกจำนวนจาก amounts
 */
import type { PaaUanLine } from './paaUanLines';

export type ExerciseMode = 'cardio' | 'strength' | 'hiit';
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
}

/** ป้ายกำกับหน่วย (ต่อท้ายตัวเลขบนการ์ดภารกิจ) */
export const UNIT_LABEL: Record<ExUnit, string> = {
  reps: 'ครั้ง',
  min: 'นาที',
  km: 'กม.',
  sec: 'วินาที',
  set: 'เซ็ต',
};

/** ชื่อโหมด (ไทย) ใช้จัดกลุ่มในหน้าเลือกท่า */
export const MODE_LABEL: Record<ExerciseMode, string> = {
  cardio: 'คาร์ดิโอ (Cardio)',
  strength: 'สร้างกล้าม (Strength)',
  hiit: 'HIIT',
};

export const MODE_ORDER: ExerciseMode[] = ['cardio', 'strength', 'hiit'];

const reps = (amounts: number[]): ExVariant => ({ unit: 'reps', amounts });
const mins = (amounts: number[]): ExVariant => ({ unit: 'min', amounts });
const km = (amounts: number[]): ExVariant => ({ unit: 'km', amounts });
const secs = (amounts: number[]): ExVariant => ({ unit: 'sec', amounts });

export const PRESET_EXERCISES: Exercise[] = [
  // ===== Cardio =====
  { id: 'run', name: 'วิ่ง', emoji: '🏃', mode: 'cardio', variants: [km([1, 2, 3, 5]), mins([10, 15, 20, 30])] },
  { id: 'walk', name: 'เดินเร็ว', emoji: '🚶', mode: 'cardio', variants: [mins([15, 20, 30, 45]), km([1, 2, 3])] },
  { id: 'bike', name: 'ปั่นจักรยาน', emoji: '🚴', mode: 'cardio', variants: [km([3, 5, 8, 10]), mins([15, 20, 30])] },
  { id: 'rope', name: 'กระโดดเชือก', emoji: '🪢', mode: 'cardio', variants: [reps([50, 100, 150, 200]), mins([3, 5, 10])] },
  { id: 'jumpingjack', name: 'จั๊มปิ้งแจ็ค', emoji: '🤸', mode: 'cardio', variants: [reps([20, 30, 40, 50])] },
  { id: 'stairs', name: 'ขึ้นบันได', emoji: '🪜', mode: 'cardio', variants: [mins([5, 10, 15]), reps([50, 100])] },
  { id: 'dance', name: 'เต้นออกกำลัง', emoji: '💃', mode: 'cardio', variants: [mins([10, 15, 20, 30])] },

  // ===== Strength =====
  { id: 'pushup', name: 'วิดพื้น (push up)', emoji: '💪', mode: 'strength', variants: [reps([10, 15, 20, 25, 30])] },
  { id: 'situp', name: 'ซิทอัพ (sit-up)', emoji: '🧎', mode: 'strength', variants: [reps([15, 20, 25, 30, 40])] },
  { id: 'squat', name: 'สควอต (squat)', emoji: '🦵', mode: 'strength', variants: [reps([15, 20, 25, 30, 40])] },
  { id: 'plank', name: 'แพลงก์ (plank)', emoji: '🏋️', mode: 'strength', variants: [secs([30, 45, 60, 90])] },
  { id: 'lunge', name: 'ลันจ์ (lunge)', emoji: '🚶‍♀️', mode: 'strength', variants: [reps([10, 15, 20, 24])] },
  { id: 'dumbbell', name: 'ยกดัมเบล', emoji: '🏋️‍♀️', mode: 'strength', variants: [reps([12, 15, 20]), secs([30, 45, 60])] },
  { id: 'pullup', name: 'ดึงข้อ (pull-up)', emoji: '🧗', mode: 'strength', variants: [reps([5, 8, 10, 12])] },
  { id: 'kneepushup', name: 'วิดพื้นเข่า', emoji: '🙇', mode: 'strength', variants: [reps([10, 15, 20, 25])] },

  // ===== HIIT =====
  { id: 'burpee', name: 'เบอร์พี (burpee)', emoji: '🔥', mode: 'hiit', variants: [reps([8, 10, 15, 20])] },
  { id: 'mountain', name: 'เมาน์เทนไคลเมอร์', emoji: '⛰️', mode: 'hiit', variants: [reps([20, 30, 40]), secs([30, 45, 60])] },
  { id: 'highknees', name: 'ยกเข่าสูง (high knees)', emoji: '🦿', mode: 'hiit', variants: [secs([30, 45, 60]), reps([30, 40, 50])] },
  { id: 'jumpsquat', name: 'จั๊มพ์สควอต', emoji: '⚡', mode: 'hiit', variants: [reps([10, 15, 20, 25])] },
  { id: 'skater', name: 'สเก็ตเตอร์', emoji: '⛸️', mode: 'hiit', variants: [reps([20, 30, 40]), secs([30, 45])] },
  { id: 'plankjack', name: 'แพลงก์แจ็ค', emoji: '🤾', mode: 'hiit', variants: [reps([15, 20, 30]), secs([30, 45])] },
];

/** ท่าที่เลือกไว้ตั้งต้น (คละโหมด) — ที่เหลือย้ายเข้าได้จากหน้าเลือกท่า */
export const DEFAULT_SELECTED_IDS = [
  'run', 'walk', 'jumpingjack', 'pushup', 'squat', 'plank', 'burpee', 'highknees',
];

/**
 * คำเชียร์ป้า แยกตามโหมด (ใช้ {result} แทนภารกิจ เช่น "push up 20 ครั้ง")
 * ป้าให้กำลังใจสนุก ๆ ต่างสไตล์ตามชนิดการออกกำลัง
 */
export const exerciseLinesByMode: Record<ExerciseMode, PaaUanLine[]> = {
  cardio: [
    { text: 'จัดไป {result} เลยลูก! เผาผลาญให้เหงื่อชุ่มไปเลย 💦', mood: 'happy' },
    { text: '{result} จ้า! หัวใจเต้นแรง ๆ สุขภาพดีขึ้นแน่นอน', mood: 'happy' },
    { text: 'ป้าสั่ง {result} นะ! วิ่งไปยิ้มไป เดี๋ยวหุ่นดีเชียว', mood: 'teasing' },
    { text: 'เอาเลย {result}! อย่าเพิ่งหอบล่ะ ป้าเชียร์อยู่นี่ 📣', mood: 'sassy' },
  ],
  strength: [
    { text: '{result}! กล้ามขึ้นแน่นอนลูก สู้ ๆ 💪', mood: 'happy' },
    { text: 'ป้าท้า {result} เลย! เกร็งไว้ อย่าโกงจำนวนนะ 😏', mood: 'teasing' },
    { text: 'จัด {result} ให้ครบ! แข็งแรงขึ้นทุกวันจ้ะ', mood: 'happy' },
    { text: '{result} นะลูก! เจ็บวันนี้ สวยหล่อวันหน้า', mood: 'sassy' },
  ],
  hiit: [
    { text: 'โหดหน่อย {result}! แต่ป้าเชื่อว่าหนูทำได้ 🔥', mood: 'happy' },
    { text: '{result} จ้า! เต็มที่ไปเลย พักทีหลังได้', mood: 'teasing' },
    { text: 'ป้าสั่ง {result}! ระเบิดพลังให้สุด อย่ายอมแพ้นะ', mood: 'sassy' },
    { text: 'เอาให้สุด {result}! เหนื่อยแค่ไหนก็คุ้ม หุ่นเป๊ะแน่', mood: 'happy' },
  ],
};
