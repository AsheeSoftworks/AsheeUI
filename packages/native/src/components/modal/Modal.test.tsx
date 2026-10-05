/**
 * Behaviour tests for the native Modal.
 *
 * The tests state the component's contract: it is drawn by the platform rather than by the
 * framework, what it holds is inside it, a press on the dimmed layer dismisses it, a press
 * inside it does not, and each way of dismissing it can be switched off. The platform's own
 * view of a modal is asserted through the presentation the platform is asked for, because
 * that presentation *is* the behaviour here.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Modal } from "./Modal";

/**
 * Render a modal inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderModal(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native Modal", () => {
  it("shows what it holds while it is open", async () => {
    const view = await renderModal(
      <Modal isOpen>
        <Text>Delete this invoice?</Text>
      </Modal>,
    );

    expect(view.getByText("Delete this invoice?")).toBeTruthy();
  });

  it("keeps what it holds out of the tree while it is closed", async () => {
    const view = await renderModal(
      <Modal isOpen={false}>
        <Text>Delete this invoice?</Text>
      </Modal>,
    );

    expect(view.queryByText("Delete this invoice?")).toBeNull();
  });

  it("dismisses itself when the dimmed layer is pressed", async () => {
    const onClose = jest.fn();
    const view = await renderModal(
      <Modal isOpen onClose={onClose}>
        <Text>Delete this invoice?</Text>
      </Modal>,
    );

    await fireEvent.press(view.getByLabelText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("stays open when the consumer asked it not to close on that press", async () => {
    const onClose = jest.fn();
    const view = await renderModal(
      <Modal isOpen onClose={onClose} closeOnBackdropClick={false}>
        <Text>Delete this invoice?</Text>
      </Modal>,
    );

    await fireEvent.press(view.getByLabelText("Close"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not dismiss itself when the press lands inside it", async () => {
    const onClose = jest.fn();
    const view = await renderModal(
      <Modal isOpen onClose={onClose}>
        <Text>Delete this invoice?</Text>
      </Modal>,
    );

    // The surface takes its own presses, so a press on what it holds never reaches the layer
    // that dismisses the modal.
    await fireEvent.press(view.getByText("Delete this invoice?"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("resolves its size, position and rounding through the cascade", async () => {
    const view = await renderModal(
      <Modal isOpen>
        <Text>Delete this invoice?</Text>
      </Modal>,
      {
        components: {
          modal: { size: "xl", position: "bottom", radius: "full" },
        },
      },
    );
    const surface = view.getByText("Delete this invoice?").parent?.props as
      | { className?: string }
      | undefined;

    expect(surface?.className).toContain("max-w-4xl");
    expect(surface?.className).toContain("justify-end");
    expect(surface?.className).toContain("rounded-full");
  });

  it("lets an instance prop win over the configured value, and the consumer's classes win last", async () => {
    const view = await renderModal(
      <Modal isOpen size="sm" className="mt-2">
        <Text>Delete this invoice?</Text>
      </Modal>,
      { components: { modal: { size: "xl" } } },
    );
    const surface = view.getByText("Delete this invoice?").parent?.props as
      | { className?: string }
      | undefined;

    expect(surface?.className).toContain("max-w-sm");
    expect(surface?.className).not.toContain("max-w-4xl");
    expect(surface?.className?.endsWith("mt-2")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(
        <Modal isOpen>
          <Text>Delete this invoice?</Text>
        </Modal>,
      ),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
