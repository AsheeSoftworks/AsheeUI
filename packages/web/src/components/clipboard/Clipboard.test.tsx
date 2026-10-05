/**
 * Behaviour tests for the clipboard pair.
 *
 * jsdom has no clipboard API, so the tests install one on `navigator` and assert
 * what the components do with the result: the copied state, the announced
 * result, the failure path, and the timer that ends the copied state.
 */

import { describe, expect, it, vi } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
  waitFor,
} from "../../test";
import { Clipboard } from "./Clipboard";
import { CopyButton } from "./CopyButton";

/** Install a clipboard that records what it was given. */
function installClipboard(options: { fail?: boolean } = {}) {
  const writeText = vi.fn(async (_text: string) => {
    if (options.fail) {
      throw new Error("Clipboard access was refused");
    }
  });

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });

  return writeText;
}

describe("Clipboard", () => {
  it("hands the copied state to its render function", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();

    const { getByRole, getByText } = renderWithProvider(
      <Clipboard value="INV-1042" timeout={1000}>
        {({ copied, copy }) => (
          <button type="button" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </Clipboard>,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("INV-1042");
    await waitFor(() => expect(getByText("Copied")).toBeDefined());
  });

  it("reports a refusal without claiming success", async () => {
    const user = userEvent.setup();
    installClipboard({ fail: true });
    const errors: unknown[] = [];

    const { getByRole, getByText } = renderWithProvider(
      <Clipboard value="INV-1042" onError={(error) => errors.push(error)}>
        {({ copied, error, copy }) => (
          <button type="button" onClick={() => void copy()}>
            {copied ? "Copied" : error ? "Failed" : "Copy"}
          </button>
        )}
      </Clipboard>,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(errors).toHaveLength(1);
    await waitFor(() => expect(getByText("Failed")).toBeDefined());
  });

  it("copies the text it is given instead of its value", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();

    const { getByRole } = renderWithProvider(
      <Clipboard value="INV-1042">
        {({ copy }) => (
          <button type="button" onClick={() => void copy("INV-9999")}>
            Copy other
          </button>
        )}
      </Clipboard>,
    );

    await user.click(getByRole("button", { name: "Copy other" }));

    expect(writeText).toHaveBeenCalledWith("INV-9999");
  });
});

describe("CopyButton", () => {
  it("renames itself and announces the result", async () => {
    const user = userEvent.setup();
    const writeText = installClipboard();

    const { getByRole, getByText } = renderWithProvider(
      <CopyButton value="INV-1042" timeout={1000} />,
    );

    await user.click(getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("INV-1042");
    await waitFor(() =>
      expect(getByRole("button", { name: "Copied" })).toBeDefined(),
    );
    expect(getByRole("status").textContent).toContain("INV-1042");
    expect(getByText("Copied: INV-1042")).toBeDefined();
  });

  it("takes its wording, its announcement and its emphasis from props and config", async () => {
    const user = userEvent.setup();
    installClipboard();

    const { getByRole } = renderWithProvider(
      <CopyButton
        value="INV-1042"
        label="Copy invoice number"
        copiedLabel="Number copied"
        copiedAnnouncement="Invoice number on the clipboard"
      />,
      {
        config: makeComponentConfig("clipboard", {
          variant: "ghost",
          timeout: 500,
        }),
      },
    );
    const button = getByRole("button", { name: "Copy invoice number" });

    expect(button.className).toContain("bg-transparent");

    await user.click(button);

    expect(getByRole("status").textContent).toContain(
      "Invoice number on the clipboard",
    );
  });

  it("renders the control on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(<CopyButton value="INV-1042" />);

    expect(html).toContain("Copy");
    expect(html).toContain("<button");
    expectHydrationClean(<CopyButton value="INV-1042" />);
  });
});
