/**
 * 🪜 LadderBoard — สุ่มแบบ "บันไดวิบวับ" (amidakuji เหมือนใน LINE)
 *
 * มีเส้นแนวตั้งหลายเลน + คานขวางสุ่ม เส้นทางจะค่อย ๆ ไล่ลงช้า ๆ ให้ลุ้น
 * แล้วไปจบที่ช่องผลลัพธ์ด้านล่าง (รองรับหลายผลลัพธ์ ไล่ทีละเส้น)
 * เรียกผ่าน ref: ladderRef.current?.run([slotA, slotB])
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

const HEAD_IMG = require('../../assets/images/paa-head.png'); // หน้าป้า ใช้แทนลูกบอลวิ่งบนบันได

export interface LadderHandle {
  /** targets = ช่องผลลัพธ์ (index ใน options) ที่ต้องการให้เส้นไปจบ ไล่ทีละเส้น */
  run: (targets: number[]) => void;
}

interface Props {
  options: string[];
  accent: string;
  onLand: () => void;
}

const TOP_PAD = 16;
const LEVELS = 9; // จำนวนชั้นคานขวาง (มากขึ้น = ลุ้นนานขึ้น)
const LEVEL_GAP = 34;
const BOTTOM_PAD = 20;
const STEP_MS = 240; // เวลาต่อ 1 ช่วงเส้น (ช้าลง = ลุ้นนาน)
const MARK = 30; // ขนาดหน้าป้าที่วิ่งบนบันได

