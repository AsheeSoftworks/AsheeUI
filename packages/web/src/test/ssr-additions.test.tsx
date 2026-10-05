// @vitest-environment node
/**
 * Server-rendering proof for the framework additions shipped in 1.1.
 *
 * This file opts out of jsdom entirely, so any access to `window`, `document`
 * or another browser global during render fails the test rather than passing
 * silently against jsdom stubs (`TEST-034`). It covers the layout layer, the
 * patterns, the application-state component and the utility components in one
 * place, because they share one property: none of them touches a browser global
 * while rendering, so all of them can be server-rendered by a supported
 * framework.
 */

import { describe, expect, it } from "vitest";
import { AuthLayout } from "../components/auth-layout/AuthLayout";
import { Clipboard } from "../components/clipboard/Clipboard";
import { CopyButton } from "../components/clipboard/CopyButton";
import { Container } from "../components/container/Container";
import { CTA } from "../components/cta/CTA";
import { EmptyState } from "../components/empty-state/EmptyState";
import { FeatureGrid } from "../components/feature-grid/FeatureGrid";
import { Footer } from "../components/footer/Footer";
import { Grid } from "../components/grid/Grid";
import { Hero } from "../components/hero/Hero";
import { Navbar } from "../components/navbar/Navbar";
import {
  Page,
  PageContent,
  PageFooter,
  PageHeader,
} from "../components/page/Page";
import { PinInput } from "../components/pin-input/PinInput";
import { PricingCard } from "../components/pricing-card/PricingCard";
import { Section } from "../components/section/Section";
import { SidebarLayout } from "../components/sidebar-layout/SidebarLayout";
import { HStack, Stack, VStack } from "../components/stack/Stack";
import { Testimonials } from "../components/testimonials/Testimonials";
import { renderToServerString } from "./index";

describe("1.1 additions server rendering (DOM-free environment)", () => {
  it("runs without DOM globals, so the renders below are genuinely browserless", () => {
    expect(typeof document).toBe("undefined");
    expect(typeof window).toBe("undefined");
  });

  it("renders the layout layer", () => {
    expect(renderToServerString(<Container>x</Container>)).toContain(
      "max-w-6xl",
    );
    expect(renderToServerString(<Section spacing="lg">x</Section>)).toContain(
      "py-12",
    );
    expect(renderToServerString(<Grid columns={2}>x</Grid>)).toContain(
      "grid-cols-2",
    );
    expect(renderToServerString(<HStack gap="sm">x</HStack>)).toContain(
      "flex-row",
    );
    expect(renderToServerString(<VStack gap="sm">x</VStack>)).toContain(
      "flex-col",
    );
    expect(renderToServerString(<Stack direction="row">x</Stack>)).toContain(
      "flex-row",
    );
  });

  it("renders an application page shell with its landmarks", () => {
    const html = renderToServerString(
      <Page>
        <PageHeader>Invoices</PageHeader>
        <PageContent>Body</PageContent>
        <PageFooter>Version 1.1.0</PageFooter>
      </Page>,
    );

    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain("<footer");
  });

  it("renders the application shells", () => {
    const sidebar = renderToServerString(
      <SidebarLayout sidebar={<span>Navigation</span>}>
        <main>Body</main>
      </SidebarLayout>,
    );

    expect(sidebar).toContain("<aside");
    expect(sidebar).toContain('aria-label="Sidebar"');

    const auth = renderToServerString(
      <AuthLayout title="Sign in">form</AuthLayout>,
    );

    expect(auth).toContain("Sign in");
  });

  it("renders the marketing patterns with their configured actions", () => {
    const hero = renderToServerString(
      <Hero
        title="Headline"
        primaryAction={{ label: "Start free", href: "/signup" }}
      />,
    );

    expect(hero).toContain("Headline");
    expect(hero).toContain('href="/signup"');

    const cta = renderToServerString(<CTA title="Send today" />);
    expect(cta).toContain("Send today");

    const features = renderToServerString(
      <FeatureGrid items={[{ title: "Templates" }]} />,
    );
    expect(features).toContain("Templates");

    const quotes = renderToServerString(
      <Testimonials items={[{ quote: "Fast.", name: "Ama" }]} />,
    );
    expect(quotes).toContain("Fast.");

    const pricing = renderToServerString(
      <PricingCard name="Growth" price="$29" />,
    );
    expect(pricing).toContain("Growth");
  });

  it("renders the navigation landmarks and the empty state", () => {
    const navigation = renderToServerString(
      <Navbar
        brand="Ashee SMS"
        links={[{ label: "Pricing", href: "/pricing" }]}
      />,
    );

    expect(navigation).toContain("<header");
    expect(navigation).toContain('aria-label="Main"');

    const footer = renderToServerString(
      <Footer groups={[{ title: "Product", links: [{ label: "Pricing" }] }]} />,
    );

    expect(footer).toContain("<footer");
    expect(footer).toContain('aria-label="Product"');

    const empty = renderToServerString(<EmptyState title="Nothing here yet" />);
    expect(empty).toContain("Nothing here yet");
  });

  it("renders the utility components without touching the clipboard", () => {
    const pin = renderToServerString(<PinInput length={6} label="Code" />);

    expect(pin).toContain("<fieldset");
    expect(pin.match(/<input/g)).toHaveLength(6);

    const copy = renderToServerString(<CopyButton value="INV-1042" />);
    expect(copy).toContain("<button");
    expect(copy).toContain('role="status"');

    const headless = renderToServerString(
      <Clipboard value="INV-1042">
        {({ copied }) => <span>{copied ? "Copied" : "Copy"}</span>}
      </Clipboard>,
    );
    expect(headless).toContain("Copy");
  });
});
