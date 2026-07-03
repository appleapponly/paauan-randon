/**
 * 🗣️ คลังคำพูด "ป้าอ้วน" — หัวใจของแอป
 *
 * วิธีเพิ่มมุก: เติมข้อความเข้าไปในอาเรย์ที่ตรงสถานการณ์ได้เลย
 * - ใช้ {result} ในข้อความเพื่อให้ระบบแทนค่าผลสุ่ม เช่น "กิน {result} ไป!"
 * - mood ใช้เลือกสีหน้า/อารมณ์บับเบิล (เผื่ออนาคตทำหลายสีหน้า)
 */

import { t } from '@/i18n';

export type PaaUanMood = 'happy' | 'sassy' | 'teasing' | 'thinking';

export interface PaaUanLine {
  text: string;
  mood: PaaUanMood;
}

/** ตอนเปิดแอป — ป้าทักทาย (แอป global ใช้ชุดอังกฤษโทนคุณป้าอเมริกันอบอุ่น) */
export const openingLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'มาแล้วเหรอลูก วันนี้จะให้ป้าสุ่มอะไรล่ะ?', mood: 'happy' },
    { text: 'ตัดสินใจไม่ได้อีกแล้วใช่มั้ย เดี๋ยวป้าจัดให้', mood: 'sassy' },
    { text: 'อย่ามัวแต่คิดนาน เดี๋ยวข้าวเย็นหมดพอดี', mood: 'teasing' },
    { text: 'ป้ารออยู่นี่แล้ว กดมาเลยอย่าเกรงใจ', mood: 'happy' },
    { text: 'หัวใส ๆ เลือกเองได้นะ แต่ถ้าขี้เกียจคิดก็ให้ป้า', mood: 'sassy' },
    { text: 'ชีวิตมันก็ดวงทั้งนั้นแหละลูก มาสุ่มกับป้า', mood: 'thinking' },
  ],
  [
    { text: 'Well hey there, sweetie! What are we spinning for today?', mood: 'happy' },
    { text: "Can't make up your mind again? Auntie's got you.", mood: 'sassy' },
    { text: "Quit overthinking, hon — dinner's getting cold!", mood: 'teasing' },
    { text: "I'm right here, sugar. Go on, give it a tap!", mood: 'happy' },
    { text: "Smart cookie like you could choose... but Auntie's faster 😏", mood: 'sassy' },
    { text: "Life's all about luck anyway, darlin'. Let's spin!", mood: 'thinking' },
  ]
);

/** ตอนกำลังสุ่ม (วงล้อหมุน / เต๋ากลิ้ง) — แบบทั่วไป ใช้ได้ทุกเครื่อง */
export const spinningLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'เดี๋ยวนะ ป้ากำลังเขย่าดวงให้...', mood: 'thinking' },
    { text: 'อืม... ฟ้าลิขิตกำลังทำงาน', mood: 'thinking' },
    { text: 'ใจเย็น ๆ ของดีต้องรอ', mood: 'teasing' },
    { text: 'หมุนไปสิจ๊ะ ป้าลุ้นอยู่', mood: 'happy' },
  ],
  [
    { text: "Hold on now, Auntie's shaking up some luck...", mood: 'thinking' },
    { text: 'Hmm... destiny is doing its thing', mood: 'thinking' },
    { text: 'Patience, sugar — good things take a moment', mood: 'teasing' },
    { text: "Spin, spin, spin! Auntie's on the edge of her seat!", mood: 'happy' },
  ]
);

/**
 * ตอนได้ผล "กินอะไรดี" — มี {result} ให้แทนชื่อเมนู
 * ป้าจะคอมเมนต์เมนูแบบกวน ๆ
 */
