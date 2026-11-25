# NONOLAND Audio Finalization Checklist

**Generated:** 2026-11-25T10:42:53.622Z

Use this checklist to complete the remaining **219** quota-blocked Group A P2 Deep Learning items and finalize release QA:

1. **Wait for Free-Tier Daily Quota Reset (or Switch to Paid Gemini Billing Key)**
   - Previous run exhausted free-tier RPD limits on: `gemini-3.8-flash-lite-tts`, `gemini-3.8-flash-tts`, `gemini-3.1-flash-tts-preview`, `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts`.
   - Remaining Group A items: **219** (`P1=0`, `P3=0`, `P2=219`), all cleanly listed with `Current_Disk_Status=MISSING_PENDING_TTS_QUOTA` in `NONOLAND_MISSING_AUDIO_FINAL.csv`.

2. **Resume Controlled Group A Batch Generation**
   - Keep `groupAOnly: true` so unapproved Group D (`Pink Ballet Dress` / `en_b89f44855c685577`), Group E, and Group F stay excluded:
   ```bash
   curl -s --max-time 600 -X POST http://127.0.0.1:3000/api/academy/audio/package3-run \
     -H 'Content-Type: application/json' \
     -d '{"groupAOnly":true,"delayMs":21000,"awaitCompletion":true}'
   ```
   - After completion, run manifest sync:
   ```bash
   curl -s -X POST http://127.0.0.1:3000/api/academy/audio/prepare-batch \
     -H 'Content-Type: application/json' \
     -d '{"syncOnly":true,"validateExisting":false}'
   ```

3. **Content Decision for `Pink Ballet Dress` (Group D — Remaining Unapproved Item)**
   - In `src/data/deepCurriculum.ts`, `Pink Ribbon` (`en_815988a84a850a10`) already exists in `foundations/`, and `شريط وردي` (`ar_18d87bc9fe20bbde`) + `فستان باليه وردي` (`ar_240faf3d808ea53e`) exist as valid MP3s in `academy/ar/`.
   - Either:
     - **(A)** Approve and generate `en_b89f44855c685577` (`Pink Ballet Dress`), OR
     - **(B)** Swap Example 5 / Unseen 2 EN in `deepCurriculum.ts` to `Pink Tulip` (`en_1febefbb03ddaa01`, already in `foundations/`) and adjust AR to `زهرة توليب وردية` or `Pink Ballet` if desired.

4. **Human Listening & Pronunciation Audit (Group F — `ERR-008`)**
   - Review the **4** flagged `needs-review` bare Arabic letters in `public/assets/audio/academy/ar/` (`ar_a1297edee10476b6.mp3` `ب`, `ar_124315331f64f556.mp3` `ش`, `ar_24be271a98354ce7.mp3` `ل`, `ar_42f9bf089dc3e0e5.mp3` `و`).
   - Optionally spot-check pronunciation quality of newly produced Gemini TTS Deep Learning Arabic/English sentences.
   - Decide on cleanup/retention of the **9** unreferenced legacy flat-root MP3s in `public/assets/audio/academy/*.mp3`.

5. **Post-Completion Verification Gate**
   - Re-run all 4 automated verification suites + TypeScript + build:
     - `npx tsx tests/verify-foundations-audio.ts`
     - `npx tsx tests/verify-audio-phase2.ts`
     - `npx tsx tests/verify-academy-audio.ts`
     - `npx tsx tests/verify-academy-regression.ts`
     - `npx tsc --noEmit && npm run lint && npm run build`

6. **Real-Device Browser & Android WebView Smoke Test (`ERR-015` — Currently NOT TESTED)**
   - Test click-triggered `HTMLAudioElement.play()` on **Desktop Chrome** and **Android WebView**:
     - Academy Arabic/English Alphabets, CVC Builder (`BAT, MAP, PEN, CUP`), Numbers `11..20` (AR & EN), Shapes (all 6 AR & EN), Daily Offline Activities.
     - Level 1 Lessons AR01–AR28 Stage 5 & Stage 10 Q10.
     - `ReadingAdventureScreen` Stage 2 phonics + Stages 7–8 mini-stories & `SmartAdaptiveAssessmentPanel` listening/phonics questions.
     - Teacher Homework (`StudentHomeworkSection`), Assigned Exams (`AssignedExamsSection`), Admin CMS (`AdminCmsPanel`).
     - Quran Reader & Quran Story narration players.
