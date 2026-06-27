/**
 * 🖼️ CaptureCard — การ์ดผลลัพธ์
 *
 * แสดงผล "บนจอ" = ผลลัพธ์ (รูป+ชื่อ) + ป้าอ้วน + บับเบิลคำพูด (ไม่มีหัวกระดาษ ดูสะอาด)
 * เวลา "กดแชร์" = แคปการ์ดอีกใบ (ซ่อนนอกจอ) ที่เป็น "สี่เหลี่ยมจัตุรัส" พร้อมหัวกระดาษ pattern
 *   + ป้ายเกริ่น + ลายเซ็นแอป → โพสลงโซเชียลได้พอดี
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

// หัวกระดาษแบรนด์ (ไอคอนแอป + ชื่อ "ป้าอ้วน สุ่มให้") — โผล่เฉพาะตอนแชร์
const PATTERN = require('../../assets/images/pattern.jpg');
// ขนาด "ใบสำหรับแชร์" (สี่เหลี่ยมจัตุรัส) — ซ่อนนอกจอ จึงตั้งใหญ่ได้ตามต้องการ
const CAPTURE_SIZE = 480;
// หางบับเบิลอยู่สูงเท่าปากป้า (≈ 22% จากหัวรูปป้า) — รูปป้าสูง 124
const PAA_HEIGHT = 124;
const MOUTH_TOP = Math.round(PAA_HEIGHT * 0.22);

interface Props {
  /** คำพูดป้าที่จะโชว์ในบับเบิลของการ์ด */
  comment: string;
  mood?: PaaUanMood;
  /** บังคับเลือกอิริยาบทรูปเอง (เช่น 'dice') — ถ้าใส่จะข้าม mood */
  pose?: PaaUanPose;
  /** ป้ายเกริ่น (พิลล์) ใต้หัวกระดาษ เช่น "สุ่มเมนูวันนี้ ป้าจัดให้!" — โชว์เฉพาะตอนแชร์ */
  tagline?: string;
  /** อิโมจิ badge หน้าป้ายเกริ่น เช่น "🍜" */
  taglineEmoji?: string;
  /** ลายเซ็นใต้การ์ด (โชว์เฉพาะตอนแชร์) */
  watermark?: string;
  children: ReactNode;
}

/** เนื้อการ์ดจริง — withHeader=true จะเป็นสี่เหลี่ยมจัตุรัส มีหัวกระดาษ/ป้ายเกริ่น/ลายเซ็น (ใบแชร์) */
const CardInner = forwardRef<View, Props & { withHeader: boolean }>(
  (
    {
      comment,
      mood = 'happy',
      pose,
      tagline,
      taglineEmoji,
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
        style={[styles.card, withHeader && styles.cardSquare]}
      >
        {withHeader && (
          <Image source={PATTERN} style={styles.pattern} resizeMode="contain" />
        )}

        {withHeader && tagline ? (
          <View style={styles.taglinePill}>
            {taglineEmoji ? (
              <View style={styles.taglineBadge}>
                <Text style={styles.taglineBadgeText}>{taglineEmoji}</Text>
              </View>
            ) : null}
            <Text style={styles.taglineText}>{tagline}</Text>
          </View>
        ) : null}

        {/* ผลลัพธ์ (รูป+ชื่อ) — อยู่ "นอกบับเบิล" โชว์เด่น */}
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
    {/* สิ่งที่เห็นบนจอ — ไม่มีหัวกระดาษ ความสูงตามเนื้อหา */}
    <CardInner {...props} withHeader={false} />

    {/* ใบสำหรับ "แคปตอนแชร์" — จัตุรัส มีหัวกระดาษครบ ซ่อนนอกจอ */}
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
  card: {
    ...cartoonBox(colors.butter, 5),
    padding: 16,
    gap: 14,
  },
  // ใบแชร์: บังคับจัตุรัส + กระจายเนื้อหาให้สมดุลเต็มกรอบ
  cardSquare: {
    width: CAPTURE_SIZE,
    height: CAPTURE_SIZE,
    padding: 22,
    gap: 0,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  pattern: {
    width: '100%',
    height: 84, // หัวกระดาษเล็ก สมส่วน (พื้นเหลืองข้าง ๆ กลืนกับการ์ด)
  },
  taglinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 18,
    shadowColor: colors.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  taglineBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineBadgeText: { fontSize: 17 },
  taglineText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.pink,
    textAlign: 'center',
    lineHeight: 24,
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
    lineHeight: 25, // เผื่อสระบน/ล่างภาษาไทยไม่ถูกตัด
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
