# Design: UI Polish 3 ชั้น + ตู้กาชาตัวเลข

> วันที่: 2026-07-18 · สถานะ: อนุมัติแนวทางแล้ว (ทาง A) รอทำแผนลงมือ
> ขอบเขต: ทั้งแอปไทย (master) และ EN (global) — ข้อความใหม่ทุกจุดผ่าน `t(ไทย, English)`

## เป้าหมาย

ยกระดับแอปให้ดู "มืออาชีพ น่าใช้ประจำ" โดย **ไม่รื้อเอกลักษณ์เดิม** (การ์ตูนตลาดไทยย้อนยุค:
ขอบดำหนา + เงา offset + ฟอนต์ Mali) — ขัดเงา ไม่ทาสีใหม่ + เพิ่มประสบการณ์ตู้กาชาปอง
ให้หน้า "สุ่มตัวเลข"

ปัญหาที่พบจากการสำรวจ (เรียงตามผลกระทบ):

1. Splash screen ไม่ได้ตั้งค่าเลย (`splash key: null`) — เปิดแอปเจอจอขาวเปล่า, `assets/splash-icon.png` ไม่ถูกใช้
2. ไม่มี haptic ทั้งแอป — กดสุ่ม/วงล้อ/ได้ผล เงียบสนิท
3. ได้ผลลัพธ์แล้วไม่มีจังหวะฉลอง — มีแค่ `BounceIn` การ์ด
4. Status bar ไอคอนดำบนพื้นชมพูเข้ม (`style="dark"` ทั้งแอป) — contrast แย่
5. หน้า home เข้าแบบนิ่ง — มาสคอตไม่มี entrance
6. Spacing ไม่สม่ำเสมอ (บางหน้า gap 8 / บางหน้า 18 / บางหน้าใช้ View เปล่าเป็น spacer)

## ส่วนที่ 1 — First Impression

### 1a. Splash screen

ตั้งค่า plugin ใน `app.json` (แทนที่ `"expo-splash-screen"` เปล่า ๆ):

```json
["expo-splash-screen", {
  "backgroundColor": "#FFF3DD",
  "image": "./assets/splash-icon.png",
  "imageWidth": 200
}]
```

- พื้นครีมตามธีม + รูปป้าตรงกลาง ใช้ร่วมกันทั้ง 2 แอป (มาสคอตเดียวกัน) ไม่ต้องแยก variant
- ⚠️ บทเรียนเก่าใน vault: ห้าม "ลบ" key image ภายหลัง (resource linking พัง) — เพิ่มอย่างเดียวปลอดภัย

### 1b. Status bar

`app/_layout.tsx`: เปลี่ยน `<StatusBar style="dark" />` → `style="light"` ทั้งแอป
เหตุผล: พื้นที่บนสุดเป็นสีชมพูทุกหน้า (hero ชมพูหน้า home + header ชมพูหน้าอื่น)

### 1c. Home entrance (`app/index.tsx` — เฉพาะ hero)

- ป้าชี้นิ้ว: เด้งขึ้นจากขอบล่างขวาแบบ spring ~400ms (reanimated entering)
- บับเบิลทักทาย: ZoomIn หลังป้าโผล่ ~200ms
- ส่วนหมวด/การ์ดไม่ animate — กันหน้าหลักหน่วง

## ส่วนที่ 2 — Micro-interactions

### 2a. Haptic util กลาง

- เพิ่ม dependency เดียว: `expo-haptics`
- ไฟล์ใหม่ `src/utils/haptics.ts` (+ `haptics.web.ts` no-op):
  - `tapLight()` — กดปุ่ม (impactAsync Light)
  - `tick()` — จังหวะติ๊กตอนวงล้อ/กาชาหมุน (selectionAsync)
  - `success()` — ได้ผลลัพธ์ (notificationAsync Success)
  - ทุกตัวครอบ try/catch — ห้ามทำแอปพังในทุกกรณี
- ฝัง `tapLight()` ใน `BigButton.handlePress` จุดเดียว → ทุกปุ่มทั้ง 22 หน้าได้ฟรี

### 2b. วงล้อสั่นติ๊ก ๆ

- ตอนวงล้อหมุน: `tick()` ตามจังหวะผ่านเซกเมนต์ (ถี่ตอนแรก ช้าลงตอนใกล้หยุด)
- ตอนหยุด: `success()`
- ทำในคอมโพเนนต์วงล้อที่แชร์กัน (หรือรายหน้า ถ้าไม่มีตัวแชร์)

