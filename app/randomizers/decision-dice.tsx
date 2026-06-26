/**
 * 🎲 ลูกเต๋าตัดสินใจ
 * กด "ทอยเลย!" → เต๋าสั่น/หมุน → ป้าอ้วนฟันธงคำตัดสิน + คอมเมนต์กวน ๆ
 *
 * โครงการทำงาน (state machine ง่าย ๆ):
 *   idle  → กดปุ่ม → rolling (เต๋าหมุน + ป้าพูด "กำลังเขย่าดวง")
 *   rolling → จบอนิเมชัน → result (โชว์คำตัดสิน + ป้าคอมเมนต์)
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  BounceIn,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { DICE_VERDICTS, DiceVerdict } from '@/data/diceData';
import { spinningLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

type Phase = 'idle' | 'rolling' | 'result';

export default function DecisionDiceScreen() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<DiceVerdict | null>(null);
  const [bubble, setBubble] = useState('กดปุ่มให้ป้าทอยเต๋าตัดสินใจให้สิจ๊ะ');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const cardRef = useRef<View>(null);

  const spin = useSharedValue(0); // องศาการหมุนของเต๋า

  const diceStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  function roll() {
    if (phase === 'rolling') return; // กันกดซ้ำระหว่างหมุน

    setPhase('rolling');
    setResult(null);
    const line = pickLine(spinningLines);
    setBubble(line.text);
    setMood(line.mood);

    // หมุนเต๋าหลายรอบแล้วค่อยหยุด (720 องศา = 2 รอบ)
    const target = spin.value + 720;
    spin.value = withTiming(
      target,
      { duration: 900, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          // อนิเมชันจบแล้ว — กลับมาฝั่ง JS เพื่ออัปเดตผล
          runOnJS(finishRoll)();
        }
      }
    );
  }

  function finishRoll() {
    const picked = pickOne(DICE_VERDICTS);
    setResult(picked);
    setBubble(picked.comment);
    setMood(picked.mood);
    setPhase('result');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ป้าอ้วนพูดเปลี่ยนตามสถานการณ์ (ตอนได้ผลย้ายไปอยู่ในการ์ดแชร์) */}
        {phase !== 'result' && (
          <PaaUanBubble
            text={bubble}
            mood={mood}
            pose={phase === 'rolling' ? 'dizzy' : 'dice'}
          />
        )}

        {/* เต๋า (ตัวหมุน) */}
        <View style={styles.stage}>
          <Animated.View style={[styles.diceCard, diceStyle]}>
            <Text style={styles.diceEmoji}>{result ? result.emoji : '🎲'}</Text>
          </Animated.View>
        </View>

        {/* การ์ดผลแบบแชร์ได้ */}
        {result && (
          <Animated.View entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={bubble} mood={mood} pose="dice">
              <Text style={styles.cardEmoji}>{result.emoji}</Text>
              <Text style={styles.verdict}>{result.verdict}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        {/* ปุ่มทอย */}
        <BigButton
          label={phase === 'result' ? 'ทอยอีกครั้ง' : 'ทอยเลย!'}
          onPress={roll}
          disabled={phase === 'rolling'}
        />

        {result && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: 20,
    gap: 24,
    flexGrow: 1,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  diceCard: {
    ...cartoonBox(colors.gold, 6),
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceEmoji: {
    fontSize: 80,
  },
  cardEmoji: {
    fontSize: 52,
  },
  verdict: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.pink,
    textAlign: 'center',
  },
});
