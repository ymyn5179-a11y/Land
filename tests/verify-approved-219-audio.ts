import assert from 'node:assert';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import {
  ACADEMY_LOOKUP_FILE,
  ACADEMY_MANIFEST_FILE,
  validateAcademyMp3File,
} from '../server/academyAudioService';
import type { AcademyAudioManifestDocument } from '../server/academyAudioManifestBuilder';
import academyAudioLookup from '../src/data/academyAudioLookup.json';
import {
  AcademyAudioController,
  resolveAcademyPlaybackUrls,
  resolveAcademyRecordingUrl,
} from '../src/utils/academyAudioController';
import { normalizeAcademyAudioText } from '../src/utils/academyAudioText';

function sha256Buffer(buf: Buffer): string {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function sha256File(filePath: string): string {
  return sha256Buffer(fs.readFileSync(filePath));
}

async function waitForReady(baseUrl: string): Promise<void> {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${baseUrl}/api/health`);
      if (r.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Isolated test server at ${baseUrl} did not become ready`);
}

function stopChild(proc: ChildProcess) {
  try {
    if (proc.pid) process.kill(-proc.pid, 'SIGTERM');
  } catch {
    try {
      proc.kill('SIGTERM');
    } catch {
      // ignore
    }
  }
}

class MockAudioElement {
  static instances: MockAudioElement[] = [];
  static activePlayingCount = 0;

  preload = '';
  src = '';
  currentTime = 0;
  duration = 1.8;
  paused = true;
  defaultPlaybackRate = 1;
  playbackRate = 1;
  attributes: Record<string, string> = {};
  private listeners = new Map<string, Set<() => void>>();

  constructor() {
    MockAudioElement.instances.push(this);
  }

  setAttribute(k: string, v: string) {
    this.attributes[k] = v;
  }

  removeAttribute(k: string) {
    delete this.attributes[k];
    if (k === 'src') {
      this.src = '';
    }
  }

  addEventListener(event: string, cb: () => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
  }

  removeEventListener(event: string, cb: () => void) {
    this.listeners.get(event)?.delete(cb);
  }

  emit(event: string) {
    for (const cb of this.listeners.get(event) || []) {
      cb();
    }
  }

  load() {
    // no-op
  }

  async play(): Promise<void> {
    if (!this.src) {
      throw new Error('Empty src');
    }
    if (this.src.includes('trigger-error')) {
      this.emit('error');
      throw new Error('Failed to load audio');
    }
    if (this.paused) {
      this.paused = false;
      MockAudioElement.activePlayingCount += 1;
    }
    this.emit('loadedmetadata');
    this.emit('canplay');
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      MockAudioElement.activePlayingCount = Math.max(0, MockAudioElement.activePlayingCount - 1);
    }
  }
}

