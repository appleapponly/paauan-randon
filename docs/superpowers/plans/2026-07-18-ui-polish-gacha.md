# UI Polish 3 ชั้น + ตู้กาชาตัวเลข — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ยกระดับ first impression + micro-interactions + ความสม่ำเสมอของแอป "ป้าอ้วนสุ่มให้/Auntie's Random" และเปลี่ยนหน้า "สุ่มตัวเลข" เป็นตู้กาชาปอง ตาม spec `docs/superpowers/specs/2026-07-18-ui-polish-gacha-design.md`

**Architecture:** แก้จุดกลาง (BigButton, SpinWheel) ให้กระจายผลทั้งแอปอัตโนมัติ + component ใหม่ 3 ตัว (`haptics` util, `ConfettiBurst`, `GachaMachine`) แล้ว rollout เชิงกลไกทีละหน้า ตู้กาชาสร้างจาก View + reanimated (ไม่ใช้ SVG — ภาษาภาพเดิมของแอปคือ View ขอบดำ+เงา ทำได้เหมือนกันและ animate ง่าย/เสี่ยงน้อยกว่า spec ที่เขียนว่า SVG — เป็น implementation detail ที่ให้ผลตาเห็นเท่ากัน)

**Tech Stack:** Expo SDK 56 / RN 0.85 / TypeScript / expo-router / react-native-reanimated v4 / expo-haptics (มีอยู่แล้วใน deps — **ห้ามเพิ่ม dependency ใหม่ใด ๆ**)

## Global Constraints

- ข้อความใหม่ทุกจุดต้องห่อ `t('ไทย', 'English')` จาก `@/i18n` (แอป 2 แบรนช์: master=thai, global=EN)
- ทำงานบน branch `master` เท่านั้น commit ทีละ task — merge เข้า `global` เฉพาะ Task 11 (**ห้ามใช้ git worktree** — workflow โปรเจกต์นี้ผูกกับไฟล์ `app.variant.json` ต่อ branch ตาม `docs/BUILD.md`)
- **ห้าม push ระหว่างทาง** — push = trigger build จริงขึ้น Play ทั้ง 2 แอป ให้ push ครั้งเดียวใน Task 11 หลังผู้ใช้ยืนยัน
- โปรเจกต์ไม่มี test framework — รอบทดสอบของทุก task คือ `npx tsc --noEmit` (ต้องว่าง) + เช็คเรนเดอร์บน expo web (`.claude/launch.json` ชื่อ `web` port 8081; ใช้ get_page_text/console เพราะ screenshot ของ browser pane ไม่เสถียร)
- บนเว็บห้าม crash: expo-haptics บน web ครอบด้วย guard `Platform.OS !== 'web'`, ConfettiBurst/GachaMachine animation ข้ามบน web (บทเรียน vault: reanimated `withTiming` ไม่ขยับจริงบน web — `SpinWheel.tsx` จึงใช้ RN Animated + JS timer อยู่แล้ว)
- ห้ามแตะการนับโฆษณา: `BigButton` เรียก `registerSpin()` อยู่แล้ว ปุ่ม/ทางกดใหม่ทุกทางที่ "นับเป็นการสุ่ม" ต้องผ่าน BigButton หรือเรียก `registerSpin()` เอง
- splash: เพิ่ม config ได้อย่างเดียว **ห้ามลบ key `image` ในภายหลัง** (บทเรียน vault: resource linking พัง)
- อ้างอิง API ตาม https://docs.expo.dev/versions/v56.0.0/ — ground truth ในโปรเจกต์: `app/timer.tsx:96` ใช้ `Haptics.notificationAsync(...)` สำเร็จอยู่แล้ว

## File Structure

| ไฟล์ | บทบาท |
|---|---|
| Create `src/utils/haptics.ts` | util สั่นกลาง 3 ฟังก์ชัน (tapLight/tick/success) — no-op บน web, ไม่มีทาง throw |
| Create `src/components/ConfettiBurst.tsx` | เศษกระดาษฉลองผล 14 ชิ้น เล่นเอง-หายเอง + สั่น success ตอน mount (null บน web) |
| Create `src/components/GachaMachine.tsx` | ตู้กาชา (View+reanimated) state ภายใน idle→spinning→ballOut, แจ้ง parent ผ่าน `onBallOpened` |
| Modify `app.json` | splash plugin options + (Task 10) version 1.1.9 |
| Modify `app/_layout.tsx` | StatusBar `dark`→`light` |
| Modify `app/index.tsx` | hero entrance (ป้า+บับเบิล) |
| Modify `src/data/categories.ts` | อิโมจิการ์ดสุ่มตัวเลข 🔢→🎰 |
| Modify `src/components/BigButton.tsx` | เรียก `tapLight()` ตอนกด |
| Modify `src/components/SpinWheel.tsx` | tick ตามจังหวะหมุน + success ตอนหยุด |
| Modify `app/randomizers/*.tsx` (22 ไฟล์) | ConfettiBurst + consistency sweep; `number.tsx` รื้อเป็นตู้กาชา |

