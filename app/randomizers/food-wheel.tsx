/**
 * 🍜 กินอะไรดี — วงล้อหมุนสุ่มเมนูอาหาร
 * - หมุนวงล้อ → ป้าอ้วนฟันธงเมนู (สุ่มคำพูดจาก foodResultLines แทนค่า {result})
 * - เพิ่ม/ลบเมนูเองได้ บันทึกลงเครื่องอัตโนมัติ (useFoodStore + AsyncStorage)
 */
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoodStore } from '@/store/useFoodStore';
import { PRESET_FOOD_MENU } from '@/data/foodMenu';
import {
  spinningLines,
  pickLine,
  pickFoodLine,
  PaaUanMood,
} from '@/data/paaUanLines';
import { SpinWheel, SpinWheelHandle } from '@/components/SpinWheel';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import Animated, { BounceIn } from 'react-native-reanimated';
import { type PaaUanPose } from '@/theme/assets';
import { pickOne } from '@/utils/random';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

// อิริยาบทป้าที่เหมาะกับ "การ์ดแชร์อาหาร" — เลือกหลายแบบให้ไม่ซ้ำซาก (เลี่ยงหน้าปฏิเสธ)
const FOOD_CARD_POSES: PaaUanPose[] = ['cookHappy', 'satisfied', 'cookJump', 'happy'];

// เซ็ตเมนู "เตรียมไว้" — ใช้เช็คว่าเมนูเป็นของระบบ (เอาออก→กลับไปแนะนำ) หรือผู้ใช้พิมพ์เอง (ลบถาวร)
const PRESET_SET = new Set(PRESET_FOOD_MENU);

export default function FoodWheelScreen() {
  const menu = useFoodStore((s) => s.menu);
  const addItem = useFoodStore((s) => s.addItem);
  const removeItem = useFoodStore((s) => s.removeItem);

  // เมนูแนะนำที่ยังไม่อยู่ในวงล้อ (พอเอาเข้าวงล้อจะหายจากตรงนี้ พอเอาออกจะกลับมา)
  const available = PRESET_FOOD_MENU.filter((i) => !menu.includes(i));

  const wheelRef = useRef<SpinWheelHandle>(null);
  const [spinning, setSpinning] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [bubble, setBubble] = useState('กดหมุนวงล้อ เดี๋ยวป้าเลือกเมนูให้!');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [result, setResult] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  // อิริยาบทป้าบนการ์ดแชร์ LINE — สุ่มเอาหลายแบบ (เฉพาะหน้าตาดีใจ/อิ่มเอม ไม่เอาหน้าปฏิเสธ)
  const [cardPose, setCardPose] = useState<PaaUanPose>('cookHappy');
  const cardRef = useRef<View>(null);

  function handleSpin() {
    if (menu.length < 2 || spinning) return;
    setResult(null); // ซ่อนการ์ดผลเดิมระหว่างหมุนใหม่
    wheelRef.current?.spin();
  }

  // เรียกตอนวงล้อเริ่มหมุน
  function onStart() {
    setSpinning(true);
    const line = pickLine(spinningLines);
    setBubble(line.text);
    setMood(line.mood);
  }

  // เรียกตอนวงล้อหยุด — รู้ผลแล้ว
  function onResult(item: string) {
    setSpinning(false);
    const line = pickFoodLine(item); // คอมเมนต์เจาะจงเมนูนั้น ถ้ามี
    setBubble(line.text);
    setMood(line.mood);
    setCardPose(pickOne(FOOD_CARD_POSES));
    setResult(item);
    setRound((r) => r + 1);
  }

  function handleAdd() {
    addItem(newItem);
    setNewItem('');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* หน้าสุ่มอาหาร → ใช้รูปป้ากำลังผัดกับข้าวให้เข้าบริบท */}
        <PaaUanBubble
          text={bubble}
          mood={mood}
          pose={result && !spinning ? 'cookHappy' : 'cook'}
        />

        {menu.length < 2 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              มีเมนูน้อยไป! ป้าหมุนให้ไม่ได้ เพิ่มเมนูอย่างน้อย 2 อย่างก่อนนะจ๊ะ
            </Text>
          </View>
        ) : (
          <View style={styles.wheelWrap}>
            <SpinWheel ref={wheelRef} items={menu} size={300} onStart={onStart} onResult={onResult} />
          </View>
        )}

        <BigButton
          label={spinning ? 'กำลังหมุน...' : 'หมุนเลย!'}
          onPress={handleSpin}
          disabled={spinning || menu.length < 2}
        />

        {/* การ์ดผลแบบแชร์ได้ */}
        {result && !spinning && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              pose={cardPose}
              watermark="แอปสุ่มอาหารจากใจป้าอ้วน ❤️"
            >
              <Text style={styles.resultEmoji}>🍜</Text>
              <Text style={styles.resultName}>{result}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        {result && !spinning && <ShareButton targetRef={cardRef} />}

        {/* จัดการเมนู */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>เมนูในวงล้อ ({menu.length})</Text>

          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="พิมพ์ชื่อเมนูใหม่..."
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
            {menu.map((item) => {
              const preset = PRESET_SET.has(item);
              return (
                <View key={item} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <Pressable onPress={() => removeItem(item)} hitSlop={8}>
                    {/* เมนูระบบ → ✕ (เอาออกแล้วกลับไปอยู่เมนูแนะนำ) · เมนูพิมพ์เอง → "ลบ" (หายถาวร) */}
                    {preset ? (
                      <Text style={styles.chipX}>✕</Text>
                    ) : (
                      <Text style={styles.chipDelete}>ลบ</Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        {/* คลังเมนูแนะนำ — เมนูที่ยังไม่อยู่ในวงล้อ แตะเพื่อย้ายเข้าวงล้อ */}
        <View style={styles.manageBox}>
          <Text style={styles.manageTitle}>เมนูแนะนำ — แตะเพื่อย้ายเข้าวงล้อ</Text>
          <Text style={styles.suggestHint}>
            แตะเมนูด้านล่างเพื่อย้ายเข้าวงล้อ · เมนูที่เอาออกจากวงล้อจะกลับมาอยู่ตรงนี้
          </Text>
          <View style={styles.chips}>
            {available.length === 0 ? (
              <Text style={styles.suggestHint}>เมนูแนะนำอยู่ในวงล้อหมดแล้วจ้า 🎉</Text>
            ) : (
              available.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => addItem(item)}
                  style={styles.suggestChip}
                >
                  <Text style={styles.suggestChipText}>＋ {item}</Text>
                </Pressable>
              ))
            )}
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
  resultEmoji: { fontSize: 48 },
  resultName: { fontFamily: fonts.bold, fontSize: fontSize.xxl, color: colors.pink, textAlign: 'center' },
  emptyBox: {
    ...cartoonBox(colors.white, 4),
    padding: 20,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 24,
  },
  manageBox: {
    ...cartoonBox(colors.white, 4),
    padding: 16,
    gap: 14,
  },
  manageTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 52,
    textAlignVertical: 'center', // Android: จัดคำกึ่งกลางแนวตั้ง ไม่ให้สระบนถูกตัด
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
  addBtnText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.white,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  chipText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.ink,
  },
  chipX: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.pink,
  },
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
  suggestHint: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.muted,
    lineHeight: 21,
    marginTop: -6,
  },
  suggestChip: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestChipText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.ink,
  },
});
