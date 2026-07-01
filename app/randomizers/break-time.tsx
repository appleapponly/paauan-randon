/**
 * ☕ สุ่มเวลาพัก — สุ่มเวลาพัก 5-15 นาที + กิจกรรมพัก แล้วเริ่มจับเวลาพักเต็มจอ
 * เหมาะเวลาทำอย่างอื่นมาแล้วอยากพักสั้น ๆ (ไม่ต้องมาจากหน้าเรียน)
 */
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useStudyStore } from '@/store/useStudyStore';
import { BREAK_ACTIVITIES, breakLines } from '@/data/studyTasks';
import { pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne, randomInt } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

export default function BreakTimeScreen() {
  const router = useRouter();
  const breakMin = useStudyStore((s) => s.breakMin);
  const setBreakMin = useStudyStore((s) => s.setBreakMin);

  const cardRef = useRef<View>(null);
  const [bubble, setBubble] = useState('เหนื่อยแล้วเหรอลูก? กดสุ่มเวลาพัก เดี๋ยวป้าจัดให้!');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [activity, setActivity] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  function roll() {
    const act = pickOne(BREAK_ACTIVITIES);
    const mins = randomInt(5, 15);
    setBreakMin(mins);
    const line = pickLine(breakLines, act);
    setBubble(line.text);
    setMood(line.mood);
    setActivity(act);
    setRound((r) => r + 1);
  }

  function startBreak() {
    router.push({
      pathname: '/timer',
      params: {
        minutes: String(breakMin),
        label: activity ?? 'พักผ่อน',
        mode: 'break',
        session: '1',
      },
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.content}>
        <PaaUanBubble text={bubble} mood={mood} pose="satisfied" />

        {activity && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              pose="satisfied"
              watermark="พักผ่อนกับป้าอ้วน ☕"
            >
              <Text style={styles.badge}>เวลาพัก</Text>
              <Text style={styles.mins}>{breakMin} นาที</Text>
              <Text style={styles.activity}>{activity}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ flex: 1 }} />

        <BigButton
          label={activity ? 'สุ่มใหม่' : 'สุ่มเวลาพัก!'}
          color={colors.jade}
          onPress={roll}
        />
        {activity && <ShareButton targetRef={cardRef} />}
        {activity && (
          <BigButton label={`เริ่มพัก ${breakMin} นาที ☕`} color={colors.ocean} onPress={startBreak} countAd={false} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, padding: 20, gap: 16 },
  badge: { fontFamily: fonts.bold, fontSize: fontSize.sm, color: colors.jade },
  mins: { fontFamily: fonts.bold, fontSize: 56, color: colors.jade, textAlign: 'center' },
  activity: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    textAlign: 'center',
  },
});
