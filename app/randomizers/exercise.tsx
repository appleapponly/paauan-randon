/**
 * 🏃 สุ่มออกกำลังกาย — กระดานงูตกช่อง 2 สเตจ (ท่า → จำนวน) → การ์ดภารกิจ
 * เลือกท่าเองได้ (จัดกลุ่มตามโหมด Cardio/Strength/HIIT) + เพิ่มท่าเอง
 */
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useExerciseStore } from '@/store/useExerciseStore';
import {
  PRESET_EXERCISES,
  MODE_ORDER,
  MODE_LABEL,
  UNIT_LABEL,
  Exercise,
} from '@/data/exercises';
import { exerciseLinesByMode } from '@/data/exercises';
import { spinningLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { randomInt, pickIndex } from '@/utils/random';
import { SnakeBoard, SnakeHandle } from '@/components/SnakeBoard';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

interface Mission {
  ex: Exercise;
  amount: number;
  unit: string; // label ไทยแล้ว
}

export default function ExerciseScreen() {
  const selectedIds = useExerciseStore((s) => s.selectedIds);
  const custom = useExerciseStore((s) => s.custom);
  const toggle = useExerciseStore((s) => s.toggle);
  const addCustom = useExerciseStore((s) => s.addCustom);
  const removeCustom = useExerciseStore((s) => s.removeCustom);

  const snakeRef = useRef<SnakeHandle>(null);
  const cardRef = useRef<View>(null);
  const pending = useRef<Mission | null>(null);
  const [running, setRunning] = useState(false);
  const [bubble, setBubble] = useState('เลือกท่าที่ชอบ แล้วกดปล่อยงูเลือกภารกิจให้เลยจ้ะ!');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [mission, setMission] = useState<Mission | null>(null);
  const [round, setRound] = useState(0);
  const [newItem, setNewItem] = useState('');

  // ท่าทั้งหมด (preset + เพิ่มเอง) และ pool ที่เลือกไว้ (ตามลำดับ = ช่องบนกระดาน)
  const all = useMemo(() => [...PRESET_EXERCISES, ...custom], [custom]);
  const pool = useMemo(
    () => all.filter((e) => selectedIds.includes(e.id)),
    [all, selectedIds]
  );

  function handleRoll() {
    if (pool.length < 2 || running) return;
    setMission(null);
    setRunning(true);
    const line = pickLine(spinningLines);
    setBubble(line.text);
    setMood(line.mood);

    // สุ่มท่า → variant → จำนวน
    const exIndex = pickIndex(pool);
    const ex = pool[exIndex];
    const variantIndex = randomInt(0, ex.variants.length - 1);
    const variant = ex.variants[variantIndex];
    const amountIndex = randomInt(0, variant.amounts.length - 1);

    pending.current = {
      ex,
      amount: variant.amounts[amountIndex],
      unit: UNIT_LABEL[variant.unit],
    };
    snakeRef.current?.roll({ exIndex, variantIndex, amountIndex });
  }

  function onLand() {
    const m = pending.current;
    if (!m) return;
    const missionText = `${m.ex.name} ${m.amount} ${m.unit}`;
    const line = pickLine(exerciseLinesByMode[m.ex.mode], missionText);
    setBubble(line.text);
    setMood(line.mood);
    setMission(m);
    setRound((r) => r + 1);
    setRunning(false);
  }

  function handleAdd() {
    addCustom(newItem);
    setNewItem('');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PaaUanBubble text={bubble} mood={mood} />

        {pool.length < 2 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              เลือกท่าอย่างน้อย 2 ท่าก่อนนะจ๊ะ ป้าถึงจะปล่อยงูให้ได้
            </Text>
          </View>
        ) : (
          <SnakeBoard ref={snakeRef} pool={pool} accent={colors.orange} onLand={onLand} />
        )}

        <BigButton
          label={running ? 'งูกำลังเลื้อย...' : 'ปล่อยงูเลย! 🐍'}
          color={colors.orange}
          onPress={handleRoll}
          disabled={running || pool.length < 2}
        />

        {mission && !running && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              watermark="ภารกิจสุขภาพจากป้าอ้วน 💪"
            >
              <Text style={styles.missionBadge}>ภารกิจวันนี้</Text>
              <Text style={styles.missionEmoji}>{mission.ex.emoji}</Text>
              <Text style={styles.missionName}>{mission.ex.name}</Text>
              <Text style={styles.missionAmount}>
                {mission.amount} {mission.unit}
              </Text>
            </CaptureCard>
          </Animated.View>
        )}

        {mission && !running && <ShareButton targetRef={cardRef} />}

        {/* เลือกท่า จัดกลุ่มตามโหมด */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>เลือกท่าออกกำลังกาย ({pool.length})</Text>
          <Text style={styles.hint}>แตะเพื่อเปิด/ปิดท่าในกระดาน</Text>

          {MODE_ORDER.map((mode) => {
            const items = all.filter((e) => e.mode === mode);
            if (items.length === 0) return null;
            return (
              <View key={mode} style={styles.modeGroup}>
                <Text style={styles.modeLabel}>{MODE_LABEL[mode]}</Text>
                <View style={styles.chips}>
                  {items.map((ex) => {
                    const on = selectedIds.includes(ex.id);
                    const isCustom = ex.id.startsWith('custom-');
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
                            <Text style={styles.chipDelete}>ลบ</Text>
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
              placeholder="เพิ่มท่าของตัวเอง..."
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
  content: { padding: 20, gap: 20 },
  emptyBox: { ...cartoonBox(colors.white, 4), padding: 20 },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 24,
  },
  missionBadge: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    color: colors.orange,
  },
  missionEmoji: { fontSize: 52 },
  missionName: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    textAlign: 'center',
  },
  missionAmount: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.orange,
    textAlign: 'center',
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
