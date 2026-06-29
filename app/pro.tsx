/**
 * ❤️ หลานรักป้า — หน้าซื้อ Pro (ปิดโฆษณา สนับสนุนป้า)
 * - 2 แพ็กเกจ: รายปี 49 บาท / รายเดือน 7 บาท
 * - ราคาโชว์จาก Play จริง ถ้าดึงไม่ได้ใช้ราคาสำรอง (ใช้ || ไม่ใช่ ?? เพราะ "" ไม่ใช่ null)
 */
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePro } from '@/iap/ProProvider';
import { useProStore } from '@/store/useProStore';
import { PRO_SKUS, PRO_FALLBACK_PRICE } from '@/ads/adConfig';
import { paaUanPoses } from '@/theme/assets';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';

export default function ProScreen() {
  const { prices, buy, restore } = usePro();
  const isPro = useProStore((s) => s.isPro);

  const yearly = prices[PRO_SKUS.yearly] || PRO_FALLBACK_PRICE.yearly;
  const monthly = prices[PRO_SKUS.monthly] || PRO_FALLBACK_PRICE.monthly;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={paaUanPoses.point} style={styles.paa} resizeMode="contain" />

        <Text style={styles.title}>หลานรักป้า ❤️</Text>
        <Text style={styles.subtitle}>
          ป้าทำแอปนี้แจกฟรีจากใจ ถ้าหลานสนับสนุนป้านิดหน่อย
          ป้าจะ <Text style={styles.bold}>ปิดโฆษณาให้ทั้งแอป</Text> เลยจ้ะ
        </Text>

        {isPro ? (
          <View style={styles.proBox}>
            <Text style={styles.proBoxText}>
              หลานเป็นสมาชิก Pro แล้วจ้ะ ❤️{'\n'}ขอบใจที่รักป้านะ ไม่มีโฆษณากวนใจอีกแล้ว
            </Text>
          </View>
        ) : (
          <>
            {/* รายปี — คุ้มสุด */}
            <Pressable style={[styles.plan, styles.planBest]} onPress={() => buy(PRO_SKUS.yearly)}>
              <View style={styles.bestTag}>
                <Text style={styles.bestTagText}>คุ้มสุด</Text>
              </View>
              <Text style={styles.planName}>รายปี</Text>
              <Text style={styles.planPrice}>{yearly}</Text>
              <Text style={styles.planNote}>ตกเดือนละ ~4 บาท ถูกกว่าค่าขนมป้าอีก!</Text>
            </Pressable>

            {/* รายเดือน */}
            <Pressable style={styles.plan} onPress={() => buy(PRO_SKUS.monthly)}>
              <Text style={styles.planName}>รายเดือน</Text>
              <Text style={styles.planPrice}>{monthly}</Text>
              <Text style={styles.planNote}>จ่ายทีละเดือน ยกเลิกเมื่อไรก็ได้</Text>
            </Pressable>

            <Pressable style={styles.restore} onPress={restore}>
              <Text style={styles.restoreText}>เคยซื้อแล้ว? กดกู้คืนสิทธิ์</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.fine}>
          เป็นการสมัครสมาชิกแบบต่ออายุอัตโนมัติผ่าน Google Play ยกเลิกได้ตลอดเวลาในแอป Play Store
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 22, gap: 14, alignItems: 'stretch' },
  paa: { width: 120, height: 134, alignSelf: 'center' },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.wine,
    textAlign: 'center',
    lineHeight: 44,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 28,
  },
  bold: { fontFamily: fonts.bold, color: colors.wine },
  plan: {
    ...cartoonBox(colors.white, 3),
    padding: 18,
    alignItems: 'center',
    gap: 4,
  },
  planBest: {
    borderColor: colors.wine,
    backgroundColor: '#FFF3F8',
  },
  bestTag: {
    position: 'absolute',
    top: -12,
    backgroundColor: colors.wine,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  bestTagText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xs,
    color: colors.white,
  },
  planName: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
    marginTop: 4,
  },
  planPrice: {
    fontFamily: fonts.bold,
    fontSize: 30,
    lineHeight: 42,
    color: colors.wine,
  },
  planNote: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.muted,
    textAlign: 'center',
  },
  restore: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  restoreText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.sm,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  proBox: {
    ...cartoonBox(colors.white, 3),
    borderColor: colors.wine,
    padding: 20,
  },
  proBoxText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.wine,
    textAlign: 'center',
    lineHeight: 30,
  },
  fine: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});
