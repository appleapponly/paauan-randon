/**
 * 🗄️ กล่องเก็บข้อมูลเมนูอาหาร (Zustand store)
 * - เก็บรายการเมนูของผู้ใช้ + ฟังก์ชันเพิ่ม/ลบ/รีเซ็ต
 * - middleware "persist" จะเซฟลง AsyncStorage ให้อัตโนมัติทุกครั้งที่ข้อมูลเปลี่ยน
 *   เปิดแอปใหม่ก็โหลดกลับมาเอง ไม่ต้องเขียนโค้ดเซฟเอง
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_FOOD_MENU } from '@/data/foodMenu';

interface FoodState {
  menu: string[];
  addItem: (name: string) => void;
  removeItem: (name: string) => void;
  resetToDefault: () => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      menu: DEFAULT_FOOD_MENU,

      addItem: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        // กันเมนูซ้ำ
        if (get().menu.includes(trimmed)) return;
        set({ menu: [...get().menu, trimmed] });
      },

      removeItem: (name) => {
        set({ menu: get().menu.filter((m) => m !== name) });
      },

      resetToDefault: () => set({ menu: DEFAULT_FOOD_MENU }),
    }),
    {
      name: 'paauan-food-menu', // ชื่อ key ใน AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // ขึ้นเวอร์ชันเมื่อปรับชุดเมนูตั้งต้น → เครื่องเก่าจะรีเซ็ตเป็นชุดใหม่ (ตอนนี้ 20 เมนู)
      version: 3,
      migrate: () => ({ menu: DEFAULT_FOOD_MENU }),
    }
  )
);
