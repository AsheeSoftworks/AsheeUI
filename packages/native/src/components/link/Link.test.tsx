/**
 * Behaviour tests for the native Link.
 *
 * The tests state the component's contract: its label is a link a screen reader can
 * find, following the destination is the platform's job unless the consumer supplies a
 * handler, the external affordance appears when the destination leaves the application,
 * a disabled link responds to nothing and says so, the substitution API renders the
 * component a consumer names, and every option resolves through the configuration
 * cascade.
 */

import { fireEvent, render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text, View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { openDestination } from "../../utils/open-destination";
import { Link } from "./Link";

jest.mock("../../utils/open-destination", () => ({
  openDestination: jest.fn(),
}));

beforeEach(() => {
  // Each test states what it expects the platform to have been asked to do, so the
  // record of the last one is cleared rather than carried over.
  jest.clearAllMocks();
});

/**
 * Render a link inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderLink(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

describe("Native Link", () => {
  it("renders its label as a link a screen reader can find", async () => {
    const view = await renderLink(
      <Link href="https://example.com">Read the guide</Link>,
    );

    expect(view.getByRole("link", { name: "Read the guide" })).toBeTruthy();
  });

  it("follows its destination through the platform", async () => {
    const view = await renderLink(
      <Link href="https://example.com/guide">Read the guide</Link>,
    );

    await fireEvent.press(view.getByRole("link", { name: "Read the guide" }));

    expect(openDestination).toHaveBeenCalledWith("https://example.com/guide");
  });

  it("lets the consumer's own handler win over the destination", async () => {
    const onPress = jest.fn();
    const view = await renderLink(
      <Link href="https://example.com" onPress={onPress}>
        Read the guide
      </Link>,
    );

    await fireEvent.press(view.getByRole("link", { name: "Read the guide" }));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(openDestination).not.toHaveBeenCalled();
  });

  it("shows the external affordance when the destination leaves the application", async () => {
    const view = await renderLink(
      <Link href="https://example.com" isExternal>
        Ashee Softworks
      </Link>,
    );

    expect(view.getByText("↗")).toBeTruthy();
  });

  it("keeps the destination inside the application when it is not external", async () => {
    const view = await renderLink(
      <Link href="https://example.com">Ashee Softworks</Link>,
    );

    expect(view.queryByText("↗")).toBeNull();
  });

  it("lets a consumer's own end content replace the external affordance", async () => {
    const view = await renderLink(
      <Link
        href="https://example.com"
        isExternal
        endIcon={<View testID="own-end" />}>
        Ashee Softworks
      </Link>,
    );

    expect(view.getByTestId("own-end")).toBeTruthy();
    expect(view.queryByText("↗")).toBeNull();
  });

  it("responds to nothing and says so when it is disabled", async () => {
    const view = await renderLink(
      <Link href="https://example.com" disabled>
        Read the guide
      </Link>,
    );
    const link = view.getByRole("link", { name: "Read the guide" });

    await fireEvent.press(link);

    expect(openDestination).not.toHaveBeenCalled();
    expect(link.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it("renders the component a consumer names in place of the link", async () => {
    /**
     * A stand-in for a navigation library's own link.
     *
     * @param props - The props the framework passes it.
     * @returns The component it renders.
     */
    const RouterLink = (props: { href?: string; children?: ReactElement }) => (
      <View testID="router-link" data-href={props.href}>
        {props.children}
      </View>
    );

    const view = await renderLink(
      <Link href="/invoices" component={RouterLink}>
        Invoices
      </Link>,
    );

    expect(view.getByTestId("router-link")).toBeTruthy();
  });

  it("takes its emphasis as the quiet treatment rather than a colour role", async () => {
    const view = await renderLink(
      <Link variant="muted" color="danger">
        Terms
      </Link>,
    );
    const link = view.getByRole("link", { name: "Terms" });

    expect((link.props as { className?: string }).className).toContain(
      "text-foreground/70",
    );
    expect((link.props as { className?: string }).className).not.toContain(
      "text-danger",
    );
  });

  it("reveals the underline while it is pressed, because there is no pointer to hover with", async () => {
    const view = await renderLink(<Link underline="hover">Terms</Link>);

    expect(
      (
        view.getByRole("link", { name: "Terms" }).props as {
          className?: string;
        }
      ).className,
    ).toContain("active:underline");
  });

  it("resolves its colour, density and underline through the cascade", async () => {
    const view = await renderLink(<Link color="success">Paid</Link>, {
      defaultColor: "danger",
      components: { link: { size: "lg", underline: "always" } },
    });
    const classes = (
      view.getByRole("link", { name: "Paid" }).props as {
        className?: string;
      }
    ).className as string;

    expect(classes).toContain("text-success");
    expect(classes).toContain("text-base");
    expect(classes).toContain("underline");
  });

  it("lets an instance prop win over the configured value, and the consumer's classes win last", async () => {
    const view = await renderLink(
      <Link color="warning" className="mt-2">
        Check
      </Link>,
      { components: { link: { color: "success" } } },
    );
    const classes = (
      view.getByRole("link", { name: "Check" }).props as {
        className?: string;
      }
    ).className as string;

    expect(classes).toContain("text-warning");
    expect(classes).not.toContain("text-success");
    expect(classes.endsWith("mt-2")).toBe(true);
  });

  it("renders a consumer's own content as the label", async () => {
    const view = await renderLink(
      <Link>
        <Text testID="own-label">Custom</Text>
      </Link>,
    );

    expect(view.getByTestId("own-label")).toBeTruthy();
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Link>Terms</Link>)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
