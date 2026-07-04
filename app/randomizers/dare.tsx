/**
 * 🌶️ สุ่มท้าทาย — สุ่มคำสั่งกวน ๆ สไตล์ป้าอ้วน
 */
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { DARE_CHALLENGES } from '@/data/dareChallenges';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

const INTROS = t<string[]>(
  [
    'รอบนี้ป้าสั่ง...',
    'ทำตามนี้เลยลูก ห้ามเกี่ยง!',
    'ป้าท้า! กล้าทำมั้ยล่ะ',
  ],
  [
    "Auntie's orders this round...",
    'Do this, no backing out, sweetie!',
    'Auntie dares you! You brave enough?',
  ]
);

export default function DareScreen() {
  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [dare, setDare] = useState<string | null>(null);
  const [intro, setIntro] = useState('');
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (round > 0) scrollRef.current?.scrollToEnd({ animated: true });
  }, [round]);

  function roll() {
    setDare(pickOne(DARE_CHALLENGES));
    setIntro(pickOne(INTROS));
    setRound((r) => r + 1);
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        {dare === null ? (
          <PaaUanBubble text={t('อยากสนุกใช่มั้ย? กดให้ป้าสั่งภารกิจเลย!', 'Want some fun? Tap for a dare from Auntie!')} mood="sassy" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={intro} mood="sassy">
              <Text style={styles.emoji}>🌶️</Text>
              <Text style={styles.dare}>{dare}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 18 }} />

        <BigButton label={dare === null ? t('สุ่มภารกิจ!', 'Dare me!') : t('สุ่มใหม่', 'Another one')} onPress={roll} />

        {dare !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 8, flexGrow: 1 },
  emoji: { fontSize: 52 },
  dare: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 44, // เผื่อสระสูง/วรรณยุกต์ บรรทัดบนไม่ถูกตัด
  },
});
