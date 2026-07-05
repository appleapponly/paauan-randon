/**
 * 🔢 สุ่มตัวเลข — กำหนดช่วง min–max แล้วสุ่ม
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { numberLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { randomInt } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function NumberScreen() {
  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function roll() {
    const lo = parseInt(min, 10);
    const hi = parseInt(max, 10);
    if (Number.isNaN(lo) || Number.isNaN(hi)) return;
    const n = randomInt(lo, hi);
    const line = pickLine(numberLines, String(n));
    setResult(n);
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
      >
        {result === null ? (
          <PaaUanBubble text={t('ใส่ช่วงตัวเลข แล้วให้ป้าสุ่มให้จ้า', 'Set a range and let Auntie roll a number!')} mood="happy" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood}>
              <Text style={styles.number}>{result}</Text>
              <Text style={styles.range}>{t('จากช่วง ', 'from ')}{min} – {max}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={styles.rangeRow}>
          <View style={styles.field}>
            <Text style={styles.label}>{t('ต่ำสุด', 'Min')}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={min}
              onChangeText={setMin}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>{t('สูงสุด', 'Max')}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={max}
              onChangeText={setMax}
            />
          </View>
        </View>

        <BigButton label={result === null ? t('สุ่มเลย!', 'Roll it!') : t('สุ่มใหม่', 'Again')} onPress={roll} />

        <View
          collapsable={false}
          onLayout={(e) => {
            if (result === null) return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          {result !== null && <ShareButton targetRef={cardRef} />}
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18, flexGrow: 1 },
  number: { fontFamily: fonts.bold, fontSize: 72, color: colors.pink },
  range: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.muted },
  rangeRow: { flexDirection: 'row', gap: 14 },
  field: { flex: 1, gap: 6 },
  label: { fontFamily: fonts.semibold, fontSize: fontSize.sm, color: colors.ink },
  input: {
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 0,
    height: 52,
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
    backgroundColor: colors.white,
    textAlign: 'center', // จัดกึ่งกลางแนวนอน
    textAlignVertical: 'center', // Android: จัดกึ่งกลางแนวตั้ง (เลขไม่ลอยขึ้นบน + ไม่ถูกตัด)
    includeFontPadding: true,
  },
});
