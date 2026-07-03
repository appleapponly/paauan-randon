/**
 * 🎭 คลังคำสำหรับเกม "ใบ้คำ"
 * เพิ่มคำใหม่ได้โดยเติมข้อความเข้าอาเรย์ (แอปไทย/global สลับชุดด้วย t)
 */
import { t } from '@/i18n';

export const CHARADES_WORDS: string[] = t<string[]>(
  [
    'ช้าง', 'รถเมล์', 'ส้มตำ', 'ตู้เย็น', 'นักร้อง',
    'ผีเสื้อ', 'ตำรวจ', 'ลิฟต์', 'ทุเรียน', 'พระอาทิตย์',
    'จระเข้', 'แปรงสีฟัน', 'นักฟุตบอล', 'รุ้งกินน้ำ', 'หมอนวด',
    'กระเป๋า', 'ยุง', 'เครื่องบิน', 'ตุ๊กตา', 'ไดโนเสาร์',
    'แม่ค้า', 'พัดลม', 'จักรยาน', 'หิมะ', 'ผีโขมด',
    'ครูสอนเต้น', 'ปลาหมึก', 'ร่ม', 'นาฬิกาปลุก', 'ภูเขาไฟ',
    'คนตกปลา', 'กบ', 'โทรศัพท์', 'ซูเปอร์ฮีโร่', 'มดงาน',
    'แมวเหมียว', 'รถไฟ', 'ก๋วยเตี๋ยว', 'หุ่นยนต์', 'ดารา',
  ],
  [
    'Elephant', 'School Bus', 'Pizza', 'Refrigerator', 'Singer',
    'Butterfly', 'Police Officer', 'Elevator', 'Pineapple', 'The Sun',
    'Crocodile', 'Toothbrush', 'Soccer Player', 'Rainbow', 'Massage Therapist',
    'Backpack', 'Mosquito', 'Airplane', 'Teddy Bear', 'Dinosaur',
    'Cashier', 'Electric Fan', 'Bicycle', 'Snowman', 'Ghost',
    'Dance Teacher', 'Octopus', 'Umbrella', 'Alarm Clock', 'Volcano',
    'Fisherman', 'Frog', 'Telephone', 'Superhero', 'Ant',
    'Cat', 'Train', 'Spaghetti', 'Robot', 'Movie Star',
  ]
);
