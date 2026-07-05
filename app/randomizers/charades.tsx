/**
 * 🎭 ใบ้คำ — เกมปาร์ตี้ สุ่มคำจากคลังคำไทย
 * คนใบ้กดดูคำ (กดอีกทีเพื่อปิดไม่ให้คนทายเห็น) แล้วกด "คำต่อไป"
 * (เกมเล่นสด ไม่มีปุ่มแชร์ เพราะคำเปลี่ยนเร็ว)
 */
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { CHARADES_WORDS } from '@/data/charadesWords';
import { charadesLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import { t } from '@/i18n';

export default function CharadesScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
  const [word, setWord] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [bubble, setBubble] = useState(t('พร้อมเล่นใบ้คำมั้ย? กดสุ่มคำเลย!', 'Ready for charades? Tap for a word!'));
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function nextWord() {
    const line = pickLine(charadesLines);
    setWord(pickOne(CHARADES_WORDS));
    setRevealed(true); // คำใหม่เปิดให้คนใบ้เห็นทันที
    setBubble(line.text);
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
        <PaaUanBubble text={bubble} mood={mood} />

        {word !== null && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <Pressable
              style={styles.wordCard}
              onPress={() => setRevealed((r) => !r)}
            >
              {revealed ? (
                <Text style={styles.word}>{word}</Text>
              ) : (
                <Text style={styles.hidden}>{t('👀 แตะเพื่อดูคำ', '👀 Tap to see the word')}</Text>
              )}
            </Pressable>
          </Animated.View>
        )}

        <View style={{ flex: 1 }} />

        <View
          collapsable={false}
          onLayout={(e) => {
            if (word === null) return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          <BigButton label={word === null ? t('สุ่มคำ!', 'Random word!') : t('คำต่อไป', 'Next word')} onPress={nextWord} />
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 20, flexGrow: 1 },
  wordCard: {
    ...cartoonBox(colors.gold, 6),
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  word: {
    fontFamily: fonts.bold,
    fontSize: 44,
    color: colors.ink,
    textAlign: 'center',
  },
  hidden: {
    fontFamily: fonts.medium,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
});
