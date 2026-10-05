/**
 * Carousel component for the native package.
 *
 * The component satisfies the framework's carousel contract: the same slides, the same
 * frame treatments, the same heights, the same controls, the same dots, the same autoplay
 * and the same controlled and uncontrolled index as the web carousel.
 *
 * What the platform forces is how a reader moves between slides, and it is a better answer
 * than an imitation would be. The web translates a scroll position; the platform **pages**
 * its scroll view, so a slide arrives where the screen is and a reader flicks one into place
 * with the gesture they already use everywhere. That is also why `loop` wraps only the
 * autoplay here: a scroll view that teleported its content back to the start would be lying
 * about where the reader is, so a reader who swipes to the end stays at the end, while the
 * carousel's own advance returns to the first slide when it is asked to.
 *
 * `pauseOnHover` becomes "pause while the reader is dragging", which is the same intent on a
 * platform with no pointer: the carousel does not move out from under a thumb that is using
 * it.
 *
 * A slide is as wide as the carousel, which is measured from the layout rather than assumed,
 * because the platform's own layout is the only thing that knows how wide the screen is.
 */

import {
  CAROUSEL_PADDING_CLASS,
  type CarouselItem,
  type CarouselVariant,
  NATIVE_CAROUSEL_BASE_CLASS,
  NATIVE_CAROUSEL_CONTROL_CLASS,
  NATIVE_CAROUSEL_HEIGHT_CLASS,
  NATIVE_CAROUSEL_INDICATOR_CLASS,
  NATIVE_CAROUSEL_INDICATOR_DOT_CLASS,
  NATIVE_CAROUSEL_INDICATOR_MARK_CLASS,
  NATIVE_CAROUSEL_INDICATORS_CLASS,
  NATIVE_CAROUSEL_NEXT_CLASS,
  NATIVE_CAROUSEL_NEXT_GLYPH,
  NATIVE_CAROUSEL_PREV_CLASS,
  NATIVE_CAROUSEL_PREV_GLYPH,
  NATIVE_CAROUSEL_SLIDE_CLASS,
  NATIVE_CAROUSEL_TRACK_CLASS,
  NATIVE_CAROUSEL_VARIANT_CLASS,
  NATIVE_RADIUS_CLASS,
  type Radius,
  resolveCascade,
  type Size,
} from "@asheeui/core";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Pressable, ScrollView, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_CAROUSEL_CONFIG,
  type NativeCarouselConfig,
} from "./carousel-config";

/**
 * Props for the native Carousel.
 */
