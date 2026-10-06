/**
 * Behaviour tests for the native Pagination footer.
 *
 * The tests state the footer's contract: it says where the reader is in the collection and
 * offers the next page, it offers nothing when there is nothing left to load, it never
 * reports a page the collection cannot act on, it keeps its control out of the way while it
 * is told to, it states the collection's name where a reader hears it, the control's
 * dressing resolves through the configuration cascade, and the two trail options the
 * platform has no trail for resolve without inventing one.
 */

import {
  act,
  fireEvent,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Pagination } from "./Pagination";

/**
 * Render a footer inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderFooter(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Read the classes a rendered element carries.
 *
 * @param view - The rendered tree.
 * @param name - The accessible name of the element.
 * @returns Its class string.
 */
function classesOfButton(view: RenderResult, name: string): string {
  return String(
    (view.getByRole("button", { name }).props as { className?: string })
      .className ?? "",
  );
}

describe("Native Pagination", () => {
  it("states where the reader is and loads the next page", async () => {
    const onPageChange = jest.fn();
    const view = await renderFooter(
      <Pagination page={2} pageCount={12} onPageChange={onPageChange} />,
    );

    expect(view.getByText("Page 2 of 12")).toBeTruthy();

    await act(async () => {
      fireEvent.press(view.getByRole("button", { name: "Load more" }));
    });

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("offers nothing to load once the collection is exhausted", async () => {
    const view = await renderFooter(<Pagination page={12} pageCount={12} />);

    expect(view.getByText("Page 12 of 12")).toBeTruthy();
    expect(view.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("never offers a page the collection cannot act on", async () => {
    const onPageChange = jest.fn();
    const view = await renderFooter(
      <Pagination page={99} pageCount={3} onPageChange={onPageChange} />,
    );

    // The page is clamped to the collection, so the footer neither claims a page that does
    // not exist nor offers to load past the end.
    expect(view.getByText("Page 3 of 3")).toBeTruthy();
    expect(view.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("keeps the control unavailable while it is told to be", async () => {
    const onPageChange = jest.fn();
    const view = await renderFooter(
      <Pagination
        page={2}
        pageCount={12}
        isDisabled
        onPageChange={onPageChange}
      />,
    );

    const control = view.getByRole("button", { name: "Load more" });

    expect(control.props.accessibilityState).toMatchObject({ disabled: true });

    await act(async () => {
      fireEvent.press(control);
    });

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("names the collection where a reader hears it, and announces the change", async () => {
    const view = await renderFooter(
      <Pagination page={2} pageCount={12} label="Invoices" />,
    );

    const position = view.getByText("Page 2 of 12");

    expect(position.props.accessibilityLabel).toBe("Invoices. Page 2 of 12");
    // Where the reader is changes as pages load, so the statement is a live region.
    expect(position.props.accessibilityLiveRegion).toBe("polite");
  });

  it("dresses its control through the configuration cascade", async () => {
    const view = await renderFooter(<Pagination page={1} pageCount={4} />, {
      components: {
        pagination: { variant: "solid", color: "danger", size: "sm" },
      },
    });

    expect(classesOfButton(view, "Load more")).toContain("bg-danger");
  });

  it("resolves the trail options the platform has no trail for", async () => {
    const view = await renderFooter(<Pagination page={5} pageCount={12} />, {
      components: {
        pagination: { siblingCount: 3, showEdges: true },
      },
    });

    // The trailing options describe the web's numbered range. The platform's footer states
    // its position and offers one control, and it says so rather than inventing a trail.
    expect(view.getByText("Page 5 of 12")).toBeTruthy();
    expect(view.getAllByRole("button")).toHaveLength(1);
    expect(view.queryByRole("button", { name: "Page 4" })).toBeNull();
    expect(view.queryByRole("button", { name: "Last page" })).toBeNull();
  });

  it("says nothing when the collection has no pages", async () => {
    const view = await renderFooter(<Pagination page={1} pageCount={0} />);

    expect(view.queryByText(/Page/)).toBeNull();
    expect(view.queryByRole("button")).toBeNull();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Pagination page={1} pageCount={3} />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
