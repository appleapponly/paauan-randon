/**
 * 👥 NameListEditor — กล่องใส่/ลบรายชื่อ (ใช้ซ้ำในหมวดกลุ่มและ "ใครโดน")
 * แสดงช่องพิมพ์ + ปุ่มเพิ่ม + ชิปรายชื่อพร้อมปุ่มลบ
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { cartoonBox } from '@/theme/styles';
import { t } from '@/i18n';

interface Props {
  names: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
  label?: string;
  placeholder?: string;
}

export function NameListEditor({
  names,
  onAdd,
  onRemove,
  label = t('รายชื่อ', 'Names'),
  placeholder = t('พิมพ์ชื่อ...', 'Type a name...'),
}: Props) {
  const [text, setText] = useState('');

  function handleAdd() {
    onAdd(text);
    setText('');
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>
        {label} ({names.length})
      </Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>{t('เพิ่ม', 'Add')}</Text>
        </Pressable>
      </View>

      {names.length === 0 ? (
        <Text style={styles.empty}>
          {t('ยังไม่มีชื่อ ใส่ชื่อเพื่อน ๆ ก่อนนะจ๊ะ', 'No names yet — add your friends first, sweetie!')}
        </Text>
      ) : (
        <View style={styles.chips}>
          {names.map((name) => (
            <View key={name} style={styles.chip}>
              <Text style={styles.chipText}>{name}</Text>
              <Pressable onPress={() => onRemove(name)} hitSlop={8}>
                <Text style={styles.chipX}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    ...cartoonBox(colors.white, 4),
    padding: 16,
    gap: 14,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.ink,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 48,
    textAlignVertical: 'center', // Android: จัดข้อความกึ่งกลางแนวตั้ง ไม่ให้สระบนถูกตัด
    includeFontPadding: true,
    fontFamily: fonts.regular,
    fontSize: fontSize.md,
    color: colors.ink,
    backgroundColor: colors.cream,
  },
  addBtn: {
    backgroundColor: colors.jade,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    color: colors.white,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.ink,
  },
  chipX: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.pink,
  },
});
