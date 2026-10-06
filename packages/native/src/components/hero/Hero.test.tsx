/**
 * Behaviour tests for the native Hero.
 *
 * The tests state the component's contract: the hero draws its leading statement and
 * its configured actions, an action follows its destination through the platform's URL
 * handler, the arrangement of the text and the media is decided from the window the
 * platform reports, the side the media takes is decided by where it sits in the tree,
 * and the band options resolve through the configuration cascade.
 */

import {
  fireEvent,
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Dimensions, Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { openDestination } from "../../utils/open-destination";
import { Hero } from "./Hero";

jest.mock("../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

/**
 * Render a hero inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderHero(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
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

/**
 * Find the nearest ancestor of a node that carries a class.
 * The component's own parts have no test identifiers — they are not public — so a test
 * reaches one from the content it recognised.
 *
 * @param node - The node to start from.
 * @param marker - A class the ancestor must carry.
 * @returns The ancestor, or undefined when there is none.
 */
function ancestorWithClass(
  node: ReactTestInstance,
  marker: string,
): ReactTestInstance | undefined {
  let current = node.parent;

  while (current) {
    const { className } = current.props as { className?: string };

    if (typeof className === "string" && className.includes(marker)) {
      return current;
    }

    current = current.parent;
  }

  return undefined;
}

/**
 * Read the classes a node carries.
 *
 * @param node - The node, when one was found.
 * @returns Its class string, or an empty one.
 */
function classesOfNode(node: ReactTestInstance | null | undefined): string {
  return ((node?.props ?? {}) as { className?: string }).className ?? "";
}

/**
 * Report a window width to the platform.
 * The hero is responsive, so a test states the window it is testing rather than
 * depending on the one the test environment happens to have.
 *
 * @param width - The window width, in density-independent pixels.
 */
function reportWindowWidth(width: number): void {
  jest.spyOn(Dimensions, "get").mockReturnValue({
    width,
    height: 844,
    scale: 2,
    fontScale: 2,
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Native Hero", () => {
  it("renders the leading statement and its actions", async () => {
    const view = await renderHero(
      <Hero
        testID="hero"
        eyebrow="Everything in one place"
        title="Run your campaigns from one workspace"
        description="Messages, templates and results."
        primaryAction={{ label: "Start free" }}
        secondaryAction={{ label: "Read the docs" }}
      />,
    );

    expect(view.getByText("Everything in one place")).toBeTruthy();
    expect(
      view.getByText("Run your campaigns from one workspace"),
    ).toBeTruthy();
    expect(view.getByText("Messages, templates and results.")).toBeTruthy();
    expect(view.getByRole("button", { name: "Start free" })).toBeTruthy();
    expect(view.getByRole("button", { name: "Read the docs" })).toBeTruthy();
  });

  it("follows a configured action's destination through the platform", async () => {
    const view = await renderHero(
      <Hero
        testID="hero"
        title="Run your campaigns"
        primaryAction={{
          label: "Start free",
          href: "https://example.com/signup",
        }}
      />,
    );

    await fireEvent.press(view.getByRole("button", { name: "Start free" }));

    expect(openDestination).toHaveBeenCalledWith("https://example.com/signup");
  });

  it("stacks the media under the text on a phone and places it beside it on a wide window", async () => {
    reportWindowWidth(390);

    const phone = await renderHero(
      <Hero
        testID="hero"
        title="Run your campaigns"
        media={<Text>Dashboard</Text>}
      />,
    );

    const stacked = ancestorWithClass(phone.getByText("Dashboard"), "gap-6");

    expect(classesOfNode(stacked)).toContain("flex-col");

    reportWindowWidth(1200);

    const wide = await renderHero(
      <Hero
        testID="hero"
        title="Run your campaigns"
        media={<Text>Dashboard</Text>}
      />,
    );

    const beside = ancestorWithClass(wide.getByText("Dashboard"), "gap-8");

    expect(classesOfNode(beside)).toContain("flex-row");
  });

  it("puts the media ahead of the text when it is asked to lead", async () => {
    reportWindowWidth(1200);

    const view = await renderHero(
      <Hero
        testID="hero"
        title="Run your campaigns"
        mediaPosition="start"
        media={<Text>Dashboard</Text>}
      />,
    );

    const arrangement = ancestorWithClass(view.getByText("Dashboard"), "gap-8");
    const { children } = (arrangement?.props ?? {}) as { children?: unknown[] };
    const columns = (children ?? []).filter(Boolean) as Array<{
      props?: { className?: string };
    }>;

    // The media column leads the tree, which is how the platform states an order it
    // has no class for.
    expect(columns[0]?.props?.className).toContain("flex-1 w-full");
    expect(columns[0]?.props?.className).not.toContain("gap-4");
  });

  it("resolves its band options through the cascade", async () => {
    const view = await renderHero(
      <Hero testID="hero" eyebrow="Ready" title="Run your campaigns" />,
      {
        components: {
          hero: {
            align: "center",
            spacing: "md",
            background: "muted",
            containerSize: "sm",
          },
        },
      },
    );

    expect(classesOf(view, "hero")).toContain("py-8");
    expect(classesOf(view, "hero")).toContain("bg-secondary/40");
    expect(
      ancestorWithClass(view.getByText("Ready"), "max-w-xl"),
    ).toBeDefined();
  });

  it("centres what it holds when it is asked to", async () => {
    const view = await renderHero(
      <Hero
        testID="hero"
        eyebrow="Ready"
        title="Run your campaigns"
        align="center"
      />,
    );

    expect(
      classesOfNode(view.getByText("Run your campaigns").parent),
    ).toContain("items-center");
  });

  it("draws its own column only when it is asked to", async () => {
    const contained = await renderHero(
      <Hero testID="hero" eyebrow="Ready" title="Run your campaigns" />,
    );
    const bare = await renderHero(
      <Hero
        testID="hero"
        eyebrow="Ready"
        title="Run your campaigns"
        contained={false}
      />,
    );

    expect(
      ancestorWithClass(contained.getByText("Ready"), "max-w-5xl"),
    ).toBeDefined();
    expect(
      ancestorWithClass(bare.getByText("Ready"), "max-w-5xl"),
    ).toBeUndefined();
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderHero(
      <Hero
        testID="hero"
        eyebrow="Ready"
        title="Run your campaigns"
        spacing="xs"
      />,
      { components: { hero: { spacing: "2xl" } } },
    );

    expect(classesOf(view, "hero")).toContain("py-2");
    expect(classesOf(view, "hero")).not.toContain("py-20");
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Hero title="Run your campaigns" />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
