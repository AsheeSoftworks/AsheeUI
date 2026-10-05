/**
 * Behaviour tests for the Section layout component.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Section } from "./Section";

describe("Section", () => {
  it("is a section landmark with the framework rhythm and no background", () => {
    const { container } = renderWithProvider(<Section>x</Section>);
    const element = container.firstElementChild as HTMLElement;

    expect(element.tagName).toBe("SECTION");
    expect(element.className).toContain("py-12");
    expect(element.className).not.toContain("bg-secondary/50");
  });

  it("takes its rhythm, background and separator from its props", () => {
    const { container } = renderWithProvider(
      <Section spacing="xl" background="muted" divider>
        x
      </Section>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("py-16");
    expect(className).toContain("bg-secondary/50");
    expect(className).toContain("border-t");
  });

  it("does not own the width until it is asked to", () => {
    const { container: plain } = renderWithProvider(<Section>x</Section>);
    expect(plain.querySelector(".max-w-6xl")).toBeNull();

    const { container: contained } = renderWithProvider(
      <Section contained containerSize="xl">
        x
      </Section>,
    );

    expect(contained.querySelector(".max-w-7xl")).not.toBeNull();
  });

  it("renders through the element named by the as prop", () => {
    const { container } = renderWithProvider(<Section as="div">x</Section>);

    expect((container.firstElementChild as HTMLElement).tagName).toBe("DIV");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Section>x</Section>, {
      config: makeComponentConfig("section", {
        spacing: "sm",
        background: "tinted",
      }),
    });
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("py-6");
    expect(className).toContain("bg-primary/5");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<Section spacing="lg">x</Section>)).toContain(
      "py-12",
    );
    expectHydrationClean(
      <Section background="muted">
        <span>Content</span>
      </Section>,
    );
  });
});
