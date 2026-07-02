/**
 * 🗂️ โครงสร้างหน้าหลัก: หมวด + เครื่องสุ่มทั้งหมด
 * หน้าหลัก (app/index.tsx) วนอ่านไฟล์นี้เพื่อสร้างปุ่มทั้งหมดอัตโนมัติ
 *
 * - route: เส้นทางของ Expo Router (ตรงกับชื่อไฟล์ใน app/randomizers/)
 * - ready: false = ยังไม่ได้ทำ จะโชว์ป้าย "เร็ว ๆ นี้" และกดไม่ได้
 * - ชื่อทุกอันผ่าน t(ไทย, อังกฤษ) → แอป global เห็นภาษาอังกฤษอัตโนมัติ
 * เพิ่มเครื่องสุ่มใหม่: สร้างไฟล์ใน app/randomizers/ แล้วเปลี่ยน ready เป็น true
 */
import { colors } from '@/theme/colors';
import { t } from '@/i18n';

export interface Randomizer {
  id: string;
  title: string;
  emoji: string;
  route: string;
  ready: boolean;
}

export interface Category {
  id: string;
  title: string;
  color: string;
  items: Randomizer[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'decide',
    title: t('ตัดสินใจ', 'Decide'),
    color: colors.pink,
    items: [
      { id: 'food', title: t('กินอะไรดี', 'What to Eat'), emoji: '🍜', route: '/randomizers/food-wheel', ready: true },
      { id: 'yesno', title: t('ใช่ / ไม่ใช่', 'Yes or No'), emoji: '🤷', route: '/randomizers/yes-no', ready: true },
      { id: 'dice', title: t('ลูกเต๋าตัดสินใจ', 'Decision Dice'), emoji: '🎲', route: '/randomizers/decision-dice', ready: true },
      { id: 'outfit', title: t('สุ่มแต่งตัว', 'Outfit Picker'), emoji: '👗', route: '/randomizers/outfit', ready: true },
      { id: 'travel', title: t('สุ่มที่เที่ยว', 'Travel Picker'), emoji: '🧳', route: '/randomizers/travel', ready: true },
    ],
  },
  {
    id: 'fortune',
    title: t('ดูดวง', 'Fortune'),
    color: colors.wine,
    items: [
      { id: 'horoscope', title: t('ดวงประจำวัน', 'Daily Horoscope'), emoji: '🔮', route: '/randomizers/daily-horoscope', ready: true },
      { id: 'siamsi', title: t('เซียมซี', 'Fortune Sticks'), emoji: '🥠', route: '/randomizers/siamsi', ready: true },
      { id: 'insight', title: t('ข้อคิดประจำวัน', 'Daily Wisdom'), emoji: '💡', route: '/randomizers/daily-fortune', ready: true },
    ],
  },
  {
    id: 'health',
    title: t('สุขภาพ', 'Health'),
    color: colors.orange,
    items: [
      { id: 'exercise', title: t('สุ่มออกกำลังกาย', 'Workout Roulette'), emoji: '🏃', route: '/randomizers/exercise', ready: true },
      { id: 'cleanfood', title: t('สุ่มเมนูคลีน', 'Clean Eats'), emoji: '🥗', route: '/randomizers/clean-food', ready: true },
    ],
  },
  {
    id: 'fun',
    title: t('สนุก / ปาร์ตี้', 'Party Fun'),
    color: colors.gold,
    items: [
      { id: 'whogetsit', title: t('ใครโดน', "Who's It?"), emoji: '😈', route: '/randomizers/who-gets-it', ready: true },
      { id: 'charades', title: t('ใบ้คำ', 'Charades'), emoji: '🎭', route: '/randomizers/charades', ready: true },
      { id: 'dare', title: t('สุ่มท้าทาย', 'Dare Me'), emoji: '🌶️', route: '/randomizers/dare', ready: true },
    ],
  },
  {
    id: 'group',
    title: t('กลุ่ม', 'Groups'),
    color: colors.jade,
    items: [
      { id: 'lucky', title: t('จับฉลากรายชื่อ', 'Lucky Draw'), emoji: '🎁', route: '/randomizers/lucky-draw', ready: true },
      { id: 'teams', title: t('แบ่งทีม', 'Team Split'), emoji: '👥', route: '/randomizers/teams', ready: true },
      { id: 'queue', title: t('สุ่มลำดับคิว', 'Queue Order'), emoji: '🔢', route: '/randomizers/queue', ready: true },
    ],
  },
  {
    id: 'study',
    title: t('การเรียน', 'Study'),
    color: colors.ocean,
    items: [
      { id: 'studytask', title: t('สุ่มการเรียน', 'Study Mission'), emoji: '🧠', route: '/randomizers/study', ready: true },
      { id: 'breaktime', title: t('สุ่มเวลาพัก', 'Break Time'), emoji: '☕', route: '/randomizers/break-time', ready: true },
    ],
  },
  {
    id: 'basic',
    title: t('พื้นฐาน', 'Basics'),
    color: colors.blue,
    items: [
      { id: 'number', title: t('สุ่มตัวเลข', 'Random Number'), emoji: '🔢', route: '/randomizers/number', ready: true },
      { id: 'color', title: t('สุ่มสี', 'Random Color'), emoji: '🎨', route: '/randomizers/color', ready: true },
      { id: 'customwheel', title: t('วงล้อของฉัน', 'My Wheel'), emoji: '🎡', route: '/randomizers/custom-wheel', ready: true },
    ],
  },
];
