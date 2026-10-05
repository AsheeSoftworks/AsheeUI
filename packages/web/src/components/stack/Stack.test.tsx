/**
 * Behaviour tests for the Stack layout primitive and its presets.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { HStack, Stack, VStack } from "./Stack";

describe("Stack", () => {
  it("lays its children out in a column with a token gap", () => {
    const { container } = renderWithProvider(<Stack>x</Stack>);
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("flex-col");
    expect(className).toContain("gap-4");
    expect(className).toContain("items-stretch");
  });

  it("takes direction, alignment and wrapping from its props", () => {
    const { container } = renderWithProvider(
      <Stack direction="row" align="center" justify="between" gap="xl" wrap>
        x
      </Stack>,
    );
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("flex-row");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-between");
    expect(className).toContain("gap-8");
    expect(className).toContain("flex-wrap");
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Stack>x</Stack>, {
      config: makeComponentConfig("stack", { gap: "sm", direction: "row" }),
    });
    const className = (container.firstElementChild as HTMLElement).className;

    expect(className).toContain("gap-2");
    expect(className).toContain("flex-row");
  });

  it("renders the presets with their own defaults and the shared options", () => {
    const { container } = renderWithProvider(
      <>
        <HStack gap="lg">a</HStack>
        <VStack gap="sm">b</VStack>
      </>,
    );
    const [row, column] = Array.from(container.children) as HTMLElement[];

    expect(row.className).toContain("flex-row");
    expect(row.className).toContain("items-center");
    expect(row.className).toContain("gap-6");
    expect(column.className).toContain("flex-col");
    expect(column.className).toContain("items-stretch");
    expect(column.className).toContain("gap-2");
  });

  it("carries the consumer's class last, so it wins", () => {
    const { container } = renderWithProvider(
      <Stack className="gap-0">x</Stack>,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain(
      "gap-0",
    );
  });

  it("renders on the server and hydrates without a mismatch", () => {
    expect(renderToServerString(<Stack gap="lg">x</Stack>)).toContain("gap-6");
    expectHydrationClean(
      <HStack gap="sm">
        <span>a</span>
        <span>b</span>
      </HStack>,
    );
  });
});
