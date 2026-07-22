/**
 * 🏃 สุ่มออกกำลังกาย — กระดานงูวิ่งวนลุ้น → สุ่ม 3 ท่าไม่ซ้ำ → การ์ดโปรแกรม (พร้อมวิธีทำ)
 * เลือกท่าเองได้ (จัดกลุ่มตามโหมด Cardio/Strength/HIIT + ⭐ ท่าของฉัน) + เพิ่มท่าเอง (นับเป็นนาที)
 */
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useExerciseStore } from '@/store/useExerciseStore';
import {
  PRESET_EXERCISES,
  MODE_ORDER,
  MODE_LABEL,
  UNIT_LABEL,
  Exercise,
  exerciseComboLines,
} from '@/data/exercises';
import { spinningLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { randomInt } from '@/utils/random';
import { SnakeBoard, SnakeHandle } from '@/components/SnakeBoard';
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
  ex: Exercise;
  amount: number;
  unit: string;
}

/** สุ่มหยิบ index ไม่ซ้ำ k ตัวจาก 0..len-1 */
function pickDistinct(len: number, k: number): number[] {
  const idx = Array.from({ length: len }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(k, len));
}

export default function ExerciseScreen() {
  const selectedIds = useExerciseStore((s) => s.selectedIds);
  const custom = useExerciseStore((s) => s.custom);
  const toggle = useExerciseStore((s) => s.toggle);
  const addCustom = useExerciseStore((s) => s.addCustom);
  const removeCustom = useExerciseStore((s) => s.removeCustom);

  const snakeRef = useRef<SnakeHandle>(null);
  const cardRef = useRef<View>(null);
  const pending = useRef<Mission[]>([]);
  const [running, setRunning] = useState(false);
  const [bubble, setBubble] = useState(t('เลือกท่าที่ชอบ แล้วกดปล่อยงูเลือกโปรแกรมให้เลยจ้ะ!', 'Pick your moves and release the snake to build your workout!'));
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [round, setRound] = useState(0);
  const [newItem, setNewItem] = useState('');

  const all = useMemo(() => [...PRESET_EXERCISES, ...custom], [custom]);
  const pool = useMemo(
    () => all.filter((e) => selectedIds.includes(e.id)),
    [all, selectedIds]
  );

  function handleRoll() {
    if (pool.length < 2 || running) return;
    setMissions(null);
    setRunning(true);
    const line = pickLine(spinningLines);
    setBubble(line.text);
    setMood(line.mood);

    // สุ่ม 3 ท่าไม่ซ้ำ (หรือเท่าที่มี) + จำนวนของแต่ละท่า
    const targets = pickDistinct(pool.length, 3);
    pending.current = targets.map((ti) => {
      const ex = pool[ti];
      const variant = ex.variants[randomInt(0, ex.variants.length - 1)];
      const amount = variant.amounts[randomInt(0, variant.amounts.length - 1)];
      return { ex, amount, unit: UNIT_LABEL[variant.unit] };
    });
    snakeRef.current?.roll(targets);
  }

  function onLand() {
    const ms = pending.current;
    if (ms.length === 0) return;
    const line = pickLine(exerciseComboLines);
    setBubble(line.text);
    setMood(line.mood);
    setMissions(ms);
    setRound((r) => r + 1);
    setRunning(false);
  }

  function handleAdd() {
    addCustom(newItem);
    setNewItem('');
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PaaUanBubble text={bubble} mood={mood} pose="coachPoint" />

        {pool.length < 2 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {t('เลือกท่าอย่างน้อย 2 ท่าก่อนนะจ๊ะ ป้าถึงจะปล่อยงูให้ได้', 'Pick at least 2 moves so Auntie can release the snake.')}
            </Text>
          </View>
        ) : (
          <SnakeBoard ref={snakeRef} pool={pool} accent={colors.orange} onLand={onLand} />
        )}

        <BigButton
          label={running ? t('งูกำลังเลื้อย... 🐍', 'Snake slithering... 🐍') : t('ปล่อยงูเลย! 🐍', 'Release the snake! 🐍')}
          color={colors.orange}
          onPress={handleRoll}
          disabled={running || pool.length < 2}
        />

        {missions && !running && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              pose="coach"
              watermark={t('โปรแกรมสุขภาพจากป้าอ้วน 💪', "Workout · Auntie's Random 💪")}
            >
              <Text style={styles.missionBadge}>{t('โปรแกรมวันนี้', "Today's workout")} ({missions.length} {t('ท่า', 'moves')})</Text>
              <View style={styles.missionList}>
                {missions.map((m, i) => (
                  <View key={i} style={styles.missionRow}>
                    <Text style={styles.missionEmoji}>{m.ex.emoji}</Text>
                    <View style={styles.missionInfo}>
                      <Text style={styles.missionName}>
                        {i + 1}. {m.ex.name}{' '}
                        <Text style={styles.missionAmount}>
                          {m.amount} {m.unit}
                        </Text>
                      </Text>
                      {m.ex.howto && <Text style={styles.missionHowto}>{t('ป้าบอก: ', 'How-to: ')}{m.ex.howto}</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
        )}

        {missions && !running && <ShareButton targetRef={cardRef} />}

        {/* เลือกท่า จัดกลุ่มตามโหมด */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>{t('เลือกท่าออกกำลังกาย', 'Choose your moves')} ({pool.length})</Text>
          <Text style={styles.hint}>{t('แตะเพื่อเปิด/ปิดท่าในกระดาน (สุ่มออกมา 3 ท่าต่อครั้ง)', 'Tap to toggle moves (3 are picked each round)')}</Text>

          {MODE_ORDER.map((mode) => {
            const items = all.filter((e) => e.mode === mode);
            if (items.length === 0) return null;
            return (
              <View key={mode} style={styles.modeGroup}>
                <Text style={styles.modeLabel}>{MODE_LABEL[mode]}</Text>
                <View style={styles.chips}>
                  {items.map((ex) => {
                    const on = selectedIds.includes(ex.id);
                    const isCustom = ex.mode === 'custom';
                    return (
                      <Pressable
                        key={ex.id}
                        onPress={() => toggle(ex.id)}
                        style={[styles.chip, on && styles.chipOn]}
                      >
                        <Text style={[styles.chipText, on && styles.chipTextOn]}>
                          {ex.emoji} {ex.name}
                        </Text>
                        {isCustom && (
                          <Pressable onPress={() => removeCustom(ex.id)} hitSlop={8}>
                            <Text style={styles.chipDelete}>{t('ลบ', 'Del')}</Text>
                          </Pressable>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}

          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder={t('เพิ่มท่าของตัวเอง (นับเป็นนาที)...', 'Add your own move (counted in minutes)...')}
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
    color: colors.orange,
    textAlign: 'center',
  },
  missionList: { alignSelf: 'stretch', gap: 12, marginTop: 4 },
  missionRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  missionEmoji: { fontSize: 32 },
  missionInfo: { flex: 1, gap: 2, paddingTop: 2 },
  missionName: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.ink,
    lineHeight: 34, // เผื่อสระ+วรรณยุกต์ซ้อนไม่ถูกตัดหัวบน Android
    includeFontPadding: true,
  },
  missionAmount: { color: colors.orange },
  missionHowto: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.muted,
    lineHeight: 20,
  },
  manageBox: { ...cartoonBox(colors.white, 4), padding: 16, gap: 12 },
  manageTitle: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.ink },
  hint: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.muted,
    marginTop: -6,
  },
  modeGroup: { gap: 8 },
  modeLabel: { fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.orange },
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
  chipOn: { backgroundColor: colors.orange },
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
