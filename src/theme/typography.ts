/**
 * ชื่อฟอนต์ Mali ที่โหลดใน app/_layout.tsx
 * ใช้ key พวกนี้กับ style { fontFamily: fonts.bold } เพื่อกันพิมพ์ชื่อผิด
 */
export const fonts = {
  regular: 'Mali_400Regular',
  medium: 'Mali_500Medium',
  semibold: 'Mali_600SemiBold',
  bold: 'Mali_700Bold',
} as const;

/** ขนาดตัวอักษรมาตรฐาน ใช้ให้ทั้งแอปสม่ำเสมอ */
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 34,
} as const;
