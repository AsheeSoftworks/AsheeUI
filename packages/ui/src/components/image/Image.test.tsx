import { describe, expect, it, vi } from "vitest";
import { fireEvent, renderToServerString, renderWithProvider } from "../../test";
import { Image } from "./Image";

describe("Image", () => {
  it("renders an image with its source and alternative text", () => {
    const { getByRole } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" />,
    );
    const image = getByRole("img", { name: "A photo" });

    expect(image).toHaveAttribute("src", "/photo.jpg");
  });

  it("supports substituting the underlying image implementation", () => {
    function CustomImage({ src, alt }: { src?: string; alt?: string }) {
      return <img data-testid="custom-image" src={src} alt={alt} />;
    }

    const { getByTestId } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" component={CustomImage} />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute("src", "/photo.jpg");
  });

  it("reports load and error outcomes to the consumer", () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const { getByRole } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        onLoad={onLoad}
        onError={onError}
      />,
    );
    const image = getByRole("img", { name: "A photo" });

    fireEvent.load(image);
    expect(onLoad).toHaveBeenCalledTimes(1);

    fireEvent.error(image);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("keeps the alternative text while a fallback source is available", () => {
    const { getByRole } = renderWithProvider(
      <Image src="/missing.jpg" fallbackSrc="/fallback.jpg" alt="A photo" />,
    );

    expect(getByRole("img", { name: "A photo" })).toBeInTheDocument();
  });

  it("renders to markup on the server without browser access", () => {
    const html = renderToServerString(
      <Image src="/photo.jpg" alt="A photo" />,
    );

    expect(html).toContain('src="/photo.jpg"');
    expect(html).toContain('alt="A photo"');
  });
});
