/**
 * 🖼️ CaptureCard — การ์ดผลลัพธ์แบบมีแบรนด์ ไว้ "แคปเป็นภาพ" เพื่อแชร์
 * สิ่งที่เห็นในการ์ดนี้ = สิ่งที่จะถูกเซฟเป็นรูปส่ง LINE (WYSIWYG)
 *
 * ส่ง ref เข้ามาจากหน้าจอ แล้วใช้ ShareButton แคปจาก ref นี้
 * children = เนื้อผลลัพธ์ (ตัวเลข/ชื่อ/สี/รายการทีม ฯลฯ)
 */
import { forwardRef, ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { paaUanPoses, paaUanByMood, type PaaUanPose } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import type { PaaUanMood } from '@/data/paaUanLines';

interface Props {
  /** คำพูดป้าที่จะโชว์ในบับเบิลของการ์ด */
  comment: string;
  mood?: PaaUanMood;
  /** บังคับเลือกอิริยาบทรูปเอง (เช่น 'dice' หน้าลูกเต๋า) — ถ้าใส่จะข้าม mood */
  pose?: PaaUanPose;
  children: ReactNode;
}

export const CaptureCard = forwardRef<View, Props>(
  ({ comment, mood = 'happy', pose, children }, ref) => {
    const source = paaUanPoses[pose ?? paaUanByMood[mood]];
    return (
      // collapsable={false} จำเป็นบน Android เพื่อให้ view-shot แคปได้
      <View ref={ref} collapsable={false} style={styles.card}>
        <Text style={styles.wordmark}>ป้าอ้วนสุ่มให้</Text>

        <View style={styles.resultArea}>{children}</View>

        <View style={styles.bubbleRow}>
          <Image source={source} style={styles.paa} resizeMode="contain" />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{comment}</Text>
          </View>
        </View>

        <Text style={styles.watermark}>สุ่มโดยแอป “ป้าอ้วนสุ่มให้” 👵</Text>
      </View>
    );
  }
);

CaptureCard.displayName = 'CaptureCard';

const styles = StyleSheet.create({
  card: {
    ...cartoonBox(colors.cream, 5),
    padding: 18,
    gap: 14,
  },
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.pink,
    textAlign: 'center',
  },
  resultArea: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paa: {
    width: 70,
    height: 91,
  },
  bubble: {
    ...cartoonBox(colors.white, 3),
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  bubbleText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.ink,
    lineHeight: 22,
  },
  watermark: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.muted,
    textAlign: 'center',
  },
});
