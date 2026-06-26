/**
 * 👗 สุ่มการแต่งตัว — คลังเสื้อผ้า/เครื่องประดับ แยกชาย-หญิง
 * เลือกเพศแล้วกดสุ่ม จะได้ เสื้อ + ท่อนล่าง(กางเกง/กระโปรง) + รองเท้า + เครื่องประดับ อย่างละ 1
 *
 * เพิ่มไอเท็มใหม่: เติมเข้าไปในอาเรย์ของเพศ/หมวดที่ต้องการได้เลย
 */
export interface OutfitOption {
  emoji: string;
  name: string;
}

export type Gender = 'male' | 'female';

export interface OutfitSet {
  top: OutfitOption[];
  bottom: OutfitOption[];
  shoes: OutfitOption[];
  accessory: OutfitOption[];
}

/** ช่อง (หมวด) ที่จะสุ่ม + ป้ายกำกับบนหน้าจอ */
export const OUTFIT_SLOTS: { key: keyof OutfitSet; label: string; emoji: string }[] = [
  { key: 'top', label: 'เสื้อ', emoji: '👕' },
  { key: 'bottom', label: 'ท่อนล่าง', emoji: '👖' },
  { key: 'shoes', label: 'รองเท้า', emoji: '👟' },
  { key: 'accessory', label: 'เครื่องประดับ', emoji: '🕶️' },
];

export const OUTFITS: Record<Gender, OutfitSet> = {
  male: {
    top: [
      { emoji: '👕', name: 'เสื้อยืดสีขาว' },
      { emoji: '👔', name: 'เสื้อเชิ้ตลายสก็อต' },
      { emoji: '👕', name: 'เสื้อโปโล' },
      { emoji: '🌺', name: 'เสื้อฮาวายลายดอก' },
      { emoji: '🧥', name: 'เสื้อฮู้ดสีเทา' },
      { emoji: '🧶', name: 'เสื้อสเวตเตอร์ถัก' },
      { emoji: '👕', name: 'เสื้อกล้ามสีดำ' },
      { emoji: '👔', name: 'เสื้อเชิ้ตยีนส์' },
      { emoji: '⚽', name: 'เสื้อทีมฟุตบอล' },
      { emoji: '👕', name: 'เสื้อยืดโอเวอร์ไซส์' },
    ],
    bottom: [
      { emoji: '👖', name: 'กางเกงยีนส์' },
      { emoji: '🩳', name: 'กางเกงขาสั้น' },
      { emoji: '👖', name: 'กางเกงสแล็คสีดำ' },
      { emoji: '🩳', name: 'กางเกงวอร์ม' },
      { emoji: '👖', name: 'กางเกงคาร์โก้' },
      { emoji: '🩳', name: 'กางเกงขาสั้นลายดอก' },
      { emoji: '👖', name: 'กางเกงชิโน่สีกากี' },
      { emoji: '👖', name: 'กางเกงยีนส์ขาด' },
    ],
    shoes: [
      { emoji: '👟', name: 'รองเท้าผ้าใบ' },
      { emoji: '👞', name: 'รองเท้าหนังสีน้ำตาล' },
      { emoji: '🩴', name: 'รองเท้าแตะ' },
      { emoji: '🥾', name: 'รองเท้าบูทหนัง' },
      { emoji: '👟', name: 'รองเท้าวิ่ง' },
      { emoji: '👟', name: 'รองเท้าสเก็ต' },
      { emoji: '👞', name: 'รองเท้าหนังกลับ' },
    ],
    accessory: [
      { emoji: '🕶️', name: 'แว่นกันแดด' },
      { emoji: '🧢', name: 'หมวกแก๊ป' },
      { emoji: '⌚', name: 'นาฬิกาข้อมือ' },
      { emoji: '📿', name: 'สร้อยคอ' },
      { emoji: '👒', name: 'หมวกบักเก็ต' },
      { emoji: '🎒', name: 'เป้สะพายหลัง' },
      { emoji: '💍', name: 'แหวนเท่ ๆ' },
      { emoji: '🙅', name: 'ไม่ใส่เครื่องประดับ' },
    ],
  },
  female: {
    top: [
      { emoji: '👚', name: 'เสื้อยืดครอป' },
      { emoji: '👚', name: 'เสื้อเชิ้ตสีพาสเทล' },
      { emoji: '🌸', name: 'เบลาส์ลายดอก' },
      { emoji: '👚', name: 'เสื้อแขนตุ๊กตา' },
      { emoji: '🧶', name: 'เสื้อสเวตเตอร์ถัก' },
      { emoji: '👕', name: 'เสื้อยืดโอเวอร์ไซส์' },
      { emoji: '👚', name: 'เสื้อสายเดี่ยว' },
      { emoji: '🧥', name: 'เสื้อคาร์ดิแกน' },
      { emoji: '👔', name: 'เสื้อเชิ้ตยีนส์' },
      { emoji: '👚', name: 'เสื้อกล้ามซีทรู' },
    ],
    bottom: [
      { emoji: '👗', name: 'กระโปรงบาน' },
      { emoji: '👖', name: 'กระโปรงยีนส์' },
      { emoji: '👖', name: 'กางเกงยีนส์' },
      { emoji: '👗', name: 'กระโปรงพลีท' },
      { emoji: '👖', name: 'กางเกงขาบาน' },
      { emoji: '🌼', name: 'กระโปรงยาวลายดอก' },
      { emoji: '🩳', name: 'กางเกงขาสั้น' },
      { emoji: '🩱', name: 'เลกกิ้งรัดรูป' },
      { emoji: '👗', name: 'กระโปรงทรงเอ' },
      { emoji: '👖', name: 'กางเกงสแล็คสีครีม' },
    ],
    shoes: [
      { emoji: '👟', name: 'รองเท้าผ้าใบ' },
      { emoji: '👠', name: 'รองเท้าส้นสูง' },
      { emoji: '🩴', name: 'รองเท้าแตะหนีบ' },
      { emoji: '🥿', name: 'รองเท้าบัลเลต์' },
      { emoji: '🥾', name: 'รองเท้าบูทยาว' },
      { emoji: '👠', name: 'รองเท้าส้นเตารีด' },
      { emoji: '🩴', name: 'รองเท้าแตะแบบสวม' },
      { emoji: '👟', name: 'สนีกเกอร์สีพาสเทล' },
    ],
    accessory: [
      { emoji: '🕶️', name: 'แว่นกันแดด' },
      { emoji: '👒', name: 'หมวกปีกกว้าง' },
      { emoji: '💎', name: 'ต่างหูระย้า' },
      { emoji: '📿', name: 'สร้อยคอเส้นเล็ก' },
      { emoji: '👜', name: 'กระเป๋าสะพาย' },
      { emoji: '🎀', name: 'ผ้าคาดผม' },
      { emoji: '💍', name: 'กำไลข้อมือ' },
      { emoji: '🙅', name: 'ไม่ใส่เครื่องประดับ' },
    ],
  },
};
