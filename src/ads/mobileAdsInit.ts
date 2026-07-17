/**
 * TEMP native/web split (for local screenshot generation only).
 * Isolates the react-native-google-mobile-ads import so Metro can swap in
 * mobileAdsInit.web.ts for web bundles (the lib doesn't support web at all).
 */
import mobileAds from 'react-native-google-mobile-ads';

export function initMobileAds(): Promise<unknown> {
  return mobileAds().initialize();
}