export const foodResultLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'เอา {result} ไปเลย! ป้าฟันธงแล้ว ห้ามเปลี่ยน', mood: 'sassy' },
    { text: 'วันนี้ชะตาบอกว่า {result} จ้า กินซะดี ๆ', mood: 'happy' },
    { text: '{result} ไง! จะไปคิดอะไรให้ปวดหัว', mood: 'teasing' },
    { text: 'ป้าว่า {result} นี่แหละเหมาะกับหน้าลูกที่สุด', mood: 'teasing' },
    { text: 'ได้ {result} แล้วอย่าบ่นนะ ป้าเตือนแล้ว', mood: 'sassy' },
    { text: 'โอ้โห {result}! เลือกได้ดีนะดวงวันนี้', mood: 'happy' },
    { text: '{result} อีกแล้ว? ป้าก็ว่าจะอ้วนเหมือนป้าพอดี', mood: 'teasing' },
    // เพิ่มคำกลาง ๆ ให้เมนูที่ผู้ใช้พิมพ์เองมีคอมเมนต์หลากหลายขึ้น
    { text: '{result} ก็ดีนะ ป้าว่ากินร้อน ๆ อร่อยกว่าเยอะ', mood: 'happy' },
    { text: 'เอาเป็น {result} ก็ได้จ้า อย่ากินเยอะนักล่ะเดี๋ยวอิ่มไม่ไหว', mood: 'teasing' },
    { text: 'วันนี้ {result} จ้า สั่งมาแล้วกินให้หมดด้วยนะลูก', mood: 'sassy' },
    { text: '{result} เลย! เลือกแล้วก็อย่าเปลี่ยนใจ ป้าเมื่อยปาก', mood: 'sassy' },
    { text: 'ป้ายกให้ {result} จานนี้แหละ ถูกใจป้าพอดี', mood: 'happy' },
    { text: 'ดวงชี้ {result} จ้า กินเสร็จอย่าลืมดื่มน้ำเยอะ ๆ นะ', mood: 'thinking' },
  ],
  [
    { text: "{result} — that's final! Auntie has spoken, no take-backs", mood: 'sassy' },
    { text: 'Destiny says {result} today, hon. Enjoy every bite!', mood: 'happy' },
    { text: '{result}, obviously! Why give yourself a headache?', mood: 'teasing' },
    { text: 'Auntie thinks {result} suits you perfectly 😏', mood: 'teasing' },
    { text: "You got {result} — no complaining now, I warned you!", mood: 'sassy' },
    { text: 'Ooh, {result}! Lucky pick today, sweetie!', mood: 'happy' },
    { text: "{result} again? Careful, you'll end up round like Auntie", mood: 'teasing' },
    { text: '{result} sounds lovely — best served hot, trust me', mood: 'happy' },
    { text: "{result} it is! Easy on the portions now, sugar", mood: 'teasing' },
    { text: "Today it's {result}, sweetie. Clean your plate for Auntie!", mood: 'sassy' },
    { text: "{result} — final answer! Auntie's lips are getting tired", mood: 'sassy' },
    { text: 'Auntie approves of {result}. Excellent taste!', mood: 'happy' },
    { text: 'The stars point to {result}. Drink plenty of water after, hon', mood: 'thinking' },
  ]
);

/**
 * 🍽️ คำพูดเจาะจง "รายเมนู" — ป้าคอมเมนต์รายละเอียดอาหารแต่ละอย่าง
 * key = ชื่อเมนู (ต้องตรงกับใน foodMenu.ts เป๊ะ ๆ)
 * ถ้าเมนูไหนไม่มีในนี้ จะ fallback ไปใช้ foodResultLines แบบทั่วไป (ดู pickFoodLine)
 */
