/**
 * Behaviour tests for the native Text.
 *
 * The tests state the component's contract: a role resolves a whole treatment, a
 * tone resolves a semantic colour, alignment and truncation are options, and every
 * option resolves through the configuration cascade. Renders are awaited and
 * queries come from the rendered view, as the platform's renderer requires.
 */

import { type RenderResult, render } from "@testing-library/react-native";
import { TYPOGRAPHY_ROLE_TOKEN } from "@asheeui/core";
import type { ReactElement } from "react";
import { AsheeUIProvider } from "../../../provider/AsheeUIProvider";
import { Text, Typography } from "./Text";
import {
  NATIVE_TYPOGRAPHY_SIZE_CLASS,
  NATIVE_TYPOGRAPHY_TRACKING_CLASS,
  NATIVE_TYPOGRAPHY_WEIGHT_CLASS,
  nativeLineHeight,
} from "./text-styles";
import * as textStyles from "./text-styles";

/**
 * Render text inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderText(ui: ReactElement, config?: object) {
  return render(<AsheeUIProvider config={config}>{ui}</AsheeUIProvider>);
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

describe("Native Text", () => {
  it("renders its content with the default role", async () => {
    const view = await renderText(
      <Typography testID="text">Updated a moment ago</Typography>,
    );

    expect(view.getByTestId("text")).toHaveTextContent("Updated a moment ago");
    expect(classesOf(view, "text")).toContain("text-base");
    expect(classesOf(view, "text")).toContain("text-foreground");
  });

  it("resolves a role to a whole treatment", async () => {
    const view = await renderText(
      <Typography testID="text" role="heading-lg">
        Campaigns
      </Typography>,
    );

    expect(classesOf(view, "text")).toContain("text-xl");
    expect(classesOf(view, "text")).toContain("font-semibold");
    expect(classesOf(view, "text")).toContain("tracking-normal");
  });

  it("resolves a tone to a semantic colour", async () => {
    const view = await renderText(
      <Typography testID="text" role="body-sm" tone="muted">
        Nothing yet
      </Typography>,
    );

    expect(classesOf(view, "text")).toContain("text-foreground/60");
  });

  it("aligns and truncates the way the platform does", async () => {
    const view = await renderText(
      <Typography testID="text" align="center" truncate>
        A very long label
      </Typography>,
    );

    expect(classesOf(view, "text")).toContain("text-center");
    expect(view.getByTestId("text").props.numberOfLines).toBe(1);
  });

  it("resolves its defaults through configuration", async () => {
    const view = await renderText(<Typography testID="text">Save</Typography>, {
      components: { typography: { role: "label", tone: "primary" } },
    });

    expect(classesOf(view, "text")).toContain("text-sm");
    expect(classesOf(view, "text")).toContain("font-medium");
    expect(classesOf(view, "text")).toContain("text-primary");
  });

  it("lets an instance prop win over the configured value", async () => {
    const view = await renderText(
      <Typography testID="text" role="body-sm">
        Save
      </Typography>,
      { components: { typography: { role: "heading-xl" } } },
    );

    expect(classesOf(view, "text")).toContain("text-sm");
    expect(classesOf(view, "text")).not.toContain("text-2xl");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderText(
      <Typography testID="text" className="mb-2">
        Save
      </Typography>,
    );

    expect(classesOf(view, "text").endsWith("mb-2")).toBe(true);
  });

  it("answers to the platform's own name for a line of text, as the same component", () => {
    // An alias is a reference rather than a second implementation, so a screen written
    // against `Text` renders the component the shared names resolve to on both platforms.
    expect(Text).toBe(Typography);
  });

  it("resolves the four token overrides on top of the role", async () => {
    const view = await renderText(
      <Typography
        testID="text"
        role="body-md"
        size="xl"
        weight="bold"
        leading="loose"
        tracking="wide">
        Save
      </Typography>,
    );

    expect(classesOf(view, "text")).toContain("text-xl");
    expect(classesOf(view, "text")).toContain("font-bold");
    expect(classesOf(view, "text")).toContain("tracking-wide");
    // `leading-loose` is 2× on the web; the platform's line height is a number of dp.
    expect(view.getByTestId("text").props.style).toEqual([
      { lineHeight: 20 * 2 },
      undefined,
    ]);
  });

  it("applies the shared section's per-role retuning", async () => {
    const view = await renderText(
      <Typography testID="text" role="body-md">
        Save
      </Typography>,
      {
        components: {
          typography: { roles: { "body-md": { size: "xl", weight: "bold" } } },
        },
      },
    );

    expect(classesOf(view, "text")).toContain("text-xl");
    expect(classesOf(view, "text")).toContain("font-bold");
  });

  it("reads the old section, warns once, and still applies it", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    const first = await renderText(<Typography testID="text">Save</Typography>, {
      components: { text: { role: "label", tone: "primary" } },
    });
    expect(classesOf(first, "text")).toContain("text-sm");
    expect(classesOf(first, "text")).toContain("text-primary");

    await first.unmount();

    const second = await renderText(<Typography testID="text">Save</Typography>, {
      components: { text: { role: "label" } },
    });
    expect(classesOf(second, "text")).toContain("text-sm");

    // Two renders of a deprecated section still produce one message, the same rule the
    // alias warnings follow.
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("components.typography");

    warn.mockRestore();
  });

  it("accepts as, warns once, and draws the platform's text anyway", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    const view = await renderText(
      <Typography testID="text" as="h1">
        Campaigns
      </Typography>,
    );

    expect(view.getByTestId("text")).toHaveTextContent("Campaigns");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("Typography.as");

    warn.mockRestore();
  });

  it("resolves every role through the table the web renderer reads", async () => {
    // The proof that native no longer keeps a role table: each role's rendered classes and
    // line height are the shared tokens, mapped to this platform's utilities.
    for (const [role, tokens] of Object.entries(TYPOGRAPHY_ROLE_TOKEN)) {
      const view = await renderText(
        <Typography testID="text" role={role as keyof typeof TYPOGRAPHY_ROLE_TOKEN}>
          {role}
        </Typography>,
      );

      expect(classesOf(view, "text")).toContain(
        NATIVE_TYPOGRAPHY_SIZE_CLASS[tokens.size],
      );
      expect(classesOf(view, "text")).toContain(
        NATIVE_TYPOGRAPHY_WEIGHT_CLASS[tokens.weight],
      );
      expect(classesOf(view, "text")).toContain(
        NATIVE_TYPOGRAPHY_TRACKING_CLASS[tokens.tracking],
      );
      expect(
        (view.getByTestId("text").props.style as [{ lineHeight: number }])[0]
          .lineHeight,
      ).toBe(nativeLineHeight(tokens));

      await view.unmount();
    }
  });

  it("has no private role table left", () => {
    expect(textStyles).not.toHaveProperty("TEXT_ROLE_CLASS");
  });
});
