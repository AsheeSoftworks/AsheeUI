import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  renderToServerString,
  renderWithProvider,
} from "../../../test";
import { Image } from "./Image";
import { defaultImageConfig, FALLBACK_IMAGE_CONFIG } from "./image-config";

/**
 * A substituted image that records the props it receives, so a test can state what
 * the component was actually handed rather than what `Image` meant to hand it.
 */
function RecordingImage({
  src,
  alt,
  loading,
  priority,
}: {
  src?: string | undefined;
  alt?: string | undefined;
  loading?: string | undefined;
  priority?: boolean | undefined;
}) {
  return (
    <img
      data-testid="custom-image"
      src={src}
      alt={alt}
      data-loading={loading}
      data-priority={priority === undefined ? undefined : String(priority)}
    />
  );
}

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
    const html = renderToServerString(<Image src="/photo.jpg" alt="A photo" />);

    expect(html).toContain('src="/photo.jpg"');
    expect(html).toContain('alt="A photo"');
  });
});

describe("Image radius", () => {
  it("does not register a radius, so the application default can answer", () => {
    // Registering `md` here would make the component tier always answer, and
    // `defaultRadius` would never reach a picture. The hard fallback still states it.
    expect(defaultImageConfig.radius).toBeUndefined();
    expect(FALLBACK_IMAGE_CONFIG.radius).toBe("md");
  });

  it("follows the application's defaultRadius", () => {
    const { container } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" />,
      { config: { defaultRadius: "lg" } },
    );

    expect(container.firstElementChild).toHaveClass("rounded-lg");
  });

  it("still lets components.image.radius override the application default", () => {
    const { container } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" />,
      {
        config: {
          defaultRadius: "lg",
          components: { image: { radius: "sm" } },
        },
      },
    );

    expect(container.firstElementChild).toHaveClass("rounded-sm");
  });
});

describe("Image with a substituted component", () => {
  it("forwards a loading value stated in componentProps instead of forcing eager", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        component={RecordingImage}
        componentProps={{ loading: "lazy" }}
      />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute("data-loading", "lazy");
    // The old safeguard warned about lazy here and overrode it; neither happens now.
    expect(warn).not.toHaveBeenCalled();
  });

  it("forwards the instance's own loading value", () => {
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        loading="lazy"
        component={RecordingImage}
      />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute("data-loading", "lazy");
  });

  it("forwards priority instead of clearing it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        component={RecordingImage}
        componentProps={{ priority: true }}
      />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute(
      "data-priority",
      "true",
    );
    // `priority` is a legitimate prop of such a component, not a mistake to warn about.
    expect(warn).not.toHaveBeenCalled();
  });

  it("keeps the eager default when the component states no loading", () => {
    const { getByTestId } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" component={RecordingImage} />,
    );

    expect(getByTestId("custom-image")).toHaveAttribute(
      "data-loading",
      "eager",
    );
  });

  it("warns when priority and lazy loading contradict each other", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByTestId } = renderWithProvider(
      <Image
        src="/photo.jpg"
        alt="A photo"
        component={RecordingImage}
        componentProps={{ priority: true, loading: "lazy" }}
      />,
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toContain("contradict");
    // The warning reports the contradiction; it does not resolve it by rewriting props.
    expect(getByTestId("custom-image")).toHaveAttribute("data-loading", "lazy");
    expect(getByTestId("custom-image")).toHaveAttribute(
      "data-priority",
      "true",
    );
  });

  it("does not animate a placeholder when it has no source to render", () => {
    // Nothing mounts for an invalid source with a substituted component, so no load
    // event can settle the placeholder; it must not pulse forever.
    const { container } = renderWithProvider(
      <Image src="" alt="A photo" component={RecordingImage} />,
    );

    expect(container.querySelector("[data-testid='custom-image']")).toBeNull();
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("still holds the frame with a placeholder while a rendered picture loads", () => {
    const { container } = renderWithProvider(
      <Image src="/photo.jpg" alt="A photo" component={RecordingImage} />,
    );

    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});
