/**
 * Behaviour tests for the native Tabs.
 *
 * The tests state the component's contract: the triggers form a tablist whose triggers are
 * tabs, the first tab is the one selected at first, selecting another reveals its panel and
 * hides the one before, a consumer who owns the selection is told about every change and
 * decides what happens, a disabled tab cannot be selected and says so, and the bar's
 * treatment and the triggers' styling resolve through the configuration cascade.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Tabs } from "./Tabs";

/** The tabs the tests move between. */
const TABS = [
  { id: "invoices", label: "Invoices", content: "42 open" },
  { id: "clients", label: "Clients", content: "9 active" },
  {
    id: "archive",
    label: "Archive",
    content: "Nothing archived",
    disabled: true,
  },
];

/**
 * Render a tab bar inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderTabs(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native Tabs", () => {
  it("draws its triggers as tabs, each reachable on its own", async () => {
    const view = await renderTabs(<Tabs testID="tabs" tabs={TABS} />);

    // The bar itself is not an accessibility element: each trigger is, and carries the
    // state a reader needs, which is how a native tab bar is read.
    expect(view.getByRole("tab", { name: "Invoices" })).toBeTruthy();
    expect(view.getByRole("tab", { name: "Clients" })).toBeTruthy();
  });

  it("selects the first tab when nothing says otherwise", async () => {
    const view = await renderTabs(<Tabs testID="tabs" tabs={TABS} />);

    expect(
      view.getByRole("tab", { name: "Invoices" }).props.accessibilityState,
    ).toMatchObject({ selected: true });
    expect(view.getByText("42 open")).toBeTruthy();
  });

  it("reveals the panel of the tab the reader selects, and hides the one before", async () => {
    const view = await renderTabs(<Tabs testID="tabs" tabs={TABS} />);

    await fireEvent.press(view.getByRole("tab", { name: "Clients" }));

    expect(view.getByText("9 active")).toBeTruthy();
    expect(view.queryByText("42 open")).toBeNull();
    expect(
      view.getByRole("tab", { name: "Clients" }).props.accessibilityState,
    ).toMatchObject({ selected: true });
  });

  it("selects the tab it was told to select at first", async () => {
    const view = await renderTabs(
      <Tabs testID="tabs" tabs={TABS} defaultActiveId="clients" />,
    );

    expect(view.getByText("9 active")).toBeTruthy();
  });

  it("reports every change to a consumer who owns the selection, and decides nothing itself", async () => {
    const onChange = jest.fn();
    const view = await renderTabs(
      <Tabs
        testID="tabs"
        tabs={TABS}
        activeId="invoices"
        onChange={onChange}
      />,
    );

    await fireEvent.press(view.getByRole("tab", { name: "Clients" }));

    expect(onChange).toHaveBeenCalledWith("clients");
    // The consumer owns the selection, so the panel stays where it was.
    expect(view.getByText("42 open")).toBeTruthy();
  });

  it("cannot be moved to a tab that is disabled, and reports it as disabled", async () => {
    const onChange = jest.fn();
    const view = await renderTabs(
      <Tabs testID="tabs" tabs={TABS} onChange={onChange} />,
    );
    const disabled = view.getByRole("tab", { name: "Archive" });

    await fireEvent.press(disabled);

    expect(onChange).not.toHaveBeenCalled();
    expect(disabled.props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it("resolves the bar's treatment and the triggers' styling through the cascade", async () => {
    const view = await renderTabs(<Tabs testID="tabs" tabs={TABS} />, {
      components: { tabs: { variant: "bordered", size: "lg" } },
    });
    const bar = view.getByTestId("tabs").children[0] as {
      props: { className?: string };
    };

    expect(bar.props.className).toContain("border");
    expect(
      (
        view.getByRole("tab", { name: "Invoices" }).props as {
          className?: string;
        }
      ).className,
    ).toContain("px-4");
  });

  it("marks the selected trigger with the underlined treatment when the bar is underlined", async () => {
    const view = await renderTabs(<Tabs testID="tabs" tabs={TABS} />);

    expect(
      (
        view.getByRole("tab", { name: "Invoices" }).props as {
          className?: string;
        }
      ).className,
    ).toContain("border-b");
  });

  it("stretches every trigger to fill the bar when the consumer asks for it", async () => {
    const view = await renderTabs(<Tabs testID="tabs" tabs={TABS} fullWidth />);

    expect(
      (
        view.getByRole("tab", { name: "Invoices" }).props as {
          className?: string;
        }
      ).className,
    ).toContain("flex-1");
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Tabs tabs={TABS} />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
