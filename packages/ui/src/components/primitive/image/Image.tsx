"use client";

import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { useAsheeConfig } from "../../../libs/context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { Size } from "../../../theme/token/token";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../../utils/resolve-token";
import {
  FALLBACK_IMAGE_CONFIG,
  type ImageConfig,
  type ImageFit,
  type ImageRatioKey,
} from "./image-config";
import {
  IMAGE_FIT_CLASS,
  IMAGE_RADIUS_CLASS,
  IMAGE_RATIO_CLASS,
  IMAGE_SHADOW_CLASS,
} from "./image-styles";
import type { Shadow } from "../../../theme/shadow/shadow-config";

export interface ImageProps
  extends Omit<HTMLMotionProps<"img">, "children" | "alt"> {
  alt: string;
  fit?: ImageFit;
  ratio?: ImageRatioKey;
  radius?: keyof Radius;
  shadow?: keyof Size;
  animation?: AnimationProp;
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
      shadow,
      animation,
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

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

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
      sectionConfig,
      config.theme.radius?.default,
      FALLBACK_IMAGE_CONFIG.radius,
    );

    const resolvedShadowKey = resolveCascade<keyof Shadow>(
      shadow,
      sectionConfig?.shadow,
      config.theme.shadow?.default,
      FALLBACK_IMAGE_CONFIG.shadow,
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

    const resolvedAnimation = resolveCascade<AnimationProp>(
      animation,
      sectionConfig?.animation,
      undefined,
      FALLBACK_IMAGE_CONFIG.animation,
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
      resolvedRadiusKey,
      IMAGE_RADIUS_CLASS,
      FALLBACK_IMAGE_CONFIG.radius,
    );

    const shadowClass = resolveClassKey(
      resolvedShadowKey,
      IMAGE_SHADOW_CLASS,
      FALLBACK_IMAGE_CONFIG.shadow,
    );

    const motionProps = resolveAnimation(resolvedAnimation, true, "none");

    return (
      <span
        className={cn(
          "relative block overflow-hidden shrink-0",
          ratioClass,
          radiusClass,
          shadowClass,
        )}>
        {resolvedShowSkeleton && !isLoaded && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-border/40"
          />
        )}
        <motion.img
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
            sectionConfig?.className,
            className,
          )}
          {...(motionProps as HTMLMotionProps<"img">)}
          {...rest}
        />
      </span>
    );
  },
);

Image.displayName = "Image";
