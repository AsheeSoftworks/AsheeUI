/**
 * Image component for the native package.
 *
 * The component satisfies the framework's image contract: the same source, the same
 * alternative text, the same fit and ratio options, the same radius and the same
 * loading placeholder as the web image, implemented as the platform's own image view in
 * a frame. It composes the framework's `Skeleton`, so a picture claims its space with
 * the same surface every other pending region on the screen uses.
 *
 * Two things the platform forces are drawn rather than hidden. A picture is fetched when
 * its view mounts, so the web's `loading` option has no counterpart and is not offered
 * here; and the frame states the shape — a ratio option or the consumer's own classes —
 * because the platform cannot lay a remote source out before it arrives.
 *
 * The accessibility contract is the web's: the picture carries the name the consumer
 * gave it, and a picture with no name is decoration and is kept out of the accessibility
 * tree rather than announced as an unnamed image.
 */

import {
  type ImageFit,
  type ImageRatioKey,
  NATIVE_IMAGE_ASPECT_RATIO,
  NATIVE_IMAGE_FRAME_CLASS,
  NATIVE_IMAGE_PICTURE_CLASS,
  NATIVE_IMAGE_PICTURE_FILL_CLASS,
  NATIVE_IMAGE_RESIZE_MODE,
  NATIVE_IMAGE_SKELETON_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "@asheeui/core";
import { type ElementType, useEffect, useState } from "react";
import {
  Image as PlatformImage,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Skeleton } from "../skeleton/Skeleton";
import {
  FALLBACK_NATIVE_IMAGE_CONFIG,
  type NativeImageConfig,
} from "./image-config";

/**
 * Props for the native Image.
 */
export interface ImageProps
  extends NativeImageConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The picture's source. */
  src?: string;

  /**
   * Source shown when the primary one fails to load.
   * When that source fails too, the picture reports the error and stops waiting.
   */
  fallbackSrc?: string;

  /**
   * Name assistive technology reads for the picture.
   * A picture without a name is decoration and is hidden from assistive technology,
   * which is the right behaviour for a logo beside a heading that already names it.
   */
  alt?: string;

  /**
   * Component that replaces the platform's image view, such as an optimised image
   * component. The substitution API is shared with `Link` and `Form`: `component`
   * names the component and `componentProps` carries the props it needs.
   */
  component?: ElementType;

  /** Additional props for `component`. */
  componentProps?: Record<string, unknown>;

  /** Called once the picture has loaded. */
  onLoad?: () => void;

  /** Called once the picture has failed to load, and every fallback has too. */
  onError?: (error: unknown) => void;

  /** Extra classes appended last, which is where a consumer sizes the frame. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A picture in a frame, with a fit, a ratio, a radius and a loading placeholder.
 *
 * The frame fills the column it is given and clips the picture to the resolved radius;
 * the ratio option or the consumer's own classes state its height. Fit, ratio, radius
 * and the placeholder resolve through the standard AsheeUI cascade: prop, component
 * config, global theme defaults and the built-in fallback.
 *
 * @param props - The picture's options and the platform's view props.
 * @param props.src - The picture's source.
 * @param props.fallbackSrc - Source used when the primary one fails.
 * @param props.alt - Name assistive technology reads.
 * @param props.fit - How the picture fills its frame. Defaults to `"cover"`.
 * @param props.ratio - The frame's aspect ratio. Defaults to `"auto"`.
 * @param props.radius - Corner rounding. Defaults to `"md"`.
 * @param props.showSkeleton - Claims the space until the picture arrives. Defaults to true.
 * @param props.component - Component that replaces the platform's image view.
 * @param props.componentProps - Props for that component.
 * @param props.className - Extra classes applied last, which is where sizing belongs.
 * @returns The rendered frame and picture.
 *
 * @example
 * ```tsx
 * <Image src={campaign.cover} alt="Campaign cover" ratio="video" />
 * ```
 *
 * @example
 * ```tsx
 * // The frame takes its height from the consumer, so the picture fills it.
 * <Image src={person.photo} alt={person.name} className="h-20 w-20" radius="full" />
 * ```
 *
 * @see NativeImageConfig - The configuration type for component defaults.
 * @see Skeleton - The placeholder the picture claims its space with.
 */
export function Image({
  src,
  fallbackSrc,
  alt,
  fit,
  ratio,
  radius,
  showSkeleton,
  component,
  componentProps,
  onLoad,
  onError,
  className,
  style,
  ...rest
}: ImageProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.image;

  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  // A new source is a new picture, so the placeholder returns until it arrives.
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
  }, [src]);

  const resolvedFit = resolveCascade<ImageFit>(
    fit,
    sectionConfig?.fit,
    undefined,
    FALLBACK_NATIVE_IMAGE_CONFIG.fit,
  );
  const resolvedRatio = resolveCascade<ImageRatioKey>(
    ratio,
    sectionConfig?.ratio,
    undefined,
    FALLBACK_NATIVE_IMAGE_CONFIG.ratio,
  );
  const resolvedRadius = resolveRadiusKey<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius as Radius,
    FALLBACK_NATIVE_IMAGE_CONFIG.radius,
  );
  const resolvedShowSkeleton = resolveCascade<boolean>(
    showSkeleton,
    sectionConfig?.showSkeleton,
    undefined,
    FALLBACK_NATIVE_IMAGE_CONFIG.showSkeleton,
  );

  const aspectRatio = NATIVE_IMAGE_ASPECT_RATIO[resolvedRatio];
  const hasSource = isValidSrc(currentSrc);

  const frameClasses = classNames(
    NATIVE_IMAGE_FRAME_CLASS,
    resolveClassKey(
      resolvedRadius,
      NATIVE_RADIUS_CLASS,
      FALLBACK_NATIVE_IMAGE_CONFIG.radius,
    ),
    className,
  );

  // A frame with no stated ratio leaves the height to the source's own proportions,
  // which is what the platform takes from a picture given a width and no height.
  const pictureClasses =
    resolvedRatio === "auto"
      ? NATIVE_IMAGE_PICTURE_CLASS
      : NATIVE_IMAGE_PICTURE_FILL_CLASS;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (error: unknown) => {
    if (isValidSrc(fallbackSrc) && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    // No fallback, or the fallback failed as well: stop waiting and report it.
    setIsLoaded(true);
    onError?.(error);
  };

  const picture = component ? null : (
    <PlatformImage
      source={{ uri: currentSrc }}
      // The fit is a value on this platform rather than a class, so it is stated as one.
      resizeMode={NATIVE_IMAGE_RESIZE_MODE[resolvedFit]}
      accessible={Boolean(alt)}
      accessibilityRole={alt ? "image" : undefined}
      accessibilityLabel={alt}
      accessibilityElementsHidden={alt ? undefined : true}
      importantForAccessibility={alt ? "auto" : "no-hide-descendants"}
      onLoad={handleLoad}
      onError={handleError}
      className={pictureClasses}
    />
  );

  // A consumer that has its own image component names it, which is the same
  // substitution API `Link` and `Form` offer.
  const Substitute = component;

  return (
    <View
      className={frameClasses}
      style={[aspectRatio ? { aspectRatio } : undefined, style]}
      {...rest}>
      {resolvedShowSkeleton && !isLoaded && (
        <Skeleton
          className={NATIVE_IMAGE_SKELETON_CLASS}
          radius={resolvedRadius}
        />
      )}
      {hasSource &&
        (Substitute ? (
          <Substitute
            src={currentSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={pictureClasses}
            {...componentProps}
          />
        ) : (
          picture
        ))}
    </View>
  );
}

/**
 * Whether a value is a usable source.
 *
 * @param value - The value to check.
 * @returns Whether it is a non-empty string.
 */
function isValidSrc(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
