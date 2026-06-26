/**
 * 🏠 หน้าหลัก — โฉมใหม่ตามดีไซน์ "ป้าอ้วนสุ่มให้!"
 * - Hero ชมพู: ชื่อแอป + บับเบิลทักทาย + รูปป้าชี้นิ้วล้นกรอบมุมขวาล่าง
 * - แต่ละหมวด: ป้ายพิลล์สีประจำหมวด + ตารางการ์ด 2 คอลัมน์ (อิโมจิใหญ่)
 * - แถบล่างคงที่: 🏠 ⭐ 🕘 ⚙️ (ตอนนี้ตกแต่งไว้ก่อน)
 */
import { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/data/categories';
import { openingLines, pickLine } from '@/data/paaUanLines';
import { RandomizerCard } from '@/components/RandomizerCard';
import { paaUanPoses } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { textOn } from '@/theme/styles';

// อิโมจิประจำหมวด (โชว์บนป้ายพิลล์)
const CATEGORY_TAG: Record<string, string> = {
  decide: '🤔',
  fun: '🎉',
  group: '👯',
  basic: '🧰',
};

export default function HomeScreen() {
  const router = useRouter();

  // สุ่มคำทักทายครั้งเดียวตอนเปิดหน้า (useMemo กันสุ่มใหม่ทุกครั้งที่ render)
  const greeting = useMemo(() => pickLine(openingLines), []);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Hero ชมพู ===== */}
        <SafeAreaView edges={['top']} style={styles.hero}>
          <Text style={styles.appName}>ป้าอ้วน{'\n'}สุ่มให้!</Text>

          <View style={styles.heroBubble}>
            <Text style={styles.heroBubbleText}>{greeting.text}</Text>
            <View style={styles.bubbleTailBorder} />
            <View style={styles.bubbleTailFill} />
          </View>

          <Image source={paaUanPoses.point} style={styles.heroMascot} resizeMode="contain" />
        </SafeAreaView>

        {/* ===== หมวดต่าง ๆ ===== */}
        <View style={styles.body}>
          {CATEGORIES.map((cat) => (
            <View key={cat.id} style={styles.category}>
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
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}

          <Text style={styles.footer}>ป้าอ้วนรอสุ่มให้อยู่นะจ๊ะ 👵</Text>
        </View>
      </ScrollView>

      {/* ===== แถบล่างคงที่ ===== */}
      <View style={styles.bottomNav}>
        <Text style={styles.navIconActive}>🏠</Text>
        <Text style={styles.navIcon}>⭐</Text>
        <Text style={styles.navIcon}>🕘</Text>
        <Text style={styles.navIcon}>⚙️</Text>
      </View>
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
    lineHeight: 36,
    color: colors.white,
    marginTop: 6,
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
    lineHeight: 22,
  },
  bubbleTailBorder: {
    position: 'absolute',
    left: 28,
    bottom: -14,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.ink,
  },
  bubbleTailFill: {
    position: 'absolute',
    left: 30,
    bottom: -9,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.white,
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

  // ----- Bottom nav -----
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: colors.white,
    borderTopWidth: 3,
    borderTopColor: colors.ink,
  },
  navIconActive: { fontSize: 26 },
  navIcon: { fontSize: 26, opacity: 0.4 },
});
