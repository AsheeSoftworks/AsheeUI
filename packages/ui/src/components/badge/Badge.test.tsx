import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderWithProvider,
  within,
} from "../../test";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its content", () => {
    const { getByText } = renderWithProvider(<Badge>Active</Badge>);

    expect(getByText("Active")).toBeInTheDocument();
  });

  it("stands its label in for an icon-only badge and hides the icon from assistive technology", () => {
    const { container, getByTestId, getByText } = renderWithProvider(
      <Badge
        id="status-badge"
        label="Active"
        startContent={<span data-testid="icon" />}
      />,
    );
    const badge = container.querySelector("#status-badge") as HTMLElement;

    // The label is the content assistive technology reads, and the icon beside
    // it is decoration.
    expect(getByText("Active")).toBeInTheDocument();
    expect(badge.querySelector('[aria-hidden="true"]')).toContainElement(
      getByTestId("icon"),
    );
  });

  it("is not interactive, so it takes no focus and exposes no control", () => {
    const { getByText } = renderWithProvider(<Badge>Active</Badge>);
    const badge = getByText("Active");

    expect(badge.tagName).toBe("SPAN");
    expect(badge).not.toHaveAttribute("tabindex");
    expect(badge).not.toHaveAttribute("role");
  });

  it("resolves the configured colour and honours a prop override", () => {
    const configured = renderWithProvider(<Badge>Active</Badge>, {
      config: makeComponentConfig("badge", { color: "danger" }),
    });
    const overridden = renderWithProvider(
      <Badge color="success">Active</Badge>,
      { config: makeComponentConfig("badge", { color: "danger" }) },
    );

    expect(
      within(configured.container).getByText("Active").className,
    ).toContain("danger");
    expect(
      within(overridden.container).getByText("Active").className,
    ).toContain("success");
  });

  it("uses the registered radius and honours a radius override", () => {
    const { container } = renderWithProvider(
      <>
        <Badge id="badge-default">Active</Badge>
        <Badge id="badge-square" radius="none">
          Active
        </Badge>
      </>,
    );

    expect(container.querySelector("#badge-default")?.className).toContain(
      "rounded-full",
    );
    expect(container.querySelector("#badge-square")?.className).toContain(
      "rounded-none",
    );
  });

  it("renders the content slots around its text", () => {
    const { getByTestId } = renderWithProvider(
      <Badge
        startContent={<span data-testid="start" />}
        endContent={<span data-testid="end" />}>
        Active
      </Badge>,
    );

    expect(getByTestId("start")).toBeInTheDocument();
    expect(getByTestId("end")).toBeInTheDocument();
  });

  it("appends consumer classes last", () => {
    const { getByText } = renderWithProvider(
      <Badge className="ml-2 align-middle">Active</Badge>,
    );
    const badge = getByText("Active");

    expect(badge.className).toContain("ml-2");
    expect(badge.className).toContain("font-medium");
  });

  it("hydrates its server markup without a mismatch", () => {
    expectHydrationClean(<Badge color="success">Active</Badge>);
    expectHydrationClean(<Badge label="Active" />);
  });
});
