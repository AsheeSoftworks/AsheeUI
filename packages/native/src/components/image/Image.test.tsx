/**
 * Behaviour tests for the native Image.
 *
 * The tests state the component's contract: the picture carries its source and the name
 * assistive technology reads, a picture with no name is decoration, the framework's
 * placeholder claims the space until the picture arrives, the fallback source is swapped
 * in when the primary one fails, the consumer can replace the platform's image view, and
 * the fit, ratio and rounding resolve through the configuration cascade.
 */

import {
  fireEvent,
  type ReactTestInstance,
  render,
} from "@testing-library/react-native";
import type { ReactElement } from "react";
import { Text } from "react-native";
import { AsheeNativeProvider } from "../../provider/AsheeNativeProvider";
import { Image } from "./Image";

/**
 * Render a picture inside the framework provider.
 *
 * @param ui - The element under test.
 * @param config - The application's configuration, if it has one.
 * @returns The rendered tree and its queries.
 */
async function renderImage(ui: ReactElement, config?: object) {
  return render(
    <AsheeNativeProvider config={config}>{ui}</AsheeNativeProvider>,
  );
}

/**
 * Every descendant of a node that carries a prop.
 * The frame's parts have no test identifiers — they are not public — so a test reaches
 * them from the frame it rendered.
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

/**
 * The descendants of a node that carry a class.
 *
 * @param node - The node to search below.
 * @param marker - A class the descendant's classes must contain.
 * @returns The descendants carrying it.
 */
function descendantsWithClass(
  node: ReactTestInstance,
  marker: string,
): ReactTestInstance[] {
  return descendantsWithProp(node, "className").filter((descendant) =>
    String(descendant.props.className).includes(marker),
  );
}

describe("Native Image", () => {
  it("renders the picture with its source and the name assistive technology reads", async () => {
    const view = await renderImage(
      <Image testID="frame" src="/photo.jpg" alt="A photo" />,
    );

    expect(view.getByLabelText("A photo").props.source).toEqual({
      uri: "/photo.jpg",
    });
  });

  it("keeps a picture with no name out of the accessibility tree", async () => {
    const view = await renderImage(<Image testID="frame" src="/photo.jpg" />);
    const [picture] = descendantsWithProp(view.getByTestId("frame"), "source");

    expect(picture).toBeDefined();
    expect(picture.props.accessible).toBe(false);
    expect(picture.props.accessibilityLabel).toBeUndefined();
  });

  it("claims the space with the framework's placeholder until the picture arrives", async () => {
    const view = await renderImage(
      <Image testID="frame" src="/photo.jpg" alt="A photo" />,
    );
    const frame = view.getByTestId("frame");

    expect(descendantsWithClass(frame, "absolute inset-0")).toHaveLength(1);

    await fireEvent(view.getByLabelText("A photo"), "load");

    expect(descendantsWithClass(frame, "absolute inset-0")).toHaveLength(0);
  });

  it("swaps in the fallback source, and reports the error once the fallback fails too", async () => {
    const onError = jest.fn();
    const view = await renderImage(
      <Image
        testID="frame"
        src="/missing.jpg"
        fallbackSrc="/fallback.jpg"
        alt="A photo"
        onError={onError}
      />,
    );
    const [picture] = descendantsWithProp(view.getByTestId("frame"), "source");

    await fireEvent(picture, "error", new Error("The picture failed"));

    const [fallback] = descendantsWithProp(view.getByTestId("frame"), "source");

    expect(fallback.props.source).toEqual({ uri: "/fallback.jpg" });
    // The consumer is told once, when there is nothing left to try.
    expect(onError).not.toHaveBeenCalled();

    await fireEvent(fallback, "error", new Error("The fallback failed"));

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("lets a consumer replace the platform's image view", async () => {
    function CustomImage({ src }: { src?: string }) {
      return <Text testID="custom-image">{src}</Text>;
    }

    const view = await renderImage(
      <Image
        testID="frame"
        src="/photo.jpg"
        alt="A photo"
        component={CustomImage}
      />,
    );

    expect(view.getByTestId("custom-image")).toHaveTextContent("/photo.jpg");
  });

  it("resolves its fit, ratio and rounding through the cascade", async () => {
    const view = await renderImage(
      <Image testID="frame" src="/photo.jpg" alt="A photo" />,
      {
        components: {
          image: { fit: "contain", ratio: "video", radius: "xl" },
        },
      },
    );
    const frame = view.getByTestId("frame");
    const [picture] = descendantsWithProp(frame, "source");

    expect(String(frame.props.className)).toContain("rounded-xl");
    expect((frame.props.style as { aspectRatio?: number }[])[0]).toEqual({
      aspectRatio: 16 / 9,
    });
    // The fit is the platform's own value rather than a class.
    expect(picture.props.resizeMode).toBe("contain");
  });

  it("states no ratio and no fixed height when the ratio is auto", async () => {
    const view = await renderImage(
      <Image testID="frame" src="/photo.jpg" alt="A photo" />,
    );
    const frame = view.getByTestId("frame");
    const [picture] = descendantsWithProp(frame, "source");

    expect((frame.props.style as unknown[])[0]).toBeUndefined();
    // Without a stated ratio the picture claims the width and takes its height from the
    // source, which is how the platform is asked for a picture's own proportions.
    expect(picture.props.className).toBe("w-full");
  });

  it("refuses to render outside the provider, because that is a setup mistake", async () => {
    const silence = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      render(<Image src="/photo.jpg" alt="A photo" />),
    ).rejects.toThrow(/AsheeNativeProvider/);

    silence.mockRestore();
  });
});
