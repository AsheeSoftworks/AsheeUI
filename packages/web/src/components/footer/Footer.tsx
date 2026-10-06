/**
 * Footer component for AsheeUI.
 *
 * This file provides the `Footer` pattern: a brand column, navigation groups,
 * an optional action area, social links, legal links and a copyright line. The
 * component carries no product's own links: a consumer passes its navigation as
 * data, and every link renders through the framework's `Link` primitive so a
 * router keeps working.
 */

"use client";

import type { FooterGroup, FooterLinkItem } from "@asheeui/core";
import {
  cn,
  FOOTER_BOTTOM_CLASS,
  FOOTER_BOTTOM_LINKS_CLASS,
  FOOTER_BRAND_COLUMN_CLASS,
  FOOTER_GROUP_CLASS,
  FOOTER_GROUPS_CLASS,
  FOOTER_LINK_CLASS,
  FOOTER_LIST_CLASS,
  FOOTER_SOCIAL_ROW_CLASS,
  FOOTER_TOP_CLASS,
  FOOTER_VARIANT_CLASS,
  resolveConfigCascade,
  SPACE_PADDING_Y_CLASS,
} from "@asheeui/core";
import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { Container } from "../container/Container";
import { Link } from "../link";
import { Typography } from "../typography/Typography";
import { FALLBACK_FOOTER_CONFIG, type FooterConfig } from "./footer-config";

/**
 * One link in the footer.
 *
 * The description is the framework's, declared in `@asheeui/core`, because the native
 * renderer reads the same one. It is re-exported here so a consumer importing the web
 * component keeps naming one type.
 */
/**
 * One column of footer navigation.
 *
 * Shared with the native renderer in the same way as {@link FooterLinkItem}.
 */
export type { FooterGroup, FooterLinkItem };

/**
 * Substitution applied to every link in the footer.
 */
export interface FooterLink {
  /** Component that replaces the anchor, such as a framework router link. */
  component?: ElementType;

  /** Additional props for that component. */
  props?: Record<string, unknown>;
}

type BaseFooterProps = FooterConfig &
  Omit<HTMLAttributes<HTMLElement>, "color" | "title">;

/**
 * Props for the Footer component.
 */
export interface FooterProps extends BaseFooterProps {
  /** Brand content, typically a logo and a product name. */
  brand?: ReactNode;

  /** Short description under the brand. */
  description?: ReactNode;

  /** The navigation groups. */
  groups?: FooterGroup[];

  /** Social links, rendered as a row of icon links under the groups. */
  social?: FooterLinkItem[];

  /** Legal links, rendered beside the copyright line. */
  legal?: FooterLinkItem[];

  /** The copyright line. */
  copyright?: ReactNode;

  /** Action area in the brand column, typically a newsletter signup. */
  newsletter?: ReactNode;

  /** Substitution applied to every link the footer renders. */
  link?: FooterLink;

  /**
   * Element to render the footer as.
   * Defaults to `footer`, which is the contentinfo landmark.
   *
   * @default "footer"
   */
  as?: ElementType;
}

/**
 * The navigation and legal information at the end of a page.
 *
 * Each navigation group is its own `nav` landmark named by the group's title, so
 * a reader can jump straight to the column they want, and the social and legal
 * rows are named landmarks as well. The footer renders nothing it was not given:
 * a consumer that passes only a copyright line gets an accessible one-line
 * footer.
 *
 * @param props - Footer configuration options and element attributes.
 * @param props.brand - Brand content.
 * @param props.description - Short description under the brand.
 * @param props.groups - The navigation groups.
 * @param props.social - Social links.
 * @param props.legal - Legal links.
 * @param props.copyright - The copyright line.
 * @param props.newsletter - Action area in the brand column.
 * @param props.link - Substitution for every link.
 * @param props.variant - Surface treatment. Defaults to "bordered".
 * @param props.spacing - Vertical padding. Defaults to "lg".
 * @param props.contained - Respect the framework's width and gutter.
 * Defaults to true.
 * @param props.as - Element to render. Defaults to "footer".
 * @returns The rendered footer.
 *
 * @example
 * ```tsx
 * <Footer
 *   brand="Ashee SMS"
 *   description="Campaign messaging for growing teams."
 *   groups={[
 *     { title: "Product", links: [{ label: "Campaigns", href: "/campaigns" }] },
 *     { title: "Company", links: [{ label: "About", href: "/about" }] },
 *   ]}
 *   copyright="Ashee Softworks"
 * />
 * ```
 *
 * @see Navbar - The matching start-of-page navigation.
 */

