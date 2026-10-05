/**
 * Behaviour tests for the native FileUpload.
 *
 * The tests state the component's contract: the zone names the field and asks for a file, it
 * lists what has been chosen and reports a removal, an unavailable field refuses to ask, and
 * the family's label block and validation vocabulary are drawn.
 */

import { act, fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { FileUpload } from "./FileUpload";

/** Render the field inside the framework provider. */
async function renderUpload(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native FileUpload", () => {
  it("asks for a file from the zone", async () => {
    const onChoose = jest.fn();
    const view = await renderUpload(
      <FileUpload
        testID="zone"
        label="Receipt"
        files={[]}
        onChoose={onChoose}
      />,
    );

    expect(view.getByTestId("zone").props.accessibilityLabel).toBe("Receipt");

    await act(async () => {
      fireEvent.press(view.getByTestId("zone"));
    });

    expect(onChoose).toHaveBeenCalledTimes(1);
  });

  it("lists the files it was given, with the size the reader reads", async () => {
    const view = await renderUpload(
      <FileUpload
        testID="zone"
        label="Receipt"
        files={[{ name: "receipt.pdf", size: 2048 }]}
      />,
    );

    expect(view.getByText("receipt.pdf")).toBeTruthy();
    expect(view.getByText("2 kB")).toBeTruthy();
  });

  it("reports a removal with the file's name", async () => {
    const onRemove = jest.fn();
    const view = await renderUpload(
      <FileUpload
        testID="zone"
        label="Receipt"
        files={[{ name: "receipt.pdf" }]}
        onRemove={onRemove}
      />,
    );

    await act(async () => {
      fireEvent.press(view.getByLabelText("Remove receipt.pdf"));
    });

    expect(onRemove).toHaveBeenCalledWith("receipt.pdf");
  });

  it("refuses to ask when it is unavailable", async () => {
    const onChoose = jest.fn();
    const view = await renderUpload(
      <FileUpload
        testID="zone"
        label="Receipt"
        files={[]}
        isDisabled
        onChoose={onChoose}
      />,
    );

    await act(async () => {
      fireEvent.press(view.getByTestId("zone"));
    });

    expect(onChoose).not.toHaveBeenCalled();
    expect(view.getByTestId("zone").props.accessibilityState.disabled).toBe(
      true,
    );
  });

  it("draws the family's label block and reports an invalid field", async () => {
    const view = await renderUpload(
      <FileUpload
        testID="zone"
        label="Receipt"
        description="A photo of it is fine"
        status="error"
        message="A receipt is required"
        required
        files={[]}
      />,
    );

    expect(view.getByText("A photo of it is fine")).toBeTruthy();
    expect(view.getByText("A receipt is required")).toBeTruthy();
    expect(view.getByText("*")).toBeTruthy();
    expect(view.getByTestId("zone").props["aria-invalid"]).toBe(true);
  });

  it("resolves the instruction and the control's name through configuration", async () => {
    const view = await renderUpload(
      <FileUpload testID="zone" label="Receipt" files={[]} />,
      {
        components: {
          fileupload: { hint: "Attach the scan", buttonLabel: "Attach" },
        },
      },
    );

    expect(view.getByText("Attach")).toBeTruthy();
    expect(view.getByText("Attach the scan")).toBeTruthy();
  });
});
