/**
 * Tests for the native layout kit.
 *
 * The kit's contract is a class decision per layout, so the tests read the
 * classes each primitive produced and the configuration it resolved through. The
 * responsive part of the grid is a pure function, so its inheritance rule is
 * tested at every breakpoint rather than through a device.
 *
 * Like the rest of the native suite, renders are awaited and every query comes
 * from the rendered view, because React renders concurrently on the platform.
 */

import { type RenderResult, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../provider/AsheeNativeProvider";
import { Centered, Container, Grid, HStack, Section, Stack, VStack } from ".";
import { resolveGridColumns } from "./layout-config";

/**
 * Render a layout inside the framework provider.
 *
 * @param ui - The layout under test.
 * @returns The rendered tree and its queries.
 */
async function renderLayout(ui: ReactElement) {
  return render(<AsheeNativeProvider>{ui}</AsheeNativeProvider>);
}

/**
 * Read the classes a rendered element carries.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return (view.getByTestId(testID).props as { className?: string })
    .className as string;
}

describe("Container", () => {
  it("keeps a readable width and a gutter", async () => {
    const view = await renderLayout(
      <Container testID="container">
        <Text>Content</Text>
      </Container>,
    );

    expect(classesOf(view, "container")).toContain("max-w-5xl");
    expect(classesOf(view, "container")).toContain("px-4");
    expect(classesOf(view, "container")).toContain("self-center");
  });

  it("takes its width and its gutter from its props", async () => {
    const view = await renderLayout(
      <Container testID="narrow" size="sm" gutter={false}>
        <Text>Content</Text>
      </Container>,
    );

    expect(classesOf(view, "narrow")).toContain("max-w-xl");
    expect(classesOf(view, "narrow")).not.toContain("px-4");
  });

  it("takes its width from configuration", async () => {
    const view = await render(
      <AsheeNativeProvider
        config={{ components: { container: { size: "xl" } } }}>
        <Container testID="configured">
          <Text>Content</Text>
        </Container>
      </AsheeNativeProvider>,
    );

    expect(classesOf(view, "configured")).toContain("max-w-7xl");
  });
});

describe("Stack", () => {
  it("lays its children out in a column with a token gap", async () => {
    const view = await renderLayout(
      <Stack testID="stack">
        <Text>a</Text>
      </Stack>,
    );

    expect(classesOf(view, "stack")).toContain("flex-col");
    expect(classesOf(view, "stack")).toContain("gap-4");
    expect(classesOf(view, "stack")).toContain("items-stretch");
  });

  it("takes its direction, alignment and wrapping from its props", async () => {
    const view = await renderLayout(
      <Stack
        testID="row"
        direction="row"
        align="center"
        justify="between"
        gap="xl"
        wrap>
        <Text>a</Text>
      </Stack>,
    );

    expect(classesOf(view, "row")).toContain("flex-row");
    expect(classesOf(view, "row")).toContain("items-center");
    expect(classesOf(view, "row")).toContain("justify-between");
    expect(classesOf(view, "row")).toContain("gap-8");
    expect(classesOf(view, "row")).toContain("flex-wrap");
  });

  it("renders the presets with their own defaults", async () => {
    const view = await renderLayout(
      <>
        <HStack testID="h" gap="lg">
          <Text>a</Text>
        </HStack>
        <VStack testID="v" gap="sm">
          <Text>b</Text>
        </VStack>
      </>,
    );

    expect(classesOf(view, "h")).toContain("flex-row");
    expect(classesOf(view, "h")).toContain("items-center");
    expect(classesOf(view, "h")).toContain("gap-6");
    expect(classesOf(view, "v")).toContain("flex-col");
    expect(classesOf(view, "v")).toContain("gap-2");
  });

  it("resolves its defaults through configuration", async () => {
    const view = await render(
      <AsheeNativeProvider
        config={{ components: { stack: { direction: "row", gap: "sm" } } }}>
        <Stack testID="configured">
          <Text>a</Text>
        </Stack>
      </AsheeNativeProvider>,
    );

    expect(classesOf(view, "configured")).toContain("flex-row");
    expect(classesOf(view, "configured")).toContain("gap-2");
  });
});

describe("Grid", () => {
  it("wraps its cells in a row that can wrap", async () => {
    const view = await renderLayout(
      <Grid testID="grid" columns={2} gap="lg">
        <Text testID="cell">a</Text>
        <Text>b</Text>
      </Grid>,
    );

    expect(classesOf(view, "grid")).toContain("flex-row");
    expect(classesOf(view, "grid")).toContain("flex-wrap");
    expect(classesOf(view, "grid")).toContain("gap-6");
    expect(view.getByTestId("cell")).toBeTruthy();
  });

  it("inherits a column count from the next smaller breakpoint", () => {
    const config = { columns: 1, columnsMd: 2, columnsLg: 3 };

    expect(resolveGridColumns(config, "base")).toBe(1);
    expect(resolveGridColumns(config, "sm")).toBe(1);
    expect(resolveGridColumns(config, "md")).toBe(2);
    expect(resolveGridColumns(config, "lg")).toBe(3);
    expect(resolveGridColumns(config, "xl")).toBe(3);

    // A grid that never changes shape only states one count.
    expect(resolveGridColumns({ columns: 2 }, "xl")).toBe(2);
    expect(resolveGridColumns({}, "md")).toBe(1);
  });
});

describe("Section", () => {
  it("adds rhythm and a background", async () => {
    const view = await renderLayout(
      <Section testID="section" spacing="lg" background="muted">
        <Text>Content</Text>
      </Section>,
    );

    expect(classesOf(view, "section")).toContain("py-12");
    expect(classesOf(view, "section")).toContain("bg-secondary/40");
  });

  it("takes its rhythm and its background from configuration", async () => {
    const view = await render(
      <AsheeNativeProvider
        config={{
          components: { section: { spacing: "sm", background: "muted" } },
        }}>
        <Section testID="configured">
          <Text>Content</Text>
        </Section>
      </AsheeNativeProvider>,
    );

    expect(classesOf(view, "configured")).toContain("py-6");
    expect(classesOf(view, "configured")).toContain("bg-secondary/40");
  });
});

describe("Centered", () => {
  it("centres its content on both axes and claims room", async () => {
    const view = await renderLayout(
      <Centered testID="centered" minHeight="lg">
        <Text>Sign in</Text>
      </Centered>,
    );

    expect(classesOf(view, "centered")).toContain("items-center");
    expect(classesOf(view, "centered")).toContain("justify-center");
    expect(classesOf(view, "centered")).toContain("min-h-[288px]");
  });

  it("centres on the axis it is asked for and carries the consumer's class last", async () => {
    const view = await renderLayout(
      <Centered testID="horizontal" axis="horizontal" className="p-6">
        <Text>Heading</Text>
      </Centered>,
    );

    expect(classesOf(view, "horizontal")).toContain("items-center");
    expect(classesOf(view, "horizontal")).not.toContain("justify-center");
    expect(classesOf(view, "horizontal").endsWith("p-6")).toBe(true);
  });
});
