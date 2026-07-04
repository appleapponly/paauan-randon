/**
 * ☕ สุ่มเวลาพัก — สุ่มเวลาพัก 5-15 นาที + กิจกรรมพัก แล้วเริ่มจับเวลาพักเต็มจอ
 * เหมาะเวลาทำอย่างอื่นมาแล้วอยากพักสั้น ๆ (ไม่ต้องมาจากหน้าเรียน)
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
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
import { t } from '@/i18n';

export default function BreakTimeScreen() {
  const router = useRouter();
  const breakMin = useStudyStore((s) => s.breakMin);
  const setBreakMin = useStudyStore((s) => s.setBreakMin);

  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
  const [bubble, setBubble] = useState(t('เหนื่อยแล้วเหรอลูก? กดสุ่มเวลาพัก เดี๋ยวป้าจัดให้!', 'Tired, sweetie? Tap for a random break and Auntie will sort it out!'));
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
        label: activity ?? t('พักผ่อน', 'Rest'),
        mode: 'break',
        session: '1',
      },
    });
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
      >
        <PaaUanBubble text={bubble} mood={mood} pose={activity ? 'fan' : 'tea'} />

        {activity && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard
              ref={cardRef}
              comment={bubble}
              mood={mood}
              pose="fan"
              watermark={t('พักผ่อนกับป้าอ้วน ☕', 'Take a break with Auntie ☕')}
            >
              <Text style={styles.badge}>{t('เวลาพัก', 'Break time')}</Text>
              <Text style={styles.mins}>{breakMin} {t('นาที', 'min')}</Text>
              <Text style={styles.activity}>{activity}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <BigButton
          label={activity ? t('สุ่มใหม่', 'Again') : t('สุ่มเวลาพัก!', 'Random break!')}
          color={colors.jade}
          onPress={roll}
        />
        {activity && <ShareButton targetRef={cardRef} />}
        <View
          onLayout={(e) => {
            if (!activity) return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          {activity && (
            <BigButton label={t(`เริ่มพัก ${breakMin} นาที ☕`, `Start ${breakMin}-min break ☕`)} color={colors.ocean} onPress={startBreak} countAd={false} />
          )}
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  // paddingBottom เยอะ กันปุ่ม "เริ่มพัก" ตกไปโดนแถบ navigation ของเครื่องบัง
  content: { padding: 20, gap: 16, paddingBottom: 48, flexGrow: 1 },
  badge: { fontFamily: fonts.bold, fontSize: fontSize.sm, color: colors.jade },
  mins: { fontFamily: fonts.bold, fontSize: 56, color: colors.jade, textAlign: 'center' },
  activity: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    textAlign: 'center',
  },
});
