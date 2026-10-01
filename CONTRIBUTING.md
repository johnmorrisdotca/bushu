# Contributing

Ideas, bug reports and pull requests are welcome in the
[issues](https://github.com/johnmorrisdotca/bushu/issues).

## Working on it

```sh
pnpm install
pnpm check          # lint, types and tests: the data checked against itself, the lookup, the shapes, the names, the strokes
pnpm test:package   # pack it as npm does, install it in an empty project, import every entry
pnpm test:demo      # build the demo and play it in a real browser, at a phone's width and a desk's
pnpm docs:make      # rewrite docs/strings-ja.md after changing a word of the picker
pnpm data           # make src/data/ again from EDRDG's files and Kanji alive's
```

The data is machine output: change a script in `scripts/` and run it again, never edit a file in `src/data/` by hand. A radical's shape (`RADICAL_FORMS`) or a stroke correction
is a change to `src/forms.ts` with a test that says why, checked against EDRDG's own list. Nothing may be added to the data from a course, a mnemonic list or anything else whose licence does not let it be shipped: a test reads every file for such content,
and the source and licence of anything new go in `NOTICE.md` in the same change.

## House rules, shared by every package of the family

- Open an issue first for anything bigger than a typo, so that we can agree on the shape before you spend time on it.
- No runtime dependencies. Every function that plays or checks a game is pure: it returns new values and never changes what it was given.
- Tests sit beside the code they test. A rule you change has a test that would have caught it.
- Words a player reads come in English and Japanese. If you cannot write the Japanese, say so in the pull request and someone will.
- Option values and names are kebab case.
- Art, sound and data are CC0, public domain, or under a licence that lets them be shipped (credited in `NOTICE.md`), checked at the source. No GPL or LGPL code.
- Needs Node 22 or later. A change a user would notice gets a line in `CHANGELOG.md`.
- **The list of the family in the README is made, not written.** `pnpm family:readme` writes it between its
  markers from `scripts/family-template.mjs` (the names, the Japanese names and a line on each), and
  `scripts/family-readme.mjs` is the same file in every package. To add a package or change a line, change the
  template in every repository, bump `FAMILY_TEMPLATE_VERSION` and record the new hash in `src/family.test.js`.

## Releasing

A version tag (`v1.2.3`, the same as `package.json`'s version) runs
`.github/workflows/release.yml`: it checks and builds the package, attaches the
tarball to a GitHub release, and publishes it to npm by trusted publishing,
with no token. Write the release in `CHANGELOG.md` first.
