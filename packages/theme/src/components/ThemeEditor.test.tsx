import { AsheeUIProvider } from "asheeui";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeEditor } from "./ThemeEditor";

/** The editor reads the active configuration for its base palettes. */
function renderEditor(ui: React.ReactElement) {
  return render(<AsheeUIProvider>{ui}</AsheeUIProvider>);
}

describe("ThemeEditor", () => {
  it("saves a new theme under the slug of its name", () => {
    const onChange = vi.fn();
    renderEditor(<ThemeEditor themes={{}} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Save theme" }));

    expect(onChange).toHaveBeenCalledWith({
      "my-theme": { extends: "dark" },
    });
  });

  it("edits an existing runtime theme", () => {
    const onChange = vi.fn();
    renderEditor(
      <ThemeEditor
        themes={{ ocean: { extends: "dark", primary: "#0ea5e9" } }}
        initialTheme="ocean"
        onChange={onChange}
      />,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Ocean");
    fireEvent.click(screen.getByRole("button", { name: "Save theme" }));

    expect(onChange).toHaveBeenCalledWith({
      ocean: { extends: "dark", primary: "#0ea5e9" },
    });
  });

  it("deletes a runtime theme", () => {
    const onChange = vi.fn();
    renderEditor(
      <ThemeEditor
        themes={{ ocean: { extends: "dark", primary: "#0ea5e9" } }}
        initialTheme="ocean"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onChange).toHaveBeenCalledWith({});
  });

  it("refuses a reserved name and explains why", () => {
    const onChange = vi.fn();
    renderEditor(<ThemeEditor themes={{}} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Light" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save theme" }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/is reserved/i)).toBeTruthy();
  });

  it("calls onApply after a successful save when asked to", () => {
    const onChange = vi.fn();
    const onApply = vi.fn();
    renderEditor(
      <ThemeEditor themes={{}} onChange={onChange} onApply={onApply} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save & apply" }));

    expect(onChange).toHaveBeenCalled();
    expect(onApply).toHaveBeenCalledWith("my-theme");
  });
});
