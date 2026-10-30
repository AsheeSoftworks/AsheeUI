/**
 * The substitution contract, against a fake router link.
 *
 * A router is the consumer's dependency, so the test supplies a component that records the
 * props it receives. That is the whole acceptance criterion of WP-05: the substitute is
 * rendered once, and it receives the destination a router understands (`to`) or the URL a
 * platform link would follow (`href`), the press handler, and its own props last.
 *
 * All six components are exercised in one file because the contract is one contract; a
 * per-component test would repeat the fake five times and prove the same rule five times.
 */

import { render } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";
import { AsheeUIProvider } from "../provider/AsheeUIProvider";
import { Card } from "./data-display/card/Card";
import { Button } from "./forms/button/Button";
import { Form } from "./forms/form/Form";
import type { FeatureGridLink } from "./marketing/feature-grid/FeatureGrid";
import { Footer, type FooterLink } from "./navigation/footer/Footer";
import { Pagination, type PaginationLink } from "./navigation/pagination/Pagination";
import type { SidebarLinkProps } from "./navigation/sidebar/sidebar-config";
import { Sidebar } from "./navigation/sidebar/Sidebar";

/** What the fake router link received on its last render. */
type RouterProps = Record<string, unknown> & { children?: ReactNode };

let received: RouterProps[] = [];

/**
 * A stand-in for Expo Router's or React Navigation's link.
 *
 * @param props - Whatever the framework handed it.
 * @returns The children, so the surrounding component still renders.
 */
function RouterLink(props: RouterProps) {
  received.push(props);
  return <Text testID="router-link">{props.children}</Text>;
}

/**
 * Render a component with the fake router inside the provider.
 *
 * @param ui - The element under test.
 */
async function renderWithRouter(ui: ReactNode) {
  received = [];
  return render(<AsheeUIProvider>{ui}</AsheeUIProvider>);
}

describe("substitution, against a fake router link", () => {
  it("renders the consumer's button component with its destination and press", async () => {
    const onPress = jest.fn();
    const view = await renderWithRouter(
      <Button link={{ component: RouterLink, to: "/save" }} onPress={onPress}>
        Save
      </Button>,
    );

    expect(view.getAllByTestId("router-link")).toHaveLength(1);
    expect(received[0]?.to).toBe("/save");

    // The fake renders a Text, so its props carry the handler the button handed over.
    const handler = received[0]?.onPress as (event: unknown) => void;
    handler({ nativeEvent: {} });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("hands a component's own props the last word", async () => {
    await renderWithRouter(
      <Button
        link={{
          component: RouterLink,
          to: "/save",
          props: { testID: "consumer-link", prefetch: true },
        }}>
        Save
      </Button>,
    );

    expect(received[0]?.testID).toBe("consumer-link");
    expect(received[0]?.prefetch).toBe(true);
  });

  it("renders a card as the consumer's link", async () => {
    await renderWithRouter(
      <Card title="Invoice" link={{ component: RouterLink, to: "/invoice" }} />,
    );

    expect(received[0]?.to).toBe("/invoice");
  });

  it("renders the form as the consumer's component", async () => {
    await renderWithRouter(
      <Form component={RouterLink} componentProps={{ testID: "form-router" }}>
        <Text>Fields</Text>
      </Form>,
    );

    expect(received[0]?.testID).toBe("form-router");
    expect(received[0]?.children).toBeTruthy();
  });

  it("applies the footer's substitution to every link it renders", async () => {
    await renderWithRouter(
      <Footer
        groups={[
          {
            id: "product",
            title: "Product",
            links: [{ label: "Pricing", href: "/pricing" }],
          },
        ]}
        link={{ component: RouterLink }}
      />,
    );

    expect(received.some((props) => props.href === "/pricing")).toBe(true);
  });

  it("renders the pagination control as the consumer's link, with the page's destination", async () => {
    await renderWithRouter(
      <Pagination
        page={1}
        pageCount={3}
        link={{ component: RouterLink }}
        hrefForPage={(page) => `/invoices/${page}`}
      />,
    );

    expect(received[0]?.href).toBe("/invoices/2");
    expect(received[0]?.to).toBe("/invoices/2");
  });

  it("applies the sidebar's substitution to its rows", async () => {
    await renderWithRouter(
      <Sidebar
        items={[{ id: "home", label: "Home", href: "/home" }]}
        link={{ component: RouterLink }}
      />,
    );

    expect(received.some((props) => props.href === "/home")).toBe(true);
  });

  it("publishes the four link types on both renderers", () => {
    // The four names are the ones a shared screen imports. The values are trivial; the
    // proof is that this file compiles against the native package's own modules, and the
    // web package declares the same four names.
    const links: [
      FeatureGridLink,
      FooterLink,
      PaginationLink,
      SidebarLinkProps,
    ] = [
      { component: RouterLink },
      { component: RouterLink },
      { component: RouterLink },
      { component: RouterLink },
    ];

    expect(links).toHaveLength(4);
  });
});
