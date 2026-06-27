/**
 * 🖼️ CaptureCard — การ์ดผลลัพธ์
 *
 * แสดงผล "บนจอ" = ป้าอ้วน + บับเบิลผล+คำพูด (ไม่มีหัวกระดาษ ให้ดูสะอาด)
 * เวลา "กดแชร์" = แคปการ์ดอีกใบที่ซ่อนอยู่นอกจอ ซึ่งมี "หัวกระดาษ pattern" (โลโก้+ชื่อแอป)
 *   + ป้ายเกริ่น + ลายเซ็นแอป ครบตามดีไซน์ sample
 *
 * ✅ ทุกเครื่องสุ่มใช้ตัวนี้ → ส่ง ref ไปที่ "ใบสำหรับแชร์" อัตโนมัติ ไม่ต้องแก้หน้าจอ
 */
import { forwardRef, ReactNode } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { paaUanPoses, paaUanByMood, type PaaUanPose } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import type { PaaUanMood } from '@/data/paaUanLines';

// หัวกระดาษแบรนด์ (ไอคอนแอป + ชื่อ "ป้าอ้วน สุ่มให้") — โผล่เฉพาะตอนแชร์
const PATTERN = require('../../assets/images/pattern.jpg');
// ความกว้างของ "ใบสำหรับแชร์" (ซ่อนนอกจอ) ให้ใกล้เคียงการ์ดบนจอ
const CAPTURE_WIDTH = Math.min(Dimensions.get('window').width - 40, 400);

interface Props {
  /** คำพูดป้าที่จะโชว์ในบับเบิลของการ์ด */
  comment: string;
  mood?: PaaUanMood;
  /** บังคับเลือกอิริยาบทรูปเอง (เช่น 'dice') — ถ้าใส่จะข้าม mood */
  pose?: PaaUanPose;
  /** ป้ายเกริ่น (พิลล์) ใต้หัวกระดาษ เช่น "🍜 สุ่มเมนูวันนี้ ป้าจัดให้!" — โชว์เฉพาะตอนแชร์ */
  tagline?: string;
  /** ลายเซ็นใต้การ์ด (โชว์เฉพาะตอนแชร์) */
  watermark?: string;
  children: ReactNode;
}

/** เนื้อการ์ดจริง — withHeader=true จะมีหัวกระดาษ/ป้ายเกริ่น/ลายเซ็น (ใบสำหรับแชร์) */
const CardInner = forwardRef<View, Props & { withHeader: boolean }>(
  (
    {
      comment,
      mood = 'happy',
      pose,
      tagline,
      watermark = 'สุ่มจากใจป้าอ้วน 👵❤️',
      withHeader,
      children,
    },
    ref
  ) => {
    const source = paaUanPoses[pose ?? paaUanByMood[mood]];
    return (
      // collapsable={false} จำเป็นบน Android เพื่อให้ view-shot แคปได้
      <View ref={ref} collapsable={false} style={styles.card}>
        {withHeader && (
          <Image source={PATTERN} style={styles.pattern} resizeMode="contain" />
        )}

        {withHeader && tagline ? (
          <View style={styles.taglinePill}>
            <Text style={styles.taglineText}>{tagline}</Text>
          </View>
        ) : null}

        {/* ป้าอ้วน (ซ้าย) + บับเบิลผล+คำพูด (ขวา) */}
        <View style={styles.row}>
          <Image source={source} style={styles.paa} resizeMode="contain" />

          <View style={styles.bubble}>
            <View style={styles.resultArea}>{children}</View>
            <Text style={styles.comment}>{comment}</Text>

            {/* หางบับเบิลชี้ไปทางป้า (ซ้าย) */}
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
    {/* สิ่งที่เห็นบนจอ — ไม่มีหัวกระดาษ */}
    <CardInner {...props} withHeader={false} />

    {/* ใบสำหรับ "แคปตอนแชร์" — มีหัวกระดาษครบ ซ่อนไว้นอกจอ */}
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
    width: CAPTURE_WIDTH,
  },
  card: {
    ...cartoonBox(colors.butter, 5),
    padding: 16,
    gap: 12,
  },
  pattern: {
    width: '100%',
    height: 88, // หัวกระดาษเล็กลง สมส่วนกับการ์ด (พื้นเหลืองข้าง ๆ กลืนกับการ์ด)
    alignSelf: 'center',
  },
  taglinePill: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: -2,
  },
  taglineText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    color: colors.pink,
    textAlign: 'center',
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  paa: {
    width: 86,
    height: 124,
  },
  bubble: {
    ...cartoonBox(colors.white, 3),
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 8,
    minHeight: 120,
    justifyContent: 'center',
  },
  resultArea: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  comment: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.ink,
    lineHeight: 25, // เผื่อสระบน/ล่างภาษาไทยไม่ถูกตัด
    textAlign: 'center',
  },
  // หางบับเบิลชี้ซ้าย (หาตัวป้า) — กึ่งกลางแนวตั้งของบับเบิล
  tailBorder: {
    position: 'absolute',
    left: -14,
    top: '46%',
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
    top: '46%',
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
