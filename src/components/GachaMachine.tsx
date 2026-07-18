/**
 * 🎰 GachaMachine — ตู้กาชาปองการ์ตูน (View + reanimated ล้วน ไม่ใช้ SVG)
 * โครง: โดมแก้วมีลูกบอลสี ๆ → ตัวตู้แดง + ป้ายชื่อ → ลูกบิด + ช่องลูกบอลออก
 * Task 8 = โครงนิ่ง (idle) · Task 9 = state machine + animation + ปฏิสัมพันธ์
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';
import { tick } from '@/utils/haptics';
import { PaaUanBubble } from '@/components/PaaUanBubble';

type GachaState = 'idle' | 'spinning' | 'ballOut';
const INSTANT = Platform.OS === 'web'; // web: ข้าม animation (withTiming ไม่ขยับบนเว็บ)

export interface GachaMachineHandle {
  /** เริ่มบิด (เรียกจากปุ่ม BigButton ของ parent) */
  crank: () => void;
}

export interface GachaMachineProps {
  /** ผู้ใช้กดลูกบิดตรง ๆ — parent ต้องเรียก registerSpin() เองในนี้ */
  onCrank: () => void;
  /** ลูกบอลถูกแตะจนแตก → parent สุ่มเลขและโชว์ผล */
  onBallOpened: () => void;
}

export const GACHA_BALL_COLORS = [colors.pink, colors.gold, colors.jade, colors.blue, colors.purple];

/** ตำแหน่งลูกบอลในโดม (จัดมือให้ดูสุมกันธรรมชาติ) */
const DOME_BALLS: { x: number; y: number; c: number }[] = [
  { x: 24, y: 58, c: 0 }, { x: 66, y: 66, c: 1 }, { x: 108, y: 56, c: 2 },
  { x: 150, y: 64, c: 3 }, { x: 44, y: 26, c: 4 }, { x: 88, y: 20, c: 0 },
  { x: 130, y: 28, c: 1 }, { x: 178, y: 40, c: 2 },
];