export const LadderBoard = forwardRef<LadderHandle, Props>(
  ({ options, accent, onLand }, ref) => {
    const { width } = useWindowDimensions();
    const boardW = Math.min(width - 40, 360);
    const L = Math.max(options.length, 2);

    const laneMargin = 30;
    const laneGap = (boardW - 2 * laneMargin) / (L - 1 || 1);
    const laneX = (i: number) => laneMargin + i * laneGap;
    const slotW = Math.min(laneGap * 0.94, 74);
    const topY = TOP_PAD;
    const levelY = (j: number) => TOP_PAD + 24 + j * LEVEL_GAP;
    const bottomY = TOP_PAD + 24 + LEVELS * LEVEL_GAP;
    const boardH = bottomY + BOTTOM_PAD;

    const markerX = useRef(new Animated.Value(0)).current;
    const markerY = useRef(new Animated.Value(0)).current;
    const [running, setRunning] = useState(false);
    const [showMarker, setShowMarker] = useState(false);
    const [landed, setLanded] = useState<number[]>([]);

    // ===== สุ่มคานขวาง (rungs[level][i] = มีคานเชื่อมเลน i กับ i+1) =====
    // กันไม่ให้คานติดกันในเลนเดียวกันชั้นเดียวกัน (amidakuji ที่ถูกต้อง)
    const rungs = useMemo(() => {
      const rs: boolean[][] = [];
      for (let j = 0; j < LEVELS; j++) {
        const row = new Array(L - 1).fill(false);
        for (let i = 0; i < L - 1; i++) {
          if (i > 0 && row[i - 1]) continue; // ห้ามคานติดกัน
          row[i] = Math.random() < 0.5;
        }
        rs.push(row);
      }
      return rs;
    }, [L]);

    // จำลองเส้นทาง: เริ่มเลน start ไล่ลง → จบเลนไหน
    const endOf = (start: number) => {
      let pos = start;
      for (let j = 0; j < LEVELS; j++) {
        if (pos > 0 && rungs[j][pos - 1]) pos--;
        else if (pos < L - 1 && rungs[j][pos]) pos++;
      }
      return pos;
    };

    // waypoints ของเส้นทางจาก start (ไว้ให้ marker เดินตาม)
    const pathOf = (start: number) => {
      const pts: { x: number; y: number }[] = [{ x: laneX(start), y: topY }];
      let pos = start;
      for (let j = 0; j < LEVELS; j++) {
        pts.push({ x: laneX(pos), y: levelY(j) }); // ลงมาชั้น j
        if (pos > 0 && rungs[j][pos - 1]) {
          pos--;
          pts.push({ x: laneX(pos), y: levelY(j) }); // ข้ามคานไปซ้าย
        } else if (pos < L - 1 && rungs[j][pos]) {
          pos++;
          pts.push({ x: laneX(pos), y: levelY(j) }); // ข้ามคานไปขวา
        }
      }
      pts.push({ x: laneX(pos), y: bottomY }); // ลงถึงช่องผลลัพธ์
      return pts;
    };

    useImperativeHandle(ref, () => ({
      run(targets: number[]) {
        const valid = targets.filter((t) => t >= 0 && t < L);
        if (valid.length === 0) return;
        // หา start ของแต่ละ target (endOf(start) === target)
        const starts = valid.map((t) => {
          for (let s = 0; s < L; s++) if (endOf(s) === t) return s;
          return t;
        });

        setLanded([]);
        setRunning(true);
        setShowMarker(true);

        const traceOne = (k: number) => {
          if (k >= starts.length) {
            setShowMarker(false);
            setRunning(false);
            onLand();
            return;
          }
          const pts = pathOf(starts[k]);
          markerX.setValue(pts[0].x - MARK / 2);
          markerY.setValue(pts[0].y - MARK / 2);
          const segs = pts.slice(1).map((p) =>
            Animated.parallel([
              Animated.timing(markerX, {
                toValue: p.x - MARK / 2,
                duration: STEP_MS,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(markerY, {
                toValue: p.y - MARK / 2,
                duration: STEP_MS,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
            ])
          );
          Animated.sequence(segs).start(() => {
            setLanded((prev) => [...prev, valid[k]]);
            setTimeout(() => traceOne(k + 1), 400);
          });
        };
        traceOne(0);
      },
    }));

    return (
      <View style={[styles.board, { width: boardW, height: boardH }]}>
        {/* เส้นแนวตั้ง (เลน) */}
        {Array.from({ length: L }, (_, i) => (
          <View
            key={'lane' + i}
            style={[styles.lane, { left: laneX(i) - 1.5, top: topY, height: bottomY - topY }]}
          />
        ))}

        {/* คานขวาง */}
        {rungs.map((row, j) =>
          row.map((on, i) =>
            on ? (
              <View
                key={`r${j}-${i}`}
                style={[
                  styles.rung,
                  { left: laneX(i), top: levelY(j) - 1.5, width: laneGap },
                ]}
              />
            ) : null
          )
        )}

        {/* ช่องผลลัพธ์ด้านล่าง */}
        {options.map((opt, i) => {
          const order = landed.indexOf(i);
          const win = order >= 0;
          return (
            <View
              key={'slot' + i}
              style={[
                styles.slot,
                { left: laneX(i) - slotW / 2, top: bottomY, width: slotW },
                win && { backgroundColor: accent, borderColor: colors.ink },
              ]}
            >
              <Text style={[styles.slotText, win && styles.slotTextWin]} numberOfLines={2}>
                {opt}
              </Text>
              {win && (
                <View style={styles.orderBadge}>
                  <Text style={styles.orderText}>{order + 1}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* marker เดินตามเส้น */}
        {showMarker && (
          <Animated.View
            style={[styles.marker, { transform: [{ translateX: markerX }, { translateY: markerY }] }]}
            pointerEvents="none"
          >
            <Image source={HEAD_IMG} style={styles.markerImg} resizeMode="contain" />
          </Animated.View>
        )}

        {running && <View style={styles.lock} pointerEvents="auto" />}
      </View>
    );
  }
);

LadderBoard.displayName = 'LadderBoard';

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 18,
    marginBottom: 44, // เผื่อช่องผลลัพธ์ที่ยื่นออกล่างกรอบ
  },
  lane: {
    position: 'absolute',
    width: 3,
    backgroundColor: colors.muted,
    opacity: 0.5,
  },
  rung: {
    position: 'absolute',
    height: 3,
    backgroundColor: colors.ink,
    opacity: 0.55,
  },
  slot: {
    position: 'absolute',
    height: 40,
    borderWidth: 2,
    borderColor: colors.muted,
    borderRadius: 10,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  slotText: { fontFamily: fonts.medium, fontSize: 9, color: colors.ink, textAlign: 'center' },
  slotTextWin: { fontFamily: fonts.bold, color: colors.white },
  orderBadge: {
    position: 'absolute',
    top: -8,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: { fontFamily: fonts.bold, fontSize: 11, color: colors.ink },
  marker: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MARK,
    height: MARK,
    zIndex: 5,
  },
  markerImg: { width: '100%', height: '100%' },
  lock: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});
