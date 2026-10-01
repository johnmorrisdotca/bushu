# Notice: the data's licences

The code of this package is under the MIT licence (see [LICENSE](LICENSE)). The data in `src/data/` (and `dist/data/`) is other people's
work, under their licences, which travel with it. Each data file opens with the same notice, written out in full, and the data in it
says which files it was made from, at what address, with what SHA-256, and when.

| Entry point | File | Made from | Terms |
| --- | --- | --- | --- |
| `radkfile` | `src/data/radkfile.data.ts` | RADKFILE and KRADFILE, of the Electronic Dictionary Research and Development Group (EDRDG) | CC BY-SA 4.0 and the Group's conditions |
| `strokes` | `src/data/strokes.data.ts` | KANJIDIC2, of the same Group | CC BY-SA 4.0 and the Group's conditions |
| `names` | `src/data/names.data.ts` | the radicals table of Kanji alive | CC BY 4.0 |
| `.`, `picker`, `element` | everything else in `src/` | this package | MIT |

The shapes table (`RADICAL_FORMS`, which turns a RADKFILE key such as 汁 into the shape people see, 氵), the two stroke corrections
and the picker are the package's own work and MIT. They are checked against EDRDG's data, not made from it.

## The EDRDG files: RADKFILE, KRADFILE and KANJIDIC2

The radicals, the kanji that hold them and the stroke counts are the property of the Electronic Dictionary Research and
Development Group (https://www.edrdg.org/). They are used under the Creative Commons Attribution-ShareAlike 4.0 licence
(https://creativecommons.org/licenses/by-sa/4.0/) and the Group's conditions: https://www.edrdg.org/edrdg/licence.html (read 2026-10-01).
RADKFILE and KRADFILE are by Michael Raine, James Breen and the Group (https://www.edrdg.org/krad/kradinf.html); KANJIDIC2 is described at
https://www.edrdg.org/wiki/index.php/KANJIDIC_Project. The data in this package is derived from them and is shared under the same
licence. Copyright in the files remains the Group's, and nobody who uses this data may claim it.

What the Group's conditions ask, and where this package does it:

- **Acknowledge the source** in the documentation and the site of whatever uses the files: the README's Licence section, this file, the head of each data
  file, and the footer of the demo do. A page that shows a kanji or a radical from this data should say so in a line of its own, such as:
  *Radicals and kanji from RADKFILE and KANJIDIC2, the property of the Electronic Dictionary Research and Development Group, used under
  the Group's licence (https://www.edrdg.org/edrdg/licence.html).*
- **Provide the licence and documentation**, or links to them: this file and the links above, shipped in the package.
- **Share alike**: the data files are CC BY-SA 4.0. Code that merely imports them is not changed by that and stays under its own licence.
- **Keep it current.** The Group asks that a package using its files has a procedure for updating them at least once a month, and a program
  built on it should take the newest release of this package. `.github/workflows/radkfile-refresh.yml` fetches the three files on the 1st of every month and, if
  a file has changed, leaves the new data on a branch and fails on purpose, so that the change is landed as a patch release.

| File | Address | The date the file gives itself | SHA-256 of the file as served | Retrieved |
| --- | --- | --- | --- | --- |
| RADKFILE | http://ftp.edrdg.org/pub/Nihongo/radkfile.gz | October 2013 (last line of its header) | `20baf276a98173466c29c373668e044719809f510487695fe40abfd0269a004e` | 2026-10-01 |
| KRADFILE | http://ftp.edrdg.org/pub/Nihongo/kradfile.gz | March 2023 (last line of its header) | `0c5487c1de77e36ffb5bde652f469f2de9c52efc8320137c115506f3500e9c5f` | 2026-10-01 |
| KANJIDIC2 | http://www.edrdg.org/kanjidic/kanjidic2.xml.gz | file version 4, database version 2026-274, created 2026-10-01 | `1c60c9453e1c7a318f3492fd8e13ea792d20130402bcbce9ed84e6165dfa1d60` | 2026-10-01 |

RADKFILE and KRADFILE say the same thing from two sides, radical by radical and kanji by kanji. The build checks that they agree on every one of the 6,355
kanji and refuses to write anything if they do not.

## Kanji alive: the school names of the radicals

`names` is derived from the radicals table of Kanji alive, by Harumi Hibino Lory and Arno Bosse of the University of Chicago
(https://kanjialive.com), read from one commit of https://github.com/kanjialive/kanji-data-media (`e1e24d39fc43e839948a8c7e99743b0994dedad5`,
2026-09-04). It is used under the Creative Commons Attribution 4.0 International licence (https://creativecommons.org/licenses/by/4.0/;
the repository's README and LICENSE.md, read 2026-10-01): *This work by Kanji alive is licensed under a Creative Commons Attribution 4.0
International License.* The data here is changed from the original (the rows are matched to RADKFILE's radicals and trimmed to a name, its
romaji, an English meaning, a position and a Kangxi number), and carries the same licence.

| File | Address | SHA-256 | Retrieved |
| --- | --- | --- | --- |
| japanese-radicals.csv | https://raw.githubusercontent.com/kanjialive/kanji-data-media/e1e24d39fc43e839948a8c7e99743b0994dedad5/language-data/japanese-radicals.csv | `7c24ce865b286576d4239d5d9d3811c21c4f022afd764472cdde7894bb0df8b0` | 2026-10-01 |
| japanese-radicals-ids.csv | https://raw.githubusercontent.com/kanjialive/kanji-data-media/e1e24d39fc43e839948a8c7e99743b0994dedad5/language-data/japanese-radicals-ids.csv | `ac1bf5273527e35fc15e1de34cc20c39af06416993d29d69432706a08848299b` | 2026-10-01 |

The Kanji alive repository also holds fonts, audio, animations and pictures, under other terms (its README says which). None of them is used here.

## What is not here

No dictionary course's names, mnemonics, hints, identifiers or levels for radicals or kanji, and nothing from any service that asks for a licence to
copy them. The Japanese names are the ones a school teaches, from the source above, and the English meanings are Kanji alive's. A test reads every file of
the repository for such content before every release.

## Making the data again

```sh
node scripts/build-data.mjs                  # RADKFILE, KRADFILE and KANJIDIC2 from EDRDG: src/data/radkfile.data.ts and strokes.data.ts
node --experimental-strip-types scripts/build-names.ts   # the names, from the pinned commit of Kanji alive: src/data/names.data.ts
```

Both are deterministic: the same files make the same bytes, and a file whose SHA-256 is unchanged keeps its `retrieved` date. `--from DIR` reads
saved copies instead of fetching, and `--date YYYY-MM-DD` says the day retrieved.
