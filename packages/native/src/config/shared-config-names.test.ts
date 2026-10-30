/**
 * Tests for the shared spellings of the platform's fallbacks and defaults.
 *
 * The contract is one property: each shared name is the *same reference* as the
 * platform-suffixed constant it stands for. A copy would hold the same values today and
 * drift the first day one of them changed, and the drift would be invisible — the two names
 * would render differently depending on which module a component imported.
 */

import {
  defaultNativeAccordionConfig,
  FALLBACK_NATIVE_ACCORDION_CONFIG,
} from "../components/data-display/accordion/accordion-config";
import {
  defaultNativeButtonConfig,
  FALLBACK_NATIVE_BUTTON_CONFIG,
} from "../components/forms/button/button-config";
import {
  defaultNativeTextConfig,
  FALLBACK_NATIVE_TEXT_CONFIG,
} from "../components/typography/text/text-config";
import {
  defaultNativeGridConfig,
  FALLBACK_NATIVE_GRID_CONFIG,
} from "../layout/layout-config";
import {
  defaultAccordionConfig,
  defaultButtonConfig,
  defaultGridConfig,
  defaultTextConfig,
  FALLBACK_ACCORDION_CONFIG,
  FALLBACK_BUTTON_CONFIG,
  FALLBACK_GRID_CONFIG,
  FALLBACK_TEXT_CONFIG,
} from "./shared-config-names";

describe("the shared names for the platform's fallbacks", () => {
  it("is the same reference the platform-suffixed constant is", () => {
    expect(FALLBACK_BUTTON_CONFIG).toBe(FALLBACK_NATIVE_BUTTON_CONFIG);
    expect(FALLBACK_ACCORDION_CONFIG).toBe(FALLBACK_NATIVE_ACCORDION_CONFIG);
    expect(FALLBACK_GRID_CONFIG).toBe(FALLBACK_NATIVE_GRID_CONFIG);
    expect(FALLBACK_TEXT_CONFIG).toBe(FALLBACK_NATIVE_TEXT_CONFIG);
  });

  it("keeps the platform's registered defaults, under the shared name", () => {
    // The value is the platform's (`LAW-2`): a native button defaults to `lg` because a
    // thumb needs the room, where the web's `md` is sized for a pointer.
    expect(defaultButtonConfig).toBe(defaultNativeButtonConfig);
    expect(defaultButtonConfig.size).toBe("lg");
    expect(defaultAccordionConfig).toBe(defaultNativeAccordionConfig);
    expect(defaultGridConfig).toBe(defaultNativeGridConfig);
    expect(defaultTextConfig).toBe(defaultNativeTextConfig);
  });

  it("names the same list the web renderer names", () => {
    // The names are what a shared configuration or test writes; only the values are the
    // platform's. A shared file that imports `FALLBACK_BUTTON_CONFIG` compiles against
    // both renderers.
    expect(Object.keys(FALLBACK_BUTTON_CONFIG).sort()).toEqual([
      "color",
      "fullWidth",
      "radius",
      "size",
      "variant",
    ]);
  });
});
