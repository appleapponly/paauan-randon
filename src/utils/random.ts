/**
 * 🎰 ฟังก์ชันสุ่มกลาง — รวมตรรกะการสุ่มไว้ที่เดียว ทุกเครื่องสุ่มเรียกใช้จากนี่
 */

/** สุ่มจำนวนเต็มในช่วง [min, max] (รวมปลายทั้งสอง) */
export function randomInt(min: number, max: number): number {
  const lo = Math.ceil(Math.min(min, max));
  const hi = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/** สุ่มหยิบ 1 ตัวจากอาเรย์ */
export function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** สุ่มหยิบดัชนี (index) จากอาเรย์ — ใช้ตอนต้องรู้ตำแหน่งด้วย เช่น วงล้อ */
export function pickIndex<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length);
}

/** สลับลำดับอาเรย์แบบ Fisher–Yates (ไม่แก้ของเดิม) */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
