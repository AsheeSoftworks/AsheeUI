/**
 * Behaviour tests for the native CTA.
 *
 * The tests state the component's contract: the band draws its closing statement and
 * its configured actions, the panel takes the treatment it is given, a configured
 * action follows its destination through the platform's URL handler, the band options
 * resolve through the configuration cascade, and the form a band sometimes needs stays
 * the consumer's own.
 */

import {
  fireEvent,
  type ReactTestInstance,
  type RenderResult,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { openDestination } from "../../utils/open-destination";
import { CTA } from "./CTA";

jest.mock("../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

/**
 * Render a band inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderCta(ui: ReactElement, config?: object) {
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
 * Read the classes a node carries.
 *
 * @param node - The node, when one was found.
 * @returns Its class string, or an empty one.
 */
function classesOfNode(node: ReactTestInstance | null | undefined): string {
  return ((node?.props ?? {}) as { className?: string }).className ?? "";
}

/**
 * Find the nearest ancestor of a node that carries a class.
 * The band's own parts have no test identifiers — they are not public — so a test
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

describe("Native CTA", () => {
  it("renders the closing statement and its actions", async () => {
    const view = await renderCta(
      <CTA
        testID="cta"
        eyebrow="Ready when you are"
        title="Send your first campaign today"
        description="No card required."
        primaryAction={{ label: "Create an account" }}
        secondaryAction={{ label: "Talk to sales" }}
      />,
    );

    expect(view.getByText("Ready when you are")).toBeTruthy();
    expect(view.getByText("Send your first campaign today")).toBeTruthy();
    expect(view.getByText("No card required.")).toBeTruthy();
    expect(
      view.getByRole("button", { name: "Create an account" }),
    ).toBeTruthy();
    expect(view.getByRole("button", { name: "Talk to sales" })).toBeTruthy();
  });

  it("draws the panel treatment it is given", async () => {
    const bordered = await renderCta(
      <CTA testID="cta" title="Send your first campaign today" />,
    );
    const borderedPanel = ancestorWithClass(
      bordered.getByText("Send your first campaign today"),
      "rounded-md",
    );

    expect(classesOfNode(borderedPanel)).toContain("border border-border");
    // The platform states the density the web states at its smallest step: one
    // window means one padding step.
    expect(classesOfNode(borderedPanel)).toContain("p-6");

    const muted = await renderCta(
      <CTA testID="cta" title="Send your first campaign today" panel="muted" />,
    );
    const mutedPanel = ancestorWithClass(
      muted.getByText("Send your first campaign today"),
      "rounded-md",
    );

    expect(classesOfNode(mutedPanel)).toContain("bg-secondary/40");
    expect(classesOfNode(mutedPanel)).not.toContain("border");
  });

  it("follows a configured action's destination through the platform", async () => {
    const view = await renderCta(
      <CTA
        testID="cta"
        title="Send your first campaign today"
        primaryAction={{
          label: "Create an account",
          href: "https://example.com/signup",
        }}
      />,
    );

    await fireEvent.press(
      view.getByRole("button", { name: "Create an account" }),
    );

    expect(openDestination).toHaveBeenCalledWith("https://example.com/signup");
  });

  it("centres its actions by default and honours the alignment it is given", async () => {
    const centered = await renderCta(
      <CTA
        testID="cta"
        title="Send your first campaign today"
        primaryAction={{ label: "Create an account" }}
      />,
    );
    const start = await renderCta(
      <CTA
        testID="cta"
        title="Send your first campaign today"
        align="start"
        primaryAction={{ label: "Create an account" }}
      />,
    );

    expect(
      classesOfNode(
        centered.getByRole("button", { name: "Create an account" }).parent,
      ),
    ).toContain("justify-center");
    expect(
      classesOfNode(
        start.getByRole("button", { name: "Create an account" }).parent,
      ),
    ).toContain("justify-start");
  });

  it("resolves its band options through the cascade", async () => {
    const view = await renderCta(
      <CTA
        testID="cta"
        eyebrow="Ready"
        title="Send your first campaign today"
      />,
      {
        components: {
          cta: { spacing: "md", background: "muted", containerSize: "xl" },
        },
      },
    );

    expect(classesOf(view, "cta")).toContain("py-8");
    expect(classesOf(view, "cta")).toContain("bg-secondary/40");
    expect(
      ancestorWithClass(view.getByText("Ready"), "max-w-7xl"),
    ).toBeDefined();
  });

  it("leaves the band's own form to the consumer", async () => {
    const view = await renderCta(
      <CTA testID="cta" title="Send your first campaign today">
        <Text>Email address</Text>
      </CTA>,
    );

    expect(view.getByText("Email address")).toBeTruthy();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<CTA title="Send your first campaign today" />),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
