/**
 * Behaviour tests for the native Avatar.
 *
 * The tests state the component's contract: the picture is shown inside the frame and the
 * initials carry the identity when there is none, the avatar reads as one image with one
 * name to assistive technology, a custom fallback replaces the initials, an entity with no
 * name is decoration, and the diameter, rounding and accent resolve through the
 * configuration cascade.
 */

import {
  fireEvent,
  type ReactTestInstance,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Avatar } from "./Avatar";

/**
 * Render an avatar inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderAvatar(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Every descendant of a node that carries a prop.
 * The avatar's parts have no test identifiers — they are not public — so a test reaches
 * them from the avatar it rendered.
 *
 * @param node - The node to search below.
 * @param prop - The prop a descendant must carry.
 * @returns The descendants carrying it.
 */
function descendantsWithProp(
  node: ReactTestInstance,
  prop: string,
): ReactTestInstance[] {
  const found: ReactTestInstance[] = [];

  const walk = (current: ReactTestInstance) => {
    if ((current.props as Record<string, unknown>)[prop] !== undefined) {
      found.push(current);
    }

    for (const child of current.children) {
      if (typeof child !== "string") walk(child);
    }
  };

  walk(node);

  return found;
}

describe("Native Avatar", () => {
  it("shows the picture inside the frame and reads as one image with one name", async () => {
    const view = await renderAvatar(
      <Avatar testID="avatar" name="Ada Lovelace" src="/ada.png" />,
    );
    const avatar = view.getByTestId("avatar");

    expect(avatar.props.accessibilityRole).toBe("image");
    expect(avatar.props.accessibilityLabel).toBe("Ada Lovelace");
    expect(descendantsWithProp(avatar, "source")).toHaveLength(1);
  });

  it("carries the initials when there is no picture", async () => {
    const view = await renderAvatar(
      <Avatar testID="avatar" name="Ada Lovelace" />,
    );

    expect(view.getByText("AL")).toBeTruthy();
  });

  it("takes the name assistive technology reads from the alternative when it is given", async () => {
    const view = await renderAvatar(
      <Avatar testID="avatar" name="Ada Lovelace" alt="Profile picture" />,
    );

    expect(view.getByTestId("avatar").props.accessibilityLabel).toBe(
      "Profile picture",
    );
  });

  it("lets a consumer replace the initials with its own fallback", async () => {
    const view = await renderAvatar(
      <Avatar
        testID="avatar"
        name="Ada Lovelace"
        fallback={<Text>Guest</Text>}
      />,
    );

    expect(view.getByText("Guest")).toBeTruthy();
    expect(view.queryByText("AL")).toBeNull();
  });

  it("keeps an avatar with no name out of the accessibility tree", async () => {
    const view = await renderAvatar(<Avatar testID="avatar" src="/ada.png" />);
    // A hidden avatar is out of the tree on purpose, so the query has to ask for it.
    const avatar = view.getByTestId("avatar", { includeHiddenElements: true });

    expect(avatar.props.accessible).toBe(false);
    expect(avatar.props.importantForAccessibility).toBe("no-hide-descendants");
  });

  it("falls back to the initials once the picture fails to load", async () => {
    const view = await renderAvatar(
      <Avatar testID="avatar" name="Ada Lovelace" src="/missing.png" />,
    );
    const [picture] = descendantsWithProp(view.getByTestId("avatar"), "source");

    await fireEvent(picture, "error", new Error("The picture failed"));

    expect(view.getByText("AL")).toBeTruthy();
  });

  it("resolves its diameter, rounding and accent through the cascade", async () => {
    const view = await renderAvatar(
      <Avatar testID="avatar" name="Ada Lovelace" />,
      {
        components: { avatar: { size: "lg", radius: "md", color: "danger" } },
      },
    );
    const avatar = view.getByTestId("avatar");

    expect(String(avatar.props.className)).toContain("h-12 w-12");
    expect(String(avatar.props.className)).toContain("rounded-md");
    // The accent is the fallback surface's, which is the block behind the initials.
    expect(
      descendantsWithProp(avatar, "className").some((node) =>
        String(node.props.className).includes("bg-danger"),
      ),
    ).toBe(true);
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(render(<Avatar name="Ada Lovelace" />)).rejects.toThrow(
      /AsheeNativeProvider/,
    );

    silence.mockRestore();
  });
});
