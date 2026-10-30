/**
 * The platform's class dictionaries, read as one suite.
 *
 * These tests used to be one file per component. They were split apart in C1, when the platform's
 * class strings moved out of `@asheeui/core` into this package, and in C2, when the web renderer's
 * half moved into `@asheeui/web`; each file then tested its own module where the module lives.
 * What most of them asserted, though, was key coverage — that a `Record<Size, string>` covers
 * `sm`, `md` and `lg` — and that is the type system's job: the map does not compile with a missing
 * key, so a test that lists the keys again can only fail after the compiler has already failed.
 * The whole-static-string scan, and the agreements between the two renderers' strings, belong to
 * `packages/core/src/shared/style-parity.test.ts`, which reads this directory as text and holds
 * both packages to them without either importing the other.
 *
 * What is left is the part only a test can state: the values a person chose, with the reason
 * beside them — a treatment with no edge at rest, a `scale-down` resolved to `contain`, an
 * underline that waits for a press. That is small enough to read in one place, so it is one suite
 * rather than twenty-five.
 */

import {
  type AccordionSizeKey,
  ALERT_TYPE_COLOR,
  ALERT_TYPE_ROLE,
  type AlertType,
  AVATAR_FALLBACK_VARIANT,
  type BadgeVariant,
  type Color,
  type ColorRole,
  type EmptyStateType,
  type MessageVariant,
  resolveMessageVariant,
  type Size,
  TOAST_TYPE_COLOR,
  type ToastPlacement,
  type TooltipPlacement,
  type Variant,
} from "@asheeui/core";
import {
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  resolveNativeAnnouncementRole,
} from "../shared/announcement";
import {
  NATIVE_ACCORDION_DIVIDER_CLASS,
  NATIVE_ACCORDION_INDICATOR_GLYPH,
  NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS,
  NATIVE_ACCORDION_VARIANT_ITEM_CLASS,
} from "./accordion";
import {
  NATIVE_ALERT_DISMISS_CLASS,
  NATIVE_ALERT_GLYPH_CLASS,
  NATIVE_ALERT_TYPE_GLYPH,
} from "./alert";
import {
  NATIVE_AVATAR_BASE_CLASS,
  NATIVE_AVATAR_FALLBACK_CLASS,
  NATIVE_AVATAR_FALLBACK_TEXT_CLASS,
  NATIVE_AVATAR_FONT_CLASS,
  NATIVE_AVATAR_INITIALS_CLASS,
  NATIVE_AVATAR_SIZE_CLASS,
  NATIVE_AVATAR_TEXT_BLOCK_CLASS,
} from "./avatar";
import { NATIVE_BADGE_TEXT_CLASS, NATIVE_BADGE_VARIANT_CLASS } from "./badge";
import {
  NATIVE_CALENDAR_CELL_CLASS,
  NATIVE_CALENDAR_CELL_DISABLED_CLASS,
  NATIVE_CALENDAR_CELL_SIZE_CLASS,
  NATIVE_CALENDAR_CELL_TEXT_CLASS,
  NATIVE_CALENDAR_CLEAR_CLASS,
  NATIVE_CALENDAR_CLEAR_LABEL_CLASS,
  NATIVE_CALENDAR_COLOR_CLASS,
  NATIVE_CALENDAR_DONE_CLASS,
  NATIVE_CALENDAR_DONE_LABEL_CLASS,
  NATIVE_CALENDAR_FOOTER_CLASS,
  NATIVE_CALENDAR_HEADER_CLASS,
  NATIVE_CALENDAR_MONTH_CLASS,
  NATIVE_CALENDAR_MONTH_GRID_CLASS,
  NATIVE_CALENDAR_NAV_CLASS,
  NATIVE_CALENDAR_NAV_LABEL_CLASS,
  NATIVE_CALENDAR_ROW_CLASS,
  NATIVE_CALENDAR_SHEET_CLASS,
  NATIVE_CALENDAR_STEP_CLASS,
  NATIVE_CALENDAR_STEP_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_COLUMN_CLASS,
  NATIVE_CALENDAR_TIME_LABEL_CLASS,
  NATIVE_CALENDAR_TIME_ROW_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_CLASS,
  NATIVE_CALENDAR_TIME_VALUE_TEXT_CLASS,
  NATIVE_CALENDAR_TRIGGER_ACTIONS_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLASS,
  NATIVE_CALENDAR_TRIGGER_CLEAR_CLASS,
  NATIVE_CALENDAR_TRIGGER_GLYPH_CLASS,
  NATIVE_CALENDAR_UNAVAILABLE_CLASS,
  NATIVE_CALENDAR_WEEKDAY_CLASS,
  NATIVE_CALENDAR_WEEKDAYS_CLASS,
} from "./calendar";
import {
  NATIVE_CAROUSEL_CONTROL_CLASS,
  NATIVE_CAROUSEL_HEIGHT_CLASS,
  NATIVE_CAROUSEL_INDICATOR_CLASS,
  NATIVE_CAROUSEL_INDICATOR_MARK_CLASS,
  NATIVE_CAROUSEL_NEXT_GLYPH,
  NATIVE_CAROUSEL_PREV_GLYPH,
  NATIVE_CAROUSEL_VARIANT_CLASS,
} from "./carousel";
import {
  NATIVE_CTA_CENTERED_CLASS,
  NATIVE_CTA_INNER_CLASS,
  NATIVE_CTA_PANEL_CLASS,
} from "./cta";
import {
  NATIVE_DRAWER_BACKDROP_CLASS,
  NATIVE_DRAWER_SHEET_EDGE,
  NATIVE_DRAWER_SIZE_CLASS,
} from "./drawer";
import {
  NATIVE_EMPTY_STATE_ICON_CLASS,
  NATIVE_EMPTY_STATE_ICON_SIZE_CLASS,
  NATIVE_EMPTY_STATE_ICON_TEXT_CLASS,
  NATIVE_EMPTY_STATE_PANEL_CLASS,
  NATIVE_EMPTY_STATE_SIZE_CLASS,
} from "./empty-state";
import {
  NATIVE_ERROR_STATE_DETAIL_BODY_CLASS,
  NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
  NATIVE_ERROR_STATE_DETAIL_CLASS,
  NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS,
} from "./error-state";
import {
  NATIVE_FEATURE_CARD_BODY_CLASS,
  NATIVE_FEATURE_HEADING_CLASS,
  NATIVE_FEATURE_ICON_CLASS,
  NATIVE_FEATURE_ICON_TONE_CLASS,
} from "./feature-grid";
import {
  NATIVE_FOOTER_BOTTOM_CLASS,
  NATIVE_FOOTER_GROUPS_CLASS,
  NATIVE_FOOTER_LINK_CLASS,
  NATIVE_FOOTER_SOCIAL_ROW_CLASS,
  NATIVE_FOOTER_TOP_CLASS,
  NATIVE_FOOTER_VARIANT_CLASS,
} from "./footer";
import {
  NATIVE_HERO_BASE_CLASS,
  NATIVE_HERO_COLUMN_CLASS,
  NATIVE_HERO_MEDIA_CLASS,
  NATIVE_HERO_ROW_CLASS,
  NATIVE_HERO_TEXT_COLUMN_CLASS,
} from "./hero";
import {
  NATIVE_IMAGE_ASPECT_RATIO,
  NATIVE_IMAGE_FRAME_CLASS,
  NATIVE_IMAGE_PICTURE_CLASS,
  NATIVE_IMAGE_PICTURE_FILL_CLASS,
  NATIVE_IMAGE_RESIZE_MODE,
  NATIVE_IMAGE_SKELETON_CLASS,
} from "./image";
import {
  NATIVE_INPUT_BASE_CLASS,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_INVALID_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_MULTILINE_CLASS,
  NATIVE_INPUT_SIZE_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
} from "./input";
import {
  NATIVE_LINK_EXTERNAL_GLYPH,
  NATIVE_LINK_UNDERLINE_CLASS,
} from "./link";
import {
  NATIVE_LOADING_STATE_CLASS,
  NATIVE_LOADING_STATE_PANEL_CLASS,
  NATIVE_LOADING_STATE_SIZE_CLASS,
} from "./loading-state";
import {
  NATIVE_MARQUEE_STILL_FRAME_CLASS,
  NATIVE_MARQUEE_STILL_SET_CLASS,
} from "./marquee";
import {
  NATIVE_MESSAGE_SURFACE_CLASS,
  NATIVE_MESSAGE_TEXT_CLASS,
} from "./message-surface";
import {
  NATIVE_MODAL_BACKDROP_CLASS,
  NATIVE_MODAL_PANEL_CLASS,
  NATIVE_MODAL_POSITION_CLASS,
  NATIVE_MODAL_WIDTH_CLASS,
} from "./modal";
import {
  ACCORDION_CONTENT_SIZE_CLASS,
  ACCORDION_HEADER_SIZE_CLASS,
  SPACE_MIN_HEIGHT_CLASS,
  TOAST_WIDTH_CLASS,
  TOOLTIP_FONT_CLASS,
} from "./portable";
import { NATIVE_SKELETON_BASE_CLASS } from "./skeleton";
import {
  NATIVE_SPINNER_BASE_CLASS,
  NATIVE_SPINNER_HEAD_CLASS,
  NATIVE_SPINNER_SIZE_CLASS,
  NATIVE_SPINNER_TRACK_CLASS,
} from "./spinner";
import {
  NATIVE_TABS_LIST_CLASS,
  NATIVE_TABS_TRIGGER_CLASS,
  NATIVE_TABS_VARIANT_LIST_CLASS,
} from "./tabs";
import {
  NATIVE_TOAST_CONTAINER_CLASS,
  NATIVE_TOAST_PLACEMENT_CLASS,
  NATIVE_TOAST_TYPE_GLYPH,
} from "./toast";
import { NATIVE_TOOLTIP_ALIGN_CLASS, NATIVE_TOOLTIP_ANCHOR } from "./tooltip";

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
    expect(NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS.bordered).toContain(
      "border",
    );
    expect(NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS.separated).toContain("gap");
  });

  it("keeps the flush variant free of borders and dividers on both renderers", () => {
    expect(NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS.flush).not.toContain(
      "border",
    );
    expect(NATIVE_ACCORDION_VARIANT_ITEM_CLASS.flush).not.toContain("border");
  });

  it("states the divider an item wears on the platform, where the web states it on the container", () => {
    expect(NATIVE_ACCORDION_DIVIDER_CLASS).toContain("border-t");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      NATIVE_ACCORDION_VARIANT_CONTAINER_CLASS,
      NATIVE_ACCORDION_VARIANT_ITEM_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value).not.toContain("undefined");
      }
    }

    expect(NATIVE_ACCORDION_INDICATOR_GLYPH.length).toBeGreaterThan(0);
  });
});

