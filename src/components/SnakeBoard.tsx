/**
 * 🐍 SnakeBoard — กระดาน "งูตกช่อง" สุ่มออกกำลังกาย (2 สเตจ)
 *
 * สเตจ 1: หัวงูเลื้อยไล่ทีละช่องแบบงูตกช่อง (serpentine ล่างขึ้นบน) ไปหยุดที่ "ท่า" ที่สุ่มได้
 * สเตจ 2: โผล่แถบจำนวนของท่านั้น แล้วเลื้อยต่อไปหยุดที่ "จำนวน" (กี่ครั้ง/กี่กม./กี่นาที)
 * เสร็จแล้วเรียก onLand() ให้หน้าจอเด้งการ์ดภารกิจ
 *
 * ใช้ RN Animated (useNativeDriver, translateX/Y) แบบเดียวกับ PinballDraw
 * เรียกผ่าน ref: snakeRef.current?.roll({ exIndex, variantIndex, amountIndex })
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
import { Exercise, UNIT_LABEL } from '@/data/exercises';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

export interface SnakePick {
  exIndex: number;
  variantIndex: number;
  amountIndex: number;
}

export interface SnakeHandle {
  roll: (pick: SnakePick) => void;
}

interface Props {
  pool: Exercise[];
  accent: string;
  onLand: () => void;
}

const HEAD = 32;
const PAD = 10;
const GAP = 8;
const STEP_MS = 220; // เวลาเลื้อยต่อ 1 ช่อง (สเตจ 1)
const AMT_MS = 200; // เวลาเลื้อยต่อ 1 จำนวน (สเตจ 2)
const STAGE_GAP_MS = 300; // เว้นจังหวะก่อนเริ่มสเตจ 2

export const SnakeBoard = forwardRef<SnakeHandle, Props>(
  ({ pool, accent, onLand }, ref) => {
    const { width } = useWindowDimensions();
    const boardW = Math.min(width - 40, 360);

    const headX = useRef(new Animated.Value(0)).current;
    const headY = useRef(new Animated.Value(0)).current;
    const markerX = useRef(new Animated.Value(0)).current;

    const [running, setRunning] = useState(false);
    const [landedTile, setLandedTile] = useState<number | null>(null);
    const [strip, setStrip] = useState<{ ex: Exercise; variantIndex: number } | null>(null);
    const [landedAmt, setLandedAmt] = useState<number | null>(null);

    const n = Math.max(pool.length, 1);

    // ===== วางผังช่องแบบงูตกช่อง (serpentine ล่างขึ้นบน) =====
    const grid = useMemo(() => {
      const cols = Math.min(4, n);
      const rows = Math.ceil(n / cols);
      const tileW = (boardW - 2 * PAD - (cols - 1) * GAP) / cols;
      const tileH = Math.max(54, tileW * 0.86);
      const boardH = 2 * PAD + rows * tileH + (rows - 1) * GAP;
      // center ของแต่ละช่องตามลำดับเส้นทาง (index 0 = ล่างสุด)
      const centers: { x: number; y: number }[] = [];
      for (let k = 0; k < n; k++) {
        const r = Math.floor(k / cols); // แถวจากล่าง
        const rowFromTop = rows - 1 - r;
        const inRow = k % cols;
        const col = r % 2 === 0 ? inRow : cols - 1 - inRow; // สลับซ้าย-ขวา
        const x = PAD + col * (tileW + GAP) + tileW / 2;
        const y = PAD + rowFromTop * (tileH + GAP) + tileH / 2;
        centers.push({ x, y });
      }
      return { cols, rows, tileW, tileH, boardH, centers };
    }, [boardW, n]);

    // ตำแหน่ง top-left ของแต่ละช่อง (ไว้ render)
    const tilePos = (k: number) => ({
      left: grid.centers[k].x - grid.tileW / 2,
      top: grid.centers[k].y - grid.tileH / 2,
    });

    // ขนาดชิปจำนวนในสเตจ 2
    const amountChipW = (count: number) =>
      Math.min((boardW - 2 * PAD - (count - 1) * GAP) / count, 92);

    useImperativeHandle(ref, () => ({
      roll({ exIndex, variantIndex, amountIndex }: SnakePick) {
        const target = Math.min(exIndex, n - 1);
        const variant = pool[target].variants[variantIndex] ?? pool[target].variants[0];

        setRunning(true);
        setLandedTile(null);
        setStrip(null);
        setLandedAmt(null);

        // เริ่มที่ช่องแรก (ล่างสุด)
        headX.setValue(grid.centers[0].x - HEAD / 2);
        headY.setValue(grid.centers[0].y - HEAD / 2);
        markerX.setValue(0);

        // ---- สเตจ 1: เลื้อยทีละช่องขึ้นไปหาท่าเป้าหมาย ----
        const steps: Animated.CompositeAnimation[] = [];
        for (let k = 1; k <= target; k++) {
          steps.push(
            Animated.parallel([
              Animated.timing(headX, {
                toValue: grid.centers[k].x - HEAD / 2,
                duration: STEP_MS,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(headY, {
                toValue: grid.centers[k].y - HEAD / 2,
                duration: STEP_MS,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
            ])
          );
        }
        const stage1 =
          steps.length > 0 ? Animated.sequence(steps) : Animated.delay(250);

        stage1.start(() => {
          setLandedTile(target);
          setStrip({ ex: pool[target], variantIndex });

          // ---- สเตจ 2: เลื้อยต่อบนแถบจำนวน ----
          const count = variant.amounts.length;
          const chipW = amountChipW(count);
          const amtSteps: Animated.CompositeAnimation[] = [];
          for (let a = 1; a <= amountIndex; a++) {
            amtSteps.push(
              Animated.timing(markerX, {
                toValue: a * (chipW + GAP),
                duration: AMT_MS,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              })
            );
          }
          const stage2 =
            amtSteps.length > 0 ? Animated.sequence(amtSteps) : Animated.delay(150);

          // เว้นจังหวะให้แถบจำนวน render ก่อน แล้วค่อยเลื้อยต่อ
          setTimeout(() => {
            stage2.start(() => {
              setLandedAmt(amountIndex);
              setRunning(false);
              onLand();
            });
          }, STAGE_GAP_MS);
        });
      },
    }));

    const stripAmounts = strip?.ex.variants[strip.variantIndex]?.amounts ?? [];
    const stripUnit = strip?.ex.variants[strip.variantIndex]?.unit ?? 'reps';
    const chipW = amountChipW(Math.max(stripAmounts.length, 1));

    return (
      <View style={styles.wrap}>
        {/* ===== กระดานช่อง ===== */}
        <View style={[styles.board, { width: boardW, height: grid.boardH }]}>
          {pool.map((ex, k) => (
            <View
              key={ex.id}
              style={[
                styles.tile,
                { width: grid.tileW, height: grid.tileH, ...tilePos(k) },
                landedTile === k && { backgroundColor: accent, borderColor: colors.ink },
              ]}
            >
              <Text style={styles.tileEmoji}>{ex.emoji}</Text>
              <Text
                style={[styles.tileName, landedTile === k && styles.tileNameWin]}
                numberOfLines={1}
              >
                {ex.name}
              </Text>
            </View>
          ))}

          {/* หัวงู */}
          <Animated.View
            style={[
              styles.head,
              {
                backgroundColor: accent,
                transform: [{ translateX: headX }, { translateY: headY }],
              },
            ]}
          >
            <Text style={styles.headEmoji}>🐍</Text>
          </Animated.View>
        </View>

        {/* ===== แถบจำนวน (สเตจ 2) ===== */}
        {strip && (
          <View style={styles.strip}>
            <Text style={styles.stripLabel}>เลื้อยหาจำนวน...</Text>
            <View style={styles.chipRow}>
              {stripAmounts.map((amt, i) => (
                <View
                  key={i}
                  style={[
                    styles.chip,
                    { width: chipW },
                    landedAmt === i && { backgroundColor: accent },
                  ]}
                >
                  <Text style={[styles.chipText, landedAmt === i && styles.chipTextWin]}>
                    {amt}
                  </Text>
                  <Text style={[styles.chipUnit, landedAmt === i && styles.chipTextWin]}>
                    {UNIT_LABEL[stripUnit]}
                  </Text>
                </View>
              ))}
              {/* หัวงูเลื้อยบนแถบ */}
              <Animated.View
                style={[
                  styles.marker,
                  { width: chipW, transform: [{ translateX: markerX }] },
                ]}
                pointerEvents="none"
              >
                <Text style={styles.headEmoji}>🐍</Text>
              </Animated.View>
            </View>
          </View>
        )}

        {running && <View style={styles.lock} pointerEvents="auto" />}
      </View>
    );
  }
);

SnakeBoard.displayName = 'SnakeBoard';

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', alignItems: 'center', gap: 12 },
  board: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 18,
    overflow: 'hidden',
  },
  tile: {
    position: 'absolute',
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.muted,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 2,
  },
  tileEmoji: { fontSize: 22 },
  tileName: {
    fontFamily: fonts.medium,
    fontSize: 10.5,
    color: colors.ink,
    textAlign: 'center',
  },
  tileNameWin: { fontFamily: fonts.bold, color: colors.white },
  head: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HEAD,
    height: HEAD,
    borderRadius: HEAD / 2,
    borderWidth: 2.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  headEmoji: { fontSize: 16 },
  // ----- แถบจำนวน -----
  strip: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 6,
  },
  stripLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  chipRow: {
    flexDirection: 'row',
    gap: GAP,
    justifyContent: 'center',
    position: 'relative',
  },
  chip: {
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chipText: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.ink },
  chipUnit: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.muted },
  chipTextWin: { color: colors.white },
  marker: {
    position: 'absolute',
    top: -6,
    left: 0,
    alignItems: 'center',
  },
  lock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