export const foodDetailLines: Record<string, PaaUanLine[]> = {
  ข้าวมันไก่: [
    { text: 'ข้าวมันไก่! ราดน้ำจิ้มเยอะ ๆ เผ็ดขิงนิด ๆ ถึงจะแซ่บ', mood: 'teasing' },
    { text: 'ข้าวมันไก่จ้า สั่งเพิ่มน่องด้วยสิลูก อร่อยกว่าเยอะ', mood: 'happy' },
  ],
  ข้าวขาหมู: [
    { text: 'ข้าวขาหมูต้องกินหนังสิถึงจะอร่อย! ไว้ค่อยลดน้ำหนักวันหลังนะ', mood: 'sassy' },
    { text: 'ขาหมูเยิ้ม ๆ ราดข้าวร้อน ๆ ตักไข่พะโล้เพิ่มด้วยจ้า', mood: 'teasing' },
  ],
  ส้มตำไก่ย่าง: [
    { text: 'ส้มตำไก่ย่าง! สั่งเผ็ดให้สมใจ แล้วฟาดข้าวเหนียวให้เกลี้ยง', mood: 'sassy' },
    { text: 'ตำไก่ย่างจ้า อย่าลืมน้ำจิ้มแจ่วนะลูก ขาดไม่ได้เลย', mood: 'teasing' },
  ],
  ก๋วยเตี๋ยวเรือ: [
    { text: 'ก๋วยเตี๋ยวเรือต้องซดน้ำตก ใส่พริกป่นให้แซ่บถึงทรวง!', mood: 'sassy' },
    { text: 'เรือจ้า สั่งสัก 5 ชามค่อยอิ่มนะ ป้ารู้ดีว่าชามเดียวไม่พอ', mood: 'teasing' },
  ],
  กะเพราไข่ดาว: [
    { text: 'กะเพราไข่ดาว! ไข่ต้องกรอบ ๆ ขอบฟู ๆ ถึงจะใช่เลยลูก', mood: 'happy' },
    { text: 'กะเพราจานนี้แหละชีวิต ขอเผ็ดพอแสบลิ้นนะ ป้าชอบ', mood: 'sassy' },
  ],
  ต้มยำกุ้ง: [
    { text: 'ต้มยำกุ้ง! กุ้งตัวโต ๆ มันกุ้งเยิ้ม ๆ แซ่บจนลืมโลก', mood: 'happy' },
    { text: 'ต้มยำจ้า ซดน้ำให้ชื่นใจ เผ็ดจนเหงื่อตกป้าก็ไม่ห้าม', mood: 'teasing' },
  ],
  หมูกระทะ: [
    { text: 'หมูกระทะ! บุฟเฟ่ต์ต้องเอาให้คุ้ม แต่ตักผักบ้างนะจะอ้วนเหมือนป้า', mood: 'teasing' },
    { text: 'หมูกระทะจ้า อย่าให้น้ำตกแห้งล่ะ เดี๋ยวหมูไหม้ติดกระทะ', mood: 'sassy' },
  ],
  ชาบู: [
    { text: 'ชาบูน้ำซุปเด็ด! จิ้มงาจิ้มน้ำจิ้มให้ครบ อร่อยเหาะเลยลูก', mood: 'happy' },
    { text: 'ชาบูจ้า ลวกหมูพอสุกนะ อย่าใจร้อนเดี๋ยวท้องเสียป้าไม่รู้ด้วย', mood: 'teasing' },
  ],
  ผัดไทย: [
    { text: 'ผัดไทย! บีบมะนาว ใส่พริกป่น โรยถั่วเยอะ ๆ ถึงจะครบสูตร', mood: 'happy' },
    { text: 'ผัดไทยห่อไข่จ้า สั่งกุ้งสดเพิ่มสิลูก คุ้มกว่ากันเยอะ', mood: 'teasing' },
  ],
  หมูปิ้ง: [
    { text: 'หมูปิ้งต้องคู่ข้าวเหนียว! จิ้มน้ำจิ้มแจ่วร้อน ๆ ฟินสุด ๆ', mood: 'happy' },
    { text: 'หมูปิ้งจ้า ซื้อ 10 ไม้พอมั้ย? ป้าว่าไม่พอหรอก เอา 20 เลย', mood: 'teasing' },
  ],
  ไก่ทอด: [
    { text: 'ไก่ทอดหนังกรอบ ๆ! จิ้มน้ำจิ้มหวานนิดเผ็ดหน่อย เริ่ดมาก', mood: 'happy' },
    { text: 'ไก่ทอดจ้า กินกับข้าวเหนียวร้อน ๆ อ้วนก็ช่างมันวันนี้', mood: 'sassy' },
  ],
  แกงเขียวหวาน: [
    { text: 'แกงเขียวหวานราดข้าวร้อน ๆ! ใส่ไก่เยอะ ๆ ฟาดให้เรียบจาน', mood: 'happy' },
    { text: 'เขียวหวานจ้า เผ็ดมันกะทิ อร่อยจนลืมไดเอทไปเลยลูก', mood: 'teasing' },
  ],
  ผัดซีอิ๊ว: [
    { text: 'ผัดซีอิ๊วเส้นใหญ่! ต้องไฟแรง ๆ ให้หอมกระทะ ถึงจะอร่อยลูก', mood: 'happy' },
    { text: 'ผัดซีอิ๊วจ้า เหยาะพริกน้ำส้มนิดนึง ตัดเลี่ยนได้ดีนัก', mood: 'teasing' },
  ],
  ราดหน้า: [
    { text: 'ราดหน้าน้ำข้น ๆ! เหยาะพริกน้ำส้มให้เปรี้ยวหน่อย แซ่บเลย', mood: 'teasing' },
    { text: 'ราดหน้าจ้า สั่งเส้นกรอบก็ดีนะ ราดน้ำตอนจะกินจะได้ไม่เละ', mood: 'sassy' },
  ],
  ข้าวซอย: [
    { text: 'ข้าวซอยไก่! ใส่ผักดอง หอมแดง บีบมะนาว ครบเครื่องเหนือแท้', mood: 'happy' },
    { text: 'ข้าวซอยจ้า เส้นทอดกรอบ ๆ ข้างบนนี่แหละของเด็ด อย่าเขี่ยทิ้ง', mood: 'teasing' },
  ],
  ลาบหมู: [
    { text: 'ลาบหมูคั่วข้าว! โรยข้าวคั่วเยอะ ๆ กินกับผักสด แซ่บนัวลิ้น', mood: 'sassy' },
    { text: 'ลาบจ้า เผ็ดร้อนแรงดี กินคู่ข้าวเหนียวอุ่น ๆ ฟินสุด', mood: 'teasing' },
  ],
  ข้าวคลุกกะปิ: [
    { text: 'ข้าวคลุกกะปิ! คลุกให้ทั่ว ตัดมะม่วงเปรี้ยวกับหมูหวาน เริ่ดมาก', mood: 'happy' },
    { text: 'ข้าวคลุกกะปิจ้า เครื่องเยอะ ๆ นี่แหละชีวิต อย่ากินแต่ข้าวเปล่านะ', mood: 'teasing' },
  ],
  สุกี้: [
    { text: 'สุกี้น้ำใส่ไข่! น้ำจิ้มสุกี้ต้องเผ็ดเปรี้ยวจัด ถึงจะใช่เลยลูก', mood: 'happy' },
    { text: 'สุกี้จ้า เลือกน้ำหรือแห้งดีล่ะ? ป้าว่าเอาน้ำ ซดอุ่นท้องดี', mood: 'teasing' },
  ],
  โจ๊ก: [
    { text: 'โจ๊กร้อน ๆ! ใส่ไข่ลวก ขิงซอย ต้นหอม ซดสบายท้องดีนะลูก', mood: 'happy' },
    { text: 'โจ๊กจ้า เลือกง่ายแบบนี้ดีแล้ว ป่วยหรือเปล่าเนี่ย? ดูแลตัวเองด้วย', mood: 'thinking' },
  ],
  ข้าวหมูแดง: [
    { text: 'ข้าวหมูแดง! ราดน้ำราดเยอะ ๆ ตัดไข่ต้มครึ่งซีก อร่อยลงตัว', mood: 'happy' },
    { text: 'หมูแดงหมูกรอบจ้า สั่งสองอย่างไปเลยสิลูก ป้าไม่ว่าหรอก', mood: 'teasing' },
  ],

  // ===== คลังเมนูแนะนำ 20 อย่าง (SUGGESTED_FOOD_MENU) — คำคอมเมนต์กลาง ๆ ที่เข้ากับเมนู =====
  มาม่าผัด: [
    { text: 'มาม่าผัด! ใส่ไข่ ใส่ผักนิดนึง ง่าย ๆ แต่อร่อยได้ใจ', mood: 'happy' },
    { text: 'มาม่าผัดจ้า สิ้นเดือนใช่มั้ยลูก? ป้าเข้าใจ กินอิ่มก็พอ', mood: 'teasing' },
  ],
  ข้าวต้ม: [
    { text: 'ข้าวต้มร้อน ๆ! เบาท้องดีนะ กินกับหมูสับหรือไข่เค็มก็ฟิน', mood: 'happy' },
    { text: 'ข้าวต้มจ้า สบายท้องดี ไม่สบายอยู่หรือเปล่าเนี่ย ดูแลตัวเองนะ', mood: 'thinking' },
  ],
  ข้าวผัด: [
    { text: 'ข้าวผัด! บีบมะนาว เหยาะพริกน้ำปลา ครบสูตรจานโปรดเลยลูก', mood: 'happy' },
    { text: 'ข้าวผัดจ้า เมนูไม่มีพิษมีภัย กินได้ทุกวันไม่มีเบื่อ', mood: 'teasing' },
  ],
  ข้าวผัดกุ้ง: [
    { text: 'ข้าวผัดกุ้ง! กุ้งเด้ง ๆ ตัวโต ๆ บีบมะนาวนิดนึง อร่อยลงตัว', mood: 'happy' },
    { text: 'ข้าวผัดกุ้งจ้า สั่งเพิ่มกุ้งอีกหน่อยสิลูก กินทีต้องให้คุ้ม', mood: 'teasing' },
  ],
  ข้าวไข่เจียว: [
    { text: 'ข้าวไข่เจียวฟู ๆ! ราดซอสพริกหน่อย ง่ายแต่อร่อยไม่มีพลาด', mood: 'happy' },
    { text: 'ไข่เจียวจ้า เมนูช่วยชีวิตตอนหิว ป้าก็ชอบกินบ่อยเหมือนกัน', mood: 'teasing' },
  ],
  ผัดกะเพราหมูกรอบ: [
    { text: 'กะเพราหมูกรอบ! หมูกรอบ ๆ ใบกะเพราหอม ๆ ขอไข่ดาวด้วยนะ', mood: 'happy' },
    { text: 'กะเพราหมูกรอบจ้า เผ็ดแซ่บถึงใจ ป้าฟันธงว่าจานนี้ไม่ผิดหวัง', mood: 'sassy' },
  ],
  เย็นตาโฟ: [
    { text: 'เย็นตาโฟสีชมพู! เปรี้ยวหวานกลมกล่อม ลูกชิ้นปลาเด้ง ๆ อร่อยดี', mood: 'happy' },
    { text: 'เย็นตาโฟจ้า สีสวยน่ากิน รสจัดจ้านดีนะลูก ป้าชอบ', mood: 'teasing' },
  ],
  บะหมี่เกี๊ยว: [
    { text: 'บะหมี่เกี๊ยวกุ้ง! เส้นหนึบ ๆ เกี๊ยวเต็มคำ ซดน้ำซุปชื่นใจ', mood: 'happy' },
    { text: 'บะหมี่เกี๊ยวจ้า สั่งแห้งหรือน้ำดีล่ะ? ป้าว่าอร่อยทั้งคู่แหละ', mood: 'teasing' },
  ],
  ข้าวหน้าเป็ด: [
    { text: 'ข้าวหน้าเป็ด! เป็ดนุ่ม ๆ ราดน้ำพะโล้หอม ๆ ตัดผักกาดดอง เริ่ด', mood: 'happy' },
    { text: 'ข้าวหน้าเป็ดจ้า เนื้อเป็ดเยอะ ๆ นะลูก กินทีให้อิ่มไปเลย', mood: 'teasing' },
  ],
  ต้มเลือดหมู: [
    { text: 'ต้มเลือดหมู! เครื่องในครบ ๆ ใส่ขึ้นฉ่ายเยอะ ๆ ซดร้อน ๆ ฟิน', mood: 'happy' },
    { text: 'ต้มเลือดหมูจ้า อยากกินอะไรเบา ๆ ร้อน ๆ อันนี้แหละเหมาะเลย', mood: 'teasing' },
  ],
  ผัดพริกแกงหมู: [
    { text: 'ผัดพริกแกงหมู! เผ็ดหอมพริกแกง ใส่ถั่วฝักยาวกรอบ ๆ ข้าวหมดจาน', mood: 'sassy' },
    { text: 'ผัดพริกแกงจ้า เผ็ดร้อนแรงดี กินกับข้าวสวยร้อน ๆ อร่อยลืมอิ่ม', mood: 'teasing' },
  ],
  ไข่กระทะ: [
    { text: 'ไข่กระทะร้อน ๆ! ใส่หมูยอ กุนเชียง จิ้มขนมปังก็ได้ ฟินมื้อเช้า', mood: 'happy' },
    { text: 'ไข่กระทะจ้า มื้อเช้าจัดเต็มแบบนี้ ป้าชอบ เริ่มวันใหม่สดใส', mood: 'happy' },
  ],
  ข้าวผัดอเมริกัน: [
    { text: 'ข้าวผัดอเมริกัน! มีไก่ทอด ไส้กรอก ไข่ดาว จัดเต็มทั้งจานเลยลูก', mood: 'happy' },
    { text: 'ข้าวผัดอเมริกันจ้า จานนี้อิ่มยาวไปถึงเย็นเลยนะ คุ้มมาก', mood: 'teasing' },
  ],
  สปาเกตตี้ผัดขี้เมา: [
    { text: 'สปาเกตตี้ผัดขี้เมา! เผ็ดพริกสด หอมกะเพรา ฝรั่งผสมไทยลงตัวดี', mood: 'happy' },
    { text: 'ผัดขี้เมาเส้นสปาเกตตี้จ้า แปลกดีนะ เผ็ดแซ่บแบบไทย ๆ ป้าชอบ', mood: 'teasing' },
  ],
  ข้าวหมกไก่: [
    { text: 'ข้าวหมกไก่! ข้าวหอมเครื่องเทศ ราดน้ำจิ้มเขียว จิ้มแตงกวา อร่อย', mood: 'happy' },
    { text: 'ข้าวหมกไก่จ้า กลิ่นหอมเครื่องเทศชวนหิว กินกับน้ำจิ้มถึงจะครบ', mood: 'teasing' },
  ],
  หอยทอด: [
    { text: 'หอยทอดกรอบ ๆ! ออส่วนแป้งกรอบ หอยตัวอวบ จิ้มซอสศรีราชา เริ่ด', mood: 'happy' },
    { text: 'หอยทอดจ้า เอาแบบกรอบหรือแบบแฉะดีล่ะลูก? ป้าว่ากรอบ ๆ อร่อยกว่า', mood: 'teasing' },
  ],
  ผัดมักกะโรนี: [
    { text: 'ผัดมักกะโรนี! ใส่ไส้กรอก ไข่ มะเขือเทศ เปรี้ยวหวานเด็ก ๆ ก็ชอบ', mood: 'happy' },
    { text: 'ผัดมักกะโรนีจ้า เมนูง่าย ๆ สีสันน่ากิน กินเล่นกินจริงก็ได้', mood: 'teasing' },
  ],
  ก๋วยจั๊บ: [
    { text: 'ก๋วยจั๊บน้ำข้น! พริกไทยหอม ๆ หมูกรอบ ไข่พะโล้ ซดร้อน ๆ ฟินเลย', mood: 'happy' },
    { text: 'ก๋วยจั๊บจ้า เส้นม้วน ๆ หนึบดี น้ำซุปพริกไทยแซ่บถึงทรวง', mood: 'teasing' },
  ],
  ข้าวเหนียวหมูทอด: [
    { text: 'ข้าวเหนียวหมูทอด! หมูทอดหอมกระเทียม จิ้มน้ำจิ้มแจ่ว อร่อยง่าย ๆ', mood: 'happy' },
    { text: 'ข้าวเหนียวหมูทอดจ้า กินเพลินจนลืมนับเลยนะลูก อย่าเยอะนัก', mood: 'teasing' },
  ],
  ผัดผักรวม: [
    { text: 'ผัดผักรวม! กินผักบ้างก็ดีลูก ป้าดีใจที่หนูใส่ใจสุขภาพ', mood: 'happy' },
    { text: 'ผัดผักรวมจ้า ดีต่อสุขภาพดีนะ แต่ขอข้าวสองจานได้มั้ย ป้าหิว', mood: 'teasing' },
  ],
};

