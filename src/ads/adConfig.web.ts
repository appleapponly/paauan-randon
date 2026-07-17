/**
 * TEMP web stub (for local screenshot generation only) — AD_UNITS not needed on web
 * (AdBanner/interstitial are stubbed to no-ops), but PRO_SKUS etc. are still used
 * by ProProvider.tsx so they must stay identical to adConfig.ts.
 */
import { t } from '@/i18n';

export const AD_UNITS = { banner: '', interstitial: '' };

export const PRO_SKUS = {
  yearly: 'paauan_pro_yearly',
  monthly: 'paauan_pro_monthly',
};
export const PRO_SKU_LIST = [PRO_SKUS.yearly, PRO_SKUS.monthly];

export const PRO_LIFETIME_SKU = 'paauan_pro_lifetime';

export const PRO_FALLBACK_PRICE = {
  yearly: t('฿49 / ปี', '$4.99 / yr'),
  monthly: t('฿7 / เดือน', '$0.99 / mo'),
  lifetime: t('฿199 ครั้งเดียว', '$19.99 one-time'),
};

export const INTERSTITIAL_MIN = 2;
export const INTERSTITIAL_MAX = 4;
