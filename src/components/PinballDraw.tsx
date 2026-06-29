/**
 * 🎯 PinballDraw — สนามพินบอลสุ่มรายชื่อ
 * รายชื่อทั้งหมดเรียงเป็น "ช่อง" อยู่ด้านล่าง มีหมุด(แท่งกั้น) เรียงสลับฟันปลา
 * กดสุ่ม → ลูกบอลตกจากด้านบน เด้งซ้าย-ขวาผ่านหมุด ค่อย ๆ กลิ้งลงไปตกในช่องของผู้ถูกสุ่ม
 * แล้วค่อยเรียก onLand() ให้หน้าจอเด้งการ์ดผลลัพธ์ออกมา
 *
 * ใช้ RN Animated (useNativeDriver) เพื่อความลื่นไหลจริงบนมือถือ
 * เรียกผ่าน ref: pinballRef.current?.drop(winnerIndex)
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

export interface PinballHandle {
  drop: (winnerIndex: number) => void;
}

interface Props {
  names: string[];
  /** สีไฮไลต์ช่องผู้ถูกสุ่ม */
  accent: string;
  /** เรียกเมื่อบอลตกถึงช่องแล้ว (ให้หน้าจอโชว์การ์ดผล) */
  onLand: () => void;
}

const BOARD_H = 300;
const SLOT_H = 56;
const BALL = 24;
const PEG_YS = [58, 104, 150, 196, 242]; // แถวหมุด (แท่งกั้น) เรียงสลับฟันปลา
const SEG_MS = 300; // เวลาเด้งต่อ 1 หมุด
const LAND_MS = 520; // เวลาตกลงช่องสุดท้าย (เด้งหน่อย)

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const PinballDraw = forwardRef<PinballHandle, Props>(
  ({ names, accent, onLand }, ref) => {
    const { width } = useWindowDimensions();
    const boardW = Math.min(width - 40, 360);

    const ballX = useRef(new Animated.Value(0)).current; // เลื่อนซ้าย-ขวา (relative กลางสนาม)
    const ballY = useRef(new Animated.Value(0)).current; // ตกลงล่าง
    const ballRot = useRef(new Animated.Value(0)).current;
    const [landed, setLanded] = useState<number | null>(null);
    const [running, setRunning] = useState(false);

    const n = Math.max(names.length, 1);
    const slotW = boardW / n;

    // หมุด (แท่งกั้น) เรียงสลับฟันปลา — ลูกบอลจะเด้งกระทบหมุดพวกนี้
    const pegs = useMemo(() => {
      const out: { x: number; y: number }[] = [];
      PEG_YS.forEach((y, ri) => {
        const count = ri % 2 === 0 ? 5 : 4;
        const gap = boardW / (count + 1);
        for (let i = 1; i <= count; i++) out.push({ x: gap * i, y });
      });
      return out;
    }, [boardW]);

    useImperativeHandle(ref, () => ({
      drop(winnerIndex: number) {
        const targetX = (winnerIndex + 0.5) * slotW - boardW / 2;
        const half = boardW / 2;
        const margin = BALL / 2 + 6;
        setLanded(null);
        setRunning(true);
        ballX.setValue(0);
        ballY.setValue(0);
        ballRot.setValue(0);

        // ===== หาตำแหน่ง x ที่แต่ละแถวหมุด =====
        // เด้งสลับซ้าย-ขวา (ขั้นบันได) แต่ค่อย ๆ ดริฟต์เข้าหาช่องเป้าหมาย
        // แอมพลิจูดหดลงเรื่อย ๆ → แถวสุดท้ายลงตรงช่องพอดี
        const amp = boardW * 0.17; // ระยะเด้งออกข้างต่อหมุด
        const xs: number[] = [];
        for (let i = 0; i < PEG_YS.length; i++) {
          const t = (i + 1) / (PEG_YS.length + 1); // ความคืบหน้า 0→1
          const drift = targetX * t; // ค่อย ๆ เข้าหาเป้า
          const zig = (i % 2 === 0 ? 1 : -1) * amp * (1 - t); // สลับซ้าย/ขวา หดลง
          xs.push(clamp(drift + zig, -half + margin, half - margin));
        }
        const slotY = BOARD_H - SLOT_H / 2 - BALL / 2 - 6;

        // ===== สร้างชุดแอนิเมชัน: ตกชนหมุดทีละแถว → เด้งเฉียง =====
        // แต่ละช่วง Y เร่งลง (แรงโน้มถ่วง) + X พุ่งออกข้างเร็ว (เด้งกระทบ)
        const segs: Animated.CompositeAnimation[] = [];
        PEG_YS.forEach((y, i) => {
          segs.push(
            Animated.parallel([
              Animated.timing(ballY, {
                toValue: y,
                duration: SEG_MS,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(ballX, {
                toValue: xs[i],
                duration: SEG_MS,
                easing: Easing.out(Easing.cubic), // เด้งออกข้างไว แล้วชะลอ
                useNativeDriver: true,
              }),
            ])
          );
        });
        // ตกลงช่องสุดท้าย — เด้งหน่อยเหมือนหล่นลงกล่อง
        segs.push(
          Animated.parallel([
            Animated.timing(ballY, {
              toValue: slotY,
              duration: LAND_MS,
              easing: Easing.bounce,
              useNativeDriver: true,
            }),
            Animated.timing(ballX, {
              toValue: targetX,
              duration: LAND_MS,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        );

        const total = SEG_MS * PEG_YS.length + LAND_MS;
        Animated.parallel([
          Animated.sequence(segs),
          Animated.timing(ballRot, {
            toValue: 1,
            duration: total,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setLanded(winnerIndex);
          setRunning(false);
          onLand();
        });
      },
    }));

    const spin = ballRot.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '900deg'],
    });

    return (
      <View style={[styles.board, { width: boardW, height: BOARD_H }]}>
        {/* หมุดกั้น */}
        {pegs.map((p, i) => (
          <View key={i} style={[styles.peg, { left: p.x - 4, top: p.y }]} />
        ))}

        {/* ลูกบอล */}
        <Animated.View
          style={[
            styles.ball,
            {
              left: boardW / 2 - BALL / 2,
              transform: [
                { translateX: ballX },
                { translateY: ballY },
                { rotate: spin },
              ],
            },
          ]}
        >
          <View style={styles.ballShine} />
        </Animated.View>

        {/* ช่องรายชื่อด้านล่าง */}
        <View style={[styles.slots, { height: SLOT_H }]}>
          {names.map((name, i) => (
            <View
              key={`${name}-${i}`}
              style={[
                styles.slot,
                { width: slotW },
                i > 0 && styles.slotDivider,
                landed === i && { backgroundColor: accent },
              ]}
            >
              <Text
                style={[styles.slotText, landed === i && styles.slotTextWin]}
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>
          ))}
        </View>

        {running && <View style={styles.lock} pointerEvents="auto" />}
      </View>
    );
  }
);

PinballDraw.displayName = 'PinballDraw';

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 18,
    overflow: 'hidden',
  },
  peg: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ink,
    opacity: 0.35,
  },
  ball: {
    position: 'absolute',
    top: 4,
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    backgroundColor: colors.pink,
    borderWidth: 2,
    borderColor: colors.ink,
    zIndex: 2,
  },
  ballShine: {
    position: 'absolute',
    top: 3,
    left: 4,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.white,
    opacity: 0.8,
  },
  slots: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 3,
    borderTopColor: colors.ink,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    backgroundColor: colors.cream,
  },
  slotDivider: {
    borderLeftWidth: 2,
    borderLeftColor: colors.ink,
  },
  slotText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    color: colors.ink,
  },
  slotTextWin: {
    fontFamily: fonts.bold,
    color: colors.white,
  },
  lock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
