/**
 * 🍜 คลังเมนูอาหารเริ่มต้น สำหรับเครื่องสุ่ม "กินอะไรดี"
 * ผู้ใช้เพิ่ม/ลบเองได้ และค่าที่แก้จะถูกบันทึกด้วย AsyncStorage (ดู useFoodStore)
 * อันนี้คือ "ค่าตั้งต้น" ตอนเปิดแอปครั้งแรกเท่านั้น
 * แอปไทย = เมนูไทย · แอป global = เมนูสากล (สลับด้วย t)
 */
import { t } from '@/i18n';

export const DEFAULT_FOOD_MENU: string[] = t<string[]>(
  [
    'ข้าวมันไก่',
    'ข้าวขาหมู',
    'ส้มตำไก่ย่าง',
    'ก๋วยเตี๋ยวเรือ',
    'กะเพราไข่ดาว',
    'ต้มยำกุ้ง',
    'หมูกระทะ',
    'ชาบู',
    'ผัดไทย',
    'หมูปิ้ง',
    'ไก่ทอด',
    'แกงเขียวหวาน',
    'ผัดซีอิ๊ว',
    'ราดหน้า',
    'ข้าวซอย',
    'ลาบหมู',
    'ข้าวคลุกกะปิ',
    'สุกี้',
    'โจ๊ก',
    'ข้าวหมูแดง',
  ],
  [
    'Pizza',
    'Burger & Fries',
    'Spaghetti Bolognese',
    'Sushi',
    'Tacos',
    'Fried Chicken',
    'Caesar Salad',
    'Grilled Cheese Sandwich',
    'Pad Thai',
    'Ramen',
    'Steak',
    'BBQ Ribs',
    'Burrito',
    'Mac & Cheese',
    'Fish and Chips',
    'Pancakes',
    'Club Sandwich',
    'Fried Rice',
    'Tomato Soup',
    'Hot Dog',
  ]
);

/**
 * 🧺 "คลังเมนูแนะนำ" — เมนูยอดฮิตที่ยัง "ไม่อยู่ในวงล้อ" ตอนเริ่มต้น
 * ในหน้ากินอะไรดี ผู้ใช้แตะเพื่อ "เพิ่มเข้า / เอาออก" วงล้อได้ตามใจ (สลับเข้าออกง่าย ๆ)
 */
export const SUGGESTED_FOOD_MENU: string[] = t<string[]>(
  [
    'มาม่าผัด',
    'ข้าวต้ม',
    'ข้าวผัด',
    'ข้าวผัดกุ้ง',
    'ข้าวไข่เจียว',
    'ผัดกะเพราหมูกรอบ',
    'เย็นตาโฟ',
    'บะหมี่เกี๊ยว',
    'ข้าวหน้าเป็ด',
    'ต้มเลือดหมู',
    'ผัดพริกแกงหมู',
    'ไข่กระทะ',
    'ข้าวผัดอเมริกัน',
    'สปาเกตตี้ผัดขี้เมา',
    'ข้าวหมกไก่',
    'หอยทอด',
    'ผัดมักกะโรนี',
    'ก๋วยจั๊บ',
    'ข้าวเหนียวหมูทอด',
    'ผัดผักรวม',
    'ซูชิ',
    'สเต๊ก',
    'ติ่มซำ',
    'ข้าวไก่กระเทียม',
    'ข้าวคะน้าปลาเค็ม',
    'ข้าวผัดรถไฟ',
    'กุ้งทอดครีมสลัด',
  ],
  [
    'Lasagna',
    'Pho',
    'Dumplings',
    'Korean BBQ',
    'Poke Bowl',
    'Quesadilla',
    'Chicken Wings',
    'Meatball Sub',
    'Greek Salad',
    'Curry Rice',
    'Bibimbap',
    'Falafel Wrap',
    'Clam Chowder',
    'Chicken Pot Pie',
    'Shrimp Scampi',
    'Gyros',
    'Waffles',
    'Omelette',
    'Instant Noodles',
    'Grilled Salmon',
    'Nachos',
    'Chili Con Carne',
    'Tuna Melt',
    'Pulled Pork Sandwich',
    'Avocado Toast',
    'Onion Rings',
    'Corn Dog',
  ]
);

/**
 * 📋 เมนู "เตรียมไว้" ทั้งหมด (ค่าเริ่มต้น + แนะนำ)
 * ใช้แยกว่าเมนูไหนเป็นของระบบ (เอาออกจากวงล้อแล้วกลับไปอยู่ "เมนูแนะนำ")
 * กับเมนูที่ผู้ใช้พิมพ์เอง (กด "ลบ" แล้วหายถาวร)
 */
export const PRESET_FOOD_MENU: string[] = [
  ...DEFAULT_FOOD_MENU,
  ...SUGGESTED_FOOD_MENU,
];
