/**
 * 🔮 ดวงประจำวัน — กดสุ่มทีเดียวได้ 3 อย่าง: โชคดีวันนี้ / สิ่งที่ต้องระวัง / อารมณ์วันนี้
 * ป้าหมอดูเปิดลูกแก้วทำนายให้ + แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { LUCK_LINES, CAUTION_LINES, MOOD_LINES } from '@/data/dailyHoroscope';
import { horoscopeLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

interface Reading {
  luck: string;
  caution: string;
  mood: string;
}

// 3 หัวข้อที่จะโชว์ในการ์ด (สี + อิโมจิประจำหัวข้อ)
const SECTIONS: { key: keyof Reading; label: string; emoji: string; color: string }[] = [
  { key: 'luck', label: 'โชคดีวันนี้', emoji: '🍀', color: colors.jade },
  { key: 'caution', label: 'สิ่งที่ต้องระวัง', emoji: '⚠️', color: colors.gold },
  { key: 'mood', label: 'อารมณ์วันนี้', emoji: '🎭', color: colors.wine },
];

export default function DailyHoroscopeScreen() {
  const cardRef = useRef<View>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function draw() {
    const line = pickLine(horoscopeLines);
    setReading({
      luck: pickOne(LUCK_LINES),
      caution: pickOne(CAUTION_LINES),
      mood: pickOne(MOOD_LINES),
    });
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {reading === null ? (
          <PaaUanBubble
            text="อยากรู้ดวงวันนี้มั้ยลูก? กดให้ป้าหมอดูเปิดลูกแก้วเลยจ้า"
            mood="happy"
            pose="fortune"
          />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="fortune">
              <Text style={styles.title}>ดวงวันนี้ของหนู</Text>
              <View style={styles.sections}>
                {SECTIONS.map((s) => (
                  <View key={s.key} style={[styles.section, { borderColor: s.color }]}>
                    <Text style={[styles.sectionLabel, { color: s.color }]}>
                      {s.emoji} {s.label}
                    </Text>
                    <Text style={styles.sectionText}>{reading[s.key]}</Text>
                  </View>
                ))}
              </View>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 8 }} />

        <BigButton
          label={reading === null ? 'ดูดวงวันนี้!' : 'ดูดวงอีกครั้ง'}
          onPress={draw}
          color={colors.wine}
        />

        {reading !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 16, flexGrow: 1 },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.wine,
    textAlign: 'center',
  },
  sections: { gap: 10, alignSelf: 'stretch' },
  section: {
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 2,
  },
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
  },
  sectionText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.ink,
    lineHeight: 26, // เผื่อสระบน/ล่างไม่ถูกตัด
  },
});
