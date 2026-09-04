"use client";

import { cn } from "@asheeui/utils";
import { forwardRef, type ImgHTMLAttributes, useEffect, useState } from "react";
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

    useEffect(() => {
      setCurrentSrc(src);
      setIsLoaded(false);
    }, [src]);

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
      <span
        className={cn(
          "relative block w-full overflow-hidden",
          ratioClass,
          radiusClass,
        )}>
        {resolvedShowSkeleton && !isLoaded && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-border/40"
          />
        )}
        <img
          ref={ref}
          src={currentSrc}
          alt={alt}
          loading={resolvedLoading}
          onLoad={(e) => {
            setIsLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc);
            }
            onError?.(e);
          }}
          className={cn(
            "h-full w-full transition-opacity duration-300",
            fitClass,
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          {...rest}
        />
      </span>
    );
  },
);

Image.displayName = "Image";
