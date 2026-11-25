# NONOLAND — Full Application Audio Gap, Integrity & Runtime Audit

**Audit Date**: 2026-11-24  
**Audit Mode**: **100% READ-ONLY** (Zero edits to source code, `public/assets/audio/**`, manifests, lookup JSON, or database records; zero audio generated)  
**Deliverables Created**:
1. `NONOLAND_MISSING_AUDIO_MASTER.csv` (**318** deduplicated missing/reusable/upgrade items)
2. `NONOLAND_RUNTIME_AUDIO_ERRORS.csv` (**15** runtime/code/routing/HTTP findings, `ERR-001`..`ERR-015`)
3. `NONOLAND_AUDIO_PRESERVATION_REPORT.md` (Exact SHA-256 preservation baseline across **1,109** on-disk audio files)
4. `NONOLAND_FULL_AUDIO_AUDIT.md` (This consolidated engineering report)

---

## 1. Executive Summary

- **Existing Audio Assets on Disk (`public/assets/audio/**`)**: **1,109 files** (**24,635,147 bytes**; **1,101 unique SHA-256 hashes** due to 8 exact duplicates between legacy flat-root `academy/*.mp3` and `academy/ar/*.mp3`).
  - `foundations/`: **1,004 MP3s** (**19,856,592 bytes**; **529 `ar` / 475 `en`**) — **100% SHA-256 match** against `generated_audio/*.mp3` (**0 diffs, 0 missing**). **987** active + **17** quarantined `bareDigitArabicAudioDefectIds` (kept on disk, blocked in resolver).
  - `arabic-letters/`: **28 MP3s** (**204,375 bytes**) — 44.1 kHz verified studio clips, **28/28** mapped in `src/utils/arabicLetterAudioMap.ts`.
  - `academy/`: **35 MP3s** (**494,247 bytes**) — **26** active in `academy/{ar,en}/` (24 AR + 2 EN matching `src/data/academyAudioLookup.json`, zero overlap with `foundations/`) + **9** unreferenced legacy 28-hex root files (8 exact SHA-256 duplicates of `academy/ar/*` + 1 orphan `f46e6136b2c1bae1b720c85d1ade.mp3`).
  - `stories/`: **41 MP3s** (**4,053,429 bytes**) — **41/41** matching all 8 stories in `QURAN_STORY_LIBRARY`.
  - `technical-test-chime.wav`: **1 WAV** (**26,504 bytes**).
- **Audio Integrity & Live HTTP Health**:
  - **1,109 / 1,109** files passed `ffprobe` + `ffmpeg volumedetect` (**0 decode errors**, **0 silent files** `max <= -40 dB`, **0 clips `< 0.35s`**).
  - **1,109 / 1,109** files returned `HTTP 200 OK` (`audio/mpeg` or `audio/wav`) on `http://127.0.0.1:3000`, and sampled `Range: bytes=0-511` requests returned `206 Partial Content` (`accept-ranges: bytes`).
- **Curriculum Call-Site Coverage**:
  - Simulated **2,288** live Academy / Level 1 / Deep / Exam audio resolution calls -> **351 `UNAVAILABLE` calls**, deduplicating to **308 unique Academy/Deep/Exam items** (**175 AR / 133 EN**), plus **10** educational `soundEngine.speak` TTS upgrade targets (`Category F`), totaling **318 rows** in `NONOLAND_MISSING_AUDIO_MASTER.csv` (**179 AR / 139 EN**).
  - Note: **4** `COLOR_MIX_RECIPES` (**8** AR+EN prompts) already resolve 100% cleanly via `foundations/`.
  - Note: Out of **318** rows, **6** CVC words (`CAT, SUN, DOG, RED, BOX, HAT`) already exist on disk in TitleCase and need **code normalization only**, and **40** `P4` Deep Color strings (`orange, purple, pink, white`) are synthetic fallback templates requiring copy curation before generation.

---

## 2. Application-Wide Audio Source Discovery

