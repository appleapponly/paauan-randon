/**
 * 🥗 คลังเมนูคลีน — ใช้ในวงล้อ "สุ่มเมนูคลีน"
 * แอปไทย = เมนูไทย · แอป global = เมนูสากล (สลับด้วย t)
 */
import type { PaaUanLine } from './paaUanLines';
import { t } from '@/i18n';

export const DEFAULT_CLEAN_MENU: string[] = t<string[]>(
  [
    'สลัดอกไก่',
    'ข้าวกล้องปลานึ่ง',
    'อกไก่ย่าง',
    'ต้มจืดเต้าหู้',
    'สลัดทูน่า',
    'ไข่ต้ม',
    'โยเกิร์ตกรีก',
    'ข้าวโอ๊ต',
    'สเต๊กปลาแซลมอน',
    'ยำวุ้นเส้นไม่ใส่หมู',
    'ผัดผักรวมน้ำมันน้อย',
    'ต้มยำเห็ด',
  ],
  [
    'Grilled Chicken Salad',
    'Quinoa Bowl',
    'Baked Salmon',
    'Tofu Soup',
    'Tuna Salad',
    'Boiled Eggs',
    'Greek Yogurt Parfait',
    'Overnight Oats',
    'Steamed Fish & Brown Rice',
    'Veggie Stir-fry',
    'Smoothie Bowl',
    'Chicken & Veggie Wrap',
  ]
);

/** เมนูคลีน "เตรียมไว้" ทั้งหมด (โผล่ในคลังแนะนำ) */
export const PRESET_CLEAN_MENU: string[] = [
  ...DEFAULT_CLEAN_MENU,
  ...t<string[]>(
    [
      'สลัดควินัว',
      'เกาเหลาเนื้อ',
      'ปลาเผา',
      'อกไก่ต้ม',
      'ไข่ขาวคลุกข้าวกล้อง',
      'สมูทตี้ผัก',
      'แกงส้มผักรวม',
      'เต้าหู้ทรงเครื่อง',
    ],
    [
      'Kale Caesar Salad',
      'Turkey Lettuce Wraps',
      'Zucchini Noodles',
      'Grilled Shrimp Skewers',
      'Lentil Soup',
      'Cottage Cheese & Fruit',
      'Hummus & Veggie Sticks',
      'Poached Chicken Breast',
    ]
  ),
];

const CLEAN_EMOJI: Record<string, string> = {
  // ---- ไทย ----
  สลัดอกไก่: '🥗',
  สลัดทูน่า: '🥗',
  สลัดควินัว: '🥗',
  ข้าวกล้องปลานึ่ง: '🐟',
  ปลาเผา: '🐟',
  สเต๊กปลาแซลมอน: '🐟',
  อกไก่ย่าง: '🍗',
  อกไก่ต้ม: '🍗',
  ไข่ต้ม: '🥚',
  ไข่ขาวคลุกข้าวกล้อง: '🥚',
  ต้มจืดเต้าหู้: '🍲',
  ต้มยำเห็ด: '🍲',
  แกงส้มผักรวม: '🍲',
  เกาเหลาเนื้อ: '🍲',
  โยเกิร์ตกรีก: '🥛',
  สมูทตี้ผัก: '🥤',
  ข้าวโอ๊ต: '🥣',
  ผัดผักรวมน้ำมันน้อย: '🥦',
  เต้าหู้ทรงเครื่อง: '🥡',
  ยำวุ้นเส้นไม่ใส่หมู: '🍜',
  // ---- อังกฤษ (แอป global) ----
  'Grilled Chicken Salad': '🥗',
  'Tuna Salad': '🥗',
  'Kale Caesar Salad': '🥗',
  'Quinoa Bowl': '🍚',
  'Baked Salmon': '🐟',
  'Steamed Fish & Brown Rice': '🐟',
  'Tofu Soup': '🍲',
  'Lentil Soup': '🍲',
  'Boiled Eggs': '🥚',
  'Greek Yogurt Parfait': '🥛',
  'Overnight Oats': '🥣',
  'Veggie Stir-fry': '🥦',
  'Smoothie Bowl': '🥤',
  'Chicken & Veggie Wrap': '🌯',
  'Turkey Lettuce Wraps': '🥬',
  'Zucchini Noodles': '🥒',
  'Grilled Shrimp Skewers': '🍤',
  'Cottage Cheese & Fruit': '🍓',
  'Hummus & Veggie Sticks': '🥕',
  'Poached Chicken Breast': '🍗',
};

export function getCleanEmoji(name: string): string {
  return CLEAN_EMOJI[name] ?? '🥗';
}

/** คำพูดป้าเชียร์กินคลีน (ใช้ {result} แทนชื่อเมนู) */
export const cleanFoodLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'วันนี้ {result} จ้า! กินคลีนหุ่นดี ป้าภูมิใจ 🥗', mood: 'happy' },
    { text: 'ป้าจัด {result} ให้! อร่อยด้วย ดีต่อสุขภาพด้วยนะลูก', mood: 'happy' },
    { text: '{result} เลยจ้ะ! กินดีแบบนี้ผิวสวยหุ่นเป๊ะแน่นอน', mood: 'teasing' },
    { text: 'เอา {result} นะ! อย่าแอบไปกินของทอดล่ะ ป้าจับได้ 😏', mood: 'sassy' },
    { text: '{result} จ้า! กินคลีนวันนี้ พรุ่งนี้เบาสบายตัวเลย', mood: 'happy' },
  ],
  [
    { text: "Today it's {result}! Eating clean — Auntie's so proud 🥗", mood: 'happy' },
    { text: 'Auntie picked {result} for you! Tasty AND healthy, hon', mood: 'happy' },
    { text: "{result}, sweetie! Eat like this and you'll be glowing", mood: 'teasing' },
    { text: "Have {result} — and no sneaking fried food, I'll know 😏", mood: 'sassy' },
    { text: "{result} it is! Clean eats today, feeling light tomorrow", mood: 'happy' },
  ]
);
