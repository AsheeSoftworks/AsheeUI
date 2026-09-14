import { describe, expect, it } from "vitest";
import {
  makeConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders the default role as a paragraph with the body treatment", () => {
    const { getByText } = renderWithProvider(<Typography>Body copy</Typography>);
    const element = getByText("Body copy");

    expect(element.tagName).toBe("P");
    expect(element.className).toContain("text-base");
    expect(element.className).toContain("font-normal");
    expect(element.className).toContain("leading-normal");
    expect(element.className).toContain("text-foreground");
  });

  it("renders a heading role on its semantic element with its treatment", () => {
    const { getByRole } = renderWithProvider(
      <Typography role="heading-lg">Heading</Typography>,
    );
    const heading = getByRole("heading", { level: 2, name: "Heading" });

    expect(heading.className).toContain("text-xl");
    expect(heading.className).toContain("font-semibold");
    expect(heading.className).toContain("leading-snug");
  });

  it("renders the display role as a level one heading", () => {
    const { getByRole } = renderWithProvider(
      <Typography role="display">Title</Typography>,
    );

    expect(
      getByRole("heading", { level: 1, name: "Title" }).className,
    ).toContain("text-3xl");
  });

  it("lets `as` change the element without changing the treatment", () => {
    const { getByRole } = renderWithProvider(
      <Typography as="h2">Muted body</Typography>,
    );
    const element = getByRole("heading", { level: 2, name: "Muted body" });

    expect(element.className).toContain("text-base");
    expect(element.className).toContain("font-normal");
  });

  it("lets token props override parts of the role", () => {
    const { getByText } = renderWithProvider(
      <Typography role="body-md" size="2xl" weight="bold">
        Overridden
      </Typography>,
    );
    const element = getByText("Overridden");

    expect(element.className).toContain("text-2xl");
    expect(element.className).toContain("font-bold");
    expect(element.className).not.toContain("text-base");
  });

  it("applies tone, alignment and truncation", () => {
    const { getByText } = renderWithProvider(
      <Typography tone="danger" align="center" truncate>
        Alert
      </Typography>,
    );
    const element = getByText("Alert");

    expect(element.className).toContain("text-danger");
    expect(element.className).toContain("text-center");
    expect(element.className).toContain("truncate");
  });

  it("applies the configured role and lets an explicit role win", () => {
    const configured = renderWithProvider(<Typography>Configured</Typography>, {
      config: makeConfig({ components: { typography: { role: "caption" } } }),
    });
    expect(configured.getByText("Configured").className).toContain("text-xs");

    const overridden = renderWithProvider(
      <Typography role="heading-md">Overridden</Typography>,
      { config: makeConfig({ components: { typography: { role: "caption" } } }) },
    );
    expect(overridden.getByText("Overridden").className).toContain("text-lg");
  });

  it("retunes a role through configured role overrides", () => {
    const { getByText } = renderWithProvider(
      <Typography role="body-md">Retuned</Typography>,
      {
        config: makeConfig({
          components: { typography: { roles: { "body-md": { size: "sm" } } } },
        }),
      },
    );
    const element = getByText("Retuned");

    expect(element.className).toContain("text-sm");
    expect(element.className).not.toContain("text-base");
  });

  it("applies consumer classes last so they win", () => {
    const { getByText } = renderWithProvider(
      <Typography className="text-danger">Custom</Typography>,
    );
    const element = getByText("Custom");

    expect(element.className).toContain("text-danger");
    expect(element.className).not.toMatch(/(?:^|\s)text-foreground(?:\s|$)/);
  });

  it("forwards element attributes", () => {
    const { getByText } = renderWithProvider(
      <Typography id="lead" aria-label="Lead">
        Text
      </Typography>,
    );
    const element = getByText("Text");

    expect(element).toHaveAttribute("id", "lead");
    expect(element).toHaveAttribute("aria-label", "Lead");
  });

  it("renders on the server without browser globals", () => {
    const html = renderToServerString(
      <Typography role="heading-lg">Server heading</Typography>,
    );

    expect(html).toContain("<h2");
    expect(html).toContain("text-xl");
    expect(html).toContain("Server heading");
  });
});
