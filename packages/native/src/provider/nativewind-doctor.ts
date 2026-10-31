/**
 * The development check that NativeWind is actually styling this bundle.
 *
 * Every mistake in the styling setup has the same failure surface: the application runs,
 * the copy is correct, and every framework component renders with no style at all —
 * no page padding, no card surface, no border, no type scale. Nothing throws, nothing
 * warns, and the screen looks like a theme problem rather than a pipeline problem. That
 * is expensive to debug from the inside, because the pipeline has five places to break:
 * the stylesheet entry, the Tailwind content globs, the `react-native-css-interop`
 * pairing, the colour roles, and the JSX runtime the package's own compiled modules emit
 * through.
 *
 * Two of those are impossible for a consumer to see. This module makes them say
 * something, at the moment the provider mounts, in development only:
 *
 * 1. **Is the element factory the framework actually uses the interop one?** NativeWind
 *    does not read `className` at runtime: its JSX runtime wraps the factory so that a
 *    `className` becomes a `style`, and NativeWind's Babel transform is what points an
 *    application's own JSX at that factory. A *published* component has already been
 *    compiled, so the runtime it imports is the only thing that can route it — which is
 *    why this package's build states `jsxImportSource: "nativewind"`. If that is ever
 *    lost, every framework class is silently ignored; the probe below is what notices.
 * 2. **Does NativeWind agree that the installation is connected?** Its own
 *    `verifyInstallation()` answers three questions with precise messages — whether the
 *    Babel transform points at its runtime, whether the compiled stylesheet data reached
 *    the bundle, and whether its Tailwind preset is in the configuration.
 *
 * The check is deliberately quiet when everything works: silence in a correct
 * application, one actionable warning in a broken one. It runs once per process, from
 * `AsheeUIProvider`'s first mount, and only when `NODE_ENV` is `development`, which
 * is what a Metro development bundle states — so a production bundle, a test run and a
 * Node script all carry none of it.
 */

/**
 * One check's verdict.
 *
 * `summary` says what was found; `remedy` says what to do about it. They are separate
 * because the warning prints both, and a message that says "styling is broken" without
 * naming a next step is a message that costs the reader the same afternoon twice.
 */
export interface NativeWindCheck {
  /** Which half of the setup the check is about. */
  id: "runtime" | "installation";

  /** Whether the check passed. */
  ok: boolean;

  /** What was found, in one sentence. */
  summary: string;

  /** What the reader should do when it failed. */
  remedy: string;
}

/** The whole diagnosis: one verdict per check, and a single answer. */
export interface NativeWindReport {
  /** True when every check passed. */
  ok: boolean;

  /** Every check, in the order they are worth reading. */
  checks: NativeWindCheck[];
}

/**
 * The probe NativeWind's wrapper recognises.
 *
 * `wrapJSX` returns `true` for this element type before it looks at anything else, so a
 * factory that answers it is the interop factory and a factory that does not is React's
 * own. It is the interop runtime's own handshake rather than a private detail, which is
 * why it is safe to ask.
 */
const PRAGMA_PROBE = "react-native-css-interop-jsx-pragma-check";

/** The part of a JSX runtime this module reads. */
interface JsxRuntime {
  /** The element factory. `jsx` in production, and in development too. */
  jsx?: (type: string | object, props?: unknown, key?: unknown) => unknown;
}

/** Where the setup is documented, for the warning to name. */
const SETUP_DOCS = "https://www.asheeui.com/platforms/native#setup";

/**
 * Is the framework's element factory NativeWind's wrapped one?
 *
 * The published modules import `nativewind/jsx-runtime` (the compiler option in
 * `tsconfig.build.json` is what makes them), and that module re-exports
 * `react-native-css-interop/jsx-runtime`. Three facts have to hold for a `className` to
 * become a `style`, and each is checked rather than assumed: the module loads at all, its
 * factory is not React's own, and it answers the interop pragma.
 *
 * @returns The check's verdict.
 */
function checkRuntime(): NativeWindCheck {
  try {
    const interop = require("nativewind/jsx-runtime") as JsxRuntime;
    const react = require("react/jsx-runtime") as JsxRuntime;

    if (typeof interop.jsx !== "function") {
      return {
        id: "runtime",
        ok: false,
        summary:
          "`nativewind/jsx-runtime` resolved to a module with no element factory, so the framework's elements were never handed to CSS interop.",
        remedy:
          "Check that the installed `nativewind` is 4.2 or newer and that Metro resolves the platform's copy of it rather than a stub.",
      };
    }

    if (interop.jsx === react.jsx) {
      return {
        id: "runtime",
        ok: false,
        summary:
          "the JSX runtime `nativewind/jsx-runtime` is React's own factory rather than CSS interop's wrapper, so every `className` on a framework component is being ignored.",
        remedy:
          "This is the published artifact's own defect rather than the application's: upgrade `@asheeui/native` to 2.6.0 or newer.",
      };
    }

    if (interop.jsx(PRAGMA_PROBE) !== true) {
      return {
        id: "runtime",
        ok: false,
        summary:
          "`nativewind/jsx-runtime` answered the interop probe with something other than `true`, so the styling runtime in this bundle is not the one the components were built against.",
        remedy:
          "Check for a second copy of `react-native-css-interop` in the bundle — a stale pin in `package.json`, or a package that depends on its own copy.",
      };
    }

    return {
      id: "runtime",
      ok: true,
      summary:
        "the framework's elements are created through CSS interop's runtime.",
      remedy: "",
    };
  } catch (error) {
    return {
      id: "runtime",
      ok: false,
      summary: `the interop runtime could not be loaded: ${describe(error)}`,
      remedy: `Run \`npx expo install nativewind\` so the peer dependency is installed for this platform, then restart Metro. Setup: ${SETUP_DOCS}`,
    };
  }
}

