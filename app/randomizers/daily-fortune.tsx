/**
 * 💡 ข้อคิดประจำวัน — สุ่มข้อคิด/คำแนะนำดี ๆ ในการใช้ชีวิตประจำวัน
 * กดปุ่ม → ป้าหมอดูให้ข้อคิด 1 ข้อ + คอมเมนต์ป้า → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { DAILY_FORTUNE } from '@/data/dailyFortune';
import { fortuneLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

export default function DailyFortuneScreen() {
  const cardRef = useRef<View>(null);
  const [fortune, setFortune] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function draw() {
    const line = pickLine(fortuneLines);
    setFortune(pickOne(DAILY_FORTUNE));
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {fortune === null ? (
          <PaaUanBubble
            text="อยากได้ข้อคิดดี ๆ วันนี้มั้ยลูก? กดให้ป้าหมอดูบอกเลยจ้า"
            mood="happy"
            pose="fortune"
          />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="fortune">
              <Text style={styles.emoji}>💡</Text>
              <Text style={styles.label}>ข้อคิดวันนี้</Text>
              <Text style={styles.fortune}>{fortune}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 20 }} />

        <BigButton
          label={fortune === null ? 'ขอข้อคิดวันนี้!' : 'ขอข้อคิดใหม่'}
          onPress={draw}
          color={colors.wine}
        />

        {fortune !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 8, flexGrow: 1 },
  emoji: { fontSize: 56 },
  label: { fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.muted },
  fortune: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.wine,
    textAlign: 'center',
    lineHeight: 40, // เผื่อสระบน/ล่างภาษาไทยไม่ถูกตัดทั้งบนและล่าง
  },
});
