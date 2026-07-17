/**
 * 🌳 Root Layout — กรอบนอกสุดของทั้งแอป (Expo Router)
 * หน้าที่:
 *  1) โหลดฟอนต์ Mali ก่อน แล้วค่อยโชว์แอป (กันตัวอักษรกระพริบ)
 *  2) ตั้งหน้าตา header ของทุกหน้าให้เป็นธีมเดียวกัน
 *  3) ห่อด้วย GestureHandlerRootView (จำเป็นสำหรับ reanimated/gesture)
 */
import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { initMobileAds } from '@/ads/mobileAdsInit';
import {
  useFonts,
  Mali_400Regular,
  Mali_500Medium,
  Mali_600SemiBold,
  Mali_700Bold,
} from '@expo-google-fonts/mali';
import { ProProvider } from '@/iap/ProProvider';
import { t } from '@/i18n';
import { AdBanner } from '@/ads/AdBanner';
import { initInterstitial } from '@/ads/interstitial';
import { checkForUpdate } from '@/update/checkForUpdate';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

// กันไม่ให้ splash หายไปก่อนฟอนต์โหลดเสร็จ
SplashScreen.preventAutoHideAsync();

// แบนเนอร์ล่างสุด — โผล่ทุกหน้ายกเว้นหน้าหลัก (หน้าหลักมีแบนเนอร์คั่นหมวดของตัวเอง)
function GlobalBottomBanner() {
  const pathname = usePathname();
  // ซ่อนบนหน้าหลัก (มีแบนเนอร์คั่นหมวดเอง) และหน้าซื้อ Pro (โชว์โฆษณาตรงนั้นแปลก)
  if (pathname === '/' || pathname === '/index' || pathname === '/pro' || pathname === '/timer')
    return null;
  return <AdBanner />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Mali_400Regular,
    Mali_500Medium,
    Mali_600SemiBold,
    Mali_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // เริ่มระบบโฆษณา + เช็คอัปเดต ครั้งเดียวตอนเปิดแอป
  useEffect(() => {
    initMobileAds()
      .then(() => initInterstitial())
      .catch(() => {});
    checkForUpdate();
  }, []);

  if (!fontsLoaded) return null; // ยังโหลดฟอนต์ไม่เสร็จ — โชว์ splash ต่อ

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProProvider>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.pink },
              headerTintColor: colors.white,
              headerTitleStyle: { fontFamily: fonts.bold, fontSize: 20 },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.cream },
            }}
          >
        {/* หน้าหลัก ซ่อน header เพราะมีหัวเรื่องของตัวเอง */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="randomizers/food-wheel" options={{ title: t('กินอะไรดี', 'What to Eat') }} />
        <Stack.Screen name="randomizers/decision-dice" options={{ title: t('ลูกเต๋าตัดสินใจ', 'Decision Dice') }} />
        <Stack.Screen name="randomizers/yes-no" options={{ title: t('ใช่ / ไม่ใช่', 'Yes or No') }} />
        <Stack.Screen name="randomizers/coin" options={{ title: t('หัว / ก้อย', 'Heads or Tails') }} />
        <Stack.Screen name="randomizers/who-gets-it" options={{ title: t('ใครโดน', "Who's It?") }} />
        <Stack.Screen name="randomizers/charades" options={{ title: t('ใบ้คำ', 'Charades') }} />
        <Stack.Screen name="randomizers/dare" options={{ title: t('สุ่มท้าทาย', 'Dare Me') }} />
        <Stack.Screen name="randomizers/daily-horoscope" options={{ title: t('ดวงประจำวัน', 'Daily Horoscope') }} />
        <Stack.Screen name="randomizers/siamsi" options={{ title: t('เซียมซี', 'Fortune Sticks') }} />
        <Stack.Screen name="randomizers/daily-fortune" options={{ title: t('ข้อคิดประจำวัน', 'Daily Wisdom') }} />
        <Stack.Screen name="randomizers/outfit" options={{ title: t('สุ่มแต่งตัว', 'Outfit Picker') }} />
        <Stack.Screen name="randomizers/travel" options={{ title: t('สุ่มที่เที่ยว', 'Travel Picker') }} />
        <Stack.Screen name="randomizers/lucky-draw" options={{ title: t('จับฉลากรายชื่อ', 'Lucky Draw') }} />
        <Stack.Screen name="randomizers/teams" options={{ title: t('แบ่งทีม', 'Team Split') }} />
        <Stack.Screen name="randomizers/queue" options={{ title: t('สุ่มลำดับคิว', 'Queue Order') }} />
            <Stack.Screen name="randomizers/number" options={{ title: t('สุ่มตัวเลข', 'Random Number') }} />
            <Stack.Screen name="randomizers/color" options={{ title: t('สุ่มสี', 'Random Color') }} />
            <Stack.Screen name="randomizers/custom-wheel" options={{ title: t('วงล้อของฉัน 🎡', 'My Wheel 🎡') }} />
            <Stack.Screen name="randomizers/exercise" options={{ title: t('สุ่มออกกำลังกาย', 'Workout Roulette') }} />
            <Stack.Screen name="randomizers/clean-food" options={{ title: t('สุ่มเมนูคลีน', 'Clean Eats') }} />
            <Stack.Screen name="randomizers/study" options={{ title: t('สุ่มการเรียน', 'Study Mission') }} />
            <Stack.Screen name="randomizers/break-time" options={{ title: t('สุ่มเวลาพัก', 'Break Time') }} />
            <Stack.Screen name="timer" options={{ headerShown: false }} />
            <Stack.Screen name="pro" options={{ title: t('หลานรักป้า ❤️', 'Love Auntie ❤️') }} />
          </Stack>
          <GlobalBottomBanner />
        </View>
      </ProProvider>
    </GestureHandlerRootView>
  );
}