async function run() {
  const root = process.cwd();
  const sheetDir = path.resolve(root, 'generated_audio_sheet2');

  console.log('[1/6] Validating archive generated_audio_sheet2 (219 MP3 files)...');
  const rawEntries = fs.readdirSync(sheetDir);
  const mp3Files = rawEntries.filter((f) => f.endsWith('.mp3')).sort();
  assert.strictEqual(rawEntries.length, 219, `Unexpected entries in archive: ${rawEntries.length}`);
  assert.strictEqual(mp3Files.length, 219, `Expected 219 MP3 files, got ${mp3Files.length}`);

  const manifest = JSON.parse(fs.readFileSync(ACADEMY_MANIFEST_FILE, 'utf8')) as AcademyAudioManifestDocument;
  const lookup = academyAudioLookup as { ar: Record<string, string>; en: Record<string, string> };

  const assetIdOccurrences = new Map<string, number>();
  for (const item of manifest.items) {
    assetIdOccurrences.set(item.assetId, (assetIdOccurrences.get(item.assetId) || 0) + 1);
  }

  const byId = new Map(manifest.items.map((item) => [item.assetId, item]));
  const items219 = mp3Files.map((f) => {
    const id = f.replace(/\.mp3$/, '');
    const item = byId.get(id);
    assert(item, `Missing manifest record for approved asset ${id}`);
    assert.strictEqual(assetIdOccurrences.get(id), 1, `Asset_ID ${id} must appear exactly once in manifest`);
    return item;
  });

  const ar219 = items219.filter((i) => i.language === 'ar');
  const en219 = items219.filter((i) => i.language === 'en');
  assert.strictEqual(ar219.length, 133, `Expected 133 AR files, got ${ar219.length}`);
  assert.strictEqual(en219.length, 86, `Expected 86 EN files, got ${en219.length}`);
  console.log(`   ✓ Verified ${items219.length} unique Asset_IDs (${ar219.length} AR, ${en219.length} EN).`);

  console.log('[2/6] Verifying physical files, original byte SHA-256 parity, and MP3 validity...');
  for (const item of items219) {
    const srcPath = path.join(sheetDir, `${item.assetId}.mp3`);
    const expectedRelPath = `public/assets/audio/academy/${item.language}/${item.assetId}.mp3`;
    assert.strictEqual(item.mp3Path, expectedRelPath);
    assert.strictEqual(item.audioUrl, `/assets/audio/academy/${item.language}/${item.assetId}.mp3`);

    const destPath = path.resolve(root, expectedRelPath);
    assert(fs.existsSync(destPath), `Missing copied file at ${expectedRelPath}`);
    assert.strictEqual(
      sha256File(srcPath),
      sha256File(destPath),
      `SHA-256 byte parity mismatch for ${item.assetId}`,
    );

    const check = await validateAcademyMp3File(destPath, false);
    assert(check.valid, `Invalid MP3 at ${expectedRelPath}: ${check.reason}`);
    assert.strictEqual(check.mimeType, 'audio/mpeg');
    assert.strictEqual(item.validationStatus, 'valid');
    assert.strictEqual(item.generationStatus, 'ready');
    assert.strictEqual(item.bytes, fs.statSync(destPath).size);
  }
  assert(
    !fs.existsSync(path.resolve(root, 'public/assets/audio/academy/en/en_b89f44855c685577.mp3')),
    'Unapproved Group D asset must remain absent',
  );
  console.log('   ✓ All 219/219 files verified on disk with exact SHA-256 byte parity and audio/mpeg headers.');

  console.log('[3/6] Verifying strict language-isolated lookup & controller URL resolution for all 219 items...');
  for (const item of items219) {
    const clean = normalizeAcademyAudioText(item.text);
    const sameLangMap = item.language === 'ar' ? lookup.ar : lookup.en;
    const otherLangMap = item.language === 'ar' ? lookup.en : lookup.ar;
    const otherLang = item.language === 'ar' ? 'en' : 'ar';

    assert.strictEqual(
      sameLangMap[clean],
      item.assetId,
      `Lookup[${item.language}] mismatch for ${item.assetId} ("${clean}")`,
    );
    assert.strictEqual(
      resolveAcademyRecordingUrl(item.text, item.language),
      item.audioUrl,
      `resolveAcademyRecordingUrl failed for ${item.assetId}`,
    );
    assert.deepStrictEqual(
      resolveAcademyPlaybackUrls(item.text, item.language),
      [item.audioUrl],
    );
    // Ensure wrong language never maps to this file's URL
    if (!otherLangMap[clean]) {
      const otherResolved = resolveAcademyRecordingUrl(item.text, otherLang);
      assert.notStrictEqual(
        otherResolved,
        item.audioUrl,
        `Language bleed detected for ${item.assetId} across ${item.language}/${otherLang}`,
      );
    }
  }
  console.log(`   ✓ Verified lookup & strict AR/EN URL resolution for all 219/219 items (lookup ar=${Object.keys(lookup.ar).length}, en=${Object.keys(lookup.en).length}).`);

  console.log('[4/6] Auditing DeepLessonEngine.tsx user-triggered playback wiring...');
  const deepSrc = fs.readFileSync(path.resolve(root, 'src/components/academy/DeepLessonEngine.tsx'), 'utf8');
  assert(!/useEffect\s*\([\s\S]{0,200}academyAudio\.speak/.test(deepSrc), 'DeepLessonEngine must not auto-play via useEffect');
  assert(deepSrc.includes('academyAudio.stop();'), 'DeepLessonEngine must stop audio on stage transition');
  assert(deepSrc.includes('<AcademyAudioBar'), 'DeepLessonEngine must render AcademyAudioBar');
  console.log('   ✓ Verified user-triggered playback, stage-change stop, and zero autoplay.');

  console.log('[5/6] Simulating headless browser playback (click, load, play, ended, switch, rapid clicks, error safety)...');
  const origWindow = (globalThis as Record<string, unknown>).window;
  const origAudio = (globalThis as Record<string, unknown>).Audio;
  (globalThis as Record<string, unknown>).window = globalThis;
  (globalThis as Record<string, unknown>).Audio = MockAudioElement;
  MockAudioElement.instances = [];
  MockAudioElement.activePlayingCount = 0;

  try {
    const ctrl = new AcademyAudioController();
    ctrl.setContext('ar');

    // Representative samples across all 4 DeepLessonEngine modules & both languages
    const sampleAssets = [
      byId.get('ar_cbaa3b5459835e55')!, // Color AR example (explicit example in prompt)
      byId.get('en_9eab27fc049eb940')!, // Color EN intro
      items219.find((i) => i.screens.includes('DeepLessonEngine:arabic') && i.activityOrStageIds.includes('stage1-intro'))!,
      items219.find((i) => i.screens.includes('DeepLessonEngine:english') && i.activityOrStageIds.includes('stage10-reading-1-2'))!,
      items219.find((i) => i.screens.includes('DeepLessonEngine:math') && i.language === 'ar')!,
      items219.find((i) => i.screens.includes('DeepLessonEngine:math') && i.language === 'en')!,
    ];

    for (const s of sampleAssets) {
      const ok = await ctrl.playText(s.text, s.language);
      assert.strictEqual(ok, true, `Failed to start playback for ${s.assetId}`);
      assert.strictEqual(ctrl.getSnapshot().status, 'playing');
      assert.strictEqual(ctrl.getSnapshot().currentUrl, s.audioUrl);
      assert.strictEqual(MockAudioElement.activePlayingCount, 1, 'Exactly one clip must be playing');

      // Trigger natural completion ('ended')
      const activeEl = MockAudioElement.instances[MockAudioElement.instances.length - 1];
      activeEl.pause();
      activeEl.emit('ended');
      assert.strictEqual(ctrl.getSnapshot().status, 'ended');
      assert.strictEqual(MockAudioElement.activePlayingCount, 0);
    }

    // Switching from clip A to clip B stops clip A cleanly
    await ctrl.playText(sampleAssets[0].text, sampleAssets[0].language);
    const firstEl = MockAudioElement.instances[MockAudioElement.instances.length - 1];
    assert.strictEqual(firstEl.paused, false);

    await ctrl.playText(sampleAssets[1].text, sampleAssets[1].language);
    const secondEl = MockAudioElement.instances[MockAudioElement.instances.length - 1];
    assert.strictEqual(firstEl.paused, true, 'Previous clip must pause on clip switch');
    assert.strictEqual(secondEl.paused, false, 'New clip must be playing');
    assert.strictEqual(MockAudioElement.activePlayingCount, 1, 'No overlapping playback on clip switch');

    // Rapid repeated clicks never overlap
    const p1 = ctrl.playText(sampleAssets[2].text, sampleAssets[2].language);
    const p2 = ctrl.playText(sampleAssets[2].text, sampleAssets[2].language);
    const p3 = ctrl.playText(sampleAssets[3].text, sampleAssets[3].language);
    await Promise.all([p1, p2, p3]);
    assert.strictEqual(MockAudioElement.activePlayingCount, 1, 'Rapid clicks must leave at most 1 active playing clip');
    assert.strictEqual(ctrl.getSnapshot().currentUrl, sampleAssets[3].audioUrl);

    // Missing audio & load error handled safely without crashing
    ctrl.stop();
    const missingOk = await ctrl.playText('non-existent-audio-key-219-test', 'ar');
    assert.strictEqual(missingOk, false);
    assert.strictEqual(ctrl.getSnapshot().status, 'error');
    assert.strictEqual(ctrl.getSnapshot().errorCode, 'UNAVAILABLE');

    const errorUrlOk = await ctrl.playText('error-test', 'en', {
      audioUrl: '/assets/audio/academy/en/trigger-error.mp3',
    });
    assert.strictEqual(errorUrlOk, false);
    assert.strictEqual(ctrl.getSnapshot().status, 'error');
    assert.strictEqual(ctrl.getSnapshot().errorCode, 'INVALID_AUDIO');
  } finally {
    (globalThis as Record<string, unknown>).window = origWindow;
    (globalThis as Record<string, unknown>).Audio = origAudio;
  }
  console.log('   ✓ Controller & AudioElement simulation passed (start, ended, AR/EN switch, rapid clicks, error isolation).');

  console.log('[6/6] Verifying live HTTP GET/HEAD/Range delivery for ALL 219 MP3 URLs...');
  const port = 3196;
  const baseUrl = `http://127.0.0.1:${port}`;
  const proc = spawn('npx', ['tsx', 'server.ts', '--port', String(port)], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      PORT: String(port),
      NODE_ENV: 'development',
      SKIP_VITE: '1',
      GEMINI_API_KEY: '',
      SQL_HOST: '',
      SQL_DB_NAME: '',
      SQL_USER: '',
      SQL_PASSWORD: '',
      DATABASE_URL: '',
      REQUIRE_POSTGRES: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    await waitForReady(baseUrl);

    let verifiedHttp = 0;
    const CONCURRENCY = 16;
    for (let i = 0; i < items219.length; i += CONCURRENCY) {
      const chunk = items219.slice(i, i + CONCURRENCY);
      await Promise.all(
        chunk.map(async (item) => {
          const url = `${baseUrl}${item.audioUrl}`;
          const res = await fetch(url);
          assert.strictEqual(res.status, 200, `GET ${item.audioUrl} returned ${res.status}`);
          assert.strictEqual(res.headers.get('content-type'), 'audio/mpeg', `Bad Content-Type for ${item.audioUrl}`);
          assert.strictEqual(res.headers.get('accept-ranges'), 'bytes');
          const netBuf = Buffer.from(await res.arrayBuffer());
          const diskBuf = fs.readFileSync(path.resolve(root, item.mp3Path));
          assert.strictEqual(netBuf.length, diskBuf.length, `Length mismatch over HTTP for ${item.assetId}`);
          assert.strictEqual(sha256Buffer(netBuf), sha256Buffer(diskBuf), `HTTP SHA-256 mismatch for ${item.assetId}`);
          verifiedHttp++;
        }),
      );
    }
    assert.strictEqual(verifiedHttp, 219);

    // Check Range 206 on explicit prompt example + EN sample
    for (const sampleUrl of [
      '/assets/audio/academy/ar/ar_cbaa3b5459835e55.mp3',
      items219.find((i) => i.language === 'en')!.audioUrl,
    ]) {
      const r206 = await fetch(`${baseUrl}${sampleUrl}`, {
        headers: { Range: 'bytes=0-1023' },
      });
      assert.strictEqual(r206.status, 206, `Range 206 failed for ${sampleUrl}`);
      assert.strictEqual(r206.headers.get('content-type'), 'audio/mpeg');
      assert.strictEqual((await r206.arrayBuffer()).byteLength, 1024);
    }

    // Check manifest API reports updated counts
    const mRes = await fetch(`${baseUrl}/api/academy/audio-manifest`);
    assert.strictEqual(mRes.status, 200);
    const mJson = (await mRes.json()) as { validCount: number; totalAssets: number; needsReviewCount: number };
    assert.strictEqual(mJson.totalAssets, 1500);
    assert.strictEqual(mJson.validCount, manifest.validCount);
    assert.strictEqual(mJson.needsReviewCount, 4);

    console.log(`   ✓ Verified ALL 219/219 HTTP URLs (200 audio/mpeg, exact byte parity, 206 Range, manifest API validCount=${mJson.validCount}).`);
  } finally {
    stopChild(proc);
  }

  console.log('\n✅ Approved 219 Academy Audio Integration Verification PASSED');
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
