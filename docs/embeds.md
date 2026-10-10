# Radical picker embeds

The shared builder covers every observed attribute and explicitly explains host-only data/callback options. Choose parts, an initial kanji, the result limit, language, size, width, theme and label. All settings stay in the URL, including cleared defaults. Copied imports use the installed package's major version.

Parts, kanji, limit, size, width, theme and label have reflected properties; native lang already reflects its attribute. picker remains the structured mounted handle, with toggle, clear and select unchanged. definePicker(tagName?, registry?) is idempotent and server-safe; custom names receive a subclass. options accepts host radicals, names, strokes and callbacks. Callback/appearance changes preserve the current selection. Data reloads are revision-guarded across disconnects; failures produce a status and bushu-error.

The default picker loads its bundled data lazily. Native bushu-change and bushu-pick keep their structured detail and now compose across shadow roots. bushu-load gives the chosen radicals and match count; bushu-error gives a plain message. All events bubble and have JSON-safe detail. Frames forward { type, detail }; hosts should verify the sender origin and frame.

The frame validates enum values, bounded widths/limits, radical characters and a single starting kanji, ignoring invalid query fields. It has noindex, a device colour-scheme, transparent margins and no document scrolling; the picker's results and radical grid keep their deliberate inner scrolling. It loads only local package modules and reads no browser storage. Themes use the original palettes, scoped to this element, so mixed themes can share a page. Label restores the native picker role/name when removed, and widths restore the original inline width.
