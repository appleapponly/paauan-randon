/**
 * 🖼️ CaptureCard — การ์ดผลลัพธ์
 *
 * แสดงผล "บนจอ" = ผลลัพธ์ + ป้าอ้วน + บับเบิลคำพูด (พื้นครีม ไม่มีหัวกระดาษ ดูสะอาด)
 * เวลา "กดแชร์" = แคปการ์ดอีกใบ (ซ่อนนอกจอ) พื้นเหลือง มีหัวกระดาษ pattern + ลายเซ็นแอป
 *   - เนื้อหาพอดี → เป็นสี่เหลี่ยมจัตุรัส (โพสโซเชียลสวย)
 *   - เนื้อหายาวเกินจัตุรัส → ยืดสูงตามจริง (ไม่ตัดขอบ)
 *
 * โครง: [ผลลัพธ์อยู่นอกบับเบิล]  +  [ป้าอ้วน + บับเบิลคำพูดล้วน ๆ]
 * ✅ ทุกเครื่องสุ่มใช้ตัวนี้ → ส่ง ref ไปที่ "ใบสำหรับแชร์" อัตโนมัติ ไม่ต้องแก้หน้าจอ
 */
import { forwardRef, ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { paaUanPoses, paaUanByMood, type PaaUanPose } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import type { PaaUanMood } from '@/data/paaUanLines';

// หัวกระดาษแบรนด์ (ตัดขอบเหลืองว่างออกแล้ว เต็มความกว้าง คมชัด) — โผล่เฉพาะตอนแชร์
const PATTERN = require('../../assets/images/pattern.png');
const PATTERN_RATIO = 1774 / 565; // อัตราส่วนหัวกระดาษหลัง trim
// ขนาด "ใบสำหรับแชร์" จัตุรัสขั้นต่ำ (เนื้อหายาวเกินก็ยืดได้) — ซ่อนนอกจอ ตั้งใหญ่ได้
const CAPTURE_SIZE = 480;
// หางบับเบิลอยู่สูงเท่าปากป้า (≈ 22% จากหัวรูปป้า)
const PAA_HEIGHT = 124;
const MOUTH_TOP = Math.round(PAA_HEIGHT * 0.22);

interface Props {
  /** คำพูดป้าที่จะโชว์ในบับเบิลของการ์ด */
  comment: string;
  mood?: PaaUanMood;
  /** บังคับเลือกอิริยาบทรูปเอง (เช่น 'dice') — ถ้าใส่จะข้าม mood */
  pose?: PaaUanPose;
  /** ลายเซ็นใต้การ์ด (โชว์เฉพาะตอนแชร์) */
  watermark?: string;
  children: ReactNode;
}

/** เนื้อการ์ดจริง — withHeader=true = ใบแชร์ (พื้นเหลือง จัตุรัส มีหัวกระดาษ/ลายเซ็น) */
const CardInner = forwardRef<View, Props & { withHeader: boolean }>(
  (
    {
      comment,
      mood = 'happy',
      pose,
      watermark = 'สุ่มจากใจป้าอ้วน 👵❤️',
      withHeader,
      children,
    },
    ref
  ) => {
    const source = paaUanPoses[pose ?? paaUanByMood[mood]];
    return (
      // collapsable={false} จำเป็นบน Android เพื่อให้ view-shot แคปได้
      <View
        ref={ref}
        collapsable={false}
        style={[styles.card, withHeader && styles.cardShare]}
      >
        {withHeader && (
          <Image source={PATTERN} style={styles.pattern} resizeMode="contain" />
        )}

        {/* ผลลัพธ์ (รูป+ชื่อ / ใบเซียมซี ฯลฯ) — อยู่ "นอกบับเบิล" โชว์เด่น */}
        <View style={styles.resultArea}>{children}</View>

        {/* ป้าอ้วน (ซ้าย) + บับเบิล "คำพูดล้วน ๆ" (ขวา) */}
        <View style={styles.row}>
          <Image source={source} style={styles.paa} resizeMode="contain" />

          <View style={styles.bubble}>
            <Text style={styles.comment}>{comment}</Text>
            {/* หางบับเบิลชี้ตรงปากป้า (ซ้าย) */}
            <View style={styles.tailBorder} />
            <View style={styles.tailFill} />
          </View>
        </View>

        {withHeader && <Text style={styles.watermark}>{watermark}</Text>}
      </View>
    );
  }
);
CardInner.displayName = 'CardInner';

export const CaptureCard = forwardRef<View, Props>((props, ref) => (
  <View>
    {/* สิ่งที่เห็นบนจอ — พื้นครีม ไม่มีหัวกระดาษ ความสูงตามเนื้อหา */}
    <CardInner {...props} withHeader={false} />

    {/* ใบสำหรับ "แคปตอนแชร์" — พื้นเหลือง มีหัวกระดาษ ซ่อนนอกจอ */}
    <View style={styles.captureHost} pointerEvents="none">
      <CardInner {...props} withHeader ref={ref} />
    </View>
  </View>
));

CaptureCard.displayName = 'CaptureCard';

const styles = StyleSheet.create({
  // ที่วาง "ใบสำหรับแชร์" นอกจอ (ยังถูก render/วัดขนาด จึงแคปได้)
  captureHost: {
    position: 'absolute',
    left: -10000,
    top: 0,
    width: CAPTURE_SIZE,
  },
  // การ์ดบนจอ — พื้นครีม
  card: {
    ...cartoonBox(colors.cream, 5),
    padding: 16,
    gap: 14,
  },
  // ใบแชร์ — พื้นเหลือง (เข้ากับหัวกระดาษ), จัตุรัสขั้นต่ำแต่ยืดได้, กระจายเนื้อหาสมดุล
  cardShare: {
    backgroundColor: colors.butter,
    width: CAPTURE_SIZE,
    minHeight: CAPTURE_SIZE,
    padding: 22,
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  pattern: {
    width: '100%',
    aspectRatio: PATTERN_RATIO, // เต็มความกว้าง โลโก้ใหญ่ คมชัด
  },
  resultArea: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start', // หัวป้าเสมอด้านบนบับเบิล → หางชี้ตรงปากได้
    gap: 6,
  },
  paa: {
    width: 86,
    height: PAA_HEIGHT,
  },
  bubble: {
    ...cartoonBox(colors.white, 3),
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 76,
    justifyContent: 'center',
  },
  comment: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.ink,
    lineHeight: 28, // เผื่อสระบน/ล่าง + วรรณยุกต์ภาษาไทยไม่ถูกตัด
    textAlign: 'center',
  },
  // หางบับเบิลชี้ซ้าย ตรงปากป้า
  tailBorder: {
    position: 'absolute',
    left: -14,
    top: MOUTH_TOP,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.ink,
  },
  tailFill: {
    position: 'absolute',
    left: -9,
    top: MOUTH_TOP,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.white,
  },
  watermark: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.xs,
    color: colors.muted,
    textAlign: 'center',
  },
});