### 2c. ConfettiBurst (เขียนเอง ไม่เพิ่ม dep)

- `src/components/ConfettiBurst.tsx`: เศษกระดาษ ~14 ชิ้น สีจากธีม (pink/gold/jade/blue/purple)
  พุ่งจากบริเวณการ์ดผล ~800ms แล้ว unmount ตัวเอง + เรียก `success()` ตอนเริ่ม
- ใส่ในทุกหน้าเครื่องสุ่มตอน "ผลลัพธ์ใหม่โผล่" (trigger ตาม `round` เหมือน pattern เดิม)
- แก้แบบ mechanical ทีละหน้า (แบบเดียวกับรอบ scroll fix)

## ส่วนที่ 3 — Consistency sweep

- ทุกหน้า randomizer: `contentContainerStyle` ใช้ `padding: 20, gap: 18` เท่ากัน
- เลิกใช้ `<View style={{height:N}}>` เป็น spacer (เจอใน travel.tsx) → ใช้ gap
- ตอนลงมือ: ไล่เช็คทีละหน้า เก็บรายการที่แก้จริงไว้ใน commit message

## ส่วนที่ 4 — ตู้กาชาตัวเลข (แทนเนื้อหน้า "สุ่มตัวเลข")

### หลักการ

- คงชื่อ "สุ่มตัวเลข / Random Number" ในหน้า home — เปลี่ยนอิโมจิการ์ดเป็น 🎰
- คง min–max, BigButton (การนับโฆษณา `registerSpin` ไม่หลุด), CaptureCard, ShareButton,
  auto-scroll, คอมเมนต์ป้า `numberLines` — ของเดิมทั้งหมด
- ตู้เป็นคอมโพเนนต์แยก `src/components/GachaMachine.tsx` (SVG + reanimated — มี dep อยู่แล้ว)
  หน้า `number.tsx` แค่ประกอบ

### หน้าตา (SVG สไตล์เดิม: ขอบดำ 3px + เงา offset)

- โดมแก้วใส: ลูกบอลสี ~8 ลูก (สีธีม) ขยับดุ๊กดิ๊ก idle ตลอด
- ตัวตู้แดง/ครีม + ป้าย "กาชาป้าอ้วน / Auntie's Gacha"
- ลูกบิดใหญ่กดได้ + รางลูกบอลออกด้านล่าง

### ลำดับการเล่น (state machine)

| state | เกิดอะไร |
|---|---|
| `idle` | ลูกบอลดุ๊กดิ๊กเบา ๆ, ช่อง min–max ใต้ตู้ |
| `spinning` | กด "บิดเลย!" (BigButton) หรือกดลูกบิดตรง ๆ → ลูกบิดหมุน 180° + `tick()` 3 จังหวะ, ลูกบอลเขย่าแรง ~1 วิ, ลูกบอลสีสุ่ม 1 ลูกหล่นผ่านรางลงถาด เด้งดึ๋ง |
| `ball-out` | ลูกบอลสั่นในถาด + บับเบิลป้า: "แตะลูกบอลเปิดเลยลูก!" |
| `revealed` | แตะลูกบอล → เปลือก 2 ซีกกระเด็น + ตัวเลขเด้งออก + ConfettiBurst + `success()` → ผลเข้า CaptureCard เดิม |

### กันพลาด

- **Web:** ข้าม animation ตรงไปผลเลย (`Platform.OS === 'web'` guard) — บทเรียน vault:
  reanimated completion callback ไม่ fire บน web (เคสวงล้อ)
- **บิดซ้ำตอนลูกยังไม่เปิด:** ทิ้งลูกเก่า ออกลูกใหม่ (ไม่ล็อก)
- กดลูกบิดตรง ๆ เรียก handler เดียวกับ BigButton → นับโฆษณาเหมือนกัน

## สิ่งที่ตัดสินใจแล้ว

- เสียง: **haptic อย่างเดียว** ไม่มีไฟล์เสียง (ไม่ต้องมีปุ่มเปิด/ปิดเสียง)
- ไม่รื้อ visual language — polish เท่านั้น
- dependency ใหม่ตัวเดียว: `expo-haptics`

## ลำดับการ build/ship (ตาม docs/BUILD.md)

commit บน `master` → merge เข้า `global` → push ทั้งคู่ (push = trigger build จริง)
บวก bump `version` ใน app.json ตอนพร้อม build
