/**
 * Navigation blocks for Puck.
 *
 * A builder usually owns the header and the footer of a site once, at the page
 * level, so these blocks expose the framework's `Navbar` and `Footer` with the
 * navigation as data: link lists a non-developer can edit, and no application
 * state.
 */

import type { ArrayField, ComponentConfig } from "@puckeditor/core";
import { Footer } from "../../components/footer/Footer";
import { Navbar } from "../../components/navbar/Navbar";
import { ActionGroup } from "../../components/section-kit/ActionGroup";
import type { Variant } from "../../shared";
import {
  ACTION_FIELDS,
  LINK_ITEM_FIELDS,
  selectField,
  textareaField,
  textField,
} from "../fields";

/**
 * One navigation link.
 */
export type LinkItemProps = {
  /** Visible name of the link. */
  label: string;

  /** Destination of the link. */
  href: string;
};

/**
 * One column of footer navigation.
 */
export type FooterGroupProps = {
  /** Title of the column. */
  title: string;

  /** The links in the column. */
  links: LinkItemProps[];
};

/**
 * The link list of the bar.
 */
const NAVBAR_LINK_ARRAY: ArrayField<LinkItemProps[]> = {
  type: "array",
  label: "Links",
  arrayFields: LINK_ITEM_FIELDS,
  defaultItemProps: { label: "New link", href: "/" },
  getItemSummary: (item) => item.label ?? "Link",
};

/**
 * The columns of the footer.
 */
const FOOTER_GROUP_ARRAY: ArrayField<FooterGroupProps[]> = {
  type: "array",
  label: "Columns",
  arrayFields: {
    title: textField("Column title"),
    links: {
      type: "array",
      label: "Links",
      arrayFields: LINK_ITEM_FIELDS,
      defaultItemProps: { label: "New link", href: "/" },
      getItemSummary: (item) => item.label ?? "Link",
    },
  },
  defaultItemProps: { title: "New column", links: [] },
  getItemSummary: (item) => item.title ?? "Column",
};

/**
 * Configuration of the navigation bar block.
 */
export type NavbarBlockProps = {
  /** Brand content, typically the product name. */
  brand?: string;

  /** Destination of the brand. */
  brandHref?: string;

  /** Where the links sit in the bar, from the `md` breakpoint upwards. */
  align?: "start" | "center" | "end";

  /** The navigation links. */
  links?: LinkItemProps[];

  /** The emphasised action of the bar. */
  primaryAction?: {
    label: string;
    href: string;
    variant: string;
  };

  /** The supporting action of the bar. */
  secondaryAction?: {
    label: string;
    href: string;
    variant: string;
  };
};

/**
 * The navigation bar of a page.
 */
export const navbarBlock: ComponentConfig<NavbarBlockProps> = {
  label: "Navbar",
  fields: {
    brand: textField("Brand", "Ashee"),
    brandHref: textField("Brand link", "/"),
    align: selectField("Link alignment", ["start", "center", "end"] as const),
    links: NAVBAR_LINK_ARRAY,
    primaryAction: ACTION_FIELDS,
    secondaryAction: ACTION_FIELDS,
  },
  defaultProps: {
    brand: "Ashee",
    brandHref: "/",
    align: "center",
    links: [
      { label: "Product", href: "/product" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
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
 * Configuration of the footer block.
 */
export type FooterBlockProps = {
  /** Brand content. */
  brand?: string;

  /** Short description under the brand. */
  description?: string;

  /** The navigation columns. */
  groups?: FooterGroupProps[];

  /** The copyright line. */
  copyright?: string;
};

/**
 * The footer of a page.
 */
export const footerBlock: ComponentConfig<FooterBlockProps> = {
  label: "Footer",
  fields: {
    brand: textField("Brand", "Ashee"),
    description: textareaField("Description"),
    groups: FOOTER_GROUP_ARRAY,
    copyright: textField("Copyright", "Ashee Softworks"),
  },
  defaultProps: {
    brand: "Ashee",
    description: "Campaign messaging for growing teams.",
    groups: [
      {
        title: "Product",
        links: [
          { label: "Campaigns", href: "/campaigns" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
    ],
    copyright: "Ashee Softworks",
  },
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

/**
 * Turn a builder action into a configured action.
 *
 * @param action - The action the builder holds.
 * @returns The action the framework renders, or undefined when it has no
 * wording, because an action without a name cannot be read or clicked.
 */
function toAction(
  action: { label?: string; href?: string; variant?: string } | undefined,
) {
  if (!action?.label) {
    return undefined;
  }

  return {
    label: action.label,
    href: action.href,
    variant: action.variant as Variant | undefined,
  };
}
