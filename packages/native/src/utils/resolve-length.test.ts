/**
 * Behaviour tests for the native length reader.
 *
 * The framework states a measure once, in the vocabulary a stylesheet understands, and the
 * platform has to read it. The tests state what that reading means: the framework's `rem`
 * is sixteen units, a `px` is one, a bare number is already the platform's own, and a unit
 * no view can state falls back to the value the framework chose rather than to a number
 * nobody chose.
 */

import { LENGTH_UNITS_PER_REM, resolveLength } from "./resolve-length";

describe("resolveLength", () => {
  it("reads the framework's own units", () => {
    expect(resolveLength("2rem", 24)).toBe(2 * LENGTH_UNITS_PER_REM);
    expect(LENGTH_UNITS_PER_REM).toBe(16);
  });

  it("reads pixels as they are written", () => {
    expect(resolveLength("24px", 16)).toBe(24);
    expect(resolveLength("2.5px", 16)).toBe(2.5);
  });

  it("takes a number as the platform's own unit", () => {
    expect(resolveLength(32, 16)).toBe(32);
  });

  it("reads the spacing the browser would ignore, which a stylesheet never sees", () => {
    expect(resolveLength("  1.5rem  ", 16)).toBe(24);
  });

  it("falls back when the unit is one a view cannot state", () => {
    // A share of the parent is a relationship rather than a length, and a drawn length is
    // not a view's measure either.
    expect(resolveLength("50%", 24)).toBe(24);
    expect(resolveLength("2vw", 24)).toBe(24);
    expect(resolveLength("calc(2rem)", 24)).toBe(24);
    expect(resolveLength("", 24)).toBe(24);
    expect(resolveLength("wide", 24)).toBe(24);
  });

  it("falls back when the number itself is not a number", () => {
    expect(resolveLength(Number.NaN, 24)).toBe(24);
    expect(resolveLength(Number.POSITIVE_INFINITY, 24)).toBe(24);
  });
});
