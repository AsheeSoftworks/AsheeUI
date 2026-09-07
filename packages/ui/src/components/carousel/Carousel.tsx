/**
 * Carousel component for AsheeUI.
 * This file provides the main Carousel component implementation, which renders
 * a slideshow container for displaying content in a horizontal scrolling carousel.
 * It supports autoplay, loop mode, navigation controls, indicator dots, and
 * touch/swipe interactions. Visual tokens resolve through the standard AsheeUI
 * cascade system.
 */
"use client";

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
import type { Size } from "../../shared";
import { RADIUS_CLASS } from "../../shared";
import { cn } from "../../utils";
import {
  resolveCascade,
  resolveClassKey,
  resolveRadiusKey,
} from "../../utils/resolve-token";
import {
  type CarouselConfig,
  type CarouselItem,
  type CarouselVariant,
  FALLBACK_CAROUSEL_CONFIG,
} from "./carousel-config";
import {
  CAROUSEL_HEIGHT_CLASS,
  CAROUSEL_PADDING_CLASS,
  CAROUSEL_VARIANT_CLASS,
} from "./carousel-styles";

/**
 * Minimum distance in pixels for a swipe to trigger a slide change.
 */
const SWIPE_THRESHOLD = 50;

type BaseCarouselProps = CarouselConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

/**
 * Configuration options for the Carousel component.
 */
export interface CarouselProps extends BaseCarouselProps {
  /**
   * Array of items to display in the carousel.
   * Each item must have content and an optional id.
   */
  items?: CarouselItem[];

  /**
   * Initial slide index for uncontrolled usage.
   * @default 0
   */
  defaultIndex?: number;

  /**
   * Controlled slide index.
   * When provided, the component becomes controlled.
   */
  index?: number;

  /**
   * Callback fired when the slide index changes.
   * Called with the new slide index.
   */
  onIndexChange?: (index: number) => void;

  /**
   * Custom render function for the previous control button.
   * Receives onClick handler and disabled state.
   */
  renderPrevControl?: (props: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;

  /**
   * Custom render function for the next control button.
   * Receives onClick handler and disabled state.
   */
  renderNextControl?: (props: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;

  /**
   * Extra classes applied to each slide item container.
   */
  itemClassName?: string;

  /**
   * Extra classes applied to control buttons.
   */
  controlClassName?: string;

  /**
   * Extra classes applied to indicator buttons.
   */
  indicatorClassName?: string;
}

/**
 * A slideshow container for displaying content in a horizontal carousel.
 *
 * Carousel supports autoplay, loop mode, navigation controls, indicator dots,
 and touch/swipe interactions. Visual tokens (`variant`, `size`, `radius`,
 * `autoPlay`, `loop`, `showControls`, `showIndicators`, `pauseOnHover`)
 * resolve through the standard AsheeUI cascade: prop, component config,
 * global theme defaults, and the built-in fallback.
 *
 * The component automatically handles accessibility attributes including
 * ARIA labels for controls and indicators. It supports both mouse and
 * touch interactions for swipe gestures.
 *
 * @param props - Carousel configuration options and HTML div element props.
 * @param props.items - Array of items to display.
 * @param props.variant - Visual style variant. Defaults to "bordered".
 * @param props.size - Height scale. Defaults to "md".
 * @param props.radius - Corner rounding. Defaults to "lg".
 * @param props.autoPlay - Enable autoplay. Defaults to false.
 * @param props.autoPlayInterval - Autoplay interval in ms. Defaults to 5000.
 * @param props.loop - Enable loop mode. Defaults to true.
 * @param props.showControls - Show navigation controls. Defaults to true.
 * @param props.showIndicators - Show indicator dots. Defaults to true.
 * @param props.pauseOnHover - Pause autoplay on hover. Defaults to true.
 * @param props.disableAnimation - Disable transitions. Defaults to false.
 * @param props.defaultIndex - Initial slide index. Defaults to 0.
 * @param props.index - Controlled slide index.
 * @param props.onIndexChange - Change callback with slide index.
 * @param props.renderPrevControl - Custom previous control renderer.
 * @param props.renderNextControl - Custom next control renderer.
 * @param props.itemClassName - Extra classes for slide items.
 * @param props.controlClassName - Extra classes for controls.
 * @param props.indicatorClassName - Extra classes for indicators.
 * @param props.children - Child elements as slides (alternative to items).
 *
 * @example
 * ```tsx
 * import { Carousel } from "asheeui";
 *
 * export function Example() {
 *   return (
 *     <Carousel
 *       autoPlay
 *       loop
 *       items={[
 *         { content: <div>Slide 1</div> },
 *         { content: <div>Slide 2</div> },
 *         { content: <div>Slide 3</div> },
 *       ]}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using children instead of items
 * <Carousel autoPlay>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 *   <div>Slide 3</div>
 * </Carousel>
 * ```
 *
 * @see CarouselConfig - The configuration type for component defaults.
 * @see useAsheeConfig - Hook for accessing the global configuration.
 */
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
    const sectionConfig = config.components?.carousel;

    const generatedId = useId();
    const carouselId = id ?? generatedId;

    const resolvedSizeKey = resolveCascade<Size>(
      size,
      sectionConfig?.size,
      undefined,
      FALLBACK_CAROUSEL_CONFIG.size,
    );

    const resolvedVariantKey = resolveCascade<CarouselVariant>(
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
      CAROUSEL_VARIANT_CLASS[resolvedVariantKey] ??
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
          "relative overflow-clip w-full select-none flex flex-col group",
          variantClass,
          radiusClass,
          heightClass,
          className,
        )}
        style={style}
        {...props}>
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-full overflow-clip flex-1 touch-pan-y cursor-grab active:cursor-grabbing">
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
                  "w-full h-full shrink-0 flex items-center justify-center overflow-clip",
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
