/**
 * 😈 ใครโดน — สุ่มผู้โชคร้าย (เช่น คนจ่ายเงิน)
 * ใส่รายชื่อ → สุ่ม 1 คน → ป้าแซวผู้โชคร้าย → แชร์ได้
 */
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useNamesStore } from '@/store/useNamesStore';
import { victimLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { pickOne } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { NameListEditor } from '@/components/NameListEditor';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';

export default function WhoGetsItScreen() {
  const names = useNamesStore((s) => s.names);
  const addName = useNamesStore((s) => s.addName);
  const removeName = useNamesStore((s) => s.removeName);

  const cardRef = useRef<View>(null);
  const [victim, setVictim] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('sassy');
  const [round, setRound] = useState(0);

  function draw() {
    if (names.length < 2) return;
    const picked = pickOne(names);
    const line = pickLine(victimLines, picked);
    setVictim(picked);
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {victim === null ? (
          <PaaUanBubble text="ใครจะซวยรอบนี้น้า~ ใส่ชื่อมาให้ป้าจิ้ม!" mood="sassy" />
        ) : (
          <Animated.View key={round} entering={ZoomIn.springify().damping(12)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood}>
              <Text style={styles.emoji}>😈</Text>
              <Text style={styles.label}>ผู้โชคร้ายคือ</Text>
              <Text style={styles.name}>{victim}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        <BigButton
          label={victim === null ? 'สุ่มผู้โชคร้าย!' : 'สุ่มใหม่'}
          onPress={draw}
          disabled={names.length < 2}
        />

        {victim !== null && <ShareButton targetRef={cardRef} />}

        <NameListEditor
          names={names}
          onAdd={addName}
          onRemove={removeName}
          label="รายชื่อผู้ร่วมชะตากรรม"
          placeholder="ใส่ชื่อเพื่อน..."
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
  name: { fontFamily: fonts.bold, fontSize: fontSize.xxl, color: colors.pink, textAlign: 'center' },
});
