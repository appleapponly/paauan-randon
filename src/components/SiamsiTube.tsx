/**
 * 🎋 SiamsiTube — รูปกระบอกเซียมซีสีแดง (วาดด้วย View ล้วน ปรับขนาดตาม size)
 * ใช้เป็นไอคอนในหน้าหลัก, ในปุ่มเขย่า, และตัวกระบอกบนหน้าจอ (หมุนเขย่าได้)
 */
import { View } from 'react-native';
import { colors } from '@/theme/colors';

export function SiamsiTube({ size = 48 }: { size?: number }) {
  const tubeW = size * 0.64;
  const tubeH = size * 0.82;
  const bw = Math.max(2, size * 0.05);
  const stickW = Math.max(3, size * 0.09);
  const stickH = size * 0.62;
  const stickBorder = Math.max(1, size * 0.02);

  const Stick = ({ rot, mt = 0 }: { rot: string; mt?: number }) => (
    <View
      style={{
        width: stickW,
        height: stickH,
        marginTop: mt,
        borderRadius: stickW,
        borderWidth: stickBorder,
        borderColor: colors.ink,
        backgroundColor: colors.cream,
        overflow: 'hidden',
        transform: [{ rotate: rot }],
      }}
    >
      {/* ปลายแดง (เหมือนหัวเลขเซียมซี) */}
      <View style={{ height: stickH * 0.3, backgroundColor: colors.siam }} />
    </View>
  );

  return (
    <View
      style={{
        width: size,
        height: size * 1.16,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* แท่งเซียมซีโผล่ออกจากปากกระบอก (อยู่หลังตัวกระบอก) */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: size * 0.015,
        }}
      >
        <Stick rot="-15deg" mt={size * 0.06} />
        <Stick rot="-2deg" />
        <Stick rot="13deg" mt={size * 0.05} />
      </View>

      {/* ตัวกระบอกสีแดง + คาดทอง */}
      <View
        style={{
          width: tubeW,
          height: tubeH,
          backgroundColor: colors.siam,
          borderColor: colors.ink,
          borderWidth: bw,
          borderRadius: size * 0.14,
          overflow: 'hidden',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            width: '100%',
            height: size * 0.16,
            marginBottom: tubeH * 0.22,
            backgroundColor: colors.gold,
            borderColor: colors.ink,
            borderTopWidth: bw * 0.7,
            borderBottomWidth: bw * 0.7,
          }}
        />
      </View>
    </View>
  );
}
