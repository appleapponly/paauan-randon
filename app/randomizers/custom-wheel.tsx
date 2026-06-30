/**
 * 🎡 วงล้อของฉัน — ฟีเจอร์พิเศษสำหรับสมาชิก Pro (ใช้ฟรีไม่จำกัด)
 * - เลือก "คำที่จะมาสุ่ม" เองได้ (เพิ่ม/ลบ)
 * - เลือก "สีของวงล้อ" เองได้ (แตะเปิด/ปิดทีละสี)
 * - หมุนแล้วป้าพูดผลแบบ "กลาง ๆ" (เพราะคำอาจเป็นเรื่องจริงจัง)
 * - คนยังไม่ Pro: โชว์หน้าล็อก + ปุ่มไปหน้า "หลานรักป้า"
 */
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useProStore } from '@/store/useProStore';
import { useCustomWheelStore, WHEEL_PALETTE } from '@/store/useCustomWheelStore';
import { spinningLines, customWheelLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { SpinWheel, SpinWheelHandle } from '@/components/SpinWheel';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

export default function CustomWheelScreen() {
  const router = useRouter();
  const isPro = useProStore((s) => s.isPro);

  const items = useCustomWheelStore((s) => s.items);
  const wheelColors = useCustomWheelStore((s) => s.colors);
  const addItem = useCustomWheelStore((s) => s.addItem);
  const removeItem = useCustomWheelStore((s) => s.removeItem);
  const toggleColor = useCustomWheelStore((s) => s.toggleColor);

  const wheelRef = useRef<SpinWheelHandle>(null);
  const cardRef = useRef<View>(null);
  const [spinning, setSpinning] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [bubble, setBubble] = useState('ใส่คำที่อยากสุ่ม เลือกสี แล้วกดหมุนได้เลยจ้ะ');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [result, setResult] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  // ===== คนยังไม่ Pro: หน้าล็อก =====
  if (!isPro) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <PaaUanBubble
            text="วงล้อของฉันเป็นของขวัญให้หลานที่รักป้านะจ๊ะ ปลดล็อกแล้วใช้ฟรีไม่จำกัดเลย"
            mood="happy"
          />
          <View style={styles.lockBox}>
            <Text style={styles.lockEmoji}>🎡🔒</Text>
            <Text style={styles.lockTitle}>วงล้อของฉัน (เฉพาะสมาชิก Pro)</Text>
            <Text style={styles.lockText}>
              ปลดล็อกแล้วสร้างวงล้อเองได้เต็มที่ — ใส่คำอะไรก็ได้ เลือกสีเองได้
              แถมปิดโฆษณาทั้งแอปด้วยจ้ะ
            </Text>
            <Pressable style={styles.unlockBtn} onPress={() => router.push('/pro' as never)}>
              <Text style={styles.unlockBtnText}>❤️ ปลดล็อกกับหลานรักป้า</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===== สมาชิก Pro: วงล้อ custom =====
  function handleSpin() {
    if (items.length < 2 || spinning) return;
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
    const line = pickLine(customWheelLines, item);
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PaaUanBubble text={bubble} mood={mood} />

        {items.length < 2 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              ใส่คำอย่างน้อย 2 คำก่อนนะจ๊ะ ป้าถึงจะหมุนให้ได้
            </Text>
          </View>
        ) : (
          <View style={styles.wheelWrap}>
            <SpinWheel
              ref={wheelRef}
              items={items}
              size={300}
              sliceColors={wheelColors}
              onStart={onStart}
              onResult={onResult}
            />
          </View>
        )}

        <BigButton
          label={spinning ? 'กำลังหมุน...' : 'หมุนเลย!'}
          onPress={handleSpin}
          disabled={spinning || items.length < 2}
        />

        {result && !spinning && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              watermark="วงล้อของฉัน · ป้าอ้วนสุ่มให้ ❤️"
            >
              <Text style={styles.resultName}>{result}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        {result && !spinning && <ShareButton targetRef={cardRef} />}

        {/* เลือกสีของวงล้อ */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>เลือกสีวงล้อ (แตะเปิด/ปิด)</Text>
          <View style={styles.swatchRow}>
            {WHEEL_PALETTE.map((c) => {
              const on = wheelColors.includes(c);
              return (
                <Pressable
                  key={c}
                  onPress={() => toggleColor(c)}
                  style={[
                    styles.swatch,
                    { backgroundColor: c },
                    on && styles.swatchOn,
                  ]}
                >
                  {on && <Text style={styles.swatchCheck}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.hint}>เลือกได้หลายสี (อย่างน้อย 2 สี) ป้าจะสลับสีให้เอง</Text>
        </View>

        {/* จัดการคำในวงล้อ */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>คำในวงล้อ ({items.length})</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="พิมพ์คำที่จะสุ่ม..."
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

          <View style={styles.chips}>
            {items.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
                <Pressable onPress={() => removeItem(item)} hitSlop={8}>
                  <Text style={styles.chipDelete}>ลบ</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 22 },
  wheelWrap: { alignItems: 'center' },
  resultName: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.pink,
    textAlign: 'center',
  },

  // ----- หน้าล็อก (ยังไม่ Pro) -----
  lockBox: {
    ...cartoonBox(colors.white, 4),
    borderColor: colors.wine,
    padding: 22,
    alignItems: 'center',
    gap: 12,
  },
  lockEmoji: { fontSize: 44 },
  lockTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.wine,
    textAlign: 'center',
  },
  lockText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 28,
  },
  unlockBtn: {
    backgroundColor: colors.wine,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  unlockBtnText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.white,
    textAlign: 'center',
  },

  // ----- กล่องจัดการ -----
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
  hint: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.muted,
    lineHeight: 21,
    marginTop: -4,
  },

  // สีวงล้อ
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.45,
  },
  swatchOn: {
    opacity: 1,
    borderWidth: 4,
  },
  swatchCheck: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
  },

  // คำในวงล้อ
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
});
