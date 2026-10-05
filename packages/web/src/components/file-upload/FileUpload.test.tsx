/**
 * Behaviour tests for the file field.
 *
 * The tests state the field's contract: it names the picker, it reports the
 * files the reader chose or dropped, it leaves out a file over the size limit and
 * says so, it lists the chosen files with a remove control that says what it
 * removes, and it shares the field contract with the other fields.
 */

import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  expectHydrationClean,
  fireEvent,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../test";
import { FileUpload } from "./FileUpload";
import { describeRejectedFiles, formatFileSize } from "./file-upload.helpers";

/**
 * Build a file of a known size.
 *
 * @param name - The file's name.
 * @param bytes - Its size in bytes.
 * @returns The file.
 */
function makeFile(name: string, bytes: number): File {
  return new File(["x".repeat(bytes)], name, {
    type: "application/pdf",
    lastModified: 1,
  });
}

describe("FileUpload", () => {
  it("names the picker and passes the picker's own rules through", () => {
    const { getByLabelText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        accept="application/pdf"
        multiple
        onFilesSelected={() => undefined}
      />,
    );
    const input = getByLabelText("Attachments") as HTMLInputElement;

    expect(input.type).toBe("file");
    expect(input).toHaveAttribute("accept", "application/pdf");
    expect(input).toHaveAttribute("multiple");
  });

  it("reports the files the reader chose", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText } = renderWithProvider(
      <FileUpload label="Attachments" onFilesSelected={onFilesSelected} />,
    );
    const invoice = makeFile("invoice.pdf", 10);

    fireEvent.change(getByLabelText("Attachments"), {
      target: { files: [invoice] },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([invoice]);
  });

  it("reports the files the reader dropped", () => {
    const onFilesSelected = vi.fn();
    const { getByText } = renderWithProvider(
      <FileUpload label="Attachments" onFilesSelected={onFilesSelected} />,
    );
    const invoice = makeFile("invoice.pdf", 10);
    const zone = getByText("Choose files").closest("label") as HTMLElement;

    fireEvent.drop(zone, { dataTransfer: { files: [invoice] } });

    expect(onFilesSelected).toHaveBeenCalledWith([invoice]);
  });

  it("leaves out a file over the size limit and says so", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText, getByRole, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        maxSize={5}
        onFilesSelected={onFilesSelected}
      />,
    );

    fireEvent.change(getByLabelText("Attachments"), {
      target: { files: [makeFile("big.pdf", 10)] },
    });

    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(getByText(/larger than 5 B/)).toBeTruthy();
    expect(getByRole("alert")).toBeTruthy();
  });

  it("keeps the files within the limit and reports the rest", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        maxSize={5}
        multiple
        onFilesSelected={onFilesSelected}
      />,
    );
    const small = makeFile("small.pdf", 3);
    const big = makeFile("big.pdf", 10);

    fireEvent.change(getByLabelText("Attachments"), {
      target: { files: [small, big] },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([small]);
    expect(getByText(/larger than 5 B/)).toBeTruthy();
  });

  it("lists the chosen files and removes one through a named control", async () => {
    const onRemove = vi.fn();
    const invoice = makeFile("invoice.pdf", 10);
    const { getByRole, getAllByRole } = renderWithProvider(
      <FileUpload
        label="Attachments"
        files={[invoice]}
        onRemove={onRemove}
        onFilesSelected={() => undefined}
      />,
    );
    const user = userEvent.setup();

    expect(getAllByRole("listitem")[0]).toHaveTextContent("invoice.pdf");

    await user.click(getByRole("button", { name: "Remove invoice.pdf" }));

    expect(onRemove).toHaveBeenCalledWith(invoice);
  });

  it("draws no remove control when the field cannot remove anything", () => {
    const { queryByRole } = renderWithProvider(
      <FileUpload
        label="Attachments"
        files={[makeFile("invoice.pdf", 10)]}
        onFilesSelected={() => undefined}
      />,
    );

    expect(queryByRole("button")).toBeNull();
  });

  it("refuses the picker and the drop when it is unavailable", () => {
    const onFilesSelected = vi.fn();
    const { getByLabelText, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        isDisabled
        onFilesSelected={onFilesSelected}
      />,
    );

    expect(getByLabelText("Attachments")).toBeDisabled();

    fireEvent.drop(getByText("Choose files").closest("label") as HTMLElement, {
      dataTransfer: { files: [makeFile("invoice.pdf", 10)] },
    });

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("takes its wording and its density from configuration", () => {
    const { getByText } = renderWithProvider(
      <FileUpload label="Attachments" onFilesSelected={() => undefined} />,
      {
        config: makeComponentConfig("fileupload", {
          buttonLabel: "Upload a receipt",
          hint: "Drop it here",
          size: "sm",
        }),
      },
    );

    expect(getByText("Upload a receipt")).toBeTruthy();
    expect(getByText(/Drop it here/i)).toBeTruthy();
    expect(getByText("Upload a receipt").closest("label")?.className).toContain(
      "px-4",
    );
  });

  it("shows the consumer's own message and status", () => {
    const { getByRole, getByText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        message="This file type is not supported."
        status="error"
        onFilesSelected={() => undefined}
      />,
    );

    expect(getByRole("alert")).toHaveTextContent(
      "This file type is not supported.",
    );
    expect(getByText("This file type is not supported.")).toBeTruthy();
  });

  it("forwards its ref to the picker", () => {
    const ref = createRef<HTMLInputElement>();
    const { getByLabelText } = renderWithProvider(
      <FileUpload
        label="Attachments"
        ref={ref}
        onFilesSelected={() => undefined}
      />,
    );

    expect(ref.current).toBe(getByLabelText("Attachments"));
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const markup = renderToServerString(
      <FileUpload label="Attachments" onFilesSelected={() => undefined} />,
    );

    expect(markup).toContain('type="file"');
    expect(markup).toContain("Choose files");
    expectHydrationClean(
      <FileUpload
        label="Attachments"
        files={[makeFile("invoice.pdf", 10)]}
        onFilesSelected={() => undefined}
      />,
    );
  });
});

describe("file size descriptions", () => {
  it("describes a size in the reader's terms", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5 MB");
  });

  it("describes one file left out differently from several", () => {
    expect(describeRejectedFiles(1, 1024)).toContain("One file was");
    expect(describeRejectedFiles(2, 1024)).toContain("2 files were");
  });
});
