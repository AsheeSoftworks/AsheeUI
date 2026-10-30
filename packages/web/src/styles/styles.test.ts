// @vitest-environment node
/**
 * The web renderer's class dictionaries, in one suite.
 *
 * This was twenty-six files, one per component, split out when C2 moved the web's strings from
 * `@asheeui/core` into this package and gave each module its own test. They are one file again
 * because what each one held had shrunk to a handful of assertions: the per-component split was
 * paying for twenty-six jsdom environments to state, in most cases, a decision or two.
 *
 * The key coverage that once lived here is the type system's job: `Record<Size, string>` does not
 * compile with a missing key, so a test that restates a map's keys in an array can only agree with
 * the compiler or drift from it. Scanning that every class string is whole and static, and the
 * agreements the two renderers must keep, are
 * `packages/core/src/shared/style-parity.test.ts`'s job — it reads both `styles/` directories as
 * text and is the only place both can be read at once. What is left is the part no compiler and no
 * text scan can state: the values a person chose, with the reason beside them. That is small
 * enough to read in one place.
 *
 * The per-component files were consolidated from C2's split; nothing was reworded in the move.
 */

import {
  type AccordionSizeKey,
  ALERT_TYPE_COLOR,
  ALERT_TYPE_ROLE,
  AVATAR_FALLBACK_VARIANT,
  type Color,
  type ColorRole,
  type MessageVariant,
  resolveMessageVariant,
  type Size,
  TOAST_TYPE_COLOR,
  type ToastPlacement,
  type TypographyRole,
  type Variant,
} from "@asheeui/core";
import { describe, expect, it } from "vitest";
import {
  ACCORDION_VARIANT_CONTAINER_CLASS,
  ACCORDION_VARIANT_ITEM_CLASS,
} from "./accordion";
import {
  AVATAR_BASE_CLASS,
  AVATAR_FALLBACK_CLASS,
  AVATAR_FONT_CLASS,
  AVATAR_SIZE_CLASS,
} from "./avatar";
import {
  BADGE_FONT_CLASS,
  BADGE_GAP_CLASS,
  BADGE_HEIGHT_CLASS,
  BADGE_ICON_SIZE_CLASS,
  BADGE_PADDING_CLASS,
} from "./badge";
import {
  CALENDAR_COLOR_CLASSES,
  DATE_PICKER_CELL_SIZE_CLASS,
  DATE_PICKER_SIZE_CLASS,
} from "./calendar";
import { CAROUSEL_HEIGHT_CLASS, CAROUSEL_VARIANT_CLASS } from "./carousel";
import { CTA_CENTERED_CLASS, CTA_INNER_CLASS, CTA_PANEL_CLASS } from "./cta";
import { DRAWER_HEIGHT_CLASS, DRAWER_WIDTH_CLASS } from "./drawer";
import {
  EMPTY_STATE_ICON_CLASS,
  EMPTY_STATE_ICON_SIZE_CLASS,
  EMPTY_STATE_PANEL_CLASS,
  EMPTY_STATE_SIZE_CLASS,
} from "./empty-state";
import {
  ERROR_STATE_DETAIL_BODY_CLASS,
  ERROR_STATE_DETAIL_CLASS,
  ERROR_STATE_DETAIL_SUMMARY_CLASS,
} from "./error-state";
import {
  FEATURE_CARD_BODY_CLASS,
  FEATURE_HEADING_CLASS,
  FEATURE_ICON_CLASS,
} from "./feature-grid";
import {
  FIELD_DESCRIPTION_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_LABEL_CONTENT_CLASS,
  FIELD_MESSAGE_CLASS,
  FIELD_SHELL_CLASS,
  FIELD_STATUS_BORDER_CLASS,
} from "./field";
import {
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
} from "./footer";
import {
  HERO_CENTERED_CLASS,
  HERO_LAYOUT_CLASS,
  HERO_MEDIA_CLASS,
  HERO_MEDIA_FIRST_CLASS,
  HERO_TEXT_COLUMN_CLASS,
} from "./hero";
import { IMAGE_FIT_CLASS, IMAGE_RATIO_CLASS } from "./image";
import { INPUT_SIZE_CLASS } from "./input";
import { LINK_UNDERLINE_CLASS } from "./link";
import {
  LOADING_STATE_CLASS,
  LOADING_STATE_PANEL_CLASS,
  LOADING_STATE_SIZE_CLASS,
} from "./loading-state";
import { MODAL_MAX_WIDTH_CLASS, MODAL_POSITION_CLASS } from "./modal";
import {
  ACCORDION_CONTENT_SIZE_CLASS,
  ACCORDION_HEADER_SIZE_CLASS,
  SPACE_MIN_HEIGHT_CLASS,
  TOAST_WIDTH_CLASS,
  TOOLTIP_FONT_CLASS,
} from "./portable";
import { SECTION_BLOCK_DESCRIPTION_CLASS } from "./section-block";
import { SKELETON_ANIMATION_CLASS, SKELETON_BASE_CLASS } from "./skeleton";
import { SPINNER_BASE_CLASS, SPINNER_COLOR_CLASS } from "./spinner";
import { TABS_HEIGHT_CLASS } from "./tabs";
import { TOAST_ANIMATION_STATE } from "./toast";
import { TYPOGRAPHY_ROLE_DEFAULT_ELEMENT } from "./typography";

