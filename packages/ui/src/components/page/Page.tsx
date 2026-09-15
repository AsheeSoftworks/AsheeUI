/**
 * Page components for AsheeUI.
 *
 * This file provides the four parts of an application page: `Page` (the
 * full-height shell), `PageHeader` (a bar that can stick to the top of the
 * viewport), `PageContent` (the area that fills the remaining height) and
 * `PageFooter`. Together they are the application-page layer of the framework's
 * composition ladder, and each part composes with the others rather than
 * requiring the full set.
 */

"use client";

import { type ElementType, forwardRef, type HTMLAttributes } from "react";
import { useAsheeConfig } from "../../libs/context";
import { SPACE_PADDING_Y_CLASS, type Space } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade } from "../../utils/resolve-token";
import { Container } from "../container/Container";
import type { ContainerSize } from "../container/container-config";
import { FALLBACK_PAGE_CONFIG, type PageConfig } from "./page-config";
import {
  PAGE_CLASS,
  PAGE_CONTENT_CLASS,
  PAGE_DIVIDER_CLASS,
  PAGE_FOOTER_CLASS,
  PAGE_FOOTER_DIVIDER_CLASS,
  PAGE_FOOTER_INNER_CLASS,
  PAGE_HEADER_CLASS,
  PAGE_HEADER_INNER_CLASS,
  PAGE_HEADER_STICKY_CLASS,
} from "./page-styles";

type BasePageProps = PageConfig & Omit<HTMLAttributes<HTMLElement>, "color">;

/**
 * Resolve the shared page-part options through the standard cascade.
 * The four parts answer the same four questions (nesting, width, rhythm,
 * separators), so they resolve them the same way and a single
 * `components.page` entry restyles the whole shell.
 *
 * @param props - The options passed to the part.
 * @returns The resolved options.
 */
function usePagePart(props: PageConfig) {
  const config = useAsheeConfig();
  const sectionConfig = config.components?.page;

  return {
    contained: resolveCascade<boolean>(
      props.contained,
      sectionConfig?.contained,
      undefined,
      FALLBACK_PAGE_CONFIG.contained,
    ),
    containerSize: resolveCascade<ContainerSize>(
      props.containerSize,
      sectionConfig?.containerSize,
      undefined,
      FALLBACK_PAGE_CONFIG.containerSize,
    ),
    spacing: resolveCascade<Space>(
      props.spacing,
      sectionConfig?.spacing,
      undefined,
      FALLBACK_PAGE_CONFIG.spacing,
    ),
    sticky: resolveCascade<boolean>(
      props.sticky,
      sectionConfig?.sticky,
      undefined,
      FALLBACK_PAGE_CONFIG.sticky,
    ),
    divider: resolveCascade<boolean>(
      props.divider,
      sectionConfig?.divider,
      undefined,
      FALLBACK_PAGE_CONFIG.divider,
    ),
  };
}

/**
 * Props for the Page component.
 */
export interface PageProps extends BasePageProps {
  /**
   * Element to render.
   * Defaults to a `div`. A page whose shell is the document body may render
   * `main` here, but a `main` element is usually `PageContent`.
   *
   * @default "div"
   */
  as?: ElementType;
}

/**
 * The application-page shell.
 *
 * Page is a full-height column that applies the theme background to everything
 * inside it. It adds no width, no gutter and no rhythm of its own: those belong
 * to `Container`, `PageContent` and `Section`.
 *
 * @param props - Page configuration options and element attributes.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered page shell.
 *
 * @example
 * ```tsx
 * <Page>
 *   <PageHeader>Invoices</PageHeader>
 *   <PageContent>...</PageContent>
 *   <PageFooter>Ashee Softworks</PageFooter>
 * </Page>
 * ```
 *
 * @see SidebarLayout - A shell that adds a persistent navigation column.
 */
export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ as, className, children, ...rest }, ref) => {
    const Component: ElementType = as ?? "div";

    return (
      <Component ref={ref} className={cn(PAGE_CLASS, className)} {...rest}>
        {children}
      </Component>
    );
  },
);

Page.displayName = "Page";

/**
 * Props for the PageHeader component.
 */
export interface PageHeaderProps extends BasePageProps {
  /**
   * Element to render.
   * Defaults to `header`.
   *
   * @default "header"
   */
  as?: ElementType;

  /**
   * Whether the header sticks to the top of the viewport while the content
   * scrolls. Resolved through the standard cascade, so an application can turn
   * it off for every page in configuration.
   *
   * @default true
   */
  sticky?: boolean;
}

