"use client";

import { useSettings } from "@ashee/settings";
import { cn } from "@ashee/utils";
import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { forwardRef, useId, useRef } from "react";
import { useAsheeConfig } from "../../../context";
import { resolveValue } from "../../../utils/resolve-token";
import { defaultParallaxConfig } from "./default-parallax-config";
import type { ParallaxLayer, ParallaxOverlay } from "./parallax-config";

const OVERLAY_CLASSES: Record<ParallaxOverlay, string> = {
  dark: "bg-slate-950/60",
  light: "bg-white/60",
  radial: "bg-radial from-transparent via-slate-950/60 to-slate-950",
  none: "",
};

// ─── Sub-component for individual parallax layers ─────────────────────────────

interface ParallaxLayerItemProps {
  layer: ParallaxLayer;
  scrollYProgress: MotionValue<number>;
  disabled?: boolean;
}

const ParallaxLayerItem = ({
  layer,
  scrollYProgress,
  disabled,
}: ParallaxLayerItemProps) => {
  const speed = layer.speed ?? 0.3;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 100}%`, `${-speed * 100}%`],
  );

  if (disabled) {
    return (
      <div className={cn("absolute pointer-events-auto", layer.className)}>
        {layer.content}
      </div>
    );
  }

  return (
    <motion.div
      style={{ y }}
      className={cn("absolute pointer-events-auto", layer.className)}>
      {layer.content}
    </motion.div>
  );
};

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: React.ReactNode;
  layers?: ParallaxLayer[];
  overlay?: ParallaxOverlay;
  bgSpeed?: number;
  contentSpeed?: number;
  disableAnimation?: boolean;
  bgClassName?: string;
  contentClassName?: string;
}

// ─── Main Component Implementation ────────────────────────────────────────────

export const Parallax = forwardRef<HTMLDivElement, ParallaxProps>(
  (
    {
      background,
      layers = [],
      overlay,
      bgSpeed,
      contentSpeed,
      disableAnimation,
      bgClassName,
      contentClassName,
      className,
      children,
      id,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const { settings } = useSettings();
    const sectionConfig = config.components?.parallax;

    const generatedId = useId();
    const parallaxId = id ?? generatedId;
    const containerRef = useRef<HTMLDivElement>(null);

    const isAnimationDisabled =
      disableAnimation ??
      sectionConfig?.disableAnimation ??
      !settings.enableAnimations;

    const resolvedOverlay = resolveValue<ParallaxOverlay>(
      overlay,
      sectionConfig?.overlay,
      defaultParallaxConfig.overlay as ParallaxOverlay,
    );

    const resolvedBgSpeed =
      bgSpeed ??
      sectionConfig?.bgSpeed ??
      (defaultParallaxConfig.bgSpeed as number);
    const resolvedContentSpeed =
      contentSpeed ??
      sectionConfig?.contentSpeed ??
      (defaultParallaxConfig.contentSpeed as number);

    // Scroll progress calculations
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"],
    });

    const bgY = useTransform(
      scrollYProgress,
      [0, 1],
      [`-${resolvedBgSpeed * 100}%`, `${resolvedBgSpeed * 100}%`],
    );

    const contentY = useTransform(
      scrollYProgress,
      [0, 1],
      [`${resolvedContentSpeed * -100}%`, `${resolvedContentSpeed * 100}%`],
    );

    const contentOpacity = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [0, 1, 1, 0],
    );

    return (
      <div
        ref={(node) => {
          // Sync internal containerRef with external forwarded ref
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id={parallaxId}
        className={cn(
          "relative min-h-[80vh] overflow-hidden bg-slate-950 flex items-center justify-center py-20",
          sectionConfig?.className,
          className,
        )}
        {...props}>
        {/* Parallax Background Node */}
        {background && (
          <motion.div
            style={{ y: isAnimationDisabled ? 0 : bgY }}
            className={cn(
              "absolute inset-0 w-full h-[130%] top-[-15%] z-0 pointer-events-none",
              bgClassName,
            )}>
            {background}
            {/* Overlay Layer */}
            {resolvedOverlay !== "none" && (
              <div
                className={cn(
                  "absolute inset-0",
                  OVERLAY_CLASSES[resolvedOverlay],
                )}
              />
            )}
          </motion.div>
        )}

        {/* Main Center Content Node */}
        {children && (
          <motion.div
            style={{
              y: isAnimationDisabled ? 0 : contentY,
              opacity: isAnimationDisabled ? 1 : contentOpacity,
            }}
            className={cn(
              "relative z-10 max-w-5xl mx-auto px-6 text-center text-white",
              contentClassName,
            )}>
            {children}
          </motion.div>
        )}

        {/* Floating Abstracted Layer Nodes */}
        {layers.length > 0 && (
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 pointer-events-none z-20 flex justify-between items-center">
            {layers.map((layer, index) => (
              <ParallaxLayerItem
                key={layer.id || `layer-${index}`}
                layer={layer}
                scrollYProgress={scrollYProgress}
                disabled={isAnimationDisabled}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

Parallax.displayName = "Parallax";
