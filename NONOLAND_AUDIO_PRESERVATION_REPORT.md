# NONOLAND Audio Preservation Report

Generated: 2026-11-24T14:06:47.098Z
Audit Mode: 100% READ-ONLY (zero audio files, code files, manifests, or database records modified)

## 1. Executive Preservation Mandate

Before any consolidated one-time audio production batch runs, the following existing audio assets MUST be preserved strictly untouched (no overwrite, rename, delete, re-encode, or regeneration):

| Asset Group | Directory / Path | File Count | Total Bytes | Preservation Rule |
|---|---|---:|---:|---|
| Arabic Alphabet Letter Names | `public/assets/audio/arabic-letters/` | 28 | 204,375 | **PRESERVE 100% UNTOUCHED** — Studio/verified 44.1 kHz MP3s mapped in `src/utils/arabicLetterAudioMap.ts` |
| Foundations Curriculum Pack | `public/assets/audio/foundations/` | 1004 | 19,856,592 | **PRESERVE 100% UNTOUCHED** (987 active + 17 quarantined bare-digit files kept intact on disk for hash integrity; quarantined only at resolver level) |
| Quran Stories Narration | `public/assets/audio/stories/` | 41 | 4,053,429 | **PRESERVE 100% UNTOUCHED** — 41 scenes across all 8 stories in `QURAN_STORY_LIBRARY` (plus PostgreSQL/DB story blobs) |
| Quran Recitation & Phrase Assets | Remote Quran Foundation CDN HTTPS URLs + DB `quranContentVerifications` | N/A (HTTPS + DB) | N/A | **PRESERVE 100% UNTOUCHED** — Reciter ID 6 (Al-Husary Al-Muallim), Basmala/Closing phrase gates; never replace with TTS |
| Quran Device Diagnostic Chime | `public/assets/audio/technical-test-chime.wav` | 1 | 26,504 | **PRESERVE 100% UNTOUCHED** — PCM WAV 22.05 kHz diagnostic test sample |
| Valid Academy Subdir Assets | `public/assets/audio/academy/{ar,en}/` | 26 | 384,018 | **PRESERVE 22 valid entries**; quarantine/review only the 4 `needs-review` bare Arabic letters (`ب`, `ش`, `ل`, `و`) after wiring Level 1 to `arabic-letters/` |
| Legacy Flat-Root Academy Files | `public/assets/audio/academy/*.mp3` | 9 | 110,229 | **DO NOT TOUCH during batch generation** (8 are exact SHA-256 duplicates of `academy/ar/`; 1 is unreferenced `f46e6136b2c1bae1b720c85d1ade.mp3`) |
| **TOTAL ON DISK** | `public/assets/audio/**` | **1109** | **24,635,147** | **All 1,109 files returned HTTP 200, valid magic bytes, 0 ffprobe errors** |

## 2. Exact SHA-256 Inventory — 28 Arabic Letter Recordings (PRESERVE)

