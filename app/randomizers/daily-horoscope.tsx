/**
 * 🔮 ดวงประจำวัน — กดสุ่มทีเดียวได้ 3 อย่าง: โชคดีวันนี้ / สิ่งที่ต้องระวัง / อารมณ์วันนี้
 * ป้าหมอดูเปิดลูกแก้วทำนายให้ + แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
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
import { t } from '@/i18n';

interface Reading {
  luck: string;
  caution: string;
  mood: string;
}

// 3 หัวข้อที่จะโชว์ในการ์ด (สี + อิโมจิประจำหัวข้อ)
const SECTIONS: { key: keyof Reading; label: string; emoji: string; color: string }[] = [
  { key: 'luck', label: t('โชคดีวันนี้', "Today's Luck"), emoji: '🍀', color: colors.jade },
  { key: 'caution', label: t('สิ่งที่ต้องระวัง', 'Watch Out For'), emoji: '⚠️', color: colors.gold },
  { key: 'mood', label: t('อารมณ์วันนี้', "Today's Mood"), emoji: '🎭', color: colors.wine },
];

export default function DailyHoroscopeScreen() {
  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
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
    <ScreenSafe style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
      >
        {reading === null ? (
          <PaaUanBubble
            text={t('อยากรู้ดวงวันนี้มั้ยลูก? กดให้ป้าหมอดูเปิดลูกแก้วเลยจ้า', "Curious about today? Tap and let Auntie read her crystal ball!")}
            mood="happy"
            pose="fortune"
          />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="fortune">
              <Text style={styles.title}>{t('ดวงวันนี้ของหนู', 'Your Day Ahead')}</Text>
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
          label={reading === null ? t('ดูดวงวันนี้!', 'Read my day!') : t('ดูดวงอีกครั้ง', 'Read again')}
          onPress={draw}
          color={colors.wine}
        />

        <View
          collapsable={false}
          onLayout={(e) => {
            if (reading === null) return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          {reading !== null && <ShareButton targetRef={cardRef} />}
        </View>
      </ScrollView>
    </ScreenSafe>
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
