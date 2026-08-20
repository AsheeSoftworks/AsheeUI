"use client";

import { cn } from "@asheeui/utils";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Radius } from "../../theme/token/radius/radius-config";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import {
  FALLBACK_CAROUSEL_CONFIG,
  type CarouselConfig,
  type CarouselItem,
  type CarouselSizeKey,
  type CarouselVariant,
} from "./carousel-config";
import {
  CAROUSEL_HEIGHT_CLASS,
  CAROUSEL_PADDING_CLASS,
  CAROUSEL_RADIUS_CLASS,
  CAROUSEL_VARIANT_CLASS,
} from "./carousel-styles";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const SWIPE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: CarouselItem[];
  variant?: CarouselVariant;
  size?: CarouselSizeKey;
  radius?: keyof Radius;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  disableAnimation?: boolean;
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  renderPrevControl?: (props: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;
  renderNextControl?: (props: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;
  itemClassName?: string;
  controlClassName?: string;
  indicatorClassName?: string;
}

// ─── Component Implementation ─────────────────────────────────────────────────

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      items = [],
      variant,
      size,
      radius,
      autoPlay,
      autoPlayInterval,
      loop,
      showControls,
      showIndicators,
      pauseOnHover,
      disableAnimation = false,
      defaultIndex = 0,
      index: controlledIndex,
      onIndexChange,
      renderPrevControl,
      renderNextControl,
      itemClassName,
      controlClassName,
      indicatorClassName,
      className,
      style,
      children,
      id,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.carousel as
      | CarouselConfig
      | undefined;

    const generatedId = useId();
    const carouselId = id ?? generatedId;

    // ─── 1. Token Resolvers (4-Tier Cascade) ──────────────────────────────────

    const resolvedSizeKey = resolveCascade<CarouselSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<CarouselVariant>(
      variant,
      sectionConfig?.variant,
      config.theme.defaultVariant as CarouselVariant | undefined,
      FALLBACK_CAROUSEL_CONFIG.variant,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      typeof radius === "string" ? radius : undefined,
      typeof sectionConfig?.radius === "string" ? sectionConfig : undefined,
      config.theme.radius?.default,
      FALLBACK_CAROUSEL_CONFIG.radius,
    );

    const resolvedAutoPlay = resolveCascade<boolean>(
      autoPlay,
      sectionConfig?.autoPlay,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.autoPlay,
    );

    const resolvedAutoPlayInterval = resolveCascade<number>(
      autoPlayInterval,
      sectionConfig?.autoPlayInterval,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.autoPlayInterval,
    );

    const resolvedLoop = resolveCascade<boolean>(
      loop,
      sectionConfig?.loop,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.loop,
    );

    const resolvedShowControls = resolveCascade<boolean>(
      showControls,
      sectionConfig?.showControls,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.showControls,
    );

    const resolvedShowIndicators = resolveCascade<boolean>(
      showIndicators,
      sectionConfig?.showIndicators,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.showIndicators,
    );

    const resolvedPauseOnHover = resolveCascade<boolean>(
      pauseOnHover,
      sectionConfig?.pauseOnHover,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.pauseOnHover,
    );

    // ─── 2. Class Maps ────────────────────────────────────────────────────────

    const heightClass = resolveClassKey(
      resolvedSizeKey,
      CAROUSEL_HEIGHT_CLASS,
      FALLBACK_CAROUSEL_CONFIG.size,
    );

    const paddingClass = resolveClassKey(
      resolvedSizeKey,
      CAROUSEL_PADDING_CLASS,
      FALLBACK_CAROUSEL_CONFIG.size,
    );

    const radiusClass = resolveClassKey(
      resolvedRadiusKey,
      CAROUSEL_RADIUS_CLASS,
      FALLBACK_CAROUSEL_CONFIG.radius,
    );

    const variantClass =
      CAROUSEL_VARIANT_CLASS[resolvedVariant] ?? CAROUSEL_VARIANT_CLASS.default;

    // Item normalizer (supports items prop or children fallback)
    const slides: CarouselItem[] = useMemo(() => {
      if (items.length > 0) return items;
      if (children) {
        const childArray = Array.isArray(children) ? children : [children];
        return childArray.map((child, idx) => ({
          id: `slide-${idx}`,
          content: child,
        }));
      }
      return [];
    }, [items, children]);

    const isControlled = controlledIndex !== undefined;
    const [[currentIndex, direction], setPage] = useState<[number, number]>([
      defaultIndex,
      0,
    ]);

    const activeIndex = isControlled ? controlledIndex : currentIndex;
    const [isHovered, setIsHovered] = useState(false);

    const paginate = useCallback(
      (newDirection: number) => {
        if (slides.length <= 1) return;

        let nextIdx = activeIndex + newDirection;

        if (nextIdx < 0) {
          nextIdx = resolvedLoop ? slides.length - 1 : 0;
        } else if (nextIdx >= slides.length) {
          nextIdx = resolvedLoop ? 0 : slides.length - 1;
        }

        if (nextIdx === activeIndex) return;

        if (!isControlled) {
          setPage([nextIdx, newDirection]);
        }
        onIndexChange?.(nextIdx);
      },
      [activeIndex, slides.length, resolvedLoop, isControlled, onIndexChange],
    );

    const goTo = useCallback(
      (targetIndex: number) => {
        if (
          targetIndex === activeIndex ||
          targetIndex < 0 ||
          targetIndex >= slides.length
        )
          return;
        const newDirection = targetIndex > activeIndex ? 1 : -1;
        if (!isControlled) {
          setPage([targetIndex, newDirection]);
        }
        onIndexChange?.(targetIndex);
      },
      [activeIndex, slides.length, isControlled, onIndexChange],
    );

    // Auto Play Timer
    useEffect(() => {
      if (
        !resolvedAutoPlay ||
        (resolvedPauseOnHover && isHovered) ||
        slides.length <= 1
      )
        return;

      const timer = setInterval(() => {
        paginate(1);
      }, resolvedAutoPlayInterval);

      return () => clearInterval(timer);
    }, [
      resolvedAutoPlay,
      resolvedAutoPlayInterval,
      resolvedPauseOnHover,
      isHovered,
      slides.length,
      paginate,
    ]);

    // Drag / Swipe handling
    const handleDragEnd = (
      _e: MouseEvent | TouchEvent | PointerEvent,
      { offset, velocity }: PanInfo,
    ) => {
      const swipe = swipePower(offset.x, velocity.x);
      if (swipe < -SWIPE_THRESHOLD) {
        paginate(1);
      } else if (swipe > SWIPE_THRESHOLD) {
        paginate(-1);
      }
    };

    const isPrevDisabled = !resolvedLoop && activeIndex === 0;
    const isNextDisabled = !resolvedLoop && activeIndex === slides.length - 1;

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: Required for stoping the slide from switch when hovering
      <div
        ref={ref}
        id={carouselId}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={cn(
          "relative overflow-hidden w-full select-none flex flex-col group",
          variantClass,
          radiusClass,
          heightClass,
          sectionConfig?.className,
          className,
        )}
        style={style}
        {...props}>
        {/* Slides Track */}
        <div className="relative w-full h-full overflow-hidden flex-1">
          <AnimatePresence initial={false} custom={direction}>
            {slides.length > 0 && (
              <motion.div
                key={slides[activeIndex]?.id || activeIndex}
                custom={direction}
                variants={disableAnimation ? undefined : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className={cn(
                  "absolute inset-0 w-full h-full flex items-center justify-center",
                  paddingClass,
                  itemClassName,
                )}>
                {slides[activeIndex]?.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {resolvedShowControls && slides.length > 1 && (
          <>
            {renderPrevControl ? (
              renderPrevControl({
                onClick: () => paginate(-1),
                disabled: isPrevDisabled,
              })
            ) : (
              <button
                type="button"
                aria-label="Previous Slide"
                disabled={isPrevDisabled}
                onClick={() => paginate(-1)}
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/80 hover:bg-background text-foreground border border-border/50 backdrop-blur-md shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30 disabled:cursor-not-allowed",
                  controlClassName,
                )}>
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            )}

            {renderNextControl ? (
              renderNextControl({
                onClick: () => paginate(1),
                disabled: isNextDisabled,
              })
            ) : (
              <button
                type="button"
                aria-label="Next Slide"
                disabled={isNextDisabled}
                onClick={() => paginate(1)}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-background/80 hover:bg-background text-foreground border border-border/50 backdrop-blur-md shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30 disabled:cursor-not-allowed",
                  controlClassName,
                )}>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        {/* Slide Indicators / Dots */}
        {resolvedShowIndicators && slides.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center items-center gap-1.5 pointer-events-none">
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-background/40 backdrop-blur-md pointer-events-auto border border-white/10">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    idx === activeIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-foreground/40 hover:bg-foreground/70",
                    indicatorClassName,
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Carousel.displayName = "Carousel";
