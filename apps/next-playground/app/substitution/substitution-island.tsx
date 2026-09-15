"use client";

import { Avatar, Breadcrumb, Link } from "asheeui";
import NextImage from "next/image";
import NextLink from "next/link";

/**
 * The substitution page's island.
 *
 * Every AsheeUI component that renders a link or a picture accepts the
 * consumer's own component, which is how an application keeps its router's
 * navigation and its framework's image optimisation. The markers prove which
 * component produced each element.
 *
 * @returns The substitution examples.
 */
export function SubstitutionIsland() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <Breadcrumb
        items={[
          {
            id: "gallery",
            label: "Gallery",
            href: "/",
            component: NextLink,
            componentProps: { "data-next-link": "true" },
          },
          { id: "current", label: "Substitution" },
        ]}
      />

      <div className="flex items-center gap-4">
        <Link
          href="/"
          component={NextLink}
          componentProps={{ "data-next-link": "true" }}>
          Back to the gallery
        </Link>

        <Avatar
          name="Grace Hopper"
          src="/avatars/grace.png"
          component={NextImage}
          componentProps={{ "data-next-image": "true", width: 40, height: 40 }}
        />
      </div>
    </div>
  );
}
