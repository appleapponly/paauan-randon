/**
 * 🎨 สร้างไอคอนแอปจากรูปป้าอ้วน (happy) วางบนพื้นชมพูแบรนด์
 * ผลลัพธ์:
 *   assets/icon.png                      — ไอคอนหลัก (iOS/ทั่วไป) 1024x1024 พื้นชมพู
 *   assets/favicon.png                   — ไอคอนเว็บ 256x256
 *   assets/android-icon-foreground.png   — ชั้นหน้า adaptive (โปร่งใส มีแต่ตัวป้า อยู่ใน safe zone)
 *   assets/android-icon-background.png    — ชั้นหลัง adaptive (ชมพูล้วน)
 *
 * รัน: node scripts/generate-icon.mjs
 */
import { Jimp } from 'jimp';

const PINK = 0xe63956ff;
const TRANSPARENT = 0x00000000;
const MASCOT = 'assets/images/paa-uan-happy.png';

/** วางรูปป้า (สเกลตามสัดส่วนความสูง) กึ่งกลางบนผืนผ้าใบสีที่กำหนด */
async function makeCanvas(size, heightRatio, bgColor, biasY = 0) {
  const canvas = new Jimp({ width: size, height: size, color: bgColor });
  const m = await Jimp.read(MASCOT);
  const targetH = Math.round(size * heightRatio);
  const scale = targetH / m.bitmap.height;
  const targetW = Math.round(m.bitmap.width * scale);
  m.resize({ w: targetW, h: targetH });
  const x = Math.round((size - targetW) / 2);
  const y = Math.round((size - targetH) / 2 + biasY);
  canvas.composite(m, x, y);
  return canvas;
}

// 1) ไอคอนหลัก — พื้นชมพู ตัวป้าใหญ่ ๆ ดันลงล่างนิดให้หัวไม่ชนขอบ
const icon = await makeCanvas(1024, 0.86, PINK, 40);
await icon.write('assets/icon.png');

// 2) favicon — ย่อจากไอคอนหลัก
const fav = icon.clone();
fav.resize({ w: 256, h: 256 });
await fav.write('assets/favicon.png');

// 3) ชั้นหน้า adaptive (Android) — โปร่งใส ตัวป้าเล็กลงให้อยู่ใน safe zone (กันโดน mask ตัด)
const fg = await makeCanvas(1024, 0.6, TRANSPARENT, 30);
await fg.write('assets/android-icon-foreground.png');

// 4) ชั้นหลัง adaptive — ชมพูล้วน
const bg = new Jimp({ width: 1024, height: 1024, color: PINK });
await bg.write('assets/android-icon-background.png');

console.log('✓ สร้างไอคอนครบแล้ว: icon.png, favicon.png, android-icon-foreground.png, android-icon-background.png');
