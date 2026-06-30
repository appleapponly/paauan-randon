/**
 * 💬 PaaUanBubble — รูปป้าอ้วน (เต็มตัว) + บับเบิลคำพูด
 * ใช้ซ้ำได้ทุกหน้า ส่งข้อความ (text) + อารมณ์ (mood) เพื่อเลือกอิริยาบทรูป
 * ป้าจะขยับขึ้น-ลงเบา ๆ ตลอดเวลาให้ดูมีชีวิต (react-native-reanimated)
 */
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { paaUanPoses, paaUanByMood, type PaaUanPose } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import type { PaaUanMood } from '@/data/paaUanLines';

interface Props {
  text: string;
  /** อารมณ์ — ใช้เลือกอิริยาบทรูป (ค่าเริ่มต้น happy) */
  mood?: PaaUanMood;
  /** บังคับเลือกอิริยาบทเอง (เช่น 'cook' สำหรับสุ่มอาหาร) — ถ้าใส่จะข้าม mood */
  pose?: PaaUanPose;
  /** ความกว้างรูปป้า (ค่าเริ่มต้น 96) สูงจะคิดเป็น 1.3 เท่าอัตโนมัติ */
  imageWidth?: number;
}

export function PaaUanBubble({ text, mood = 'happy', pose, imageWidth = 96 }: Props) {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withTiming(-5, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [bob]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  const source = paaUanPoses[pose ?? paaUanByMood[mood]];
  const imageHeight = imageWidth * 1.3;
  // หางบับเบิลอยู่สูงเท่าปากป้า (≈ 22% จากหัวรูปป้า) ให้ดูเหมือนป้าพูดออกมา
  const mouthTop = Math.round(imageHeight * 0.22);

  return (
    <View style={styles.row}>
      <Animated.View style={[{ width: imageWidth, height: imageHeight }, bobStyle]}>
        <Image
          source={source}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{text}</Text>
        {/* หางบับเบิลชี้ตรงปากป้า */}
        <View style={[styles.tailBorder, { top: mouthTop }]} />
        <View style={[styles.tailFill, { top: mouthTop }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start', // หัวป้าเสมอด้านบนบับเบิล → หางชี้ตรงปากได้
    gap: 8,
  },
  bubble: {
    ...cartoonBox(colors.white, 4),
    flex: 1,
    paddingTop: 15, // เผื่อสระบน/วรรณยุกต์บรรทัดแรกไม่ถูกตัด
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  bubbleText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    lineHeight: 30, // เผื่อสระบน/ล่าง + วรรณยุกต์ภาษาไทยไม่ถูกตัด
    includeFontPadding: true, // Android: กันตัดหัวอักษร (สระ/วรรณยุกต์บน)
  },
  tailBorder: {
    position: 'absolute',
    left: -14,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.ink,
  },
  tailFill: {
    position: 'absolute',
    left: -9,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.white,
  },
});
