"use client";

import { cn } from "@asheeui/utils";
import {
  forwardRef,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { useAsheeConfig } from "../../libs/context";
import { RADIUS_CLASS } from "../../shared/radius";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type CarouselConfig,
  type CarouselItem,
  type CarouselRadiusKey,
  type CarouselSizeKey,
  type CarouselVariant,
  FALLBACK_CAROUSEL_CONFIG,
} from "./carousel-config";
import {
  CAROUSEL_HEIGHT_CLASS,
  CAROUSEL_PADDING_CLASS,
  CAROUSEL_VARIANT_CLASS,
} from "./carousel-styles";

const SWIPE_THRESHOLD = 50;

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: CarouselItem[];
  variant?: CarouselVariant;
  size?: CarouselSizeKey;
  radius?: CarouselRadiusKey;
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

    const resolvedSizeKey = resolveCascade<CarouselSizeKey>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.size,
    );

    const resolvedVariant = resolveCascade<CarouselVariant>(
      variant,
      sectionConfig?.variant,
      config.defaultVariant as CarouselVariant | undefined,
      FALLBACK_CAROUSEL_CONFIG.variant,
    );

    const resolvedRadiusKey = resolveRadiusKey(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
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
      RADIUS_CLASS,
      FALLBACK_CAROUSEL_CONFIG.radius,
    );

    const variantClass =
      CAROUSEL_VARIANT_CLASS[resolvedVariant] ??
      CAROUSEL_VARIANT_CLASS.bordered;

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
    const [currentIndex, setCurrentIndex] = useState(defaultIndex);
    const activeIndex = isControlled ? controlledIndex : currentIndex;

    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    const startXRef = useRef<number>(0);

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
          setCurrentIndex(nextIdx);
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
        if (!isControlled) {
          setCurrentIndex(targetIndex);
        }
        onIndexChange?.(targetIndex);
      },
      [activeIndex, slides.length, isControlled, onIndexChange],
    );

    useEffect(() => {
      if (
        !resolvedAutoPlay ||
        (resolvedPauseOnHover && isHovered) ||
        isDragging ||
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
      isDragging,
      slides.length,
      paginate,
    ]);

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      setIsDragging(true);
      startXRef.current = e.clientX;
      setDragOffset(0);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const diff = e.clientX - startXRef.current;
      setDragOffset(diff);
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (dragOffset < -SWIPE_THRESHOLD) {
        paginate(1);
      } else if (dragOffset > SWIPE_THRESHOLD) {
        paginate(-1);
      }
      setDragOffset(0);
    };

    const isPrevDisabled = !resolvedLoop && activeIndex === 0;
    const isNextDisabled = !resolvedLoop && activeIndex === slides.length - 1;

    return (
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
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-full overflow-hidden flex-1 touch-pan-y cursor-grab active:cursor-grabbing">
          <div
            className={cn(
              "flex w-full h-full",
              !isDragging &&
                !disableAnimation &&
                "transition-transform duration-300 ease-out",
            )}
            style={{
              transform: `translate3d(calc(${-activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
            }}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className={cn(
                  "w-full h-full shrink-0 flex items-center justify-center overflow-hidden",
                  paddingClass,
                  itemClassName,
                )}>
                {slide.content}
              </div>
            ))}
          </div>
        </div>

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
