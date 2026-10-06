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
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { writeToClipboard } from "../../utils/write-to-clipboard";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
import { Clipboard } from "./Clipboard";
import { CopyButton } from "./CopyButton";

jest.mock("../../utils/write-to-clipboard", () => ({
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
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
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
        copyIcon={<Text>Copy it</Text>}
        copiedIcon={<Text>Done</Text>}
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
    expect(view.getByRole("button", { name: "Copy" })).toBeTruthy();
    expect(view.getByTestId("clipboard-status").props.children).toBe("");
  });
});
