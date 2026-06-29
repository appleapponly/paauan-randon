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
import mobileAds from 'react-native-google-mobile-ads';
import {
  useFonts,
  Mali_400Regular,
  Mali_500Medium,
  Mali_600SemiBold,
  Mali_700Bold,
} from '@expo-google-fonts/mali';
import { ProProvider } from '@/iap/ProProvider';
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
  if (pathname === '/' || pathname === '/index' || pathname === '/pro') return null;
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
    mobileAds()
      .initialize()
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
        <Stack.Screen name="randomizers/food-wheel" options={{ title: 'กินอะไรดี' }} />
        <Stack.Screen name="randomizers/decision-dice" options={{ title: 'ลูกเต๋าตัดสินใจ' }} />
        <Stack.Screen name="randomizers/yes-no" options={{ title: 'ใช่ / ไม่ใช่' }} />
        <Stack.Screen name="randomizers/coin" options={{ title: 'หัว / ก้อย' }} />
        <Stack.Screen name="randomizers/who-gets-it" options={{ title: 'ใครโดน' }} />
        <Stack.Screen name="randomizers/charades" options={{ title: 'ใบ้คำ' }} />
        <Stack.Screen name="randomizers/dare" options={{ title: 'สุ่มท้าทาย' }} />
        <Stack.Screen name="randomizers/daily-horoscope" options={{ title: 'ดวงประจำวัน' }} />
        <Stack.Screen name="randomizers/siamsi" options={{ title: 'เซียมซี' }} />
        <Stack.Screen name="randomizers/daily-fortune" options={{ title: 'ข้อคิดประจำวัน' }} />
        <Stack.Screen name="randomizers/outfit" options={{ title: 'สุ่มแต่งตัว' }} />
        <Stack.Screen name="randomizers/travel" options={{ title: 'สุ่มที่เที่ยว' }} />
        <Stack.Screen name="randomizers/lucky-draw" options={{ title: 'จับฉลากรายชื่อ' }} />
        <Stack.Screen name="randomizers/teams" options={{ title: 'แบ่งทีม' }} />
        <Stack.Screen name="randomizers/queue" options={{ title: 'สุ่มลำดับคิว' }} />
            <Stack.Screen name="randomizers/number" options={{ title: 'สุ่มตัวเลข' }} />
            <Stack.Screen name="randomizers/color" options={{ title: 'สุ่มสี' }} />
            <Stack.Screen name="pro" options={{ title: 'หลานรักป้า ❤️' }} />
          </Stack>
          <GlobalBottomBanner />
        </View>
      </ProProvider>
    </GestureHandlerRootView>
  );
}
