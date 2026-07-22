/**
 * ⏳ Pomodoro Timer เต็มจอ — นับถอยหลัง + ป้าให้กำลังใจ
 * รับพารามิเตอร์: minutes, label (ภารกิจ), mode ('work'|'break'), session
 *   queue (JSON [{label,minutes}]) + qi = คิวภารกิจต่อเนื่อง (สุ่มการเรียนส่งมา)
 * - จอไม่ดับระหว่างจับเวลา (useKeepAwake)
 * - หมดเวลา: สั่น (Haptics) + ป้าฉลอง + ปุ่มไปต่อ (ภารกิจถัดไปในคิว / เริ่มพัก / กลับ)
 * - ไหล manual: จบแล้วผู้ใช้กดเริ่มรอบถัดไปเอง
 */
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
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
import { t } from '@/i18n';

const one = (v: string | string[] | undefined, fallback = '') =>
  (Array.isArray(v) ? v[0] : v) ?? fallback;

function mmss(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface QItem {
  label: string;
  minutes: number;
}

export default function TimerScreen() {
  useKeepAwake();
  const router = useRouter();
  const params = useLocalSearchParams();

  const mode = one(params.mode, 'work') as 'work' | 'break';
  const session = parseInt(one(params.session, '1'), 10) || 1;

  // คิวภารกิจ (ถ้ามี) — จับเวลาทีละรายการ
  const queue: QItem[] = (() => {
    try {
      const q = one(params.queue, '');
      return q ? (JSON.parse(q) as QItem[]) : [];
    } catch {
      return [];
    }
  })();
  const qi = parseInt(one(params.qi, '0'), 10) || 0;
  const hasQueue = queue.length > 0;

  const minutes = Math.max(
    1,
    hasQueue ? queue[qi]?.minutes ?? 25 : parseInt(one(params.minutes, '25'), 10) || 25
  );
  const label = hasQueue ? queue[qi]?.label ?? t('โฟกัส', 'Focus') : one(params.label, t('โฟกัส', 'Focus'));

  const breakMin = useStudyStore((s) => s.breakMin);

  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [cheer, setCheer] = useState(() =>
    mode === 'work'
      ? pickOne(studyEncourageLines)
      : t('พักผ่อนให้เต็มที่นะลูก เดี๋ยวกลับมาลุยต่อ', 'Rest up, sweetie — come back ready to go')
  );

  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const cheerTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneMsgRef = useRef(
    mode === 'work' ? pickOne(timerDoneWorkLines) : pickOne(timerDoneBreakLines)
  );

  // หยุดสั่นเมื่อออกจากหน้าจับเวลา
  useEffect(() => () => Vibration.cancel(), []);

  useEffect(() => {
    if (paused || done) return;
    tick.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (tick.current) clearInterval(tick.current);
          setDone(true);
          // สั่นยาว ๆ ให้รู้ตัวชัด (RN Vibration pattern ~3 วิ) + haptic feedback
          Vibration.vibrate([0, 600, 300, 600, 300, 700, 300, 800]);
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

  useEffect(() => {
    if (done) return;
    cheerTimer.current = setInterval(() => {
      setCheer(
        mode === 'work'
          ? pickOne(studyEncourageLines)
          : t('พักสมองไป เดี๋ยวกลับมาจำได้ดีขึ้นเยอะเลย', "Rest that brain — you'll remember so much better after")
      );
    }, 12000);
    return () => {
      if (cheerTimer.current) clearInterval(cheerTimer.current);
    };
  }, [done, mode]);

  const bg = mode === 'work' ? colors.ocean : colors.jade;
  const hasNext = hasQueue && qi + 1 < queue.length;

  function goNext() {
    router.replace({
      pathname: '/timer',
      params: {
        mode: 'work',
        session: String(session + 1),
        queue: JSON.stringify(queue),
        qi: String(qi + 1),
      },
    });
  }

  function startBreak() {
    router.replace({
      pathname: '/timer',
      params: {
        minutes: String(breakMin),
        label: t('พักผ่อน', 'Rest'),
        mode: 'break',
        session: String(session),
      },
    });
  }

  const workPose = done ? paaUanPoses.happy : paaUanPoses.studyWrite;
  const breakPose = paaUanPoses.meditate;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.mode}>{mode === 'work' ? t('🍅 โฟกัส', '🍅 Focus') : t('☕ พักผ่อน', '☕ Break')}</Text>
          {mode === 'work' && (
            <Text style={styles.session}>
              {t('เซสชันที่ ', 'Session ')}{session}
              {hasQueue ? t(` · ภารกิจ ${qi + 1}/${queue.length}`, ` · task ${qi + 1}/${queue.length}`) : ''}
            </Text>
          )}
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        </View>

        <View style={styles.center}>
          {!done ? (
            <Text style={styles.clock}>{mmss(secondsLeft)}</Text>
          ) : (
            <Text style={styles.doneEmoji}>{mode === 'work' ? '🎉' : '💪'}</Text>
          )}
          <Image
            source={mode === 'work' ? workPose : breakPose}
            style={styles.paa}
            resizeMode="contain"
          />
          <View style={styles.bubble}>
            <Text style={styles.cheer}>{done ? doneMsgRef.current : cheer}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          {!done ? (
            <>
              <Pressable style={styles.ctrlBtn} onPress={() => setPaused((p) => !p)}>
                <Text style={styles.ctrlText}>{paused ? t('▶️ ไปต่อ', '▶️ Resume') : t('⏸️ หยุดชั่วคราว', '⏸️ Pause')}</Text>
              </Pressable>
              <Pressable style={[styles.ctrlBtn, styles.ctrlGhost]} onPress={() => router.back()}>
                <Text style={styles.ctrlText}>{t('เลิก', 'Quit')}</Text>
              </Pressable>
            </>
          ) : mode === 'work' ? (
            <>
              {hasNext ? (
                <Pressable style={styles.ctrlBtn} onPress={goNext}>
                  <Text style={styles.ctrlText} numberOfLines={1}>
                    {t('➡️ ภารกิจถัดไป: ', '➡️ Next: ')}{queue[qi + 1].label}
                  </Text>
                </Pressable>
              ) : (
                <Pressable style={styles.ctrlBtn} onPress={startBreak}>
                  <Text style={styles.ctrlText}>{t(`☕ เริ่มพัก ${breakMin} นาที`, `☕ Break ${breakMin} min`)}</Text>
                </Pressable>
              )}
              <Pressable style={[styles.ctrlBtn, styles.ctrlGhost]} onPress={() => router.back()}>
                <Text style={styles.ctrlText}>{t('เสร็จแล้ว กลับหน้าเรียน', 'Done — back to study')}</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.ctrlBtn} onPress={() => router.back()}>
              <Text style={styles.ctrlText}>{t('🍅 กลับไปเรียนต่อ', '🍅 Back to studying')}</Text>
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
    textAlign: 'center',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 32, // เผื่อสระ+วรรณยุกต์ซ้อนไม่ถูกตัดหัวบน Android
  },
  center: { alignItems: 'center', gap: 14 },
  clock: { fontFamily: fonts.bold, fontSize: 84, color: colors.white, letterSpacing: 2 },
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
    lineHeight: 32, // เผื่อสระ+วรรณยุกต์ซ้อนไม่ถูกตัดหัวบน Android
  },
  controls: { gap: 12 },
  ctrlBtn: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 12,
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
