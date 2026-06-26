/**
 * 🗄️ กล่องเก็บ "รายชื่อคน" (Zustand store) ใช้ร่วมกันทุกเครื่องสุ่มที่ต้องใส่ชื่อ
 * (ใครโดน / จับฉลาก / แบ่งทีม / สุ่มคิว) — ใส่ชื่อเพื่อนกลุ่มเดียว ใช้ซ้ำได้ทุกเกม
 * เซฟลง AsyncStorage อัตโนมัติด้วย middleware persist
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NamesState {
  names: string[];
  addName: (name: string) => void;
  removeName: (name: string) => void;
  clearAll: () => void;
}

export const useNamesStore = create<NamesState>()(
  persist(
    (set, get) => ({
      names: [],

      addName: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        if (get().names.includes(trimmed)) return; // กันชื่อซ้ำ
        set({ names: [...get().names, trimmed] });
      },

      removeName: (name) => {
        set({ names: get().names.filter((n) => n !== name) });
      },

      clearAll: () => set({ names: [] }),
    }),
    {
      name: 'paauan-names',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
