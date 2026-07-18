/**
 * 🎰 GachaMachine — ตู้กาชาปองการ์ตูน (View + reanimated ล้วน ไม่ใช้ SVG)
 * โครง: โดมแก้วมีลูกบอลสี ๆ → ตัวตู้แดง + ป้ายชื่อ → ลูกบิด + ช่องลูกบอลออก
 * Task 8 = โครงนิ่ง (idle) · Task 9 = state machine + animation + ปฏิสัมพันธ์
 */
import { forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

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

/** ตำแหน่งลูกบอลในโดม (จัดมือให้ดูสุมกันธรรมชาติ) */
const DOME_BALLS: { x: number; y: number; c: number }[] = [
  { x: 24, y: 58, c: 0 }, { x: 66, y: 66, c: 1 }, { x: 108, y: 56, c: 2 },
  { x: 150, y: 64, c: 3 }, { x: 44, y: 26, c: 4 }, { x: 88, y: 20, c: 0 },
  { x: 130, y: 28, c: 1 }, { x: 178, y: 40, c: 2 },
];

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
  ({ onCrank, onBallOpened: _onBallOpened }, ref) => {
    useImperativeHandle(ref, () => ({
      crank: () => {
        // Task 9: เริ่ม animation จริง — เวอร์ชันโครงนิ่งยังไม่ทำอะไร
      },
    }));

    return (
      <View style={styles.wrap}>
        {/* โดมแก้ว */}
        <View style={styles.dome}>
          {DOME_BALLS.map((b, i) => (
            <View key={i} style={{ position: 'absolute', left: b.x, top: b.y }}>
              <GachaBall size={40} color={GACHA_BALL_COLORS[b.c]} />
            </View>
          ))}
        </View>

        {/* ตัวตู้ */}
        <View style={styles.cabinet}>
          <View style={styles.nameplate}>
            <Text style={styles.nameplateText}>{t('กาชาป้าอ้วน', "Auntie's Gacha")}</Text>
          </View>

          <View style={styles.row}>
            {/* ลูกบิด — กดได้เหมือนปุ่มสุ่ม */}
            <Pressable onPress={onCrank} style={styles.dial}>
              <View style={styles.dialSlot} />
            </Pressable>

            {/* ช่องลูกบอลออก */}
            <View style={styles.outlet} />
          </View>
        </View>
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
});
