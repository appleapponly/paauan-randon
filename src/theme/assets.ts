/**
 * 🖼️ จุดอ้างอิงรูปป้าอ้วน — import จากที่เดียว
 *
 * รูปต้นฉบับ (1-5.jpg พื้นลายตาราง) อยู่ใน assets/images/
 * ผ่านสคริปต์ scripts/remove-checker-bg.mjs ลบพื้นเป็นไฟล์โปร่งใส paa-uan-*.png
 *
 * อยากเพิ่มอิริยาบทใหม่:
 *   1) วางรูปใน assets/images/
 *   2) รัน: node scripts/remove-checker-bg.mjs assets/images/<ไฟล์> assets/images/paa-uan-<ชื่อ>.png
 *   3) เพิ่ม require ในนี้ แล้วผูกกับอารมณ์ใน paaUanByMood
 */
import type { PaaUanMood } from '@/data/paaUanLines';

export const paaUanPoses = {
  happy: require('../../assets/images/paa-uan-happy.png'), // 👍 ยกนิ้วโป้ง ยิ้มหวาน
  point: require('../../assets/images/paa-uan-point.png'), // 👈 ชี้นิ้ว แลบลิ้น หน้ากวน
  no: require('../../assets/images/paa-uan-no.png'), // 👎 คว่ำนิ้ว หน้าบูด ไม่เอา
  cook: require('../../assets/images/paa-uan-cook.png'), // 🍳 ผัดกับข้าว หัวเราะ
  cookHappy: require('../../assets/images/paa-uan-cook-happy.png'), // 🍳👍 ผัดเสร็จ ยกนิ้ว
  cookJump: require('../../assets/images/paa-uan-cook-jump.png'), // 🍳🎉 กระโดดถือกระทะ สุดมัน
  reject: require('../../assets/images/paa-uan-reject.png'), // 🙅 กากบาทแขนไขว้ ไม่เอาเด็ดขาด
  shock: require('../../assets/images/paa-uan-shock.png'), // 😱 ตกใจ อ้าปาก
  satisfied: require('../../assets/images/paa-uan-satisfied.png'), // 😌 ยิ้มลูบพุง อิ่มเอม
  dice: require('../../assets/images/paa-uan-dice.png'), // 🎲 ถือลูกเต๋า เซียนเต๋า
  dizzy: require('../../assets/images/paa-uan-dizzy.png'), // 😵‍💫 เวียนหัว ดาวหมุน
} as const;

export type PaaUanPose = keyof typeof paaUanPoses;

/** จับคู่อารมณ์ในคำพูด → อิริยาบทรูป (ใช้เป็นค่าเริ่มต้น) */
export const paaUanByMood: Record<PaaUanMood, PaaUanPose> = {
  happy: 'happy', // ดีใจ → ยกนิ้วโป้ง
  thinking: 'point', // คิดหนัก → ชี้นิ้ว
  sassy: 'no', // กวน/แซ่บ → คว่ำนิ้วหน้าบูด
  teasing: 'point', // แซว → ชี้นิ้วแลบลิ้น
};
