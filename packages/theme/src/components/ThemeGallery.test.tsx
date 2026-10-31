import { AsheeUIProvider } from "asheeui";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { THEME_PRESETS } from "../lib/presets";
import { ThemeGallery } from "./ThemeGallery";

/** The gallery reads the resolved palettes from the provider. */
function renderGallery(ui: React.ReactElement) {
  return render(<AsheeUIProvider>{ui}</AsheeUIProvider>);
}

describe("ThemeGallery", () => {
  it("offers a create action when there are no themes", () => {
    const onCreate = vi.fn();
    renderGallery(<ThemeGallery themes={{}} onCreate={onCreate} />);

    expect(screen.getByText(/No custom themes yet/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Create a theme" }));

    expect(onCreate).toHaveBeenCalled();
  });

  it("renders a saved theme with its actions", () => {
    const onSelect = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderGallery(
      <ThemeGallery
        themes={{ ocean: { extends: "dark", primary: "#38bdf8" } }}
        activeTheme="ocean"
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getAllByText("ocean").length).toBeGreaterThan(0);
    expect(screen.getByText("Active")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Use" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onSelect).toHaveBeenCalledWith("ocean");
    expect(onEdit).toHaveBeenCalledWith("ocean");
    expect(onDelete).toHaveBeenCalledWith("ocean");
  });

  it("offers starter presets without saving them itself", () => {
    const onPresetSelect = vi.fn();
    renderGallery(
      <ThemeGallery
        themes={{}}
        presets={THEME_PRESETS}
        onPresetSelect={onPresetSelect}
        onCreate={() => {}}
      />,
    );

    expect(screen.getByText("Start from a preset")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Use" })[0] as HTMLElement);

    expect(onPresetSelect).toHaveBeenCalledWith(THEME_PRESETS[0]);
  });
});
