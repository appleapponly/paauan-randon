/**
 * 🎁 จับฉลากรายชื่อ — สุ่มผู้โชคดี (เหมาะงานปีใหม่บริษัท จับของขวัญ)
 * ใส่รายชื่อ → จับ 1 คน → ป้าแสดงความยินดี → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useNamesStore } from '@/store/useNamesStore';
import { luckyLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { NameListEditor } from '@/components/NameListEditor';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

export default function LuckyDrawScreen() {
  const names = useNamesStore((s) => s.names);
  const addName = useNamesStore((s) => s.addName);
  const removeName = useNamesStore((s) => s.removeName);

  const cardRef = useRef<View>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function draw() {
    if (names.length < 2) return;
    const picked = pickOne(names);
    const line = pickLine(luckyLines, picked);
    setWinner(picked);
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {winner === null ? (
          <PaaUanBubble text="ใส่รายชื่อให้ครบ เดี๋ยวป้าจับผู้โชคดีให้!" mood="happy" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood}>
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.label}>ผู้โชคดีคือ</Text>
              <Text style={styles.name}>{winner}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <BigButton
          label={winner === null ? 'จับฉลาก!' : 'จับใหม่'}
          onPress={draw}
          disabled={names.length < 2}
        />

        {winner !== null && <ShareButton targetRef={cardRef} />}

        <NameListEditor
          names={names}
          onAdd={addName}
          onRemove={removeName}
          label="รายชื่อผู้เข้าร่วม"
          placeholder="ใส่ชื่อผู้เข้าร่วม..."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18, flexGrow: 1 },
  emoji: { fontSize: 56 },
  label: { fontFamily: fonts.medium, fontSize: fontSize.md, color: colors.muted },
  name: { fontFamily: fonts.bold, fontSize: fontSize.xxl, color: colors.jade, textAlign: 'center' },
});
