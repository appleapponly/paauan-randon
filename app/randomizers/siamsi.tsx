/**
 * 🥠 เซียมซี — กดเขย่า → กระบอกเซียมซีสั่น → แท่งเซียมซีมีเลขเด้งออกมา → เด้งเข้าหน้าผลลัพธ์
 * - ใบเซียมซี (ใบสีแดง อักษรขาว) อยู่ "นอกกล่องคำพูด"
 * - แง่คิดสะกิดใจสไตล์ป้าอ้วน อยู่ในกล่องคำพูดป้า
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RnAnimated, { BounceIn } from 'react-native-reanimated';
import { SIAMSI, type SiamsiStick } from '@/data/siamsi';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { SiamsiTube } from '@/components/SiamsiTube';
import { pickOne } from '@/utils/random';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

type Phase = 'idle' | 'shaking' | 'result';
const TUBE = 130;

export default function SiamsiScreen() {
  const cardRef = useRef<View>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stick, setStick] = useState<SiamsiStick | null>(null);
  const [pending, setPending] = useState<SiamsiStick | null>(null);
  const [round, setRound] = useState(0);

  const rot = useRef(new Animated.Value(0)).current; // เขย่าซ้าย-ขวา
  const stickY = useRef(new Animated.Value(0)).current; // แท่งเด้งขึ้น
  const stickOp = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const tubeSpin = rot.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-13deg', '13deg'],
  });
  const popUp = stickY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -TUBE * 0.95],
  });

  function shake() {
    if (phase === 'shaking') return;
    const picked = pickOne(SIAMSI);
    setPending(picked);
    setPhase('shaking');
    rot.setValue(0);
    stickY.setValue(0);
    stickOp.setValue(0);

    // เขย่ากระบอกไปมา
    Animated.sequence([
      ...[1, -1, 1, -1, 1, -1].map((v) =>
        Animated.timing(rot, { toValue: v, duration: 75, useNativeDriver: true })
      ),
      Animated.timing(rot, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();

    // หลังเขย่า → แท่งเซียมซีเด้งออกมา
    timer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(stickOp, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.spring(stickY, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      ]).start();

      // แล้วเด้งเข้าหน้าผลลัพธ์
      timer.current = setTimeout(() => {
        setStick(picked);
        setPhase('result');
        setRound((r) => r + 1);
      }, 750);
    }, 520);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {phase !== 'result' && (
          <PaaUanBubble
            text={
              phase === 'shaking'
                ? 'เขย่า ๆ ขอให้ได้ใบดี ๆ นะลูก...'
                : 'ตั้งจิตอธิษฐานแล้วกดเขย่าเซียมซีกับป้าเลยจ้ะ'
            }
            mood="thinking"
            pose="fortune"
          />
        )}

        {/* เวทีกระบอกเซียมซี (โชว์ตอนยังไม่ออกผล) */}
        {phase !== 'result' && (
          <View style={styles.stage}>
            {/* แท่งเซียมซีที่เด้งออกมา */}
            <Animated.View
              style={[
                styles.popStick,
                { opacity: stickOp, transform: [{ translateY: popUp }] },
              ]}
            >
              <View style={styles.popTip}>
                <Text style={styles.popNum}>{pending?.id ?? ''}</Text>
              </View>
            </Animated.View>

            {/* กระบอก (สั่นได้) */}
            <Animated.View style={{ transform: [{ rotate: tubeSpin }] }}>
              <SiamsiTube size={TUBE} />
            </Animated.View>
          </View>
        )}

        {/* ผลลัพธ์ */}
        {phase === 'result' && stick && (
          <RnAnimated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={stick.insight}
              pose="fortune"
              watermark="เซียมซีป้าอ้วน 🥠"
            >
              {/* ใบเซียมซี (นอกกล่องคำพูด) */}
              <View style={styles.slip}>
                <View style={styles.slipBadge}>
                  <Text style={styles.slipBadgeText}>ใบที่ {stick.id}</Text>
                </View>
                <Text style={styles.slipTitle}>{stick.title}</Text>
                <View style={styles.slipDivider} />
                <View style={styles.slipPoemBox}>
                  {stick.poem.split('\n').map((line, i) => (
                    <Text
                      key={i}
                      style={styles.slipPoem}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.6}
                    >
                      {line}
                    </Text>
                  ))}
                </View>
              </View>
            </CaptureCard>
          </RnAnimated.View>
        )}

        <View style={{ height: 12 }} />

        <BigButton
          label={
            phase === 'shaking'
              ? 'กำลังเขย่า...'
              : phase === 'result'
                ? 'เขย่าใหม่'
                : 'เขย่าเซียมซี!'
          }
          onPress={shake}
          color={colors.siam}
          icon={<SiamsiTube size={30} />}
          disabled={phase === 'shaking'}
        />

        {phase === 'result' && stick && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 16, flexGrow: 1 },

  stage: {
    height: 230,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  popStick: {
    position: 'absolute',
    bottom: 70,
    width: 34,
    height: 104,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: colors.ink,
    backgroundColor: colors.cream,
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 2,
  },
  popTip: {
    width: '100%',
    height: 44,
    backgroundColor: colors.siam,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popNum: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.white,
  },

  // ใบเซียมซี — แดง อักษรขาว
  slip: {
    alignSelf: 'stretch',
    backgroundColor: colors.siam,
    borderWidth: 3,
    borderColor: colors.gold,
    borderRadius: 16,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 10,
  },
  slipBadge: {
    backgroundColor: colors.cream,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  slipBadgeText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.siam,
  },
  slipTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.gold,
    textAlign: 'center',
    lineHeight: 38,
  },
  slipDivider: {
    width: 70,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  slipPoemBox: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  slipPoem: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 32, // กลอน 1 บรรทัด เผื่อสระบน/ล่างไม่ขาด
  },
});
