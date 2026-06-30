/**
 * 🎡 useCustomWheelStore — "วงล้อของฉัน" (ฟีเจอร์ Pro)
 * เก็บ "คำที่จะมาสุ่ม" + "สีของวงล้อ" ที่ผู้ใช้เลือกเอง ลง AsyncStorage
 * - items: รายการคำ (อย่างน้อย 2 ถึงจะหมุนได้)
 * - colors: สีของชิ้นวงล้อ (เลือกจาก WHEEL_PALETTE, อย่างน้อย 2 สี)
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';

// จานสีให้ผู้ใช้เลือกประกอบวงล้อ (แตะเปิด/ปิดทีละสี)
export const WHEEL_PALETTE: string[] = [
  colors.pink,
  colors.gold,
  colors.jade,
  colors.blue,
  colors.purple,
  colors.wine,
  colors.siam,
];

const DEFAULT_ITEMS = ['ทำเลย', 'ไว้ก่อน', 'ขอคิดดู'];
const DEFAULT_COLORS = [colors.pink, colors.gold, colors.jade, colors.blue, colors.purple];

interface CustomWheelState {
  items: string[];
  colors: string[];
  addItem: (name: string) => void;
  removeItem: (name: string) => void;
  toggleColor: (color: string) => void;
  reset: () => void;
}

export const useCustomWheelStore = create<CustomWheelState>()(
  persist(
    (set, get) => ({
      items: DEFAULT_ITEMS,
      colors: DEFAULT_COLORS,

      addItem: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        if (get().items.includes(trimmed)) return;
        set({ items: [...get().items, trimmed] });
      },

      removeItem: (name) => {
        set({ items: get().items.filter((m) => m !== name) });
      },

      // แตะสีเพื่อเปิด/ปิด — กันเหลือน้อยกว่า 2 สี (วงล้อต้องมีสีสลับ)
      toggleColor: (color) => {
        const cur = get().colors;
        if (cur.includes(color)) {
          if (cur.length <= 2) return; // ห้ามต่ำกว่า 2 สี
          set({ colors: cur.filter((c) => c !== color) });
        } else {
          // คงลำดับตาม WHEEL_PALETTE เพื่อให้สีเรียงสวยเสมอ
          set({ colors: WHEEL_PALETTE.filter((c) => cur.includes(c) || c === color) });
        }
      },

      reset: () => set({ items: DEFAULT_ITEMS, colors: DEFAULT_COLORS }),
    }),
    {
      name: 'paauan-custom-wheel',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
