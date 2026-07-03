/**
 * 🧳 สุ่มที่เที่ยว — กดสุ่ม → ป้าเลือกที่เที่ยวให้ 1 ที่ + คอมเมนต์ → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { TRAVEL_SPOTS, type TravelSpot } from '@/data/travelSpots';
import { travelLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function TravelScreen() {
  const cardRef = useRef<View>(null);
  const [spot, setSpot] = useState<TravelSpot | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function draw() {
    const line = pickLine(travelLines);
    setSpot(pickOne(TRAVEL_SPOTS));
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {spot === null ? (
          <PaaUanBubble
            text={t('ว่างใช่มั้ยลูก? อยากไปเที่ยวไหน กดให้ป้าเลือกให้เลย!', 'Free time, sweetie? Tap and let Auntie pick your next trip!')}
            mood="happy"
            pose="point"
          />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="point">
              <Text style={styles.emoji}>{spot.emoji}</Text>
              <Text style={styles.label}>{t('ทริปหน้าไปที่นี่!', 'Your next trip is here!')}</Text>
              <Text style={styles.name}>{spot.name}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 20 }} />

        <BigButton
          label={spot === null ? t('สุ่มที่เที่ยว!', 'Pick a spot!') : t('สุ่มใหม่', 'Again')}
          onPress={draw}
          color={colors.jade}
        />

        {spot !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 8, flexGrow: 1 },
  emoji: { fontSize: 56 },
  label: { fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.muted },
  name: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.jade,
    textAlign: 'center',
    lineHeight: 44,
  },
});