---

### Task 1: Splash screen + Status bar

**Files:**
- Modify: `app.json` (plugins array — แถว `"expo-splash-screen"`)
- Modify: `app/_layout.tsx` (บรรทัด `<StatusBar style="dark" />`)

**Interfaces:** ไม่มี — config อย่างเดียว

- [ ] **Step 1: แก้ splash plugin ใน app.json** — แทนที่สตริง `"expo-splash-screen",` ใน plugins ด้วย:

```json
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#FFF3DD",
          "image": "./assets/splash-icon.png",
          "imageWidth": 200
        }
      ],
```

- [ ] **Step 2: แก้ StatusBar ใน app/_layout.tsx**

```tsx
        {/* พื้นที่บนสุดเป็นชมพูทุกหน้า (hero หน้า home + header หน้าอื่น) → ไอคอนขาวชัดกว่า */}
        <StatusBar style="light" />
```

- [ ] **Step 3: Verify** — Run: `npx tsc --noEmit` → ว่าง; แล้ว `npx expo config --type prebuild --json` → plugin `expo-splash-screen` ต้องมี options ครบ 3 ค่า (backgroundColor/image/imageWidth)
- [ ] **Step 4: Commit** — `git add app.json app/_layout.tsx && git commit -m "feat: ตั้งค่า splash จริง (พื้นครีม+รูปป้า) + status bar ไอคอนขาว"`

---

### Task 2: Haptics util + ฝังใน BigButton

**Files:**
- Create: `src/utils/haptics.ts`
- Modify: `src/components/BigButton.tsx`

**Interfaces:**
- Produces: `tapLight(): void`, `tick(): void`, `success(): void` — เรียกได้จากทุกที่ ปลอดภัยเสมอ (Task 3, 4, 9 ใช้ต่อ)

- [ ] **Step 1: สร้าง src/utils/haptics.ts**

```ts
/**
 * 📳 haptics — จุดรวมการสั่นทั้งแอป (expo-haptics)
 * ทุกฟังก์ชัน: no-op บน web + catch ทิ้งเสมอ → ไม่มีทางทำแอปพัง
 */
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS !== 'web';

/** สั่นเบา ๆ ตอนกดปุ่ม */
export function tapLight() {
  if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** สั่นติ๊กสั้น ๆ — จังหวะวงล้อ/ลูกบิดกาชาหมุน */
export function tick() {
  if (enabled) Haptics.selectionAsync().catch(() => {});
}

/** สั่นฉลองตอนได้ผลลัพธ์ */
export function success() {
  if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
```

- [ ] **Step 2: ฝังใน BigButton** — ใน `src/components/BigButton.tsx` เพิ่ม import และแก้ `handlePress`:

```ts
import { tapLight } from '@/utils/haptics';
```

```ts
  // กดปุ่มสุ่ม → สั่นรับนิ้ว → ทำงานปกติ → นับเพื่อเด้งโฆษณาเต็มจอ (ครบ 2-4 ครั้ง)
  function handlePress() {
    tapLight();
    onPress();
    if (countAd) registerSpin();
  }
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit` ว่าง; เปิด web preview → หน้า home กดการ์ดเข้าหน้า yes-no กดปุ่มสุ่ม → ไม่มี error ใน console (haptic เป็น no-op บนเว็บ)
- [ ] **Step 4: Commit** — `git add src/utils/haptics.ts src/components/BigButton.tsx && git commit -m "feat: haptic util กลาง + สั่นเบาทุกปุ่ม BigButton"`

---

### Task 3: SpinWheel สั่นติ๊กตามจังหวะหมุน

**Files:**
- Modify: `src/components/SpinWheel.tsx`

**Interfaces:**
- Consumes: `tick()`, `success()` จาก `@/utils/haptics`

- [ ] **Step 1: เพิ่ม tick schedule ใน spin()** — วงล้อใช้ `Animated.timing` + `Easing.out(Easing.cubic)` duration `SPIN_DURATION` (3500ms) และส่งผลด้วย JS timer อยู่แล้ว → ใช้ JS timer ชุดเดียวกันยิง tick ตาม "ระยะทางหมุนเท่า ๆ กัน" (ผกผัน easing: p = 1-(1-t)³ ⇒ t = 1-∛(1-p)) จะได้ติ๊กถี่ตอนแรก ห่างลงตอนท้าย เหมือนตู้จริง

แก้ `src/components/SpinWheel.tsx`: เพิ่ม import + ref + ฟังก์ชันเคลียร์ + ตาราง tick:

```ts
import { tick, success } from '@/utils/haptics';
```

ใต้ `const settleTimer = ...` เพิ่ม:

```ts
    const tickTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

    function clearTicks() {
      tickTimers.current.forEach(clearTimeout);
      tickTimers.current = [];
    }
```

ใน cleanup effect (unmount) เพิ่ม `clearTicks();`:

```ts
    useEffect(() => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      clearTicks();
    }, []);
```

ใน `spin:` หลัง `onStart?.();` เพิ่ม:

