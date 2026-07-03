/**
 * 🏃 คลังท่าออกกำลังกาย — ใช้ในหน้า "สุ่มออกกำลังกาย" (กระดานงูตกช่อง)
 *
 * แต่ละท่ามี "โหมด" (cardio/strength/hiit/custom) และ "รูปแบบจำนวน" (variants)
 * เช่น วิ่ง สุ่มได้ทั้ง "กี่กิโล" หรือ "กี่นาที" → มี 2 variants
 * ท่าที่ผู้ใช้เพิ่มเอง = โหมด custom, นับเป็น "นาที" ทั้งหมด
 * ท่าแปลก ๆ (burpee/lunge ฯลฯ) มี howto ให้ป้าอธิบายวิธีทำ
 * แอปไทย/global สลับชุดด้วย t
 */
import type { PaaUanLine } from './paaUanLines';
import { t } from '@/i18n';

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
export const UNIT_LABEL: Record<ExUnit, string> = t<Record<ExUnit, string>>(
  {
    reps: 'ครั้ง',
    min: 'นาที',
    km: 'กม.',
    sec: 'วินาที',
    set: 'เซ็ต',
  },
  {
    reps: 'reps',
    min: 'min',
    km: 'km',
    sec: 'sec',
    set: 'sets',
  }
);

/** ชื่อโหมด ใช้จัดกลุ่มในหน้าเลือกท่า — custom เป็นรูปดาวไม่มีชื่อ */
export const MODE_LABEL: Record<ExerciseMode, string> = t<Record<ExerciseMode, string>>(
  {
    cardio: 'คาร์ดิโอ (Cardio)',
    strength: 'สร้างกล้าม (Strength)',
    hiit: 'HIIT',
    custom: '⭐',
  },
  {
    cardio: 'Cardio',
    strength: 'Strength',
    hiit: 'HIIT',
    custom: '⭐',
  }
);

export const MODE_ORDER: ExerciseMode[] = ['cardio', 'strength', 'hiit', 'custom'];

const reps = (amounts: number[]): ExVariant => ({ unit: 'reps', amounts });
const mins = (amounts: number[]): ExVariant => ({ unit: 'min', amounts });
const km = (amounts: number[]): ExVariant => ({ unit: 'km', amounts });
const secs = (amounts: number[]): ExVariant => ({ unit: 'sec', amounts });

