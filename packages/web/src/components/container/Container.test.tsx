/**
 * Behaviour tests for the Container layout primitive.
 *
 * The checks state the contract rather than the markup: a container is a
 * centred, capped column with a gutter, configuration restyles it, and it
 * renders on the server and hydrates without a mismatch.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Container } from "./Container";

describe("Container", () => {
  it("caps the width, centres the content and reserves a gutter", () => {
    const { container } = renderWithProvider(<Container>x</Container>);
    const element = container.firstElementChild as HTMLElement;

    expect(element.className).toContain("max-w-6xl");
    expect(element.className).toContain("mx-auto");
    expect(element.className).toContain("px-4");
  });

  it("changes its width with the size prop", () => {
    const { container } = renderWithProvider(
      <Container size="sm">x</Container>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "max-w-2xl",
    );
  });

  it("lets a consumer remove the gutter, the cap and the centring", () => {
    const { container } = renderWithProvider(
      <Container size="full" gutter={false} centered={false}>
        x
      </Container>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("max-w-none");
    expect(className).not.toContain("mx-auto");
    expect(className).not.toContain("px-4");
  });

  it("renders through the element named by the as prop", () => {
    const { getByRole } = renderWithProvider(
      <Container as="section" aria-label="Featured">
        x
      </Container>,
    );

    expect(getByRole("region", { name: "Featured" })).toBeDefined();
  });

  it("takes its width from configuration when the prop is absent", () => {
    const { container } = renderWithProvider(<Container>x</Container>, {
      config: makeComponentConfig("container", { size: "xl" }),
    });

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "max-w-7xl",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(<Container>x</Container>);

    expect(html).toContain("max-w-6xl");
    expectHydrationClean(
      <Container>
        <span>Content</span>
      </Container>,
    );
  });
});
