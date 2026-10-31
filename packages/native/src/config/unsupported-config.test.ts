/**
 * The config half of the `K` ledger.
 *
 * A shared `asheeui.config.ts` may state an option only the web can honour. The audit reads
 * the consumer's object — not the resolved one, where a registered default would look like a
 * choice — and says so once per option.
 */

import type { ExternalConfig } from "@asheeui/core";
import { auditUnsupportedConfig } from "./unsupported-config";

describe("auditUnsupportedConfig", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = "test";
  });

  it("warns for a stated option, naming what to do instead", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    auditUnsupportedConfig({
      components: { toast: { portal: true } },
    } as ExternalConfig);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("toast.portal");
    expect(String(warn.mock.calls[0]?.[0])).toContain("native layer");
  });

  it("warns once when the configuration is audited again", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    auditUnsupportedConfig({
      components: { calendar: { lockScroll: true } },
    } as ExternalConfig);
    auditUnsupportedConfig({
      components: { calendar: { lockScroll: true } },
    } as ExternalConfig);

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("says nothing for a component that states nothing", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    auditUnsupportedConfig({
      components: { button: { size: "lg" } },
    } as ExternalConfig);

    expect(warn).not.toHaveBeenCalled();
  });

  it("says nothing in production", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    process.env.NODE_ENV = "production";

    auditUnsupportedConfig({
      components: { image: { loading: "lazy" } },
    } as ExternalConfig);

    expect(warn).not.toHaveBeenCalled();
  });
});
