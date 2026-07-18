/**
 * 😈 ใครโดน — สุ่มผู้โชคร้าย (เช่น คนจ่ายเงิน)
 * ใส่รายชื่อ → สุ่ม 1 คน → ป้าแซวผู้โชคร้าย → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useNamesStore } from '@/store/useNamesStore';
import { victimLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { NameListEditor } from '@/components/NameListEditor';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { PinballDraw, PinballHandle } from '@/components/PinballDraw';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function WhoGetsItScreen() {
  const names = useNamesStore((s) => s.names);
  const addName = useNamesStore((s) => s.addName);
  const removeName = useNamesStore((s) => s.removeName);

  const cardRef = useRef<View>(null);
  const pinballRef = useRef<PinballHandle>(null);
  const pendingIdx = useRef(0);
  const [victim, setVictim] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('sassy');
  const [round, setRound] = useState(0);
  const [dropping, setDropping] = useState(false);

  function draw() {
    if (names.length < 2 || dropping) return;
    const idx = Math.floor(Math.random() * names.length);
    pendingIdx.current = idx;
    setVictim(null);
    setDropping(true);
    pinballRef.current?.drop(idx);
  }

  // เรียกเมื่อลูกบอลตกถึงช่อง → เด้งการ์ดผู้โชคร้ายออกมา
  function onLand() {
    const picked = names[pendingIdx.current];
    const line = pickLine(victimLines, picked);
    setVictim(picked);
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
    setDropping(false);
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PaaUanBubble
          text={
            dropping
              ? t('ลูกบอลกำลังกลิ้งหาเหยื่อ~ 😈', 'The ball is hunting for a victim~ 😈')
              : t('ใครจะซวยรอบนี้น้า~ ใส่ชื่อมาให้ป้าจิ้ม!', "Who's unlucky this round~ add names and let Auntie pick!")
          }
          mood="sassy"
          pose={dropping ? undefined : 'shock'}
        />

        {names.length >= 2 && (
          <PinballDraw ref={pinballRef} names={names} accent={colors.pink} onLand={onLand} />
        )}

        {victim !== null && !dropping && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="shock">
              <Text style={styles.emoji}>😈</Text>
              <Text style={styles.label}>{t('ผู้โชคร้ายคือ', 'The unlucky one is')}</Text>
              <Text style={styles.name}>{victim}</Text>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
        )}

        <BigButton
          label={dropping ? t('กำลังสุ่ม...', 'Picking...') : victim === null ? t('สุ่มผู้โชคร้าย!', 'Pick a victim!') : t('สุ่มใหม่', 'Again')}
          onPress={draw}
          disabled={names.length < 2 || dropping}
        />

        {victim !== null && !dropping && <ShareButton targetRef={cardRef} />}

        <NameListEditor
          names={names}
          onAdd={addName}
          onRemove={removeName}
          label={t('รายชื่อผู้ร่วมชะตากรรม', 'Names in the pool')}
          placeholder={t('ใส่ชื่อเพื่อน...', 'Add a friend...')}
        />
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18, flexGrow: 1 },
  emoji: { fontSize: 56 },
  label: { fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.muted },
  name: { fontFamily: fonts.bold, fontSize: fontSize.xxl, color: colors.pink, textAlign: 'center' },
});
