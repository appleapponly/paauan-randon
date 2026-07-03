/**
 * 🥠 เซียมซี — ใบเซียมซี 30 ใบ (กลอน 4 บรรทัด + แง่คิดสะกิดใจสไตล์ป้าอ้วน)
 * กดเขย่า → สุ่มได้ 1 ใบ: โชว์ใบเซียมซีสวย ๆ (นอกกล่องคำพูด) + ป้าให้แง่คิดในบับเบิล
 *
 * poem  = คำทำนาย (กลอน) โชว์บนใบเซียมซี
 * insight = แง่คิดสะกิดใจ (ป้าพูดในบับเบิล)
 */
import { IS_GLOBAL } from '@/i18n';

export interface SiamsiStick {
  id: number;
  title: string;
  poem: string;
  insight: string;
}

const SIAMSI_TH: SiamsiStick[] = [
  {
    id: 1,
    title: 'เซียมซีเสี่ยงโชค',
    poem: 'ใบที่หนึ่ง ทายว่า ช่วงนี้กรอบ\nสิ่งที่ชอบ เงินในคลัง หายไปไหน\nกระเป๋าตังค์ แบนแฟบ แทบร้องไห้\nลาภลอยค้าง อยู่ห่างไกล ไม่มาเยือน',
    insight:
      'ใบนี้บอกว่าดวงหนูไม่ได้แย่ แต่แพ้ใจตัวเองนั่นแหละลูก! หยุดมือกดของใส่ตะกร้า อดใจเรื่องเซลล์สักหน่อย เดี๋ยวเงินก็ไหลมาเทมาเองจ้ะ',
  },
  {
    id: 2,
    title: 'เซียมซีชี้คาน',
    poem: 'ใบที่สอง ส่องหา เนื้อคู่ยาก\nที่เข้ามา มีแต่ซาก ความอกหัก\nคนดีๆ หายไป ไหนหมดรัก\nเหลือแต่คน กะล่อนทัก ทิ้งให้รอ',
    insight:
      'อย่ามัวเหงาแล้วคว้าใครก็ได้มาเป็นแฟนนะลูก โสดแบบรวย ๆ สวย ๆ หล่อ ๆ ดีกว่าไปคว้าคนเป็นพิษมาเผาใจ ยังไม่เจอคนปัง ๆ นอนดูซีรีส์อยู่บ้านปลอดภัยกว่าเยอะจ้ะ',
  },
  {
    id: 3,
    title: 'เซียมซีดองเค็ม',
    poem: 'ใบที่สาม ถามเรื่อง งานที่ทำ\nช่างตรากตรำ ดองไว้ จนท่วมหัว\nเดดไลน์จี้ ก้นร้อน รนระรัว\nแต่ในหัว คิดแต่เรื่อง ท่องเที่ยวเอย',
    insight:
      'งานจะเสร็จได้ก็ต่อเมื่อลงมือทำนะลูก มัวแต่ไถฟีดแก้เครียดงานมันไม่ลดลงเองหรอก ความสำเร็จไม่มาหาคนเอาแต่ฝันกลางวัน ลุกขึ้นมาเคลียร์สักตั้ง โบนัสรออยู่!',
  },
  {
    id: 4,
    title: 'เซียมซีพุงขยาย',
    poem: 'ใบที่สี่ ชี้ชัด เรื่องสังขาร\nที่เบิกบาน คือพุง มุ่งขยาย\nชาบูหมูกระทะ ซัดกระจาย\nพอตกสาย บ่นปวดข้อ ท้ออุรา',
    insight:
      'สุขภาพยังไหวอยู่ แต่ต้องห้ามใจเรื่องกินบ้างนะลูก ร่างกายไม่ใช่ถังขยะ ขยับตัววันละนิด ออกกำลังวันละหน่อย ดีกว่าเอาเงินที่หามาได้ไปจ่ายค่าหมอจ้ะ',
  },
  {
    id: 5,
    title: 'เซียมซีโซเชียลซึมเศร้า',
    poem: 'ใบที่ห้า ฟ้าเปิด ประเสริฐล้ำ\nดวงไม่ดำ แต่ใจ คิดไปทั่ว\nชอบส่องเฟซ ส่องไอจี จนปวดหัว\nเห็นคนอื่น ดีกว่าตัว จนร้อนใจ',
    insight:
      'ชีวิตหนูดีในแบบของหนูนะลูก อย่าเอาความสุขไปผูกกับยอดไลก์หรือรูปสวย ๆ ของคนอื่น ปิดจอบ้าง มองความสุขรอบตัวในชีวิตจริง แล้วจะรู้ว่าหนูโชคดีแค่ไหนแล้ว',
  },
  {
    id: 6,
    title: 'เซียมซีติดดอย',
    poem: 'ใบที่หก ตกฟาก เรื่องพอร์ตหุ้น\nหวังเอาทุน คืนมา พาใจหาย\nเห็นสีเขียว แป๊บเดียว แดงกระจาย\nดอยยาวไป ไม่หลุด สุดระทม',
    insight:
      'การลงทุนมีความเสี่ยงนะลูก! อย่าหูเบาตามข่าวลือ หรือโลภจนทุ่มหมดหน้าตัก ค่อย ๆ ศึกษาให้แน่น ช้า ๆ ได้พร้าเล่มงาม ดีกว่ารีบรวยแล้วซวยไปนั่งหนาวอยู่บนดอยยาว ๆ',
  },
  {
    id: 7,
    title: 'เซียมซีฝีปาก',
    poem: 'ใบที่เจ็ด เด็ดดวง เรื่องปะทะ\nระวังจะ ปากแจ๋ว จนใจสั่น\nเรื่องคนอื่น ขยันเผือก ทุกคืนวัน\nระวังพลัน ขึ้นศาล งานเข้าเอย',
    insight:
      'ช่วงนี้ดวงชงเรื่องทะเลาะ งดปะทะ ถอยคนละก้าวดีที่สุดจ้ะ รู้จักเงียบไว้คือทองแท้ ไปเถียงเอาชนะเรื่องที่ไม่ใช่ของเราก็เสียสุขภาพจิตเปล่า ๆ เอาเวลาไปโฟกัสเรื่องตัวเองดีกว่าลูก',
  },
  {
    id: 8,
    title: 'เซียมซีแพนด้า',
    poem: 'ใบที่แปด แวดล้อม ด้วยรอยคล้ำ\nใต้ตาดำ กว่าหมี ที่สวนสัตว์\nกลางคืนคึก กลางวันฟุบ อาการชัด\nโรคสารพัด จะถามหา ถ้าไม่นอน',
    insight:
      'ร่างกายหนูไม่ใช่เครื่องจักรนะลูก ป้ารู้ว่ามีไฟปั่นงาน มีซีรีส์ต้องดูให้จบ แต่การนอนให้พอคือยาวิเศษที่สุด ฝืนต่อไประวังเงินที่หามาได้จะกลายเป็นค่าหมอ ปิดจอแล้วไปนอนซะ!',
  },
  {
    id: 9,
    title: 'เซียมซีผู้ใหญ่ดัน',
    poem: 'ใบที่เก้า เข้าที ดีนักหนา\nผู้ใหญ่มา เมตตา คอยอุดหนุน\nแต่อย่าเพิ่ง เหลิงไป ลืมแทนคุณ\nมัวแต่หมุน อู้ลีลา ระวังพัง',
    insight:
      'โอกาสดี ๆ กำลังเข้ามาเพราะมีคนคอยหนุนนะลูก แต่จำไว้ โชคช่วยก็ไม่สู้ลงมือทำเอง ได้โอกาสแล้วก็ตั้งใจให้เต็มที่ อ่อนน้อมถ่อมตนไว้ ความเจริญถึงจะอยู่กับเรานาน ๆ',
  },
  {
    id: 10,
    title: 'เซียมซีรอเก็บเกี่ยว',
    poem: 'ใบที่สิบ หยิบได้ ให้ใจร่ม\nอย่าเพิ่งตรม ตรอมใจ ไปเลยหนา\nปลูกต้นไม้ ต้องรอคอย กาลเวลา\nเร่งปุ๋ยยา มากไป ต้นตายเอย',
    insight:
      'สิ่งที่หนูปั้นอยู่ตอนนี้อาจยังไม่เห็นผลทันตานะลูก ต้องอดทนรดน้ำพรวนดินไปเรื่อย ๆ อย่าใจร้อนเร่งจนเกินพอดี ถึงเวลาความสำเร็จจะหอมหวานคุ้มการรอคอยแน่นอนจ้ะ',
  },
  {
    id: 11,
    title: 'เซียมซีนักเสี่ยงโชค',
    poem: 'ใบสิบเอ็ด เด็ดสุด เรื่องเสี่ยงโชค\nหวังสะเทือน ทั้งโลก ตอนหวยออก\nแต่พอวัน ประกาศผล สุดช้ำชอก\nเจ้ามือหลอก กินเรียบ เงียบกริบเลย',
    insight:
      'ความรวยข้ามคืนมันไม่ได้มาง่าย ๆ นะลูก การลงทุนมีความเสี่ยง (โดยเฉพาะกับแผงหวย!) ทำงานหาเงินด้วยหยาดเหงื่อแรงงานชัวร์ที่สุด อย่ามัวแต่เก็งเลขเด็ดจนลืมทำมาหากินล่ะ',
  },
  {
    id: 12,
    title: 'เซียมซีฝืนธรรมชาติ',
    poem: 'ใบสิบสอง มองหา ผลกำไร\nหวังต้นไม้ ออกดอก นอกฤดู\nอัดฮอร์โมน โด๊ปยา สารพัดดู\nระวังชวด อดกินหรู ต้นพังเอย',
    insight:
      'จะทำกิจการใด ๆ ก็ต้องศึกษาให้ถึงแก่นนะลูก ฝืนจังหวะเวลาเร่งเอาผลไว ๆ เดี๋ยวระบบรวนหมด ปล่อยให้ทุกอย่างเติบโตตามสเต็ปของมัน แล้วจะยั่งยืนกว่ากันเยอะจ้ะ',
  },
  {
    id: 13,
    title: 'เซียมซีมาดนายแบบ/นางแบบ',
    poem: 'ใบสิบสาม ทายทัก เรื่องชักภาพ\nเห็นสภาพ คนรอบกาย คอยถือกล้อง\nทั้งพ่อและ น้องชาย คอยจับจอง\nเราแค่ต้อง โพสท่า ให้ดูดี',
    insight:
      'บางทีความสุขก็มาในรูปแบบให้คนรอบตัวหรือคนในครอบครัวได้ทำสิ่งที่เขารัก (เช่นเป็นตากล้องให้หนู) หนูก็แค่ทำตัวชิล ๆ เตรียมรอยยิ้มให้พร้อม การเป็นผู้รับความหวังดีบ้างก็สร้างความสุขให้ครอบครัวได้เหมือนกันนะลูก',
  },
  {
    id: 14,
    title: 'เซียมซีคนกลาง',
    poem: 'ใบสิบสี่ ชี้ว่า น่าปวดหัว\nต้องเอาตัว เป็นคนกลาง ห้ามทัพเขา\nซ้ายก็ด่า ขวาก็บ่น ทนหูเบา\nไกล่เกลี่ยเอา รอมชอมไว้ ปลอดภัยดี',
    insight:
      'ช่วงนี้หนูมีเกณฑ์ต้องเป็นคนกลางเคลียร์ปัญหาให้คนอื่นนะลูก ใช้เหตุผลกับการเจรจาจะช่วยให้คลี่คลาย แต่จำไว้ หนูมีหน้าที่แค่ชี้แนะ อย่าเอาเรื่องของเขามาแบกจนตัวเองเครียดตามล่ะ',
  },
  {
    id: 15,
    title: 'เซียมซีสับราง',
    poem: 'ใบสิบห้า คิวงาน สานพันผูก\nจัดไม่ถูก กะเช้าดึก สลับสับสน\nควงเวรยาว ไม่ได้พัก หนักเหลือทน\nร่างกายคน ไม่ใช่เหล็ก ระวังพัง',
    insight:
      'การจัดสรรตารางชีวิตสำคัญมากนะลูก ถ้าต้องวางแผนเวลาที่ซับซ้อน อย่าลืมเผื่อช่องให้ตัวเองได้หายใจบ้าง งานจะเดินหน้าได้ คนทำก็ต้องมีแรงด้วย จัดลำดับความสำคัญให้ดีจ้ะ',
  },
  {
    id: 16,
    title: 'เซียมซีวีไอ',
    poem: 'ใบสิบหก ตกผลึก เรื่องลงทุน\nงบกำไร คอยค้ำจุน หุ้นเติบโต\nอย่าไปตาม ข่าวปั่น จนหัวโน\nเน้นพื้นฐาน ก้อนโต รอรับเอย',
    insight:
      'ความสำเร็จทางการเงินจริง ๆ ไม่ได้มาจากการเก็งกำไรฉาบฉวยนะลูก แต่อยู่ที่วิเคราะห์เจาะลึกพื้นฐานของสิ่งที่เลือกลงทุน มองเกมยาว ๆ ไม่หวั่นไหวตามกระแส แล้วผลตอบแทนจะงอกเงยอย่างมั่นคง',
  },
  {
    id: 17,
    title: 'เซียมซีชีพจรลงเท้า',
    poem: 'ใบสิบเจ็ด เสร็จงาน ให้รีบเที่ยว\nไปเดินเลี้ยว ไหว้พระ ชมป่าเขา\nหาคาเฟ่ จิบกาแฟ ให้บรรเทา\nชาร์จไฟเข้า ร่างกาย ให้เปรมปรีดิ์',
    insight:
      'ทำงานหนักมาตลอด ถึงเวลาจัดทริปพักผ่อนได้แล้วลูก! ออกไปสูดอากาศตามธรรมชาติ ไหว้พระทำบุญ เปลี่ยนบรรยากาศบ้าง ได้ออกไปเห็นโลกกว้างจะช่วยรีเฟรชสมองให้กลับมาลุยงานได้ปังกว่าเดิม',
  },
  {
    id: 18,
    title: 'เซียมซีสายมู',
    poem: 'ใบสิบแปด แวดล้อม ด้วยของขลัง\nอยากจะปัง พึ่งเทพ ทุกทิศา\nเอฟกำไล สีมงคล เต็มพารา\nแต่ลืมตา ตื่นสาย ไม่ทำกิน',
    insight:
      'สิ่งศักดิ์สิทธิ์มีไว้เป็นที่พึ่งทางใจนะลูก แต่ความสำเร็จร้อยเปอร์เซ็นต์มาจากการลงมือทำ มูเตลูเสริมความมั่นใจน่ะทำได้ แต่ถ้าเอาแต่นอนรอโชคชะตา เทพองค์ไหนก็ประทานความสำเร็จมาเสิร์ฟถึงเตียงให้ไม่ได้จ้ะ',
  },
  {
    id: 19,
    title: 'เซียมซีน้ำตาลเรียกพี่',
    poem: 'ใบสิบเก้า เศร้าใจ เรื่องน้ำตาล\nชอบของหวาน ชานม ไข่มุกหนา\nสั่งหวานร้อย อร่อยลิ้น กินทุกครา\nตรวจขึ้นมา หมอมองหน้า พาใจสั่น',
    insight:
      'ความสุขชั่วคราวที่ปลายลิ้น อาจแลกมาด้วยปัญหาสุขภาพระยะยาวนะลูก เติมความหวานให้ชีวิตด้วยกิจกรรมสนุก ๆ ดีกว่าเติมน้ำตาลเข้าร่างกายทุกมื้อ ลดหวานลงนิด ชีวิตและหลอดเลือดจะอยู่กับเราอีกนาน',
  },
  {
    id: 20,
    title: 'เซียมซีฟ้าหลังฝน',
    poem: 'ใบยี่สิบ หยิบได้ ให้ยิ้มกว้าง\nแสงสว่าง ปลายอุโมงค์ เริ่มเฉิดฉาย\nที่เคยเหนื่อย เคยท้อ ค่อยผ่อนคลาย\nเรื่องเลวร้าย จะผ่านพ้น รับโชคดี',
    insight:
      'ทุกความพยายามที่หนูทุ่มเทกำลังจะผลิดอกออกผลแล้วลูก! ขอแค่รักษาความสม่ำเสมอและเชื่อมั่นในตัวเอง ความสำเร็จก้อนใหญ่อยู่ใกล้แค่เอื้อมแล้ว เตรียมฉลองได้เลยจ้ะ',
  },
  {
    id: 21,
    title: 'เซียมซีพรุ่งนี้ค่อยลด',
    poem: 'ใบยี่สิบเอ็ด เด็ดขาด เรื่องลดหุ่น\nพอบุฟเฟต์ หอมกรุ่น ใจสั่นไหว\nบอกพรุ่งนี้ ค่อยลด จะเป็นไร\nน้ำหนักพุ่ง ทะลุไป ไม่ลงเอย',
    insight:
      '"พรุ่งนี้ค่อยลด" คือคำโกหกคลาสสิกที่สุดในโลกนะลูก! อยากหุ่นปังสุขภาพดีต้องเริ่มตั้งแต่วันนี้ ตัดใจจากหมูกระทะชาบูบ้าง หันมากินผักขยับตัว เดี๋ยวร่างกายจะขอบคุณหนูไปอีกนาน',
  },
  {
    id: 22,
    title: 'เซียมซีสวยขี้เกียจ',
    poem: 'ใบยี่สิบสอง มองหน้า ครีมเต็มโต๊ะ\nหวังจะโบก ให้สวยโชว์ หน้าใสปิ๊ง\nแต่พอดึก ขี้เกียจทา หลับทิ้งดิ่ง\nตื่นมาวิ่ง สิวบุก ทุกข์ระทม',
    insight:
      'ความสำเร็จต้องแลกมาด้วยความขยันนะลูก ไม่ว่าเรื่องงานหรือเรื่องดูแลตัวเอง ซื้อครีมแพง ๆ มาแต่ไม่ค่อยหยิบใช้ มันจะไปเห็นผลได้ยังไง! วินัยคือสิ่งสำคัญ ทำอะไรให้สม่ำเสมอรับรองเป๊ะปังแน่นอน',
  },
  {
    id: 23,
    title: 'เซียมซีเพื่อนรักหักเหลี่ยม',
    poem: 'ใบยี่สิบสาม ถามถึง เรื่องมิตรสหาย\nตอนยืมเงิน แทบถวาย ชีพให้ฉัน\nพอถึงคิว ทวงคืน หายหน้าพลัน\nความสัมพันธ์ ขาดสะบั้น เพราะเงินทอง',
    insight:
      'เอ็นดูเขา เอ็นเราขาดนะลูก! ช่วงนี้ใครมาขอยืมเงินต้องใจแข็งเข้าไว้ คิดให้ดีว่ารับความเสี่ยงที่จะเสียทั้งเงินทั้งเพื่อนได้ไหม การปฏิเสธให้เป็นคือศิลปะเอาตัวรอด รักกันจริงชวนกันไปหาเงินดีกว่าให้ยืมจ้ะ',
  },
  {
    id: 24,
    title: 'เซียมซีเหยื่อการตลาด',
    poem: 'ใบยี่สิบสี่ ชี้ชัด เรื่องเอฟของ\nเห็นป้ายเซลล์ เป็นต้องพุ่ง ไปกดจ่าย\nของเต็มบ้าน ไม่ได้ใช้ เสียดายตาย\nสิ้นเดือนคล้าย สิ้นใจ ใครช่วยที',
    insight:
      'อาการ "ของมันต้องมี" ทำคนล้มละลายมานักต่อนักแล้วลูก ก่อนจะสแกนจ่ายลองสูดหายใจลึก ๆ ถามตัวเองดัง ๆ ว่า "จำเป็นจริงไหม?" จำไว้ ความมั่นคงเริ่มจากการออม ไม่ใช่กดของใส่ตะกร้ารัว ๆ',
  },
  {
    id: 25,
    title: 'เซียมซีเฟรนด์โซน',
    poem: 'ใบยี่สิบห้า ว่าด้วย เรื่องความรัก\nไปหลงชอบ เขาหนัก เขาไม่สน\nเป็นพี่น้อง ที่แสนดี ทุกข์ระทม\nได้แต่ชม เขาเดินไป กับใครกัน',
    insight:
      'อยู่ในสถานะ "คนคุย" หรือ "พี่น้องแสนดี" มันอึดอัดนะลูก ถ้าพยายามไปเขาก็ไม่เห็นค่า ถอยมาตั้งหลักดีกว่า หันมารักตัวเองเยอะ ๆ พัฒนาตัวเองให้ดูดีมีความสุข เดี๋ยวคนที่เห็นค่าเราก็เข้ามาเอง ไม่ต้องง้อใคร!',
  },
  {
    id: 26,
    title: 'เซียมซีผลไม้นอกฤดู',
    poem: 'ใบยี่สิบหก ตกฟาก เรื่องทุเรียน\nหวังจะเปลี่ยน ให้ออก นอกฤดู\nอัดสารพัด ฮอร์โมน เฝ้าคอยดู\nเพื่อเชิดชู ราคา พาชื่นใจ',
    insight:
      'ความสำเร็จชิ้นใหญ่ ๆ หรือผลตอบแทนสูง ๆ มักมาจากการลงแรงและใช้ความรู้มากกว่าปกตินะลูก จะปั้นอะไรให้ "ออกผลนอกฤดู" ต้องอาศัยทั้งจังหวะเวลาและความใส่ใจลึกซึ้ง ศึกษาให้รอบคอบ ผลที่ได้จะหอมหวานคุ้มเหนื่อยแน่นอน',
  },
  {
    id: 27,
    title: 'เซียมซีเปย์ตัวเอง',
    poem: 'ใบยี่สิบเจ็ด เช็ดน้ำตา อย่ามัวเศร้า\nรอแต่เขา เปย์ของขวัญ ฝันสลาย\nโดนเททิ้ง อกหัก มิเสื่อมคลาย\nเปย์ตัวเอง ใจสบาย ประเสริฐเอย',
    insight:
      'หยุดรอให้ใครมาสร้างความสุข หรือมัวหวังให้ใครมาซื้อของให้เถอะลูก เงินก็เงินเรา รสนิยมก็ของเรา อยากกินอะไรอร่อย ๆ อยากได้ของขวัญชิ้นไหน ป้าว่าจัดให้ตัวเองไปเลย! การรักตัวเองคือการลงทุนที่คุ้มที่สุด แถมไม่มีวันอกหักด้วยจ้ะ',
  },
  {
    id: 28,
    title: 'เซียมซีล่องภู',
    poem: 'ใบยี่สิบแปด แวดไป เที่ยวภูผา\nลานหินปุ่ม ร่องกล้า พาใจฝัน\nแวะคาเฟ่ ไหว้พระ ชิลทั้งวัน\nสามวันนั้น แสนสุข คลายทุกข์เอย',
    insight:
      'ร่างกายเริ่มส่งสัญญาณประท้วงแล้วล่ะลูก! ถึงเวลาจัดทริปสั้น ๆ สัก 3 วัน หนีความวุ่นวายไปรับลมเย็น ๆ ตามธรรมชาติ ไหว้พระ นั่งเหม่อในคาเฟ่ดี ๆ เปลี่ยนบรรยากาศพักผ่อน จะช่วยชาร์จไฟให้กลับมาพร้อมลุยทุกเรื่อง',
  },
  {
    id: 29,
    title: 'เซียมซีรอเก็บเกี่ยว ๒',
    poem: 'ใบยี่สิบเก้า เฝ้ารอ งบไตรมาส\nไม่เคยพลาด วิเคราะห์ เจาะพื้นฐาน\nหาหุ้นโต กำไร ไปอีกนาน\nถือทนทาน รวยแน่ แท้เชียวคุณ',
    insight:
      'อย่าปล่อยให้ความผันผวนระยะสั้นมาทำให้จิตใจสั่นคลอนนะลูก การลงทุนที่แท้จริงคือมองขาดถึงอนาคตและพื้นฐานที่แข็งแกร่ง รอคอยอย่างใจเย็นแล้วให้เวลามันเติบโต ใครใจนิ่งวิเคราะห์มาดี ผลลัพธ์สุดท้ายจะงอกเงยเป็นกอบเป็นกำ',
  },
  {
    id: 30,
    title: 'เซียมซีเชิดใส่คำคน',
    poem: 'ใบสามสิบ หยิบได้ ให้เลิกนอยด์\nอย่ามัวคอย แคร์คำคน จนหมองหม่น\nใครจะนิน- ทาบ้าง ช่างหัวคน\nรักตัวเอง ให้หลุดพ้น สบายใจ',
    insight:
      'เราทำตัวให้ถูกใจคนทั้งโลกไม่ได้หรอกลูก ใครจะวิจารณ์หรือนินทาลับหลังยังไง ปล่อยเขาไปเถอะ เขาไม่ได้มาช่วยหนูจ่ายค่าน้ำค่าไฟสักหน่อย เอาเวลาที่มัวแคร์สายตาคนอื่น มาโฟกัสที่ความสุขและดูแลใจตัวเองดีกว่า สวย หล่อ แล้วรวยความสุขในแบบของหนูก็พอแล้วจ้ะ',
  },
  {
    id: 31,
    title: 'เซียมซีบนยอดดอย',
    poem: 'ใบสามสิบเอ็ด เด็ดสุด เรื่องลงทุน\nเห็นกราฟพุ่ง ชุลมุน รีบพุ่งใส่\nพอกดซื้อ กราฟดิ่ง ลงเหวไป\nติดดอยหนาว จับใจ ไปอีกนาน',
    insight:
      'ความกลัวตกรถนี่แหละลูก ทำคนพอร์ตแตกมานักต่อนักแล้ว! เห็นคนอื่นเขากำไรก็อยากบวกกับเขาบ้าง แต่ลืมดูจังหวะ ลืมศึกษาข้อมูลให้ดี สุดท้ายได้ไปนั่งหนาวเป็นผู้พิทักษ์ยอดดอย คราวหน้าใจเย็น ๆ ศึกษาให้ชัวร์ก่อนค่อยควักเงินนะจ๊ะ',
  },
  {
    id: 32,
    title: 'เซียมซีตั๋วฟรีมีเงื่อนไข',
    poem: 'ใบสามสิบสอง ส่องดวง เรื่องเดินทาง\nเตรียมจัดวาง กระเป๋า ไปต่างที่\nโชคหล่นทับ ได้ตั๋วเที่ยว แบบฟรีฟรี\nแต่วันลา ดันไม่มี อดไปเอย',
    insight:
      'ดวงโชคลาภเรื่องเดินทางของหนูกำลังมาแรงเชียวลูก! เตรียมแพ็กกระเป๋าไปสูดอากาศตามธรรมชาติ หรือไปเที่ยวชมวัฒนธรรมได้เลย เผลอ ๆ มีสปอนเซอร์ใจดีเปย์ค่าใช้จ่ายให้อีก แต่ตัวสกัดดาวรุ่งมีอย่างเดียวคือ "เวลา" ก่อนจะแพลนทริปหรือรับปากใคร รีบกางตารางงานเคลียร์คิวให้ลงตัวแต่เนิ่น ๆ นะ ไม่งั้นโชคมาจ่ออยู่ตรงหน้าแล้วได้แต่มองตั๋วฟรีตาปริบ ๆ',
  },
  {
    id: 33,
    title: 'เซียมซีเดอะแบก',
    poem: 'ใบสามสิบสาม ถามเรื่อง เพื่อนร่วมงาน\nโปรเจกต์บาน งานงอก ช่วยกันไหม\nหัวหน้าสั่ง ปุ๊บปั๊บ หายตัวไว\nเหลือเราทำ เดี่ยวไป เหงาใจจริง',
    insight:
      'บางที "Teamwork" มันก็แปลว่า "เราทำงาน ส่วนเพื่อนเป็นทีมเชียร์" นั่นแหละลูก! หัดปฏิเสธให้เป็น หรือแบ่งงานให้ชัดตั้งแต่แรก อย่าทำตัวเป็นเดอะแบกหอบงานทั้งบริษัทมาทำคนเดียว เขาจ้างหนูแค่ตำแหน่งเดียวนะ ไม่ใช่ตำแหน่ง CEO จ้ะ',
  },
  {
    id: 34,
    title: 'เซียมซีตากชุด',
    poem: 'ใบสามสิบสี่ ชี้ชัด เรื่องหุ่นฟิต\nซื้อชุดรัด แนบสนิท ดูหรูหรา\nซื้อมาแพง แขวนตู้ ดูเต็มตา\nวิ่งซ้ายขวา แค่ในห้าง ก็หอบกิน',
    insight:
      'มีแพสชั่นซื้อชุดออกกำลังกาย แต่ดันไม่มีแพสชั่นไปยิมซะงั้นลูก! ใส่ชุดกีฬาเดินห้างมันไม่ช่วยเผาผลาญไขมันหรอกนะ ลองหยิบชุดสวย ๆ ในตู้มาใส่วิ่งสวนสาธารณะ หรือออกกำลังที่บ้านวันละ 20 นาทีดู เดี๋ยวร่างกายจะขอบคุณหนูเอง',
  },
  {
    id: 35,
    title: 'เซียมซีติดบ้าน',
    poem: 'ใบสามสิบห้า พึ่งพา สิ่งศักดิ์สิทธิ์\nหวังพรหมลิขิต ส่งคู่ มาเคียงข้าง\nไหว้พระแม่ ขอเนื้อคู่ ดูสักทาง\nแต่ไม่ออก จากบ้านบ้าง จะเจอใคร',
    insight:
      'ไหว้ขอพรจนสิ่งศักดิ์สิทธิ์ทุกสำนักจำชื่อหนูได้แล้ว แต่ดันกลับมาหมกตัวดูซีรีส์อยู่แต่ในห้อง แล้วกามเทพที่ไหนจะหาตัวหนูเจอล่ะลูก! อยากมีความรักก็ต้องพาตัวเองออกไปเจอสังคมใหม่ ๆ ไปทำกิจกรรม เปิดโอกาสให้คนดี ๆ ได้เข้ามารู้จักบ้างจ้ะ',
  },
  {
    id: 36,
    title: 'เซียมซีตารางสีมงคล',
    poem: 'ใบสามสิบหก ตลก เรื่องสีเสื้อ\nจัดเต็มเผื่อ โชคดี ศรีสวัสดิ์\nตารางสี มงคล ท่องจำชัด\nแต่ดันจัด งานพลาด โดนด่าเอย',
    insight:
      'ใส่เสื้อสีมงคลเป๊ะแค่ไหน ก็ไม่สู้ความรอบคอบในการทำงานหรอกลูก! สีเสื้อกับสิ่งศักดิ์สิทธิ์ช่วยเสริมความมั่นใจได้ก็จริง แต่ถ้าทำงานพลาดหรือสะเพร่า เทพองค์ไหนก็ดลใจให้เจ้านายหายโมโหไม่ทันหรอก สติสำคัญกว่าสีเสื้อนะจ๊ะ',
  },
  {
    id: 37,
    title: 'เซียมซีประชุมร้อยชั่วโมง',
    poem: 'ใบสามสิบเจ็ด บ่นเสร็จ เรื่องประชุม\nโดนเรียกสุม หัวกัน พาหวั่นไหว\nถกปัญหา ยืดยาว ไม่ถึงไหน\nสรุปได้ แค่สั่งงาน ผ่านไลน์เอย',
    insight:
      'บางการประชุมก็แค่อยากหาคนมานั่งฟังเฉย ๆ นั่นแหละลูก! ใบนี้เตือนให้หนูรู้จักบริหารเวลา เรื่องไหนจบได้ด้วยพิมพ์แชทหรือส่งอีเมล ก็อย่าเสียเวลาเรียกประชุมเลย เอาเวลาไปปั่นงานที่กองบนโต๊ะให้เสร็จดีกว่า จะได้ไม่ต้องเลิกงานดึกจ้ะ',
  },
  {
    id: 38,
    title: 'เซียมซีโดนของ',
    poem: 'ใบสามสิบแปด แผดร้อง โอ๊ยปวดหลัง\nนั่งเก้าอี้ จนพัง ร่างสลาย\nบ่าและคอ ตึงเปรี๊ยะ ทรมานกาย\nนึกว่าโดน ของร้าย ที่แท้แก่เอง',
    insight:
      'อาการปวดคอ บ่า ไหล่ ที่เป็นทุกวันนี้ ไม่ได้โดนผีอำหรือใครทำของใส่หรอกลูก... มันคือ "ออฟฟิศซินโดรม" ต่างหาก! ลุกขึ้นมายืดเส้นยืดสายบ้าง ปรับท่านั่งให้ถูก หรือควักเงินไปหาหมอนวดกายภาพซะ อย่ามัวแต่ทนปวดแล้วโทษเวรกรรมนะจ๊ะ',
  },
  {
    id: 39,
    title: 'เซียมซีวอลเปเปอร์เรียกทรัพย์',
    poem: 'ใบสามสิบเก้า ว่าด้วย วอลเปเปอร์\nโหลดมาเพ้อ หวังรวย ทรัพย์ล้นหลาม\nเทพเจ้า เรียงหน้าจอ ทุกโมงยาม\nแต่พอถาม การใช้จ่าย เทพหายเลย',
    insight:
      'จะตั้งวอลเปเปอร์เป็นเทพเจ้าแห่งโชคลาภหรือไพ่เรียกทรัพย์น่ะทำได้ลูก แต่อย่าลืมว่าถ้ายังเอฟของรัว ๆ ใช้เงินเกินตัว เทพก็ดึงสติกระเป๋าตังค์หนูไม่ไหวหรอก โชคลาภมันวิ่งเข้าหาคนที่รู้จักเก็บออมและวางแผนการเงินเท่านั้นนะจ๊ะ',
  },
  {
    id: 40,
    title: 'เซียมซีโบนัสทิพย์',
    poem: 'ใบสี่สิบ หยิบดู เรื่องโบนัส\nหวังจะได้ เงินยัด เต็มกระเป๋า\nทำงานหนัก ทั้งปี ไม่มีเบา\nนายบอกเรา เศรษฐกิจ ปีนี้พัง',
    insight:
      'อย่าฝากความหวังทั้งหมดไว้กับโบนัสปลายปีเลยลูก เพราะคำว่า "เศรษฐกิจไม่ดี" มันเป็นข้ออ้างคลาสสิกที่เจ้านายชอบใช้! ให้รางวัลตัวเองด้วยความภูมิใจในผลงานที่ทำมาทั้งปีก็พอ แต่อย่าเพิ่งรีบไปสร้างหนี้ก้อนโตเผื่อรอเงินโบนัสเด็ดขาด เผื่อใจไว้บ้างจะได้ไม่เจ็บหนักจ้ะ',
  },
];

