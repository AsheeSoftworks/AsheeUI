/**
 * Behaviour tests for the native clipboard pair.
 *
 * The platform's clipboard is a platform module, so the tests replace the package's own
 * binding to it and state what the components do with the answer: the copied state, the
 * announced result, the failure path and the timer that ends the copied state. What the
 * write itself does is the platform's behaviour, and a test without a device can only say
 * that the platform's module was asked.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AccessibilityInfo } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { writeToClipboard } from "../../../utils/write-to-clipboard";
import { Button } from "../../forms/button/Button";
import { Typography } from "../../typography/text/Text";
import { Clipboard } from "./Clipboard";
import { CopyButton } from "./CopyButton";

jest.mock("../../../utils/write-to-clipboard", () => ({
  writeToClipboard: jest.fn(),
}));

/** The platform binding the pair writes through, which the tests answer for. */
const write = writeToClipboard as jest.MockedFunction<typeof writeToClipboard>;

/**
 * Render the pair inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderClipboard(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
}

/**
 * Read the classes a rendered element carries.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return String(
    (view.getByTestId(testID).props as { className?: string }).className ?? "",
  );
}

/**
 * Read the classes of the copy control.
 *
 * @param view - The rendered tree.
 * @returns The button's class string.
 */
function buttonClassesOf(view: RenderResult): string {
  return String(
    (view.getByRole("button", { name: "Copy" }).props as { className?: string })
      .className ?? "",
  );
}

beforeEach(() => {
  write.mockReset();
  write.mockResolvedValue(true);
});

