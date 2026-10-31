/**
 * The handler names the two renderers promise, stated where both can be read.
 *
 * A shared component written once is handed to a browser and to a device, so the names it
 * uses for one act have to be the same on both. The renderers cannot import each other —
 * that is the module split `H14` forbids — and a core module cannot import a renderer
 * either, so this test reads the two packages' sources **as text**, the pattern
 * `style-parity.test.ts` established for the class dictionaries.
 *
 * What it compares is the set of handler names each component's **props type** accepts,
 * resolved through the types it extends. That is the promise a consumer compiles against:
 * a name the type does not declare is a prop TypeScript refuses, whatever the
 * implementation would do with it at runtime. The comparison is restricted per pair to the
 * names that act belongs to — a button has a press, not a change — because a DOM attribute
 * set carries names no component uses, and comparing those would assert a coincidence.
 *
 * Three components are deliberately absent. `Sidebar`, `Navbar` and `Tooltip` have no
 * component-level press of their own: their controls are the rows, destinations and trigger
 * a consumer renders inside them, and those already go through `Button`, `Link` and the
 * platform pressable. Asserting a handler on the container would add a prop with nothing to
 * do, which `H11` names as the way a real gap gets hidden.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/** The names this framework standardises, and the only ones the table compares. */
type HandlerName =
  | "onClick"
  | "onPress"
  | "onChange"
  | "onChangeText"
  | "onValueChange";

/** The five names, in the order a field reports them, for the reader's own test. */
const HANDLER_NAMES: readonly HandlerName[] = [
  "onClick",
  "onPress",
  "onChange",
  "onChangeText",
  "onValueChange",
];

/** The two component roots, read as data rather than imported. */
const WEB = fileURLToPath(new URL("../../../web/src/components/", import.meta.url));
const NATIVE = fileURLToPath(
  new URL("../../../native/src/components/", import.meta.url),
);

/**
 * The handler names a type from one of the two libraries declares.
 *
 * These are the bases a component's props extend, and the names each one really carries:
 * a browser's `HTMLAttributes` has `onChange` and `onClick`; a platform `Pressable` has
 * `onPress`; a platform `TextInput` has `onChange` and `onChangeText`. Restricting the map
 * to the five names keeps the test about this framework's vocabulary rather than about a
 * library's whole event surface.
 */
const LIBRARY_BASES: Record<string, readonly HandlerName[]> = {
  HTMLAttributes: ["onClick", "onChange"],
  ButtonHTMLAttributes: ["onClick", "onChange"],
  AnchorHTMLAttributes: ["onClick", "onChange"],
  InputHTMLAttributes: ["onClick", "onChange"],
  TextareaHTMLAttributes: ["onClick", "onChange"],
  SelectHTMLAttributes: ["onClick", "onChange"],
  PressableProps: ["onPress", "onClick"],
  TextInputProps: ["onChange", "onChangeText"],
  ViewProps: [],
};

/**
 * A props type imported from another component module, resolved from that module.
 *
 * `Autocomplete` extends `Omit<InputProps, …>` rather than restating the field's props, so
 * following the reference is what makes the table compare the real set instead of a copy
 * that could drift.
 */
const IMPORTED_BASES: Record<string, { file: string; type: string }> = {
  InputProps: { file: "forms/input/Input.tsx", type: "InputProps" },
};

/** Remove comments, keeping string literals intact, so prose does not count as a prop. */
function withoutComments(source: string): string {
  let result = "";
  let quote: string | null = null;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index] as string;

    if (quote) {
      result += character;
      if (character === "\\") {
        result += source[index + 1] ?? "";
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      result += character;
      continue;
    }

    if (character === "/" && source[index + 1] === "/") {
      while (index < source.length && source[index] !== "\n") index += 1;
      result += "\n";
      continue;
    }

    if (character === "/" && source[index + 1] === "*") {
      index += 2;
      while (
        index < source.length &&
        !(source[index] === "*" && source[index + 1] === "/")
      ) {
        index += 1;
      }
      index += 1;
      result += " ";
      continue;
    }

    result += character;
  }

  return result;
}

