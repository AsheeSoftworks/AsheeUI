/**
 * Behaviour tests for the Navbar pattern.
 *
 * The mobile panel is a disclosure: the control names itself, reports its state
 * with `aria-expanded`, points at the panel with `aria-controls` only while that
 * panel exists, and Escape closes the open panel and returns focus to the
 * control. Escape anywhere else in the bar is not the bar's to take.
 */

import { NAVBAR_BRAND_CLASS, NAVBAR_BRAND_TEXT_CLASS } from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  expectFocused,
  expectHydrationClean,
  expectState,
  makeComponentConfig,
  renderToServerString,
  renderWithProvider,
  userEvent,
} from "../../../test";
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

    expect(campaigns!.getAttribute("aria-current")).toBe("page");
    expect(contacts!.getAttribute("aria-current")).toBeNull();
  });

  it("renders the brand as a link when it has a destination", () => {
    const { getByRole } = renderWithProvider(
      <Navbar brand="Ashee SMS" brandHref="/" links={LINKS} />,
    );

    expect(getByRole("link", { name: "Ashee SMS" }).getAttribute("href")).toBe(
      "/",
    );
  });

  // The brand's layout and its typography are two decisions. Stating the whole string on
  // the wrapper and again on the link inside it repeated the same layout classes on two
  // nested elements, so the layout stays on the wrapper and the type goes on the link.
  it("splits the brand's layout from its typographic treatment", () => {
    const { getByRole } = renderWithProvider(
      <Navbar brand="Ashee SMS" brandHref="/" links={LINKS} />,
    );
    const link = getByRole("link", { name: "Ashee SMS" });
    const wrapper = link.parentElement as HTMLElement;

    expect(NAVBAR_BRAND_CLASS).toContain("shrink-0");
    expect(NAVBAR_BRAND_CLASS).not.toContain("font-semibold");
    expect(NAVBAR_BRAND_TEXT_CLASS).toContain("font-semibold");

    expect(wrapper.className).toBe(NAVBAR_BRAND_CLASS);
    expect(link.className).toContain(NAVBAR_BRAND_TEXT_CLASS);
  });

  it("forwards the native title attribute like every other element attribute", () => {
    const { getByRole } = renderWithProvider(
      <Navbar links={LINKS} title="Primary navigation" />,
    );

    expect(getByRole("banner").getAttribute("title")).toBe(
      "Primary navigation",
    );
  });

  // A bar with more destinations than room used to let the links run over the action
  // region. The list can shrink and its links wrap, so the bar degrades instead.
  it("keeps the link list shrinkable and wrapping rather than colliding", () => {
    const many = Array.from({ length: 12 }, (_, index) => ({
      label: `Destination ${index + 1}`,
      href: `/destination-${index + 1}`,
    }));
    const { container } = renderWithProvider(
      <Navbar links={many} actions={<span>Sign in</span>} />,
    );
    const list = container.querySelector(
      'nav[aria-label="Main"] > ul',
    ) as HTMLElement;

    expect(list.className).toContain("min-w-0");
    expect(list.className).toContain("flex-wrap");
  });

  it("opens and closes the mobile panel from a labelled control", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(
      <Navbar links={LINKS} mobileLabel="Open navigation" />,
    );
    const toggle = getByRole("button", { name: "Open navigation" });

    expectState(toggle, { expanded: false });
    expect(getByRole("navigation", { name: "Main" })).toBeDefined();

    await user.click(toggle);

    expectState(toggle, { expanded: true });

    await user.click(toggle);

    expectState(toggle, { expanded: false });
  });

  // `aria-controls` may only name an element that exists. The panel is rendered while it
  // is open, so the attribute is only present while it resolves — it used to name an id
  // that nothing carried whenever the panel was closed.
  it("points its control at the panel only while the panel exists", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(
      <Navbar links={LINKS} mobileLabel="Open navigation" />,
    );
    const toggle = getByRole("button", { name: "Open navigation" });

    expect(toggle).not.toHaveAttribute("aria-controls");

    await user.click(toggle);

    const controls = toggle.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls ?? "")).not.toBeNull();

    await user.click(toggle);

    expect(toggle).not.toHaveAttribute("aria-controls");
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

  // Escape used to be the bar's key: whatever was being typed in the second row lost
  // focus to the toggle, even with the panel closed.
  it("leaves Escape inside the second row to the field that owns it", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(
      <Navbar
        links={LINKS}
        secondary={<input type="search" aria-label="Search destinations" />}
      />,
    );
    const toggle = getByRole("button", { name: "Menu" });
    const search = getByRole("searchbox", { name: "Search destinations" });

    // With the panel closed the bar does nothing at all.
    await user.click(search);
    await user.keyboard("campaigns");
    await user.keyboard("{Escape}");

    expectFocused(search);

    // With the panel open the field is still outside it, so the key is still the field's.
    await user.click(toggle);
    expectState(toggle, { expanded: true });
    await user.click(search);
    await user.keyboard("{Escape}");

    expectFocused(search);
    expectState(toggle, { expanded: true });
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
