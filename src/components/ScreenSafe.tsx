/**
 * 🛡️ ScreenSafe — SafeAreaView ขอบล่าง แบบฉลาด
 * Pro (ไม่มีโฆษณา) → กันขอบล่างเอง (กันปุ่ม/เนื้อหาโดน home indicator)
 * ไม่ใช่ Pro (มีแบนเนอร์โฆษณาคั่นอยู่ล่างสุดอยู่แล้ว) → ไม่ต้องกันซ้ำ
 *   ไม่งั้นจะเกิดแถบสีครีมค้างระหว่างเนื้อหากับโฆษณา
 */
import { ReactNode } from 'react';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useProStore } from '@/store/useProStore';

export function ScreenSafe({ style, children }: { style?: object; children: ReactNode }) {
  const isPro = useProStore((s) => s.isPro);
  const edges: Edge[] = isPro ? ['bottom'] : [];
  return (
    <SafeAreaView style={style} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
