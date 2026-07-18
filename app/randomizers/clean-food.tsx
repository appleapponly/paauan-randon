/**
 * 🥗 สุ่มเมนูคลีน — วงล้อหมุนสุ่มเมนูสุขภาพ (โครงเดียวกับสุ่มอาหาร)
 */
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useCleanFoodStore } from '@/store/useCleanFoodStore';
import { PRESET_CLEAN_MENU, getCleanEmoji, cleanFoodLines } from '@/data/cleanFood';
import { spinningLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { SpinWheel, SpinWheelHandle } from '@/components/SpinWheel';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import { t } from '@/i18n';

const WHEEL_COLORS = [colors.jade, colors.orange, colors.gold, colors.blue];

export default function CleanFoodScreen() {
  const menu = useCleanFoodStore((s) => s.menu);
  const addItem = useCleanFoodStore((s) => s.addItem);
  const removeItem = useCleanFoodStore((s) => s.removeItem);

  const available = PRESET_CLEAN_MENU.filter((i) => !menu.includes(i));

  const wheelRef = useRef<SpinWheelHandle>(null);
  const cardRef = useRef<View>(null);
  const [spinning, setSpinning] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [bubble, setBubble] = useState(t('กดหมุนวงล้อ เดี๋ยวป้าเลือกเมนูคลีนให้!', 'Spin the wheel and Auntie will pick a clean meal!'));
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [result, setResult] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  function handleSpin() {
    if (menu.length < 2 || spinning) return;
    setResult(null);
    wheelRef.current?.spin();
  }

  function onStart() {
    setSpinning(true);
    const line = pickLine(spinningLines);
    setBubble(line.text);
    setMood(line.mood);
  }

  function onResult(item: string) {
    setSpinning(false);
    const line = pickLine(cleanFoodLines, item);
    setBubble(line.text);
    setMood(line.mood);
    setResult(item);
    setRound((r) => r + 1);
  }

  function handleAdd() {
    addItem(newItem);
    setNewItem('');
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PaaUanBubble text={bubble} mood={mood} pose={result && !spinning ? 'veggie' : 'grocery'} />

        {menu.length < 2 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {t('มีเมนูน้อยไป! เพิ่มเมนูคลีนอย่างน้อย 2 อย่างก่อนนะจ๊ะ', 'Too few meals! Add at least 2 clean meals first.')}
            </Text>
          </View>
        ) : (
          <View style={styles.wheelWrap}>
            <SpinWheel
              ref={wheelRef}
              items={menu}
              size={300}
              sliceColors={WHEEL_COLORS}
              onStart={onStart}
              onResult={onResult}
            />
          </View>
        )}

        <BigButton
          label={spinning ? t('กำลังหมุน...', 'Spinning...') : t('หมุนเลย!', 'Spin!')}
          color={colors.jade}
          onPress={handleSpin}
          disabled={spinning || menu.length < 2}
        />

        {result && !spinning && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              pose="veggie"
              watermark={t('กินคลีนกับป้าอ้วน 🥗❤️', "Clean Eats · Auntie's Random 🥗❤️")}
            >
              <Text style={styles.resultEmoji}>{getCleanEmoji(result)}</Text>
              <Text style={styles.resultName}>{result}</Text>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
        )}

        {result && !spinning && <ShareButton targetRef={cardRef} />}

        {/* จัดการเมนู */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>{t('เมนูในวงล้อ', 'Meals in the wheel')} ({menu.length})</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder={t('พิมพ์ชื่อเมนูคลีนใหม่...', 'Type a new clean meal...')}
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
          <View style={styles.chips}>
            {menu.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
                <Pressable onPress={() => removeItem(item)} hitSlop={8}>
                  <Text style={styles.chipX}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* คลังเมนูแนะนำ */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>{t('เมนูแนะนำ — แตะเพื่อย้ายเข้าวงล้อ', 'Suggestions — tap to add to the wheel')}</Text>
          <View style={styles.chips}>
            {available.length === 0 ? (
              <Text style={styles.hint}>{t('เมนูแนะนำอยู่ในวงล้อหมดแล้วจ้า 🎉', 'All suggestions are already in the wheel 🎉')}</Text>
            ) : (
              available.map((item) => (
                <Pressable key={item} onPress={() => addItem(item)} style={styles.suggestChip}>
                  <Text style={styles.suggestChipText}>＋ {item}</Text>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 22 },
  wheelWrap: { alignItems: 'center' },
  resultEmoji: { fontSize: 48 },
  resultName: { fontFamily: fonts.bold, fontSize: fontSize.xxl, color: colors.jade, textAlign: 'center' },
  emptyBox: { ...cartoonBox(colors.white, 4), padding: 20 },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 24,
  },
  manageBox: { ...cartoonBox(colors.white, 4), padding: 16, gap: 14 },
  manageTitle: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.ink },
  hint: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.muted },
  addRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 52,
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
  },
  chipText: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.ink },
  chipX: { fontFamily: fonts.bold, fontSize: 14, color: colors.pink },
  suggestChip: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestChipText: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.ink },
});
