/**
 * 🐍 SnakeBoard — กระดาน "งูตกช่อง" สุ่มออกกำลังกาย
 *
 * หัวงูวิ่งวนหลายรอบแบบขึ้น-ลง (ping-pong) ~5 วินาที ค่อย ๆ ช้าลง เพื่อให้ลุ้น
 * แล้วหยุดลงช่องเป้าหมายทีละช่อง (สุ่มได้ 3 ท่าไม่ซ้ำกัน) ไฮไลต์ช่องที่ได้ + เลขลำดับ
 * เสร็จแล้วเรียก onLand() ให้หน้าจอเด้งการ์ดภารกิจ
 *
 * ใช้ RN Animated (useNativeDriver, translateX/Y) แบบเดียวกับ PinballDraw
 * เรียกผ่าน ref: snakeRef.current?.roll([i0, i1, i2])
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
import { Exercise } from '@/data/exercises';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export interface SnakeHandle {
  /** targets = ลำดับช่อง (index ใน pool) ที่ต้องการให้งูไปหยุด (ไม่ซ้ำกัน) */
  roll: (targets: number[]) => void;
}

interface Props {
  pool: Exercise[];
  accent: string;
  onLand: () => void;
}

const HEAD = 32;
const PAD = 10;
const GAP = 8;
const LOOP_MS = 4200; // ช่วงวิ่งวนลุ้น (ช้าลงเรื่อย ๆ)
const LAND_MS = 520; // เวลาลงต่อ 1 ช่องเป้าหมาย

export const SnakeBoard = forwardRef<SnakeHandle, Props>(
  ({ pool, accent, onLand }, ref) => {
    const { width } = useWindowDimensions();
    const boardW = Math.min(width - 40, 360);

    const t = useRef(new Animated.Value(0)).current; // ตำแหน่งตามลำดับช่องที่วิ่ง
    const [running, setRunning] = useState(false);
    const [landed, setLanded] = useState<number[]>([]); // index ช่องที่หยุด (ตามลำดับ 1-2-3)

    const n = Math.max(pool.length, 1);

    // ===== วางผังช่องแบบงูตกช่อง (serpentine ล่างขึ้นบน) =====
    const grid = useMemo(() => {
      const cols = Math.min(4, n);
      const rows = Math.ceil(n / cols);
      const tileW = (boardW - 2 * PAD - (cols - 1) * GAP) / cols;
      const tileH = Math.max(56, tileW * 0.9);
      const boardH = 2 * PAD + rows * tileH + (rows - 1) * GAP;
      const centers: { x: number; y: number }[] = [];
      for (let k = 0; k < n; k++) {
        const r = Math.floor(k / cols);
        const rowFromTop = rows - 1 - r;
        const inRow = k % cols;
        const col = r % 2 === 0 ? inRow : cols - 1 - inRow;
        const x = PAD + col * (tileW + GAP) + tileW / 2;
        const y = PAD + rowFromTop * (tileH + GAP) + tileH / 2;
        centers.push({ x, y });
      }
      return { cols, rows, tileW, tileH, boardH, centers };
    }, [boardW, n]);

    const tilePos = (k: number) => ({
      left: grid.centers[k].x - grid.tileW / 2,
      top: grid.centers[k].y - grid.tileH / 2,
    });

    // ลำดับช่องที่ "หัวงูวิ่งผ่าน" ระหว่างลุ้น (ping-pong ขึ้น-ลง) + ต่อท้ายด้วยช่องเป้าหมาย
    // เก็บไว้ใน state เพื่อสร้าง interpolation ให้หัวงูเลื่อนตาม (เริ่มต้น 2 จุด กัน interpolate error)
    const [seq, setSeq] = useState<number[]>([0, 1]);

    // แปลง t (0..seq.length-1) → พิกัดหัวงู
    const headX = t.interpolate({
      inputRange: seq.map((_, i) => i),
      outputRange: seq.map((i) => grid.centers[i].x - HEAD / 2),
    });
    const headY = t.interpolate({
      inputRange: seq.map((_, i) => i),
      outputRange: seq.map((i) => grid.centers[i].y - HEAD / 2),
    });

    useImperativeHandle(ref, () => ({
      roll(targets: number[]) {
        const tg = targets.filter((x) => x >= 0 && x < n);
        if (tg.length === 0) return;

        // ---- สร้างลำดับวิ่งวน (ping-pong) ----
        const L = Math.max(2 * n, 14); // จำนวนช่องที่วิ่งผ่านตอนลุ้น (ยิ่งมาก = ผ่านหลายช่อง)
        const walk: number[] = [];
        let i = 0;
        let dir = 1;
        for (let s = 0; s <= L; s++) {
          walk.push(i);
          if (n > 1) {
            if (i + dir > n - 1 || i + dir < 0) dir *= -1;
            i += dir;
          }
        }
        const full = [...walk, ...tg]; // ต่อท้ายด้วยช่องเป้าหมายทีละช่อง
        setSeq(full);
        setLanded([]);
        setRunning(true);
        t.setValue(0);

        // ให้ interpolation (ที่อิง seq ใหม่) ผูกก่อน แล้วค่อยเริ่มวิ่ง
        setTimeout(() => {
          // ช่วงลุ้น: วิ่งจาก 0 → L ช้าลงเรื่อย ๆ
          Animated.timing(t, {
            toValue: L,
            duration: LOOP_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(() => {
            // ลงช่องเป้าหมายทีละช่อง
            const landStep = (k: number) => {
              if (k >= tg.length) {
                setRunning(false);
                onLand();
                return;
              }
              Animated.timing(t, {
                toValue: L + 1 + k,
                duration: LAND_MS,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }).start(() => {
                setLanded((prev) => [...prev, tg[k]]);
                setTimeout(() => landStep(k + 1), 280);
              });
            };
            landStep(0);
          });
        }, 40);
      },
    }));

    return (
      <View style={styles.wrap}>
        <View style={[styles.board, { width: boardW, height: grid.boardH }]}>
          {pool.map((ex, k) => {
            const order = landed.indexOf(k); // -1 = ยังไม่ลง
            const isWin = order >= 0;
            return (
              <View
                key={ex.id}
                style={[
                  styles.tile,
                  { width: grid.tileW, height: grid.tileH, ...tilePos(k) },
                  isWin && { backgroundColor: accent, borderColor: colors.ink },
                ]}
              >
                <Text style={styles.tileEmoji}>{ex.emoji}</Text>
                <Text style={[styles.tileName, isWin && styles.tileNameWin]} numberOfLines={1}>
                  {ex.name}
                </Text>
                {isWin && (
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderText}>{order + 1}</Text>
                  </View>
                )}
              </View>
            );
          })}

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

        {running && <View style={styles.lock} pointerEvents="auto" />}
      </View>
    );
  }
);

SnakeBoard.displayName = 'SnakeBoard';

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', alignItems: 'center' },
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
  orderBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
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
  lock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
