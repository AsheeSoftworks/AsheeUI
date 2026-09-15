/**
 * Behaviour tests for the SidebarLayout application shell.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
} from "../../test";
import { SidebarLayout } from "./SidebarLayout";

describe("SidebarLayout", () => {
  it("renders the sidebar as a named complementary landmark", () => {
    const { getByRole } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(getByRole("complementary", { name: "Sidebar" })).toBeDefined();
  });

  it("puts the header and the footer outside the two columns", () => {
    const { getByRole } = renderWithProvider(
      <SidebarLayout
        header={<header>Bar</header>}
        footer={<footer>Legal</footer>}
        sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(getByRole("banner")).toBeDefined();
    expect(getByRole("contentinfo")).toBeDefined();
    expect(getByRole("main")).toBeDefined();
  });

  it("stacks the sidebar above the content and sticks it on a wide screen", () => {
    const { container } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );
    const shell = container.firstElementChild as HTMLElement;
    const aside = container.querySelector("aside") as HTMLElement;

    expect(shell.className).toContain("flex-col");
    expect(shell.className).toContain("lg:flex-row");
    expect(aside.className).toContain("lg:w-64");
    expect(aside.className).toContain("lg:sticky");
    expect(aside.className).toContain("lg:border-r");
  });

  it("takes the side, the width and the stickiness from its props", () => {
    const { container } = renderWithProvider(
      <SidebarLayout
        sidebar={<span>Navigation</span>}
        side="end"
        sidebarWidth="lg"
        stickySidebar={false}>
        <main>Body</main>
      </SidebarLayout>,
    );
    const aside = container.querySelector("aside") as HTMLElement;

    expect(aside.className).toContain("lg:order-last");
    expect(aside.className).toContain("lg:w-80");
    expect(aside.className).toContain("lg:border-l");
    expect(aside.className).not.toContain("lg:sticky");
  });

  it("names the landmark from its own prop", () => {
    const { getByRole } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>} sidebarLabel="Workspace">
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(getByRole("complementary", { name: "Workspace" })).toBeDefined();
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
      { config: makeComponentConfig("sidebarlayout", { sidebarWidth: "sm" }) },
    );

    expect(
      (container.querySelector("aside") as HTMLElement).className,
    ).toContain("lg:w-56");
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(html).toContain("<aside");
    expect(html).toContain('aria-label="Sidebar"');
    expectHydrationClean(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );
  });
});