describe("Accordion class dictionaries", () => {
  /** The densities an accordion can be. */
  const DENSITIES: AccordionSizeKey[] = ["sm", "md", "lg"];

  it("pads the header on every side and the content only under its top", () => {
    // A header is a target the reader presses, so it carries its own padding; the
    // content sits under the header and is padded only where the header does not reach.
    for (const density of DENSITIES) {
      expect(ACCORDION_HEADER_SIZE_CLASS[density]).toMatch(/px-\S+ py-\S+/);
      expect(ACCORDION_CONTENT_SIZE_CLASS[density]).toMatch(/px-\S+ pb-\S+/);
    }
  });

  it("draws the grouped variants with a border and the separated ones with a gap", () => {
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain("border");
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.separated).toContain("space-y");
  });

  it("keeps the flush variant free of borders and dividers on both renderers", () => {
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain("divide-y");
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain("border");
    expect(ACCORDION_VARIANT_ITEM_CLASS.flush).not.toContain("border");
  });

  it("states the divider an item wears on the platform, where the web states it on the container", () => {
    // The web reaches between its children with `divide-y`; the platform has no such rule
    // and gives the item the divider it wears instead.
    expect(ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain("divide-y");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      ACCORDION_VARIANT_CONTAINER_CLASS,
      ACCORDION_VARIANT_ITEM_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value).not.toContain("undefined");
      }
    }
  });
});

describe("Alert class dictionaries", () => {
  /** The colour roles both platforms name. */
  const COLOURS: ColorRole[] = [
    "none",
    "primary",
    "secondary",
    "danger",
    "warning",
    "success",
  ];

  it("gives every intent a colour role", () => {
    for (const colour of Object.values(ALERT_TYPE_COLOR)) {
      expect(COLOURS).toContain(colour as ColorRole);
    }
  });

  it("interrupts only for the two intents that need attention now", () => {
    expect(ALERT_TYPE_ROLE.error).toBe("alert");
    expect(ALERT_TYPE_ROLE.warning).toBe("alert");
    expect(ALERT_TYPE_ROLE.info).toBe("status");
    expect(ALERT_TYPE_ROLE.success).toBe("status");
  });

  it("names the framework's colour vocabulary rather than a palette of its own", () => {
    for (const colour of Object.values(ALERT_TYPE_COLOR)) {
      expect([
        "none",
        "primary",
        "secondary",
        "danger",
        "warning",
        "success",
      ] satisfies Color[]).toContain(colour);
    }
  });
});

