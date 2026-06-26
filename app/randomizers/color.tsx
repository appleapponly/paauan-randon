/**
 * 🎨 สุ่มสี — สุ่มสีพร้อมรหัส HEX + ปุ่มคัดลอก
 */
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { colorLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { randomInt } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

function randomHex(): string {
  const n = randomInt(0, 0xffffff);
  return '#' + n.toString(16).padStart(6, '0').toUpperCase();
}

export default function ColorScreen() {
  const cardRef = useRef<View>(null);
  const [hex, setHex] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [mood, setMood] = useState<PaaUanMood>('happy');
  const [round, setRound] = useState(0);

  function roll() {
    const h = randomHex();
    const line = pickLine(colorLines, h);
    setHex(h);
    setComment(line.text);
    setMood(line.mood);
    setRound((r) => r + 1);
  }

  async function copy() {
    if (!hex) return;
    await Clipboard.setStringAsync(hex);
    Alert.alert('คัดลอกแล้ว', `${hex} อยู่ในคลิปบอร์ดแล้วจ้า`);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {hex === null ? (
          <PaaUanBubble text="กดสุ่มสี เดี๋ยวป้าจัดสีสวย ๆ ให้" mood="happy" />
        ) : (
          <Animated.View key={round} entering={ZoomIn.springify().damping(12)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood}>
              <View style={[styles.swatch, { backgroundColor: hex }]} />
              <Text style={styles.hex}>{hex}</Text>
            </CaptureCard>
          </Animated.View>
        )}

        {hex !== null && (
          <Pressable style={styles.copyBtn} onPress={copy}>
            <Text style={styles.copyText}>📋 คัดลอก {hex}</Text>
          </Pressable>
        )}

        <View style={{ height: 6 }} />

        <BigButton label={hex === null ? 'สุ่มสีเลย!' : 'สุ่มใหม่'} onPress={roll} />

        {hex !== null && <ShareButton targetRef={cardRef} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 14, flexGrow: 1 },
  swatch: {
    width: 160,
    height: 160,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.ink,
  },
  hex: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.ink,
    letterSpacing: 1,
  },
  copyBtn: {
    ...cartoonBox(colors.white, 3),
    paddingVertical: 12,
    alignItems: 'center',
  },
  copyText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.ink,
  },
});
