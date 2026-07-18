/**
 * 🎨 สุ่มสี — สุ่มสีพร้อมรหัส HEX + ปุ่มคัดลอก
 */
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenSafe } from '@/components/ScreenSafe';
import Animated, { BounceIn } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { colorLines, pickLine, PaaUanMood } from '@/data/paaUanLines';
import { randomInt } from '@/utils/random';
import { PaaUanBubble } from '@/components/PaaUanBubble';
import { BigButton } from '@/components/BigButton';
import { CaptureCard } from '@/components/CaptureCard';
import { ShareButton } from '@/components/ShareButton';
import { ConfettiBurst } from '@/components/ConfettiBurst';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import { t } from '@/i18n';

function randomHex(): string {
  const n = randomInt(0, 0xffffff);
  return '#' + n.toString(16).padStart(6, '0').toUpperCase();
}

export default function ColorScreen() {
  const cardRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const viewportH = useRef(0);
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
    Alert.alert(t('คัดลอกแล้ว', 'Copied'), t(`${hex} อยู่ในคลิปบอร์ดแล้วจ้า`, `${hex} is on your clipboard!`));
  }

  return (
    <ScreenSafe style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; }}
      >
        {hex === null ? (
          <PaaUanBubble text={t('กดสุ่มสี เดี๋ยวป้าจัดสีสวย ๆ ให้', "Tap for a random color — Auntie's got a pretty one!")} mood="happy" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood}>
              <View style={[styles.swatch, { backgroundColor: hex }]} />
              <Text style={styles.hex}>{hex}</Text>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
        )}

        {hex !== null && (
          <Pressable style={styles.copyBtn} onPress={copy}>
            <Text style={styles.copyText}>{t('📋 คัดลอก ', '📋 Copy ')}{hex}</Text>
          </Pressable>
        )}

        <BigButton label={hex === null ? t('สุ่มสีเลย!', 'Random color!') : t('สุ่มใหม่', 'Again')} onPress={roll} />

        <View
          collapsable={false}
          onLayout={(e) => {
            if (hex === null) return;
            const { y, height } = e.nativeEvent.layout;
            const target = y + height - viewportH.current;
            if (target > 0) scrollRef.current?.scrollTo({ y: target, animated: true });
          }}
        >
          {hex !== null && <ShareButton targetRef={cardRef} />}
        </View>
      </ScrollView>
    </ScreenSafe>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 18, flexGrow: 1 },
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