/** The text between a `{` and its matching `}`, starting at the opening brace. */
function balanced(source: string, open: number): string {
  let depth = 0;
  let quote: string | null = null;

  for (let index = open; index < source.length; index += 1) {
    const character = source[index] as string;

    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`")
      quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }

  return source.slice(open + 1);
}

/** Split on a separator at bracket depth zero, so `Omit<A, "x" | "y">` stays whole. */
function splitTopLevel(text: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let current = "";

  for (const character of text) {
    if (quote) {
      current += character;
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      current += character;
      continue;
    }
    if ("(<[{".includes(character)) depth += 1;
    else if (")>]}".includes(character)) depth -= 1;

    if (character === separator && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += character;
  }

  parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

/** A type declaration's body and the text that names what it extends. */
interface Declaration {
  body: string;
  sources: string[];
}

/** Find a `type` or `interface` declaration by name in one file. */
function declarationOf(source: string, name: string): Declaration | null {
  const interfaceMatch = new RegExp(
    `(?:export\\s+)?interface\\s+${name}\\b([^{]*)\\{`,
  ).exec(source);
  if (interfaceMatch) {
    const open = (interfaceMatch.index ?? 0) + interfaceMatch[0].length - 1;
    const extendsClause = /extends\s+([\s\S]*)$/.exec(
      interfaceMatch[1] as string,
    )?.[1];
    return {
      body: balanced(source, open),
      sources: extendsClause ? splitTopLevel(extendsClause, ",") : [],
    };
  }

  const typeMatch = new RegExp(
    `(?:export\\s+)?type\\s+${name}\\s*(?:<[^=]*>)?\\s*=`,
  ).exec(source);
  if (!typeMatch) return null;

  const start = (typeMatch.index ?? 0) + typeMatch[0].length;
  let depth = 0;
  let quote: string | null = null;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index] as string;
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`")
      quote = character;
    else if ("([{<".includes(character)) depth += 1;
    else if (")]}>".includes(character)) depth -= 1;
    else if (character === ";" && depth === 0) {
      const initializer = source.slice(start, index);
      return {
        body: initializer,
        sources: splitTopLevel(initializer, "&"),
      };
    }
  }

  return { body: source.slice(start), sources: [] };
}

/** The handler names a declaration body states as properties. */
function declaredHandlers(body: string): HandlerName[] {
  const found: HandlerName[] = [];
  for (const match of body.matchAll(
    /\b(on(?:Click|Press|Change|ChangeText|ValueChange))\??\s*:/g,
  )) {
    const name = match[1] as HandlerName;
    if (HANDLER_NAMES.includes(name) && !found.includes(name))
      found.push(name);
  }
  return found;
}

/** The key names a `Pick` or `Omit` states. */
function quotedHandlers(text: string): HandlerName[] {
  const found: HandlerName[] = [];
  for (const match of text.matchAll(/"([^"]+)"|'([^']+)'/g)) {
    const name = (match[1] ?? match[2]) as HandlerName;
    if (HANDLER_NAMES.includes(name)) found.push(name);
  }
  return found;
}

/** A base reference reduced to a name, so `React.HTMLAttributes<T>` is `HTMLAttributes`. */
function baseName(reference: string): string {
  const withoutGenerics = reference.replace(/<[\s\S]*>$/, "").trim();
  return withoutGenerics.split(".").pop() ?? withoutGenerics;
}

/**
 * The handler names a type accepts, resolved through its bases.
 *
 * `Omit` subtracts and `Pick` intersects, exactly as the compiler reads them; an unknown
 * base — a configuration type, which declares no handler — contributes nothing.
 */
function handlersOfType(
  rendererRoot: string,
  file: string,
  typeName: string,
  visiting: ReadonlySet<string> = new Set(),
): HandlerName[] {
  const key = `${file}#${typeName}`;
  if (visiting.has(key)) return [];

  const source = withoutComments(readFileSync(rendererRoot + file, "utf8"));
  const declaration = declarationOf(source, typeName);
  if (!declaration) return [];

  const handlers = new Set<HandlerName>(declaredHandlers(declaration.body));

  for (const reference of declaration.sources) {
    const omit = /^Omit\s*<([\s\S]+)>$/.exec(reference);
    if (omit) {
      const inner = omit[1] as string;
      const comma = splitTopLevel(inner, ",");
      const base = comma[0] as string;
      const removed = quotedHandlers(comma.slice(1).join(","));
      for (const name of handlersOfReference(
        rendererRoot,
        file,
        base,
        key,
        visiting,
      )) {
        if (!removed.includes(name)) handlers.add(name);
      }
      continue;
    }

    const pick = /^Pick\s*<([\s\S]+)>$/.exec(reference);
    if (pick) {
      const inner = pick[1] as string;
      const comma = splitTopLevel(inner, ",");
      const base = comma[0] as string;
      const kept = quotedHandlers(comma.slice(1).join(","));
      for (const name of handlersOfReference(
        rendererRoot,
        file,
        base,
        key,
        visiting,
      )) {
        if (kept.includes(name)) handlers.add(name);
      }
      continue;
    }

    for (const name of handlersOfReference(
      rendererRoot,
      file,
      reference,
      key,
      visiting,
    )) {
      handlers.add(name);
    }
  }

  return HANDLER_NAMES.filter((name) => handlers.has(name));
}

/** Resolve one base reference, following a local alias or an imported props type. */
function handlersOfReference(
  rendererRoot: string,
  file: string,
  reference: string,
  visitingKey: string,
  visiting: ReadonlySet<string>,
): HandlerName[] {
  const name = baseName(reference);

  const local = declarationOf(
    withoutComments(readFileSync(rendererRoot + file, "utf8")),
    name,
  );
  if (local) {
    return handlersOfType(
      rendererRoot,
      file,
      name,
      new Set([...visiting, visitingKey]),
    );
  }

  const imported = IMPORTED_BASES[name];
  if (imported) {
    return handlersOfType(
      rendererRoot,
      imported.file,
      imported.type,
      new Set([...visiting, visitingKey]),
    );
  }

  return LIBRARY_BASES[name] ?? [];
}

/** One paired component: where each renderer declares its props, and the act's names. */
interface Pair {
  component: string;
  web: { file: string; type: string };
  native: { file: string; type: string };
  scope: readonly HandlerName[];
}

const PRESS: readonly HandlerName[] = ["onClick", "onPress"];
const TEXT: readonly HandlerName[] = [
  "onChange",
  "onChangeText",
  "onValueChange",
];

/**
 * The pairs the table compares.
 *
 * A pair is a component both renderers publish and a vocabulary both of them spell. The
 * scope is the act: a press for a control, a change for a field. A field whose value is a
 * list (`MultiSelect`) is compared on `onChange` alone, because `onChangeText` and
 * `onValueChange` carry one string and that field's value is not one.
 */
const PAIRS: readonly Pair[] = [
  {
    component: "Button",
    web: { file: "forms/button/Button.tsx", type: "ButtonProps" },
    native: { file: "forms/button/Button.tsx", type: "ButtonProps" },
    scope: PRESS,
  },
  {
    component: "Card",
    web: { file: "data-display/card/Card.tsx", type: "CardProps" },
    native: { file: "data-display/card/Card.tsx", type: "CardProps" },
    scope: PRESS,
  },
  {
    component: "Chip",
    web: { file: "data-display/chip/Chip.tsx", type: "ChipProps" },
    native: { file: "data-display/chip/Chip.tsx", type: "ChipProps" },
    scope: PRESS,
  },
  {
    component: "Link",
    web: { file: "navigation/link/Link.tsx", type: "LinkProps" },
    native: { file: "navigation/link/Link.tsx", type: "LinkProps" },
    scope: PRESS,
  },
  {
    component: "Tabs",
    web: { file: "navigation/tabs/Tabs.tsx", type: "TabsProps" },
    native: { file: "navigation/tabs/Tabs.tsx", type: "TabsProps" },
    scope: ["onChange", "onValueChange"],
  },
  {
    component: "Accordion",
    web: {
      file: "data-display/accordion/Accordion.tsx",
      type: "AccordionProps",
    },
    native: {
      file: "data-display/accordion/Accordion.tsx",
      type: "AccordionProps",
    },
    scope: ["onChange", "onValueChange"],
  },
  {
    component: "Switch",
    web: { file: "forms/switch/Switch.tsx", type: "SwitchProps" },
    native: { file: "forms/switch/Switch.tsx", type: "SwitchProps" },
    scope: ["onClick", "onChange"],
  },
  {
    component: "Radio",
    web: { file: "forms/radio/Radio.tsx", type: "RadioProps" },
    native: { file: "forms/radio/Radio.tsx", type: "RadioProps" },
    scope: ["onClick", "onChange"],
  },
  {
    component: "Input",
    web: { file: "forms/input/Input.tsx", type: "InputProps" },
    native: { file: "forms/input/Input.tsx", type: "InputProps" },
    scope: TEXT,
  },
  {
    component: "Textarea",
    web: { file: "forms/textarea/Textarea.tsx", type: "TextareaProps" },
    native: { file: "forms/textarea/Textarea.tsx", type: "TextareaProps" },
    scope: TEXT,
  },
  {
    component: "SearchInput",
    web: {
      file: "forms/search-input/SearchInput.tsx",
      type: "SearchInputProps",
    },
    native: {
      file: "forms/search-input/SearchInput.tsx",
      type: "SearchInputProps",
    },
    scope: TEXT,
  },
  {
    component: "Dropmenu",
    web: { file: "forms/dropmenu/Dropmenu.tsx", type: "DropmenuProps" },
    native: { file: "forms/dropmenu/Dropmenu.tsx", type: "DropmenuProps" },
    scope: TEXT,
  },
  {
    component: "Autocomplete",
    web: {
      file: "forms/autocomplete/Autocomplete.tsx",
      type: "AutocompleteProps",
    },
    native: {
      file: "forms/autocomplete/Autocomplete.tsx",
      type: "AutocompleteProps",
    },
    scope: TEXT,
  },
  {
    component: "PinInput",
    web: { file: "forms/pin-input/PinInput.tsx", type: "PinInputProps" },
    native: { file: "forms/pin-input/PinInput.tsx", type: "PinInputProps" },
    scope: TEXT,
  },
  {
    component: "MultiSelect",
    web: {
      file: "forms/multi-select/MultiSelect.tsx",
      type: "MultiSelectProps",
    },
    native: {
      file: "forms/multi-select/MultiSelect.tsx",
      type: "MultiSelectProps",
    },
    scope: ["onChange"],
  },
];

/** One side's accepted names, in the shared order. */
function accepted(
  rendererRoot: string,
  side: { file: string; type: string },
  scope: readonly HandlerName[],
): HandlerName[] {
  return handlersOfType(rendererRoot, side.file, side.type).filter((name) =>
    scope.includes(name),
  );
}

/** One pair by component, or a failure naming the table that lacks it. */
function pairFor(component: string): Pair {
  const pair = PAIRS.find((candidate) => candidate.component === component);
  if (!pair) throw new Error(`the table has no ${component} pair`);
  return pair;
}

describe("the reader itself", () => {
  it("resolves the pairs the assertions rest on, so an empty set is not a pass", () => {
    // A parser that silently found nothing would make every equality below vacuous. These
    // are the sets the framework promises, stated once here.
    const button = pairFor("Button");
    expect(accepted(WEB, button.web, button.scope)).toEqual([
      "onClick",
      "onPress",
    ]);
    expect(accepted(NATIVE, button.native, button.scope)).toEqual([
      "onClick",
      "onPress",
    ]);

    const input = pairFor("Input");
    expect(accepted(WEB, input.web, input.scope)).toEqual(TEXT);
    expect(accepted(NATIVE, input.native, input.scope)).toEqual(TEXT);
  });

  it("finds a declaration in every paired file", () => {
    for (const pair of PAIRS) {
      for (const [label, root, side] of [
        ["web", WEB, pair.web],
        ["native", NATIVE, pair.native],
      ] as const) {
        const source = withoutComments(
          readFileSync(root + side.file, "utf8"),
        );
        expect(
          declarationOf(source, side.type),
          `${label} ${pair.component} declares ${side.type}`,
        ).not.toBeNull();
      }
    }
  });
});

describe("the handler names both renderers accept", () => {
  it("are the same on both sides of every pair", () => {
    for (const pair of PAIRS) {
      expect(
        accepted(NATIVE, pair.native, pair.scope),
        `${pair.component}: the platform accepts what the web accepts`,
      ).toEqual(accepted(WEB, pair.web, pair.scope));
    }
  });

  it("include the web's press name wherever the pair is a press", () => {
    // The equality above would also pass if both sides lost a name; this is the assertion
    // that the name this batch added is the one that is there.
    for (const pair of PAIRS.filter((candidate) =>
      candidate.scope.includes("onClick"),
    )) {
      expect(
        accepted(NATIVE, pair.native, pair.scope),
        `${pair.component} accepts onClick on the platform`,
      ).toContain("onClick");
    }
  });

  it("include the platform's press name wherever the component has a press", () => {
    for (const pair of PAIRS.filter((candidate) =>
      candidate.scope.includes("onPress"),
    )) {
      expect(
        accepted(WEB, pair.web, pair.scope),
        `${pair.component} accepts onPress on the web`,
      ).toContain("onPress");
    }
  });
});
