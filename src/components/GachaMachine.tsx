/**
 * 🎰 GachaMachine — ตู้กาชาปองการ์ตูน (View + RN Animated ล้วน ไม่ใช้ SVG / ไม่ใช้ reanimated)
 * โครง: โดมแก้วมีลูกบอลสี ๆ → ตัวตู้แดง + ป้ายชื่อ → ลูกบิด + ช่องลูกบอลออก
 *
 * ทำไมใช้ RN Animated ไม่ใช้ reanimated:
 *   reanimated v4 withTiming ไม่ขยับจริงบนเว็บ + completion callback ไม่ยิง (บทเรียนเดียวกับ SpinWheel)
 *   RN Animated ทำงานทั้งเว็บและมือถือ → ตู้กาชาจึงมี animation ให้ลุ้นครบทุกแพลตฟอร์ม ไม่ต้องมี guard
 *
 * ลำดับ: idle (ลูกบอลลอยเบา ๆ) → spinning (ลูกบิดหมุนหลายรอบ + ลูกบอลหมุนวนแรง + ลูกบอลหล่นเด้ง)
 *        → ballOut (แตะลูกบอล) → เปลือกแตก → parent โชว์ผล
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';
import { tick } from '@/utils/haptics';
import { PaaUanBubble } from '@/components/PaaUanBubble';

// ⚠️ useNativeDriver ต้องเป็น false — native driver ไม่รองรับบน react-native-web
//    (ค่า animate ไม่ไหลลง DOM = ตู้ค้างนิ่งบนเว็บ) · JS driver ขยับจริงทั้งเว็บ/มือถือ
//    งานสั้น ๆ แค่นี้ JS thread รับไหวสบาย ไม่มีปัญหา performance
//    หมายเหตุ: transform แบบ rotate (ลูกบิด/เปลือกแตก) จะเห็นเฉพาะบนมือถือ —
//    RN-web ไม่ animate rotate (เหมือนวงล้อ SpinWheel) แต่ translate (ลูกบอลหมุนวน/หล่น) เห็นบนเว็บ
const USE_NATIVE = false;

type GachaState = 'idle' | 'spinning' | 'ballOut';

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

const SPIN_MS = 1600; // ระยะเวลาบิดก่อนลูกบอลหล่น

/** ตำแหน่งลูกบอลในโดม + ทิศ/แรงสั่นเฉพาะลูก (จัดมือให้ดูสุมกันธรรมชาติ) */
const DOME_BALLS = [
  { x: 24, y: 58, c: 0 }, { x: 66, y: 66, c: 1 }, { x: 108, y: 56, c: 2 },
  { x: 150, y: 64, c: 3 }, { x: 44, y: 26, c: 4 }, { x: 88, y: 20, c: 0 },
  { x: 130, y: 28, c: 1 }, { x: 178, y: 40, c: 2 },
].map((b, i) => ({
  ...b,
  // แอมพลิจูดสั่นตอนหมุน (สลับทิศตามลูก ให้ดูสุ่ม ๆ)
  wx: (i % 2 ? 1 : -1) * (11 + ((i * 7) % 9)),
  wy: (((i % 3) - 1) || 1) * (9 + ((i * 5) % 7)),
}));

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

    // Animated.Value ทั้งหมด (RN Animated — เล่นได้ทั้งเว็บ/มือถือ)
    const idle = useRef(new Animated.Value(0)).current;   // ลอยเบา ๆ ตอนพัก (loop ตลอด)
    const churn = useRef(new Animated.Value(0)).current;  // หมุนวนแรงตอนบิด (loop เฉพาะตอน spin)
    const dial = useRef(new Animated.Value(0)).current;   // ลูกบิดหมุน 0→1 (= 0→1080°)
    const ballY = useRef(new Animated.Value(0)).current;  // ลูกบอลหล่นลงถาด (px)
    const crackP = useRef(new Animated.Value(0)).current; // เปลือกแตก 0→1

    const churnLoop = useRef<Animated.CompositeAnimation | null>(null);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    // ลอยเบา ๆ ตอนพัก — เริ่ม loop ครั้งเดียวตอน mount
    useEffect(() => {
      const loop = Animated.loop(
        Animated.timing(idle, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: USE_NATIVE })
      );
      loop.start();
      return () => {
        loop.stop();
        churnLoop.current?.stop();
        timers.current.forEach(clearTimeout);
        timers.current = [];
      };
    }, [idle]);

    function later(fn: () => void, ms: number) {
      timers.current.push(setTimeout(fn, ms));
    }

    function crank() {
      // เคลียร์ของรอบเก่า (กันบิดซ้ำตอนลูกยังไม่เปิด)
      timers.current.forEach(clearTimeout);
      timers.current = [];
      churnLoop.current?.stop();
      crackP.setValue(0);
      ballY.setValue(0);
      setBallColor(GACHA_BALL_COLORS[Math.floor(Math.random() * GACHA_BALL_COLORS.length)]);

      setState('spinning');

      // ลูกบิดหมุน 3 รอบ เร็วแล้วค่อยช้าลง (เห็นบนมือถือ — rotate ไม่ทำงานบน RN-web)
      dial.setValue(0);
      Animated.timing(dial, {
        toValue: 1,
        duration: SPIN_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE,
      }).start();

      // ลูกบอลในโดมหมุนวน/สั่นสุมแรง ๆ (loop เร็ว จนกว่าจะหล่น)
      churn.setValue(0);
      churnLoop.current = Animated.loop(
        Animated.timing(churn, { toValue: 1, duration: 200, easing: Easing.linear, useNativeDriver: USE_NATIVE })
      );
      churnLoop.current.start();

      // สั่นติ๊กตามจังหวะ (ถี่ตอนแรก)
      [0, 250, 550, 850, 1150, 1450].forEach((ms) => later(tick, ms));

      // ครบเวลา → หยุดหมุน แล้วลูกบอลหล่นลงถาดเด้งดึ๋ง
      later(() => {
        churnLoop.current?.stop();
        churn.setValue(0);
        setState('ballOut');
        ballY.setValue(-96); // เริ่มจากบน (แถวช่องลูกบอลออก)
        Animated.sequence([
          Animated.timing(ballY, { toValue: 0, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: USE_NATIVE }),
          Animated.timing(ballY, { toValue: -22, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: USE_NATIVE }),
          Animated.timing(ballY, { toValue: 0, duration: 150, easing: Easing.in(Easing.quad), useNativeDriver: USE_NATIVE }),
          Animated.timing(ballY, { toValue: -8, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: USE_NATIVE }),
          Animated.timing(ballY, { toValue: 0, duration: 90, easing: Easing.in(Easing.quad), useNativeDriver: USE_NATIVE }),
        ]).start();
      }, SPIN_MS);
    }

    useImperativeHandle(ref, () => ({ crank }));

    function openBall() {
      if (state !== 'ballOut') return;
      // เล่น animation เปลือกแตก (แสดงผลอย่างเดียว)
      Animated.timing(crackP, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: USE_NATIVE,
      }).start();
      // ⚠️ เปลี่ยนสถานะด้วย JS timer ไม่ใช่ completion callback ของ Animated
      //    (callback ไม่เชื่อถือได้บนเว็บ — เหมือน SpinWheel ที่ใช้ setTimeout ส่งผล)
      later(() => {
        setState('idle');
        onBallOpened();
      }, 360);
    }

    // ลูกบิดหมุนสะสม 3 รอบ (1080°) — flatten style เป็น object ล้วนเพื่อความชัวร์
    const dialRotate = dial.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1080deg'] });
    const dialFlat = StyleSheet.flatten(styles.dial);
    // เปลือก 2 ซีกกระเด็นคนละทาง
    const crackXL = crackP.interpolate({ inputRange: [0, 1], outputRange: [0, -46] });
    const crackXR = crackP.interpolate({ inputRange: [0, 1], outputRange: [0, 46] });
    const crackRotL = crackP.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-70deg'] });
    const crackRotR = crackP.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '70deg'] });
    const crackOpacity = crackP.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

    // transform ของลูกบอลในโดมแต่ละลูก (ต่างเฟส/ทิศตามลูก) — คำนวณครั้งเดียวต่อ mount
    const ballTransforms = useMemo(
      () =>
        DOME_BALLS.map((b) => ({
          idleY: idle.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -3, 0] }),
          churnX: churn.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, b.wx, -b.wx * 0.7, b.wx * 0.5, 0],
          }),
          churnY: churn.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, b.wy, -b.wy * 0.6, b.wy * 0.8, 0],
          }),
        })),
      [idle, churn]
    );

    const spinning = state === 'spinning';

    return (
      <View style={styles.wrap}>
        {/* โดมแก้ว */}
        <View style={styles.dome}>
          {DOME_BALLS.map((b, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: b.x,
                top: b.y,
                transform: spinning
                  ? [{ translateX: ballTransforms[i].churnX }, { translateY: ballTransforms[i].churnY }]
                  : [{ translateY: ballTransforms[i].idleY }],
              }}
            >
              <GachaBall size={40} color={GACHA_BALL_COLORS[b.c]} />
            </Animated.View>
          ))}
        </View>

        {/* ตัวตู้ */}
        <View style={styles.cabinet}>
          <View style={styles.nameplate}>
            <Text style={styles.nameplateText}>{t('กาชาป้าอ้วน', "Auntie's Gacha")}</Text>
          </View>

          <View style={styles.row}>
            {/* ลูกบิด — กดได้เหมือนปุ่มสุ่ม
                ⚠️ ต้อง flatten style เป็น object ล้วน — RN-web ไม่ track animated transform
                ที่ซ้อนใน array [styleId, {transform}] (rotate จะค้างที่ 0 บนเว็บ) */}
            <Pressable onPress={onCrank}>
              <Animated.View style={{ ...dialFlat, transform: [{ rotate: dialRotate }] }}>
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
              <Animated.View style={{ transform: [{ translateY: ballY }] }}>
                {/* เปลือก 2 ซีก (ตอนแตกกระเด็นคนละทาง) */}
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    { opacity: crackOpacity, transform: [{ translateX: crackXL }, { rotate: crackRotL }] },
                  ]}
                >
                  <GachaBall size={64} color={ballColor} />
                </Animated.View>
                <Animated.View
                  style={{ opacity: crackOpacity, transform: [{ translateX: crackXR }, { rotate: crackRotR }] }}
                >
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