| Module / Screen | Audio Mechanism | Status & Key Findings |
|---|---|---|
| `src/screens/AcademyScreen.tsx` | `academyAudio.speak` + `resolveArabicLetterNameAudioUrl` + `findFoundationsItemId` | Arabic Letters 28/28 OK; Arabic Numbers 0–10 OK, **11–20 UNAVAILABLE**; English Numbers 0–20 OK (1 & 7 via `academy/en/`); Color Mix recipes 8/8 OK; **Shapes 5/6 (10 AR/EN) UNAVAILABLE**; **EN Letters `E,G,N,P,R,T,V,W,X` (9) UNAVAILABLE**; **CVC 10/10 UNAVAILABLE** (6 reusable via case fix + 4 new); **Offline Activities 6/6 UNAVAILABLE**. |
| `src/components/academy/Level1LessonRunner.tsx` | `speakCue` -> `academyAudio.speak` | **ERR-001**: Stages 5 & 10 Q10 on `AR01–AR28` omit `resolveArabicLetterNameAudioUrl`, hitting `academy/ar/*` (4 `needs-review`) or `foundations/ar_*` instead of `arabic-letters/`. |
| `src/components/academy/DeepLessonEngine.tsx` | `speak` -> `academyAudio.speak` | **263 unique items UNAVAILABLE** (`113` Deep Arabic, `32` Deep Color intros/curated examples, `40` Deep Color `P4` synthetic examples, `60` Deep English sentences, `18` Deep Math cues). |
| `src/components/academy/Level2LessonRunner.tsx` | Disabled placeholder (47 lines) | Not active in UI. |
| `src/screens/ExamsScreen.tsx` & `src/data/level1QuestionBank.ts` | `academyAudio.speak` | Level 1 question bank aligned except shared `ENGLISH_ALPHABET` mismatches (`E,G,N,P,R,T,V,W,X`). |
| `src/screens/ReadingAdventureScreen.tsx` | `soundEngine.speak` (`window.speechSynthesis`) | **Category F (8 P3 items)**: Stage 2 phonics cues + Stage 7/8 mini-stories fail silently in WebViews lacking TTS voices. |
| `server/smartAssessmentRoutes.ts` | Client `soundEngine.speak` | **Category F (2 P3 items)**: `sa-listen-en-b` (`"Buh, Buh, Ball"`), `sa-phonics-cat` (`"Cuh, Cuh, Cat"`). |
| `src/components/StudentHomeworkSection.tsx` | `soundEngine.speak` only | **ERR-009**: Ignores `q.audioUrl` completely; `data/nonoland-server-db.json` currently has 5 homeworks (0 audio attachments). |
| `src/components/AssignedExamsSection.tsx` | `new Audio(q.audioUrl).play().catch(()=>{})` + `soundEngine.speak` | **ERR-010**: Silent `.catch(() => {})`, missing `playsinline`; `teacherQuestions` currently has 45 entries (0 audio fields). |
| `src/components/AdminCmsPanel.tsx` | HTML forms for CMS lessons/questions | **ERR-011**: `type="url"` rejects `/assets/audio/...` relative paths; Custom Question form omits `audioUrl`/`audioText`. `customLessons=0`, `customQuestions=0`. |
| `src/screens/StoriesScreen.tsx` & `src/data/quranStoryLibrary.ts` | `public/assets/audio/stories/**` + Web Audio / `soundEngine.speak` | **41/41** Quran story MP3s intact & valid (**PRESERVE**). General interactive `stories.ts` uses `soundEngine.speak` when narration is triggered. |
| Quran Recitation (`server/quranAudioProvider.ts`, `server/quranRoutes.ts`, `QuranScreen.tsx`) | Quran Foundation CDN HTTPS (Reciter ID 6 Al-Husary Al-Muallim) + `technical-test-chime.wav` | Auth-gated (`401` unauthenticated); **PRESERVE 100% UNTOUCHED**. |
| `FunZoneScreen.tsx`, `DiscoveryLabScreen.tsx`, `HomeScreen.tsx`, `MyRoomScreen.tsx`, Nono AI | `soundEngine.play*` chimes + optional `window.speechSynthesis` | Procedural WebAudio SFX OK; non-curriculum `speechSynthesis` fails silently if WebView TTS unavailable (`ERR-012`). |