export interface CarouselProps
  extends NativeCarouselConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The slides to display. */
  items?: CarouselItem[];

  /** The slide shown at first, for a carousel that is not controlled. */
  defaultIndex?: number;

  /**
   * The slide that is shown.
   * When it is given the carousel is controlled and reports movement through
   * `onIndexChange`.
   */
  index?: number;

  /** Called with the index of the slide the reader moved to. */
  onIndexChange?: (index: number) => void;

  /** Renders the previous control, in place of the framework's. */
  renderPrevControl?: (props: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;

  /** Renders the next control, in place of the framework's. */
  renderNextControl?: (props: {
    onClick: () => void;
    disabled: boolean;
  }) => ReactNode;

  /** Extra classes applied to every slide. */
  itemClassName?: string;

  /** Extra classes applied to every control. */
  controlClassName?: string;

  /** Extra classes applied to every dot. */
  indicatorClassName?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A strip of slides a reader moves through.
 *
 * @param props - The slides, their options and the platform's view props.
 * @param props.items - The slides.
 * @param props.index - The slide shown, when the consumer owns that state.
 * @param props.defaultIndex - The slide shown at first, otherwise.
 * @param props.onIndexChange - Called with the index the reader moved to.
 * @param props.variant - Treatment of the frame. Defaults to the configured value.
 * @param props.size - Height of the carousel. Defaults to the configured value.
 * @param props.radius - Corner rounding. Defaults to the configured value.
 * @param props.autoPlay - Whether the slides advance by themselves.
 * @param props.autoPlayInterval - How long a slide stays, in milliseconds.
 * @param props.loop - Whether the autoplay returns to the first slide.
 * @param props.showControls - Whether the previous and next controls are shown.
 * @param props.showIndicators - Whether the dots are shown.
 * @param props.renderPrevControl - Renders the previous control in place of the framework's.
 * @param props.renderNextControl - Renders the next control in place of the framework's.
 * @param props.className - Extra classes applied last.
 * @returns The rendered carousel.
 *
 * @example
 * ```tsx
 * <Carousel
 *   items={[{ id: "one", content: "First" }, { id: "two", content: "Second" }]}
 * />
 * ```
 *
 * @see NativeCarouselConfig - The configuration type for component defaults.
 */
export function Carousel({
  items = [],
  defaultIndex,
  index,
  onIndexChange,
  renderPrevControl,
  renderNextControl,
  itemClassName,
  controlClassName,
  indicatorClassName,
  variant,
  size,
  radius,
  autoPlay,
  autoPlayInterval,
  loop,
  showControls,
  showIndicators,
  pauseOnHover,
  disableAnimation,
  className,
  style,
  ...rest
}: CarouselProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.carousel;

  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.size,
  );
  const resolvedVariant = resolveCascade<CarouselVariant>(
    variant,
    sectionConfig?.variant,
    config.defaultVariant as CarouselVariant | undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.variant,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.radius,
  );
  const resolvedAutoPlay = resolveCascade<boolean>(
    autoPlay,
    sectionConfig?.autoPlay,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.autoPlay,
  );
  const resolvedAutoPlayInterval = resolveCascade<number>(
    autoPlayInterval,
    sectionConfig?.autoPlayInterval,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.autoPlayInterval,
  );
  const resolvedLoop = resolveCascade<boolean>(
    loop,
    sectionConfig?.loop,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.loop,
  );
  const resolvedShowControls = resolveCascade<boolean>(
    showControls,
    sectionConfig?.showControls,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.showControls,
  );
  const resolvedShowIndicators = resolveCascade<boolean>(
    showIndicators,
    sectionConfig?.showIndicators,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.showIndicators,
  );
  const resolvedPauseOnHover = resolveCascade<boolean>(
    pauseOnHover,
    sectionConfig?.pauseOnHover,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.pauseOnHover,
  );
  const resolvedDisableAnimation = resolveCascade<boolean>(
    disableAnimation,
    sectionConfig?.disableAnimation,
    undefined,
    FALLBACK_NATIVE_CAROUSEL_CONFIG.disableAnimation,
  );

  // A treatment the carousel has none for — the platform's filled default, which is stated
  // for a control — becomes the treatment the carousel documents.
  const variantClass =
    NATIVE_CAROUSEL_VARIANT_CLASS[resolvedVariant] ??
    NATIVE_CAROUSEL_VARIANT_CLASS.bordered;

  const [width, setWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [ownIndex, setOwnIndex] = useState<number>(() => defaultIndex ?? 0);
  const scroller = useRef<ScrollView>(null);

  const isControlled = index !== undefined;
  const activeIndex = isControlled ? index : ownIndex;
  const lastIndex = items.length - 1;

  const goTo = useCallback(
    (next: number) => {
      const bounded = Math.max(0, Math.min(lastIndex, next));

      if (!isControlled) {
        setOwnIndex(bounded);
      }

      onIndexChange?.(bounded);
      scroller.current?.scrollTo({
        x: bounded * width,
        animated: !resolvedDisableAnimation,
      });
    },
    [isControlled, lastIndex, onIndexChange, resolvedDisableAnimation, width],
  );

  const paginate = useCallback(
    (direction: 1 | -1) => {
      let next = activeIndex + direction;

      if (next < 0) {
        next = resolvedLoop ? lastIndex : 0;
      }

      if (next > lastIndex) {
        next = resolvedLoop ? 0 : lastIndex;
      }

      if (next !== activeIndex) {
        goTo(next);
      }
    },
    [activeIndex, goTo, lastIndex, resolvedLoop],
  );

  /**
   * Take the slide the platform's scroll view stopped on.
   *
   * The platform pages its own scroll view, so where a swipe ended is the index the reader
   * chose; asking the framework to guess it from a gesture would be a worse answer than
   * asking the platform where it stopped.
   */
  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (width === 0) {
      return;
    }

    const next = Math.round(event.nativeEvent.contentOffset.x / width);

    if (next !== activeIndex) {
      if (!isControlled) {
        setOwnIndex(next);
      }

      onIndexChange?.(next);
    }
  };

  useEffect(() => {
    if (!resolvedAutoPlay || items.length < 2) {
      return;
    }

    // The reader's thumb pauses the advance, which is what a pointer resting on the web
    // carousel does.
    if (resolvedPauseOnHover && isDragging) {
      return;
    }

    // A carousel that does not loop stops at its last slide rather than returning to the
    // first one, because that is what not looping means.
    if (!resolvedLoop && activeIndex === lastIndex) {
      return;
    }

    const timer = setTimeout(() => paginate(1), resolvedAutoPlayInterval);

    return () => clearTimeout(timer);
  }, [
    activeIndex,
    isDragging,
    items.length,
    lastIndex,
    paginate,
    resolvedAutoPlay,
    resolvedAutoPlayInterval,
    resolvedLoop,
    resolvedPauseOnHover,
  ]);

  const isPrevDisabled = !resolvedLoop && activeIndex === 0;
  const isNextDisabled = !resolvedLoop && activeIndex === lastIndex;
  const hasSeveralSlides = items.length > 1;

  return (
    <View
      accessibilityLabel={
        items.length > 0
          ? `Slide ${activeIndex + 1} of ${items.length}`
          : undefined
      }
      className={classNames(
        NATIVE_CAROUSEL_BASE_CLASS,
        NATIVE_CAROUSEL_HEIGHT_CLASS[resolvedSize],
        variantClass,
        NATIVE_RADIUS_CLASS[resolvedRadius],
        className,
      )}
      style={style}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      {...rest}>
      <ScrollView
        ref={scroller}
        horizontal
        // The platform's own paging is what puts a slide where the screen is.
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => setIsDragging(true)}
        onScrollEndDrag={() => setIsDragging(false)}
        onMomentumScrollEnd={handleMomentumEnd}
        className={NATIVE_CAROUSEL_TRACK_CLASS}>
        {items.map((slide, slideIndex) => (
          <View
            key={slide.id ?? `slide-${slideIndex}`}
            style={width > 0 ? { width } : undefined}
            className={classNames(
              NATIVE_CAROUSEL_SLIDE_CLASS,
              CAROUSEL_PADDING_CLASS[resolvedSize],
              itemClassName,
            )}>
            {typeof slide.content === "string" ? (
              <Text role="body-md">{slide.content}</Text>
            ) : (
              slide.content
            )}
          </View>
        ))}
      </ScrollView>

      {resolvedShowControls && hasSeveralSlides && (
        <>
          {renderPrevControl ? (
            renderPrevControl({
              onClick: () => paginate(-1),
              disabled: isPrevDisabled,
            })
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous Slide"
              accessibilityState={{ disabled: isPrevDisabled }}
              disabled={isPrevDisabled}
              onPress={() => paginate(-1)}
              className={classNames(
                NATIVE_CAROUSEL_CONTROL_CLASS,
                NATIVE_CAROUSEL_PREV_CLASS,
                controlClassName,
              )}>
              <Text role="label">{NATIVE_CAROUSEL_PREV_GLYPH}</Text>
            </Pressable>
          )}

          {renderNextControl ? (
            renderNextControl({
              onClick: () => paginate(1),
              disabled: isNextDisabled,
            })
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next Slide"
              accessibilityState={{ disabled: isNextDisabled }}
              disabled={isNextDisabled}
              onPress={() => paginate(1)}
              className={classNames(
                NATIVE_CAROUSEL_CONTROL_CLASS,
                NATIVE_CAROUSEL_NEXT_CLASS,
                controlClassName,
              )}>
              <Text role="label">{NATIVE_CAROUSEL_NEXT_GLYPH}</Text>
            </Pressable>
          )}
        </>
      )}

      {resolvedShowIndicators && hasSeveralSlides && (
        <View className={NATIVE_CAROUSEL_INDICATORS_CLASS}>
          {items.map((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;

            return (
              <Pressable
                key={slide.id ?? `dot-${slideIndex}`}
                accessibilityRole="button"
                accessibilityLabel={`Go to slide ${slideIndex + 1}`}
                accessibilityState={{ selected: isActive }}
                onPress={() => goTo(slideIndex)}
                className={classNames(
                  NATIVE_CAROUSEL_INDICATOR_CLASS,
                  indicatorClassName,
                )}>
                <View
                  className={classNames(
                    NATIVE_CAROUSEL_INDICATOR_DOT_CLASS,
                    NATIVE_CAROUSEL_INDICATOR_MARK_CLASS[
                      isActive ? "active" : "resting"
                    ],
                  )}
                />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