/** ลูกบอลกาชา 2 สี (ครึ่งบนสี ครึ่งล่างขาว) + จุดไฮไลต์ */
export function GachaBall({ size, color }: { size: number; color: string }) {
  return (
    <View style={[ballStyles.ball, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[ballStyles.top, { backgroundColor: color, height: size / 2 }]} />
      <View style={[ballStyles.shine, { top: size * 0.12, left: size * 0.16, width: size * 0.2, height: size * 0.2 }]} />
    </View>
  );
}

export const GachaMachine = forwardRef<GachaMachineHandle, GachaMachineProps>(
  ({ onCrank, onBallOpened }, ref) => {
    const [state, setState] = useState<GachaState>('idle');
    const [ballColor, setBallColor] = useState(GACHA_BALL_COLORS[0]);
    const dialDeg = useSharedValue(0);      // ลูกบิดหมุนสะสม
    const shake = useSharedValue(0);        // เขย่าโดม -1..1
    const dropY = useSharedValue(0);        // ลูกบอลตก 0→1 (แปลงเป็น translateY)
    const crackP = useSharedValue(0);       // เปลือกแตก 0→1
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
      return () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
      };
    }, []);

    function later(fn: () => void, ms: number) {
      timers.current.push(setTimeout(fn, ms));
    }

    function crank() {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      crackP.value = 0;
      dropY.value = 0;
      setBallColor(GACHA_BALL_COLORS[Math.floor(Math.random() * GACHA_BALL_COLORS.length)]);

      if (INSTANT) {
        setState('ballOut');
        return;
      }
      setState('spinning');
      // ลูกบิดหมุน 180° + ติ๊ก 3 จังหวะ
      dialDeg.value = withTiming(dialDeg.value + 180, { duration: 600, easing: Easing.out(Easing.quad) });
      later(tick, 0); later(tick, 220); later(tick, 450);
      // โดมเขย่า ~1 วิ
      shake.value = withSequence(
        withRepeat(withTiming(1, { duration: 70 }), 12, true),
        withTiming(0, { duration: 80 })
      );
      // ลูกบอลหล่นลงถาด (หลังเขย่าจบ) แล้วเข้าสถานะรอเปิด
      later(() => {
        setState('ballOut');
        dropY.value = 0;
        dropY.value = withSequence(
          withTiming(1, { duration: 420, easing: Easing.in(Easing.quad) }),
          withTiming(0.92, { duration: 110 }),
          withTiming(1, { duration: 110 })
        );
      }, 1000);
    }

    useImperativeHandle(ref, () => ({ crank }));

    function openBall() {
      if (state !== 'ballOut') return;
      if (INSTANT) {
        setState('idle');
        onBallOpened();
        return;
      }
      crackP.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }, (done) => {
        if (done) runOnJS(finishOpen)();
      });
    }
    function finishOpen() {
      setState('idle');
      onBallOpened();
    }

    const domeStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shake.value * 5 }],
    }));
    const dialStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${dialDeg.value}deg` }],
    }));
    // ลูกบอลที่ออก: โผล่จากช่อง outlet แล้วตกลงถาดหน้าตู้
    const droppedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: dropY.value * 74 }],
      opacity: state === 'ballOut' || crackP.value > 0 ? 1 : 0,
    }));
    const halfL = useAnimatedStyle(() => ({
      transform: [
        { translateX: -crackP.value * 46 },
        { rotate: `${-crackP.value * 70}deg` },
      ],
      opacity: 1 - crackP.value,
    }));
    const halfR = useAnimatedStyle(() => ({
      transform: [
        { translateX: crackP.value * 46 },
        { rotate: `${crackP.value * 70}deg` },
      ],
      opacity: 1 - crackP.value,
    }));

    return (
      <View style={styles.wrap}>
        {/* โดมแก้ว */}
        <Animated.View style={[styles.dome, domeStyle]}>
          {DOME_BALLS.map((b, i) => (
            <View key={i} style={{ position: 'absolute', left: b.x, top: b.y }}>
              <GachaBall size={40} color={GACHA_BALL_COLORS[b.c]} />
            </View>
          ))}
        </Animated.View>

        {/* ตัวตู้ */}
        <View style={styles.cabinet}>
          <View style={styles.nameplate}>
            <Text style={styles.nameplateText}>{t('กาชาป้าอ้วน', "Auntie's Gacha")}</Text>
          </View>

          <View style={styles.row}>
            {/* ลูกบิด — กดได้เหมือนปุ่มสุ่ม */}
            <Pressable onPress={onCrank}>
              <Animated.View style={[styles.dial, dialStyle]}>
                <View style={styles.dialSlot} />
              </Animated.View>
            </Pressable>

            {/* ช่องลูกบอลออก */}
            <View style={styles.outlet} />
          </View>
        </View>

        {state === 'ballOut' && (
          <View style={styles.trayArea}>
            <Pressable onPress={openBall}>
              <Animated.View style={droppedStyle}>
                {/* เปลือก 2 ซีก (ตอนแตกกระเด็นคนละทาง) ทับด้วยลูกบอลเต็มตอนยังไม่แตก */}
                <Animated.View style={[StyleSheet.absoluteFill, halfL]}>
                  <GachaBall size={64} color={ballColor} />
                </Animated.View>
                <Animated.View style={halfR}>
                  <GachaBall size={64} color={ballColor} />
                </Animated.View>
              </Animated.View>
            </Pressable>
            <PaaUanBubble
              text={t('แตะลูกบอลเปิดเลยลูก!', 'Tap the ball to open it!')}
              mood="happy"
              imageWidth={64}
            />
          </View>
        )}
      </View>
    );
  }
);

GachaMachine.displayName = 'GachaMachine';

const ballStyles = StyleSheet.create({
  ball: {
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.ink,
    overflow: 'hidden',
  },
  top: { width: '100%' },
  shine: { position: 'absolute', backgroundColor: colors.white, borderRadius: 999, opacity: 0.85 },
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', alignSelf: 'center', width: 260 },
  dome: {
    width: 240,
    height: 130,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderWidth: 3,
    borderColor: colors.ink,
    borderBottomWidth: 0,
    backgroundColor: '#E8F6F7', // ฟ้าจาง ๆ ให้ดูเป็นกระจก
    overflow: 'hidden',
  },
  cabinet: {
    width: 260,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 18,
    backgroundColor: colors.siam,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    // เงา offset ภาษาเดียวกับการ์ด/ปุ่มทั้งแอป
    shadowColor: colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  nameplate: {
    alignSelf: 'center',
    backgroundColor: colors.butter,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  nameplateText: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dial: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cream,
    borderWidth: 3,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialSlot: {
    width: 40,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.ink,
  },
  outlet: {
    width: 76,
    height: 64,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.ink,
    backgroundColor: '#7A0E24', // แดงเข้มกว่าตัวตู้ = ช่องลึก
  },
  trayArea: { marginTop: 10, alignItems: 'center', gap: 10, width: '100%' },
});
