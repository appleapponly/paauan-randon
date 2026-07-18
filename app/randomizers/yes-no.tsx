/**
 * 🤷 ใช่ / ไม่ใช่ — ตอบคำถามด่วน
 * กดถาม → ป้าสุ่มตอบ ใช่/ไม่ใช่ (50:50) พร้อมคำพูดกวน ๆ → แชร์ผลได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { yesLines, noLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function YesNoScreen() {
  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
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
    <ScreenSafe style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
      >
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
            <ConfettiBurst />
          </Animated.View>
        )}

        <BigButton label={answer === null ? t('ถามป้าเลย!', 'Ask Auntie!') : t('ถามใหม่', 'Ask again')} onPress={ask} />

        <View
          collapsable={false}
          onLayout={(e) => {
            if (answer === null) return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          {answer !== null && <ShareButton targetRef={cardRef} />}
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18, flexGrow: 1 },
  emoji: { fontSize: 64 },
  answer: { fontFamily: fonts.bold, fontSize: fontSize.xxl },
});