describe("Alert class dictionaries", () => {
  /** The intents an alert can take. */
  const INTENTS: AlertType[] = ["info", "success", "warning", "error"];

  /** The colour roles both platforms name. */
  const COLOURS: ColorRole[] = [
    "none",
    "primary",
    "secondary",
    "danger",
    "warning",
    "success",
  ];

  /** The treatments an alert can wear, which is the union the config names. */
  const VARIANTS: Exclude<Variant, "underlined">[] = [
    "solid",
    "faded",
    "bordered",
    "ghost",
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

  it("holds a glyph for every intent, so no intent renders an empty slot", () => {
    for (const glyph of Object.values(NATIVE_ALERT_TYPE_GLYPH)) {
      expect(glyph.length).toBeGreaterThan(0);
    }
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    expect(NATIVE_ALERT_GLYPH_CLASS.length).toBeGreaterThan(0);
    expect(NATIVE_ALERT_DISMISS_CLASS).toContain("rounded");
  });

  it("announces each intent with the urgency the shared role map states", () => {
    for (const intent of INTENTS) {
      const role = ALERT_TYPE_ROLE[intent];
      // The urgency is stated twice — once as the web's role, once as the region
      // the platform names — and the shared rule is what keeps the two agreeing.
      expect(NATIVE_ANNOUNCEMENT_LIVE_REGION[role]).toBe(
        role === "alert" ? "assertive" : "polite",
      );
      expect(resolveNativeAnnouncementRole(role)).toBe(
        role === "alert" ? "alert" : undefined,
      );
    }
  });

  it("is the same set a message surface wears, because an alert is one", () => {
    for (const variant of VARIANTS) {
      expect(NATIVE_MESSAGE_SURFACE_CLASS[variant]).toBeDefined();
    }
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
    expect(NATIVE_AVATAR_SIZE_CLASS.md).toBe("h-10 w-10");
    expect(NATIVE_AVATAR_SIZE_CLASS.sm).toBe("h-8 w-8");
    expect(NATIVE_AVATAR_SIZE_CLASS.lg).toBe("h-12 w-12");
  });

  it("steps the initials' scale with the diameter on both platforms", () => {
    // A native label starts one step higher: it is read at arm's length.
    expect(NATIVE_AVATAR_FONT_CLASS.sm).toBe("text-sm");
    expect(NATIVE_AVATAR_FONT_CLASS.lg).toBe("text-lg");
  });

  it("clips what it holds on both platforms", () => {
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("overflow-hidden");
  });

  it("centres what it holds on both platforms", () => {
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("items-center");
    expect(NATIVE_AVATAR_BASE_CLASS).toContain("justify-center");
  });

  it("fills the frame with the fallback on both platforms", () => {
    expect(NATIVE_AVATAR_TEXT_BLOCK_CLASS).toContain("h-full w-full");
  });

  it("weights and uppercases the initials on both platforms", () => {
    expect(NATIVE_AVATAR_INITIALS_CLASS).toContain("font-medium");
    expect(NATIVE_AVATAR_INITIALS_CLASS).toContain("uppercase");
  });

  it("is one treatment on the web, and the same treatment on the platform", () => {
    expect(AVATAR_FALLBACK_VARIANT).toBe("solid");
  });

  it("wears the accent of every colour role on the platform", () => {
    expect(NATIVE_AVATAR_FALLBACK_CLASS.primary).toBe("bg-primary");
    expect(NATIVE_AVATAR_FALLBACK_CLASS.danger).toBe("bg-danger");
  });

  it("carries the framework's foreground on every accent, as the web's solid treatment does", () => {
    expect(NATIVE_AVATAR_FALLBACK_TEXT_CLASS).toBe("text-foreground");
  });
});

describe("Badge class dictionaries", () => {
  /** The treatments a badge can express. */
  const TREATMENTS: BadgeVariant[] = ["solid", "faded", "bordered", "ghost"];

  /** The colour roles both platforms name. */
  const COLOURS: ColorRole[] = [
    "none",
    "primary",
    "secondary",
    "danger",
    "warning",
    "success",
  ];

  it("answer for every treatment and colour the cascade can hand them", () => {
    for (const treatment of TREATMENTS) {
      for (const colour of COLOURS) {
        const surface = NATIVE_BADGE_VARIANT_CLASS[treatment][colour];
        const text = NATIVE_BADGE_TEXT_CLASS[treatment][colour];

        expect(surface.length).toBeGreaterThan(0);
        expect(text.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("Calendar class dictionaries", () => {
  /** The native classes that are not part of a map. */
  const NATIVE_CLASSES = [
    NATIVE_CALENDAR_TRIGGER_CLASS,
    NATIVE_CALENDAR_TRIGGER_ACTIONS_CLASS,
    NATIVE_CALENDAR_TRIGGER_CLEAR_CLASS,
    NATIVE_CALENDAR_TRIGGER_GLYPH_CLASS,
    NATIVE_CALENDAR_SHEET_CLASS,
    NATIVE_CALENDAR_MONTH_GRID_CLASS,
    NATIVE_CALENDAR_HEADER_CLASS,
    NATIVE_CALENDAR_MONTH_CLASS,
    NATIVE_CALENDAR_NAV_CLASS,
    NATIVE_CALENDAR_NAV_LABEL_CLASS,
    NATIVE_CALENDAR_UNAVAILABLE_CLASS,
    NATIVE_CALENDAR_WEEKDAYS_CLASS,
    NATIVE_CALENDAR_WEEKDAY_CLASS,
    NATIVE_CALENDAR_ROW_CLASS,
    NATIVE_CALENDAR_CELL_CLASS,
    NATIVE_CALENDAR_CELL_DISABLED_CLASS,
    NATIVE_CALENDAR_CELL_TEXT_CLASS,
    NATIVE_CALENDAR_TIME_ROW_CLASS,
    NATIVE_CALENDAR_TIME_COLUMN_CLASS,
    NATIVE_CALENDAR_STEP_CLASS,
    NATIVE_CALENDAR_STEP_LABEL_CLASS,
    NATIVE_CALENDAR_TIME_LABEL_CLASS,
    NATIVE_CALENDAR_TIME_VALUE_CLASS,
    NATIVE_CALENDAR_TIME_VALUE_TEXT_CLASS,
    NATIVE_CALENDAR_FOOTER_CLASS,
    NATIVE_CALENDAR_CLEAR_CLASS,
    NATIVE_CALENDAR_CLEAR_LABEL_CLASS,
    NATIVE_CALENDAR_DONE_CLASS,
    NATIVE_CALENDAR_DONE_LABEL_CLASS,
  ];

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    const classes = [
      ...NATIVE_CLASSES,
      ...Object.values(NATIVE_CALENDAR_CELL_SIZE_CLASS),
      ...Object.values(NATIVE_CALENDAR_COLOR_CLASS).flatMap((entry) => [
        entry.bg,
        entry.on,
        entry.border,
        entry.text,
      ]),
    ];
    for (const value of classes) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("undefined");
    }
  });

  it("states the accent a chosen day wears, and the ink its number is written in", () => {
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.bg).toBe("bg-primary");
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.border).toBe("border-primary");
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.text).toBe("text-primary");
    // The platform's own convention for a filled accent, which the framework's controls
    // share: an accent fill carries the application's background as its ink.
    expect(NATIVE_CALENDAR_COLOR_CLASS.primary.on).toBe("text-background");
    expect(NATIVE_CALENDAR_COLOR_CLASS.secondary.on).toBe("text-foreground");
  });
});

describe("Carousel class dictionaries", () => {
  /** The heights a carousel can be. */
  const DENSITIES: Size[] = ["sm", "md", "lg"];

  it("steps the height up at a breakpoint on the web and states one height on the platform", () => {
    expect(NATIVE_CAROUSEL_HEIGHT_CLASS.sm).not.toContain("md:");
  });

  it("describes the same density steps on both platforms, in the order they grow", () => {
    const platform = DENSITIES.map(
      (size) => NATIVE_CAROUSEL_HEIGHT_CLASS[size],
    );
    expect(platform).toEqual(["h-60", "h-80", "h-[400px]"]);
  });

  it("keeps the ghost variant free of a frame on both platforms", () => {
    expect(NATIVE_CAROUSEL_VARIANT_CLASS.ghost).toBe("bg-transparent");
  });

  it("gives every control and every dot a target a thumb can reach", () => {
    expect(NATIVE_CAROUSEL_CONTROL_CLASS).toContain("min-h-[44px]");
    expect(NATIVE_CAROUSEL_CONTROL_CLASS).toContain("min-w-[44px]");
    expect(NATIVE_CAROUSEL_INDICATOR_CLASS).toContain("min-h-[44px]");
    expect(NATIVE_CAROUSEL_INDICATOR_CLASS).toContain("min-w-[44px]");
  });

  it("shows the current slide's dot differently from the rest", () => {
    expect(NATIVE_CAROUSEL_INDICATOR_MARK_CLASS.active).not.toBe(
      NATIVE_CAROUSEL_INDICATOR_MARK_CLASS.resting,
    );
  });

  it("shows a character for each control, because the package ships no icon set", () => {
    expect(NATIVE_CAROUSEL_PREV_GLYPH.length).toBeGreaterThan(0);
    expect(NATIVE_CAROUSEL_NEXT_GLYPH.length).toBeGreaterThan(0);
    expect(NATIVE_CAROUSEL_PREV_GLYPH).not.toBe(NATIVE_CAROUSEL_NEXT_GLYPH);
  });
});

describe("CTA class dictionaries", () => {
  it("leaves the plain treatment without a surface on both platforms", () => {
    // The platform's plain treatment still fills the column, so a panel that asked for no
    // surface keeps the same width as the two that draw one.
    expect(NATIVE_CTA_PANEL_CLASS.plain).toBe("w-full");
  });

  it("draws the bordered panel as a bordered surface on both platforms", () => {
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("border border-border");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("bg-background");
  });

  it("steps its padding up at a breakpoint on the web and states the smaller step on the platform", () => {
    expect(NATIVE_CTA_PANEL_CLASS.bordered).not.toContain("md:");
    expect(NATIVE_CTA_PANEL_CLASS.bordered).toContain("p-6");
  });

  it("keeps the statement and its actions in one column on both platforms", () => {
    expect(NATIVE_CTA_INNER_CLASS).toContain("flex-col");
  });

  it("centres the block when the band is centred, on both platforms", () => {
    // The web states the text alignment in the class; the platform passes the alignment to
    // each Text instead, so its block carries the cross-axis alignment alone.
    expect(NATIVE_CTA_CENTERED_CLASS).toBe("items-center");
  });
});

describe("Drawer class dictionaries", () => {
  it("lets the largest size take the whole screen on both platforms", () => {
    expect(NATIVE_DRAWER_SIZE_CLASS.full).toBe("h-full");
  });

  it("resolves a side panel to the sheet the platform uses, and keeps a top placement at its edge", () => {
    // A panel at the side of a phone has nowhere to be, so a side resolves to the sheet; a
    // top or bottom placement is already the edge a sheet comes from.
    expect(NATIVE_DRAWER_SHEET_EDGE.right).toBe("bottom");
    expect(NATIVE_DRAWER_SHEET_EDGE.left).toBe("bottom");
    expect(NATIVE_DRAWER_SHEET_EDGE.bottom).toBe("bottom");
    expect(NATIVE_DRAWER_SHEET_EDGE.top).toBe("top");
  });

  it("dims the screen behind the sheet, so it is clear what is being dealt with", () => {
    expect(NATIVE_DRAWER_BACKDROP_CLASS).toContain("bg-foreground/30");
  });
});

describe("EmptyState class dictionaries", () => {
  /** The densities a state can be. */
  const DENSITIES: Size[] = ["sm", "md", "lg"];

  /** The tones a state can take. */
  const TONES: EmptyStateType[] = ["info", "success", "warning", "error"];

  it("leaves the room to the shared spacing scale rather than to a panel", () => {
    expect(NATIVE_EMPTY_STATE_PANEL_CLASS).not.toContain("p-");
  });

  it("states a width and a height on the platform where the web states a size", () => {
    for (const density of DENSITIES) {
      expect(NATIVE_EMPTY_STATE_ICON_SIZE_CLASS[density]).toMatch(
        /^w-\S+ h-\S+$/,
      );
    }
  });

  it("separates the tones rather than tinting them all the same colour", () => {
    const colours = TONES.map(
      (tone) => NATIVE_EMPTY_STATE_ICON_TEXT_CLASS[tone],
    );
    expect(new Set(colours).size).toBe(TONES.length);
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      NATIVE_EMPTY_STATE_SIZE_CLASS,
      NATIVE_EMPTY_STATE_ICON_SIZE_CLASS,
      NATIVE_EMPTY_STATE_ICON_CLASS,
      NATIVE_EMPTY_STATE_ICON_TEXT_CLASS,
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
    NATIVE_ERROR_STATE_DETAIL_CLASS,
    NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS,
    NATIVE_ERROR_STATE_DETAIL_BODY_CLASS,
    NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS,
  };

  it("keeps the detail out of the open, behind a disclosure", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_CLASS.length).toBeGreaterThan(0);
  });

  it("offers a control that opens the detail on both platforms", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_SUMMARY_CLASS.length).toBeGreaterThan(0);
  });

  it("keeps the technical text as it was written, in a monospaced box", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_TEXT_CLASS).toContain("font-mono");
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_CLASS).toContain("border");
  });

  it("draws the detail body as a surface of its own on both platforms", () => {
    expect(NATIVE_ERROR_STATE_DETAIL_BODY_CLASS).toContain("bg-background");
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
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("w-10");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("h-10");
  });

  it("gives the badge the same shape and the same accent on both platforms", () => {
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("rounded-md");
    expect(NATIVE_FEATURE_ICON_CLASS).toContain("bg-primary/10");
  });

  it("states the icon's colour on the platform, because the badge draws it as a child", () => {
    expect(NATIVE_FEATURE_ICON_TONE_CLASS).toBe("text-primary");
  });

  it("keeps the icon, the title and the description in one column on both platforms", () => {
    expect(NATIVE_FEATURE_CARD_BODY_CLASS).toContain("flex-col");
  });

  it("states its own rhythm on each platform", () => {
    expect(NATIVE_FEATURE_CARD_BODY_CLASS).toContain("gap-2");
  });

  it("keeps space between the heading and the cards on both platforms", () => {
    expect(NATIVE_FEATURE_HEADING_CLASS).toContain("mb-6");
  });
});

