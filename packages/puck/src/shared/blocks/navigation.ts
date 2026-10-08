/**
 * The navigation blocks, stated once for both renderers.
 *
 * A builder usually owns the header and the footer of a site once, at the page level,
 * so these blocks expose the framework's bar and footer with the navigation as data:
 * link lists a non-developer can edit, and no application state. The link lists are
 * described here, once, so the two platforms offer the same editor for them.
 */

import {
  ACTION_FIELDS,
  LINK_ITEM_FIELDS,
  selectField,
  textareaField,
  textField,
} from "../fields";
import type { AsheeArrayField, AsheeBlockSpec } from "../types";

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
 * The links of one column.
 */
const COLUMN_LINK_ARRAY: AsheeArrayField<LinkItemProps> = {
  type: "array",
  label: "Links",
  arrayFields: LINK_ITEM_FIELDS,
  defaultItemProps: { label: "New link", href: "/" },
  getItemSummary: (item) => item.label ?? "Link",
};

/**
 * The link list of the bar.
 */
const NAVBAR_LINK_ARRAY: AsheeArrayField<LinkItemProps> = COLUMN_LINK_ARRAY;

/**
 * The columns of the footer.
 */
const FOOTER_GROUP_ARRAY: AsheeArrayField<FooterGroupProps> = {
  type: "array",
  label: "Columns",
  arrayFields: {
    title: textField("Column title"),
    links: COLUMN_LINK_ARRAY,
  },
  defaultItemProps: { title: "New column", links: [] },
  getItemSummary: (item) => item.title ?? "Column",
};

/**
 * The props of the navigation bar block.
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
export const NAVBAR_SPEC: AsheeBlockSpec<NavbarBlockProps> = {
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
};

/**
 * The props of the footer block.
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
export const FOOTER_SPEC: AsheeBlockSpec<FooterBlockProps> = {
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
};