/**
 * Renders a list of footer links.
 *
 * @param props - The links, the substitution, and the list's own class.
 * @returns The rendered list.
 */
function FooterLinkList({
  links,
  link,
  className,
}: {
  links: FooterLinkItem[];
  link?: FooterLink;
  className: string;
}) {
  return (
    <ul className={className}>
      {links.map((item, index) => (
        <li key={item.id ?? index}>
          <Link
            href={item.href}
            startIcon={item.icon}
            isExternal={item.isExternal}
            component={item.component ?? link?.component}
            componentProps={{ ...link?.props, ...item.componentProps }}
            className={FOOTER_LINK_CLASS}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      brand,
      description,
      groups,
      social,
      legal,
      copyright,
      newsletter,
      link,
      variant,
      spacing,
      contained,
      containerSize,
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<FooterConfig, Required<FooterConfig>>(
      { variant, spacing, contained, containerSize },
      config.components?.footer,
      FALLBACK_FOOTER_CONFIG,
    );

    const Component: ElementType = as ?? "footer";

    const hasBrandColumn = Boolean(brand || description || newsletter);
    const hasBottomRow = Boolean(copyright || legal || social);

    const body = (
      <>
        {(hasBrandColumn || (groups && groups.length > 0)) && (
          <div className={FOOTER_TOP_CLASS}>
            {hasBrandColumn && (
              <div className={FOOTER_BRAND_COLUMN_CLASS}>
                {brand && (
                  <Typography as="span" role="heading-sm">
                    {brand}
                  </Typography>
                )}
                {description && (
                  <Typography role="body-sm" tone="muted">
                    {description}
                  </Typography>
                )}
                {newsletter}
              </div>
            )}

            {groups && groups.length > 0 && (
              <div className={FOOTER_GROUPS_CLASS}>
                {groups.map((group, index) => (
                  <nav
                    key={group.id ?? index}
                    aria-label={group.title}
                    className={FOOTER_GROUP_CLASS}>
                    <Typography as="h2" role="label">
                      {group.title}
                    </Typography>
                    <FooterLinkList
                      links={group.links}
                      link={link}
                      className={FOOTER_LIST_CLASS}
                    />
                  </nav>
                ))}
              </div>
            )}
          </div>
        )}

        {hasBottomRow && (
          <div className={FOOTER_BOTTOM_CLASS}>
            {copyright && (
              <Typography role="caption" tone="muted">
                {copyright}
              </Typography>
            )}

            <div className={FOOTER_BOTTOM_LINKS_CLASS}>
              {legal && legal.length > 0 && (
                <nav aria-label="Legal">
                  <FooterLinkList
                    links={legal}
                    link={link}
                    className="flex flex-wrap items-center gap-4"
                  />
                </nav>
              )}
              {social && social.length > 0 && (
                <nav aria-label="Social">
                  <FooterLinkList
                    links={social}
                    link={link}
                    className={FOOTER_SOCIAL_ROW_CLASS}
                  />
                </nav>
              )}
            </div>
          </div>
        )}

        {children}
      </>
    );

    return (
      <Component
        ref={ref}
        className={cn(
          FOOTER_VARIANT_CLASS[resolved.variant],
          SPACE_PADDING_Y_CLASS[resolved.spacing],
          className,
        )}
        {...rest}>
        {resolved.contained ? (
          <Container size={resolved.containerSize}>{body}</Container>
        ) : (
          body
        )}
      </Component>
    );
  },
);

Footer.displayName = "Footer";