/**
 * เลือกคำพูดสำหรับผลเมนูอาหาร:
 * ถ้ามีคำพูดเจาะจงเมนูนั้น (foodDetailLines) ใช้อันนั้นก่อน ไม่งั้น fallback แบบทั่วไป
 */
export function pickFoodLine(item: string): PaaUanLine {
  const specific = foodDetailLines[item];
  if (specific && specific.length) return pickLine(specific, item);
  return pickLine(foodResultLines, item);
}

/** ตอนตอบ "ใช่" (ใช่/ไม่ใช่) */
export const yesLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ใช่สิจ๊ะ! ป้าว่าเอาเลย ไม่ต้องคิดมาก', mood: 'happy' },
    { text: 'ใช่! ฟ้าส่งสัญญาณมาแล้ว ลุยโลด', mood: 'sassy' },
    { text: 'เออ ใช่ ๆ ป้าก็ว่างั้นแหละ', mood: 'teasing' },
  ],
  [
    { text: "Yes, sweetie! Go for it — don't overthink", mood: 'happy' },
    { text: 'Yes! The universe just gave you a green light. Go!', mood: 'sassy' },
    { text: "Mm-hmm, yes. That's what Auntie would do too", mood: 'teasing' },
  ]
);

/** ตอนตอบ "ไม่ใช่" (ใช่/ไม่ใช่) */
export const noLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ไม่ใช่จ้า อย่าเพิ่งเลยลูก ป้าเตือนแล้วนะ', mood: 'thinking' },
    { text: 'ไม่! ป้าส่ายหัวให้เลย เก็บไว้ก่อน', mood: 'sassy' },
    { text: 'ไม่ใช่หรอก เชื่อป้าเถอะ', mood: 'teasing' },
  ],
  [
    { text: "No, darlin'. Not just yet — Auntie's warning you", mood: 'thinking' },
    { text: "Nope! Auntie's shaking her head. Save it for later", mood: 'sassy' },
    { text: 'Not this one, hon. Trust your Auntie', mood: 'teasing' },
  ]
);

