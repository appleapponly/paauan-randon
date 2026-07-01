/**
 * ⏳ Pomodoro Timer เต็มจอ — นับถอยหลัง + ป้าให้กำลังใจ
 * รับพารามิเตอร์: minutes, label (ภารกิจ), mode ('work'|'break'), session
 * - จอไม่ดับระหว่างจับเวลา (useKeepAwake)
 * - หมดเวลา: สั่น (Haptics) + ป้าฉลอง + ปุ่มไปต่อ (work→พัก / break→เรียนต่อ)
 * - ไหล manual: จบแล้วผู้ใช้กดเริ่มรอบถัดไปเอง
 */
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import { useStudyStore } from '@/store/useStudyStore';
import {
  studyEncourageLines,
  timerDoneWorkLines,
  timerDoneBreakLines,
} from '@/data/studyTasks';
import { pickOne } from '@/utils/random';
import { paaUanPoses } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

const one = (v: string | string[] | undefined, fallback = '') =>
  (Array.isArray(v) ? v[0] : v) ?? fallback;

function mmss(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TimerScreen() {
  useKeepAwake(); // กันจอดับระหว่างจับเวลา
  const router = useRouter();
  const params = useLocalSearchParams();

  const minutes = Math.max(1, parseInt(one(params.minutes, '25'), 10) || 25);
  const label = one(params.label, 'โฟกัส');
  const mode = one(params.mode, 'work') as 'work' | 'break';
  const session = parseInt(one(params.session, '1'), 10) || 1;

  const breakMin = useStudyStore((s) => s.breakMin);

  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [cheer, setCheer] = useState(() =>
    mode === 'work' ? pickOne(studyEncourageLines) : 'พักผ่อนให้เต็มที่นะลูก เดี๋ยวกลับมาลุยต่อ'
  );

  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const cheerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // นับถอยหลัง
  useEffect(() => {
    if (paused || done) return;
    tick.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (tick.current) clearInterval(tick.current);
          setDone(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [paused, done]);

  // หมุนเวียนคำให้กำลังใจระหว่างทำงาน
  useEffect(() => {
    if (done) return;
    cheerTimer.current = setInterval(() => {
      setCheer(
        mode === 'work'
          ? pickOne(studyEncourageLines)
          : 'พักสมองไป เดี๋ยวกลับมาจำได้ดีขึ้นเยอะเลย'
      );
    }, 12000);
    return () => {
      if (cheerTimer.current) clearInterval(cheerTimer.current);
    };
  }, [done, mode]);

  const bg = mode === 'work' ? colors.ocean : colors.jade;

  function startBreak() {
    router.replace({
      pathname: '/timer',
      params: {
        minutes: String(breakMin),
        label: 'พักผ่อน',
        mode: 'break',
        session: String(session),
      },
    });
  }

  const doneMsg =
    mode === 'work' ? pickOne(timerDoneWorkLines) : pickOne(timerDoneBreakLines);
  const doneMsgRef = useRef(doneMsg);

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* หัวเรื่อง + เซสชัน */}
        <View style={styles.header}>
          <Text style={styles.mode}>{mode === 'work' ? '🍅 โฟกัส' : '☕ พักผ่อน'}</Text>
          {mode === 'work' && <Text style={styles.session}>เซสชันที่ {session}</Text>}
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        </View>

        {/* เวลานับถอยหลัง */}
        <View style={styles.center}>
          {!done ? (
            <Text style={styles.clock}>{mmss(secondsLeft)}</Text>
          ) : (
            <Text style={styles.doneEmoji}>{mode === 'work' ? '🎉' : '💪'}</Text>
          )}
          <Image
            source={done ? paaUanPoses.happy : paaUanPoses.fortune}
            style={styles.paa}
            resizeMode="contain"
          />
          <View style={styles.bubble}>
            <Text style={styles.cheer}>{done ? doneMsgRef.current : cheer}</Text>
          </View>
        </View>

        {/* ปุ่มควบคุม */}
        <View style={styles.controls}>
          {!done ? (
            <>
              <Pressable style={styles.ctrlBtn} onPress={() => setPaused((p) => !p)}>
                <Text style={styles.ctrlText}>{paused ? '▶️ ไปต่อ' : '⏸️ หยุดชั่วคราว'}</Text>
              </Pressable>
              <Pressable
                style={[styles.ctrlBtn, styles.ctrlGhost]}
                onPress={() => router.back()}
              >
                <Text style={styles.ctrlText}>เลิก</Text>
              </Pressable>
            </>
          ) : mode === 'work' ? (
            <>
              <Pressable style={styles.ctrlBtn} onPress={startBreak}>
                <Text style={styles.ctrlText}>☕ เริ่มพัก {breakMin} นาที</Text>
              </Pressable>
              <Pressable
                style={[styles.ctrlBtn, styles.ctrlGhost]}
                onPress={() => router.back()}
              >
                <Text style={styles.ctrlText}>เสร็จแล้ว กลับหน้าเรียน</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.ctrlBtn} onPress={() => router.back()}>
              <Text style={styles.ctrlText}>🍅 กลับไปเรียนต่อ</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, padding: 24, justifyContent: 'space-between' },
  header: { alignItems: 'center', gap: 4 },
  mode: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.white },
  session: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.white,
    opacity: 0.9,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 26,
  },
  center: { alignItems: 'center', gap: 14 },
  clock: {
    fontFamily: fonts.bold,
    fontSize: 84,
    color: colors.white,
    letterSpacing: 2,
  },
  doneEmoji: { fontSize: 84 },
  paa: { width: 150, height: 170 },
  bubble: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    maxWidth: 320,
  },
  cheer: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 28,
  },
  controls: { gap: 12 },
  ctrlBtn: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: colors.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  ctrlGhost: { backgroundColor: colors.cream },
  ctrlText: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.ink },
});
