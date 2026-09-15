import { GalleryIsland } from "./gallery-island";
import { SubstitutionLink } from "./substitution-link";

/**
 * The gallery page, a server component.
 *
 * It renders client islands and authors no markup of its own. AsheeUI components
 * are client components, so a server component reaches them through an island
 * rather than by importing the framework itself: importing the package into a
 * server module is what the framework's client boundary forbids.
 *
 * @returns The page.
 */
export default function Home() {
  return (
    <>
      <GalleryIsland />
      <SubstitutionLink />
    </>
  );
}
