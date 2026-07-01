/**
 * 🗄️ useCleanFoodStore — เมนูคลีนในวงล้อ (เพิ่ม/ลบ/บันทึกลงเครื่อง)
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CLEAN_MENU } from '@/data/cleanFood';

interface CleanFoodState {
  menu: string[];
  addItem: (name: string) => void;
  removeItem: (name: string) => void;
}

export const useCleanFoodStore = create<CleanFoodState>()(
  persist(
    (set, get) => ({
      menu: DEFAULT_CLEAN_MENU,
      addItem: (name) => {
        const trimmed = name.trim();
        if (!trimmed || get().menu.includes(trimmed)) return;
        set({ menu: [...get().menu, trimmed] });
      },
      removeItem: (name) => set({ menu: get().menu.filter((m) => m !== name) }),
    }),
    {
      name: 'paauan-clean-food',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
