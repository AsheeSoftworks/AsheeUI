"use client";

/**
 * The web navigation blocks.
 *
 * A bar and a footer, with the navigation as data: link lists a non-developer can edit
 * and no application state. The bar's action region is the framework's own action
 * group, so a configured action renders exactly as a hand-written button does and
 * inherits the same cascade. The fields and the defaults come from `src/shared`.
 */

import { Footer, Navbar } from "@asheeui/web";
import { ActionGroup } from "@asheeui/web/section-kit";
import type {
  AsheeBlock,
  FooterBlockProps,
  NavbarBlockProps,
} from "../../shared";
import { FOOTER_SPEC, NAVBAR_SPEC, toAction } from "../../shared";

/**
 * The navigation bar of a page.
 */
export const navbarBlock: AsheeBlock<NavbarBlockProps> = {
  ...NAVBAR_SPEC,
  render: ({
    brand,
    brandHref,
    align,
    links,
    primaryAction,
    secondaryAction,
  }) => (
    <Navbar
      brand={brand || undefined}
      brandHref={brandHref || undefined}
      align={align ?? "center"}
      links={(links ?? []).map((link) => ({
        label: link.label ?? "",
        href: link.href,
      }))}
      actions={
        <ActionGroup
          primaryAction={toAction(primaryAction)}
          secondaryAction={toAction(secondaryAction)}
        />
      }
    />
  ),
};

/**
 * The footer of a page.
 */
export const footerBlock: AsheeBlock<FooterBlockProps> = {
  ...FOOTER_SPEC,
  render: ({ brand, description, groups, copyright }) => (
    <Footer
      brand={brand || undefined}
      description={description || undefined}
      copyright={copyright || undefined}
      groups={(groups ?? []).map((group, index) => ({
        id: index,
        title: group.title ?? "Links",
        links: (group.links ?? []).map((item) => ({
          label: item.label ?? "",
          href: item.href,
        })),
      }))}
    />
  ),
};
