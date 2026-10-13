---
title: Troubleshooting and FAQ
section: troubleshooting
order: 8
description: Explain empty matches, unnamed parts, missing stroke counts and asynchronous browser data.
---

## Empty results and missing metadata

| Result | Meaning |
| --- | --- |
| `kanjiForRadicals` returns `[]` | No choice, an unknown key, or no kanji containing all parts. |
| `radicalName` / `radicalNameEntry` returns `null` | The school-name table has no entry for that key. |
| `radicalNameForShape` returns `null` | The displayed shape has no matching named entry. |
| `strokesOf` returns `null` | The character is outside the bundled stroke index. |
| `usableRadicals` keeps only chosen keys | No current match allows another part; removal remains available. |

Check RADKFILE keys before sending pure functions display forms. The native picker performs its supported key/form normalization at its boundary. Do not merge 邦/阡 into one stored key because they share 阝.

## Loading and rendering

Await `loadBushuData` before mounting with its data. Import failures are exceptions to handle at the host boundary. Custom elements load asynchronously; use their native load/error events and documented getters rather than reading during construction. A narrow display or the default 120-result limit can show fewer tiles than `matches()` returns. Browser mounting requires a real element; destroy it on removal.