| Path | Bytes | SHA-256 |
|---|---:|---|
| `public/assets/audio/arabic-letters/01_alif_name.mp3` | 7254 | `ac04aceb682ca5a422d11a0d98bbf3c835ac8ef9d0524f43f9b4340893272b08` |
| `public/assets/audio/arabic-letters/02_baa_name.mp3` | 7568 | `813a2565028af8526c3342b789566094766f3034bdf5c34a67cb5f73cf5a234a` |
| `public/assets/audio/arabic-letters/03_taa_name.mp3` | 5060 | `a4174085782710619be02b7348b6eb17b7ac888ea11517297af4a808eaa17f52` |
| `public/assets/audio/arabic-letters/04_thaa_name.mp3` | 6627 | `e51996ab4d3ca83d4cd7f80679ba36fa09271b676387bd4faaba0009c7121528` |
| `public/assets/audio/arabic-letters/05_jeem_name.mp3` | 8195 | `3c88becc542b303a2a9922fa12a1b1d775eecda3e86b1b08df489c4e9899ef2a` |
| `public/assets/audio/arabic-letters/06_haa_name.mp3` | 6941 | `a63e9c5e7f9ac0994d641c0a7b6b86703903fd3679bf8ed8289834530bdc606e` |
| `public/assets/audio/arabic-letters/07_khaa_name.mp3` | 6627 | `41847d23952ac33b43f3b0788768ada59df1f36e7c47946c0dc6649ddabf1bd3` |
| `public/assets/audio/arabic-letters/08_dal_name.mp3` | 6941 | `5acaf5b19ea94f2e995bf9b3dce8641bb52fca8ce80ba4d3b992441129b19a28` |
| `public/assets/audio/arabic-letters/09_thal_name.mp3` | 8822 | `fbf4fc8e2ec67b95490e783dbab15f717df700cd20830f4a32da30dcbbc30103` |
| `public/assets/audio/arabic-letters/10_raa_name.mp3` | 8195 | `ea30473bfa356b85e384276fa31bc8fde423ccd7685fae9007b0c8c8b271bace` |
| `public/assets/audio/arabic-letters/11_zay_name.mp3` | 7568 | `fe2afadce64923fd3b46c42a7d42b38c9e549423310f0e84ccc8b9717adcc38c` |
| `public/assets/audio/arabic-letters/12_seen_name.mp3` | 6941 | `a7f64d577f3106e7b2f2e34bf9041951d8b1f2d9a19cb5040c8d3ba94bbc6554` |
| `public/assets/audio/arabic-letters/13_sheen_name.mp3` | 7881 | `612b4eec017f178bdc92d170f29cf0a69a250392acb958fdbe30afde666835c1` |
| `public/assets/audio/arabic-letters/14_sad_name.mp3` | 7881 | `7b9af26e320790d677fab2ac3c5d0877897721ac5fdf816762a5edc06a77ae64` |
| `public/assets/audio/arabic-letters/15_dad_name.mp3` | 6627 | `379337a3c3470db136ef7432807562c7b0aa76deadd8a752eb9823c8dd385e7d` |
| `public/assets/audio/arabic-letters/16_taa2_name.mp3` | 5687 | `3324ea603ceecc7d1cffd00670a8b5fc9c670a48c8870d9ddf8481f1b8ab73fe` |
| `public/assets/audio/arabic-letters/17_zaa_name.mp3` | 6000 | `fcd970866af20b77acb1157e75c5d8a95b48116527095b4bfe9cdf22e6758fd2` |
| `public/assets/audio/arabic-letters/18_ain_name.mp3` | 8508 | `79203c27ce4d257306f6921b6bf6cab78b6218a44becb6e420998f51603cd169` |
| `public/assets/audio/arabic-letters/19_ghain_name.mp3` | 8822 | `56faa6d74896038d6a626e1cfa98e8cd795d534a594ba27c99ed448335ff06b3` |
| `public/assets/audio/arabic-letters/20_faa_name.mp3` | 7881 | `94260980e653a6222479a2a3a59f4865f36f4f844ada44509ff8f8a6be9d0f6f` |
| `public/assets/audio/arabic-letters/21_qaf_name.mp3` | 5374 | `08e8b43541044e8e47636029ab9aad3d589cae7a380e4a6ba3c2b0131cbc0e4b` |
| `public/assets/audio/arabic-letters/22_kaf_name.mp3` | 7568 | `036067b961b738466ae3c797cc41eecb21233660cc97a85d9fd43e2948e0a631` |
| `public/assets/audio/arabic-letters/23_lam_name.mp3` | 6941 | `f822c889f74c6c01742f9538d8e4318eb035a281701be0516eb6090ce08d5fbb` |
| `public/assets/audio/arabic-letters/24_meem_name.mp3` | 8508 | `21c7d1d930a12984e8632c429cd7fd25fa428f2289cd02666d2c576e0f946b7a` |
| `public/assets/audio/arabic-letters/25_noon_name.mp3` | 9135 | `d1868dbf2a4ddf1ee3e3daeec0527c0fe7106aa2fb31dac591916b3c39b165ba` |
| `public/assets/audio/arabic-letters/26_haa2_name.mp3` | 5687 | `744cb4e6d1e3e8ab846a50b7361ce6937f0d0cfcf567882d730ad9153605d973` |
| `public/assets/audio/arabic-letters/27_waw_name.mp3` | 6941 | `0b1a6e4305a2d43d1c75e77af4b33df03953f756336cbf36d8c301da2b8b4b08` |
| `public/assets/audio/arabic-letters/28_yaa_name.mp3` | 8195 | `cc2ab1bf1215bf7b6f017e0a5763ae31d544a94dde6b8b15702ccda143db2ad2` |