/** ตอนโยนเหรียญได้ "หัว" / "ก้อย" — ใช้ {result} */
export const coinLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ออก {result}! ป้าเห็นกับตา ไม่มีโกง', mood: 'happy' },
    { text: '{result} จ้า ดวงใครดวงมันนะลูก', mood: 'teasing' },
    { text: 'เหรียญบอก {result} แล้ว อย่ามาต่อรองกับป้า', mood: 'sassy' },
  ],
  [
    { text: "It's {result}! Auntie saw it with her own eyes — no cheating", mood: 'happy' },
    { text: "{result}, sugar. Luck's luck, fair and square", mood: 'teasing' },
    { text: 'The coin says {result}. No arguing with Auntie!', mood: 'sassy' },
  ]
);

/** ใครโดน — สุ่มผู้โชคร้าย ใช้ {result} เป็นชื่อคน */
export const victimLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ซวยไป {result}! รอบนี้เธอนั่นแหละ 😂', mood: 'sassy' },
    { text: 'ป้าจิ้มแล้วนะ... {result} จ่ายเลยจ้า', mood: 'teasing' },
    { text: 'โถ่ {result} ทำใจนะลูก ดวงมันพาไป', mood: 'teasing' },
    { text: 'งานนี้ {result} หนีไม่พ้น ป้าฟันธง!', mood: 'sassy' },
  ],
  [
    { text: "Tough luck, {result}! You're it this time 😂", mood: 'sassy' },
    { text: "Auntie's finger has spoken... {result}, pay up!", mood: 'teasing' },
    { text: 'Aww, {result}, bless your heart. Fate picked you', mood: 'teasing' },
    { text: 'No escape, {result} — Auntie has spoken!', mood: 'sassy' },
  ]
);