```ts
        // สั่นติ๊กตามจังหวะวงล้อ: แบ่งระยะหมุนเท่า ๆ กัน 16 ช่วง แล้วแปลงกลับเป็น "เวลา"
        // ด้วยผกผันของ Easing.out(cubic) → ติ๊กถี่ตอนออกตัว ค่อย ๆ ห่างตอนใกล้หยุด
        clearTicks();
        const TICKS = 16;
        for (let k = 1; k <= TICKS; k++) {
          const p = k / TICKS;
          const tAt = 1 - Math.cbrt(1 - p);
          tickTimers.current.push(setTimeout(tick, tAt * SPIN_DURATION));
        }
```

และใน settle timer เดิม เพิ่ม `success();` ก่อน `onResult(...)`:

```ts
        settleTimer.current = setTimeout(() => {
          settleTimer.current = null;
          success();
          onResult(items[index], index);
        }, SPIN_DURATION + 60);
```

- [ ] **Step 2: Verify** — `npx tsc --noEmit` ว่าง; web preview เปิด `/randomizers/food-wheel` กดหมุน → วงล้อหมุน+ได้ผลปกติ ไม่มี console error (tick เป็น no-op บนเว็บ)
- [ ] **Step 3: Commit** — `git add src/components/SpinWheel.tsx && git commit -m "feat: วงล้อสั่นติ๊กตามจังหวะหมุน + สั่นฉลองตอนหยุด"`

---

### Task 4: ConfettiBurst component + ติดตั้งหน้าแรกที่ number.tsx (reference)

**Files:**
- Create: `src/components/ConfettiBurst.tsx`
- Modify: `app/randomizers/number.tsx`

**Interfaces:**
- Produces: `<ConfettiBurst />` — วางใน View ที่ `position:'relative'` ครอบการ์ดผล เล่นเอง ~900ms + สั่น `success()` ตอน mount; ใช้ `key={round}` ให้เล่นซ้ำทุกผลใหม่; บน web คืน null (Task 6, 9 ใช้ pattern เดียวกันนี้)

- [ ] **Step 1: สร้าง src/components/ConfettiBurst.tsx**

```tsx
/**
 * 🎊 ConfettiBurst — เศษกระดาษสีธีมพุ่งฉลองผลลัพธ์ แล้วจางหายเอง (~900ms)
 * วิธีใช้: วางเป็นลูกของ View ที่ครอบการ์ดผล (ต้องไม่ใช่ position:static) + key={round}
 * mount แล้วสั่น success() ให้เอง — บน web คืน null (reanimated withTiming ไม่ขยับบนเว็บ)
 */
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { success } from '@/utils/haptics';

const PIECE_COLORS = [colors.pink, colors.gold, colors.jade, colors.blue, colors.purple];
const PIECES = 14;

function Piece({ index }: { index: number }) {
  const p = useSharedValue(0);
  // สุ่มทิศ/ระยะ/หมุน ครั้งเดียวต่อชิ้น (useRef กันสุ่มใหม่ทุก render)
  const cfg = useRef({
    angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2, // พัดขึ้นด้านบน
    dist: 90 + Math.random() * 70,
    spin: (Math.random() - 0.5) * 720,
    delay: Math.random() * 120,
    color: PIECE_COLORS[index % PIECE_COLORS.length],
    w: 8 + Math.random() * 6,
  }).current;

  useEffect(() => {
    p.value = withDelay(
      cfg.delay,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) })
    );
  }, [cfg, p]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - p.value,
    transform: [
      { translateX: Math.cos(cfg.angle) * cfg.dist * p.value },
      // แรงโน้มถ่วงเบา ๆ ให้โค้งตกธรรมชาติ
      { translateY: Math.sin(cfg.angle) * cfg.dist * p.value + 60 * p.value * p.value },
      { rotate: `${cfg.spin * p.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: '50%',
          top: '35%',
          width: cfg.w,
          height: cfg.w * 0.6,
          borderRadius: 2,
          backgroundColor: cfg.color,
        },
        style,
      ]}
    />
  );
}

