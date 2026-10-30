/**
 * Behaviour tests for the native Drawer.
 *
 * The tests state the component's contract: it is drawn by the platform, what it holds is
 * inside it, a press on the dimmed layer dismisses it, a press inside it does not, either way
 * of dismissing it can be switched off under both the canonical name and the deprecated
 * alias, and the size and the edge it comes from resolve through the configuration cascade —
 * with a side placement resolving to the sheet the platform uses.
 */

import {
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { Drawer } from "./Drawer";

/**
 * Render a drawer inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderDrawer(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
}

/**
 * Read the classes of the sheet the drawer presents.
 *
 * @param view - The rendered tree.
 * @returns Its class string.
 */
function sheetClasses(view: RenderResult): string {
  const sheet = view.getByText("Filters").parent as {
    props: { className?: string };
  };

  return sheet.props.className as string;
}

/**
 * Ask the platform's presentation to close, the way the back gesture or the back button does.
 *
 * The platform's modal host is the one node that carries a request-close handler, so it is
 * found by that handler rather than by a type name: the renderer keeps host nodes, not the
 * framework's composite ones.
 *
 * @param view - The rendered tree.
 */
function requestPlatformClose(view: RenderResult): void {
  const host = view.container
    .queryAll((node) => typeof node.props.onRequestClose === "function")
    .at(0);

  if (!host) throw new Error("the drawer did not present a platform modal");

  host.props.onRequestClose();
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

  it("dismisses itself through the platform's own way out when that is allowed", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer isOpen onClose={onClose}>
        <Text>Filters</Text>
      </Drawer>,
    );

    requestPlatformClose(view);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("accepts the canonical dismissal names as instance props", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer
        isOpen
        onClose={onClose}
        closeOnBackdropClick={false}
        closeOnEscape={false}>
        <Text>Filters</Text>
      </Drawer>,
    );

    await fireEvent.press(view.getByLabelText("Close"));
    requestPlatformClose(view);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("reads the canonical dismissal names from the component configuration", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer isOpen onClose={onClose}>
        <Text>Filters</Text>
      </Drawer>,
      {
        components: {
          drawer: { closeOnBackdropClick: false, closeOnEscape: false },
        },
      },
    );

    await fireEvent.press(view.getByLabelText("Close"));
    requestPlatformClose(view);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("keeps the deprecated alias spellings working as configuration", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer isOpen onClose={onClose}>
        <Text>Filters</Text>
      </Drawer>,
      {
        components: {
          drawer: { closeOnOverlayClick: false, closeOnEsc: false },
        },
      },
    );

    await fireEvent.press(view.getByLabelText("Close"));
    requestPlatformClose(view);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("lets the canonical name win over the alias it deprecates", async () => {
    const onClose = jest.fn();
    const view = await renderDrawer(
      <Drawer isOpen onClose={onClose}>
        <Text>Filters</Text>
      </Drawer>,
      {
        components: {
          drawer: { closeOnBackdropClick: false, closeOnOverlayClick: true },
        },
      },
    );

    await fireEvent.press(view.getByLabelText("Close"));

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
    ).rejects.toThrow(/AsheeUIProvider/);

    silence.mockRestore();
  });
});
