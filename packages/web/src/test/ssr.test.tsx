/**
 * Server-rendering and hydration helper tests (`TEST-023`, `TEST-034`).
 *
 * The hydration check is only worth running against a component if it fails
 * against markup that differs from the client's first render, so this file
 * proves both directions: a matching tree hydrates cleanly and a mismatching
 * one is reported.
 */

import { describe, expect, it } from "vitest";
import { Badge } from "../components/badge";
import {
  expectHydrationClean,
  renderHydrated,
  renderToServerString,
} from "./ssr";

/** Renders a value that differs between the server and the client. */
function UnstableMarkup() {
  return <span>{Math.random().toString(36)}</span>;
}

describe("server-rendering helpers", () => {
  it("renders a tree to markup", () => {
    const html = renderToServerString(<span>Server markup</span>);

    expect(html).toContain("<span");
    expect(html).toContain("Server markup");
  });

  it("accepts markup that matches the client's first render", () => {
    expectHydrationClean(<Badge color="success">Active</Badge>);
  });

  it("reports hydration when the client's first render differs", () => {
    const result = renderHydrated(<UnstableMarkup />);

    try {
      expect(result.errors.length).toBeGreaterThan(0);
    } finally {
      result.unmount();
    }
  });
});
