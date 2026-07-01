/**
 * 🗄️ useExerciseStore — ท่าที่เลือกไว้ในกระดานสุ่มออกกำลังกาย + ท่าที่ผู้ใช้เพิ่มเอง
 * เก็บลง AsyncStorage อัตโนมัติ
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, DEFAULT_SELECTED_IDS } from '@/data/exercises';

interface ExerciseState {
  selectedIds: string[];
  custom: Exercise[];
  toggle: (id: string) => void;
  addCustom: (name: string) => void;
  removeCustom: (id: string) => void;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      selectedIds: DEFAULT_SELECTED_IDS,
      custom: [],

      // แตะเปิด/ปิดท่าในกระดาน
      toggle: (id) => {
        const cur = get().selectedIds;
        set({
          selectedIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
        });
      },

      // เพิ่มท่าเอง — ตั้งค่าเริ่มต้นเป็น strength นับ "ครั้ง"
      addCustom: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const id = 'custom-' + Date.now();
        const ex: Exercise = {
          id,
          name: trimmed,
          emoji: '⭐',
          mode: 'strength',
          variants: [{ unit: 'reps', amounts: [10, 15, 20, 25, 30] }],
        };
        set({ custom: [...get().custom, ex], selectedIds: [...get().selectedIds, id] });
      },

      removeCustom: (id) => {
        set({
          custom: get().custom.filter((e) => e.id !== id),
          selectedIds: get().selectedIds.filter((x) => x !== id),
        });
      },
    }),
    {
      name: 'paauan-exercise',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
