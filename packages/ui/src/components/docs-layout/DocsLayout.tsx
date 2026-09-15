/**
 * DocsLayout component for AsheeUI.
 *
 * This file provides the `DocsLayout` documentation composition: a navigation
 * column, an article column and an optional table of contents, with the page's
 * landmarks and a skip link. It composes the application shell with the split
 * layout, so a documentation page is built from the framework's own layout
 * primitives rather than from a second set of them.
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
import { SidebarLayout } from "../sidebar-layout/SidebarLayout";
import { Split } from "../split/Split";
import {
  type DocsLayoutConfig,
  FALLBACK_DOCS_LAYOUT_CONFIG,
} from "./docs-layout-config";
import {
  DOCS_LAYOUT_ARTICLE_CLASS,
  DOCS_LAYOUT_BODY_CLASS,
  DOCS_LAYOUT_CLASS,
  DOCS_LAYOUT_SHELL_CLASS,
  DOCS_LAYOUT_TOC_CLASS,
  DOCS_LAYOUT_TOC_STICKY_CLASS,
} from "./docs-layout-styles";

type BaseDocsLayoutProps = DocsLayoutConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color">;

/**
 * Props for the DocsLayout component.
 */
export interface DocsLayoutProps extends BaseDocsLayoutProps {
  /**
   * The documentation navigation, typically a `Sidebar` of sections and pages.
   */
  navigation: ReactNode;

  /**
   * The table of contents of the current article.
   * Left out, the composition is a two-column page; supplied, the contents take
   * the third column on a large screen and are hidden below it.
   */
  toc?: ReactNode;

  /**
   * Content above everything, typically a `Navbar` with the site's brand and
   * search.
   */
  header?: ReactNode;

  /**
   * Content below everything.
   */
  footer?: ReactNode;

  /**
   * The article.
   */
  children?: ReactNode;

  /**
   * Identifier of the article region, which the skip link points at.
   *
   * @default "main-content"
   */
  mainId?: string;

  /**
   * Element to render the page shell as.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;
}

/**
 * The arrangement a documentation page is built in.
 *
 * The composition is a navigation column, an article and, when one is supplied,
 * a table of contents. It composes the framework's application shell and split
 * layout, so the behaviour a documentation page depends on (the sticky
 * navigation, the stacked narrow-screen layout and the responsive columns) is
 * the behaviour those primitives already provide and test.
 *
 * Nothing but the table of contents is hidden from a narrow screen: the
 * navigation stays in the document above the article, so a keyboard reader
 * reaches it without a drawer to trap focus in. The contents repeat the
 * article's own headings, which stay in the article.
 *
 * @param props - DocsLayout configuration options and element attributes.
 * @param props.navigation - The documentation navigation.
 * @param props.toc - The table of contents of the current article.
 * @param props.header - Content above everything.
 * @param props.footer - Content below everything.
 * @param props.children - The article.
 * @param props.mainId - Identifier of the article region. Defaults to
 * "main-content".
 * @param props.navigationLabel - Name of the navigation landmark. Defaults to
 * "Documentation".
 * @param props.tocLabel - Name of the contents landmark. Defaults to "On this
 * page".
 * @param props.navigationWidth - Width of the navigation column from `lg`.
 * Defaults to "md".
 * @param props.stickyToc - Keep the contents in view. Defaults to true.
 * @param props.skipLink - Render a skip link. Defaults to true.
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered page.
 *
 * @example
 * ```tsx
 * <DocsLayout
 *   header={<Navbar brand="AsheeUI" links={links} />}
 *   navigation={<Sidebar items={sections} activeKey="layout" />}
 *   toc={<TableOfContents items={headings} />}>
 *   <Typography role="display">Layout</Typography>
 *   <Typography role="body-md">A page is composed from the layout layer.</Typography>
 * </DocsLayout>
 * ```
 *
 * @see MarketingLayout - The marketing composition.
 * @see SidebarLayout - The application shell the composition builds on.
 */
export const DocsLayout = forwardRef<HTMLDivElement, DocsLayoutProps>(
  (
    {
      navigation,
      toc,
      header,
      footer,
      children,
      mainId = "main-content",
      navigationLabel,
      tocLabel,
      navigationWidth,
      stickyToc,
      skipLink,
      skipLinkLabel,
      as,
      className,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      DocsLayoutConfig,
      Required<DocsLayoutConfig>
    >(
      {
        navigationLabel,
        tocLabel,
        navigationWidth,
        stickyToc,
        skipLink,
        skipLinkLabel,
      },
      config.components?.docslayout,
      FALLBACK_DOCS_LAYOUT_CONFIG,
    );

    const article = (
      <main id={mainId} tabIndex={-1} className={DOCS_LAYOUT_ARTICLE_CLASS}>
        <div className={DOCS_LAYOUT_BODY_CLASS}>{children}</div>
      </main>
    );

    const Component: ElementType = as ?? "div";

    return (
      <Component
        ref={ref}
        className={cn(DOCS_LAYOUT_CLASS, className)}
        {...rest}>
        {resolved.skipLink && (
          <SkipLink targetId={mainId} label={resolved.skipLinkLabel} />
        )}
        <SidebarLayout
          className={DOCS_LAYOUT_SHELL_CLASS}
          header={header}
          footer={footer}
          sidebar={navigation}
          sidebarLabel={resolved.navigationLabel}
          sidebarWidth={resolved.navigationWidth}>
          {toc ? (
            <Split
              stackAt="xl"
              ratio="start"
              gap="xl"
              align="start"
              start={article}
              end={
                <aside
                  aria-label={resolved.tocLabel}
                  className={cn(
                    DOCS_LAYOUT_TOC_CLASS,
                    resolved.stickyToc && DOCS_LAYOUT_TOC_STICKY_CLASS,
                  )}>
                  {toc}
                </aside>
              }
            />
          ) : (
            article
          )}
        </SidebarLayout>
      </Component>
    );
  },
);

DocsLayout.displayName = "DocsLayout";