/** จับฉลาก — ผู้โชคดี ใช้ {result} */
export const luckyLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ยินดีด้วย {result}! โชคเข้าข้างสุด ๆ 🎉', mood: 'happy' },
    { text: 'ผู้โชคดีคือ {result} จ้า ปรบมือหน่อย!', mood: 'happy' },
    { text: '{result} ดวงดีจริง ป้าอิจฉาเลย', mood: 'teasing' },
  ],
  [
    { text: 'Congratulations, {result}! Lady Luck loves you today 🎉', mood: 'happy' },
    { text: 'And the winner is {result}! Round of applause!', mood: 'happy' },
    { text: "{result}, you lucky thing — Auntie's a little jealous", mood: 'teasing' },
  ]
);

/** สุ่มตัวเลข — ใช้ {result} */
export const numberLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ได้เลข {result} จ้า เอาไปใช้ให้คุ้มนะ', mood: 'happy' },
    { text: '{result}! ป้าว่าเลขนี้แหละเฮง', mood: 'sassy' },
    { text: 'ฟ้าให้มา {result} อย่าเอาไปแทงหวยล่ะ 😏', mood: 'teasing' },
  ],
  [
    { text: 'Your number is {result}, hon. Use it well!', mood: 'happy' },
    { text: "{result}! Auntie's got a good feeling about this one", mood: 'sassy' },
    { text: "The heavens sent {result}. Don't bet the house on it 😏", mood: 'teasing' },
  ]
);

