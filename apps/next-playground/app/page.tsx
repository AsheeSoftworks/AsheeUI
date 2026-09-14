import NextLink from "next/link";
import { GalleryIsland } from "./gallery-island";

/**
 * The gallery page, a server component.
 *
 * It hands the gallery to its client island and adds markup of its own, so the
 * prerendered page proves that a server component and a client component compose
 * in one tree.
 *
 * @returns The page.
 */
export default function Home() {
  return (
    <>
      <GalleryIsland />
      <p className="px-6 pb-8">
        <NextLink href="/substitution" className="underline">
          See how a routing link and an image component are substituted
        </NextLink>
      </p>
    </>
  );
}
