"use client";

import {
  type ElementType,
  forwardRef,
  type ImgHTMLAttributes,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  FALLBACK_IMAGE_CONFIG,
  type ImageConfig,
  type ImageFit,
  type ImageRatioKey,
} from "./image-config";
import { IMAGE_FIT_CLASS, IMAGE_RATIO_CLASS } from "./image-styles";

/**
 * Configuration options for the Image component.
 */
export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "children" | "alt"> {
  /** Accessible alternative text describing the image. */
  alt: string;
  /** Object-fit behaviour of the image inside its ratio box.
   *
   * @default "cover"
   */
  fit?: ImageFit;
  /** Container aspect ratio.
   *
   * @default "auto"
   */
  ratio?: ImageRatioKey;
  /** Corner rounding.
   *
   * @default "md"
   */
  radius?: Radius;
  /** Fallback source shown when the primary `src` fails to load. */
  fallbackSrc?: string;
  /** Shows a shimmering placeholder until the image loads.
   *
   * @default true
   */
  showSkeleton?: boolean;
  /** Extra classes merged with internal styles. */
  className?: string;

  /** Custom image component to use instead of the native `<img>` tag
   * (e.g. `next/image`). */
  imageComponent?: ElementType;
  /**
   * Additional props to pass to the custom image component
   * (e.g. `{ priority: true, sizes: "..." }`).
   *
   * If `imageComponent` is set and neither `width`/`height` nor `fill`
   * are provided here, `fill: true` is applied automatically since
   * this component is container/ratio driven.
   */
  imageProps?: Record<string, unknown>;
}

