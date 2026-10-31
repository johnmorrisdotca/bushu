// embed-attributes.test.ts: copied unchanged beside embed-attributes.ts in every package that has an element.
import { describe, expect, it } from "vitest";
import { EMBED_MAX_WIDTH_PX, embedColorScheme, embedWidth, isOn, writeAttribute } from "./embed-attributes.ts";

describe("the standard embed attributes", () => {
  it("take a width in pixels before a size, and never wider than the cap", () => {
    expect(embedWidth("500", "small")).toBe(500);
    expect(embedWidth("99999", null)).toBe(EMBED_MAX_WIDTH_PX);
    expect(embedWidth(null, "small")).toBe(320);
    expect(embedWidth(null, "medium")).toBe(480);
    expect(embedWidth(null, "large")).toBe(640);
  });

  it("ignore a width that is not a positive number, and a size they do not know", () => {
    for (const width of ["0", "-5", "wide", "Infinity", ""]) expect(embedWidth(width, "large"), width).toBe(640);
    expect(embedWidth(null, "huge")).toBeNull();
    expect(embedWidth(null, "toString")).toBeNull();
    expect(embedWidth(null, null)).toBeNull();
  });

  it("follow the page's colours unless the theme names light or dark", () => {
    expect(embedColorScheme("dark")).toBe("dark");
    expect(embedColorScheme("light")).toBe("light");
    expect(embedColorScheme("blue")).toBe("light dark");
    expect(embedColorScheme(null)).toBe("light dark");
  });

  it("read a switch as on unless it says off, and as the fallback when it is absent", () => {
    for (const value of ["", "on", "true", "yes", "1"]) expect(isOn(value, false), value).toBe(true);
    for (const value of ["false", " OFF ", "no", "0"]) expect(isOn(value, true), value).toBe(false);
    expect(isOn(null, true)).toBe(true);
    expect(isOn(null, false)).toBe(false);
  });

  it("write a value's text, and remove the attribute for null and undefined", () => {
    const attributes = new Map<string, string>();
    const element = {
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
    } as unknown as Element;
    writeAttribute(element, "limit", 60);
    expect(attributes.get("limit")).toBe("60");
    writeAttribute(element, "limit", undefined);
    expect(attributes.has("limit")).toBe(false);
  });
});
