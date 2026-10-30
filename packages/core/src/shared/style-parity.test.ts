/**
 * The agreements between the two renderers' class dictionaries, stated where both can be read.
 *
 * A class string belongs to the renderer that compiles it: C1 moved the platform's 397 constants
 * into `@asheeui/native` and C2 moved the web's 266 into `@asheeui/web`. Neither package may import
 * the other — a shared file that reaches for one renderer is the module split the umbrella exists
 * to prevent — so the assertions that once compared the two maps *in one test* can no longer live
 * in either of them.
 *
 * They live here instead, reading the two `styles/` directories **as text**. That is the pattern
 * `CORE-MIGRATION-REPORT.md` §6.2 prescribes for the 21 strings both renderers compile: a text
 * comparison is enough, because a class map is literals. What it buys is the invariant those
 * comparisons existed for — the two renderers cover the same vocabulary — without either package
 * depending on the other, and without the two maps being free to drift the first time a variant is
 * added on one side only.
 *
 * What it does *not* claim is that the strings are equal: they are not, and must not be. A web
 * drawer states a width and a platform sheet states a height; a web modal measures `full` against
 * the viewport and a device against the screen. The assertions below say which parts are shared
 * (the keys, the design tokens, the padding on a shared scale) and which are deliberately not.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/** The two renderers' style directories, read as data rather than imported. */
const WEB_STYLES = fileURLToPath(
  new URL("../../../web/src/styles/", import.meta.url),
);
const NATIVE_STYLES = fileURLToPath(
  new URL("../../../native/src/styles/", import.meta.url),
);

/**
 * One exported constant from a style module.
 *
 * `keys` are the property names of an object literal's first level, which is the vocabulary a map
 * covers (`sm`, `md`, `primary`); `value` is the string a plain literal states; `text` is the whole
 * initializer, for the checks that are about the class strings themselves.
 */
interface StyleConstant {
  keys: string[];
  value: string | undefined;
  text: string;
  file: string;
}

