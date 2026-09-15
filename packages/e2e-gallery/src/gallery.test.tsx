/**
 * The gallery's own test.
 *
 * A playground's end-to-end test is only as good as the contract it asserts, so
 * this file proves both directions: the gallery satisfies every part of its
 * contract on the server and after hydration, and the contract reports a problem
 * when a section, a component or an interaction is broken. Without the second
 * half, a green playground would prove nothing.
 */

import { AsheeUIProvider } from "asheeui";
import { describe, expect, it } from "vitest";
import { Gallery } from "./index";
import {
  GALLERY_INTERACTIONS,
  gallerySectionIds,
  hydrateMarkup,
  inspectGallery,
  parseMarkup,
  renderServerMarkup,
  runGalleryInteractions,
} from "./testing";

/** The tree a playground renders, without any framework in it. */
function galleryTree() {
  return (
    <AsheeUIProvider config={{ defaultTheme: "light" }}>
      <Gallery />
    </AsheeUIProvider>
  );
}

describe("end-to-end gallery", () => {
  it("renders every section into the server markup", () => {
    const root = parseMarkup(renderServerMarkup(galleryTree()));
    const ids = gallerySectionIds();

    expect(ids.length).toBeGreaterThan(0);

    for (const id of ids) {
      expect(
        root.querySelector(`[data-gallery-section="${id}"]`),
        `section ${id}`,
      ).not.toBeNull();
    }

    expect(inspectGallery(root)).toEqual([]);
  });

  it("hydrates that markup and still satisfies the contract", () => {
    const result = hydrateMarkup(
      renderServerMarkup(galleryTree()),
      galleryTree(),
    );

    try {
      expect(result.errors).toEqual([]);
      expect(inspectGallery(result.container)).toEqual([]);
    } finally {
      result.unmount();
    }
  });

  it("performs the interactions a consumer would", async () => {
    const result = hydrateMarkup(
      renderServerMarkup(galleryTree()),
      galleryTree(),
    );

    try {
      expect(await runGalleryInteractions(result.container)).toEqual([]);
    } finally {
      result.unmount();
    }
  });

  it("reports a missing section instead of passing", () => {
    const root = parseMarkup(renderServerMarkup(galleryTree()));

    root.querySelector('[data-gallery-section="badges"]')?.remove();

    expect(
      inspectGallery(root).some((problem) =>
        problem.startsWith("badges: the section is missing"),
      ),
    ).toBe(true);
  });

  it("reports a broken component instead of passing", () => {
    const root = parseMarkup(renderServerMarkup(galleryTree()));

    root.querySelector('[data-gallery-section="chips"] button')?.remove();

    expect(
      inspectGallery(root).some((problem) => problem.startsWith("chips:")),
    ).toBe(true);
  });

  it("reports an interaction that no longer works instead of passing", async () => {
    const result = hydrateMarkup(
      renderServerMarkup(galleryTree()),
      galleryTree(),
    );

    try {
      for (const tab of result.container.querySelectorAll('[role="tab"]')) {
        tab.removeAttribute("role");
      }

      const tabs = GALLERY_INTERACTIONS.find(
        (interaction) => interaction.id === "tabs",
      );

      expect(tabs).toBeDefined();
      expect(await tabs?.run(result.container)).not.toEqual([]);
    } finally {
      result.unmount();
    }
  });
});