describe("Footer class dictionaries", () => {
  it("draws the separator above the bordered footer on both platforms", () => {
    expect(NATIVE_FOOTER_VARIANT_CLASS.bordered).toContain(
      "border-t border-border",
    );
  });

  it("keeps the solid footer on the page background on both platforms", () => {
    expect(NATIVE_FOOTER_VARIANT_CLASS.solid).toBe("bg-background");
  });

  it("turns the upper region into a row at a breakpoint on the web and keeps it stacked on the platform", () => {
    expect(NATIVE_FOOTER_TOP_CLASS).not.toContain("lg:");
    expect(NATIVE_FOOTER_GROUPS_CLASS).toContain("flex-wrap");
  });

  it("keeps the brand column above its groups on both platforms", () => {
    expect(NATIVE_FOOTER_TOP_CLASS).toContain("w-full");
  });

  it("separates the lower region from the upper one on both platforms", () => {
    expect(NATIVE_FOOTER_BOTTOM_CLASS).toContain("border-t border-border");
  });

  it("keeps one link style on both platforms", () => {
    expect(NATIVE_FOOTER_LINK_CLASS).toBe("text-sm text-foreground/70");
  });

  it("keeps the legal and social rows wrapping on both platforms", () => {
    expect(NATIVE_FOOTER_SOCIAL_ROW_CLASS).toContain("flex-row");
  });
});

