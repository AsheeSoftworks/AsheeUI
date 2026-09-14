/**
 * Source scanner for dynamically constructed Tailwind utility names.
 *
 * Tailwind only emits classes it can see as complete strings, so a utility name
 * assembled at runtime (`` `bg-${tone}` ``) silently produces no CSS. The
 * framework requires static, complete class mappings (Hard Rule 5), and
 * `class-conventions.test.ts` uses this scanner to keep that enforceable.
 *
 * How it works: a class token is considered dynamically constructed when an
 * interpolation is welded to the front of it (`-${`), the fragment before that
 * hyphen is a curated Tailwind utility root, and the line belongs to a
 * class-name context. Complete interpolations of pre-computed class strings
 * (`${sizeClass}`) are lookups, not construction, and are not flagged.
 *
 * Limits (deliberately biased toward false negatives over false positives):
 * a curried list of roots and context keywords is checked by substring, so an
 * unusual root or a class built across several source lines may go unreported.
 */

/**
 * Roots of Tailwind utility families that must never be assembled at runtime.
 *
 * Ambiguous identifiers (`row`, `col`, `items`, `content`) are left out: they
 * collide with ordinary keys such as element ids more often than they appear in
 * dynamically built class names.
 */
const UTILITY_ROOTS: readonly string[] = [
  // Colour and decoration
  "bg",
  "text",
  "border",
  "ring",
  "divide",
  "outline",
  "rounded",
  "fill",
  "stroke",
  "from",
  "to",
  "via",
  "accent",
  "caret",
  "decoration",
  "shadow",
  // Spacing and sizing
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "gap",
  "gap-x",
  "gap-y",
  "space-x",
  "space-y",
  "w",
  "h",
  "min-w",
  "min-h",
  "max-w",
  "max-h",
  "size",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  // Typography
  "font",
  "leading",
  "tracking",
  // Layout
  "grid-cols",
  "grid-rows",
  "flex",
  "basis",
  "order",
  // Effects
  "opacity",
  "scale",
  "rotate",
  "translate",
  "z",
  "blur",
  "brightness",
  "duration",
  "delay",
  "animate",
  "aspect",
];

/** Substrings marking a line as part of a class-name context. */
const CLASS_CONTEXT_HINTS: readonly string[] = [
  "className",
  "classList",
  "cn(",
  "clsx",
  "class",
];

/** Characters that cannot appear inside a class token. */
const TOKEN_BOUNDARIES = new Set([
  "`",
  "'",
  '"',
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  ",",
  ";",
  ":",
  "=",
  "?",
  " ",
  "\t",
]);

/**
 * Find dynamically constructed utility names in a source string.
 *
 * @param source - Source text to scan.
 * @returns A description of each finding, empty when the source is clean.
 */
export function scanForDynamicUtilityClasses(source: string): string[] {
  const findings: string[] = [];
  const lines = source.split("\n");
  const concatenated = new RegExp(
    `\\b(?:${UTILITY_ROOTS.join("|")})-["']\\s*\\+`,
  );

  for (const [index, line] of lines.entries()) {
    const context = [lines[index - 1], line].filter(Boolean).join("\n");
    if (!CLASS_CONTEXT_HINTS.some((hint) => context.includes(hint))) continue;

    findings.push(...findPartialInterpolations(line));

    const concatenation = concatenated.exec(line);
    if (concatenation) {
      findings.push(concatenation[0]);
    }
  }

  return findings;
}

/** Find `bg-${...}`-style fragments on a single line. */
function findPartialInterpolations(line: string): string[] {
  const findings: string[] = [];
  const pattern = /-\$\{/g;
  let match = pattern.exec(line);

  while (match) {
    const end = match.index;
    let start = end;
    while (start > 0 && !TOKEN_BOUNDARIES.has(line[start - 1])) {
      start -= 1;
    }

    const token = line.slice(start, end);
    if (isPartialUtilityToken(token)) {
      findings.push(`${token}${line.slice(end, end + 2)}...`);
    }

    match = pattern.exec(line);
  }

  return findings;
}

/** A partial token is a bare utility root or a root already carrying a value. */
function isPartialUtilityToken(token: string): boolean {
  if (token.length === 0 || token.includes("$")) return false;
  if (!/^[a-z][a-z0-9-]*$/.test(token)) return false;

  return UTILITY_ROOTS.some(
    (root) => token === root || token.startsWith(`${root}-`),
  );
}

