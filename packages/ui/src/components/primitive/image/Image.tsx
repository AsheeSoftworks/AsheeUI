"use client";
import { cn } from "@asheeui/utils";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { useAsheeConfig } from "../../../libs/context";
import { resolveAnimation } from "../../../motion/resolve-animation";
import type { AnimationProp } from "../../../motion/types";
import type { Radius } from "../../../theme/token/radius/radius-config";
import type { Size } from "../../../theme/token/token";
import { resolveScale, resolveValue } from "../../../utils/resolve-token";
import type { ImageFit, ImageRatioKey } from "./image-config";

const FIT_CLASS: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

const RATIO_CLASS: Record<ImageRatioKey, string> = {
  auto: "",
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

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
    const sectionConfig = config.components?.image;
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const resolvedFit = resolveValue(fit, sectionConfig?.fit, "cover");
    const resolvedRatio = resolveValue(ratio, sectionConfig?.ratio, "auto");
    const resolvedRadius = resolveScale(
      radius,
      sectionConfig?.radius,
      config.theme.radius.default,
      config.theme.radius.values,
    );
    const resolvedShadow = resolveScale(
      shadow,
      sectionConfig?.shadow,
      config.theme.shadow.default,
      config.theme.shadow.values,
    );
    const resolvedLoading = loading ?? sectionConfig?.loading ?? "lazy";
    const resolvedShowSkeleton = resolveValue(
      showSkeleton,
      sectionConfig?.showSkeleton,
      true,
    );
    const motionProps = resolveAnimation(
      animation ?? (sectionConfig?.animation as AnimationProp | undefined),
      true,
      "none",
    );

    return (
      <span
        className={cn(
          "relative block overflow-hidden",
          RATIO_CLASS[resolvedRatio],
        )}
        style={{ borderRadius: resolvedRadius, boxShadow: resolvedShadow }}>
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
            if (fallbackSrc && currentSrc !== fallbackSrc)
              setCurrentSrc(fallbackSrc);
            onError?.(e);
          }}
          className={cn(
            "h-full w-full transition-opacity duration-300",
            FIT_CLASS[resolvedFit],
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