---

## 3. On-Disk Asset & Manifest Reconciliation

| Directory / File | Count | Bytes | Status & Notes |
|---|---:|---:|---|
| `public/assets/audio/foundations/` | 1,004 | 19,856,592 | 100% SHA-256 verified vs `generated_audio/` (`de7ab266800381d974994283b3e21ed6721dfd94f88fec14122c5cc8a7b01813`). 987 active + 17 quarantined bare-digit files. |
| `public/assets/audio/arabic-letters/` | 28 | 204,375 | 28/28 mapped in `arabicLetterAudioMap.ts`; 44.1 kHz studio clips (`0.39s–0.73s`). **PRESERVE**. |
| `public/assets/audio/academy/{ar,en}/` | 26 | 384,018 | Matches `academyAudioLookup.json` (`24 ar + 2 en`). **4** bare AR letters (`ب, ش, ل, و`) flagged `needs-review` in `data/academy-audio-manifest.json`. |
| `public/assets/audio/academy/*.mp3` | 9 | 110,229 | Legacy unreferenced 28-hex root files: **8** exact SHA-256 duplicates of `academy/ar/*` + **1** orphan `f46e6136b2c1bae1b720c85d1ade.mp3`. |
| `public/assets/audio/stories/` | 41 | 4,053,429 | All 8 stories (`41/41` scenes). **PRESERVE**. |
| `public/assets/audio/technical-test-chime.wav` | 1 | 26,504 | PCM `pcm_s16le`, 22,050 Hz, 0.60s. **PRESERVE**. |
| **Total On Disk** | **1,109** | **24,635,147** | **1,101 unique SHA-256 hashes; 0 broken/corrupt files**. |

- **Stale Admin Manifest (`data/academy-audio-manifest.json`)**: Contains **1,527** entries (`validationStatus`: `26 valid`, `1,501 missing`; `generationStatus`: `26 ready`, `6 failed`, `1,495 pending`; `pronunciationReviewStatus`: `4 needs-review`, `105 unverified`, `1,418 not-applicable`). It has **not** been synchronized with the **1,004** `foundations/` or **28** `arabic-letters/` MP3s.

---

## 4. Missing Audio Master Breakdown (`318` Deduplicated Rows)

| Category | Priority | AR | EN | Total | Action Required |
|---|---|---:|---:|---:|---|
| **A: Core Academy & Foundations** | `P1` | 15 | 18 | **33** | **Generate 33** (10 AR Numbers `11–20`; 10 Shapes `AR+EN`; 9 EN `"X. Word"` combos [`E,G,N,P,R,T,V,W,X`] OR align anchor words; 4 CVC words `BAT, MAP, PEN, CUP`) |
| **A: Core Academy & Foundations** | `P3` | 3 | 9 | **12** | **6 code-fix reusable** (`CAT, SUN, DOG, RED, BOX, HAT` exist in TitleCase in `foundations/`) + **6 generate** (`PARENT_OFFLINE_ACTIVITIES` 3 AR + 3 EN) |
| **C: Deep Learning Paths** | `P2` | 137 | 86 | **223** | **Generate 223** (`113` Deep Arabic intros/examples/sentences, `32` Deep Color intros/examples, `60` Deep English sentences, `18` Deep Math cues) |
| **C: Deep Learning Paths** | `P4` | 20 | 20 | **40** | **Curate copy first** (`orange, purple, pink, white` synthetic `"Color Item 1..5"` / `"برتقالي — مثال ١..٥"` fallback strings) |
| **F: Non-Academy Educational TTS** | `P3` | 4 | 6 | **10** | **Generate 10 + wire controller** (`8` `ReadingAdventureScreen` Stage 2/7/8 + `2` `SmartAdaptiveAssessment`) |
| **TOTAL** | — | **179** | **139** | **318** | **6 code-only reuse** + **272 net-new `P1–P3` MP3s** + **40 `P4` after copy curation** (+ **28** Stage 5/10 AR letter calls fixed in code to reuse `arabic-letters/`) |

