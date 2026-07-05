/**
 * 💡 ข้อคิดประจำวัน — สุ่มข้อคิด/คำแนะนำดี ๆ ในการใช้ชีวิตประจำวัน
 * กดปุ่ม → ป้าหมอดูให้ข้อคิด 1 ข้อ + คอมเมนต์ป้า → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { DAILY_FORTUNE } from '@/data/dailyFortune';
import { fortuneLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function DailyFortuneScreen() {
  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
  const [fortune, setFortune] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function draw() {
    const line = pickLine(fortuneLines);
    setFortune(pickOne(DAILY_FORTUNE));
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
      >
        {fortune === null ? (
          <PaaUanBubble
            text={t('อยากได้ข้อคิดดี ๆ วันนี้มั้ยลูก? กดให้ป้าหมอดูบอกเลยจ้า', "Want a little wisdom today, sweetie? Tap and Auntie will share!")}
            mood="happy"
            pose="fortune"
          />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="fortune">
              <Text style={styles.emoji}>💡</Text>
              <Text style={styles.label}>{t('ข้อคิดวันนี้', "Today's Wisdom")}</Text>
              <Text style={styles.fortune}>{fortune}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <View style={{ height: 20 }} />

        <BigButton
          label={fortune === null ? t('ขอข้อคิดวันนี้!', "Today's wisdom!") : t('ขอข้อคิดใหม่', 'Another one')}
          onPress={draw}
          color={colors.wine}
        />

        <View
          collapsable={false}
          onLayout={(e) => {
            if (fortune === null) return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          {fortune !== null && <ShareButton targetRef={cardRef} />}
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 8, flexGrow: 1 },
  emoji: { fontSize: 56 },
  label: { fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.muted },
  fortune: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.wine,
    textAlign: 'center',
    lineHeight: 46, // เผื่อสระบน/ล่าง + วรรณยุกต์ ทุกบรรทัดไม่ถูกตัด
    paddingVertical: 2,
  },
});
