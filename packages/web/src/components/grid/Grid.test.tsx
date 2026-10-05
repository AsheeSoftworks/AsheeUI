/**
 * Behaviour tests for the Grid layout primitive.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Grid } from "./Grid";

describe("Grid", () => {
  it("is a single-column grid by default", () => {
    const { container } = renderWithProvider(<Grid>x</Grid>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("grid");
    expect(className).toContain("grid-cols-1");
    expect(className).toContain("gap-4");
    expect(className).toContain("items-stretch");
  });

  it("states its column count per breakpoint", () => {
    const { container } = renderWithProvider(
      <Grid columns={1} columnsMd={2} columnsLg={4} gap="lg">
        x
      </Grid>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("grid-cols-1");
    expect(className).toContain("md:grid-cols-2");
    expect(className).toContain("lg:grid-cols-4");
    expect(className).toContain("gap-6");
  });

  it("leaves a breakpoint out rather than forcing a column count", () => {
    const { container } = renderWithProvider(<Grid columns={2}>x</Grid>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).not.toContain("md:grid-cols-");
    expect(className).not.toContain("lg:grid-cols-");
  });

  it("renders a list when it is given list items", () => {
    const { container } = renderWithProvider(
      <Grid as="ul" columns={2} columnsLg={3}>
        <li>a</li>
      </Grid>,
    );

    expect((container.firstElementChild as HTMLElement).tagName).toBe("UL");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Grid>x</Grid>, {
      config: makeComponentConfig("grid", {
        columns: 3,
        columnsLg: 6,
        align: "start",
      }),
    });
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("grid-cols-3");
    expect(className).toContain("lg:grid-cols-6");
    expect(className).toContain("items-start");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<Grid columns={2}>x</Grid>)).toContain(
      "grid-cols-2",
    );
    expectHydrationClean(
      <Grid columns={1} columnsLg={3}>
        <span>a</span>
        <span>b</span>
      </Grid>,
    );
  });
});
