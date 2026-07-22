/**
 * 📚 สุ่มการเรียน — บันไดวิบวับสุ่ม 2 ภารกิจไม่ซ้ำ (เรียง รับข้อมูล→ฝึก→สรุป)
 * ตั้งเวลา Pomodoro ได้ทีละภารกิจ → กดเริ่มโฟกัส เข้าจับเวลาทีละรายการต่อเนื่อง
 */
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import { useRouter } from 'expo-router';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useStudyStore } from '@/store/useStudyStore';
import { PRESET_STUDY_TASKS, studyMissionLines, StudyTask } from '@/data/studyTasks';
import { spinningLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne, randomInt } from '@/utils/random';
import { LadderBoard, LadderHandle } from '@/components/LadderBoard';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import { t } from '@/i18n';

interface Mission {
  task: StudyTask;
  amount?: number;
  unit?: string;
  text: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toMission(task: StudyTask): Mission {
  if (task.quantity) {
    const amount = pickOne(task.quantity.amounts);
    return { task, amount, unit: task.quantity.unit, text: `${task.text} ${amount} ${task.quantity.unit}` };
  }
  return { task, text: task.text };
}

export default function StudyScreen() {
  const router = useRouter();
  const selectedIds = useStudyStore((s) => s.selectedIds);
  const custom = useStudyStore((s) => s.custom);
  const toggle = useStudyStore((s) => s.toggle);
  const addCustom = useStudyStore((s) => s.addCustom);
  const removeCustom = useStudyStore((s) => s.removeCustom);
  const workMin = useStudyStore((s) => s.workMin);
  const incSession = useStudyStore((s) => s.incSession);

  const ladderRef = useRef<LadderHandle>(null);
  const cardRef = useRef<View>(null);
  const pending = useRef<Mission[]>([]);
  const [bubble, setBubble] = useState(t('กดสุ่ม เดี๋ยวบันไดวิบวับเลือกภารกิจให้ 2 อย่าง!', 'Tap and the ladder will pick 2 study missions for you!'));
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [running, setRunning] = useState(false);
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [newItem, setNewItem] = useState('');

  const all = useMemo(() => [...PRESET_STUDY_TASKS, ...custom], [custom]);
  const pool = useMemo(() => all.filter((t) => selectedIds.includes(t.id)), [all, selectedIds]);

  function roll() {
    if (pool.length < 2 || running) return;
    setMissions(null);
    setRunning(true);
    const line = pickLine(spinningLines);
    setBubble(line.text);
    setMood(line.mood);

    // เลือก 2 ภารกิจไม่ซ้ำ
    const winners = shuffle(pool).slice(0, 2);
    // ช่องบันได = ภารกิจที่เลือกไว้ "ทั้งหมด" (สลับลำดับ) — โชว์ครบทุกอัน
    const display = shuffle([...pool]);
    const opts = display.map((t) => t.text);
    const targets = winners.map((w) => display.findIndex((d) => d.id === w.id));

    // ภารกิจเรียงลำดับ รับข้อมูล(1) → ฝึก(2) → สรุป(3)
    const ordered = [...winners].sort((a, b) => a.phase - b.phase);
    pending.current = ordered.map(toMission);

    setOptions(opts);
    // รอ options ผูกเข้า LadderBoard แล้วค่อยวิ่ง
    setTimeout(() => ladderRef.current?.run(targets), 60);
  }

  function onLand() {
    const ms = pending.current;
    if (ms.length === 0) return;
    const line = pickLine(studyMissionLines, ms.map((m) => m.text).join(' + '));
    setBubble(line.text);
    setMood(line.mood);
    setMissions(ms);
    setTimes(ms.map(() => workMin));
    setRound((r) => r + 1);
    setRunning(false);
  }

  function setTime(i: number, delta: number) {
    setTimes((prev) => prev.map((v, idx) => (idx === i ? Math.max(5, Math.min(90, v + delta)) : v)));
  }

  function startFocus() {
    if (!missions) return;
    const next = useStudyStore.getState().sessionCount + 1;
    incSession();
    const queue = missions.map((m, i) => ({ label: m.text, minutes: times[i] ?? workMin }));
    router.push({
      pathname: '/timer',
      params: {
        minutes: String(queue[0].minutes),
        label: queue[0].label,
        mode: 'work',
        session: String(next),
        queue: JSON.stringify(queue),
        qi: '0',
      },
    });
  }

  function handleAdd() {
    addCustom(newItem);
    setNewItem('');
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PaaUanBubble text={bubble} mood={mood} pose="studyRead" />

        {pool.length < 2 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{t('เลือกภารกิจอย่างน้อย 2 อย่างก่อนนะจ๊ะ', 'Pick at least 2 missions first.')}</Text>
          </View>
        ) : (
          options.length > 0 && (
            <LadderBoard ref={ladderRef} options={options} accent={colors.ocean} onLand={onLand} />
          )
        )}

        <BigButton
          label={running ? t('บันไดกำลังไล่... 🪜', 'Tracing the ladder... 🪜') : missions ? t('สุ่มใหม่', 'Again') : t('สุ่มภารกิจ!', 'Pick missions!')}
          color={colors.ocean}
          onPress={roll}
          disabled={running || pool.length < 2}
        />

        {missions && !running && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              pose="studyWrite"
              watermark={t('ตั้งใจเรียนกับป้าอ้วน 📚', "Study · Auntie's Random 📚")}
            >
              <Text style={styles.missionBadge}>{t('ภารกิจการเรียน', 'Study missions')} ({missions.length})</Text>
              <View style={styles.missionList}>
                {missions.map((m, i) => (
                  <View key={i} style={styles.missionRow}>
                    <Text style={styles.missionEmoji}>{m.task.emoji}</Text>
                    <Text style={styles.missionName}>
                      {i + 1}. {m.text}
                    </Text>
                  </View>
                ))}
              </View>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
        )}

