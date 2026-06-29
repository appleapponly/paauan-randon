/**
 * ⭐ useProStore — สถานะ "เป็นสมาชิก Pro หรือยัง" (ปิดโฆษณา)
 *
 * เก็บลง AsyncStorage เพื่อให้ UI รู้ผลทันทีตอนเปิดแอป (ไม่ต้องรอ Play ตอบ)
 * แล้ว ProProvider จะ "ตรวจซ้ำ" กับ Play ตอนเปิดแอปทุกครั้ง (fail-open)
 *
 * fail-open = ถ้าเช็คไม่ได้ (เน็ตล่ม / error) ให้คงสถานะเดิมไว้ ไม่ปิดสิทธิ์คนที่จ่ายจริง
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProState {
  isPro: boolean;
  setPro: (v: boolean) => void;
}

export const useProStore = create<ProState>()(
  persist(
    (set) => ({
      isPro: false,
      setPro: (v) => set({ isPro: v }),
    }),
    {
      name: 'paauan-pro',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/** อ่านค่า isPro นอก React (เช่นใน module โฆษณา) */
export const getIsPro = () => useProStore.getState().isPro;
