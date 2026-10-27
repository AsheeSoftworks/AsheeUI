/**
 * Tests for the development diagnosis of the styling pipeline.
 *
 * The diagnosis is the answer to the question a consumer cannot answer from a device: is
 * anything in this bundle actually turning `className` into a style? Its two checks have to
 * report a verdict rather than throw, because it runs after the provider's first paint and a
 * diagnosis must not take the screen down.
 *
 * This suite is a useful subject for it, because it is exactly one of the broken shapes:
 * NativeWind's Babel transform is not in the chain here — the native suite compiles its JSX
 * with the platform's own preset — so the installation check has to fail, and say so. That
 * failure is the proof that the check works, and it is also why the warning is gated on
 * `NODE_ENV === "development"`: every render of the provider in this suite would otherwise
 * warn about a pipeline the suite deliberately does not have.
 */

import {
  type NativeWindCheck,
  verifyNativeWind,
  warnWhenStylingIsDisconnected,
} from "./nativewind-doctor";

/**
 * One check from the report, by id.
 *
 * @param checks - The report's checks.
 * @param id - Which check to read.
 * @returns The check, which the tests assert is present first.
 */
function checkOf(
  checks: NativeWindCheck[],
  id: NativeWindCheck["id"],
): NativeWindCheck | undefined {
  return checks.find((check) => check.id === id);
}

describe("verifyNativeWind", () => {
  /**
   * NativeWind warns that it was called outside a development environment, which is true
   * of this suite and is the one line of its output that is not the verdict. The tests
   * assert on the verdict, so the console is quiet while they run.
   */
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it("reports the runtime the package's modules emit through", () => {
    const report = verifyNativeWind();
    const runtime = checkOf(report.checks, "runtime");

    // The published modules import `nativewind/jsx-runtime`, which is the interop
    // runtime; the probe is the interop factory's own handshake.
    expect(runtime).toBeDefined();
    expect(runtime?.ok).toBe(true);
  });

  it("reports a disconnected installation as a verdict rather than throwing", () => {
    const report = verifyNativeWind();
    const installation = checkOf(report.checks, "installation");

    expect(installation).toBeDefined();
    // This suite's JSX is not NativeWind's, so NativeWind says so — and the report carries
    // its message and a next step rather than the exception it was thrown as.
    expect(installation?.ok).toBe(false);
    expect(installation?.summary).toMatch(/jsxImportSource|installation/i);
    expect(installation?.remedy).not.toBe("");
  });

  it("answers with one boolean as well as the checks", () => {
    const report = verifyNativeWind();

    expect(report.ok).toBe(report.checks.every((check) => check.ok));
    expect(report.checks).toHaveLength(2);
  });

  it("says nothing outside a development bundle", () => {
    warnWhenStylingIsDisconnected();

    expect(warn).not.toHaveBeenCalled();
  });
});
