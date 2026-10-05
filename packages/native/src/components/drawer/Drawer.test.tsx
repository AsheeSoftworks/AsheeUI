/**
 * Behaviour tests for the native Drawer.
 *
 * The tests state the component's contract: it is drawn by the platform, what it holds is
 * inside it, a press on the dimmed layer dismisses it, a press inside it does not, either way
 * of dismissing it can be switched off, and the size and the edge it comes from resolve through
 * the configuration cascade — with a side placement resolving to the sheet the platform uses.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Drawer } from "./Drawer";

/**
 * Render a drawer inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderDrawer(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes of the sheet the drawer presents.
 *
 * @param view - The rendered tree.
 * @returns Its class string.
 */
function sheetClasses(view: ReturnType<typeof render>): string {
  const sheet = view.getByText("Filters").parent as {
    props: { className?: string };
  };

  return sheet.props.className as string;
}

describe("Native Drawer", () => {
  it("shows what it holds while it is open", async () => {
    const view = await renderDrawer(
      <Drawer isOpen>
        <Text>Filters</Text>
      </Drawer>,
    );

    expect(view.getByText("Filters")).toBeTruthy();
  });

  it("keeps what it holds out of the tree while it is closed", async () => {
    const view = await renderDrawer(
      <Drawer isOpen={false}>
        <Text>Filters</Text>
      </Drawer>,
    );

    expect(view.queryByText("Filters")).toBeNull();
  });

  it("dismisses itself when the dimmed layer is pressed", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer isOpen onClose={onClose}>
        <Text>Filters</Text>
      </Drawer>,
    );

    await fireEvent.press(view.getByLabelText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stays open when the consumer asked it not to close on that press", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer isOpen onClose={onClose} closeOnOverlayClick={false}>
        <Text>Filters</Text>
      </Drawer>,
    );

    await fireEvent.press(view.getByLabelText("Close"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not dismiss itself when the press lands inside it", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer isOpen onClose={onClose}>
        <Text>Filters</Text>
      </Drawer>,
    );

    await fireEvent.press(view.getByText("Filters"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("resolves its size and its edge through the cascade", async () => {
    const view = await renderDrawer(
      <Drawer isOpen>
        <Text>Filters</Text>
      </Drawer>,
      { components: { drawer: { size: "full", placement: "top" } } },
    );

    expect(sheetClasses(view)).toContain("h-full");
  });

  it("presents a side placement as the sheet the platform uses, because a side panel has nowhere to be", async () => {
    const view = await renderDrawer(
      <Drawer isOpen placement="right">
        <Text>Filters</Text>
      </Drawer>,
    );

    // The sheet is anchored to the bottom edge whatever the web placement said, and it is
    // outlined on that same edge.
    expect(sheetClasses(view)).toContain("border-t");
    expect(sheetClasses(view)).not.toContain("border-l");
  });

  it("lets an instance prop win over the configured value, and the consumer's classes win last", async () => {
    const view = await renderDrawer(
      <Drawer isOpen size="sm" className="mt-2">
        <Text>Filters</Text>
      </Drawer>,
      { components: { drawer: { size: "full" } } },
    );

    expect(sheetClasses(view)).toContain("h-1/3");
    expect(sheetClasses(view)).not.toContain("h-full");
    expect(sheetClasses(view).endsWith("mt-2")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(
        <Drawer isOpen>
          <Text>Filters</Text>
        </Drawer>,
      ),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