/** สุ่มสี — ใช้ {result} เป็นรหัสสี */
export const colorLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'สีนี้สวยนะ {result} ป้าชอบ!', mood: 'happy' },
    { text: 'ได้ {result} จ้า เอาไปแต่งให้สวยเลย', mood: 'happy' },
    { text: 'อืม {result}... ป้าว่าเข้ากับลูกดีนะ', mood: 'teasing' },
  ],
  [
    { text: 'Ooh, {result} — what a pretty color! Auntie loves it', mood: 'happy' },
    { text: '{result} for you, sugar. Go make something beautiful', mood: 'happy' },
    { text: 'Hmm, {result}... you know, it really suits you', mood: 'teasing' },
  ]
);

/** แบ่งทีม / สุ่มคิว — คำพูดทั่วไป (ไม่มี {result}) */
export const groupLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'จัดให้เรียบร้อยแล้วจ้า ยุติธรรมสุด ๆ', mood: 'happy' },
    { text: 'ป้าแบ่งให้แล้ว ใครไม่พอใจมาเถียงกับป้า 😤', mood: 'sassy' },
    { text: 'เสร็จแล้วลูก ดวงจัดสรรมาเองนะ', mood: 'teasing' },
  ],
  [
    { text: 'All sorted, sweetie! Fair and square', mood: 'happy' },
    { text: 'Auntie did the splitting — complaints go to Auntie 😤', mood: 'sassy' },
    { text: 'Done, hon! Destiny did the sorting, not me', mood: 'teasing' },
  ]
);

/** ใบ้คำ — ป้าแซวตอนเปิดคำ */
export const charadesLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'คำนี้ง่ายจะตาย ใบ้ให้เพื่อนเร็ว!', mood: 'sassy' },
    { text: 'เอ้า ดูคำแล้วอย่าพูดออกมานะ เดี๋ยวโกง', mood: 'teasing' },
    { text: 'คำนี้ป้ายังทายถูกเลย สู้ ๆ จ้า', mood: 'happy' },
  ],
  [
    { text: "This one's easy — get acting, quick!", mood: 'sassy' },
    { text: 'Look at the word but zip those lips! No cheating', mood: 'teasing' },
    { text: "Even Auntie could guess this one. You've got this!", mood: 'happy' },
  ]
);

/** สุ่มที่เที่ยว — ป้าคอมเมนต์ปลายทางที่สุ่มได้ */
export const travelLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ไปเที่ยวซะลูก! ทำงานมาเหนื่อยแล้ว ชาร์จแบตหน่อย', mood: 'happy' },
    { text: 'ที่นี่แหละ! ป้าฟันธง เก็บกระเป๋าได้เลยจ้า', mood: 'sassy' },
    { text: 'สวยนะที่นี่ ไปแล้วถ่ายรูปมาฝากป้าด้วยล่ะ', mood: 'teasing' },
    { text: 'จองที่พักเลย อย่ามัวลังเล เดี๋ยวคนเต็มก่อน', mood: 'sassy' },
    { text: 'ไปเที่ยวก็ดี แต่ขับรถดี ๆ ระวังตัวด้วยนะลูก', mood: 'thinking' },
    { text: 'โอ้โห ที่นี่! ป้าก็อยากไปด้วยอ่ะ พาป้าไปมั้ย', mood: 'teasing' },
  ],
  [
    { text: "Go take that trip, sweetie! You've earned a recharge", mood: 'happy' },
    { text: "This is the place! Auntie's certain — go pack your bags!", mood: 'sassy' },
    { text: 'Ooh, lovely spot. Take lots of pictures for Auntie!', mood: 'teasing' },
    { text: 'Book it now, hon — the good rooms fill up fast!', mood: 'sassy' },
    { text: 'Have fun out there, and travel safe for Auntie, alright?', mood: 'thinking' },
    { text: 'Oh my, THIS place! Can Auntie come too?', mood: 'teasing' },
  ]
);

/** สุ่มแต่งตัว — ป้าคอมเมนต์ลุคที่สุ่มได้ */
export const outfitLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ลุคนี้เริ่ดอยู่นะลูก ใส่ออกไปเดี๋ยวมีคนเหลียวมอง', mood: 'happy' },
    { text: 'จัดเซ็ตนี้ไปเลย! ป้าว่าเข้ากันสุด ๆ มั่นใจไว้นะ', mood: 'happy' },
    { text: 'แต่งตามนี้รับรองไม่ซ้ำใคร กล้า ๆ หน่อยลูก', mood: 'sassy' },
    { text: 'โอ๊ย ลุคนี้ปังมาก! ถ่ายรูปลง story ได้เลยจ้า', mood: 'teasing' },
    { text: 'ป้าเลือกให้แล้ว ห้ามเปลี่ยนนะ ใส่ไปสวยหล่อแน่นอน', mood: 'sassy' },
    { text: 'ดูดีนะเนี่ย ป้าว่าวันนี้หนูจะเป็นดาวเด่นเลยล่ะ', mood: 'happy' },
  ],
  [
    { text: "Now that's a look, sweetie! Heads will turn", mood: 'happy' },
    { text: 'Wear this set — it all goes together beautifully. Own it!', mood: 'happy' },
    { text: 'This look is one of a kind. Be bold, hon!', mood: 'sassy' },
    { text: "Ooh, gorgeous! That's story-worthy right there", mood: 'teasing' },
    { text: "Auntie picked it, so no changing! You'll look fabulous", mood: 'sassy' },
    { text: "Looking good! You're going to be the star today, sugar", mood: 'happy' },
  ]
);

