---
title: Upgrading within 1.x
section: upgrading
order: 9
description: Preserve native keys, index versions, callbacks and license notices.
---

## This documentation update

The rollout preserves the 1.0.2 SDK, data and import paths. Existing API anchors remain. The source comments now document every public export and supply checked native examples. Browser-only examples are typechecked with `ts no-run`.

## Updating a saved lookup

Keep the original radical keys, selected character and index version. A data refresh may change membership or names, so retest saved lessons against the chosen version. Display forms do not uniquely identify a key: 邦 and 阡 are distinct even though both draw 阝. Raw RADKFILE counts remain raw; use the native correction helpers for the grid.

## Replacing a host picker

Use the pure functions first to verify your index and order, then mount the native picker. Keep host data loaders and persistence in host code. Compare callback detail, initial choices, display limits and cleanup. Preserve `NOTICE.md`, source hashes and the bundled data’s licence obligations when distributing data. The [changelog](../../CHANGELOG.md) records package changes.