describe("Native Clipboard", () => {
  it("hands the copied state to its render function", async () => {
    const view = await renderClipboard(
      <Clipboard value="INV-1042" timeout={1000}>
        {({ copied, copy }) => (
          <Button onPress={() => void copy()}>
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </Clipboard>,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(write).toHaveBeenCalledWith("INV-1042");
    expect(view.getByText("Copied")).toBeTruthy();
  });

  it("reports a refusal without claiming success", async () => {
    const errors: unknown[] = [];
    write.mockRejectedValueOnce(new Error("Clipboard access was refused"));

    const view = await renderClipboard(
      <Clipboard value="INV-1042" onError={(error) => errors.push(error)}>
        {({ copied, error, copy }) => (
          <Button onPress={() => void copy()}>
            {copied ? "Copied" : error ? "Failed" : "Copy"}
          </Button>
        )}
      </Clipboard>,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(errors).toHaveLength(1);
    expect(view.getByText("Failed")).toBeTruthy();
    expect(view.queryByText("Copied")).toBeNull();
  });

  it("copies the text it is given instead of its value", async () => {
    const view = await renderClipboard(
      <Clipboard value="INV-1042">
        {({ copy }) => (
          <Button onPress={() => void copy("INV-9999")}>Copy other</Button>
        )}
      </Clipboard>,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy other" }));
    });

    expect(write).toHaveBeenCalledWith("INV-9999");
  });

  it("treats an empty target as a failed copy rather than a successful write of nothing", async () => {
    const errors: unknown[] = [];
    const copied: string[] = [];
    const results: boolean[] = [];

    const view = await renderClipboard(
      <Clipboard
        onError={(error) => errors.push(error)}
        onCopy={(text) => copied.push(text)}>
        {({ copied: isCopied, error, copy }) => (
          <>
            <Button
              onPress={async () => {
                results.push(await copy());
              }}>
              {isCopied ? "Copied" : error ? "Failed" : "Copy"}
            </Button>
            <Button
              onPress={async () => {
                results.push(await copy(""));
              }}>
              Copy empty
            </Button>
          </>
        )}
      </Clipboard>,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });
    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy empty" }));
    });

    // Nothing was written, and the component said so twice: on the first call there is no
    // value, on the second the text handed in is empty.
    expect(write).not.toHaveBeenCalled();
    expect(results).toEqual([false, false]);
    expect(errors).toHaveLength(2);
    expect(copied).toHaveLength(0);
    expect(view.getByText("Failed")).toBeTruthy();
    expect(view.queryByText("Copied")).toBeNull();
  });

  it("ends the copied state after the timeout it was given", async () => {
    jest.useFakeTimers();

    const view = await renderClipboard(
      <Clipboard value="INV-1042" timeout={1000}>
        {({ copied, copy }) => (
          <Button onPress={() => void copy()}>
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </Clipboard>,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(view.getByText("Copied")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // The copied state is a moment rather than a change of value, so it ends by itself.
    expect(view.getByText("Copy")).toBeTruthy();

    jest.useRealTimers();
  });

  it("resolves the timeout through the cascade", async () => {
    jest.useFakeTimers();

    const view = await renderClipboard(
      <Clipboard value="INV-1042">
        {({ copied, copy }) => (
          <Button onPress={() => void copy()}>
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </Clipboard>,
      { components: { clipboard: { timeout: 500 } } },
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(view.getByText("Copy")).toBeTruthy();

    jest.useRealTimers();
  });
});

describe("Native CopyButton", () => {
  it("renames itself and announces the result", async () => {
    const view = await renderClipboard(<CopyButton value="INV-1042" />);

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(write).toHaveBeenCalledWith("INV-1042");
    expect(view.getByRole("button", { name: "Copied" })).toBeTruthy();

    const status = view.getByTestId("clipboard-status");

    // The label change is not announced on its own, so the region states the same thing and
    // does it politely, without interrupting what the reader was on.
    expect(status.props.accessibilityLiveRegion).toBe("polite");
    expect(status.props.children).toBe("Copied: INV-1042");
  });

  it("names the control without the glyph it draws beside the label", async () => {
    const view = await renderClipboard(<CopyButton value="INV-1042" />);

    expect(view.getByRole("button", { name: "Copy" })).toBeTruthy();
    expect(view.getByText("⧉")).toBeTruthy();
  });

  it("takes its wording, its announcement and its emphasis from props and config", async () => {
    const view = await renderClipboard(
      <CopyButton
        value="INV-1042"
        label="Copy invoice number"
        copiedLabel="Number copied"
        copiedAnnouncement="Invoice number on the clipboard"
      />,
      { components: { clipboard: { variant: "ghost" } } },
    );

    const button = view.getByRole("button", { name: "Copy invoice number" });

    expect(classesOf(view, "clipboard-status")).toContain("opacity-0");
    expect(String(button.props.className)).toContain("bg-transparent");

    await act(async () => {
      fireEvent.press(button);
    });

    expect(view.getByTestId("clipboard-status").props.children).toBe(
      "Invoice number on the clipboard",
    );
  });

  it("keeps a consumer's own affordance instead of the drawn one", async () => {
    const view = await renderClipboard(
      <CopyButton
        value="INV-1042"
        copyIcon={<Typography>Copy it</Typography>}
        copiedIcon={<Typography>Done</Typography>}
      />,
    );

    expect(view.getByText("Copy it")).toBeTruthy();
    expect(view.queryByText("⧉")).toBeNull();

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(view.getByText("Done")).toBeTruthy();
    expect(view.queryByText("✓")).toBeNull();
  });

  it("hands a failed copy to the consumer rather than showing a copied state", async () => {
    const errors: unknown[] = [];
    const cause = new Error("The platform refused the write");
    write.mockRejectedValueOnce(cause);

    const view = await renderClipboard(
      <CopyButton value="INV-1042" onError={(error) => errors.push(error)} />,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(errors).toEqual([cause]);
    // The label stays where it was — a control that could not copy must not rename itself
    // "Copied" — and the status region says what went wrong instead.
    expect(view.getByRole("button", { name: "Copy" })).toBeTruthy();
    expect(view.getByTestId("clipboard-status").props.children).toBe(
      "Copy failed",
    );
  });

  it("announces a failure with the wording it is given", async () => {
    write.mockRejectedValueOnce(new Error("The platform refused the write"));

    const view = await renderClipboard(
      <CopyButton value="INV-1042" errorAnnouncement="Nothing to copy" />,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(view.getByTestId("clipboard-status").props.children).toBe(
      "Nothing to copy",
    );
  });

  it("announces a failed copy instead of claiming success when there is nothing to copy", async () => {
    const errors: unknown[] = [];

    const view = await renderClipboard(
      <CopyButton value="" onError={(error) => errors.push(error)} />,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(write).not.toHaveBeenCalled();
    expect(errors).toHaveLength(1);
    expect(view.getByRole("button", { name: "Copy" })).toBeTruthy();
    expect(view.getByTestId("clipboard-status").props.children).toBe(
      "Copy failed",
    );
  });

  it("announces a successful copy through the platform's own API", async () => {
    // The live region below the control is what a browser announces with; the platform has
    // no equivalent region, so the same message is spoken imperatively on iOS and Android.
    write.mockResolvedValueOnce(true);
    const speak = jest
      .spyOn(AccessibilityInfo, "announceForAccessibility")
      .mockImplementation(() => {});

    const view = await renderClipboard(
      <CopyButton value="INV-1042" copiedAnnouncement="Invoice copied" />,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(speak).toHaveBeenCalledWith("Invoice copied");

    speak.mockRestore();
  });

  it("announces a failed copy through the platform's own API, at the alert level", async () => {
    write.mockResolvedValueOnce(false);
    const speak = jest
      .spyOn(AccessibilityInfo, "announceForAccessibility")
      .mockImplementation(() => {});

    const view = await renderClipboard(
      <CopyButton value="INV-1042" errorAnnouncement="Nothing to copy" />,
    );

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Copy" }));
    });

    expect(speak).toHaveBeenCalledWith("Nothing to copy");

    speak.mockRestore();
  });

  it("rounds the control by the application's default when nothing configures it", async () => {
    const view = await renderClipboard(<CopyButton value="INV-1042" />);

    // The application's `defaultRadius` is the tier the control has always rounded by, so an
    // unconfigured control is unchanged.
    expect(buttonClassesOf(view)).toContain("rounded-md");
  });

  it("rounds the control by components.clipboard.radius", async () => {
    const view = await renderClipboard(<CopyButton value="INV-1042" />, {
      components: { clipboard: { radius: "full" } },
    });

    expect(buttonClassesOf(view)).toContain("rounded-full");
  });

  it("lets the instance's radius win over the configured one", async () => {
    const view = await renderClipboard(
      <CopyButton value="INV-1042" radius="none" />,
      { components: { clipboard: { radius: "full" } } },
    );

    expect(buttonClassesOf(view)).toContain("rounded-none");
  });
});
