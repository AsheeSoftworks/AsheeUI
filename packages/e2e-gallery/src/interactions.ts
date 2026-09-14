/**
 * Every interaction the gallery supports, and a runner that performs them all.
 *
 * A playground hydrates its server markup and then calls
 * {@link runGalleryInteractions}, which is what turns "the markup is correct"
 * into "the application works": the interactions fail if a framework's hydration
 * did not attach the behaviour it was supposed to.
 */

import { GALLERY_SECTIONS } from "./sections";
import type { GalleryInteraction } from "./types";

/** Every interaction a consumer performs in the gallery, in section order. */
export const GALLERY_INTERACTIONS: GalleryInteraction[] =
  GALLERY_SECTIONS.flatMap((section) =>
    section.interaction
      ? [{ id: section.id, ...section.interaction }]
      : [],
  );

/**
 * Performs every gallery interaction against a hydrated tree.
 *
 * @param container - The hydrated tree's container element.
 * @returns One description per problem; empty when every interaction behaved.
 */
export async function runGalleryInteractions(
  container: HTMLElement,
): Promise<string[]> {
  const problems: string[] = [];

  for (const interaction of GALLERY_INTERACTIONS) {
    const reported = await interaction.run(container);

    problems.push(
      ...reported.map((problem) => `${interaction.id} (${interaction.description}): ${problem}`),
    );
  }

  return problems;
}
