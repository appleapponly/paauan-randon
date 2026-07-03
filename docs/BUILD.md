# 🏗️ คู่มือ Build 2 แอปจากโค้ดชุดเดียว (ไทย + Auntie's Random)

โค้ดชุดเดียวกัน build ออกได้ 2 แอปบน Play Store คนละ listing โดยแยกด้วย **branch**

| Branch | `app.variant.json` | แอป | Package | ภาษา | ไฟล์ที่ได้ |
|---|---|---|---|---|---|
| `master` (และ `main`) | `"thai"` | ป้าอ้วนสุ่มให้ | `com.paauan.randon` | ไทย | `paauan-randon.aab` |
| `global` | `"global"` | Auntie's Random | `com.paauan.auntie` | อังกฤษ | `aunties-random.aab` |

## 🔑 หลักการ (ทำไมใช้ไฟล์ ไม่ใช้ env)
- ตัวสลับคือไฟล์ **`app.variant.json`** ที่ commit ไว้ (`{ "variant": "thai" | "global" }`)
- อ่านโดย `app.config.js` (ตั้งชื่อ/แพ็กเกจ native) และ `src/i18n/index.ts` (เลือกภาษาใน JS bundle)
- **ห้ามกลับไปใช้ env `APP_VARIANT`** — เพราะ gradle re-evaluate `app.config.js` ตอน bundle JS อีกรอบ ถ้า env ไม่ติดค่าจะหลุดกลับเป็นไทย (บั๊กที่เคยเจอ: แอป global เปิดมาเป็นไทย)

## ▶️ วิธี build
push เข้า branch ไหน → GitHub Actions build **แอปเดียว** ตาม variant ของ branch นั้น
```powershell
git push https://<TOKEN>@github.com/appleapponly/paauan-randon.git master   # → build ไทย
git push https://<TOKEN>@github.com/appleapponly/paauan-randon.git global   # → build EN
```
ไฟล์ AAB อยู่ในแท็บ **Releases** (tag `build-thai-<n>` / `build-global-<n>`)

## 🔁 ทำฟีเจอร์ใหม่ แล้วให้ทั้ง 2 แอปได้
1. ทำงานบน **`master`** ตามปกติ (ห่อข้อความใหม่ด้วย `t('ไทย', 'English')` เสมอ)
2. push master → ได้ build ไทย + ทดสอบ
3. เอาเข้า global:
   ```powershell
   git checkout global
   git merge master
   # ถ้าไฟล์ app.variant.json ชนกัน → เลือกฝั่ง "global" (บรรทัดเดียว)
   #   แก้ให้เป็น { "variant": "global" } แล้ว git add app.variant.json && git commit
   git push https://<TOKEN>@github.com/appleapponly/paauan-randon.git global
   git checkout master
   ```
> เกือบทุกครั้ง merge จะไม่ชน (เพราะแก้ feature ที่ไฟล์อื่น) — จะชนแค่ตอนที่ commit ไปแตะ `app.variant.json` เท่านั้น

## 🔢 versionCode / version
- **versionCode** = `github.run_number` (CI เขียนทับ `app.json` ทุก build) → เพิ่มขึ้นเองทุกครั้งทั้ง 2 branch ไม่ต้อง bump มือ · แต่ละแอปเป็น listing แยก ขอแค่ upload ใหม่สูงกว่าเดิมของตัวเอง ซึ่งเป็นเสมอ
- **version** (เลขที่ user เห็น เช่น `1.1.7` ใน `app.json`) = bump มือเมื่อออกฟีเจอร์ใหม่ (ทำบน master แล้ว merge ไป global)

## ⚙️ สิ่งที่ต้องตั้งใน Play/AdMob ฝั่ง global (ทำครั้งเดียว)
- สร้าง app ใหม่ใน Play Console สำหรับ `com.paauan.auntie` (title ≤ 30 ตัว → "Auntie's Random")
- Privacy Policy: `docs/privacy-policy-en.html` (โฮสต์เดียวกันบน GitHub Pages)
- สร้าง AdMob app ใหม่ของ `com.paauan.auntie` → เอา app id + ad unit ใส่ใน `app.config.js` (ส่วน `variant === 'global'`) และ `src/ads/adConfig.ts`
- สร้าง subscription `paauan_pro_yearly` / `paauan_pro_monthly` + ตั้งราคา USD (เช่น $4.99/ปี)
