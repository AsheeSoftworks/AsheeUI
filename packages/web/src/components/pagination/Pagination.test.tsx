import { describe, expect, it, vi } from "vitest";
import {
  createUser,
  expectHydrationClean,
  makeComponentConfig,
  renderWithProvider,
  within,
} from "../../test";
import { Pagination } from "./Pagination";
import { getPaginationRange } from "./pagination.helpers";

describe("Pagination", () => {
  it("is a named navigation landmark over an ordered list", () => {
    const { getByRole } = renderWithProvider(
      <Pagination page={1} pageCount={3} />,
    );
    const nav = getByRole("navigation", { name: "Pagination" });

    expect(within(nav).getByRole("list")).toBeInTheDocument();
  });

  it("marks the current page and leaves the others unmarked", () => {
    const { getByRole } = renderWithProvider(
      <Pagination page={2} pageCount={3} />,
    );

    expect(getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("button", { name: "Page 3" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("reports the chosen page and ignores the current one", async () => {
    const user = createUser();
    const onPageChange = vi.fn();
    const { getByRole } = renderWithProvider(
      <Pagination page={2} pageCount={5} onPageChange={onPageChange} />,
    );

    await user.click(getByRole("button", { name: "Page 3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(getByRole("button", { name: "Page 2" }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("moves with the previous and next controls and disables them at the edges", async () => {
    const user = createUser();
    const onPageChange = vi.fn();
    const first = renderWithProvider(
      <Pagination page={1} pageCount={5} onPageChange={onPageChange} />,
    );

    expect(
      within(first.container).getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();

    await user.click(
      within(first.container).getByRole("button", { name: "Next page" }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);

    const last = renderWithProvider(
      <Pagination page={5} pageCount={5} onPageChange={onPageChange} />,
    );

    expect(
      within(last.container).getByRole("button", { name: "Next page" }),
    ).toBeDisabled();
  });

  it("collapses a long range and keeps the gaps out of the accessibility tree", () => {
    const { container, getByRole, queryByRole } = renderWithProvider(
      <Pagination page={5} pageCount={20} />,
    );
    const gaps = container.querySelectorAll('span[aria-hidden="true"]');

    expect(gaps).toHaveLength(2);
    expect(gaps[0].textContent).toBe("\u2026");

    expect(queryByRole("button", { name: "Page 7" })).toBeNull();
    expect(getByRole("button", { name: "Page 20" })).toBeInTheDocument();
  });

  it("renders links when destinations are supplied", () => {
    const { getByRole, queryByRole } = renderWithProvider(
      <Pagination
        page={2}
        pageCount={3}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );

    expect(getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "href",
      "/invoices?page=3",
    );
    expect(getByRole("link", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(getByRole("link", { name: "Previous page" })).toHaveAttribute(
      "href",
      "/invoices?page=1",
    );
    expect(queryByRole("button", { name: /Page/ })).toBeNull();
  });

  it("offers first and last controls when asked", () => {
    const { queryByRole } = renderWithProvider(
      <Pagination page={2} pageCount={3} />,
    );

    expect(queryByRole("button", { name: "First page" })).toBeNull();

    const withEdges = renderWithProvider(
      <Pagination page={2} pageCount={3} showEdges />,
    );

    expect(
      within(withEdges.container).getByRole("button", { name: "First page" }),
    ).toBeInTheDocument();
    expect(
      within(withEdges.container).getByRole("button", { name: "Last page" }),
    ).toBeInTheDocument();
  });

  it("calculates a range around the current page", () => {
    expect(getPaginationRange(1, 10)).toEqual([1, 2, "ellipsis", 10]);
    expect(getPaginationRange(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ]);
    expect(getPaginationRange(10, 10)).toEqual([1, "ellipsis", 9, 10]);
    expect(getPaginationRange(2, 4)).toEqual([1, 2, 3, 4]);
    expect(getPaginationRange(1, 1)).toEqual([1]);
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it("resolves the configured control tokens", () => {
    const { getByRole } = renderWithProvider(
      <Pagination page={1} pageCount={3} />,
      {
        config: makeComponentConfig("pagination", {
          color: "danger",
          variant: "solid",
        }),
      },
    );

    expect(getByRole("button", { name: "Page 2" }).className).toContain(
      "danger",
    );
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Pagination page={5} pageCount={20} />);
    expectHydrationClean(
      <Pagination
        page={2}
        pageCount={3}
        hrefForPage={(target) => `/invoices?page=${target}`}
      />,
    );
  });
});
