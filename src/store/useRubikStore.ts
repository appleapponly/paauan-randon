/**
 * 🧩 useRubikStore — หน้ารูบิค 2x2 บนหน้า Home
 * เก็บว่าตอนนี้ 4 ช่อง (TL, TR, BL, BR) เป็นเครื่องสุ่มอะไร
 * persist ลงเครื่อง → ปิดแอปเปิดใหม่ หน้าที่บิดไว้ยังอยู่เหมือนเดิม
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RubikState {
  /** id เครื่องสุ่ม 4 ช่อง เรียง [บนซ้าย, บนขวา, ล่างซ้าย, ล่างขวา] */
  faces: string[];
  setFaces: (faces: string[]) => void;
}

// ค่าเริ่มต้น: คละหมวดยอดนิยม
const DEFAULT_FACES = ['food', 'lucky', 'exercise', 'studytask'];

export const useRubikStore = create<RubikState>()(
  persist(
    (set) => ({
      faces: DEFAULT_FACES,
      setFaces: (faces) => set({ faces }),
    }),
    {
      name: 'paauan-rubik',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