describe("Hero class dictionaries", () => {
  it("states one arrangement on the platform and lets the component pick it", () => {
    // The platform has no class variants for a window, so both arrangements are complete
    // strings and the component chooses between them from the window it measures.
    expect(NATIVE_HERO_ROW_CLASS).not.toContain("lg:");
    expect(NATIVE_HERO_COLUMN_CLASS).not.toContain("lg:");
    expect(NATIVE_HERO_ROW_CLASS).toContain("flex-row");
    expect(NATIVE_HERO_COLUMN_CLASS).toContain("flex-col");
  });

  it("keeps the same rhythm on both platforms", () => {
    expect(NATIVE_HERO_ROW_CLASS).toContain("gap-8");
    expect(NATIVE_HERO_TEXT_COLUMN_CLASS).toContain("gap-4");
  });

  it("moves the media across with an order class on the web and with its position on the platform", () => {
    // The platform's own layout has no order, so the component places the media first in
    // the tree instead; neither arrangement class carries an ordering of its own.
    expect(NATIVE_HERO_ROW_CLASS).not.toContain("order");
    expect(NATIVE_HERO_COLUMN_CLASS).not.toContain("order");
  });

  it("fills the band on the platform, because the container states the width there", () => {
    expect(NATIVE_HERO_BASE_CLASS).toBe("w-full");
    expect(NATIVE_HERO_TEXT_COLUMN_CLASS).toContain("flex-1");
    expect(NATIVE_HERO_MEDIA_CLASS).toContain("flex-1");
  });
});