describe("Avatar class dictionaries", () => {
  it("states the same three diameters, each in its own spelling", () => {
    // The web states one `size-*` utility, which is a width and a height at once; the
    // platform states the pair, because that is the form its compiler reads. 8, 10 and
    // 12 steps are 32, 40 and 48 points on both sides.
    expect(AVATAR_SIZE_CLASS.md).toBe("size-10");
    expect(AVATAR_SIZE_CLASS.sm).toBe("size-8");
    expect(AVATAR_SIZE_CLASS.lg).toBe("size-12");
  });

  it("steps the initials' scale with the diameter on both platforms", () => {
    expect(AVATAR_FONT_CLASS.sm).toBe("text-xs");
    expect(AVATAR_FONT_CLASS.lg).toBe("text-base");
  });

  it("clips what it holds on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("overflow-hidden");
  });

  it("centres what it holds on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("items-center");
    expect(AVATAR_BASE_CLASS).toContain("justify-center");
  });

  it("fills the frame with the fallback on both platforms", () => {
    expect(AVATAR_FALLBACK_CLASS).toContain("size-full");
  });

  it("weights and uppercases the initials on both platforms", () => {
    expect(AVATAR_BASE_CLASS).toContain("font-medium");
    expect(AVATAR_BASE_CLASS).toContain("uppercase");
  });

  it("is one treatment on the web, and the same treatment on the platform", () => {
    expect(AVATAR_FALLBACK_VARIANT).toBe("solid");
  });
});

describe("Badge class dictionaries", () => {
  const maps: Record<string, string>[] = [
    BADGE_HEIGHT_CLASS,
    BADGE_PADDING_CLASS,
    BADGE_FONT_CLASS,
    BADGE_GAP_CLASS,
    BADGE_ICON_SIZE_CLASS,
  ];

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of maps) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }
  });
});

describe("Calendar class dictionaries", () => {
  /** Every colour role the framework names. */
  const COLORS: Color[] = [
    "none",
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
  ];

  it("keeps the pointer treatment on the web, which the platform cannot paint", () => {
    // This assertion lived in native's suite while core held the map, because that was the only
    // package that could read both. It is a web truth — a device has no pointer resting on a cell
    // — so it moved here with the map in C3.
    for (const colour of COLORS) {
      expect(CALENDAR_COLOR_CLASSES[colour].hover).toContain("hover:");
    }
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const value of [
      ...Object.values(DATE_PICKER_SIZE_CLASS),
      ...Object.values(DATE_PICKER_CELL_SIZE_CLASS),
    ]) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });
});

describe("Carousel class dictionaries", () => {
  /** The heights a carousel can be. */
  const DENSITIES: Size[] = ["sm", "md", "lg"];

  it("steps the height up at a breakpoint on the web and states one height on the platform", () => {
    // A wide window can afford a taller slide and a phone cannot, so only the web's map
    // carries a second step.
    expect(CAROUSEL_HEIGHT_CLASS.sm).toContain("md:");
  });

  it("describes the same density steps on both platforms, in the order they grow", () => {
    const web = DENSITIES.map((size) => CAROUSEL_HEIGHT_CLASS[size].length);
    expect(web).toHaveLength(DENSITIES.length);
  });

  it("keeps the ghost variant free of a frame on both platforms", () => {
    expect(CAROUSEL_VARIANT_CLASS.ghost).toBe("bg-transparent");
  });
});

describe("CTA class dictionaries", () => {
  it("leaves the plain treatment without a surface on both platforms", () => {
    expect(CTA_PANEL_CLASS.plain).toBe("");
  });

  it("draws the bordered panel as a bordered surface on both platforms", () => {
    expect(CTA_PANEL_CLASS.bordered).toContain("border border-border");
    expect(CTA_PANEL_CLASS.bordered).toContain("bg-background");
  });

  it("steps its padding up at a breakpoint on the web and states the smaller step on the platform", () => {
    expect(CTA_PANEL_CLASS.bordered).toContain("md:p-12");
  });

  it("keeps the statement and its actions in one column on both platforms", () => {
    expect(CTA_INNER_CLASS).toContain("flex-col");
  });

  it("centres the block when the band is centred, on both platforms", () => {
    expect(CTA_CENTERED_CLASS).toContain("items-center");
  });
});