## 3. Exact SHA-256 Inventory — 41 Quran Story Scene Recordings (PRESERVE)

| Path | Bytes | SHA-256 |
|---|---:|---|
| `public/assets/audio/stories/qstory-ant/ant-s1.mp3` | 101805 | `7dfaadc579c7f2a502f719cd82e1259e7c29328b4734eff2843a9e74a9e3e7c5` |
| `public/assets/audio/stories/qstory-ant/ant-s2.mp3` | 108909 | `8e281bd68750f49e2d6d262c40548c4ff9844716efee3b446571a286a3a01db4` |
| `public/assets/audio/stories/qstory-ant/ant-s3.mp3` | 105645 | `d8f1f89035400e182ffc16a79070e01fa072b3c973d9e368fece44700e808104` |
| `public/assets/audio/stories/qstory-ant/ant-s4.mp3` | 89901 | `f381c53b2b4451be1222355af5e66b2e3d54d44eb130f210deafa99ae0e648be` |
| `public/assets/audio/stories/qstory-ant/ant-s5.mp3` | 77805 | `f6eaca2bb5a9c6af845dc87567c0dbfd3a4eead45f516f8fe5b33cab899ce621` |
| `public/assets/audio/stories/qstory-cave/cave-s1.mp3` | 107949 | `8cb0ec4429b0e1940216a28d6634eaa8a4e9e07b37e689bc7bc6e5c63eaa497d` |
| `public/assets/audio/stories/qstory-cave/cave-s2.mp3` | 111789 | `e08704fdb2b5d75e80a78175743e458ee5bd5395509f6459f2bed3b7ac3dbcd2` |
| `public/assets/audio/stories/qstory-cave/cave-s3.mp3` | 113901 | `3d202713ef694f0f71b74e681d6412a8d8102cef9550d23835225ee085b6d80d` |
| `public/assets/audio/stories/qstory-cave/cave-s4.mp3` | 98541 | `83b6de937540be9c9ba1a2b802460da7932efd207f46a5bb1325a6c330a0b6a9` |
| `public/assets/audio/stories/qstory-cave/cave-s5.mp3` | 122925 | `76ed31b2c917734dc497bb256117721ba1a3589dfe19a1fc34f824d6d16fb87d` |
| `public/assets/audio/stories/qstory-elephant/elephant-s1.mp3` | 101229 | `802e8d0c4c40b1336de4c66bb479396332c920ba2db13b6ad9a4de9c6adc33a9` |
| `public/assets/audio/stories/qstory-elephant/elephant-s2.mp3` | 99309 | `37c0becd7c0cb2e7ec40fe21b77f3eee64689661b8ccc45d2406ac2fd24bd0c1` |
| `public/assets/audio/stories/qstory-elephant/elephant-s3.mp3` | 84141 | `8597bd71cf75dfd2a55b5cfec7871775c317669c37cdbca5a0c8dbc0be5e7853` |
| `public/assets/audio/stories/qstory-elephant/elephant-s4.mp3` | 105069 | `e8011cb03defe01a36f90ac48c954abadaae2b1f04ed0ba8377d8d973d79e411` |
| `public/assets/audio/stories/qstory-elephant/elephant-s5.mp3` | 91629 | `86abbddaae23777f57ea986b275eb9f5a1bf54f72789842eff55319c066d0830` |
| `public/assets/audio/stories/qstory-ibrahim/ibrahim-s1.mp3` | 190701 | `408b3edc6a2960701a3a835a94cf46839843f55e3a69acc689c6e446755a3723` |
| `public/assets/audio/stories/qstory-ibrahim/ibrahim-s2.mp3` | 123885 | `ffefbe29b74f11dbbff1c0c4ad750eb71561761937e025f10b82cc855ee210c5` |
| `public/assets/audio/stories/qstory-ibrahim/ibrahim-s3.mp3` | 95085 | `67c1816e64a36ce123ac2e78e25e2ce7342a2d6f95fbfda918e681480827ac32` |
| `public/assets/audio/stories/qstory-ibrahim/ibrahim-s4.mp3` | 117741 | `7b28ca95e21655b1e091c84eb16b25a8f88ece3c22be754f0826e3a60ec89271` |
| `public/assets/audio/stories/qstory-ibrahim/ibrahim-s5.mp3` | 95661 | `6d4457714bb50dca558ff142d5f1b830b22a80540a0f226e884d86158256b1a2` |
| `public/assets/audio/stories/qstory-kind-brothers/yusuf-s1.mp3` | 118701 | `76d9332364b6b24a580c808c602fc33462210ca28036f752488ad4404eaef389` |
| `public/assets/audio/stories/qstory-kind-brothers/yusuf-s2.mp3` | 85869 | `b2973305643c9cc62cb14717e705cc9bb077d920e11717831c7323a8130a510c` |
| `public/assets/audio/stories/qstory-kind-brothers/yusuf-s3.mp3` | 87981 | `ced84b65ed59dd1abcaf68de3c0f2b2c8ef90c0ba3a0defbec9d522a3cdab262` |
| `public/assets/audio/stories/qstory-kind-brothers/yusuf-s4.mp3` | 70701 | `b27645e95c2549a106a6c0db9fd3d319a79574849ee3a624aa28dc7d33e11092` |
| `public/assets/audio/stories/qstory-kind-brothers/yusuf-s5.mp3` | 98349 | `442f496f3c56443ec9c14dfcdbce706dfe466c6da0028ef912fc172233844c78` |
| `public/assets/audio/stories/qstory-kind-brothers/yusuf-s6.mp3` | 81645 | `4113b0b3d5a38c5c9c335909a96f2df706a6450039fd9faa1b229b58e247e9f9` |
| `public/assets/audio/stories/qstory-musa/musa-s1.mp3` | 114861 | `d583c9efc4515d1c2ba377126d7968634777124f148b98765a5355cbbcde4ebb` |
| `public/assets/audio/stories/qstory-musa/musa-s2.mp3` | 83181 | `996039498364771bf91ec417cbf0b190da0324637e8bfb3a8aaebb9dd87876e7` |
| `public/assets/audio/stories/qstory-musa/musa-s3.mp3` | 83565 | `32809774d5b1b74dd5a5aa37583995ad038717085b4c4c4af6b57de87d219325` |
| `public/assets/audio/stories/qstory-musa/musa-s4.mp3` | 72621 | `f7a7305ba38bf21b5189e1d236102803e8cecfd58ed6b6b84c027464d5aa6fc9` |
| `public/assets/audio/stories/qstory-musa/musa-s5.mp3` | 99309 | `8f0ae122f1926113dd8129751187966f6d30a0b0bfc762461a20a227eddafd2c` |
| `public/assets/audio/stories/qstory-nuh-ark/nuh-s1.mp3` | 105261 | `4a891537aeb153917812dc7eec7e0cb0b3d60f7fa76263fecd1b31e791999b20` |
| `public/assets/audio/stories/qstory-nuh-ark/nuh-s2.mp3` | 80301 | `5784e4d05856ce51aeeacfcda92e2e01aaa6297b803e36222662d42ed74ea13a` |
| `public/assets/audio/stories/qstory-nuh-ark/nuh-s3.mp3` | 117741 | `e365019f4a47c0acc4f0202dddca883feae4aa613154d03f01e71cb7417fb852` |
| `public/assets/audio/stories/qstory-nuh-ark/nuh-s4.mp3` | 76845 | `d42281b4da42010966c135f56b4706c88278d5a913cd96581aa37a7fbf3fbc55` |
| `public/assets/audio/stories/qstory-nuh-ark/nuh-s5.mp3` | 78381 | `69e3d3e1c20632bd4ea40bc96cade53430f8386bd52896d8024b3fefd016ec19` |
| `public/assets/audio/stories/qstory-yunus/yunus-s1.mp3` | 97389 | `8415ca88eb5476ba453f7064575cfa77b45d3f20049e4cfc04fc3272fbd475d5` |
| `public/assets/audio/stories/qstory-yunus/yunus-s2.mp3` | 96045 | `9e30ee0346d609e81023e0ca6271b6428e2a39b0bada9b4168bbc5e8b527bfe6` |
| `public/assets/audio/stories/qstory-yunus/yunus-s3.mp3` | 84141 | `ba0aaa9307427380ccd2f4c3488bf5f3955f5f09f12dcf02061eabb3c3582a2a` |
| `public/assets/audio/stories/qstory-yunus/yunus-s4.mp3` | 97581 | `78b41ebc7c96728657fea1bd39b0de091afbc34b9984fcd122462b4038a687ac` |
| `public/assets/audio/stories/qstory-yunus/yunus-s5.mp3` | 79341 | `2af131cccf48d70ceaa424c87835ad9147e325c9ab1a23a21359e63479a2f335` |

