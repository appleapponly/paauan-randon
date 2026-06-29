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
const FALL_MS = 2000;

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

    // หมุด (แท่งกั้น) เรียงสลับฟันปลา — เป็นแค่ของตกแต่งให้ดูเหมือนพินบอล
    const pegs = useMemo(() => {
      const rows = [60, 108, 156, 204];
      const out: { x: number; y: number }[] = [];
      rows.forEach((y, ri) => {
        const count = ri % 2 === 0 ? 4 : 5;
        const gap = boardW / (count + 1);
        for (let i = 1; i <= count; i++) out.push({ x: gap * i, y });
      });
      return out;
    }, [boardW]);

    useImperativeHandle(ref, () => ({
      drop(winnerIndex: number) {
        const targetX = (winnerIndex + 0.5) * slotW - boardW / 2;
        setLanded(null);
        setRunning(true);
        ballX.setValue(0);
        ballY.setValue(0);
        ballRot.setValue(0);

        // เด้งซ้าย-ขวาระหว่างตก แล้วจบที่ตรงช่องผู้ถูกสุ่ม
        const wobble = [0.20, -0.17, 0.13, -0.09, 0]
          .map((f) => f * boardW * 0.5);
        wobble.push(targetX);
        const step = FALL_MS / wobble.length;

        Animated.parallel([
          Animated.timing(ballY, {
            toValue: BOARD_H - SLOT_H / 2 - BALL / 2 - 6,
            duration: FALL_MS,
            easing: Easing.in(Easing.quad), // เร่งลงเหมือนแรงโน้มถ่วง
            useNativeDriver: true,
          }),
          Animated.sequence(
            wobble.map((x) =>
              Animated.timing(ballX, {
                toValue: x,
                duration: step,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              })
            )
          ),
          Animated.timing(ballRot, {
            toValue: 1,
            duration: FALL_MS,
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
