/**
 * 🤷 ใช่ / ไม่ใช่ — ตอบคำถามด่วน
 * กดถาม → ป้าสุ่มตอบ ใช่/ไม่ใช่ (50:50) พร้อมคำพูดกวน ๆ → แชร์ผลได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { yesLines, noLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function YesNoScreen() {
  const cardRef = useRef<View>(null);
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0); // ใช้เป็น key ให้อนิเมชันเล่นใหม่ทุกครั้ง

  function ask() {
    const isYes = Math.random() < 0.5;
    const line = pickLine(isYes ? yesLines : noLines);
    setAnswer(isYes ? 'yes' : 'no');
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {answer === null ? (
          <PaaUanBubble text={t('มีอะไรอยากถามป้า? กดปุ่มเลยจ้า', 'Got a question for Auntie? Tap the button!')} mood="happy" pose="ponder" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={comment}
              mood={mood}
              pose={answer === 'yes' ? 'happy' : 'reject'}
            >
              <Text style={styles.emoji}>{answer === 'yes' ? '✅' : '❌'}</Text>
              <Text
                style={[
                  styles.answer,
                  { color: answer === 'yes' ? colors.jade : colors.pink },
                ]}
              >
                {answer === 'yes' ? t('ใช่!', 'Yes!') : t('ไม่ใช่!', 'No!')}
              </Text>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 20 }} />

        <BigButton label={answer === null ? t('ถามป้าเลย!', 'Ask Auntie!') : t('ถามใหม่', 'Ask again')} onPress={ask} />

        {answer !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 8, flexGrow: 1 },
  emoji: { fontSize: 64 },
  answer: { fontFamily: fonts.bold, fontSize: fontSize.xxl },
});