export function ConfettiBurst() {
  useEffect(() => {
    success();
  }, []);

  if (Platform.OS === 'web') return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: PIECES }, (_, i) => (
        <Piece key={i} index={i} />
      ))}
    </View>
  );
}
```

- [ ] **Step 2: ติดตั้งใน number.tsx (pattern อ้างอิงของทุกหน้า)** — การ์ดผลอยู่ใน `<Animated.View key={round} entering={BounceIn.duration(600)}>` อยู่แล้ว เพิ่ม ConfettiBurst เป็น "ลูกคนสุดท้าย" ของ Animated.View นั้น (อยู่นอก CaptureCard → ไม่ติดไปในรูปแชร์):

```tsx
import { ConfettiBurst } from '@/components/ConfettiBurst';
```

```tsx
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood}>
              <Text style={styles.number}>{result}</Text>
              <Text style={styles.range}>{t('จากช่วง ', 'from ')}{min} – {max}</Text>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit` ว่าง; web preview `/randomizers/number` กดสุ่ม → ผลขึ้นปกติ ไม่ crash (confetti = null บนเว็บ ตั้งใจ)
- [ ] **Step 4: Commit** — `git add src/components/ConfettiBurst.tsx app/randomizers/number.tsx && git commit -m "feat: ConfettiBurst ฉลองผลลัพธ์ + ติดตั้งหน้าสุ่มตัวเลข"`

---

### Task 5: Home hero entrance

**Files:**
- Modify: `app/index.tsx`

**Interfaces:** ไม่มี

- [ ] **Step 1: ป้าเด้งเข้า + บับเบิล pop** — เพิ่ม import:

```tsx
import Animated, { SlideInRight, ZoomIn } from 'react-native-reanimated';
```

แก้ hero: ห่อบับเบิลกับรูปป้า (ย้าย style ตำแหน่งไปไว้ที่ Animated wrapper แทน):

```tsx
          <Animated.View entering={ZoomIn.delay(250).duration(250)} style={styles.heroBubble}>
            <Text style={styles.heroBubbleText}>{greeting.text}</Text>
            <View style={styles.bubbleTailBorder} />
            <View style={styles.bubbleTailFill} />
          </Animated.View>

          <Animated.View
            entering={SlideInRight.springify().damping(15)}
            style={styles.heroMascot}
          >
            <Image
              source={paaUanPoses.point}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </Animated.View>
```

(สไตล์ `heroBubble`/`heroMascot` เดิมใช้ต่อได้เลย — เปลี่ยนเฉพาะ element ที่ถือ style จาก `View`/`Image` เป็น `Animated.View`)

- [ ] **Step 2: Verify** — `npx tsc --noEmit` ว่าง; web preview หน้า home → hero แสดงป้า+บับเบิลครบ (จะเห็น animation หรือไม่บนเว็บไม่ถือเป็นเกณฑ์ เกณฑ์คือไม่พัง layout ไม่เพี้ยน)
- [ ] **Step 3: Commit** — `git add app/index.tsx && git commit -m "feat: ป้าเด้งเข้า hero + บับเบิลทักทาย pop ตอนเปิดแอป"`

---

### Task 6: ConfettiBurst rollout อีก 21 หน้า

**Files:**
- Modify: `app/randomizers/*.tsx` ทุกไฟล์ยกเว้น `number.tsx` (ทำแล้ว Task 4): break-time, charades, clean-food, coin, color, custom-wheel, daily-fortune, daily-horoscope, dare, decision-dice, exercise, food-wheel, lucky-draw, outfit, queue, siamsi, study, teams, travel, who-gets-it, yes-no

**Interfaces:**
- Consumes: `<ConfettiBurst />` pattern จาก Task 4

- [ ] **Step 1: ใส่ทีละไฟล์ตามกฎเดียวกัน** — ทุกหน้ามี element ผลลัพธ์ห่อด้วย `Animated.View` ที่ `key={round}` (หรือ key เทียบเท่าที่เปลี่ยนทุกผลใหม่) → เพิ่ม `import { ConfettiBurst } from '@/components/ConfettiBurst';` และวาง `<ConfettiBurst />` เป็นลูกคนสุดท้ายใน Animated.View นั้น (นอก CaptureCard เสมอ — กันติดไปในรูปแชร์) ตัวอย่างจาก travel.tsx:

```tsx
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood} pose="point">
              <Text style={styles.emoji}>{spot.emoji}</Text>
              <Text style={styles.label}>{t('ทริปหน้าไปที่นี่!', 'Your next trip is here!')}</Text>
              <Text style={styles.name}>{spot.name}</Text>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
```

  กติกาหน้าที่ต่างจาก pattern หลัก:
  - หน้าที่ผลมาจาก callback (food-wheel, custom-wheel, clean-food, who-gets-it): ใส่ที่ element ผล/การ์ดที่ render เมื่อ `result !== null` เหมือนกัน — trigger ด้วย key ที่เปลี่ยนต่อรอบ
  - siamsi: ผลอยู่บนสุดของหน้า ใส่ครอบการ์ดใบเซียมซีตำแหน่งเดิม
  - หน้าไหน "ไม่มี" wrapper keyed ต่อรอบ → เพิ่ม `key={round}` ให้ element ผลก่อน แล้วค่อยวาง ConfettiBurst
  - **ห้าม**เปลี่ยน logic อื่นใด ๆ ของหน้า

- [ ] **Step 2: Verify** — `npx tsc --noEmit` ว่าง; `grep -l "ConfettiBurst" app/randomizers/*.tsx | wc -l` → ต้องได้ 22; web preview spot-check 3 หน้า (yes-no, food-wheel, siamsi) กดสุ่มได้ผลปกติ
- [ ] **Step 3: Commit** — `git add app/randomizers && git commit -m "feat: confetti ฉลองผลลัพธ์ครบทุกเครื่องสุ่ม 22 หน้า"`

---

### Task 7: Consistency sweep (spacing)

**Files:**
- Modify: `app/randomizers/travel.tsx` + ไฟล์อื่นที่ audit เจอ

**Interfaces:** ไม่มี

- [ ] **Step 1: Audit** — Run: `grep -n "contentContainerStyle\|content:.*{" app/randomizers/*.tsx | grep -n "gap"` และ `grep -n "height: *[0-9]" app/randomizers/*.tsx | grep View` แล้วจดหน้าที่ `padding`/`gap` ของ `styles.content` ไม่ใช่ `padding: 20, gap: 18` และหน้าที่ใช้ `<View style={{ height: N }} />` เป็น spacer
- [ ] **Step 2: แก้ให้เท่ากันทุกหน้า** — ตัวอย่างที่รู้แล้ว `travel.tsx`: ลบบรรทัด `<View style={{ height: 20 }} />` และแก้ `content: { padding: 20, gap: 8, flexGrow: 1 }` → `content: { padding: 20, gap: 18, flexGrow: 1 }` — หน้าอื่นที่ audit เจอแก้แบบเดียวกัน (ถ้าหน้าไหนตั้งใจต่างเพราะ layout เฉพาะ เช่น siamsi/วงล้อเต็มจอ ให้คงไว้และจดใน commit message)
- [ ] **Step 3: Verify** — `npx tsc --noEmit` ว่าง; web preview เปิด travel + หน้าที่แก้ → ช่องว่างดูสม่ำเสมอ ไม่มี layout พัง
- [ ] **Step 4: Commit** — `git add app/randomizers && git commit -m "style: จัด spacing หน้าเครื่องสุ่มให้สม่ำเสมอ (padding 20 / gap 18) — <รายชื่อไฟล์ที่แก้>"`

---

### Task 8: GachaMachine — โครงตู้นิ่ง (idle)

**Files:**
- Create: `src/components/GachaMachine.tsx`
- Modify: `app/randomizers/number.tsx` (วางตู้แทน PaaUanBubble ช่วง idle)

**Interfaces:**
- Produces (Task 9 ใช้ต่อ):
  - `export interface GachaMachineHandle { crank: () => void }`
  - `export interface GachaMachineProps { onCrank: () => void; onBallOpened: () => void }`
  - `export const GACHA_BALL_COLORS: string[]`

- [ ] **Step 1: สร้าง src/components/GachaMachine.tsx (เวอร์ชันนิ่ง — state idle อย่างเดียว)** — View ทั้งหมด สไตล์เดิมของแอป (ขอบ ink 3px, เงา offset, สีธีม):

```tsx
/**
 * 🎰 GachaMachine — ตู้กาชาปองการ์ตูน (View + reanimated ล้วน ไม่ใช้ SVG)
 * โครง: โดมแก้วมีลูกบอลสี ๆ → ตัวตู้แดง + ป้ายชื่อ → ลูกบิด + ช่องลูกบอลออก
 * Task 8 = โครงนิ่ง (idle) · Task 9 = state machine + animation + ปฏิสัมพันธ์
 */
import { forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { t } from '@/i18n';

export interface GachaMachineHandle {
  /** เริ่มบิด (เรียกจากปุ่ม BigButton ของ parent) */
  crank: () => void;
}

export interface GachaMachineProps {
  /** ผู้ใช้กดลูกบิดตรง ๆ — parent ต้องเรียก registerSpin() เองในนี้ */
  onCrank: () => void;
  /** ลูกบอลถูกแตะจนแตก → parent สุ่มเลขและโชว์ผล */
  onBallOpened: () => void;
}

export const GACHA_BALL_COLORS = [colors.pink, colors.gold, colors.jade, colors.blue, colors.purple];

/** ตำแหน่งลูกบอลในโดม (จัดมือให้ดูสุมกันธรรมชาติ) */
const DOME_BALLS: { x: number; y: number; c: number }[] = [
  { x: 24, y: 58, c: 0 }, { x: 66, y: 66, c: 1 }, { x: 108, y: 56, c: 2 },
  { x: 150, y: 64, c: 3 }, { x: 44, y: 26, c: 4 }, { x: 88, y: 20, c: 0 },
  { x: 130, y: 28, c: 1 }, { x: 178, y: 40, c: 2 },
];

/** ลูกบอลกาชา 2 สี (ครึ่งบนสี ครึ่งล่างขาว) + จุดไฮไลต์ */
export function GachaBall({ size, color }: { size: number; color: string }) {
  return (
    <View style={[ballStyles.ball, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[ballStyles.top, { backgroundColor: color, height: size / 2 }]} />
      <View style={[ballStyles.shine, { top: size * 0.12, left: size * 0.16, width: size * 0.2, height: size * 0.2 }]} />
    </View>
  );
}

export const GachaMachine = forwardRef<GachaMachineHandle, GachaMachineProps>(
  ({ onCrank, onBallOpened: _onBallOpened }, ref) => {
    useImperativeHandle(ref, () => ({
      crank: () => {
        // Task 9: เริ่ม animation จริง — เวอร์ชันโครงนิ่งยังไม่ทำอะไร
      },
    }));

    return (
      <View style={styles.wrap}>
        {/* โดมแก้ว */}
        <View style={styles.dome}>
          {DOME_BALLS.map((b, i) => (
            <View key={i} style={{ position: 'absolute', left: b.x, top: b.y }}>
              <GachaBall size={40} color={GACHA_BALL_COLORS[b.c]} />
            </View>
          ))}
        </View>

        {/* ตัวตู้ */}
        <View style={styles.cabinet}>
          <View style={styles.nameplate}>
            <Text style={styles.nameplateText}>{t('กาชาป้าอ้วน', "Auntie's Gacha")}</Text>
          </View>

          <View style={styles.row}>
            {/* ลูกบิด — กดได้เหมือนปุ่มสุ่ม */}
            <Pressable onPress={onCrank} style={styles.dial}>
              <View style={styles.dialSlot} />
            </Pressable>

            {/* ช่องลูกบอลออก */}
            <View style={styles.outlet} />
          </View>
        </View>
      </View>
    );
  }
);

GachaMachine.displayName = 'GachaMachine';

const ballStyles = StyleSheet.create({
  ball: {
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.ink,
    overflow: 'hidden',
  },
  top: { width: '100%' },
  shine: { position: 'absolute', backgroundColor: colors.white, borderRadius: 999, opacity: 0.85 },
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', alignSelf: 'center', width: 260 },
  dome: {
    width: 240,
    height: 130,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderWidth: 3,
    borderColor: colors.ink,
    borderBottomWidth: 0,
    backgroundColor: '#E8F6F7', // ฟ้าจาง ๆ ให้ดูเป็นกระจก
    overflow: 'hidden',
  },
  cabinet: {
    width: 260,
    borderWidth: 3,
    borderColor: colors.ink,
    borderRadius: 18,
    backgroundColor: colors.siam,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    // เงา offset ภาษาเดียวกับการ์ด/ปุ่มทั้งแอป
    shadowColor: colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  nameplate: {
    alignSelf: 'center',
    backgroundColor: colors.butter,
    borderWidth: 2.5,
    borderColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  nameplateText: { fontFamily: fonts.bold, fontSize: fontSize.md, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dial: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cream,
    borderWidth: 3,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialSlot: {
    width: 40,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.ink,
  },
  outlet: {
    width: 76,
    height: 64,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.ink,
    backgroundColor: '#7A0E24', // แดงเข้มกว่าตัวตู้ = ช่องลึก
  },
});
```

- [ ] **Step 2: วางตู้ใน number.tsx** — แทนที่บล็อก `{result === null ? <PaaUanBubble .../> : <Animated.View ...>}` ด้วย: ตู้แสดง**ตลอด** (บนสุด) และการ์ดผลอยู่ใต้ตู้เมื่อมี result:

```tsx
import { GachaMachine, GachaMachineHandle } from '@/components/GachaMachine';
import { registerSpin } from '@/ads/interstitial';
```

```tsx
  const machineRef = useRef<GachaMachineHandle>(null);

  // กดลูกบิดตรง ๆ = เหมือนกดปุ่มสุ่ม (BigButton นับโฆษณาให้เอง แต่ทางนี้ต้องนับเอง)
  function crankFromDial() {
    handleCrank();
    registerSpin();
  }

  // Task 8: ยังบิดแล้วออกผลทันที (สุ่มตรง ๆ) — Task 9 จะเปลี่ยนเป็นลำดับกาชาเต็ม
  function handleCrank() {
    roll();
  }
```

```tsx
        <GachaMachine ref={machineRef} onCrank={crankFromDial} onBallOpened={roll} />

        {result === null ? (
          <PaaUanBubble text={t('ใส่ช่วงตัวเลข แล้วบิดกาชาเลยลูก!', 'Set a range and crank the gacha!')} mood="happy" />
        ) : (
          <Animated.View key={round} entering={BounceIn.duration(600)}>
            <CaptureCard ref={cardRef} comment={comment} mood={mood}>
              <Text style={styles.number}>{result}</Text>
              <Text style={styles.range}>{t('จากช่วง ', 'from ')}{min} – {max}</Text>
            </CaptureCard>
            <ConfettiBurst />
          </Animated.View>
        )}
```

และเปลี่ยน label ปุ่ม BigButton: `label={result === null ? t('บิดเลย!', 'Crank it!') : t('บิดใหม่', 'Again')} onPress={handleCrank}`

- [ ] **Step 3: Verify** — `npx tsc --noEmit` ว่าง; web preview `/randomizers/number` → เห็นตู้ (โดม+ลูกบอล 8+ป้าย+ลูกบิด+ช่องออก), กดลูกบิดหรือปุ่ม → ได้เลขปกติ
- [ ] **Step 4: Commit** — `git add src/components/GachaMachine.tsx app/randomizers/number.tsx && git commit -m "feat: โครงตู้กาชานิ่งในหน้าสุ่มตัวเลข (บิดแล้วออกผลตรง ๆ ก่อน)"`

---

### Task 9: GachaMachine — state machine + animation เต็ม

**Files:**
- Modify: `src/components/GachaMachine.tsx`
- Modify: `app/randomizers/number.tsx`

**Interfaces:**
- Consumes: `tick()` จาก haptics (ConfettiBurst+success มากับการ์ดผลอยู่แล้วจาก Task 4)
- Produces: พฤติกรรมสุดท้ายของ `crank()`/`onBallOpened` ตาม state machine ใน spec

- [ ] **Step 1: เพิ่ม state machine ใน GachaMachine** — ภายใน component:

```tsx
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { tick } from '@/utils/haptics';
import { PaaUanBubble } from '@/components/PaaUanBubble';

type GachaState = 'idle' | 'spinning' | 'ballOut';
const INSTANT = Platform.OS === 'web'; // web: ข้าม animation (withTiming ไม่ขยับบนเว็บ)
```

พฤติกรรม (โค้ดเต็มเขียนใน component เดียวกับ Task 8):

```tsx
    const [state, setState] = useState<GachaState>('idle');
    const [ballColor, setBallColor] = useState(GACHA_BALL_COLORS[0]);
    const dialDeg = useSharedValue(0);      // ลูกบิดหมุนสะสม
    const shake = useSharedValue(0);        // เขย่าโดม -1..1
    const dropY = useSharedValue(0);        // ลูกบอลตก 0→1 (แปลงเป็น translateY)
    const crackP = useSharedValue(0);       // เปลือกแตก 0→1
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    function later(fn: () => void, ms: number) {
      timers.current.push(setTimeout(fn, ms));
    }

    function crank() {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      crackP.value = 0;
      dropY.value = 0;
      setBallColor(GACHA_BALL_COLORS[Math.floor(Math.random() * GACHA_BALL_COLORS.length)]);

      if (INSTANT) {
        setState('ballOut');
        return;
      }
      setState('spinning');
      // ลูกบิดหมุน 180° + ติ๊ก 3 จังหวะ
      dialDeg.value = withTiming(dialDeg.value + 180, { duration: 600, easing: Easing.out(Easing.quad) });
      later(tick, 0); later(tick, 220); later(tick, 450);
      // โดมเขย่า ~1 วิ
      shake.value = withSequence(
        withRepeat(withTiming(1, { duration: 70 }), 12, true),
        withTiming(0, { duration: 80 })
      );
      // ลูกบอลหล่นลงถาด (หลังเขย่าจบ) แล้วเข้าสถานะรอเปิด
      later(() => {
        setState('ballOut');
        dropY.value = 0;
        dropY.value = withSequence(
          withTiming(1, { duration: 420, easing: Easing.in(Easing.quad) }),
          withTiming(0.92, { duration: 110 }),
          withTiming(1, { duration: 110 })
        );
      }, 1000);
    }

    useImperativeHandle(ref, () => ({ crank }));

    function openBall() {
      if (state !== 'ballOut') return;
      if (INSTANT) {
        setState('idle');
        onBallOpened();
        return;
      }
      crackP.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }, (done) => {
        if (done) runOnJS(finishOpen)();
      });
    }
    function finishOpen() {
      setState('idle');
      onBallOpened();
    }
```

Animated styles + JSX เพิ่มเติม:

```tsx
    const domeStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shake.value * 5 }],
    }));
    const dialStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${dialDeg.value}deg` }],
    }));
    // ลูกบอลที่ออก: โผล่จากช่อง outlet แล้วตกลงถาดหน้าตู้
    const droppedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: dropY.value * 74 }],
      opacity: state === 'ballOut' || crackP.value > 0 ? 1 : 0,
    }));
    const halfL = useAnimatedStyle(() => ({
      transform: [
        { translateX: -crackP.value * 46 },
        { rotate: `${-crackP.value * 70}deg` },
      ],
      opacity: 1 - crackP.value,
    }));
    const halfR = useAnimatedStyle(() => ({
      transform: [
        { translateX: crackP.value * 46 },
        { rotate: `${crackP.value * 70}deg` },
      ],
      opacity: 1 - crackP.value,
    }));
```