/**
 * The bar at the top of a page.
 *
 * PageHeader keeps a page title, a breadcrumb, a search field or a set of
 * actions visible while the content scrolls. It is a `header` landmark by
 * default and is contained by default, so a consumer adds the content and gets
 * the framework's width and gutter.
 *
 * @param props - Page configuration options and element attributes.
 * @param props.sticky - Stick to the top while scrolling. Defaults to true.
 * @param props.contained - Wrap the content in a Container. Defaults to true.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @param props.divider - Draw a separator below the header. Defaults to true.
 * @param props.as - Element to render. Defaults to "header".
 * @returns The rendered header.
 *
 * @example
 * ```tsx
 * <PageHeader sticky>
 *   <Typography role="heading-md">Invoices</Typography>
 *   <Button size="sm">New invoice</Button>
 * </PageHeader>
 * ```
 */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  (
    {
      as,
      sticky,
      contained,
      containerSize,
      divider,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const resolved = usePagePart({ sticky, contained, containerSize, divider });

    const Component: ElementType = as ?? "header";

    const inner = <div className={PAGE_HEADER_INNER_CLASS}>{children}</div>;

    return (
      <Component
        ref={ref}
        className={cn(
          PAGE_HEADER_CLASS,
          resolved.sticky && PAGE_HEADER_STICKY_CLASS,
          resolved.divider && PAGE_DIVIDER_CLASS,
          className,
        )}
        {...rest}>
        {resolved.contained ? (
          <Container size={resolved.containerSize}>{inner}</Container>
        ) : (
          inner
        )}
      </Component>
    );
  },
);

/**
 * Props for the PageContent component.
 */
export interface PageContentProps extends BasePageProps {
  /**
   * Element to render.
   * Defaults to `main`, which is the landmark assistive technology jumps to
   * when a reader skips the navigation.
   *
   * @default "main"
   */
  as?: ElementType;

  /**
   * Vertical rhythm of the content area.
   * Resolved through the standard cascade: prop, then
   * `components.page.spacing`, then the framework fallback.
   *
   * @default "md"
   */
  spacing?: Space;
}

/**
 * The area that fills the space between the header and the footer.
 *
 * PageContent is the `main` landmark of the document and is contained by
 * default, so an application page gets the framework's maximum width and gutter
 * without any extra markup.
 *
 * @param props - Page configuration options and element attributes.
 * @param props.spacing - Vertical padding. Defaults to "md".
 * @param props.contained - Wrap the content in a Container. Defaults to true.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @param props.as - Element to render. Defaults to "main".
 * @returns The rendered content area.
 *
 * @example
 * ```tsx
 * <PageContent spacing="lg">
 *   <Grid columns={1} columnsLg={3} gap="lg">...</Grid>
 * </PageContent>
 * ```
 */
export const PageContent = forwardRef<HTMLElement, PageContentProps>(
  (
    { as, contained, containerSize, spacing, className, children, ...rest },
    ref,
  ) => {
    const resolved = usePagePart({ contained, containerSize, spacing });

    const Component: ElementType = as ?? "main";

    const inner = (
      <div
        className={cn(
          SPACE_PADDING_Y_CLASS[resolved.spacing],
          "flex w-full flex-col",
          className,
        )}>
        {children}
      </div>
    );

    return (
      <Component ref={ref} className={PAGE_CONTENT_CLASS} {...rest}>
        {resolved.contained ? (
          <Container size={resolved.containerSize}>{inner}</Container>
        ) : (
          inner
        )}
      </Component>
    );
  },
);

PageContent.displayName = "PageContent";

/**
 * Props for the PageFooter component.
 */
export interface PageFooterProps extends BasePageProps {
  /**
   * Element to render.
   * Defaults to `footer`.
   *
   * @default "footer"
   */
  as?: ElementType;
}

/**
 * The bar at the bottom of an application page.
 *
 * PageFooter is the application counterpart of the marketing {@link Footer}. It
 * carries a short legal line, a build identifier or a status summary rather than
 * navigation groups, and it is the last element of a page shell.
 *
 * @param props - Page configuration options and element attributes.
 * @param props.contained - Wrap the content in a Container. Defaults to true.
 * @param props.containerSize - Container width when contained. Defaults to "lg".
 * @param props.divider - Draw a separator above the footer. Defaults to true.
 * @param props.as - Element to render. Defaults to "footer".
 * @returns The rendered footer.
 *
 * @example
 * ```tsx
 * <PageFooter>
 *   <Typography role="caption" tone="muted">Version 1.1.0</Typography>
 * </PageFooter>
 * ```
 *
 * @see Footer - The marketing footer, with navigation groups and social links.
 */
export const PageFooter = forwardRef<HTMLElement, PageFooterProps>(
  (
    { as, contained, containerSize, divider, className, children, ...rest },
    ref,
  ) => {
    const resolved = usePagePart({ contained, containerSize, divider });

    const Component: ElementType = as ?? "footer";

    const inner = <div className={PAGE_FOOTER_INNER_CLASS}>{children}</div>;

    return (
      <Component
        ref={ref}
        className={cn(
          PAGE_FOOTER_CLASS,
          resolved.divider && PAGE_FOOTER_DIVIDER_CLASS,
          className,
        )}
        {...rest}>
        {resolved.contained ? (
          <Container size={resolved.containerSize}>{inner}</Container>
        ) : (
          inner
        )}
      </Component>
    );
  },
);

PageFooter.displayName = "PageFooter";

PageHeader.displayName = "PageHeader";
