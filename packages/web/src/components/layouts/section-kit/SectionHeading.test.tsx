/**
 * Behaviour tests for the section kit's heading block.
 *
 * The heading's element is the contract these tests exist for: a band is a
 * section of a page, so a heading block never claims the page's `h1` on its own
 * — at any size — and `titleAs` is the one way to raise it.
 */

import { describe, expect, it } from "vitest";
import { renderWithProvider } from "../../../test";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it.each(["md", "lg", "xl"] as const)(
    "renders its title as a level two heading at size %s",
    (size) => {
      const { getByRole } = renderWithProvider(
        <SectionHeading title="Workflow" size={size} />,
      );

      expect(getByRole("heading", { level: 2, name: "Workflow" }).tagName).toBe(
        "H2",
      );
    },
  );

  it("raises the title to h1 through titleAs when the block is the page title", () => {
    const { getByRole } = renderWithProvider(
      <SectionHeading title="Run your campaigns" titleAs="h1" size="xl" />,
    );

    expect(
      getByRole("heading", { level: 1, name: "Run your campaigns" }).tagName,
    ).toBe("H1");
  });

  it("lowers the title through titleAs for a band nested in an existing section", () => {
    const { getByRole } = renderWithProvider(
      <SectionHeading title="Nested" titleAs="h3" />,
    );

    expect(getByRole("heading", { level: 3, name: "Nested" }).tagName).toBe(
      "H3",
    );
  });

  it("keeps the size's visual step independent of the element", () => {
    // `xl` still asks for the display role; only the element recorded in the
    // outline is held below `h1`.
    const { getByRole } = renderWithProvider(
      <SectionHeading title="Big" size="xl" />,
    );

    expect(getByRole("heading", { level: 2 }).className).toContain("text-3xl");
  });

  it("names its title so a band can point at it", () => {
    const { getByRole } = renderWithProvider(
      <section aria-labelledby="workflow-heading">
        <SectionHeading title="Workflow" titleId="workflow-heading" />
      </section>,
    );

    expect(getByRole("region", { name: "Workflow" })).toBeDefined();
  });

  it("renders its eyebrow and description", () => {
    const { getByText } = renderWithProvider(
      <SectionHeading
        eyebrow="Workflow"
        title="Everything a campaign needs"
        description="Segment, schedule and measure."
      />,
    );

    expect(getByText("Workflow")).toBeDefined();
    expect(getByText("Segment, schedule and measure.")).toBeDefined();
  });

  it("renders nothing when it has nothing to show", () => {
    const { container } = renderWithProvider(<SectionHeading />);

    expect(container.innerHTML).toBe("");
  });
});
