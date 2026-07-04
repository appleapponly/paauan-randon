/**
 * 🎁 จับฉลากรายชื่อ — สุ่มผู้โชคดี (เหมาะงานปีใหม่บริษัท จับของขวัญ)
 * ใส่รายชื่อ → จับ 1 คน → ป้าแสดงความยินดี → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useNamesStore } from '@/store/useNamesStore';
import { luckyLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { NameListEditor } from '@/components/NameListEditor';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { PinballDraw, PinballHandle } from '@/components/PinballDraw';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function LuckyDrawScreen() {
  const names = useNamesStore((s) => s.names);
  const addName = useNamesStore((s) => s.addName);
  const removeName = useNamesStore((s) => s.removeName);

  const cardRef = useRef<View>(null);
  const pinballRef = useRef<PinballHandle>(null);
  const pendingIdx = useRef(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);
  const [dropping, setDropping] = useState(false);

  function draw() {
    if (names.length < 2 || dropping) return;
    const idx = Math.floor(Math.random() * names.length);
    pendingIdx.current = idx;
    setWinner(null); // ซ่อนการ์ดเดิมระหว่างปล่อยลูก
    setDropping(true);
    pinballRef.current?.drop(idx);
  }

  // เรียกเมื่อลูกบอลตกถึงช่องแล้ว → เด้งการ์ดผลออกมา
  function onLand() {
    const picked = names[pendingIdx.current];
    const line = pickLine(luckyLines, picked);
    setWinner(picked);
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
              ? t('ลูกบอลกำลังกลิ้ง~ ลุ้นกันหน่อยจ้ะ!', 'The ball is rolling~ fingers crossed!')
              : t('ใส่รายชื่อให้ครบ เดี๋ยวป้าจับผู้โชคดีให้!', 'Add all the names and Auntie will draw a winner!')
          }
          mood={dropping ? 'teasing' : 'happy'}
        />

        {names.length >= 2 && (
          <PinballDraw ref={pinballRef} names={names} accent={colors.jade} onLand={onLand} />
        )}

        {winner !== null && !dropping && (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="clap">
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.label}>{t('ผู้โชคดีคือ', 'The winner is')}</Text>
              <Text style={styles.name}>{winner}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <BigButton
          label={dropping ? t('กำลังสุ่ม...', 'Drawing...') : winner === null ? t('จับฉลาก!', 'Draw!') : t('จับใหม่', 'Draw again')}
          onPress={draw}
          disabled={names.length < 2 || dropping}
        />

        {winner !== null && !dropping && <ShareButton targetRef={cardRef} />}

        <NameListEditor
          names={names}
          onAdd={addName}
          onRemove={removeName}
          label={t('รายชื่อผู้เข้าร่วม', 'Participants')}
          placeholder={t('ใส่ชื่อผู้เข้าร่วม...', 'Add a participant...')}
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
  name: { fontFamily: fonts.bold, fontSize: fontSize.xxl, color: colors.jade, textAlign: 'center' },
});
