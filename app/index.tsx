/**
 * 🏠 หน้าหลัก — โฉมใหม่ตามดีไซน์ "ป้าอ้วนสุ่มให้!"
 * - Hero ชมพู: ชื่อแอป + บับเบิลทักทาย + รูปป้าชี้นิ้วล้นกรอบมุมขวาล่าง
 * - แต่ละหมวด: ป้ายพิลล์สีประจำหมวด + ตารางการ์ด 2 คอลัมน์ (อิโมจิใหญ่)
 */
import { useMemo, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/data/categories';
import { openingLines, pickLine } from '@/data/paaUanLines';
import { RandomizerCard } from '@/components/RandomizerCard';
import { RubikBoard } from '@/components/RubikBoard';
import { SiamsiTube } from '@/components/SiamsiTube';
import { AdBanner } from '@/ads/AdBanner';
import { useProStore } from '@/store/useProStore';
import { paaUanPoses } from '@/theme/assets';
import { t } from '@/i18n';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { textOn } from '@/theme/styles';

// อิโมจิประจำหมวด (โชว์บนป้ายพิลล์)
const CATEGORY_TAG: Record<string, string> = {
  decide: '🤔',
  fortune: '🔮',
  health: '💪',
  fun: '🎉',
  group: '👯',
  study: '🎓',
  basic: '🧰',
};

export default function HomeScreen() {
  const router = useRouter();
  const isPro = useProStore((s) => s.isPro);
  const setPro = useProStore((s) => s.setPro);

  // 🕹️ ปุ่มลับ: แตะแถบ "ป้าอ้วนรอสุ่มให้..." 5 ครั้ง → กลับ Free mode (ปิดสถานะ Pro ในเครื่อง ไว้ทดสอบโฆษณา)
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function secretTap() {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => (tapCount.current = 0), 1500); // ต้องแตะรัว ๆ ภายใน 1.5 วิ
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setPro(false);
      Alert.alert(
        'Free mode',
        t('กลับสู่โหมดฟรีแล้วจ้ะ (โฆษณากลับมาแสดง)', 'Back to free mode, sweetie (ads are back on)')
      );
    }
  }

  // สุ่มคำทักทายครั้งเดียวตอนเปิดหน้า (useMemo กันสุ่มใหม่ทุกครั้งที่ render)
  const greeting = useMemo(() => pickLine(openingLines), []);

  // นิ้วแตะรูบิคอยู่ → ล็อกไม่ให้จอเลื่อน (จะได้บิดแนวตั้งได้ ไม่แย่งกับ ScrollView)
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {/* ===== Hero ชมพู ===== */}
        <SafeAreaView edges={['top']} style={styles.hero}>
          <Text style={styles.appName}>{t('ป้าอ้วน\nสุ่มให้!', "Auntie's\nRandom!")}</Text>

          <View style={styles.heroBubble}>
            <Text style={styles.heroBubbleText}>{greeting.text}</Text>
            <View style={styles.bubbleTailBorder} />
            <View style={styles.bubbleTailFill} />
          </View>

          <Image source={paaUanPoses.point} style={styles.heroMascot} resizeMode="contain" />
        </SafeAreaView>

        {/* ===== หมวดต่าง ๆ ===== */}
        <View style={styles.body}>
          {/* 🧩 รูบิคทางลัด — บิดเลือกหน้าสุ่มโปรดมาเก็บไว้ (จำตำแหน่งแม้ปิดแอป) */}
          <View style={styles.rubikSection}>
            <View style={[styles.catPill, { backgroundColor: colors.ink }]}>
              <Text style={[styles.catPillText, { color: colors.white }]}>
                {t('🧩 รูบิคของฉัน', '🧩 My Cube')}
              </Text>
            </View>
            <RubikBoard onTouchingChange={(touching) => setScrollEnabled(!touching)} />
            <Text style={styles.rubikHint}>
              {t(
                'ปัดขึ้นลง-ซ้ายขวาเพื่อบิดเปลี่ยนหน้า · แตะหน้าไหนก็ได้ (รวมด้านบน/ขวา) เพื่อเข้าสุ่ม',
                'Swipe any direction to twist · tap any face (top/right too) to open'
              )}
            </Text>
          </View>

          {CATEGORIES.map((cat, ci) => (
            <View key={cat.id}>
              <View style={styles.category}>
                <View style={[styles.catPill, { backgroundColor: cat.color }]}>
                  <Text style={[styles.catPillText, { color: textOn(cat.color) }]}>
                    {CATEGORY_TAG[cat.id] ?? '✨'} {cat.title}
                  </Text>
                </View>

                <View style={styles.grid}>
                  {cat.items.map((item) => (
                    <View key={item.id} style={styles.gridCell}>
                      <RandomizerCard
                        item={item}
                        accent={cat.color}
                        onPress={() => router.push(item.route as never)}
                        iconOverride={item.id === 'siamsi' ? <SiamsiTube size={40} /> : undefined}
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* แบนเนอร์โฆษณา คั่นระหว่างหมวด (ไม่ใส่ใต้หมวดสุดท้าย) */}
              {ci < CATEGORIES.length - 1 && <AdBanner style={styles.homeBanner} />}
            </View>
          ))}

          {/* ปุ่มสนับสนุนป้า — ซื้อ Pro ปิดโฆษณา */}
          {isPro ? (
            <View style={styles.proThanks}>
              <Text style={styles.proThanksText}>
                {t('ขอบใจที่รักป้านะ หลานป้าคนเก่ง ❤️', 'Thanks for loving Auntie, sweetie ❤️')}
              </Text>
            </View>
          ) : (
            <Pressable style={styles.proBtn} onPress={() => router.push('/pro' as never)}>
              <Text style={styles.proBtnText}>
                {t('❤️ หลานรักป้า — สนับสนุนป้า ปิดโฆษณา', '❤️ Love Auntie — support & remove ads')}
              </Text>
            </Pressable>
          )}

          <Pressable onPress={secretTap}>
            <Text style={styles.footer}>
              {t('ป้าอ้วนรอสุ่มให้อยู่นะจ๊ะ 👵', "Auntie's always here to spin for you 👵")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pink },
  scroll: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 24 },

  // ----- Hero -----
  hero: {
    backgroundColor: colors.pink,
    paddingHorizontal: 18,
    paddingBottom: 22,
    minHeight: 188,
    borderBottomWidth: 3,
    borderBottomColor: colors.ink,
    position: 'relative',
    overflow: 'hidden',
  },
  appName: {
    fontFamily: fonts.bold,
    fontSize: 30,
    lineHeight: 44, // เผื่อช่องให้สระบน/ล่างภาษาไทย + เงา ไม่ถูกตัดขอบ
    color: colors.white,
    marginTop: 6,
    paddingTop: 4,
    paddingBottom: 4,
    includeFontPadding: true, // Android: กันตัดหัว-หางตัวอักษร
    textShadowColor: colors.ink,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  heroBubble: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12,
    width: 210,
  },
  heroBubbleText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.sm,
    color: colors.ink,
    lineHeight: 26, // เผื่อสระ/วรรณยุกต์บน (เช่น "นี่") ไม่ถูกตัด
  },
  // หางบับเบิลชี้ไป "ทางขวา" หาตัวป้า (มุมขวาล่าง) เหมือนป้าพูด
  bubbleTailBorder: {
    position: 'absolute',
    right: -14,
    top: 18,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.ink,
  },
  bubbleTailFill: {
    position: 'absolute',
    right: -9,
    top: 18,
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
  },
  heroMascot: {
    position: 'absolute',
    right: 0,
    bottom: -6,
    width: 150,
    height: 168,
  },

  // ----- Body / categories -----
  body: { paddingHorizontal: 18, paddingTop: 18 },
  category: { marginBottom: 18 },
  catPill: {
    alignSelf: 'flex-start',
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginBottom: 12,
    transform: [{ rotate: '-2deg' }],
    shadowColor: colors.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  catPillText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridCell: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  footer: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  homeBanner: {
    marginBottom: 18,
  },
  rubikSection: {
    marginBottom: 18,
    gap: 4,
  },
  rubikHint: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  proBtn: {
    backgroundColor: colors.wine,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
    shadowColor: colors.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  proBtnText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 26,
  },
  proThanks: {
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.wine,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  proThanksText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.wine,
    textAlign: 'center',
    lineHeight: 26,
  },
});
