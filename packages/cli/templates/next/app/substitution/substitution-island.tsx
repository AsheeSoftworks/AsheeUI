"use client";

import { Avatar, Breadcrumb, Container, HStack, Link, VStack } from "asheeui";
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
    <Container size="md">
      <VStack gap="2xl">
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

        <HStack gap="lg">
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
            componentProps={{
              "data-next-image": "true",
              width: 40,
              height: 40,
            }}
          />
        </HStack>
      </VStack>
    </Container>
  );
}