- โดม: ห่อ `styles.dome` ด้วย `Animated.View style={[styles.dome, domeStyle]}`
- ลูกบิด: `<Pressable onPress={onCrank}><Animated.View style={[styles.dial, dialStyle]}><View style={styles.dialSlot} /></Animated.View></Pressable>`
- ใต้ตู้เพิ่มถาดลูกบอลออก (แสดงเมื่อ `state === 'ballOut'`):

```tsx
        {state === 'ballOut' && (
          <View style={styles.trayArea}>
            <Pressable onPress={openBall}>
              <Animated.View style={droppedStyle}>
                {/* เปลือก 2 ซีก (ตอนแตกกระเด็นคนละทาง) ทับด้วยลูกบอลเต็มตอนยังไม่แตก */}
                <Animated.View style={[StyleSheet.absoluteFill, halfL]}>
                  <GachaBall size={64} color={ballColor} />
                </Animated.View>
                <Animated.View style={halfR}>
                  <GachaBall size={64} color={ballColor} />
                </Animated.View>
              </Animated.View>
            </Pressable>
            <PaaUanBubble
              text={t('แตะลูกบอลเปิดเลยลูก!', 'Tap the ball to open it!')}
              mood="happy"
              imageWidth={64}
            />
          </View>
        )}
```

