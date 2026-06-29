/**
 * 🪧 AdBanner — แบนเนอร์โฆษณา (ซ่อนอัตโนมัติถ้าเป็นสมาชิก Pro)
 * ใช้ขนaดปรับตามความกว้างจอ (ANCHORED_ADAPTIVE_BANNER) ดูพอดีทุกเครื่อง
 */
import { View, StyleSheet } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { AD_UNITS } from './adConfig';
import { useProStore } from '@/store/useProStore';

export function AdBanner({ style }: { style?: object }) {
  const isPro = useProStore((s) => s.isPro);
  if (isPro) return null;
  return (
    <View style={[styles.wrap, style]}>
      <BannerAd
        unitId={AD_UNITS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
});
