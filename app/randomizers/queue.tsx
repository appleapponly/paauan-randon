/**
 * 🔢 สุ่มลำดับคิว — เรียงว่าใครก่อนใครหลัง
 */
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import { useNamesStore } from '@/store/useNamesStore';
import { groupLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { shuffle } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { NameListEditor } from '@/components/NameListEditor';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export default function QueueScreen() {
  const names = useNamesStore((s) => s.names);
  const addName = useNamesStore((s) => s.addName);
  const removeName = useNamesStore((s) => s.removeName);

  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [order, setOrder] = useState<string[] | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (round > 0) scrollRef.current?.scrollToEnd({ animated: true });
  }, [round]);

  function draw() {
    if (names.length < 2) return;
    const line = pickLine(groupLines);
    setOrder(shuffle(names));
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {order === null ? (
          <PaaUanBubble text={t('ใส่ชื่อ เดี๋ยวป้าจัดคิวให้ ใครก่อนใครหลัง!', 'Add names and Auntie will sort out who goes first!')} mood="happy" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="clap">
              <View style={styles.list}>
                {order.map((name, i) => (
                  <View key={name} style={styles.row}>
                    <View style={styles.rank}>
                      <Text style={styles.rankText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.name}>{name}</Text>
                  </View>
                ))}
              </View>
            </CaptureCard>
          </Animated.View>
        )}

        <BigButton
          label={order === null ? t('สุ่มลำดับ!', 'Shuffle order!') : t('สุ่มใหม่', 'Again')}
          onPress={draw}
          disabled={names.length < 2}
        />

        {order !== null && <ShareButton targetRef={cardRef} />}

        <NameListEditor names={names} onAdd={addName} onRemove={removeName} label={t('รายชื่อในคิว', 'Names in the queue')} />
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18, flexGrow: 1 },
  list: { gap: 8, width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rank: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: colors.ink,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.ink },
  name: { fontFamily: fonts.semibold, fontSize: fontSize.lg, color: colors.ink },
});