## 4. Exact SHA-256 Inventory — Technical Diagnostic Sample (PRESERVE)

| Path | Bytes | SHA-256 |
|---|---:|---|
| `public/assets/audio/technical-test-chime.wav` | 26504 | `edb08037543ec1154832abfe6d35cedb5099a95fd7a286963c58e7ce3b25e6ad` |

## 5. Exact SHA-256 Inventory — 35 Academy Assets (`academy/{ar,en}` + Legacy Root)

| Path | Bytes | SHA-256 | Status |
|---|---:|---|---|
| `public/assets/audio/academy/08f03efed60b83de6a0a62b68cf3.mp3` | 7341 | `87886c55e917cada6f95947af1dcbdf75cae32ea6ef43ccb9bec46119d53177e` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/191aabfa56bb2eafcb31fb63a6b0.mp3` | 8685 | `9fc2dae9554edc94153caf3f484c845e6fbd611fd652c044a2312773dcf71494` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/2ddca357fcd93624bc1c5697e85b.mp3` | 12909 | `62be12cabe5f9e4e911619d76723ff26965c1cde3dd67052becf58f2cc9617ee` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/77d6471b0645dc493fa48964eb58.mp3` | 13869 | `f828f5504dcf911ac46f7794fb9988b137f405f0124a74480159c7505ead75ea` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/a02d87de4a963b11922a7bae2356.mp3` | 12525 | `87bf09376607fe1070b088105ee9fd3de711203eb727feac99d6b5e12a6d95a7` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/a1297edee10476b6af806ac1ce89.mp3` | 11565 | `f92a9faa8abc402b2e1add42f085b43b1f89991daae507ed2e7eae9803a75113` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/a284af21095015c691f95dc1ff0e.mp3` | 10221 | `fea399da7d34b7c7401c4d8b4f1c1133391d83ce2763fcdb4158ce01591a0d11` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/a88936da245c6dd0ddd5e1217fdf.mp3` | 9069 | `eb878dd19953b8c8249b961d8f0077d718675fd0d6a683bae33a54d93636fbbd` | Legacy 28-hex root (orphan/duplicate) |
| `public/assets/audio/academy/ar/ar_06a6253b8c83b340.mp3` | 13485 | `bc81c1f68e72278128d9737fc260b00e6ff83c2734378c584b1c5fc63338b639` | PRESERVE |
| `public/assets/audio/academy/ar/ar_08f03efed60b83de.mp3` | 7341 | `87886c55e917cada6f95947af1dcbdf75cae32ea6ef43ccb9bec46119d53177e` | PRESERVE |
| `public/assets/audio/academy/ar/ar_124315331f64f556.mp3` | 9645 | `5200d729cbd01e079bede071c659c85f844611a877ef8a6346b2b4eeadb2c96f` | PRESERVE NOW — flagged needs-review bare letter |
| `public/assets/audio/academy/ar/ar_1805c83e5c26e5c9.mp3` | 76461 | `b4a177a9a4d9f2df0ec1e8beff3c56cef036e74a8c120f5535f85e25de3ce835` | PRESERVE |
| `public/assets/audio/academy/ar/ar_191aabfa56bb2eaf.mp3` | 8685 | `9fc2dae9554edc94153caf3f484c845e6fbd611fd652c044a2312773dcf71494` | PRESERVE |
| `public/assets/audio/academy/ar/ar_1a689dbb6d94d825.mp3` | 15021 | `bf7425fdf5e7096e201feb12cbfddd6f2e3e500ea5bc9a5622668250031c26ff` | PRESERVE |
| `public/assets/audio/academy/ar/ar_221094f8f0627253.mp3` | 10221 | `7f56cd702ebe1c2367633824aca70ee3719e8e984feb92864a2fbb1a38973948` | PRESERVE |
| `public/assets/audio/academy/ar/ar_24be271a98354ce7.mp3` | 10221 | `e1149eb916c73ff82e327f3e9cbeaa8e3ef1e043cfc35db3cfd4b7dc8b9b91b4` | PRESERVE NOW — flagged needs-review bare letter |
| `public/assets/audio/academy/ar/ar_2c9d8459c04bb452.mp3` | 9069 | `cb350dfd9a7d5e27156d75eab273573787988bb236f6781877375abdc82f9740` | PRESERVE |
| `public/assets/audio/academy/ar/ar_2ddca357fcd93624.mp3` | 12909 | `62be12cabe5f9e4e911619d76723ff26965c1cde3dd67052becf58f2cc9617ee` | PRESERVE |
| `public/assets/audio/academy/ar/ar_2e2465131066384f.mp3` | 12141 | `7cf47b70144badab670327a32f98273c01a3c1176df3fa75aa206b4d47f7dd3c` | PRESERVE |
| `public/assets/audio/academy/ar/ar_3da379c5286af722.mp3` | 13869 | `b999ae5c3bbb1a54c636058fb6057387f99cedda17ed83918e67c1b720d88fd9` | PRESERVE |
| `public/assets/audio/academy/ar/ar_42f9bf089dc3e0e5.mp3` | 10029 | `16b6a3c9379415b44a71c4dad8912cb9e58eb1cdff35010d7eea9a0b9bf5ccc1` | PRESERVE NOW — flagged needs-review bare letter |
| `public/assets/audio/academy/ar/ar_57e3904b559f2801.mp3` | 9645 | `c7e44a60a2c6a6b3b62d3233750561f8e8a14b30c6ed56b15cf950e69345989f` | PRESERVE |
| `public/assets/audio/academy/ar/ar_5ecbdb9ae9d6b65b.mp3` | 12525 | `e322f9b7c4ca75bd7d5c120bb0565db87774aba85aa3d9bb10cfe42dfabe00d6` | PRESERVE |
| `public/assets/audio/academy/ar/ar_621baa63ab4b6057.mp3` | 11565 | `b8e79d2eb086162dec99c018607a6eb026066e80ad14f668a3c56633ec925abe` | PRESERVE |
| `public/assets/audio/academy/ar/ar_649547725a6e1a19.mp3` | 10989 | `025a1635554d72c74b53d706040bd9399d3133aaa2c6559dcb706f2b9d243449` | PRESERVE |
| `public/assets/audio/academy/ar/ar_6ab91a830a10630e.mp3` | 37869 | `114b2f7d03cb6a7f4b97fb5ef91c62939a60b0d37c3ce8026e460bb250a5b288` | PRESERVE |
| `public/assets/audio/academy/ar/ar_77d6471b0645dc49.mp3` | 13869 | `f828f5504dcf911ac46f7794fb9988b137f405f0124a74480159c7505ead75ea` | PRESERVE |
| `public/assets/audio/academy/ar/ar_a02d87de4a963b11.mp3` | 12525 | `87bf09376607fe1070b088105ee9fd3de711203eb727feac99d6b5e12a6d95a7` | PRESERVE |
| `public/assets/audio/academy/ar/ar_a1297edee10476b6.mp3` | 11565 | `f92a9faa8abc402b2e1add42f085b43b1f89991daae507ed2e7eae9803a75113` | PRESERVE NOW — flagged needs-review bare letter |
| `public/assets/audio/academy/ar/ar_a284af21095015c6.mp3` | 10221 | `fea399da7d34b7c7401c4d8b4f1c1133391d83ce2763fcdb4158ce01591a0d11` | PRESERVE |
| `public/assets/audio/academy/ar/ar_a88936da245c6dd0.mp3` | 9069 | `eb878dd19953b8c8249b961d8f0077d718675fd0d6a683bae33a54d93636fbbd` | PRESERVE |
| `public/assets/audio/academy/ar/ar_b978484d592673f6.mp3` | 10605 | `db098abc362742dcc41b31718aa96c7440f225f0ec9d3da2d86fd8e95005abc6` | PRESERVE |
| `public/assets/audio/academy/en/en_12c175859ab7fef0.mp3` | 12141 | `deaff2a490c3ecbfd6624008e0d412055b057cca691cad42103d633cc661c6b3` | PRESERVE |
| `public/assets/audio/academy/en/en_53023074974c00e2.mp3` | 12333 | `a1012fe28e5b771aa5382359e09c7dfdaf555c573a3c2f409c52f1143b8b06c8` | PRESERVE |
| `public/assets/audio/academy/f46e6136b2c1bae1b720c85d1ade.mp3` | 24045 | `3daf22a5e13da2791cb3a6402fda7d13fd7f1e54138addf6b373834087cb9a73` | Legacy 28-hex root (orphan/duplicate) |

## 6. Foundations Pack (`public/assets/audio/foundations/` — 1,004 Files, PRESERVE)

- **File Count**: 1004 MP3 files (529 `ar_*.mp3` + 475 `en_*.mp3` filenames; inventory classification: 529 AR / 475 EN).
- **Total Size**: 19,856,592 bytes.
- **Source Verification**: 100% byte-for-byte identical (0 SHA-256 mismatches) to `generated_audio/*.mp3` (1,004 files).
- **Combined Directory SHA-256 Digest (sorted filename:sha256 manifest hash)**: `de7ab266800381d974994283b3e21ed6721dfd94f88fec14122c5cc8a7b01813`
- **Quarantined Subset (17 files — preserve file on disk, keep excluded from resolver)**: `ar_0837a804c0b540f4`, `ar_1826639d324d6df0`, `ar_26f5fe7f813c4efe`, `ar_3d2d45e7876fe761`, `ar_45c601121089575d`, `ar_4ea604ce7c5164ec`, `ar_5ddf71193434bb33`, `ar_5e126da4cd96c4e9`, `ar_732ba60efb9ff014`, `ar_8f9b0ba72633938d`, `ar_a6338d7cc6915fd1`, `ar_b1ae65dd508469d9`, `ar_b2fc87feafcf8025`, `ar_bf19a297a203a32f`, `ar_bfbb909231056fda`, `ar_d41e9709e9ea2e5b`, `ar_e25237a6a1f1f17e`

## 7. Quran Recitation Boundaries

- Quran Surahs (Reciter ID 6 — Mahmoud Khalil Al-Husary Al-Muallim) are resolved via Quran Foundation CDN HTTPS URLs managed in `server/quranAudioProvider.ts` and `server/quranRoutes.ts`, governed by admin release verification (`quranContentVerifications`).
- Quran Story narration (`public/assets/audio/stories/{storyId}/{sceneId}.mp3`) is strictly separated from Quran recitation (`QURAN_STORY_LIBRARY`, 8 stories / 41 scenes — note `qstory-ibrahim/ibrahim-s1` and `qstory-cave/cave-s5` are preserved on disk and subject to editorial status checks in `storyAudioService.ts`).
- Do NOT pass any Quran recitation verse, Surah, Basmala, Closing phrase, or Quran story scene into Academy TTS generation.
