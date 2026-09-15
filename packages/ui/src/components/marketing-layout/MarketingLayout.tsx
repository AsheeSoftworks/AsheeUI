/**
 * MarketingLayout component for AsheeUI.
 *
 * This file provides the `MarketingLayout` page composition: the arrangement a
 * marketing page is built in, with navigation, a main region of sections and a
 * footer. It owns the page's landmarks and its skip link, and takes every region
 * as a node, so a consumer passes the framework's `Navbar`, `Hero`,
 * `FeatureGrid`, `CTA` and `Footer` and nothing about their content is decided
 * here.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { SkipLink } from "../section-kit/SkipLink";
import {
  FALLBACK_MARKETING_LAYOUT_CONFIG,
  type MarketingLayoutConfig,
} from "./marketing-layout-config";
import {
  MARKETING_LAYOUT_BACKGROUND_CLASS,
  MARKETING_LAYOUT_BASE_CLASS,
  MARKETING_LAYOUT_MAIN_CLASS,
} from "./marketing-layout-styles";

type BaseMarketingLayoutProps = MarketingLayoutConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the MarketingLayout component.
 */
export interface MarketingLayoutProps extends BaseMarketingLayoutProps {
  /**
   * The page's navigation, above the main region.
   * The framework's `Navbar` renders a `header` landmark, so it belongs here
   * unwrapped; a consumer's own navigation element does too.
   */
  navigation?: ReactNode;

  /**
   * The page's footer, below the main region.
   * The framework's `Footer` renders a `footer` landmark, so it belongs here
   * unwrapped.
   */
  footer?: ReactNode;

  /**
   * The page's sections, in the order they appear: a hero, then the supporting
   * sections, then the closing call to action.
   */
  children?: ReactNode;

  /**
   * Identifier of the main region, which the skip link points at.
   * A page with more than one composition on it gives each one its own.
   *
   * @default "main-content"
   */
  mainId?: string;

  /**
   * Element to render the shell as.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;
}

/**
 * The arrangement a marketing page is built in.
 *
 * The composition states the page's structure once: navigation first, then a
 * `main` landmark holding the sections, then the footer, with a skip link as the
 * first focusable element so a keyboard reader can pass the navigation. Which
 * sections exist, in what order, and whether they appear at all stay the
 * consumer's decision, because they are passed as children.
 *
 * The composition paints the page background and takes the viewport height. It
 * adds no width and no rhythm of its own: `Section`, `Container` and `Grid`
 * inside the sections decide those, which is what keeps a section usable on its
 * own.
 *
 * @param props - MarketingLayout configuration options and element attributes.
 * @param props.navigation - The navigation, above the main region.
 * @param props.footer - The footer, below the main region.
 * @param props.children - The sections, in order.
 * @param props.mainId - Identifier of the main region. Defaults to
 * "main-content".
 * @param props.skipLink - Render a skip link. Defaults to true.
 * @param props.skipLinkLabel - Wording of the skip link. Defaults to "Skip to
 * content".
 * @param props.background - Background to paint. Defaults to "default".
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered page.
 *
 * @example
 * ```tsx
 * <MarketingLayout
 *   navigation={<Navbar brand="Ashee" links={links} actions={actions} />}
 *   footer={<Footer brand="Ashee" groups={groups} />}>
 *   <Hero eyebrow="AsheeUI 2.0" title="A complete UI system" primaryAction={start} />
 *   <FeatureGrid title="Everything a page needs" features={features} />
 *   <CTA title="Start building" primaryAction={start} />
 * </MarketingLayout>
 * ```
 *
 * @see DocsLayout - The documentation composition.
 * @see SidebarLayout - The application shell, for a page with a navigation column.
 */
export const MarketingLayout = forwardRef<HTMLDivElement, MarketingLayoutProps>(
  (
    {
      navigation,
      footer,
      children,
      mainId = "main-content",
      skipLink,
      skipLinkLabel,
      background,
      as,
      className,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      MarketingLayoutConfig,
      Required<MarketingLayoutConfig>
    >(
      { skipLink, skipLinkLabel, background },
      config.components?.marketinglayout,
      FALLBACK_MARKETING_LAYOUT_CONFIG,
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        className={cn(
          MARKETING_LAYOUT_BASE_CLASS,
          MARKETING_LAYOUT_BACKGROUND_CLASS[resolved.background],
          className,
        )}
        {...rest}>
        {resolved.skipLink && (
          <SkipLink targetId={mainId} label={resolved.skipLinkLabel} />
        )}
        {navigation}
        <main id={mainId} tabIndex={-1} className={MARKETING_LAYOUT_MAIN_CLASS}>
          {children}
        </main>
        {footer}
      </Component>
    );
  },
);

MarketingLayout.displayName = "MarketingLayout";