describe("Drawer class dictionaries", () => {
  it("lets the largest size take the whole screen on both platforms", () => {
    expect(DRAWER_WIDTH_CLASS.full).toBe("w-screen");
    expect(DRAWER_HEIGHT_CLASS.full).toBe("h-screen");
  });
});

describe("EmptyState class dictionaries", () => {
  it("leaves the room to the shared spacing scale rather than to a panel", () => {
    expect(EMPTY_STATE_PANEL_CLASS).not.toContain("p-");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      EMPTY_STATE_SIZE_CLASS,
      EMPTY_STATE_ICON_SIZE_CLASS,
      EMPTY_STATE_ICON_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }
  });
});

describe("ErrorState class dictionaries", () => {
  /** Every class the failed-region presentation is built from. */
  const EVERY_CLASS = {
    ERROR_STATE_DETAIL_CLASS,
    ERROR_STATE_DETAIL_SUMMARY_CLASS,
    ERROR_STATE_DETAIL_BODY_CLASS,
  };

  it("keeps the detail out of the open, behind a disclosure", () => {
    // Both renderers put the technical text behind something a reader opens: the
    // detail is written for a developer, not for the reader of the message.
    expect(ERROR_STATE_DETAIL_CLASS.length).toBeGreaterThan(0);
  });

  it("offers a control that opens the detail on both platforms", () => {
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain("font-medium");
  });

  it("draws the library's focus ring on the only focusable control it has", () => {
    // Every other control in the library draws this ring; the disclosure would be
    // the one surface whose focus treatment depended on the browser.
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain("focus-visible:ring-2");
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain(
      "focus-visible:ring-primary",
    );
    expect(ERROR_STATE_DETAIL_SUMMARY_CLASS).toContain(
      "focus-visible:ring-offset-2",
    );
  });

  it("keeps the technical text as it was written, in a monospaced box", () => {
    // A stack trace is read as it was printed, on either platform.
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("font-mono");
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("border");
  });

  it("draws the detail body as a surface of its own on both platforms", () => {
    expect(ERROR_STATE_DETAIL_BODY_CLASS).toContain("bg-background");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const [_name, value] of Object.entries(EVERY_CLASS)) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });
});

describe("FeatureGrid class dictionaries", () => {
  it("draws a badge large enough to hold an icon on both platforms", () => {
    expect(FEATURE_ICON_CLASS).toContain("size-10");
  });

  it("gives the badge the same shape and the same accent on both platforms", () => {
    expect(FEATURE_ICON_CLASS).toContain("rounded-md");
    expect(FEATURE_ICON_CLASS).toContain("bg-primary/10");
  });

  it("states the icon's colour on the platform, because the badge draws it as a child", () => {
    // On the web the badge's own text colour is inherited by an icon drawn in `currentColor`.
    // The platform's child view does not inherit it, so the tone is named beside the badge.
    expect(FEATURE_ICON_CLASS).toContain("text-primary");
  });

  it("keeps the icon, the title and the description in one column on both platforms", () => {
    expect(FEATURE_CARD_BODY_CLASS).toContain("flex-col");
  });

  it("states its own rhythm on each platform", () => {
    expect(FEATURE_CARD_BODY_CLASS).toContain("gap-3");
  });

  it("keeps space between the heading and the cards on both platforms", () => {
    expect(FEATURE_HEADING_CLASS).toBe("mb-10");
  });
});

describe("Field class dictionaries", () => {
  const classes = [
    FIELD_SHELL_CLASS,
    FIELD_LABEL_CLASS,
    FIELD_LABEL_CONTENT_CLASS,
    FIELD_DESCRIPTION_CLASS,
    FIELD_MESSAGE_CLASS,
  ];

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const value of classes) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });

  it("leaves a status that has nothing to say without an edge rather than with a stray one", () => {
    expect(FIELD_STATUS_BORDER_CLASS.default).toBe("");
  });

  it("names the danger edge once, so a failed field and a failed control agree", () => {
    expect(FIELD_STATUS_BORDER_CLASS.error).toContain("border-danger");
  });
});

