/**
 * 🖼️ CaptureCard — การ์ดผลลัพธ์แบบมีแบรนด์ ไว้ "แคปเป็นภาพ" เพื่อแชร์ LINE (WYSIWYG)
 * ดีไซน์ตาม sample: หัวกระดาษ (pattern โลโก้+ชื่อแอป) → ป้าอ้วนซ้าย + บับเบิลผล+คำพูด → ลายเซ็นแอป
 *
 * - หัวกระดาษใช้ไฟล์ pattern.jpg (ใช้ซ้ำทุกการ์ดแชร์ทุกเครื่องสุ่ม)
 * - children = เนื้อผลลัพธ์ (ชื่อเมนู/ตัวเลข/สี/รายการ ฯลฯ) โชว์เด่นในบับเบิล
 */
import { forwardRef, ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { paaUanPoses, paaUanByMood, type PaaUanPose } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import type { PaaUanMood } from '@/data/paaUanLines';

// หัวกระดาษแบรนด์ (ไอคอนแอป + ชื่อ "ป้าอ้วน สุ่มให้") — ใช้ซ้ำทุกการ์ด
const PATTERN = require('../../assets/images/pattern.jpg');

interface Props {
  /** คำพูดป้าที่จะโชว์ในบับเบิลของการ์ด */
  comment: string;
  mood?: PaaUanMood;
  /** บังคับเลือกอิริยาบทรูปเอง (เช่น 'dice') — ถ้าใส่จะข้าม mood */
  pose?: PaaUanPose;
  /** ป้ายเกริ่น (พิลล์) ใต้หัวกระดาษ เช่น "🍜 สุ่มเมนูวันนี้ ป้าจัดให้!" — ไม่ใส่ก็ไม่โชว์ */
  tagline?: string;
  /** ข้อความลายเซ็นใต้การ์ด (ปรับตามเครื่องสุ่มได้) */
  watermark?: string;
  children: ReactNode;
}

export const CaptureCard = forwardRef<View, Props>(
  (
    { comment, mood = 'happy', pose, tagline, watermark = 'สุ่มจากใจป้าอ้วน 👵❤️', children },
    ref
  ) => {
    const source = paaUanPoses[pose ?? paaUanByMood[mood]];
    return (
      // collapsable={false} จำเป็นบน Android เพื่อให้ view-shot แคปได้
      <View ref={ref} collapsable={false} style={styles.card}>
        {/* หัวกระดาษแบรนด์ */}
        <Image source={PATTERN} style={styles.pattern} resizeMode="contain" />

        {/* ป้ายเกริ่น (พิลล์) — โชว์เมื่อส่ง tagline มา */}
        {tagline ? (
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

        <Text style={styles.watermark}>{watermark}</Text>
      </View>
    );
  }
);

CaptureCard.displayName = 'CaptureCard';

const styles = StyleSheet.create({
  card: {
    ...cartoonBox(colors.butter, 5),
    padding: 16,
    gap: 12,
  },
  pattern: {
    width: '100%',
    aspectRatio: 2.4, // หัวกระดาษกว้าง (โลโก้+ชื่อแอป) ไม่ให้สูงเกินไป
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
