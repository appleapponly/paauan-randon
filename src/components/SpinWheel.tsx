/**
 * 🎡 SpinWheel — วงล้อหมุนวาดด้วย SVG
 * - แบ่งวงเป็นชิ้น (slice) ตามจำนวนเมนู ระบายสีสลับกัน
 * - parent สั่งหมุนผ่าน ref: wheelRef.current?.spin()
 * - หมุนหลายรอบแล้วหยุดที่ชิ้นที่สุ่มได้ "ตรงหัวลูกศรด้านซ้าย (270°)" พอดี
 *   เสร็จแล้วเรียก onResult(ชื่อเมนู, ตำแหน่ง)
 *
 * หมายเหตุ: ใช้ Animated ของ React Native (ไม่ใช่ reanimated) เพราะ withTiming ของ
 * reanimated v4 ไม่ขยับจริงบนเว็บ ทำให้วงล้อไม่หมุน — RN Animated ทำงานทั้งเว็บและมือถือ
 */
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import { pickIndex } from '@/utils/random';

export interface SpinWheelHandle {
  spin: () => void;
}

interface Props {
  items: string[];
  size?: number;
  onStart?: () => void;
  onResult: (item: string, index: number) => void;
}

// สีไล่สำหรับแต่ละชิ้นวงล้อ (วนซ้ำ)
const SLICE_COLORS = [
  colors.pink,
  colors.gold,
  colors.jade,
  colors.blue,
  colors.purple,
];

/** แปลงมุม (องศา, 0=บนสุด ไล่ตามเข็ม) เป็นพิกัด x,y บนวงกลม */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** สร้างเส้น path รูปชิ้นพาย จากมุม start ถึง end */
function slicePath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
}

const SPIN_DURATION = 3500; // มิลลิวินาที
const POINTER_DEG = 270; // ตำแหน่งหัวลูกศร: 0=บน, 90=ขวา, 180=ล่าง, 270=ซ้าย

export const SpinWheel = forwardRef<SpinWheelHandle, Props>(
  ({ items, size = 300, onStart, onResult }, ref) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const rotRef = useRef(0); // องศาที่วงล้อหยุดอยู่ตอนนี้ (ไว้เริ่มหมุนครั้งถัดไปต่อเนื่อง)
    const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const r = size / 2;
    const sliceAngle = items.length > 0 ? 360 / items.length : 360;

    // แปลงค่าองศา (เพิ่มขึ้นเรื่อย ๆ) เป็นสตริง deg ให้ transform
    const spin = rotation.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    // เคลียร์ timer ถ้า component ถูกถอดออกระหว่างหมุน
    useEffect(() => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    }, []);

    // เปิดให้ parent สั่ง spin() ได้
    useImperativeHandle(ref, () => ({
      spin: () => {
        if (items.length === 0) return;
        if (settleTimer.current) clearTimeout(settleTimer.current);
        onStart?.();

        const index = pickIndex(items);
        // มุมที่ต้องหมุนเพื่อให้ "กลางชิ้นที่เลือก" มาอยู่ตรงหัวลูกศร (ด้านซ้าย 270°)
        const sliceCenter = index * sliceAngle + sliceAngle / 2;
        const angleToPointer = ((POINTER_DEG - sliceCenter) % 360 + 360) % 360;

        // เริ่มจากตำแหน่งปัจจุบัน (ตัดเศษรอบทิ้งให้ภาพไม่กระโดด)
        const startAngle = ((rotRef.current % 360) + 360) % 360;
        rotation.setValue(startAngle);
        const delta = ((angleToPointer - startAngle) % 360 + 360) % 360;
        const target = startAngle + 360 * 5 + delta; // หมุน 5 รอบ + ไปจุดที่ต้องการ
        rotRef.current = target;

        Animated.timing(rotation, {
          toValue: target,
          duration: SPIN_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();

        // ส่งผลด้วย JS timer ให้ตรงกับตอนวงล้อหยุดพอดี (เชื่อถือได้ทุกแพลตฟอร์ม)
        settleTimer.current = setTimeout(() => {
          settleTimer.current = null;
          onResult(items[index], index);
        }, SPIN_DURATION + 60);
      },
    }));

    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        {/* ลูกศรชี้จากด้านซ้ายเข้าหาวงล้อ */}
        <View style={[styles.pointer, { top: r - 16 }]} />

        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Svg width={size} height={size}>
            <G>
              {items.map((item, i) => {
                const start = i * sliceAngle;
                const end = start + sliceAngle;
                const mid = start + sliceAngle / 2;
                // วางจุดเริ่มข้อความ "ชิดขอบวงล้อ" แล้วไล่ตัวอักษรเข้าหาศูนย์กลาง (textAnchor=start)
                // → ชื่อยาว ๆ มีที่ยาวขึ้นเยอะ ไม่ถูกตัด เว้นแต่ยาวจริง ๆ
                // มุมหมุน = mid + 90 → ชิ้นซ้าย (ตรงหัวลูกศร) ตั้งตรงอ่านได้ ชิ้นขวากลับหัว
                const labelPos = polar(r, r, r * 0.9, mid);
                const labelRot = mid + 90;
                const fill = SLICE_COLORS[i % SLICE_COLORS.length];
                // ตัดคำเฉพาะตอนยาวมากจริง ๆ (ผลเต็ม ๆ ยังโชว์บนการ์ดใหญ่อยู่ดี)
                const label = item.length > 16 ? item.slice(0, 15) + '…' : item;
                const fontSize = items.length > 18 ? 11 : items.length > 12 ? 12.5 : 14;
                return (
                  <G key={`${item}-${i}`}>
                    <Path
                      d={slicePath(r, r, r - 4, start, end)}
                      fill={fill}
                      stroke={colors.ink}
                      strokeWidth={2}
                    />
                    {/* ตัวอักษรเอียงตามมุมชิ้น — วาด 2 ชั้น: ขอบดำหนาด้านหลัง + ตัวขาวทับ
                        ใช้ตัวขาวเพราะอ่านชัดบนทุกสีช่อง และไม่เกิด "ขีดขาว" ใต้ตัวอักษรอย่าง ท */}
                    <SvgText
                      x={labelPos.x}
                      y={labelPos.y}
                      stroke={colors.ink}
                      strokeWidth={3}
                      strokeLinejoin="round"
                      fill={colors.ink}
                      fontSize={fontSize}
                      fontFamily={fonts.bold}
                      textAnchor="start"
                      alignmentBaseline="middle"
                      transform={`rotate(${labelRot}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {label}
                    </SvgText>
                    <SvgText
                      x={labelPos.x}
                      y={labelPos.y}
                      fill={colors.white}
                      fontSize={fontSize}
                      fontFamily={fonts.bold}
                      textAnchor="start"
                      alignmentBaseline="middle"
                      transform={`rotate(${labelRot}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {label}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>

        {/* ปุ่มกลางวงล้อ (แค่ตกแต่ง) */}
        <View style={styles.hub} />
      </View>
    );
  }
);

SpinWheel.displayName = 'SpinWheel';

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  pointer: {
    // สามเหลี่ยมชี้ไปทางขวา (เข้าหาวงล้อ) วางชิดขอบซ้าย กึ่งกลางแนวตั้ง
    position: 'absolute',
    left: -8,
    zIndex: 10,
    width: 0,
    height: 0,
    borderTopWidth: 16,
    borderBottomWidth: 16,
    borderLeftWidth: 30,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.pink,
  },
  hub: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.cream,
    borderWidth: 3,
    borderColor: colors.ink,
  },
});
