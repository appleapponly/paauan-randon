/**
 * 🗄️ useStudyStore — ภารกิจการเรียนที่เลือก + ตั้งค่าเวลา Pomodoro + ตัวนับเซสชัน
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyTask, DEFAULT_STUDY_IDS } from '@/data/studyTasks';

interface StudyState {
  selectedIds: string[];
  custom: StudyTask[];
  workMin: number;
  breakMin: number;
  sessionCount: number;
  toggle: (id: string) => void;
  addCustom: (text: string) => void;
  removeCustom: (id: string) => void;
  setWorkMin: (m: number) => void;
  setBreakMin: (m: number) => void;
  incSession: () => void;
  resetSession: () => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      selectedIds: DEFAULT_STUDY_IDS,
      custom: [],
      workMin: 25, // Pomodoro มาตรฐาน
      breakMin: 5,
      sessionCount: 0,

      toggle: (id) => {
        const cur = get().selectedIds;
        set({ selectedIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
      },
      addCustom: (text) => {
        const t = text.trim();
        if (!t) return;
        const id = 'custom-' + Date.now();
        set({
          custom: [...get().custom, { id, text: t, emoji: '⭐', phase: 2 }],
          selectedIds: [...get().selectedIds, id],
        });
      },
      removeCustom: (id) => {
        set({
          custom: get().custom.filter((c) => c.id !== id),
          selectedIds: get().selectedIds.filter((x) => x !== id),
        });
      },
      setWorkMin: (m) => set({ workMin: clamp(Math.round(m), 5, 90) }),
      setBreakMin: (m) => set({ breakMin: clamp(Math.round(m), 3, 30) }),
      incSession: () => set({ sessionCount: get().sessionCount + 1 }),
      resetSession: () => set({ sessionCount: 0 }),
    }),
    {
      name: 'paauan-study',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
