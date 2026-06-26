/**
 * 👗 สุ่มแต่งตัว — เลือกเพศ (ชาย/หญิง) แล้วกดสุ่ม
 * ป้าจัดลุคให้: เสื้อ + ท่อนล่าง + รองเท้า + เครื่องประดับ อย่างละ 1 → แชร์ได้
 */
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import {
  OUTFITS,
  OUTFIT_SLOTS,
  type Gender,
  type OutfitOption,
} from '@/data/outfitItems';
import { outfitLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

type Look = Record<string, OutfitOption>;

export default function OutfitScreen() {
  const cardRef = useRef<View>(null);
  const [gender, setGender] = useState<Gender>('female');
  const [look, setLook] = useState<Look | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function rollOutfit() {
    const set = OUTFITS[gender];
    const next: Look = {};
    for (const slot of OUTFIT_SLOTS) {
      next[slot.key] = pickOne(set[slot.key]);
    }
    const line = pickLine(outfitLines);
    setLook(next);
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {look === null && (
          <PaaUanBubble
            text="วันนี้จะแต่งตัวยังไงดี? เลือกเพศแล้วให้ป้าจัดลุคให้เลย!"
            mood="happy"
            pose="fashion"
          />
        )}

        {/* เลือกเพศ */}
        <View style={styles.genderRow}>
          {(['female', 'male'] as Gender[]).map((g) => (
            <Pressable
              key={g}
              onPress={() => setGender(g)}
              style={[styles.genderBtn, gender === g && styles.genderBtnOn]}
            >
              <Text style={styles.genderEmoji}>{g === 'female' ? '👩' : '👨'}</Text>
              <Text
                style={[styles.genderText, gender === g && styles.genderTextOn]}
              >
                {g === 'female' ? 'หญิง' : 'ชาย'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* การ์ดลุคที่สุ่มได้ */}
        {look !== null && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="fashion">
              <Text style={styles.lookTitle}>
                ลุค{gender === 'female' ? 'สาว' : 'หนุ่ม'}วันนี้
              </Text>
              <View style={styles.lookList}>
                {OUTFIT_SLOTS.map((slot) => (
                  <View key={slot.key} style={styles.lookRow}>
                    <Text style={styles.lookEmoji}>{look[slot.key].emoji}</Text>
                    <View style={styles.lookTextWrap}>
                      <Text style={styles.lookLabel}>{slot.label}</Text>
                      <Text style={styles.lookName}>{look[slot.key].name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 8 }} />

        <BigButton
          label={look === null ? 'สุ่มแต่งตัว!' : 'สุ่มลุคใหม่'}
          onPress={rollOutfit}
          color={colors.jade}
        />

        {look !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 16, flexGrow: 1 },

  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 12,
  },
  genderBtnOn: { backgroundColor: colors.pink },
  genderEmoji: { fontSize: 26 },
  genderText: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.ink },
  genderTextOn: { color: colors.white },

  lookTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.pink,
    textAlign: 'center',
  },
  lookList: { gap: 10, alignSelf: 'stretch', paddingHorizontal: 6 },
  lookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 12,
    padding: 10,
  },
  lookEmoji: { fontSize: 30 },
  lookTextWrap: { flex: 1 },
  lookLabel: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.muted },
  lookName: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.ink },
});