        {missions && !running && <ShareButton targetRef={cardRef} />}

        {/* ตั้งเวลาแต่ละภารกิจ + เริ่มโฟกัส */}
        {missions && !running && (
          <View style={styles.timeBox}>
            <Text style={styles.manageTitle}>{t('ตั้งเวลาแต่ละภารกิจ 🍅', 'Set time per mission 🍅')}</Text>
            {missions.map((m, i) => (
              <View key={i} style={styles.timeRow}>
                <Text style={styles.timeLabel} numberOfLines={1}>
                  {i + 1}. {m.task.text}
                </Text>
                <View style={styles.stepper}>
                  <Pressable style={styles.stepBtn} onPress={() => setTime(i, -5)}>
                    <Text style={styles.stepText}>−</Text>
                  </Pressable>
                  <Text style={styles.timeValue}>{times[i] ?? workMin} {t('น.', 'min')}</Text>
                  <Pressable style={styles.stepBtn} onPress={() => setTime(i, 5)}>
                    <Text style={styles.stepText}>＋</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            <BigButton label={t('เริ่มโฟกัส 🍅', 'Start focus 🍅')} color={colors.ocean} onPress={startFocus} countAd={false} />
          </View>
        )}

        {/* เลือกภารกิจ */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>{t('เลือกภารกิจการเรียน', 'Choose study missions')} ({pool.length})</Text>
          <Text style={styles.hint}>{t('แตะเพื่อเปิด/ปิด (สุ่มออกมา 2 อย่างต่อครั้ง)', 'Tap to toggle (2 are picked each round)')}</Text>
          <View style={styles.chips}>
            {all.map((task) => {
              const on = selectedIds.includes(task.id);
              const isCustom = task.id.startsWith('custom-');
              return (
                <Pressable
                  key={task.id}
                  onPress={() => toggle(task.id)}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {task.emoji} {task.text}
                  </Text>
                  {isCustom && (
                    <Pressable onPress={() => removeCustom(task.id)} hitSlop={8}>
                      <Text style={styles.chipDelete}>{t('ลบ', 'Del')}</Text>
                    </Pressable>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder={t('เพิ่มภารกิจของตัวเอง...', 'Add your own mission...')}
              placeholderTextColor={colors.muted}
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
            <Pressable style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>{t('เพิ่ม', 'Add')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18 },
  emptyBox: { ...cartoonBox(colors.white, 4), padding: 20 },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 28,
  },
  missionBadge: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.ocean,
    textAlign: 'center',
  },
  missionList: { alignSelf: 'stretch', gap: 10, marginTop: 4 },
  missionRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  missionEmoji: { fontSize: 30 },
  missionName: { flex: 1, fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.ink, lineHeight: 30 },
  timeBox: { ...cartoonBox(colors.white, 4), padding: 16, gap: 12 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  timeLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: fontSize.sm, color: colors.ink },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: colors.ink,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 26,
    color: colors.ink,
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  timeValue: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.ocean,
    minWidth: 58,
    textAlign: 'center',
  },
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
