/**
 * Behaviour tests for the native AuthLayout shell.
 *
 * The tests state the shell's contract: it holds the brand, the heading and the form inside a
 * panel that it draws by default and can be told not to; it puts the footer slot inside that
 * panel, under the form; it adds a media region only when it has media and puts it on the side
 * it is given, which is beside the form once the window is wide enough; it resolves every
 * option through the configuration cascade; and it says out loud that it is being rendered
 * without the provider, because that is a setup mistake rather than a style choice.
 */

import {
  type ReactElement,
  type ReactTestInstance,
  type RenderResult,
  render,
  within,
} from "@testing-library/react-native";
import { Dimensions, Text, View } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { AuthLayout } from "./AuthLayout";

/**
 * Render a shell inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderShell(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Report a window width to the platform.
 * The shell reads the window rather than a media query, so a test states the width the device
 * is reporting and the shell decides from it.
 *
 * @param width - The width in density-independent pixels.
 * @returns The spy, so a test can put the window back.
 */
function reportWidth(width: number) {
  return jest.spyOn(Dimensions, "get").mockReturnValue({
    width,
    height: 844,
    scale: 2,
    fontScale: 2,
  });
}

/**
 * Read the classes a rendered element carries.
 *
 * @param view - The rendered tree.
 * @param testID - The element's test identifier.
 * @returns Its class string.
 */
function classesOf(view: RenderResult, testID: string): string {
  return (
    (view.getByTestId(testID).props as { className?: string }).className ?? ""
  );
}

/**
 * Find the nearest ancestor of a node that carries a class.
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
 * List the regions the shell holds, in the order it placed them.
 * The media region and the form column are the shell's own; a test tells them apart by the
 * identifiers the shell gives them.
 *
 * @param view - The rendered tree.
 * @returns The test identifiers of the shell's own children.
 */
function regionsOf(view: RenderResult): (string | undefined)[] {
  const { children } = view.getByTestId("shell").props as {
    children?: unknown;
  };
  const list = Array.isArray(children) ? children : [children];

  return list
    .filter(
      (child): child is ReactElement =>
        Boolean(child) && typeof child === "object",
    )
    .map((child) => (child.props as { testID?: string }).testID);
}

describe("Native AuthLayout", () => {
  it("renders the brand, the heading and the form", async () => {
    const view = await renderShell(
      <AuthLayout
        testID="shell"
        brand={<Text>Ashee SMS</Text>}
        title="Sign in"
        description="Use your email.">
        <View testID="form">
          <Text>Sign in form</Text>
        </View>
      </AuthLayout>,
    );

    expect(view.getByText("Ashee SMS")).toBeTruthy();
    expect(view.getByText("Sign in")).toBeTruthy();
    expect(view.getByText("Use your email.")).toBeTruthy();
    expect(view.getByText("Sign in form")).toBeTruthy();
  });

  it("draws the form on a panel by default and can be told not to", async () => {
    const panelised = await renderShell(
      <AuthLayout testID="shell">
        <View testID="form" />
      </AuthLayout>,
    );
    const plain = await renderShell(
      <AuthLayout testID="shell" panel={false}>
        <View testID="form" />
      </AuthLayout>,
    );

    expect(
      ancestorWithClass(panelised.getByTestId("form"), "border-border"),
    ).toBeDefined();
    expect(
      ancestorWithClass(plain.getByTestId("form"), "border-border"),
    ).toBeUndefined();
  });

  it("renders the footer slot inside the panel, under the form", async () => {
    const view = await renderShell(
      <AuthLayout testID="shell" footer={<Text>Forgot your password?</Text>}>
        <View testID="form" />
      </AuthLayout>,
    );
    const panel = ancestorWithClass(
      view.getByTestId("form"),
      "border-border",
    ) as ReactTestInstance;

    expect(view.getByText("Forgot your password?")).toBeTruthy();
    expect(within(panel).getByText("Forgot your password?")).toBeTruthy();
    expect(
      within(panel).getByText("Forgot your password?").props.children,
    ).toBe("Forgot your password?");
  });

  it("adds a media region only when there is media, on the side it is asked for", async () => {
    const single = await renderShell(
      <AuthLayout testID="shell">
        <View testID="form" />
      </AuthLayout>,
    );

    expect(regionsOf(single)).toEqual(["auth-layout-form"]);

    const trailing = await renderShell(
      <AuthLayout testID="shell" media={<Text>Shot</Text>}>
        <View testID="form" />
      </AuthLayout>,
    );
    const leading = await renderShell(
      <AuthLayout
        testID="shell"
        media={<Text>Shot</Text>}
        mediaPosition="start">
        <View testID="form" />
      </AuthLayout>,
    );

    expect(regionsOf(trailing)).toEqual([
      "auth-layout-form",
      "auth-layout-media",
    ]);
    expect(regionsOf(leading)).toEqual([
      "auth-layout-media",
      "auth-layout-form",
    ]);
    expect(classesOf(leading, "shell")).not.toContain("flex-row");
  });

  it("puts the media beside the form once the window is wide enough", async () => {
    const phone = reportWidth(390);
    const narrow = await renderShell(
      <AuthLayout testID="shell" media={<Text>Shot</Text>}>
        <View testID="form" />
      </AuthLayout>,
    );

    expect(classesOf(narrow, "shell")).not.toContain("flex-row");
    phone.mockRestore();

    const wide = reportWidth(1280);
    const split = await renderShell(
      <AuthLayout testID="shell" media={<Text>Shot</Text>}>
        <View testID="form" />
      </AuthLayout>,
    );

    expect(classesOf(split, "shell")).toContain("flex-row");
    expect(regionsOf(split)).toEqual(["auth-layout-form", "auth-layout-media"]);
    wide.mockRestore();
  });

  it("takes the measure and the panel from configuration", async () => {
    const view = await renderShell(
      <AuthLayout testID="shell">
        <View testID="form" />
      </AuthLayout>,
      { components: { authlayout: { panel: false, contentSize: "md" } } },
    );
    const wrapper = ancestorWithClass(view.getByTestId("form"), "max-w-3xl");

    expect(wrapper).toBeDefined();
    expect(
      ((wrapper as ReactTestInstance).props as { className?: string })
        .className,
    ).not.toContain("border-border");
  });

  it("carries the consumer's class last, so it wins", async () => {
    const view = await renderShell(
      <AuthLayout testID="shell" className="bg-primary">
        <View testID="form" />
      </AuthLayout>,
    );
    const classes = classesOf(view, "shell");

    expect(classes).toContain("bg-primary");
    expect(classes.endsWith("bg-primary")).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(
        <AuthLayout>
          <View testID="form" />
        </AuthLayout>,
      ),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
