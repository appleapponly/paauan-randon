/**
 * 🃏 RandomizerCard — การ์ดเครื่องสุ่ม 1 อันในหน้าหลัก
 * พื้นการ์ดเป็นสีประจำหมวด อิโมจิใหญ่กลางการ์ด ชื่ออยู่ใต้
 * แตะแล้วไปหน้าเครื่องสุ่มนั้น ถ้ายังไม่พร้อม (ready=false) จะจาง + โชว์ "เร็ว ๆ นี้"
 * กดแล้วการ์ด "จม" ลงตามเงา (translate + เงาหด) ให้รู้สึกเหมือนกดสติกเกอร์
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { textOn } from '@/theme/styles';
import type { Randomizer } from '@/data/categories';

interface Props {
  item: Randomizer;
  accent: string;
  onPress: () => void;
}

export function RandomizerCard({ item, accent, onPress }: Props) {
  const label = textOn(accent);
  return (
    <Pressable
      onPress={item.ready ? onPress : undefined}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: accent, opacity: !item.ready ? 0.5 : 1 },
        pressed && item.ready && styles.pressed,
      ]}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.title, { color: label }]} numberOfLines={2}>
        {item.title}
      </Text>
      {!item.ready && (
        <View style={styles.soonTag}>
          <Text style={styles.soonText}>เร็ว ๆ นี้</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 108,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    // เงาการ์ตูน offset ลงขวา ไม่เบลอ
    shadowColor: colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pressed: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  emoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  soonTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  soonText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.white,
  },
});
