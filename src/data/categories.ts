/**
 * 🗂️ โครงสร้างหน้าหลัก: 4 หมวด + เครื่องสุ่มทั้งหมด
 * หน้าหลัก (app/index.tsx) วนอ่านไฟล์นี้เพื่อสร้างปุ่มทั้งหมดอัตโนมัติ
 *
 * - route: เส้นทางของ Expo Router (ตรงกับชื่อไฟล์ใน app/randomizers/)
 * - ready: false = ยังไม่ได้ทำ จะโชว์ป้าย "เร็ว ๆ นี้" และกดไม่ได้
 * เพิ่มเครื่องสุ่มใหม่: สร้างไฟล์ใน app/randomizers/ แล้วเปลี่ยน ready เป็น true
 */
import { colors } from '@/theme/colors';

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
    title: 'ตัดสินใจ',
    color: colors.pink,
    items: [
      { id: 'food', title: 'กินอะไรดี', emoji: '🍜', route: '/randomizers/food-wheel', ready: true },
      { id: 'yesno', title: 'ใช่ / ไม่ใช่', emoji: '🤷', route: '/randomizers/yes-no', ready: true },
      { id: 'coin', title: 'หัว / ก้อย', emoji: '🪙', route: '/randomizers/coin', ready: true },
      { id: 'dice', title: 'ลูกเต๋าตัดสินใจ', emoji: '🎲', route: '/randomizers/decision-dice', ready: true },
      { id: 'outfit', title: 'สุ่มแต่งตัว', emoji: '👗', route: '/randomizers/outfit', ready: true },
      { id: 'travel', title: 'สุ่มที่เที่ยว', emoji: '🧳', route: '/randomizers/travel', ready: true },
    ],
  },
  {
    id: 'fortune',
    title: 'ดูดวง',
    color: colors.wine,
    items: [
      { id: 'horoscope', title: 'ดวงประจำวัน', emoji: '🔮', route: '/randomizers/daily-horoscope', ready: true },
      { id: 'siamsi', title: 'เซียมซี', emoji: '🥠', route: '/randomizers/siamsi', ready: true },
      { id: 'insight', title: 'ข้อคิดประจำวัน', emoji: '💡', route: '/randomizers/daily-fortune', ready: true },
    ],
  },
  {
    id: 'fun',
    title: 'สนุก / ปาร์ตี้',
    color: colors.gold,
    items: [
      { id: 'whogetsit', title: 'ใครโดน', emoji: '😈', route: '/randomizers/who-gets-it', ready: true },
      { id: 'charades', title: 'ใบ้คำ', emoji: '🎭', route: '/randomizers/charades', ready: true },
      { id: 'dare', title: 'สุ่มท้าทาย', emoji: '🌶️', route: '/randomizers/dare', ready: true },
    ],
  },
  {
    id: 'group',
    title: 'กลุ่ม',
    color: colors.jade,
    items: [
      { id: 'lucky', title: 'จับฉลากรายชื่อ', emoji: '🎁', route: '/randomizers/lucky-draw', ready: true },
      { id: 'teams', title: 'แบ่งทีม', emoji: '👥', route: '/randomizers/teams', ready: true },
      { id: 'queue', title: 'สุ่มลำดับคิว', emoji: '🔢', route: '/randomizers/queue', ready: true },
    ],
  },
  {
    id: 'basic',
    title: 'พื้นฐาน',
    color: colors.blue,
    items: [
      { id: 'number', title: 'สุ่มตัวเลข', emoji: '🔢', route: '/randomizers/number', ready: true },
      { id: 'color', title: 'สุ่มสี', emoji: '🎨', route: '/randomizers/color', ready: true },
    ],
  },
];
