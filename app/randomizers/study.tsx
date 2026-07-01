/**
 * 📚 สุ่มการเรียน — สุ่มภารกิจ + ตั้งเวลา Pomodoro → เริ่มจับเวลาเต็มจอ
 */
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useStudyStore } from '@/store/useStudyStore';
import { PRESET_STUDY_TASKS, studyMissionLines, StudyTask } from '@/data/studyTasks';
import { pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne, randomInt } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

interface Mission {
  task: StudyTask;
  amount?: number;
  unit?: string;
  text: string;
}

export default function StudyScreen() {
  const router = useRouter();
  const selectedIds = useStudyStore((s) => s.selectedIds);
  const custom = useStudyStore((s) => s.custom);
  const toggle = useStudyStore((s) => s.toggle);
  const addCustom = useStudyStore((s) => s.addCustom);
  const removeCustom = useStudyStore((s) => s.removeCustom);
  const workMin = useStudyStore((s) => s.workMin);
  const breakMin = useStudyStore((s) => s.breakMin);
  const setWorkMin = useStudyStore((s) => s.setWorkMin);
  const setBreakMin = useStudyStore((s) => s.setBreakMin);
  const incSession = useStudyStore((s) => s.incSession);

  const cardRef = useRef<View>(null);
  const [bubble, setBubble] = useState('กดสุ่มภารกิจ เดี๋ยวป้าจัดให้ แล้วเริ่มโฟกัสกันเลย!');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [mission, setMission] = useState<Mission | null>(null);
  const [round, setRound] = useState(0);
  const [newItem, setNewItem] = useState('');

  const all = useMemo(() => [...PRESET_STUDY_TASKS, ...custom], [custom]);
  const pool = useMemo(
    () => all.filter((t) => selectedIds.includes(t.id)),
    [all, selectedIds]
  );

  function roll() {
    if (pool.length < 1) return;
    const task = pickOne(pool);
    let amount: number | undefined;
    let unit: string | undefined;
    let text = task.text;
    if (task.quantity) {
      amount = pickOne(task.quantity.amounts);
      unit = task.quantity.unit;
      text = `${task.text} ${amount} ${unit}`;
    }
    const m: Mission = { task, amount, unit, text };
    const line = pickLine(studyMissionLines, text);
    setBubble(line.text);
    setMood(line.mood);
    setMission(m);
    setRound((r) => r + 1);
  }

  function startFocus() {
    if (!mission) return;
    const next = useStudyStore.getState().sessionCount + 1;
    incSession();
    router.push({
      pathname: '/timer',
      params: {
        minutes: String(workMin),
        label: mission.text,
        mode: 'work',
        session: String(next),
      },
    });
  }

  function handleAdd() {
    addCustom(newItem);
    setNewItem('');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PaaUanBubble text={bubble} mood={mood} pose="point" />

        {mission && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              pose="point"
              watermark="ตั้งใจเรียนกับป้าอ้วน 📚"
            >
              <Text style={styles.missionBadge}>ภารกิจการเรียน</Text>
              <Text style={styles.missionEmoji}>{mission.task.emoji}</Text>
              <Text style={styles.missionName}>{mission.task.text}</Text>
              {mission.amount != null && (
                <Text style={styles.missionAmount}>
                  {mission.amount} {mission.unit}
                </Text>
              )}
            </CaptureCard>
          </Animated.View>
        )}

        <BigButton
          label={mission ? 'สุ่มใหม่' : 'สุ่มภารกิจ!'}
          color={colors.ocean}
          onPress={roll}
          disabled={pool.length < 1}
        />

        {mission && <ShareButton targetRef={cardRef} />}

        {/* ตั้งเวลา Pomodoro */}
        {mission && (
          <View style={styles.timeBox}>
            <Text style={styles.manageTitle}>ตั้งเวลา 🍅</Text>

            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>ทำงาน</Text>
              <View style={styles.stepper}>
                <Pressable style={styles.stepBtn} onPress={() => setWorkMin(workMin - 5)}>
                  <Text style={styles.stepText}>−</Text>
                </Pressable>
                <Text style={styles.timeValue}>{workMin} นาที</Text>
                <Pressable style={styles.stepBtn} onPress={() => setWorkMin(workMin + 5)}>
                  <Text style={styles.stepText}>＋</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>พัก</Text>
              <View style={styles.stepper}>
                <Pressable style={styles.stepBtn} onPress={() => setBreakMin(breakMin - 1)}>
                  <Text style={styles.stepText}>−</Text>
                </Pressable>
                <Text style={styles.timeValue}>{breakMin} นาที</Text>
                <Pressable style={styles.stepBtn} onPress={() => setBreakMin(breakMin + 1)}>
                  <Text style={styles.stepText}>＋</Text>
                </Pressable>
              </View>
            </View>
            <Pressable
              style={styles.randomBreak}
              onPress={() => setBreakMin(randomInt(5, 15))}
            >
              <Text style={styles.randomBreakText}>🎲 สุ่มเวลาพัก (5-15 นาที)</Text>
            </Pressable>

            <BigButton label="เริ่มโฟกัส 🍅" color={colors.ocean} onPress={startFocus} countAd={false} />
          </View>
        )}

        {/* เลือกภารกิจ */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>เลือกภารกิจการเรียน ({pool.length})</Text>
          <Text style={styles.hint}>แตะเพื่อเปิด/ปิดภารกิจที่จะสุ่ม</Text>
          <View style={styles.chips}>
            {all.map((t) => {
              const on = selectedIds.includes(t.id);
              const isCustom = t.id.startsWith('custom-');
              return (
                <Pressable
                  key={t.id}
                  onPress={() => toggle(t.id)}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {t.emoji} {t.text}
                  </Text>
                  {isCustom && (
                    <Pressable onPress={() => removeCustom(t.id)} hitSlop={8}>
                      <Text style={styles.chipDelete}>ลบ</Text>
                    </Pressable>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="เพิ่มภารกิจของตัวเอง..."
              placeholderTextColor={colors.muted}
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
            <Pressable style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>เพิ่ม</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18 },
  missionBadge: { fontFamily: fonts.bold, fontSize: fontSize.sm, color: colors.ocean },
  missionEmoji: { fontSize: 48 },
  missionName: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    textAlign: 'center',
  },
  missionAmount: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.ocean,
    textAlign: 'center',
  },
  timeBox: { ...cartoonBox(colors.white, 4), padding: 16, gap: 14 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeLabel: { fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.ink },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: colors.ink,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink },
  timeValue: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.ocean,
    minWidth: 78,
    textAlign: 'center',
  },
  randomBreak: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  randomBreakText: { fontFamily: fonts.semibold, fontSize: fontSize.sm, color: colors.ink },
  manageBox: { ...cartoonBox(colors.white, 4), padding: 16, gap: 12 },
  manageTitle: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.ink },
  hint: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.muted, marginTop: -6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: colors.ocean },
  chipText: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.ink },
  chipTextOn: { color: colors.white, fontFamily: fonts.bold },
  chipDelete: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xs,
    color: colors.white,
    backgroundColor: colors.pink,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  addRow: { flexDirection: 'row', gap: 10, marginTop: 2 },
  input: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 48,
    textAlignVertical: 'center',
    includeFontPadding: true,
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    color: colors.ink,
    backgroundColor: colors.cream,
  },
  addBtn: {
    backgroundColor: colors.jade,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.white },
});
