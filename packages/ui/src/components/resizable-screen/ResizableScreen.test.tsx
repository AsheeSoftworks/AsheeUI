import { describe, expect, it, vi } from "vitest";
import { createUser, pressArrow, renderWithProvider } from "../../test";
import { ResizableScreen } from "./ResizableScreen";

const PANELS = [
  <div key="primary">Primary</div>,
  <div key="secondary">Secondary</div>,
];

describe("ResizableScreen", () => {
  it("exposes a focusable separator with its value range", () => {
    const { getByRole } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator", { name: "Resize panel split" });

    expect(separator).toHaveAttribute("tabindex", "0");
    expect(separator).toHaveAttribute("aria-valuenow", "50");
    expect(separator).toHaveAttribute("aria-valuemin", "20");
    expect(separator).toHaveAttribute("aria-valuemax", "80");
  });

  it("resizes with the keyboard by the configured step", async () => {
    const user = createUser();
    const onSizeChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <ResizableScreen step={5} onSizeChange={onSizeChange}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    separator.focus();
    await pressArrow(user, "ArrowRight");
    expect(separator).toHaveAttribute("aria-valuenow", "55");

    await pressArrow(user, "ArrowLeft");
    expect(separator).toHaveAttribute("aria-valuenow", "50");

    expect(onSizeChange).toHaveBeenCalled();
  });

  it("clamps keyboard resizing to the maximum size", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <ResizableScreen maxSize={60}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    separator.focus();
    await pressArrow(user, "ArrowRight", 10);

    expect(separator).toHaveAttribute("aria-valuenow", "60");
  });

  it("uses vertical keys when the orientation is vertical", async () => {
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <ResizableScreen orientation="vertical">
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    separator.focus();
    await pressArrow(user, "ArrowDown");
    expect(separator).toHaveAttribute("aria-valuenow", "52");

    await pressArrow(user, "ArrowUp");
    expect(separator).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders both panels", () => {
    const { getByText } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );

    expect(getByText("Primary")).toBeInTheDocument();
    expect(getByText("Secondary")).toBeInTheDocument();
  });
});