styles เพิ่ม: `trayArea: { marginTop: 10, alignItems: 'center', gap: 10, width: '100%' }`

- [ ] **Step 2: ต่อเข้า number.tsx ให้ครบวงจร** — เปลี่ยน `handleCrank` จาก `roll()` ตรง ๆ เป็นสั่งตู้ (validate ก่อน) และ `onBallOpened={roll}`:

```tsx
  function handleCrank() {
    const lo = parseInt(min, 10);
    const hi = parseInt(max, 10);
    if (Number.isNaN(lo) || Number.isNaN(hi)) return; // ช่วงไม่ครบ ไม่บิด
    machineRef.current?.crank();
  }
```

(`roll()` เดิมคงอยู่ — ถูกเรียกตอนลูกบอลแตกผ่าน `onBallOpened={roll}` → การ์ดผล + ConfettiBurst + auto-scroll ของเดิมทำงานต่อ)

- [ ] **Step 3: Verify** — `npx tsc --noEmit` ว่าง; web preview `/randomizers/number` (เว็บ = เส้นทาง INSTANT): กด "บิดเลย!" → ลูกบอล+บับเบิล "แตะลูกบอลเปิดเลยลูก!" โผล่ → แตะลูกบอล → เลขขึ้นการ์ดปกติ; กดบิดซ้ำตอนลูกยังไม่เปิด → ออกลูกใหม่ไม่ค้าง; ไม่มี console error
- [ ] **Step 4: Commit** — `git add src/components/GachaMachine.tsx app/randomizers/number.tsx && git commit -m "feat: ตู้กาชาเต็มรูปแบบ บิด-เขย่า-ลูกบอลหล่น-แตะเปิด พร้อม haptic"`