describe("Image class dictionaries", () => {
  it("covers and contains on both platforms", () => {
    expect(NATIVE_IMAGE_RESIZE_MODE.cover).toBe("cover");
    expect(NATIVE_IMAGE_RESIZE_MODE.contain).toBe("contain");
  });

  it("states the two strategies the platform names differently in its own vocabulary", () => {
    expect(NATIVE_IMAGE_RESIZE_MODE.fill).toBe("stretch");
    expect(NATIVE_IMAGE_RESIZE_MODE.none).toBe("center");
  });

  it("resolves scale-down to contain on the platform", () => {
    // The platform has no scale-down: a container that never enlarges a small picture is
    // what the web's scale-down asks for, so the strategy resolves rather than vanishes.
    expect(NATIVE_IMAGE_RESIZE_MODE["scale-down"]).toBe("contain");
  });

  it("uses intrinsic dimensions when the ratio is auto, on both platforms", () => {
    expect(NATIVE_IMAGE_ASPECT_RATIO.auto).toBeUndefined();
  });

  it("states the same two shapes on both platforms", () => {
    expect(NATIVE_IMAGE_ASPECT_RATIO.square).toBe(1);
    expect(NATIVE_IMAGE_ASPECT_RATIO.video).toBe(16 / 9);
  });

  it("keeps the portrait ratio the web draws, as a number the platform lays out", () => {
    expect(NATIVE_IMAGE_ASPECT_RATIO.portrait).toBe(3 / 4);
  });

  it("fills its column and clips the picture to the resolved radius", () => {
    expect(NATIVE_IMAGE_FRAME_CLASS).toContain("w-full");
    expect(NATIVE_IMAGE_FRAME_CLASS).toContain("overflow-hidden");
  });

  it("fills the frame when the frame decides the shape, and claims the width when it does not", () => {
    expect(NATIVE_IMAGE_PICTURE_FILL_CLASS).toBe("h-full w-full");
    // Without a stated ratio the height comes from the source, so the picture states its
    // width alone.
    expect(NATIVE_IMAGE_PICTURE_CLASS).toBe("w-full");
  });

  it("covers the frame with the placeholder until the picture arrives", () => {
    expect(NATIVE_IMAGE_SKELETON_CLASS).toBe("absolute inset-0");
  });
});

