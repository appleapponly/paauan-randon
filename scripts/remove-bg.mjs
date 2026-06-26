/**
 * ลบพื้นหลังดำของรูปป้าอ้วนให้โปร่งใส (transparent PNG)
 * วิธี: flood-fill จากขอบทั้ง 4 ด้าน ลบเฉพาะพิกเซลดำที่ "ต่อเนื่องจากขอบ"
 * เส้นขอบดำของตัวการ์ตูน (ตา/ปาก/เส้นรอบ) ถูกล้อมด้วยขอบสติกเกอร์สีขาว จึงไม่โดนลบ
 *
 * รันด้วย:  node scripts/remove-bg.mjs <ไฟล์เข้า> <ไฟล์ออก>
 */
import { Jimp } from 'jimp';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('ใช้: node scripts/remove-bg.mjs <in> <out>');
  process.exit(1);
}

const THRESHOLD = 100; // พิกเซลที่ทุกช่องสี < ค่านี้ ถือว่าเป็นพื้นหลังดำ

const img = await Jimp.read(inPath);
const { width: w, height: h, data } = img.bitmap;

const isDark = (i) => data[i] < THRESHOLD && data[i + 1] < THRESHOLD && data[i + 2] < THRESHOLD;
const idx = (x, y) => (y * w + x) * 4;

const visited = new Uint8Array(w * h);
const stack = [];

// เริ่มจากทุกพิกเซลที่ขอบภาพ
for (let x = 0; x < w; x++) {
  stack.push([x, 0], [x, h - 1]);
}
for (let y = 0; y < h; y++) {
  stack.push([0, y], [w - 1, y]);
}

let removed = 0;
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const p = y * w + x;
  if (visited[p]) continue;
  visited[p] = 1;
  const i = idx(x, y);
  if (!isDark(i)) continue; // เจอตัวการ์ตูน/ขอบขาว → หยุดไม่ลามต่อ
  data[i + 3] = 0; // ทำให้โปร่งใส
  removed++;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// ตัดขอบโปร่งใสรอบ ๆ ออก ให้ป้าอยู่เต็มกรอบ
img.autocrop({ cropOnlyFrames: false });

await img.write(outPath);
console.log(`✓ ${outPath}  (ลบพื้นหลัง ${removed} พิกเซล, ขนาดใหม่ ${img.bitmap.width}x${img.bitmap.height})`);
