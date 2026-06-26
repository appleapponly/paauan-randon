/**
 * 📤 ShareButton — ปุ่ม "แชร์ผล" แคปการ์ด (CaptureCard) เป็นรูป PNG แล้วเปิดเมนูแชร์
 * ผู้ใช้เลือกส่งเข้า LINE / โซเชียลได้เลย (react-native-view-shot + expo-sharing)
 */
import { useState, RefObject } from 'react';
import { Alert, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { BigButton } from './BigButton';
import { colors } from '@/theme/colors';

interface Props {
  /** ref ของ View ที่จะแคป (ชี้ไปที่ CaptureCard) */
  targetRef: RefObject<View | null>;
}

export function ShareButton({ targetRef }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleShare() {
    if (busy) return;
    try {
      setBusy(true);
      // แคป View เป็นไฟล์รูปชั่วคราว
      const uri = await captureRef(targetRef, { format: 'png', quality: 1 });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('แชร์ไม่ได้', 'เครื่องนี้ยังแชร์ไฟล์ไม่ได้จ้า');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'แชร์ผลจากป้าอ้วน',
      });
    } catch (e) {
      Alert.alert('อุ๊ย', 'แชร์ไม่สำเร็จ ลองใหม่อีกทีนะลูก');
    } finally {
      setBusy(false);
    }
  }

  return (
    <BigButton
      label={busy ? 'กำลังทำรูป...' : '📤 แชร์ผลให้เพื่อน'}
      onPress={handleShare}
      color={colors.jade}
      disabled={busy}
    />
  );
}
