/**
 * 🪙 หัว / ก้อย — โยนเหรียญ
 * กดโยน → เหรียญพลิกหมุน → ออกหัวหรือก้อย → ป้าคอมเมนต์ → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { coinLines, spinningLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

type Phase = 'idle' | 'flipping' | 'result';

export default function CoinScreen() {
  const cardRef = useRef<View>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<'หัว' | 'ก้อย' | null>(null);
  const [bubble, setBubble] = useState('กดโยนเหรียญให้ป้าเสี่ยงทายสิจ๊ะ');
  const [mood, setMood] = useState<PaaUanMood>('happy');

  const flip = useSharedValue(0);
  const coinStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${flip.value}deg` }],
  }));

  function toss() {
    if (phase === 'flipping') return;
    setPhase('flipping');
    setResult(null);
    setBubble(pickLine(spinningLines).text);

    const target = flip.value + 360 * 5; // หมุน 5 รอบ
    flip.value = withTiming(
      target,
      { duration: 1100, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(finishToss)();
      }
    );
  }

  function finishToss() {
    const picked = pickOne<'หัว' | 'ก้อย'>(['หัว', 'ก้อย']);
    const line = pickLine(coinLines, picked);
    setResult(picked);
    setBubble(line.text);
    setMood(line.mood);
    setPhase('result');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {phase !== 'result' ? (
          <>
            <PaaUanBubble text={bubble} mood={mood} />
            <View style={styles.stage}>
              <Animated.View style={[styles.coin, coinStyle]}>
                <Text style={styles.coinFace}>🪙</Text>
              </Animated.View>
            </View>
          </>
        ) : (
          <CaptureCard ref={cardRef} comment={bubble} mood={mood}>
            <Text style={styles.coinFaceBig}>🪙</Text>
            <Text style={styles.result}>{result}</Text>
          </CaptureCard>
        )}

        <View style={{ height: 16 }} />

        <BigButton
          label={phase === 'flipping' ? 'กำลังโยน...' : phase === 'result' ? 'โยนอีกครั้ง' : 'โยนเลย!'}
          onPress={toss}
          disabled={phase === 'flipping'}
        />

        {phase === 'result' && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 16, flexGrow: 1 },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  coin: {
    ...cartoonBox(colors.gold, 6),
    width: 130,
    height: 130,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinFace: { fontSize: 72 },
  coinFaceBig: { fontSize: 60 },
  result: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.pink,
  },
});
