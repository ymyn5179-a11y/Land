# NONOLAND Audio Repair Status Report

**Updated:** 2026-11-25T10:42:53.622Z
**Mode:** Controlled Group A Audio Production + Manifest Sync + Verification

---

## 1. Executive Summary & Asset Counts

| Metric | Count | Verification Status |
|---|---:|---|
| Preserved Baseline Disk Assets | **1109 / 1,109** | Verified intact (**24,635,147 bytes**, 100% SHA-256 parity against preservation baseline) |
| Newly Produced Academy MP3s on Disk (Pre-Session + This Run) | **46** | **46 / 46** passed `ffprobe` + `volumedetect` (`audio/mpeg`) |
| Total Audio Files on Disk (`public/assets/audio/**`) | **1155** | `0` corrupted, `0` zero-byte, `0` baseline overwrites |
| Registered Client Lookup Entries (`academyAudioLookup.json`) | **72** | Synced 1:1 with valid `data/academy-audio-manifest.json` assets |
| Manifest Unique Items (`data/academy-audio-manifest.json`) | **1500** | `14` screen buckets (`987` active Foundations + `72` valid Academy MP3s + remaining pending/reused) |
| Authorized Group A Master Scope (`NONOLAND_MISSING_AUDIO_FINAL.csv`) | **263** | **34** produced on disk + **10** resolved via canonical `'11'..'20'` digit MP3s + **219** remaining pending TTS quota |

### Group A Progress by Priority Tier
| Tier | Total Master Rows | Produced on Disk | Resolved via Canonical Digit MP3 | Remaining Pending Quota |
|---|---:|---:|---:|---:|
| **P1 (Core Academy)** | 24 | 14 | 10 | 0 |
| **P2 (Deep Learning Journey)** | 223 | 4 | 0 | 219 |
| **P3 (Educational App Cues)** | 16 | 16 | 0 | 0 |
| **Total Group A** | **263** | **34** | **10** | **219** |

---

## 2. Preservation & Authorization Boundary Verification

- **1,109 Baseline Files Untouched:** All `1,004` Foundations MP3s (combined SHA-256 `de7ab266800381d974994283b3e21ed6721dfd94f88fec14122c5cc8a7b01813`), `28` Arabic letter-name MP3s (`arabic-letters/`), `41` Quran story MP3s (`stories/`), `35` baseline Academy MP3s (`academy/`), and `1` WAV diagnostic chime verified byte-for-byte unchanged.
- **Strict Scope Enforcement:** Zero unapproved Group D (`Pink Ballet Dress` / `en_b89f44855c685577` NOT on disk), Group E optional UI/stories, Group F manual-review items, or Quran assets were generated. The `2` pre-session valid Pink AR MP3s (`ar_18d87bc9fe20bbde` "شريط وردي", `ar_240faf3d808ea53e` "فستان باليه وردي") remain safely preserved on disk.

---

## 3. Master Audit Reconciliation (`NONOLAND_FINAL_AUDIO_PRODUCTION_MASTER.csv` vs `academy-audio-manifest.json`)

- `NONOLAND_FINAL_AUDIO_PRODUCTION_MASTER.csv` holds **358** deduplicated rows: Group A (**263**), Group B (**44**), Group C (**3**), Group D (**40**), Group E (**4**), Group F (**4**).
- `data/academy-audio-manifest.json` tracks **1,500** unique normalized `(language, text)` items across **14** screen buckets (including `ReadingAdventureScreen` and `SmartAdaptiveAssessmentPanel` added in `server/academyAudioManifestBuilder.ts`). The difference vs the 358 master rows consists of `987` already-verified Foundations assets, `750`-question Stage 10 reused strings, `unseenVocab` visual distractors (silent UI choices in `Level1LessonRunner`), and `Stage 10` Deep Color assessment text labels.

---

## 4. `ERR-001` through `ERR-015` Exact Status

