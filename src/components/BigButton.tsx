/**
 * 🔘 BigButton — ปุ่มใหญ่สไตล์การ์ตูนเส้นหนา
 * เวลากดจะ "ยุบลง" (เลื่อนตามเงา) ให้ความรู้สึกเหมือนกดปุ่มจริง
 */
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

interface Props {
  label: string;
  onPress: () => void;
  /** สีพื้นปุ่ม (ค่าเริ่มต้น ชมพูบานเย็น) */
  color?: string;
  /** สีตัวอักษร (ค่าเริ่มต้น ขาว) */
  textColor?: string;
  /** ไอคอนวางหน้าตัวอักษร (เช่น กระบอกเซียมซี) */
  icon?: ReactNode;
  disabled?: boolean;
}

const OFFSET = 6; // ระยะเงา/ระยะยุบ

export function BigButton({
  label,
  onPress,
  color = colors.pink,
  textColor = colors.white,
  icon,
  disabled = false,
}: Props) {
  const pressed = useSharedValue(0); // 0 = ปกติ, 1 = กำลังกด

  const faceStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: pressed.value * OFFSET },
      { translateY: pressed.value * OFFSET },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => (pressed.value = withTiming(1, { duration: 60 }))}
      onPressOut={() => (pressed.value = withTiming(0, { duration: 90 }))}
      style={styles.wrap}
    >
      {/* เงาทึบด้านหลัง (อยู่กับที่) */}
      <View style={[styles.shadow, { opacity: disabled ? 0.4 : 1 }]} />
      {/* หน้าปุ่ม (ขยับตอนกด) */}
      <Animated.View
        style={[
          styles.face,
          { backgroundColor: color, opacity: disabled ? 0.5 : 1 },
          faceStyle,
        ]}
      >
        <View style={styles.inner}>
          {icon}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 64,
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    left: OFFSET,
    top: OFFSET,
    right: -OFFSET + OFFSET,
    bottom: -OFFSET + OFFSET,
    width: '100%',
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.ink,
  },
  face: {
    height: 60,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
  },
});
