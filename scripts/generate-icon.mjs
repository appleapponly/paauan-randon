/**
 * 🎨 สร้างไอคอนแอปจากรูปหน้าป้าอ้วน (509855.jpg พื้นเหลือง)
 * ผลลัพธ์:
 *   assets/icon.png                      — ไอคอนหลัก (iOS/ทั่วไป) 1024x1024 เต็มเฟรม
 *   assets/favicon.png                   — ไอคอนเว็บ 256x256
 *   assets/android-icon-foreground.png   — ชั้นหน้า adaptive (ย่อหน้าป้าให้อยู่ใน safe zone)
 *   assets/android-icon-background.png    — ชั้นหลัง adaptive (สีเหลืองล้วน ดึงจากรูป)
 *
 * รัน: node scripts/generate-icon.mjs
 */
import { Jimp } from 'jimp';

const SRC = 'assets/images/509855.jpg';

const src = await Jimp.read(SRC);

// ดึงสีพื้น (เหลือง) จากมุมบนซ้ายของรูป เพื่อใช้เป็นพื้น adaptive ให้เนียนต่อเนื่อง
const { data } = src.bitmap;
const bgR = data[(8 * src.bitmap.width + 8) * 4 + 0];
const bgG = data[(8 * src.bitmap.width + 8) * 4 + 1];
const bgB = data[(8 * src.bitmap.width + 8) * 4 + 2];
const hex = `#${[bgR, bgG, bgB].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
const bgColor = ((bgR << 24) | (bgG << 16) | (bgB << 8) | 0xff) >>> 0;

/** วางหน้าป้า (ย่อตามสัดส่วน) กึ่งกลางบนพื้นเหลือง เพื่อให้เห็นหน้าครบ ไม่ล้นกรอบ */
function placeOnYellow(size, ratio) {
  const canvas = new Jimp({ width: size, height: size, color: bgColor });
  const face = src.clone();
  face.cover({ w: size, h: size }); // ปรับเป็นจตุรัส 1024 ก่อน
  face.scale(ratio); // แล้วย่อลงให้มีขอบเหลืองรอบ ๆ
  const off = Math.round((size - face.bitmap.width) / 2);
  canvas.composite(face, off, off);
  return canvas;
}

// 1) ไอคอนหลัก — ย่อหน้าป้าให้เห็นครบ มีขอบเหลืองรอบ ไม่ล้นกรอบ
const icon = placeOnYellow(1024, 0.82);
await icon.write('assets/icon.png');

// 2) favicon — ย่อจากไอคอนหลัก
const fav = icon.clone();
fav.resize({ w: 256, h: 256 });
await fav.write('assets/favicon.png');

// 3) ชั้นหน้า adaptive — ย่อมากกว่าเดิมให้พ้น safe zone (กันมาส์กวงกลม/มนตัดหัวป้า)
const fg = placeOnYellow(1024, 0.68);
await fg.write('assets/android-icon-foreground.png');

// 4) ชั้นหลัง adaptive — เหลืองล้วน
const bg = new Jimp({ width: 1024, height: 1024, color: bgColor });
await bg.write('assets/android-icon-background.png');

console.log(`✓ สร้างไอคอนครบแล้ว — สีพื้น adaptive = ${hex} (เอาไปใส่ app.json ด้วย)`);
