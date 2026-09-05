"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type ImgHTMLAttributes,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS, type Radius } from "../../shared/radius";
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

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "children" | "alt"> {
  alt: string;
  fit?: ImageFit;
  ratio?: ImageRatioKey;
  radius?: Radius;
  fallbackSrc?: string;
  showSkeleton?: boolean;
  className?: string;
}

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

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      // Ignore stale events from a superseded src
      if (
        e.currentTarget.currentSrc !== currentSrc &&
        e.currentTarget.src !== currentSrc
      )
        return;
      setIsLoaded(true);
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
      // No fallback, or fallback also failed — stop showing the skeleton
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

    return (
      <span className={cn("relative block w-full", ratioClass, radiusClass)}>
        {resolvedShowSkeleton && !isLoaded && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-border/40"
          />
        )}
        <img
          ref={setRefs}
          src={currentSrc}
          alt={alt}
          loading={resolvedLoading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "h-full w-full transition-opacity duration-300",
            fitClass,
            isLoaded ? "opacity-100" : "opacity-0",
            radiusClass,
            className,
          )}
          {...rest}
        />
      </span>
    );
  },
);

Image.displayName = "Image";