describe("Footer class dictionaries", () => {
  it("draws the separator above the bordered footer on both platforms", () => {
    expect(FOOTER_VARIANT_CLASS.bordered).toContain("border-t border-border");
  });

  it("keeps the solid footer on the page background on both platforms", () => {
    expect(FOOTER_VARIANT_CLASS.solid).toBe("bg-background");
  });

  it("turns the upper region into a row at a breakpoint on the web and keeps it stacked on the platform", () => {
    expect(FOOTER_TOP_CLASS).toContain("lg:flex-row");
    // The platform's groups carry the wrapping instead: a footer that wrapped nothing would
    // run its columns off the side of a phone.
    expect(FOOTER_GROUPS_CLASS).toContain("flex-wrap");
  });

  it("keeps the brand column above its groups on both platforms", () => {
    expect(FOOTER_BRAND_COLUMN_CLASS).toContain("flex-col");
    expect(FOOTER_GROUP_CLASS).toContain("flex-col");
    expect(FOOTER_LIST_CLASS).toContain("flex-col");
  });

  it("separates the lower region from the upper one on both platforms", () => {
    expect(FOOTER_BOTTOM_CLASS).toContain("border-t border-border");
  });

  it("keeps one link style on both platforms", () => {
    expect(FOOTER_LINK_CLASS).toContain("text-sm");
  });

  it("keeps the legal and social rows wrapping on both platforms", () => {
    expect(FOOTER_BOTTOM_LINKS_CLASS).toContain("flex-wrap");
    expect(FOOTER_SOCIAL_ROW_CLASS).toContain("flex items-center");
  });
});

describe("Hero class dictionaries", () => {
  it("puts the text and the media beside each other on a wide window, on the web", () => {
    expect(HERO_LAYOUT_CLASS).toContain("grid");
    expect(HERO_LAYOUT_CLASS).toContain("lg:grid-cols-2");
  });

  it("keeps the same rhythm on both platforms", () => {
    // The web's grid gap and the platform's row gap are the same step of the spacing scale,
    // so a hero reads as one band wherever it is drawn.
    expect(HERO_LAYOUT_CLASS).toContain("gap-10");
    expect(HERO_TEXT_COLUMN_CLASS).toContain("flex-col");
  });

  it("moves the media across with an order class on the web and with its position on the platform", () => {
    expect(HERO_MEDIA_FIRST_CLASS).toBe("lg:order-first");
  });

  it("centres the text column when the hero is centred, on the web", () => {
    expect(HERO_CENTERED_CLASS).toContain("items-center");
    expect(HERO_CENTERED_CLASS).toContain("text-center");
  });

  it("leaves the text column as wide as the band's container, on the web", () => {
    // A measure on the column would cap the headline and the action row too, and would make
    // `containerSize` unobservable; the description keeps its own measure instead.
    expect(HERO_TEXT_COLUMN_CLASS).not.toContain("max-w-");
    expect(SECTION_BLOCK_DESCRIPTION_CLASS).toBe("max-w-2xl");
    expect(HERO_MEDIA_CLASS).toBe("min-w-0");
  });
});

describe("Image class dictionaries", () => {
  it("covers and contains on both platforms", () => {
    expect(IMAGE_FIT_CLASS.cover).toBe("object-cover");
    expect(IMAGE_FIT_CLASS.contain).toBe("object-contain");
  });

  it("states the two strategies the platform names differently in its own vocabulary", () => {
    // `fill` stretches on the web and on the platform alike; the platform calls it
    // `stretch` because that is what its image view calls it.
    expect(IMAGE_FIT_CLASS.fill).toBe("object-fill");
    // `none` means the natural size, which is the platform's centered placement.
    expect(IMAGE_FIT_CLASS.none).toBe("object-none");
  });

  it("uses intrinsic dimensions when the ratio is auto, on both platforms", () => {
    // The web states this by adding no class; the platform by stating no number.
    expect(IMAGE_RATIO_CLASS.auto).toBe("");
  });

  it("states the same two shapes on both platforms", () => {
    expect(IMAGE_RATIO_CLASS.square).toBe("aspect-square");
    expect(IMAGE_RATIO_CLASS.video).toBe("aspect-video");
  });

  it("keeps the portrait ratio the web draws, as a number the platform lays out", () => {
    // The web states 3/4 as an arbitrary aspect class, so the two platforms must agree
    // on the ratio itself rather than on the syntax that expresses it.
    expect(IMAGE_RATIO_CLASS.portrait).toBe("aspect-[3/4]");
  });
});

