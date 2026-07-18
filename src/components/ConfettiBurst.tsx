/**
 * 🎊 ConfettiBurst — เศษกระดาษสีธีมพุ่งฉลองผลลัพธ์ แล้วจางหายเอง (~900ms)
 * วิธีใช้: วางเป็นลูกของ View ที่ครอบการ์ดผล (ต้องไม่ใช่ position:static) + key={round}
 * mount แล้วสั่น success() ให้เอง — บน web คืน null (reanimated withTiming ไม่ขยับบนเว็บ)
 */
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { success } from '@/utils/haptics';

const PIECE_COLORS = [colors.pink, colors.gold, colors.jade, colors.blue, colors.purple];
const PIECES = 14;

function Piece({ index }: { index: number }) {
  const p = useSharedValue(0);
  // สุ่มทิศ/ระยะ/หมุน ครั้งเดียวต่อชิ้น (useRef กันสุ่มใหม่ทุก render)
  const cfg = useRef({
    angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2, // พัดขึ้นด้านบน
    dist: 90 + Math.random() * 70,
    spin: (Math.random() - 0.5) * 720,
    delay: Math.random() * 120,
    color: PIECE_COLORS[index % PIECE_COLORS.length],
    w: 8 + Math.random() * 6,
  }).current;

  useEffect(() => {
    p.value = withDelay(
      cfg.delay,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) })
    );
  }, [cfg, p]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - p.value,
    transform: [
      { translateX: Math.cos(cfg.angle) * cfg.dist * p.value },
      // แรงโน้มถ่วงเบา ๆ ให้โค้งตกธรรมชาติ
      { translateY: Math.sin(cfg.angle) * cfg.dist * p.value + 60 * p.value * p.value },
      { rotate: `${cfg.spin * p.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: '50%',
          top: '35%',
          width: cfg.w,
          height: cfg.w * 0.6,
          borderRadius: 2,
          backgroundColor: cfg.color,
        },
        style,
      ]}
    />
  );
}

export function ConfettiBurst() {
  useEffect(() => {
    success();
  }, []);

  if (Platform.OS === 'web') return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: PIECES }, (_, i) => (
        <Piece key={i} index={i} />
      ))}
    </View>
  );
}
