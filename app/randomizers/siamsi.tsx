/**
 * 🥠 เซียมซี — เขย่าเซียมซี สุ่มได้ 1 ใบจาก 30 ใบ
 * - ใบเซียมซี (เลข + ชื่อ + กลอนคำทำนาย) ออกแบบสวย อยู่ "นอกกล่องคำพูด"
 * - แง่คิดสะกิดใจ (สไตล์ป้าอ้วน) อยู่ในกล่องคำพูดป้า
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { SIAMSI, type SiamsiStick } from '@/data/siamsi';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { pickOne } from '@/utils/random';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

export default function SiamsiScreen() {
  const cardRef = useRef<View>(null);
  const [stick, setStick] = useState<SiamsiStick | null>(null);
  const [round, setRound] = useState(0);

  function shake() {
    setStick(pickOne(SIAMSI));
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {stick === null ? (
          <PaaUanBubble
            text="ตั้งจิตอธิษฐานแล้วเขย่าเซียมซีกับป้าเลยลูก ดูซิวันนี้ได้ใบไหน"
            mood="thinking"
            pose="fortune"
          />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={stick.insight}
              pose="fortune"
              watermark="เซียมซีป้าอ้วน 🥠"
            >
              {/* ใบเซียมซี (นอกกล่องคำพูด) */}
              <View style={styles.slip}>
                <View style={styles.slipBadge}>
                  <Text style={styles.slipBadgeText}>ใบที่ {stick.id}</Text>
                </View>
                <Text style={styles.slipTitle}>{stick.title}</Text>
                <View style={styles.slipDivider} />
                <Text style={styles.slipPoem}>{stick.poem}</Text>
              </View>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 16 }} />

        <BigButton
          label={stick === null ? 'เขย่าเซียมซี!' : 'เขย่าใหม่'}
          onPress={shake}
          color={colors.wine}
        />

        {stick !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 8, flexGrow: 1 },

  // ใบเซียมซี — กระดาษครีม ขอบแดงเข้ม มีหัวเลขใบ
  slip: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.wine,
    borderRadius: 14,
    paddingTop: 26,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
  },
  slipBadge: {
    position: 'absolute',
    top: -16,
    backgroundColor: colors.wine,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  slipBadgeText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.white,
  },
  slipTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.wine,
    textAlign: 'center',
    lineHeight: 38,
  },
  slipDivider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  slipPoem: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 34, // กลอนภาษาไทย เผื่อสระบน/ล่างไม่ขาด
  },
});