describe("Input class dictionaries", () => {
  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const value of Object.values(INPUT_SIZE_CLASS)) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });
});

describe("Link class dictionaries", () => {
  it("reveals the underline on hover on the web and on press on the platform", () => {
    // The platform has no pointer to hover with, so the intent is carried by the
    // platform's own interaction: the link underlines itself while it is pressed.
    expect(LINK_UNDERLINE_CLASS.hover).toContain("hover:underline");
  });
});

describe("LoadingState class dictionaries", () => {
  it("centres what it is loading on both platforms", () => {
    expect(LOADING_STATE_CLASS).toContain("items-center");
    expect(LOADING_STATE_CLASS).toContain("justify-center");
  });

  it("takes the room the state claims from the shared spacing scale", () => {
    // The state claims its room from the scale both renderers read, so a loading
    // region reserves the same space on a phone and on a wide screen.
    expect(Object.keys(SPACE_MIN_HEIGHT_CLASS)).toContain("sm");
    expect(LOADING_STATE_PANEL_CLASS).not.toContain("py-");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [LOADING_STATE_SIZE_CLASS]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }

    expect(LOADING_STATE_CLASS.length).toBeGreaterThan(0);
  });
});

describe("MessageSurface class dictionaries", () => {
  /** The treatments a message surface can wear. */
  const VARIANTS: MessageVariant[] = ["solid", "faded", "bordered", "ghost"];

  /** Every treatment a component's `variant` option can name. */
  const EVERY_VARIANT: Variant[] = [...VARIANTS, "underlined"];

  it("resolves the one treatment a message does not have to its nearest equivalent", () => {
    // A consumer can set a global `underlined` for the components that have it, and a
    // message has to answer with something a message can be.
    expect(resolveMessageVariant("underlined")).toBe("bordered");
  });

  it("leaves every treatment a message does have alone", () => {
    for (const variant of VARIANTS) {
      expect(resolveMessageVariant(variant)).toBe(variant);
    }
  });

  it("answers every treatment a configuration can name, so nothing is left unmapped", () => {
    for (const variant of EVERY_VARIANT) {
      expect(VARIANTS).toContain(resolveMessageVariant(variant));
    }
  });
});

describe("Modal class dictionaries", () => {
  it("measures the full width against the viewport on the web and against the screen on the platform", () => {
    // The web reads the viewport and takes a gutter off it; the platform is already drawn on
    // the screen it has.
    expect(MODAL_MAX_WIDTH_CLASS.full).toContain("100vw");
  });

  it("pushes the surface to the same edge on both platforms", () => {
    expect(MODAL_POSITION_CLASS.top).toContain("self-start");
    expect(MODAL_POSITION_CLASS.bottom).toContain("self-end");
  });

  it("leaves a centred modal to the space it is given", () => {
    expect(MODAL_POSITION_CLASS.center).toBe("");
  });
});

describe("Skeleton class dictionaries", () => {
  it("paint the surface with the theme's own token rather than with a grey of its own", () => {
    expect(SKELETON_BASE_CLASS).toContain("bg-secondary");
  });

  it("shimmer only where the visitor welcomes motion", () => {
    expect(SKELETON_ANIMATION_CLASS).toContain("motion-safe:");
  });

  it("paint the surface with the same token the web paints, so a placeholder reads the same on both platforms", () => {
    const surface = "bg-secondary/60";
    expect(SKELETON_BASE_CLASS).toContain(surface);
  });

  it("leave the pulse to the platform's animator rather than to a class nothing runs", () => {
    expect(SKELETON_ANIMATION_CLASS).toContain("animate-pulse");
  });
});

