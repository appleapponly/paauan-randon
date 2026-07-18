/**
 * 🪙 หัว / ก้อย — โยนเหรียญ
 * กดโยน → เหรียญพลิกหมุน → ออกหัวหรือก้อย → ป้าคอมเมนต์ → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, {
  BounceIn,
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
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import { t } from '@/i18n';

type Phase = 'idle' | 'flipping' | 'result';

const HEADS = t('หัว', 'Heads');
const TAILS = t('ก้อย', 'Tails');

export default function CoinScreen() {
  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [bubble, setBubble] = useState(t('กดโยนเหรียญให้ป้าเสี่ยงทายสิจ๊ะ', 'Tap to toss and let Auntie call it!'));
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

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
    const picked = pickOne<string>([HEADS, TAILS]);
    const line = pickLine(coinLines, picked);
    setResult(picked);
    setBubble(line.text);
    setMood(line.mood);
    setPhase('result');
    setRound((r) => r + 1);
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
      >
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
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={bubble} mood={mood}>
              <Text style={styles.coinFaceBig}>🪙</Text>
              <Text style={styles.result}>{result}</Text>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
        )}

        <View style={{ height: 16 }} />

        <BigButton
          label={
            phase === 'flipping'
              ? t('กำลังโยน...', 'Tossing...')
              : phase === 'result'
                ? t('โยนอีกครั้ง', 'Toss again')
                : t('โยนเลย!', 'Toss it!')
          }
          onPress={toss}
          disabled={phase === 'flipping'}
        />

        <View
          collapsable={false}
          onLayout={(e) => {
            if (phase !== 'result') return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          {phase === 'result' && <ShareButton targetRef={cardRef} />}
        </View>
      </ScrollView>
    </ScreenSafe>
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
