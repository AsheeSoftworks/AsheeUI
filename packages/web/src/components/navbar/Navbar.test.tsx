/**
 * Behaviour tests for the Navbar pattern.
 *
 * The mobile panel is a disclosure: the control names itself, reports its state
 * with `aria-expanded`, points at the panel with `aria-controls`, and Escape
 * closes the panel and returns focus to the control.
 */

import { describe, expect, it } from "vitest";
import {
  expectHydrationClean,
  expectState,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../test";
import { Navbar } from "./Navbar";

const LINKS = [
  { label: "Campaigns", href: "/campaigns", isActive: true },
  { label: "Contacts", href: "/contacts" },
];

describe("Navbar", () => {
  it("renders a named navigation landmark inside a banner landmark", () => {
    const { getByRole } = renderWithProvider(<Navbar links={LINKS} />);

    expect(getByRole("banner")).toBeDefined();
    expect(getByRole("navigation", { name: "Main" })).toBeDefined();
  });

  it("marks the current page on the link rather than styling it alone", () => {
    const { getAllByRole } = renderWithProvider(<Navbar links={LINKS} />);
    const [campaigns, contacts] = getAllByRole("link");

    expect(campaigns.getAttribute("aria-current")).toBe("page");
    expect(contacts.getAttribute("aria-current")).toBeNull();
  });

  it("renders the brand as a link when it has a destination", () => {
    const { getByRole } = renderWithProvider(
      <Navbar brand="Ashee SMS" brandHref="/" links={LINKS} />,
    );

    expect(getByRole("link", { name: "Ashee SMS" }).getAttribute("href")).toBe(
      "/",
    );
  });

  it("opens and closes the mobile panel from a labelled control", async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithProvider(
      <Navbar links={LINKS} mobileLabel="Open navigation" />,
    );
    const toggle = getByRole("button", { name: "Open navigation" });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(queryByRole("navigation", { name: "Main" })).not.toBeNull();
    expect(
      document.getElementById(toggle.getAttribute("aria-controls") ?? ""),
    ).toBeNull();

    await user.click(toggle);

    expectState(toggle, { expanded: true });
    expect(
      document.getElementById(toggle.getAttribute("aria-controls") ?? ""),
    ).not.toBeNull();

    await user.click(toggle);

    expectState(toggle, { expanded: false });
  });

  it("closes the mobile panel on Escape and restores focus to the control", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(<Navbar links={LINKS} />);
    const toggle = getByRole("button", { name: "Menu" });

    await user.click(toggle);
    expectState(toggle, { expanded: true });

    await user.keyboard("{Escape}");

    expectState(toggle, { expanded: false });
    expect(document.activeElement).toBe(toggle);
  });

  it("leaves the panel open state to a consumer that owns it", async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    const { getByRole } = renderWithProvider(
      <Navbar
        links={LINKS}
        mobileOpen={false}
        onMobileOpenChange={(next) => seen.push(next)}
      />,
    );
    const toggle = getByRole("button", { name: "Menu" });

    await user.click(toggle);

    expect(seen).toEqual([true]);
    expectState(toggle, { expanded: false });
  });

  it("resolves its defaults through configuration", () => {
    const { container } = renderWithProvider(<Navbar links={LINKS} />, {
      config: makeComponentConfig("navbar", {
        position: "static",
        variant: "bordered",
        containerSize: "xl",
      }),
    });
    const header = container.querySelector("header") as HTMLElement;

    expect(header.className).not.toContain("sticky");
    expect(header.className).toContain("border-b");
    expect(container.querySelector(".max-w-7xl")).not.toBeNull();
  });

  it("renders on the server and hydrates without a mismatch", () => {
    const html = renderToServerString(
      <Navbar brand="Ashee SMS" links={LINKS} actions={<span>Sign in</span>} />,
    );

    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Sign in");
    expectHydrationClean(<Navbar brand="Ashee SMS" links={LINKS} />);
  });
});