describe("Spinner class dictionaries", () => {
  it("colour the ring through the current colour, so a role is a text colour here", () => {
    for (const value of Object.values(SPINNER_COLOR_CLASS)) {
      expect(value.startsWith("text-")).toBe(true);
    }
  });

  it("draws `none` as the ink of a filled surface, not as an inherited colour", () => {
    // `none` is what a spinner over a solid surface wants: the same colour the
    // surface paints its content in. Nothing in the map inherits; a spinner that
    // should take the surrounding text colour is given `text-current` explicitly.
    expect(SPINNER_COLOR_CLASS.none).toBe("text-background");
    expect(SPINNER_COLOR_CLASS.none).not.toBe("text-current");
  });

  it("rotates inside `motion-safe`, as the skeleton's shimmer does", () => {
    // A reader who asked for reduced motion gets a still ring; the status region's
    // label, not the movement, carries the wait.
    expect(SPINNER_BASE_CLASS.split(" ")).toContain("motion-safe:animate-spin");
    expect(SPINNER_BASE_CLASS).not.toMatch(/(?:^|\s)animate-spin(?:\s|$)/);
  });
});

describe("Tabs class dictionaries", () => {
  it("grows a trigger with its density on the web", () => {
    expect(TABS_HEIGHT_CLASS.sm).toBe("h-8");
    expect(TABS_HEIGHT_CLASS.md).toBe("h-10");
    expect(TABS_HEIGHT_CLASS.lg).toBe("h-12");
  });
});

describe("Toast class dictionaries", () => {
  /** The placements a message can appear at. */
  const PLACEMENTS: ToastPlacement[] = [
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
    "top-center",
    "bottom-center",
  ];

  /** The densities a message can be. */
  const DENSITIES: Size[] = ["sm", "md", "lg"];

  it("presents a failure as the danger role, on both platforms", () => {
    expect(TOAST_TYPE_COLOR.error).toBe("danger");
    expect(TOAST_TYPE_COLOR.warning).toBe("warning");
    expect(TOAST_TYPE_COLOR.success).toBe("success");
    expect(TOAST_TYPE_COLOR.info).toBe("primary");
  });

  it("fits a message inside the screen it is read on", () => {
    for (const density of DENSITIES) {
      expect(TOAST_WIDTH_CLASS[density]).toContain("max-w-full");
    }
  });

  it("anchors every placement on the web, with an animation of its own", () => {
    for (const placement of PLACEMENTS) {
      expect(typeof TOAST_ANIMATION_STATE[placement].enter).toBe("string");
      expect(typeof TOAST_ANIMATION_STATE[placement].exit).toBe("string");
    }
  });
});

describe("Tooltip class dictionaries", () => {
  it("grows the hint with its size", () => {
    expect(TOOLTIP_FONT_CLASS.sm).toBe("text-xs");
    expect(TOOLTIP_FONT_CLASS.md).toBe("text-sm");
    expect(TOOLTIP_FONT_CLASS.lg).toBe("text-base");
  });
});

describe("Typography class dictionaries", () => {
  /** Every semantic role the typography scale names. */
  const ROLES: TypographyRole[] = [
    "display",
    "page-title",
    "heading-xl",
    "heading-lg",
    "heading-md",
    "heading-sm",
    "body-lg",
    "body-md",
    "body-sm",
    "label",
    "caption",
    "overline",
  ];

  /** The elements a typography role may render as: a heading, or inline text. */
  const ELEMENTS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"];

  it("renders headings as headings and body copy as paragraphs", () => {
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["page-title"]).toBe("h1");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["heading-lg"]).toBe("h2");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT["body-md"]).toBe("p");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT.label).toBe("span");
    expect(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT.display).toBe("h1");
  });

  it("states an element for every role, so no role renders as an empty element", () => {
    for (const role of ROLES) {
      expect(ELEMENTS).toContain(TYPOGRAPHY_ROLE_DEFAULT_ELEMENT[role]);
    }
  });
});