*(Categories B [Level 1], D [Exams], E [Teacher/Admin CMS DB], and G [Quran/Stories]: **0 missing assets on disk** beyond shared items counted in A/C and code-routing fixes in `ERR-001`, `ERR-009`..`ERR-011`.)*

---

## 5. Audio Integrity, Endpoint & Runtime Verification

- **`ffprobe` + `ffmpeg volumedetect` (All 1,109 files)**:
  - `arabic-letters/` (28): MP3 44.1 kHz, 0.39s–0.73s (avg 0.58s), crisp studio levels (`max >= -2.9 dB`).
  - `academy/` (35): MP3 24 kHz, 0.89s–9.53s (avg 1.74s); `ar_124315331f64f556.mp3` (`"ش"`) is unusually quiet (`max=-15.3 dB`, `mean=-33.0 dB`) and `ar_a88936da245c6dd0.mp3` (`"ت"`) has `mean=-31.0 dB`.
  - `foundations/` (1,004): MP3 24 kHz, 1.51s–12.72s (avg 3.30s).
  - `stories/` (41): MP3 24 kHz, 8.81s–23.81s (avg 12.33s).
  - `technical-test-chime.wav` (1): `pcm_s16le`, 22.05 kHz, 0.60s.
- **HTTP Server Checks (`http://127.0.0.1:3000`)**:
  - `GET /api/academy/tts-status` -> `200 OK` (`runtimeTtsDisabledForAcademy: true`, `academyAudioMode: "pregenerated-mp3"`).
  - `GET /api/academy/audio-manifest` -> `200 OK`.
  - `POST /api/academy/tts` -> `410 Gone` (`ACADEMY_PREGENERATED_ONLY`).
  - `POST /api/ai/tts`, `GET /api/quran/catalog`, `GET /api/quran/audio/status`, `GET /api/quran/stories` -> `401 Unauthorized` unauthenticated.
  - Static asset `HEAD` (1,109/1,109) -> `200 OK` (`audio/mpeg` / `audio/wav`); sampled `Range: bytes=0-511` -> `206 Partial Content`; missing path -> `404` JSON.
- **Browser / Android WebView DOM Playback (`ERR-015`)**:
  - **NOT REPRODUCED** in headless Chromium because no Chromium/Playwright/Puppeteer binary is installed in this sandbox. Static resolution, HTTP delivery, and stream decoding are all verified.

---

## 6. Recommended Sequenced Plan (Before Batch Audio Generation)

1. **Code & Normalization Fixes First (Zero New Audio Needed)**:
   - Route `Level1LessonRunner.tsx` (`ERR-001`) single Arabic letter cues through `resolveArabicLetterNameAudioUrl` so all 28 letters play `arabic-letters/` MP3s and bypass the 4 `needs-review` `academy/ar/` clips.
   - Normalize case-insensitive lookup in `findFoundationsItemId` / `AcademyScreen.tsx:1295` (`ERR-003`) to immediately unlock `CAT, SUN, DOG, RED, BOX, HAT` (6/10 CVC words).
   - Decide whether to align `ENGLISH_ALPHABET` (`academyData.ts`) with `level1Curriculum.ts` anchors or keep `Elephant, Grapes, ...` (`ERR-004` saves 9 generations if aligned).
   - Fix `StudentHomeworkSection.tsx` (`ERR-009`), `AssignedExamsSection.tsx` (`ERR-010`), and `AdminCmsPanel.tsx` (`ERR-011`).
2. **Curate Synthetic Deep Color Copy (`40` `P4` items)**:
   - Replace `"Color Item 1..5"` / `"برتقالي — مثال ١..٥"` in `deepCurriculum.ts` for `orange, purple, pink, white` before generating audio.
3. **One Consolidated Batch Audio Generation**:
   - Generate **272 `P1–P3` items** (plus any curated `P4` color items; **263** if EN anchors are aligned), preserving **all 1,109 existing disk assets** per `NONOLAND_AUDIO_PRESERVATION_REPORT.md`.
4. **Post-Generation Sync & WebView Smoke Test**:
   - Sync `foundationsAudioInventory.json` / `academy-audio-manifest.json` and execute authenticated browser/Android WebView `AudioElement.play()` smoke tests (`ERR-015`).