/**
 * 🥠 ชุดอังกฤษ (แอป global) — Fortune Sticks 40 ใบ กลอนสัมผัส + "Thought to Ponder" โทนคุณป้าอบอุ่น
 */
const SIAMSI_EN: SiamsiStick[] = [
  {
    id: 1,
    title: 'The Empty Wallet',
    poem: "Number one says your funds are low,\nWhere did your money really go?\nYou wish for wealth to come your way,\nBut you just bought ten things today!",
    insight:
      "This card says your luck isn't bad, you're just losing to your own temptations, my child! Stop adding things to your cart and resist those sales for a bit. Do that, and the money will start rolling in!",
  },
  {
    id: 2,
    title: 'The Single Life',
    poem: "Number two says you want a mate,\nBut you keep skipping every date.\nYou pray for love that's purely gold,\nJust hug your pillow till you're old!",
    insight:
      "Don't just grab anyone out of loneliness, my child. Being single, rich, and gorgeous is way better than letting a toxic person burn your heart. If you haven't found someone amazing yet, staying home and binge-watching series is much safer!",
  },
  {
    id: 3,
    title: 'The Procrastinator',
    poem: "Number three says your work is piled,\nWhile you are scrolling like a child.\nThe deadline's near, you start to sweat,\nBecause you haven't started yet!",
    insight:
      "Work will only get done when you actually start doing it, my child! Scrolling through your feed to relieve stress won't make the workload magically shrink. Success doesn't come to those who just daydream. Get up and clear it out—your bonus is waiting!",
  },
  {
    id: 4,
    title: 'The Endless Diet',
    poem: "Number four says your pants are tight,\nYou eat the buffet every night.\nYou swear you'll hit the gym today,\nBut order pizza anyway!",
    insight:
      "Your body can still handle it, but you have to resist all that food sometimes, my child! Your body isn't a trash can. Move around and exercise a little bit every day. It's much better than giving all your hard-earned money to the doctor later!",
  },
  {
    id: 5,
    title: 'The Social Media Envy',
    poem: "Number five says to drop the phone,\nYou scroll all night and feel alone.\nYou envy posts that look so bright,\nBut they just used a filter's light!",
    insight:
      "Our life is good in its own way, my child. Don't tie your happiness to likes or other people's perfectly filtered photos on social media. Put the screen down for a bit and look at the real happiness around you. You'll realize just how lucky you already are!",
  },
  {
    id: 6,
    title: 'The Stock Market Trap',
    poem: "Number six says you bought a stock,\nHoping your wealth would truly rock.\nIt turned from green to bloody red,\nNow you are broke and stay in bed!",
    insight:
      "Investing has risks, my child! This card warns you not to be gullible or greedy enough to go all-in. Study the facts carefully. Slow and steady wins the race. It's much better than rushing to get rich and ending up freezing on the mountaintop!",
  },
  {
    id: 7,
    title: 'The Gossip Queen/King',
    poem: "Number seven says you love to speak,\nBut into drama you always peek.\nYou mind the business of your friends,\nIn court is where this story ends!",
    insight:
      "Your stars are clashing right now, my child. It's best to step back and avoid arguments. Silence is golden! Arguing to win over things that aren't your business only ruins your mental health and makes things worse. Focus on your own life instead!",
  },
  {
    id: 8,
    title: 'The Panda Eyes',
    poem: "Number eight shows your panda eyes,\nYou stay awake until sunrise.\nYou watch your shows and never sleep,\nSoon doctor bills will make you weep!",
    insight:
      "The human body isn't a machine, my child. I know you have work to finish or a series to binge, but enough sleep is the best medicine. If you keep pushing it, the money you earn will just turn into doctor bills. Turn off the screen and go to sleep!",
  },
  {
    id: 9,
    title: 'The Favored One',
    poem: "Number nine brings a lucky break,\nThe boss will help for goodness' sake.\nBut don't get lazy, don't get slow,\nOr out the door you'll quickly go!",
    insight:
      "Good opportunities are coming because you have older people supporting you, my child. But remember, luck is nothing without your own effort. When you get the chance, work hard and stay humble. That's how success stays with you for a long time!",
  },
  {
    id: 10,
    title: 'The Patient Gardener',
    poem: "Number ten tells you not to cry,\nYour grand success is drawing nigh.\nYou cannot force a tree to grow,\nJust give it time and take it slow!",
    insight:
      "The things you're hoping for won't happen instantly like pushing a button, my child. It takes patience. Keep watering and tending to your goals, and don't rush things too much. When the right season comes, the success will definitely be worth the wait!",
  },
  {
    id: 11,
    title: 'The Caffeine Addict',
    poem: "Number eleven shows your coffee cup,\nIt takes three shots to wake you up.\nYou spend your paycheck on caffeine,\nAnd still feel like a tired machine!",
    insight:
      "You can't fix exhaustion with seven-dollar iced coffees, my child! If you're constantly tired, maybe it's time to actually go to bed early instead of watching another true-crime documentary. Drink some water, save your money, and get some real sleep!",
  },
  {
    id: 12,
    title: 'The DIY Disaster',
    poem: "Number twelve brings a weekend plan,\nTo build a shelf like a handy man.\nYou threw the manual on the floor,\nAnd now it blocks your bedroom door!",
    insight:
      "Confidence is great, my child, but instructions exist for a reason! Don't be too stubborn to ask for help or read the manual. Sometimes, trying to do everything yourself just leaves you with a wobbly table and missing screws. Put your pride aside and do it right!",
  },
  {
    id: 13,
    title: 'The Toxic Ex',
    poem: "Number thirteen warns of late-night texts,\nFrom very toxic, crazy exes.\nThey say they've changed and miss your face,\nJust block the number, leave no trace!",
    insight:
      "Stop reading old chapters hoping for a different ending, my child. If they were a walking red flag back then, they still are now. Don't let a moment of loneliness make you reply to that text. Go eat a snack and go to sleep—you'll thank me in the morning!",
  },
  {
    id: 14,
    title: 'The Subscription Trap',
    poem: "Number fourteen sees your streaming bills,\nFor movies, shows, and spooky thrills.\nYou pay for five, but watch just one,\nThe same old sitcom just for fun!",
    insight:
      "You are paying fifty dollars a month just to re-watch a show from ten years ago, my child! Cancel those subscriptions you never use. Small leaks sink great ships. Be smart with your money so you have it when you actually need it!",
  },
  {
    id: 15,
    title: 'The Crystal Manifestor',
    poem: "Number fifteen sees your crystal stones,\nYou blame the planets in your bones.\n\"It's retrograde!\" you cry and weep,\nBut you just overslept your sleep!",
    insight:
      "You can't blame all your life choices on the stars, my child. Mercury being in retrograde didn't make you late for work; hitting snooze five times did! Take accountability for your actions. Manifesting only works if you actually get up and put in the effort!",
  },
  {
    id: 16,
    title: 'The Golden Opportunity',
    poem: "Number sixteen says you're on the rise,\nPrepare yourself for a big surprise!\nThe boss finally sees your brilliant spark,\nYou knocked that project out of the park!",
    insight:
      "Good news in your career is coming, my child! All those late nights and hard work are finally paying off. Step into the spotlight and claim your reward. Just stay humble and keep doing your best—your future is looking brighter than ever!",
  },
  {
    id: 17,
    title: 'The Forgotten Cash',
    poem: "Number seventeen is bright and funny,\nYou are about to stumble onto money!\nDeep in the pocket of an old winter coat,\nYou'll find a crisp, green hundred-dollar note!",
    insight:
      "Financial luck is on your side, my child! Whether it's finding forgotten cash in the laundry, winning a small prize, or getting a surprise refund, extra money is heading your way. Treat yourself to something nice, you completely deserve it!",
  },
  {
    id: 18,
    title: 'The Sweet Romance',
    poem: "Number eighteen points to love and grace,\nA giant smile will cross your face!\nSomeone who loves your quirky little ways,\nWill bring pure magic to your upcoming days!",
    insight:
      "Your love life is about to blossom, my child! Whether you are single and about to meet someone who truly gets you, or your current relationship is leveling up, your heart will be full. You deserve to be treated like royalty, so enjoy every romantic second of it!",
  },
  {
    id: 19,
    title: 'The Sudden Getaway',
    poem: "Number nineteen tells you: pack your bags!\nGrab your passport and your luggage tags.\nA lucky trip is suddenly drawing near,\nWith ocean waves and skies so bright and clear!",
    insight:
      "It's time for a well-deserved break, my child! The universe is handing you a wonderful chance to travel, relax, and maybe even get a lucky free upgrade! Say yes to the adventure. You've been working way too hard, now go enjoy the sunshine and recharge your beautiful soul!",
  },
  {
    id: 20,
    title: 'The Glowing Health',
    poem: "Number twenty says you're looking fine,\nYour skin is clear and starts to shine!\nNo random backaches, not a single sneeze,\nYou'll breeze through life with total ease!",
    insight:
      "Your health and energy are at their absolute peak right now, my child! You're going to feel like you can conquer the world without even needing an afternoon nap. Use this fantastic energy to do things you love. Keep taking good care of yourself—that healthy glow looks gorgeous on you!",
  },
  {
    id: 21,
    title: 'The Tuesday Trap',
    poem: "Number twenty-one says you wait for the day,\nWhen all of your troubles will vanish away.\nYou wait for the weekend to finally live,\nBut today has a beautiful moment to give!",
    insight:
      "Stop treating your weekdays like a waiting room for the weekend, my child! Life is happening right now, even on a boring Tuesday afternoon. If you keep waiting for everything to be perfectly stress-free before you start enjoying life, you'll be waiting forever. Wear your best outfit and use the fancy plates today!",
  },
  {
    id: 22,
    title: 'The Burnt Pie',
    poem: "Number twenty-two shows a burnt apple pie,\nYou ruined the crust and you started to cry.\nBut nobody learns if they don't make a mess,\nYour very next try will be a success!",
    insight:
      "Don't be so terrified of failing that you never even try, my child! Every master was once a beginner who burned the pie a few times. Mistakes aren't the opposite of success; they are simply part of the recipe. Forgive yourself for messing up, laugh it off, and try again tomorrow with a little more wisdom!",
  },
  {
    id: 23,
    title: 'The Scenic Route',
    poem: "Number twenty-three says you drive the same street,\nYou stick to the map so your life is complete.\nBut magic is found when you wander away,\nGo take the long road and get lost for a day!",
    insight:
      "Comfort zones are cozy, my child, but nothing beautiful ever grows there! If you do the exact same thing every single day, you'll look back and realize you just lived the same year seventy times. Take a different route, try a weird hobby, or step into the unknown. A fully lived life requires a little bit of adventure!",
  },
  {
    id: 24,
    title: 'The Rearview Mirror',
    poem: "Number twenty-four has you looking behind,\nAt chapters of sorrow stuck deep in your mind.\nThe rearview mirror is tiny and small,\nThe windshield ahead is the biggest of all!",
    insight:
      "You can't drive forward safely if you keep staring into the rearview mirror, my child! Stop obsessing over past mistakes or the opportunities you missed. What's done is done. Focus on the big, wide windshield right in front of you. Your best days are still on the road ahead, so keep moving forward!",
  },
  {
    id: 25,
    title: 'The Nosey Neighbor',
    poem: "Number twenty-five warns of eyes that peek,\nA neighbor watching you every week.\nThey judge your lawn and your trash cans too,\nJust close the blinds and ignore the view!",
    insight:
      "Don't let petty people ruin your peace, my child! Someone might be judging how you manage your life, but it's your house and your rules. Let them worry about their own messy garage while you stay unbothered and perfectly happy inside your own home!",
  },
  {
    id: 26,
    title: 'The Career Climb',
    poem: "Number twenty-six is about your grind,\nYou work so hard, but you feel behind.\nDon't pack your desk and decide to quit,\nYour breakthrough is coming in just a bit!",
    insight:
      "Your efforts are not invisible, my child. Sometimes it feels like you're just running on a treadmill, but you're actually climbing a mountain. Keep doing your best, stay professional, and the reward will come when the time is right. Don't give up on your goals just yet!",
  },
  {
    id: 27,
    title: 'The Flowing Wealth',
    poem: "Number twenty-seven is about your gold,\nYou try to save it until you're old.\nBut money flows out like a running stream,\nStart budgeting now to protect your dream!",
    insight:
      "Wealth isn't just about how much you make, it's about how much you keep, my child! Stop letting your money slip through your fingers on things you don't really need. Build a solid foundation and start saving now, and your future self will thank you for the peace of mind!",
  },
  {
    id: 28,
    title: "The Heart's Mirror",
    poem: "Number twenty-eight is about your heart,\nYou're waiting for true romance to start.\nBut before you look for a perfect pair,\nTreat your own soul with the utmost care!",
    insight:
      "You can't pour from an empty cup, my child. If you want a healthy and beautiful relationship, you have to start by loving yourself first. Know your worth, set your boundaries, and the right person will naturally gravitate toward your shining energy!",
  },
  {
    id: 29,
    title: "The Body's Temple",
    poem: "Number twenty-nine is your physical state,\nYou carry the world and its heavy weight.\nYour shoulders are tense and your energy drops,\nTake time to rest before everything stops!",
    insight:
      "Your health is your truest wealth, my child. No job, deadline, or stress is worth burning yourself out until you crash. Listen to your body, eat nourishing food, and get some proper rest. Taking a break isn't being lazy; it's exactly what you need to keep going strong!",
  },
  {
    id: 30,
    title: 'The Unique Path',
    poem: "Number thirty warns of a looking glass,\nYou stare at the others as they go past.\nYou think that they're winning the human race,\nBut life is a journey, so find your pace!",
    insight:
      "Stop comparing your Chapter 1 to someone else's Chapter 20, my child. Everyone is walking their own path and fighting battles you know nothing about. Focus on your own growth, celebrate your small wins, and trust your own timing. You are exactly where you need to be!",
  },
  {
    id: 31,
    title: 'The Winds of Change',
    poem: "Number thirty-one brings a change in the wind,\nYou're scared of the place where the new road begins.\nThe chapters are turning, it's time to let go,\nEmbrace the new journey and go with the flow!",
    insight:
      "Change is the only constant in life, my child. Stop clinging to the past or stressing over how things \"used to be.\" New chapters might seem scary at first because they are unfamiliar, but they always bring new opportunities. Adapt, grow, and step forward with an open mind!",
  },
  {
    id: 32,
    title: 'The Inner Compass',
    poem: "Number thirty-two says you're lost in a maze,\nYou ask everyone for advice nowadays.\nBut deep in your mind is the answer you seek,\nJust quiet the noise and let intuition speak!",
    insight:
      "Stop asking twenty different people for their opinions on your own life, my child! You already know what you need to do deep down in your gut. Trust your instincts and be confident in your choices. You are much wiser and stronger than you give yourself credit for!",
  },
  {
    id: 33,
    title: 'The Hidden Spark',
    poem: "Number thirty-three shows a spark in your eye,\nA talent you're hiding and leaving to dry.\nDon't worry about being the best in the land,\nJust pick up the brush or the tools in your hand!",
    insight:
      "You are meant to do more than just work and pay bills, my child! Don't let your passions fade just because you think you aren't \"perfect\" at them. Paint poorly, sing off-key, or write messy stories. True joy is found in the doing, not just in winning a prize!",
  },
  {
    id: 34,
    title: 'The Social Circle',
    poem: "Number thirty-four looks at friends that you keep,\nSome lift you up high, others put you to sleep.\nIt's quality, darling, not numbers that count,\nKeep only the gold in your social account!",
    insight:
      "You become like the people you surround yourself with, my child. If someone constantly drains your energy or brings unnecessary drama into your life, it's perfectly okay to create some distance. Surround yourself with people who clap for your success and support you in your struggles!",
  },
  {
    id: 35,
    title: 'The Daily Joy',
    poem: "Number thirty-five says you're chasing the sun,\nYou think that you'll smile when the big prize is won.\nBut look at your coffee and look at the sky,\nThere's joy in the moments that keep passing by!",
    insight:
      "Happiness isn't a destination you arrive at someday, my child! If you wait until everything in your life is absolutely perfect to be happy, you'll be waiting forever. Start noticing the little good things every single day. A grateful heart naturally attracts more things to be grateful for!",
  },
  {
    id: 36,
    title: 'The Bucket List',
    poem: "Number thirty-six says the clock's ticking fast,\nDon't let your best years become just the past.\nTake the big leap and go do what you crave,\nYou can't take your money right into the grave!",
    insight:
      "Don't wake up at eighty years old wishing you had lived more boldly, my child! Stop waiting for the \"perfect time\" to travel or try something new, because tomorrow is never promised. Buy the ticket, eat the cake, and take the risk. A life filled with \"oh well\" is so much better than a life filled with \"what if\"!",
  },
  {
    id: 37,
    title: 'The Simple Joys',
    poem: "Number thirty-seven brings joy to your soul,\nYou're trying too hard to achieve every goal.\nBut look at the sunset and feel the warm breeze,\nTrue happiness lives in small moments like these!",
    insight:
      "You are running so fast chasing success that you're forgetting to actually live, my child. True happiness isn't locked inside a bank vault or a fancy job title. It's in the quiet mornings, a good cup of coffee, and laughing with people you love. Slow down, breathe, and enjoy the ride while you're on it!",
  },
  {
    id: 38,
    title: 'The Magic of Pages',
    poem: "Number thirty-eight puts a book in your hand,\nTo travel in time to a faraway land.\nEach page that you turn is a lesson to learn,\nA spark in your mind that will suddenly burn!",
    insight:
      "Never stop reading and expanding your beautiful mind, my child! A single book can give you the wisdom of a whole lifetime. When you read, you get to live a thousand different lives and see the world through a thousand different eyes. Keep feeding your brain with good stories, and you'll never be bored or alone!",
  },
  {
    id: 39,
    title: 'The Drama-Free Life',
    poem: "Number thirty-nine says to let it all go,\nThe anger and grudges that put on a show.\nYour time is too precious to waste being mad,\nJust focus on good things and never the bad!",
    insight:
      "Life is way too short to hold onto bitterness, my child! Don't spend your precious years arguing with fools or worrying about people who don't even matter in the grand scheme of things. Forgive, forget, and move on. You want to look back at a life filled with peace and laughter, not unnecessary drama!",
  },
  {
    id: 40,
    title: 'The Authentic Soul',
    poem: "Number forty tells you to take off the mask,\nTo please everyone is an impossible task.\nLive for yourself, let your spirit run free,\nAnd you will be happy as happy can be!",
    insight:
      "Stop living your life to meet everyone else's expectations, my child! When you are sitting in a rocking chair in your old age, you won't care about what the neighbors thought of you. You will only care if you stayed true to yourself. Be brave, be wonderfully weird, be authentic, and write a story you'll be incredibly proud to tell!",
  },
];

/** ชุดที่ใช้จริง — เลือกตามภาษาของแอป (thai/global) */
export const SIAMSI: SiamsiStick[] = IS_GLOBAL ? SIAMSI_EN : SIAMSI_TH;
