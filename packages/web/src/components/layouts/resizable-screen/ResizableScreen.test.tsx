import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  fireEvent,
  makeComponentConfig,
  pressArrow,
  pressKey,
  renderWithProvider,
  within,
} from "../../../test";
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

  it("reports the orientation of the divider, not of the panes' axis", () => {
    const horizontal = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );

    // Side-by-side panes are divided by a vertical separator.
    expect(horizontal.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );

    const vertical = renderWithProvider(
      <ResizableScreen orientation="vertical">
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );

    // Stacked panes are divided by a horizontal separator.
    expect(within(vertical.container).getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
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

  it("resizes by the pointer's travel, so the grab point does not shift the split", () => {
    const onSizeChange = vi.fn();
    const { container, getByRole } = renderWithProvider(
      <ResizableScreen onSizeChange={onSizeChange}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const root = container.firstElementChild as HTMLElement;
    root.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 400,
        bottom: 300,
        width: 400,
        height: 300,
        toJSON: () => ({}),
      }) as DOMRect;

    const separator = getByRole("separator");

    // The pointer goes down inside the handle, away from the boundary; nothing
    // moves yet, so the split must not jump to the pointer.
    fireEvent.pointerDown(separator, { pointerId: 1, clientX: 210 });
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 210 });
    expect(onSizeChange).toHaveBeenLastCalledWith(50);

    // 40 px of travel on a 400 px container is ten percentage points.
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 250 });
    expect(onSizeChange).toHaveBeenLastCalledWith(60);

    fireEvent.pointerUp(separator, { pointerId: 1, clientX: 250 });
  });

  it("resolves the container minimums through configuration", () => {
    const { container } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
      {
        config: makeComponentConfig("resizableScreen", {
          minContainerWidth: 320,
          minContainerHeight: 240,
        }),
      },
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.style.minWidth).toBe("320px");
    expect(root.style.minHeight).toBe("240px");
  });

  it("lets an instance minimum win over the configured one", () => {
    const { container } = renderWithProvider(
      <ResizableScreen minContainerWidth={280}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
      {
        config: makeComponentConfig("resizableScreen", {
          minContainerWidth: 320,
        }),
      },
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.style.minWidth).toBe("280px");
  });

  it("grows the second panel into the room the first one leaves", () => {
    const { container } = renderWithProvider(
      <ResizableScreen>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const root = container.firstElementChild as HTMLElement;
    const secondary = root.lastElementChild as HTMLElement;

    expect(secondary.style.flexGrow).toBe("1");
    expect(secondary.style.width).toBe("");
    expect(secondary.style.height).toBe("");
  });

  it("warns about an inverted size range and treats it as a range", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const user = createUser();
    const { getByRole } = renderWithProvider(
      <ResizableScreen minSize={80} maxSize={20}>
        {PANELS[0]}
        {PANELS[1]}
      </ResizableScreen>,
    );
    const separator = getByRole("separator");

    expect(separator).toHaveAttribute("aria-valuemin", "20");
    expect(separator).toHaveAttribute("aria-valuemax", "80");
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("minSize (80) is greater than maxSize (20)"),
    );

    separator.focus();
    await pressKey(user, "Home");
    expect(separator).toHaveAttribute("aria-valuenow", "20");

    await pressKey(user, "End");
    expect(separator).toHaveAttribute("aria-valuenow", "80");

    warn.mockRestore();
  });
});