/** Read a declaration's initializer: everything after `=` up to the `;` that ends it. */
function initializerOf(
  source: string,
  start: number,
): { text: string; end: number } {
  const equals = source.indexOf("=", start);
  let depth = 0;
  let quote: string | null = null;
  for (let i = equals; i < source.length; i += 1) {
    const character = source[i] as string;
    if (quote) {
      if (character === "\\") i += 1;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`")
      quote = character;
    else if ("([{".includes(character)) depth += 1;
    else if (")]}".includes(character)) depth -= 1;
    else if (character === ";" && depth === 0)
      return { text: source.slice(equals + 1, i), end: i };
  }
  return { text: source.slice(equals + 1), end: source.length };
}

/** The first-level property names of an object literal, or none when it is not one. */
function keysOf(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) return [];

  const keys: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let word = "";

  const remember = () => {
    if (depth === 1 && word.trim())
      keys.push(word.trim().replace(/^"|"$/g, ""));
    word = "";
  };

  for (const character of trimmed) {
    if (quote) {
      if (character === quote) quote = null;
      word += character;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      word += character;
      continue;
    }
    if (character === "{") {
      depth += 1;
      continue;
    }
    if (character === "}") {
      remember();
      depth -= 1;
      continue;
    }
    if (character === ",") {
      remember();
      continue;
    }
    word += character;
  }

  return keys
    .map((key) => key.split(":")[0]?.trim() ?? key)
    .filter((key) => key.length > 0 && !key.startsWith("..."));
}

/** Every exported constant a directory of style modules declares, by name. */
function constantsIn(directory: string): Map<string, StyleConstant> {
  const constants = new Map<string, StyleConstant>();

  for (const entry of readdirSync(directory)) {
    if (!entry.endsWith(".ts") || entry.includes(".test.")) continue;
    const source = readFileSync(join(directory, entry), "utf8");

    for (const match of source.matchAll(/^export const ([A-Za-z0-9_$]+)/gm)) {
      const { text } = initializerOf(source, match.index);
      constants.set(match[1] as string, {
        keys: keysOf(text),
        value: /^\s*"([^"]*)"/.exec(text)?.[1],
        text,
        file: entry,
      });
    }
  }

  return constants;
}

const web = constantsIn(WEB_STYLES);
const native = constantsIn(NATIVE_STYLES);

/** One map's keys, sorted, or a failure naming the constant that is missing. */
function keysOfConstant(
  constants: Map<string, StyleConstant>,
  name: string,
): string[] {
  const entry = constants.get(name);
  expect(entry, `${name} is declared`).toBeDefined();
  return [...(entry?.keys ?? [])].sort();
}

/** The maps both renderers must cover, pair by pair: web's name beside the platform's. */
const SHARED_VOCABULARY: readonly [web: string, native: string][] = [
  ["LINK_COLOR_CLASS", "NATIVE_LINK_COLOR_CLASS"],
  ["LINK_ICON_SIZE_CLASS", "NATIVE_LINK_ICON_SIZE_CLASS"],
  ["LINK_UNDERLINE_CLASS", "NATIVE_LINK_UNDERLINE_CLASS"],
  ["MODAL_MAX_WIDTH_CLASS", "NATIVE_MODAL_WIDTH_CLASS"],
  ["LOADING_STATE_SIZE_CLASS", "NATIVE_LOADING_STATE_SIZE_CLASS"],
  ["EMPTY_STATE_SIZE_CLASS", "NATIVE_EMPTY_STATE_SIZE_CLASS"],
  ["EMPTY_STATE_ICON_SIZE_CLASS", "NATIVE_EMPTY_STATE_ICON_SIZE_CLASS"],
  ["DRAWER_WIDTH_CLASS", "NATIVE_DRAWER_SIZE_CLASS"],
  ["DATE_PICKER_SIZE_CLASS", "NATIVE_CALENDAR_CELL_SIZE_CLASS"],
];

describe("the reader itself", () => {
  it("parsed both directories and their maps, so the comparisons below mean something", () => {
    // A parser that silently found nothing would make every equality below vacuous.
    expect(web.size).toBeGreaterThan(200);
    expect(native.size).toBeGreaterThan(300);
    for (const [webName, nativeName] of SHARED_VOCABULARY) {
      expect(keysOfConstant(web, webName).length, webName).toBeGreaterThan(1);
      expect(
        keysOfConstant(native, nativeName).length,
        nativeName,
      ).toBeGreaterThan(1);
    }
  });
});

describe("the vocabularies both renderers cover", () => {
  it("names the same keys on both sides of every pair", () => {
    for (const [webName, nativeName] of SHARED_VOCABULARY) {
      expect(
        keysOfConstant(native, nativeName),
        `${nativeName} covers ${webName}`,
      ).toEqual(keysOfConstant(web, webName));
    }
  });

  it("keeps the sizes a drawer takes the same on both sides, though one states a width", () => {
    // The web panel is a column at the side of the page, so a side placement is a width; a
    // platform sheet rises from the bottom edge, so the same size is a height. The scale is shared.
    expect(keysOfConstant(web, "DRAWER_HEIGHT_CLASS")).toEqual(
      keysOfConstant(native, "NATIVE_DRAWER_SIZE_CLASS"),
    );
    expect(web.get("DRAWER_WIDTH_CLASS")?.text).toMatch(/w-/);
    expect(native.get("NATIVE_DRAWER_SIZE_CLASS")?.text).toMatch(/h-/);
  });
});

describe("the tokens both renderers paint with", () => {
  it("gives every link colour the role's own text token", () => {
    for (const role of keysOfConstant(web, "LINK_COLOR_CLASS")) {
      const token = role === "none" ? "text-foreground" : `text-${role}`;
      expect(web.get("LINK_COLOR_CLASS")?.text, `web ${role}`).toContain(token);
      expect(
        native.get("NATIVE_LINK_COLOR_CLASS")?.text,
        `native ${role}`,
      ).toContain(token);
    }
  });

  it("states the two underline extremes the same way", () => {
    expect(web.get("LINK_UNDERLINE_CLASS")?.text).toMatch(
      /always:\s*"underline/,
    );
    expect(native.get("NATIVE_LINK_UNDERLINE_CLASS")?.text).toMatch(
      /always:\s*"underline/,
    );
    expect(web.get("LINK_UNDERLINE_CLASS")?.text).toMatch(
      /never:\s*"no-underline"/,
    );
    expect(native.get("NATIVE_LINK_UNDERLINE_CLASS")?.text).toMatch(
      /never:\s*"no-underline"/,
    );
  });

  it("paints the same padding at the same step, because the step is the shared scale", () => {
    // Both maps state the same value per size: the density is a design decision, not a platform
    // one. When that stops being true, this is the test that says so.
    expect(native.get("NATIVE_LOADING_STATE_SIZE_CLASS")?.text).toEqual(
      web.get("LOADING_STATE_SIZE_CLASS")?.text,
    );
    expect(native.get("NATIVE_EMPTY_STATE_SIZE_CLASS")?.text).toEqual(
      web.get("EMPTY_STATE_SIZE_CLASS")?.text,
    );
  });

  it("colours the empty state's badge with the same tone on both renderers", () => {
    // The maps are keyed by the *tone* a state states, and each tone resolves to one colour
    // token: the badge names it and the ink over it is the same token. Both renderers name it.
    const TONES: readonly [tone: string, token: string][] = [
      ["info", "primary"],
      ["success", "success"],
      ["warning", "warning"],
      ["error", "danger"],
    ];

    for (const [tone, token] of TONES) {
      expect(web.get("EMPTY_STATE_ICON_CLASS")?.text, `web ${tone}`).toContain(
        `bg-${token}/10`,
      );
      expect(
        native.get("NATIVE_EMPTY_STATE_ICON_CLASS")?.text,
        `native ${tone}`,
      ).toContain(`bg-${token}/10`);
      expect(
        native.get("NATIVE_EMPTY_STATE_ICON_TEXT_CLASS")?.text,
        `native ${tone} ink`,
      ).toContain(`text-${token}`);
    }
  });

  it("states the same danger edge for a failed field as the field family does", () => {
    // Web states the failure as a border colour with focus treatments; the platform's input
    // states the same edge as a class. The colour they name is one token, and this is the check
    // that it stays one.
    expect(web.get("FIELD_STATUS_BORDER_CLASS")?.text).toContain(
      native.get("NATIVE_INPUT_EDGE_INVALID_CLASS")?.value ?? "\u0000",
    );
  });

  it("measures a modal's four shared sizes the same way", () => {
    for (const size of ["sm", "md", "lg", "xl"]) {
      expect(web.get("MODAL_MAX_WIDTH_CLASS")?.text, `web ${size}`).toContain(
        `max-w-${size === "md" ? "lg" : size === "lg" ? "2xl" : size === "xl" ? "4xl" : "sm"}`,
      );
      expect(
        native.get("NATIVE_MODAL_WIDTH_CLASS")?.text,
        `native ${size}`,
      ).toContain(
        `max-w-${size === "md" ? "lg" : size === "lg" ? "2xl" : size === "xl" ? "4xl" : "sm"}`,
      );
    }
  });
});

describe("every class string on both sides", () => {
  it("is stated whole, because a class assembled at runtime is never compiled", () => {
    // The invariant the per-component tests used to assert on a hand-written list, over every
    // constant in both packages: a fragment with an interpolation is a class Tailwind never saw.
    for (const [label, constants] of [
      ["web", web],
      ["native", native],
    ] as const) {
      for (const [name, entry] of constants) {
        expect(entry.text, `${label} ${name} in ${entry.file}`).not.toContain(
          "${",
        );
      }
    }
  });
});