/** ดวงประจำวัน (3 อย่าง) — คำพูดป้าหมอดูตอนเปิดดวงรวม */
export const horoscopeLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ป้าเปิดลูกแก้วดูดวงวันนี้ให้แล้วจ้า', mood: 'happy' },
    { text: 'นั่งลงก่อนลูก เดี๋ยวป้าทำนายดวงให้', mood: 'thinking' },
    { text: 'ดวงวันนี้ออกมาแบบนี้ ฟังหูไว้หูนะ', mood: 'teasing' },
    { text: 'ฟ้าลิขิตมาแล้ว เอาไปปรับใช้ให้เป็นนะจ๊ะ', mood: 'thinking' },
    { text: 'ดูดวงเสร็จแล้ว ที่เหลือก็อยู่ที่ตัวหนูเองนะ', mood: 'happy' },
  ],
  [
    { text: 'Auntie gazed into the crystal ball just for you', mood: 'happy' },
    { text: "Sit down, sweetie — Auntie's reading your stars", mood: 'thinking' },
    { text: "Here's today's fortune. Take it with a grain of salt, hon", mood: 'teasing' },
    { text: "The heavens have spoken. Use it wisely, darlin'", mood: 'thinking' },
    { text: "Reading's done! The rest is up to you, sugar", mood: 'happy' },
  ]
);

/** ข้อคิดประจำวัน — คำพูดป้า "เกริ่นนำ" ก่อนเฉลยข้อคิด (ตัวข้อคิดอยู่ใน dailyFortune.ts) */
export const fortuneLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'ฟังข้อคิดจากป้าวันนี้ให้ดีนะลูก', mood: 'happy' },
    { text: 'ดวงวันนี้ป้าจัดให้ จำไว้ใช้ทั้งวันเลย', mood: 'happy' },
    { text: 'ป้าเปิดดวงให้แล้ว เอาไปคิดดูนะจ๊ะ', mood: 'thinking' },
    { text: 'วันนี้ฟ้าฝากข้อคิดนี้มาให้หนู', mood: 'thinking' },
    { text: 'เก็บคำนี้ไว้ในใจ แล้ววันนี้จะดีเอง', mood: 'happy' },
  ],
  [
    { text: "Listen close to today's little wisdom, sweetie", mood: 'happy' },
    { text: "Auntie's daily pearl — keep it with you all day", mood: 'happy' },
    { text: "Here's your thought for today, hon. Chew on it a while", mood: 'thinking' },
    { text: 'The sky sent this little thought just for you', mood: 'thinking' },
    { text: 'Keep these words in your heart and today will shine', mood: 'happy' },
  ]
);

/**
 * วงล้อของฉัน (custom) — ผู้ใช้ใส่คำอะไรก็ได้ (อาจเป็นเรื่องจริงจัง)
 * ป้าจึงพูด "กลาง ๆ" ไม่กวน ไม่ตัดสิน แค่บอกผลให้ชัด ใช้ {result}
 */
export const customWheelLines: PaaUanLine[] = t<PaaUanLine[]>(
  [
    { text: 'วงล้อหยุดที่ "{result}" จ้ะ', mood: 'happy' },
    { text: 'ได้ "{result}" นะลูก', mood: 'happy' },
    { text: 'ป้าหมุนให้แล้ว ออกมาเป็น "{result}" จ้า', mood: 'happy' },
    { text: 'ผลออกมาคือ "{result}"', mood: 'thinking' },
    { text: '"{result}" จ้ะ เอาไปตัดสินใจได้เลย', mood: 'happy' },
    { text: 'ฟ้าเลือก "{result}" ให้แล้วนะลูก', mood: 'thinking' },
  ],
  [
    { text: 'The wheel stopped at "{result}", sweetie', mood: 'happy' },
    { text: 'You got "{result}", hon', mood: 'happy' },
    { text: 'Auntie gave it a spin — it landed on "{result}"', mood: 'happy' },
    { text: 'The result is "{result}"', mood: 'thinking' },
    { text: '"{result}" — there you have it. Decision time!', mood: 'happy' },
    { text: 'Fate picked "{result}" for you, darlin\'', mood: 'thinking' },
  ]
);

/**
 * ดึงคำพูดแบบสุ่ม 1 อัน แล้วแทนค่า {result} ให้เรียบร้อย
 * @param lines อาเรย์คำพูด
 * @param result ค่าผลสุ่มที่จะแทนใน {result} (ถ้ามี)
 */
export function pickLine(lines: PaaUanLine[], result?: string): PaaUanLine {
  const line = lines[Math.floor(Math.random() * lines.length)];
  if (result == null) return line;
  return { ...line, text: line.text.replace(/\{result\}/g, result) };
}