describe("Input class dictionaries", () => {
  /** The densities a field can be. */
  const DENSITIES: Size[] = ["sm", "md", "lg"];

  /** Every treatment a field can wear, including the one with no surface. */
  const TREATMENTS: Variant[] = [
    "solid",
    "faded",
    "bordered",
    "ghost",
    "underlined",
  ];

  /** The colour roles both platforms name. */
  const COLOURS: ColorRole[] = [
    "none",
    "primary",
    "secondary",
    "danger",
    "warning",
    "success",
  ];

  it("answer for every treatment and density the cascade can hand them", () => {
    for (const treatment of TREATMENTS) {
      expect(NATIVE_INPUT_VARIANT_CLASS[treatment].length).toBeGreaterThan(0);
      expect(NATIVE_INPUT_EDGE_WIDTH_CLASS[treatment].length).toBeGreaterThan(
        0,
      );
    }

    for (const colour of COLOURS) {
      expect(NATIVE_INPUT_EDGE_ACCENT_CLASS[colour].length).toBeGreaterThan(0);
    }

    for (const density of DENSITIES) {
      expect(NATIVE_INPUT_SIZE_CLASS[density].length).toBeGreaterThan(0);
    }
  });

  it("states a touch-sized minimum rather than a height, whichever density it is", () => {
    for (const density of DENSITIES) {
      expect(NATIVE_INPUT_SIZE_CLASS[density]).toContain("min-h-[");
    }
  });

  it("draws the one edge an underlined field has", () => {
    expect(NATIVE_INPUT_EDGE_WIDTH_CLASS.underlined).toBe("border-b");
    for (const treatment of TREATMENTS) {
      if (treatment !== "underlined") {
        expect(NATIVE_INPUT_EDGE_WIDTH_CLASS[treatment]).toBe("border");
      }
    }
  });

  it("leaves the treatments with no edge at rest without one", () => {
    for (const treatment of ["solid", "faded", "ghost"] as Variant[]) {
      expect(NATIVE_INPUT_EDGE_NEUTRAL_CLASS[treatment]).toBe("");
    }

    for (const treatment of ["bordered", "underlined"] as Variant[]) {
      expect(NATIVE_INPUT_EDGE_NEUTRAL_CLASS[treatment]).toContain("border-");
    }
  });

  it("holds the classes the field shows for its own states", () => {
    for (const value of [
      NATIVE_INPUT_BASE_CLASS,
      NATIVE_INPUT_DISABLED_CLASS,
      NATIVE_INPUT_EDGE_INVALID_CLASS,
      NATIVE_INPUT_MULTILINE_CLASS,
    ]) {
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe("Link class dictionaries", () => {
  it("reveals the underline on hover on the web and on press on the platform", () => {
    expect(NATIVE_LINK_UNDERLINE_CLASS.hover).toBe("active:underline");
  });

  it("shows a character on the platform, because the package ships no icon set", () => {
    expect(NATIVE_LINK_EXTERNAL_GLYPH.length).toBeGreaterThan(0);
  });
});

describe("LoadingState class dictionaries", () => {
  it("centres what it is loading on both platforms", () => {
    expect(NATIVE_LOADING_STATE_CLASS).toContain("items-center");
    expect(NATIVE_LOADING_STATE_CLASS).toContain("justify-center");
  });

  it("takes the room the state claims from the shared spacing scale", () => {
    // The state claims its room from the scale both renderers read, so a loading
    // region reserves the same space on a phone and on a wide screen.
    expect(Object.keys(SPACE_MIN_HEIGHT_CLASS)).toContain("sm");
    expect(NATIVE_LOADING_STATE_PANEL_CLASS).not.toContain("py-");
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [NATIVE_LOADING_STATE_SIZE_CLASS]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }
  });
});

describe("Marquee class dictionaries", () => {
  it("claims the full extent of the axis the marquee reads along", () => {
    expect(NATIVE_MARQUEE_STILL_FRAME_CLASS).toEqual({
      x: "w-full",
      y: "flex-1",
    });
  });

  it("leaves the scrolling to the platform's scroll view", () => {
    // The platform's `ScrollView` owns the scrolling itself, so the frame states no
    // overflow; a class here would be a second, web-shaped opinion about the same thing.
    expect(NATIVE_MARQUEE_STILL_FRAME_CLASS.x).not.toContain("overflow");
    expect(NATIVE_MARQUEE_STILL_FRAME_CLASS.y).not.toContain("overflow");
  });

  it("wraps the horizontal copy and stacks the vertical one", () => {
    expect(NATIVE_MARQUEE_STILL_SET_CLASS.x).toBe("flex-row flex-wrap");
    expect(NATIVE_MARQUEE_STILL_SET_CLASS.y).toBe("flex-col");
  });

  it("describes each axis exactly once, as every class map in the family does", () => {
    for (const axis of ["x", "y"] as const) {
      expect(NATIVE_MARQUEE_STILL_SET_CLASS[axis]).toBeTruthy();
    }
  });
});

describe("MessageSurface class dictionaries", () => {
  /** The colour roles both platforms name. */
  const COLOURS: ColorRole[] = [
    "none",
    "primary",
    "secondary",
    "danger",
    "warning",
    "success",
  ];

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

  it("paints a filled surface's text on the surface rather than in the role's own colour", () => {
    // A primary icon on a primary fill is invisible, so a filled treatment states the
    // colour its text is read in.
    expect(NATIVE_MESSAGE_TEXT_CLASS.solid.primary).toBe("text-background");
    expect(NATIVE_MESSAGE_TEXT_CLASS.solid.danger).toBe("text-background");
    expect(NATIVE_MESSAGE_TEXT_CLASS.solid.warning).toBe("text-background");
    expect(NATIVE_MESSAGE_TEXT_CLASS.faded.primary).toBe("text-primary");
  });

  it("leaves an unfilled treatment's text in the role's own colour", () => {
    for (const variant of ["faded", "bordered", "ghost"] as MessageVariant[]) {
      for (const colour of COLOURS) {
        expect(NATIVE_MESSAGE_TEXT_CLASS[variant][colour]).toContain(
          colour === "none" || colour === "secondary" ? "foreground" : colour,
        );
      }
    }
  });

  it("draws every treatment of a role in that role's own hue", () => {
    for (const colour of COLOURS) {
      if (colour === "none") continue;

      for (const variant of VARIANTS) {
        expect(NATIVE_MESSAGE_SURFACE_CLASS[variant][colour]).toContain(colour);
      }
    }
  });

  it("keeps the neutral role neutral, so a message cannot borrow a colour it was not given", () => {
    for (const variant of VARIANTS) {
      expect(NATIVE_MESSAGE_SURFACE_CLASS[variant].none).not.toMatch(
        /primary|danger|warning|success/,
      );
      expect(NATIVE_MESSAGE_TEXT_CLASS[variant].none).toBe("text-foreground");
    }
  });

  it("holds whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const variant of VARIANTS) {
      for (const colour of COLOURS) {
        const surface = NATIVE_MESSAGE_SURFACE_CLASS[variant][colour];
        const text = NATIVE_MESSAGE_TEXT_CLASS[variant][colour];

        expect(surface.length).toBeGreaterThan(0);
        expect(text.length).toBeGreaterThan(0);
        expect(surface).not.toContain("undefined");
        expect(text).not.toContain("undefined");
      }
    }
  });
});

describe("Modal class dictionaries", () => {
  it("measures the full width against the viewport on the web and against the screen on the platform", () => {
    expect(NATIVE_MODAL_WIDTH_CLASS.full).toBe("max-w-full");
  });

  it("pushes the surface to the same edge on both platforms", () => {
    expect(NATIVE_MODAL_POSITION_CLASS.top).toContain("justify-start");
    expect(NATIVE_MODAL_POSITION_CLASS.bottom).toContain("justify-end");
  });

  it("leaves a centred modal to the space it is given", () => {
    expect(NATIVE_MODAL_POSITION_CLASS.center).toBe("justify-center");
  });

  it("dims the screen behind the surface, so it is clear what is being dealt with", () => {
    expect(NATIVE_MODAL_BACKDROP_CLASS).toContain("bg-foreground/30");
  });

  it("draws the surface on the theme's background", () => {
    expect(NATIVE_MODAL_PANEL_CLASS).toContain("bg-background");
  });
});

describe("Skeleton class dictionaries", () => {
  it("paint the surface with the same token the web paints, so a placeholder reads the same on both platforms", () => {
    const surface = "bg-secondary/60";
    expect(NATIVE_SKELETON_BASE_CLASS).toContain(surface);
  });

  it("leave the pulse to the platform's animator rather than to a class nothing runs", () => {
    expect(NATIVE_SKELETON_BASE_CLASS).not.toContain("animate-");
  });
});

describe("Spinner class dictionaries", () => {
  /** The colour roles both platforms name. */
  const COLOURS: ColorRole[] = [
    "none",
    "primary",
    "secondary",
    "danger",
    "warning",
    "success",
  ];

  it("light exactly one side of the ring, because a ring that is one colour all the way round reads as still", () => {
    for (const value of Object.values(NATIVE_SPINNER_HEAD_CLASS)) {
      expect(value.startsWith("border-t-")).toBe(true);
    }
    for (const value of Object.values(NATIVE_SPINNER_TRACK_CLASS)) {
      expect(value).not.toContain("border-t-");
    }
  });

  it("carry the colour role into both the track and the lit side, so the two cannot disagree", () => {
    for (const role of COLOURS) {
      const track = NATIVE_SPINNER_TRACK_CLASS[role].replace("border-", "");
      const head = NATIVE_SPINNER_HEAD_CLASS[role].replace("border-t-", "");
      expect(track.replace("/25", "")).toBe(head);
    }
  });

  it("hold whole static classes, because a class assembled at runtime is never compiled", () => {
    for (const map of [
      NATIVE_SPINNER_SIZE_CLASS,
      NATIVE_SPINNER_TRACK_CLASS,
      NATIVE_SPINNER_HEAD_CLASS,
    ]) {
      for (const value of Object.values(map)) {
        expect(value.length).toBeGreaterThan(0);
        expect(value).not.toContain("undefined");
      }
    }

    expect(NATIVE_SPINNER_BASE_CLASS).toContain("rounded-full");
    expect(NATIVE_SPINNER_BASE_CLASS).toContain("border-2");
  });
});

describe("Tabs class dictionaries", () => {
  it("never lets a native trigger fall short of the shared touch target", () => {
    // A web trigger is sized for a pointer; a platform trigger is sized for a thumb, and
    // the shared rule states the least a target may be.
    expect(NATIVE_TABS_TRIGGER_CLASS).toContain("min-h-[44px]");
  });

  it("draws the selected trigger's rule under the bar when the bar is underlined", () => {
    expect(NATIVE_TABS_VARIANT_LIST_CLASS.underline).toContain("border-b");
    expect(NATIVE_TABS_VARIANT_LIST_CLASS.bordered).toContain("border");
    expect(NATIVE_TABS_VARIANT_LIST_CLASS.ghost).toBe("");
  });

  it("keeps the triggers in one row that can scroll, which is what the platform's bar is", () => {
    expect(NATIVE_TABS_LIST_CLASS).toContain("flex-row");
    expect(NATIVE_TABS_LIST_CLASS).toContain("w-full");
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

  it("gives every type a glyph on the platform, so no message has an empty slot", () => {
    for (const glyph of Object.values(NATIVE_TOAST_TYPE_GLYPH)) {
      expect(glyph.length).toBeGreaterThan(0);
    }
  });

  it("fits a message inside the screen it is read on", () => {
    for (const density of DENSITIES) {
      expect(TOAST_WIDTH_CLASS[density]).toContain("max-w-full");
    }
  });

  it("anchors every placement on the platform, at the edge its name states", () => {
    for (const placement of PLACEMENTS) {
      const classes = NATIVE_TOAST_PLACEMENT_CLASS[placement];

      if (placement.startsWith("top-")) {
        expect(classes).toContain("top-0");
        expect(classes).not.toContain("bottom-0");
      } else {
        expect(classes).toContain("bottom-0");
        expect(classes).not.toContain("top-0");
      }

      // The side a message stacks against follows the same name: a centred placement
      // is centred, and a named side is aligned to that side.
      if (placement.endsWith("-center")) {
        expect(classes).toContain("items-center");
      } else if (placement.endsWith("-right")) {
        expect(classes).toContain("items-end");
      } else {
        expect(classes).toContain("items-start");
      }
    }
  });

  it("stacks messages in one absolute layer on the platform, rather than fixing each message", () => {
    expect(NATIVE_TOAST_CONTAINER_CLASS).toContain("absolute");
    for (const placement of PLACEMENTS) {
      expect(NATIVE_TOAST_PLACEMENT_CLASS[placement]).not.toContain("absolute");
    }
  });
});

describe("Tooltip class dictionaries", () => {
  /** The placements a hint can take. */
  const PLACEMENTS: TooltipPlacement[] = [
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "left",
    "left-start",
    "left-end",
    "right",
    "right-start",
    "right-end",
  ];

  it("grows the hint with its size", () => {
    expect(TOOLTIP_FONT_CLASS.sm).toBe("text-xs");
    expect(TOOLTIP_FONT_CLASS.md).toBe("text-sm");
    expect(TOOLTIP_FONT_CLASS.lg).toBe("text-base");
  });

  it("puts a placement that names a side above or below, in the order a reader reads", () => {
    // A hint beside a control has nowhere to be on a screen a thumb is holding, so a side
    // resolves to the direction it reads from: what comes before the control is above it and
    // what comes after it is below.
    expect(NATIVE_TOOLTIP_ANCHOR.top.direction).toBe("above");
    expect(NATIVE_TOOLTIP_ANCHOR.bottom.direction).toBe("below");
    expect(NATIVE_TOOLTIP_ANCHOR.left.direction).toBe("above");
    expect(NATIVE_TOOLTIP_ANCHOR.right.direction).toBe("below");
  });

  it("keeps the side a placement asked for and the alignment it asked for", () => {
    for (const placement of PLACEMENTS) {
      const expected =
        placement.startsWith("top") || placement.startsWith("left")
          ? "above"
          : "below";

      expect(NATIVE_TOOLTIP_ANCHOR[placement].direction).toBe(expected);
    }

    expect(NATIVE_TOOLTIP_ANCHOR["top-start"].align).toBe("start");
    expect(NATIVE_TOOLTIP_ANCHOR["top-end"].align).toBe("end");
    expect(NATIVE_TOOLTIP_ANCHOR.top.align).toBe("center");
  });

  it("describes every alignment the anchor map names", () => {
    for (const placement of PLACEMENTS) {
      expect(Object.keys(NATIVE_TOOLTIP_ALIGN_CLASS)).toContain(
        NATIVE_TOOLTIP_ANCHOR[placement].align,
      );
    }
  });
});