function isValidSrc(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * An image element with ratio locking, object-fit control, radius
 * tokens, a loading skeleton, and an optional error fallback.
 *
 * Image renders a container-driven picture that can use either the
 * native `<img>` element or a custom component such as `next/image`.
 * A shimmering skeleton is shown until the source finishes loading,
 * and `fallbackSrc` is swapped in when the primary source errors.
 * Visual tokens (`fit`, `ratio`, `radius`, `showSkeleton`, `loading`)
 * resolve through the standard AsheeUI cascade.
 *
 * @param props - Image configuration options and native img attributes.
 * @param props.alt - Accessible alternative text.
 * @param props.fit - Object-fit behaviour. Defaults to "cover".
 * @param props.ratio - Container aspect ratio. Defaults to "auto".
 * @param props.radius - Corner rounding. Defaults to "md".
 * @param props.fallbackSrc - Error fallback source.
 * @param props.showSkeleton - Loading placeholder. Defaults to true.
 * @param props.className - Extra classes for the image element.
 * @param props.imageComponent - Custom image component.
 * @param props.imageProps - Props forwarded to the image component.
 *
 * @example
 * ```tsx
 * import { Image } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Image
 *       src="/hero.png"
 *       alt="Product hero"
 *       ratio="video"
 *       fit="cover"
 *       radius="lg"
 *       showSkeleton
 *     />
 *   );
 * }
 * ```
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt,
      fit,
      ratio,
      radius,
      fallbackSrc,
      showSkeleton,
      loading,
      src,
      className,
      onLoad,
      onError,
      imageComponent,
      imageProps: imagePropsProp,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.image as ImageConfig | undefined;

    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      setCurrentSrc(src);
      setIsLoaded(false);
    }, [src]);

    // Handle cached images: img.complete may already be true before React attaches listeners
    useEffect(() => {
      const el = imgRef.current;
      if (el?.complete && el.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }, [currentSrc]);

    // NOTE: we intentionally do NOT compare e.currentTarget.src/currentSrc against
    // the `currentSrc` state here. Browsers always normalize those to an absolute
    // URL, so a relative `src` (very common, e.g. "/hero.png") can never match the
    // raw state string - that mismatch silently no-ops handleLoad forever, which is
    // what caused the "stuck on skeleton" bug. Instead we key the element on
    // `currentSrc` below, so a stale event from a superseded src can't fire on the
    // current element at all (React remounts a fresh node).
    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (isValidSrc(fallbackSrc) && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
      // No fallback, or fallback also failed - stop showing the skeleton
      setIsLoaded(true);
      onError?.(e);
    };

    const setRefs = (node: HTMLImageElement | null) => {
      imgRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as RefObject<HTMLImageElement | null>).current = node;
    };

    // ─── 1. Token Resolvers ──────────────────────────────────────────────────

    const resolvedFit = resolveCascade<ImageFit>(
      fit,
      sectionConfig?.fit,
      undefined,
      FALLBACK_IMAGE_CONFIG.fit,
    );

    const resolvedRatio = resolveCascade<ImageRatioKey>(
      ratio,
      sectionConfig?.ratio,
      undefined,
      FALLBACK_IMAGE_CONFIG.ratio,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius as Radius,
      FALLBACK_IMAGE_CONFIG.radius,
    );

    const resolvedLoading = resolveCascade<"lazy" | "eager">(
      loading,
      sectionConfig?.loading,
      undefined,
      FALLBACK_IMAGE_CONFIG.loading,
    );

    const resolvedShowSkeleton = resolveCascade<boolean>(
      showSkeleton,
      sectionConfig?.showSkeleton,
      undefined,
      FALLBACK_IMAGE_CONFIG.showSkeleton,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const fitClass = resolveClassKey(
      resolvedFit,
      IMAGE_FIT_CLASS,
      FALLBACK_IMAGE_CONFIG.fit,
    );

    const ratioClass = resolveClassKey(
      resolvedRatio,
      IMAGE_RATIO_CLASS,
      FALLBACK_IMAGE_CONFIG.ratio,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey as Radius,
      RADIUS_CLASS,
      FALLBACK_IMAGE_CONFIG.radius,
    );

    // ─── 3. Build image props ──────────────────────────────────────────────

    const ImageComponent = imageComponent || "img";
    const isCustomComponent = Boolean(imageComponent);
    const hasValidSrc = isValidSrc(currentSrc);

    const hasExplicitSizing =
      imagePropsProp?.width !== undefined ||
      imagePropsProp?.height !== undefined ||
      imagePropsProp?.fill !== undefined;

    const autoFillProps =
      isCustomComponent && !hasExplicitSizing
        ? { fill: true, sizes: "100%" }
        : {};

    const imageClassName = cn(
      "h-full w-full transition-opacity duration-300",
      fitClass,
      isLoaded ? "opacity-100" : "opacity-0",
      radiusClass,
      className,
    );

    // ─── FIX: Force eager loading for custom image components ──────────────
    // Next.js Image with priority or lazy loading can cause script errors
    // when used with AsheeUIProvider. Force eager loading as a safeguard.
    let finalImageProps = { ...(imagePropsProp ?? {}) };

    if (isCustomComponent) {
      // Check if user set loading="lazy" or priority
      const hasLazy = imagePropsProp?.loading === "lazy";
      const hasPriority = imagePropsProp?.priority === true;

      if (hasLazy || hasPriority) {
        console.warn(
          `[Image] ${
            hasLazy ? '`loading="lazy"`' : "`priority={true}`"
          } with custom image component may cause rendering issues. ` +
            `Consider using \`loading="eager"\` and removing \`priority\` for this image.`,
        );
      }

      // Force loading to "eager" if custom component is used
      finalImageProps = {
        ...finalImageProps,
        loading: "eager",
        // Remove priority if present to avoid conflicts
        ...(finalImageProps.priority !== undefined && { priority: false }),
      };
    }

    // `key` must be passed as a literal JSX attribute, never spread - React strips
    // it out of props before the component ever sees it, and warns if it arrives
    // via a spread object instead. Keep it separate from the spreadable props.
    const mergedImageProps = {
      src: currentSrc,
      alt,
      loading: resolvedLoading,
      onLoad: handleLoad,
      onError: handleError,
      className: imageClassName,
      ref: setRefs,
      ...autoFillProps,
      ...rest,
      ...finalImageProps,
    };

    // ─── 4. Render ──────────────────────────────────────────────────────────

    const canRenderImage = !isCustomComponent || hasValidSrc;

    return (
      <span className={cn("relative block w-full", ratioClass, radiusClass)}>
        {resolvedShowSkeleton && !isLoaded && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 animate-pulse bg-border/40",
              radiusClass,
            )}
          />
        )}
        {canRenderImage && (
          <ImageComponent key={currentSrc} {...mergedImageProps} />
        )}
      </span>
    );
  },
);

Image.displayName = "Image";
