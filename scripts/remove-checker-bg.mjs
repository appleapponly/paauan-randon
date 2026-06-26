/**
 * ลบพื้นหลัง "ลายตารางหมากรุก" (checkerboard) ของรูป .jpg ให้กลายเป็น PNG โปร่งใส
 *
 * รูป 1-5.jpg ถูกเซฟเป็น JPG ซึ่งเก็บความโปร่งใสไม่ได้ ลายตารางขาว-เทาจึงถูกฝังลงในภาพจริง
 * วิธีแก้: flood-fill จากขอบภาพ ลบเฉพาะพิกเซลที่ "สว่าง + สีจืด" (ขาวหรือเทาอ่อนของตาราง)
 * ตัวป้าถูกล้อมด้วยเส้นขอบดำหนา flood-fill จึงหยุดที่เส้นขอบ ไม่กินเข้าไปในตัวการ์ตูน
 * (ดอกไม้ขาว/ผิว/ผมเทา อยู่ "ใน" เส้นขอบ ขอบนอกลามไปไม่ถึง จึงปลอดภัย)
 *
 * รัน:  node scripts/remove-checker-bg.mjs <ไฟล์เข้า> <ไฟล์ออก>
 */
import { Jimp } from 'jimp';

const [, , inPath, outPath, brightArg, desatArg] = process.argv;
if (!inPath || !outPath) {
  console.error('ใช้: node scripts/remove-checker-bg.mjs <in> <out> [bright] [desat]');
  process.exit(1);
}

const BRIGHT = brightArg ? Number(brightArg) : 165; // ความสว่างเฉลี่ยขั้นต่ำที่ถือว่าเป็นพื้นตาราง
const DESAT = desatArg ? Number(desatArg) : 32; // ความต่างของช่องสีสูงสุด (max-min) — ตารางสีจืดมาก

const img = await Jimp.read(inPath);
const { width: w, height: h, data } = img.bitmap;

const idx = (x, y) => (y * w + x) * 4;
const isChecker = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return (r + g + b) / 3 > BRIGHT && max - min < DESAT;
};

const visited = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1]);
for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y]);

let removed = 0;
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const p = y * w + x;
  if (visited[p]) continue;
  visited[p] = 1;
  const i = idx(x, y);
  if (!isChecker(i)) continue; // เจอเส้นขอบดำ/ตัวป้า → หยุด
  data[i + 3] = 0;
  removed++;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

img.autocrop({ cropOnlyFrames: false });
await img.write(outPath);
console.log(`✓ ${outPath}  (ลบ ${removed} พิกเซล, ขนาดใหม่ ${img.bitmap.width}x${img.bitmap.height})`);
