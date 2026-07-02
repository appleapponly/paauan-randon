/**
 * 🧩 RubikBoard — รูบิค 2x2 บนหน้า Home
 *
 * แต่ละช่อง = เครื่องสุ่ม 1 อัน · ปัดแถวแนวนอน / คอลัมน์แนวตั้ง เพื่อ "บิด" เปลี่ยนหน้า
 * (ลากตามนิ้วลื่น ๆ แล้ว snap เหมือนรูบิคจริง) · แตะช่องเพื่อเข้าหน้าสุ่มนั้น
 *
 * ต่างจากรูบิคจริง: ช่องที่หมุนเข้ามาใหม่จะ "ข้าม" อันที่โชว์อยู่แล้ว
 * → ไม่มีหน้าซ้ำ และผู้ใช้จัดหน้าไหนมาอยู่ด้วยกันก็ได้ทุกแบบ
 *
 * ตำแหน่งช่อง: [0]=บนซ้าย [1]=บนขวา [2]=ล่างซ้าย [3]=ล่างขวา (persist ใน useRubikStore)
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/data/categories';
import { useRubikStore } from '@/store/useRubikStore';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import { textOn } from '@/theme/styles';

interface Tile {
  id: string;
  title: string;
  emoji: string;
  route: string;
  color: string;
}

// เครื่องสุ่มทั้งหมด (พร้อมสีหมวด) — คลังหน้าให้รูบิคหมุนวน
const ALL: Tile[] = CATEGORIES.flatMap((c) =>
  c.items.filter((i) => i.ready).map((i) => ({
    id: i.id,
    title: i.title,
    emoji: i.emoji,
    route: i.route,
    color: c.color,
  }))
);

type Active = { axis: 'row' | 'col'; index: 0 | 1 } | null;

const SWIPE_START = 8; // ระยะขยับก่อนเริ่มนับเป็นการบิด (กันชนกับการแตะ)
const COMMIT_RATIO = 0.3; // ลากเกิน 30% ของช่อง = บิดสำเร็จ

export function RubikBoard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const board = Math.min(width - 36, 300);
  const tile = board / 2;

  const facesIds = useRubikStore((s) => s.faces);
  const setFaces = useRubikStore((s) => s.setFaces);

  // กันข้อมูลเก่าเสีย (id หาย/ซ้ำ) → เติมให้ครบ 4 ช่องเสมอ
  const faces = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const id of facesIds) {
      if (ALL.some((a) => a.id === id) && !seen.has(id)) {
        seen.add(id);
        out.push(id);
      }
    }
    for (const a of ALL) {
      if (out.length >= 4) break;
      if (!seen.has(a.id)) {
        seen.add(a.id);
        out.push(a.id);
      }
    }
    return out.slice(0, 4);
  }, [facesIds]);

  const item = (id: string): Tile => ALL.find((a) => a.id === id) ?? ALL[0];

  const drag = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState<Active>(null);

  // refs ให้ PanResponder (สร้างครั้งเดียว) อ่านค่าล่าสุดได้เสมอ
  const facesRef = useRef(faces);
  const tileRef = useRef(tile);
  const activeRef = useRef<Active>(null);
  const boardXY = useRef({ x: 0, y: 0 });
  const boardRef = useRef<View>(null);
  useEffect(() => {
    facesRef.current = faces;
    tileRef.current = tile;
  }, [faces, tile]);

  // หา "หน้าถัดไป/ก่อนหน้า" แบบข้ามหน้าที่โชว์อยู่ → ไม่ซ้ำ และจัดคู่ไหนก็ได้
  function nextOf(id: string): Tile {
    const i = ALL.findIndex((a) => a.id === id);
    for (let k = 1; k <= ALL.length; k++) {
      const c = ALL[(i + k) % ALL.length];
      if (!facesRef.current.includes(c.id)) return c;
    }
    return ALL[(i + 1) % ALL.length];
  }
  function prevOf(id: string): Tile {
    const i = ALL.findIndex((a) => a.id === id);
    for (let k = 1; k <= ALL.length; k++) {
      const c = ALL[(i - k + ALL.length * 2) % ALL.length];
      if (!facesRef.current.includes(c.id)) return c;
    }
    return ALL[(i - 1 + ALL.length) % ALL.length];
  }

  // บิดสำเร็จ → คำนวณหน้าชุดใหม่
  function commit(a: NonNullable<Active>, dir: 1 | -1) {
    const f = [...facesRef.current];
    if (a.axis === 'row') {
      const i0 = a.index * 2;
      const [x, y] = [f[i0], f[i0 + 1]];
      if (dir > 0) {
        // ลากไปขวา → หน้าใหม่เข้าซ้าย
        f[i0] = prevOf(x).id;
        f[i0 + 1] = x;
      } else {
        // ลากไปซ้าย → หน้าใหม่เข้าขวา
        f[i0] = y;
        f[i0 + 1] = nextOf(y).id;
      }
    } else {
      const [t, b] = [f[a.index], f[a.index + 2]];
      if (dir > 0) {
        // ลากลง → หน้าใหม่เข้าบน
        f[a.index] = prevOf(t).id;
        f[a.index + 2] = t;
      } else {
        // ลากขึ้น → หน้าใหม่เข้าล่าง
        f[a.index] = b;
        f[a.index + 2] = nextOf(b).id;
      }
    }
    setFaces(f);
  }

  const clampDrag = (v: number) => {
    const s = tileRef.current;
    return Math.max(-s, Math.min(s, v));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      // ขยับเกิน threshold ค่อยยึด gesture (แตะเฉย ๆ ยังกดเข้าหน้าสุ่มได้)
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        Math.abs(g.dx) > SWIPE_START || Math.abs(g.dy) > SWIPE_START,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (_e, g) => {
        const s = tileRef.current;
        const axis: 'row' | 'col' = Math.abs(g.dx) >= Math.abs(g.dy) ? 'row' : 'col';
        const index: 0 | 1 =
          axis === 'row'
            ? g.y0 - boardXY.current.y > s
              ? 1
              : 0
            : g.x0 - boardXY.current.x > s
              ? 1
              : 0;
        const a: Active = { axis, index };
        activeRef.current = a;
        setActive(a);
        drag.setValue(0);
      },
      onPanResponderMove: (_e, g) => {
        const a = activeRef.current;
        if (!a) return;
        drag.setValue(clampDrag(a.axis === 'row' ? g.dx : g.dy));
      },
      onPanResponderRelease: (_e, g) => {
        const a = activeRef.current;
        if (!a) return;
        const s = tileRef.current;
        const v = clampDrag(a.axis === 'row' ? g.dx : g.dy);
        if (Math.abs(v) > s * COMMIT_RATIO) {
          const dir: 1 | -1 = v > 0 ? 1 : -1;
          // ไหลต่อให้สุดช่อง แล้วค่อยสลับหน้า (ภาพต่อเนื่องไม่กระโดด)
          Animated.timing(drag, {
            toValue: dir * s,
            duration: 110,
            useNativeDriver: true,
          }).start(() => {
            commit(a, dir);
            drag.setValue(0);
            activeRef.current = null;
            setActive(null);
          });
        } else {
          Animated.spring(drag, {
            toValue: 0,
            useNativeDriver: true,
            speed: 30,
            bounciness: 6,
          }).start(() => {
            activeRef.current = null;
            setActive(null);
          });
        }
      },
      onPanResponderTerminate: () => {
        drag.setValue(0);
        activeRef.current = null;
        setActive(null);
      },
    })
  ).current;

  function renderTile(t: Tile, left: number, top: number, key?: string) {
    return (
      <Pressable
        key={key ?? t.id}
        style={[styles.cell, { width: tile, height: tile, left, top }]}
        onPress={() => router.push(t.route as never)}
        disabled={active !== null}
      >
        <View style={[styles.cellInner, { backgroundColor: t.color }]}>
          <Text style={styles.cellEmoji}>{t.emoji}</Text>
          <Text style={[styles.cellTitle, { color: textOn(t.color) }]} numberOfLines={2}>
            {t.title}
          </Text>
        </View>
      </Pressable>
    );
  }

  // ช่องที่อยู่ในแถว/คอลัมน์ที่กำลังบิด → วาดในแถบเลื่อนแทน
  const inActive = (idx: number) => {
    if (!active) return false;
    const row = idx >> 1;
    const col = idx & 1;
    return active.axis === 'row' ? row === active.index : col === active.index;
  };

  return (
    <View
      ref={boardRef}
      style={[styles.board, { width: board, height: board }]}
      onLayout={() => {
        // เก็บพิกัดกระดานบนจอ ไว้คำนวณว่านิ้วเริ่มลากที่แถว/คอลัมน์ไหน
        boardRef.current?.measureInWindow((x, y) => {
          boardXY.current = { x, y };
        });
      }}
      {...pan.panHandlers}
    >
      {/* ช่องนิ่ง (นอกแถวที่กำลังบิด) */}
      {faces.map((id, idx) =>
        inActive(idx)
          ? null
          : renderTile(item(id), (idx & 1) * tile, (idx >> 1) * tile, `s-${idx}`)
      )}

      {/* แถบที่กำลังบิด — มีหน้าเพื่อนบ้านโผล่เข้ามาจากขอบ */}
      {active?.axis === 'row' && (
        <Animated.View
          style={[
            styles.strip,
            { top: active.index * tile, width: board, height: tile },
            { transform: [{ translateX: drag }] },
          ]}
          pointerEvents="none"
        >
          {(() => {
            const a = item(faces[active.index * 2]);
            const b = item(faces[active.index * 2 + 1]);
            return [
              renderTile(prevOf(a.id), -tile, 0, 'rp'),
              renderTile(a, 0, 0, 'ra'),
              renderTile(b, tile, 0, 'rb'),
              renderTile(nextOf(b.id), tile * 2, 0, 'rn'),
            ];
          })()}
        </Animated.View>
      )}
      {active?.axis === 'col' && (
        <Animated.View
          style={[
            styles.strip,
            { left: active.index * tile, width: tile, height: board },
            { transform: [{ translateY: drag }] },
          ]}
          pointerEvents="none"
        >
          {(() => {
            const t = item(faces[active.index]);
            const b = item(faces[active.index + 2]);
            return [
              renderTile(prevOf(t.id), 0, -tile, 'cp'),
              renderTile(t, 0, 0, 'ct'),
              renderTile(b, 0, tile, 'cb'),
              renderTile(nextOf(b.id), 0, tile * 2, 'cn'),
            ];
          })()}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
    backgroundColor: colors.ink,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 18,
    overflow: 'hidden',
  },
  strip: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  cell: {
    position: 'absolute',
    padding: 3,
  },
  cellInner: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 6,
  },
  cellEmoji: { fontSize: 34 },
  cellTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