/**
 * Does NativeWind agree that this installation is connected?
 *
 * `verifyInstallation()` throws with a message naming the one thing it found missing, and
 * those messages are better than anything restated here — so they are passed through
 * rather than translated. It also logs a line on success, which is the one piece of its
 * behaviour this module suppresses: a check that runs on every application start should be
 * silent when there is nothing to say.
 *
 * The module is loaded through `require` rather than imported so that a bundle which never
 * mounts a provider — a test of a pure helper, a Node script — does not pull the styling
 * runtime in at all.
 *
 * @returns The check's verdict.
 */
function checkInstallation(): NativeWindCheck {
  let verifyInstallation: (() => boolean) | undefined;

  try {
    const nativewind = require("nativewind") as {
      verifyInstallation?: () => boolean;
    };

    verifyInstallation = nativewind.verifyInstallation;
  } catch (error) {
    return {
      id: "installation",
      ok: false,
      summary: `\`nativewind\` could not be loaded: ${describe(error)}`,
      remedy: `Install the peer dependency, then restart Metro. Setup: ${SETUP_DOCS}`,
    };
  }

  if (typeof verifyInstallation !== "function") {
    return {
      id: "installation",
      ok: true,
      summary:
        "this copy of `nativewind` carries no installation check, so only the runtime probe was run.",
      remedy: "",
    };
  }

  const log = console.log;

  try {
    console.log = () => {};

    verifyInstallation();

    return {
      id: "installation",
      ok: true,
      summary:
        "NativeWind reports that the Babel transform, the stylesheet data and its preset are in place.",
      remedy: "",
    };
  } catch (error) {
    return {
      id: "installation",
      ok: false,
      summary: `NativeWind reports that the installation is not connected: ${describe(error)}`,
      remedy: `Compare the application's Babel, Metro and Tailwind configuration with the setup in ${SETUP_DOCS} — the ordered list of causes there matches the order of these checks.`,
    };
  } finally {
    console.log = log;
  }
}

/**
 * A thrown value as a sentence.
 *
 * @param error - Whatever was thrown.
 * @returns Its message, or its string form when it is not an error.
 */
function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Diagnose whether the NativeWind styling pipeline reaches this bundle.
 *
 * It is safe to call anywhere, and it never throws: an application adding it to a test, a
 * script or a screen gets a report rather than an exception.
 *
 * @returns One verdict per check, and whether the pipeline is connected.
 *
 * @example
 * ```ts
 * import { verifyNativeWind } from "@asheeui/native";
 *
 * const report = verifyNativeWind();
 * if (!report.ok) console.log(report.checks.filter((check) => !check.ok));
 * ```
 */
export function verifyNativeWind(): NativeWindReport {
  const checks = [checkRuntime(), checkInstallation()];

  return { ok: checks.every((check) => check.ok), checks };
}

/** Whether the warning has already been printed, so a re-mount stays quiet. */
let hasWarnedAboutStyling = false;

/**
 * Print one actionable warning when the styling pipeline is not connected.
 *
 * Called from the provider's first mount. Development only — `development` is what a
 * Metro development bundle states in `NODE_ENV`, and a test run says `test`, so a test
 * that renders the provider is not warned about a pipeline it deliberately does not have.
 *
 * @returns Nothing. The report is available from {@link verifyNativeWind} for a caller that
 *   wants it.
 */
export function warnWhenStylingIsDisconnected(): void {
  if (process.env.NODE_ENV !== "development" || hasWarnedAboutStyling) {
    return;
  }

  hasWarnedAboutStyling = true;

  const report = verifyNativeWind();
  if (report.ok) return;

  const failures = report.checks.filter((check) => !check.ok);
  const detail = failures
    .map((check) => `${check.summary} ${check.remedy}`)
    .join(" ");

  console.warn(
    `[AsheeUI] @asheeui/native: the NativeWind styling pipeline is not connected, so the framework's classes are being ignored and every component renders unstyled — the copy and the layout are right, which is what makes this hard to spot. ${detail}`,
  );
}
