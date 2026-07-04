/**
 * 👥 แบ่งทีม — ใส่รายชื่อ + จำนวนทีม แล้วแบ่งอัตโนมัติแบบสุ่มยุติธรรม
 */
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

const TEAM_COLORS = [colors.pink, colors.gold, colors.jade, colors.blue, colors.purple];

export default function TeamsScreen() {
  const names = useNamesStore((s) => s.names);
  const addName = useNamesStore((s) => s.addName);
  const removeName = useNamesStore((s) => s.removeName);

  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][] | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (round > 0) scrollRef.current?.scrollToEnd({ animated: true });
  }, [round]);

  function split() {
    if (names.length < teamCount) return;
    const shuffled = shuffle(names);
    const buckets: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => buckets[i % teamCount].push(name));
    const line = pickLine(groupLines);
    setTeams(buckets);
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {teams === null ? (
          <PaaUanBubble text={t('ใส่ชื่อ เลือกจำนวนทีม เดี๋ยวป้าแบ่งให้!', 'Add names, pick the number of teams, and Auntie will split them!')} mood="happy" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="clap">
              <View style={styles.teamsWrap}>
                {teams.map((team, i) => (
                  <View
                    key={i}
                    style={[styles.team, { borderColor: colors.ink, backgroundColor: colors.white }]}
                  >
                    <View style={[styles.teamHead, { backgroundColor: TEAM_COLORS[i % TEAM_COLORS.length] }]}>
                      <Text style={styles.teamHeadText}>{t('ทีม ', 'Team ')}{i + 1}</Text>
                    </View>
                    <Text style={styles.teamMembers}>{team.join(', ')}</Text>
                  </View>
                ))}
              </View>
            </CaptureCard>
          </Animated.View>
        )}

        {/* เลือกจำนวนทีม */}
        <View style={styles.counterRow}>
          <Text style={styles.counterLabel}>{t('จำนวนทีม', 'Number of teams')}</Text>
          <View style={styles.counter}>
            <Pressable style={styles.counterBtn} onPress={() => setTeamCount((c) => Math.max(2, c - 1))}>
              <Text style={styles.counterBtnText}>−</Text>
            </Pressable>
            <Text style={styles.counterValue}>{teamCount}</Text>
            <Pressable style={styles.counterBtn} onPress={() => setTeamCount((c) => Math.min(8, c + 1))}>
              <Text style={styles.counterBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        <BigButton
          label={teams === null ? t('แบ่งทีมเลย!', 'Split teams!') : t('แบ่งใหม่', 'Reshuffle')}
          onPress={split}
          disabled={names.length < teamCount}
        />

        {teams !== null && <ShareButton targetRef={cardRef} />}

        <NameListEditor names={names} onAdd={addName} onRemove={removeName} label={t('รายชื่อสมาชิก', 'Member names')} />
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18, flexGrow: 1 },
  teamsWrap: { gap: 10, width: '100%' },
  team: {
    borderWidth: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  teamHead: { paddingVertical: 5, paddingHorizontal: 12 },
  teamHeadText: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.white },
  teamMembers: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    padding: 12,
    lineHeight: 24,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterLabel: { fontFamily: fonts.semibold, fontSize: fontSize.md, color: colors.ink },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: colors.ink,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: { fontFamily: fonts.bold, fontSize: 24, color: colors.ink },
  counterValue: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.ink, minWidth: 30, textAlign: 'center' },
});