---

### Task 10: อิโมจิการ์ด 🎰 + version bump + smoke test รวม

**Files:**
- Modify: `src/data/categories.ts` (แถว id `'number'`)
- Modify: `app.json` (version)

**Interfaces:** ไม่มี

- [ ] **Step 1: เปลี่ยนอิโมจิ** — ใน `src/data/categories.ts` แถว number: `emoji: '🔢'` → `emoji: '🎰'` (ชื่อคง "สุ่มตัวเลข / Random Number")
- [ ] **Step 2: bump version** — `app.json`: `"version": "1.1.8"` → `"version": "1.1.9"`
- [ ] **Step 3: Smoke test รวม** — `npx tsc --noEmit` ว่าง; web preview ไล่: home (hero+ป้าย 🎰) → number (บิดกาชาจนได้เลข) → food-wheel (หมุนได้ผล) → pro (การ์ด 3 แผน) → ไม่มี console error สักหน้า
- [ ] **Step 4: Commit** — `git add src/data/categories.ts app.json && git commit -m "chore: อิโมจิกาชา 🎰 + bump 1.1.9"`

---

### Task 11: Merge เข้า global + push (trigger build จริง)

**Files:** ไม่มีไฟล์ใหม่ — งาน git ล้วน

- [ ] **Step 1: ยืนยันกับผู้ใช้ก่อน push** — push = build ขึ้น GitHub Release ทั้ง 2 แอป ต้องได้คำยืนยันในแชตก่อน
- [ ] **Step 2: Merge** — Run: `git checkout global && git merge master --no-edit && cat app.variant.json` → ต้องยังเป็น `"variant": "global"`
- [ ] **Step 3: Verify ฝั่ง global** — `npx tsc --noEmit` ว่าง (IS_GLOBAL=true path); `npx expo config --type prebuild --json` → name "Auntie's Random" / package `com.paauan.auntie`
- [ ] **Step 4: Push ทั้งคู่** — Run: `git push origin master && git push origin global` (ใช้ background ถ้าช้า) แล้วเช็ค `git fetch` เทียบ local=remote ทั้ง 2 branch
- [ ] **Step 5: กลับ master** — `git checkout master`

---

## Self-Review (ทำแล้ว)

- **Spec coverage:** 1a splash→T1, 1b statusbar→T1, 1c entrance→T5, 2a haptics→T2, 2b วงล้อ→T3, 2c confetti→T4+T6, ส่วน 3 sweep→T7, ส่วน 4 กาชา→T8+T9 (+🎰 T10), build/ship→T10+T11 — ครบ
- **Deviation จาก spec (จงใจ + เหตุผล):** ตู้ใช้ View แทน SVG (ผลตาเห็นเท่ากัน animate ง่ายกว่า), ไม่เพิ่ม dep expo-haptics (มีอยู่แล้ว — ดีกว่าที่ spec คาด)
- **Type consistency:** `GachaMachineHandle.crank()` / `onCrank` / `onBallOpened` / `GACHA_BALL_COLORS` ตรงกันทุก task; `tick/tapLight/success` ตรงกันทุกผู้ใช้