const PRESET_TH: Exercise[] = [
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
  {
    id: 'squat', name: 'สควอต (squat)', emoji: '🦵', mode: 'strength', variants: [reps([15, 20, 25, 30, 40])],
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
  {
    id: 'kneepushup', name: 'วิดพื้นเข่า', emoji: '🙇', mode: 'strength', variants: [reps([10, 15, 20, 25])],
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

const PRESET_EN: Exercise[] = [
  // ===== Cardio =====
  { id: 'run', name: 'Running', emoji: '🏃', mode: 'cardio', variants: [km([1, 2, 3, 5]), mins([10, 15, 20, 30])] },
  { id: 'walk', name: 'Brisk Walk', emoji: '🚶', mode: 'cardio', variants: [mins([15, 20, 30, 45]), km([1, 2, 3])] },
  { id: 'bike', name: 'Cycling', emoji: '🚴', mode: 'cardio', variants: [km([3, 5, 8, 10]), mins([15, 20, 30])] },
  {
    id: 'rope', name: 'Jump Rope', emoji: '🪢', mode: 'cardio', variants: [reps([50, 100, 150, 200]), mins([3, 5, 10])],
    howto: 'Swing the rope with your wrists, hop lightly as it passes under, land on the balls of your feet',
  },
  {
    id: 'jumpingjack', name: 'Jumping Jacks', emoji: '🤸', mode: 'cardio', variants: [reps([20, 30, 40, 50])],
    howto: 'Jump feet apart while raising arms overhead, then jump back together — repeat quickly',
  },
  { id: 'stairs', name: 'Stair Climbing', emoji: '🪜', mode: 'cardio', variants: [mins([5, 10, 15]), reps([50, 100])] },
  { id: 'dance', name: 'Dance Workout', emoji: '💃', mode: 'cardio', variants: [mins([10, 15, 20, 30])] },

  // ===== Strength =====
  { id: 'pushup', name: 'Push-ups', emoji: '💪', mode: 'strength', variants: [reps([10, 15, 20, 25, 30])] },
  { id: 'situp', name: 'Sit-ups', emoji: '🧎', mode: 'strength', variants: [reps([15, 20, 25, 30, 40])] },
  {
    id: 'squat', name: 'Squats', emoji: '🦵', mode: 'strength', variants: [reps([15, 20, 25, 30, 40])],
    howto: 'Feet shoulder-width apart, sit back like into a chair, back straight, knees behind toes, stand back up',
  },
  {
    id: 'plank', name: 'Plank', emoji: '🏋️', mode: 'strength', variants: [secs([30, 45, 60, 90])],
    howto: 'Forearms and toes on the floor, body in one straight line — hold it, don\'t let the hips sag',
  },
  {
    id: 'lunge', name: 'Lunges', emoji: '🚶‍♀️', mode: 'strength', variants: [reps([10, 15, 20, 24])],
    howto: 'Step one leg forward, lower until the front thigh is parallel (back knee almost touching), push back, switch legs',
  },
  { id: 'dumbbell', name: 'Dumbbell Lifts', emoji: '🏋️‍♀️', mode: 'strength', variants: [reps([12, 15, 20]), secs([30, 45, 60])] },
  {
    id: 'pullup', name: 'Pull-ups', emoji: '🧗', mode: 'strength', variants: [reps([5, 8, 10, 12])],
    howto: 'Grip the bar shoulder-width, pull up until your chin clears the bar, lower slowly',
  },
  {
    id: 'kneepushup', name: 'Knee Push-ups', emoji: '🙇', mode: 'strength', variants: [reps([10, 15, 20, 25])],
    howto: 'Push-ups with knees on the floor instead of toes — easier, great for beginners',
  },

  // ===== HIIT =====
  {
    id: 'burpee', name: 'Burpees', emoji: '🔥', mode: 'hiit', variants: [reps([8, 10, 15, 20])],
    howto: 'Squat down, hands on floor → kick legs back to push-up position → hop feet back in → jump up with arms high. Repeat',
  },
  {
    id: 'mountain', name: 'Mountain Climbers', emoji: '⛰️', mode: 'hiit', variants: [reps([20, 30, 40]), secs([30, 45, 60])],
    howto: 'In a straight-arm plank, drive your knees toward your chest one at a time, fast — like running in place',
  },
  {
    id: 'highknees', name: 'High Knees', emoji: '🦿', mode: 'hiit', variants: [secs([30, 45, 60]), reps([30, 40, 50])],
    howto: 'Run in place lifting your knees to hip height, alternating fast, pumping your arms',
  },
  {
    id: 'jumpsquat', name: 'Jump Squats', emoji: '⚡', mode: 'hiit', variants: [reps([10, 15, 20, 25])],
    howto: 'Lower into a squat, then explode upward into a jump, land softly into the next squat',
  },
  {
    id: 'skater', name: 'Skaters', emoji: '⛸️', mode: 'hiit', variants: [reps([20, 30, 40]), secs([30, 45])],
    howto: 'Leap sideways landing on one leg, sweep the other leg behind — alternate like an ice skater',
  },
  {
    id: 'plankjack', name: 'Plank Jacks', emoji: '🤾', mode: 'hiit', variants: [reps([15, 20, 30]), secs([30, 45])],
    howto: 'Hold a plank and hop your feet apart and together — like jumping jacks in plank position',
  },
];

export const PRESET_EXERCISES: Exercise[] = t(PRESET_TH, PRESET_EN);

/** ท่าที่เลือกไว้ตั้งต้น (คละโหมด) — ที่เหลือย้ายเข้าได้จากหน้าเลือกท่า */
export const DEFAULT_SELECTED_IDS = [
  'run', 'walk', 'jumpingjack', 'pushup', 'squat', 'plank', 'burpee', 'highknees',
];

/**
 * คำเชียร์ป้า แยกตามโหมด (ใช้ {result} แทนภารกิจ เช่น "push up 20 ครั้ง")
 */
export const exerciseLinesByMode: Record<ExerciseMode, PaaUanLine[]> = t<
  Record<ExerciseMode, PaaUanLine[]>
>(
  {
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
  },
  {
    cardio: [
      { text: 'Get moving — {result}! Work up a good sweat 💦', mood: 'happy' },
      { text: '{result}, sweetie! Get that heart pumping strong', mood: 'happy' },
    ],
    strength: [
      { text: "{result}! Those muscles are coming, hon 💪", mood: 'happy' },
      { text: "Auntie challenges you: {result}! And no skipping reps 😏", mood: 'teasing' },
    ],
    hiit: [
      { text: "Tough one — {result}! But Auntie believes in you 🔥", mood: 'happy' },
      { text: '{result}! Give it everything — no giving up!', mood: 'sassy' },
    ],
    custom: [
      { text: "{result}, sweetie! Your own pick — give it your best", mood: 'happy' },
      { text: "Auntie assigns {result}! Put in the work, get strong", mood: 'happy' },
    ],
  }
);

/** คำเชียร์ตอนได้ครบชุด (3 ท่า) — ไม่มี {result} */
export const exerciseComboLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ชุดนี้จัดเต็มเลยลูก! ทำให้ครบทั้ง 3 ท่านะ ป้าเชียร์อยู่ 📣', mood: 'happy' },
    { text: 'ได้ 3 ท่าแล้วจ้า! ค่อย ๆ ทำทีละท่า อย่าลืมวอร์มก่อนนะ', mood: 'happy' },
    { text: 'โปรแกรมวันนี้มาแล้ว! เหนื่อยหน่อยแต่หุ่นดีแน่ สู้ ๆ ลูก 💪', mood: 'teasing' },
    { text: 'ป้าจัดโปรแกรมให้แล้ว! ทำครบ 3 ท่ารับรองฟิตขึ้นเยอะ', mood: 'sassy' },
  ],
  [
    { text: "Today's set is loaded! Do all 3 moves — Auntie's cheering 📣", mood: 'happy' },
    { text: "Three moves for you! Take them one at a time, and warm up first", mood: 'happy' },
    { text: "Your program is here! It'll burn, but you'll look amazing 💪", mood: 'teasing' },
    { text: 'Auntie made your program! Finish all 3 and feel the difference', mood: 'sassy' },
  ]
);