| Error ID | Summary | Code Status | Audio / Runtime Status |
|---|---|---|---|
| **ERR-001** | AR01–AR28 Level 1 Stage 5 & Q10 letter names | Fixed & Verified | **RESOLVED** — Routes through `resolveArabicLetterNameAudioUrl` (`arabic-letters/`, 28/28 valid) |
| **ERR-002** | Arabic Numbers 11–20 | Fixed & Verified | **RESOLVED** — `10/10` canonical digit MP3s (`ar_d41e9709e9ea2e5b`..`ar_5ddf71193434bb33`) on disk & registered; `AcademyScreen:204` + `academyAudioController:101` resolve Western & Arabic-Indic digits |
| **ERR-003** | CVC Word Builder (10 words) | Fixed & Verified | **RESOLVED** — `6/10` safely reuse Foundations TitleCase (`Cat, Sun, Dog, Red, Box, Hat`); **`4/4` newly produced (`BAT, MAP, PEN, CUP`)** on disk & registered |
| **ERR-004** | 9 English Alphabet Anchors (E,G,N,P,R,T,V,W,X) | Fixed & Verified | **RESOLVED** — 2-clip existing Foundations sequences via `englishAlphabetAudioMap.ts` |
| **ERR-005** | Geometric Shapes (AR + EN) | Fixed & Verified | **RESOLVED** — `star` in Foundations + **`10/10` shapes (`circle..hexagon` AR+EN)** on disk & registered |
| **ERR-006** | Daily Offline Activities (3x2) | Fixed & Verified | **RESOLVED** — **`6/6` AR+EN MP3s** generated on disk & registered |
| **ERR-007** | Deep Journey (Color, Arabic, English, Math) | Partial Audio | **IN PROGRESS (QUOTA)** — `4/223` Group A P2 Deep items on disk; `219` remaining pending daily TTS quota reset |
| **ERR-008** | 4 `needs-review` bare Arabic letters (`ب, ش, ل, و`) | Bypassed in Level 1 | **MANUAL REVIEW PENDING** — Preserved untouched in `academy/ar/`; flagged `needs-review` in manifest |
| **ERR-009** | `StudentHomeworkSection.tsx` `q.audioUrl` | Fixed & Verified | **RESOLVED (Code)** — Plays `q.audioUrl` with `playsinline` & visible error alert |
| **ERR-010** | `AssignedExamsSection.tsx` silent `catch` | Fixed & Verified | **RESOLVED (Code)** — Managed `audioRef`, `playsinline`, visible `role="alert"` |
| **ERR-011** | `AdminCmsPanel`, URL safety & `ExamsScreen` | Fixed & Verified | **RESOLVED (Code)** — Relative `/assets/` & `/uploads/` URLs supported & validated |
| **ERR-012** | `soundEngine.speak` 18 callers | Upgraded (P3) | **`10/10` P3 Cues Produced** (`8/8` `ReadingAdventureScreen` + `2/2` `SmartAdaptiveAssessmentPanel`) on disk & registered; `soundEngine.speak` checks pre-recorded MP3s first; remaining decorative/optional UI stays deferred (Group E) |
| **ERR-013** | `POST /api/academy/tts` disabled | Verified (`410 Gone`) | **INTENTIONAL** — Academy runtime TTS stays permanently disabled (`410 Gone`) |
| **ERR-014** | Missing audio HTTP 404 fail-closed | Verified | **RESOLVED** — Missing assets return HTTP 404 & `UNAVAILABLE`; resolved items return HTTP 200/206 |
| **ERR-015** | Live Browser DOM / Android WebView playback | Not Tested | **NOT TESTED** — No Chromium/Playwright browser binary or Android WebView runtime in sandbox |

---

## 5. Gemini TTS Quota & Execution Telemetry

- **Models Configured (`server/package3AudioBatch.ts`):** `gemini-3.8-flash-lite-tts`, `gemini-3.8-flash-tts`, `gemini-3.1-flash-tts-preview`, `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts`.
- **Succeeded Counts by Model (Checkpoint `succeededByModel`):**
  - `gemini-3.8-flash-lite-tts`: **14** generated & validated
  - `gemini-3.8-flash-tts`: **2** generated & validated
  - `gemini-3.1-flash-tts-preview`: **5** generated & validated
  - `gemini-2.5-flash-preview-tts`: **12** generated & validated
- **Quota Limits Hit (`exhaustedModels`):**
  - `gemini-3.8-flash-lite-tts`: `429 RESOURCE_EXHAUSTED` / quota limit reached
  - `gemini-3.8-flash-tts`: `429 RESOURCE_EXHAUSTED` / quota limit reached
  - `gemini-3.1-flash-tts-preview`: `429 RESOURCE_EXHAUSTED` / quota limit reached
  - `gemini-2.5-flash-preview-tts`: `429 RESOURCE_EXHAUSTED` / quota limit reached
  - `gemini-2.5-pro-preview-tts`: `429 RESOURCE_EXHAUSTED` / quota limit reached
- **Latest Run Summary:** `attemptedThisRun=19`, `succeededThisRun=18`, `state=partial`, `lastError=All candidate TTS models exhausted daily/permanent quota (4/4).`.
