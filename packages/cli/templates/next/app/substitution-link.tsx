"use client";

import { Container, Link, Typography } from "asheeui";
import NextLink from "next/link";

/**
 * The link to the substitution page, as a client island.
 *
 * The framework's `Link` takes the consumer's router link as a component, which
 * is the substitution API the page demonstrates, so the link is an AsheeUI link
 * with Next.js navigation rather than an anchor written by hand.
 *
 * @returns The rendered link.
 */
export function SubstitutionLink() {
  return (
    <Container>
      <Typography role="body-md">
        <Link
          href="/substitution"
          component={NextLink}
          componentProps={{ "data-next-link": "true" }}>
          See how a routing link and an image component are substituted
        </Link>
      </Typography>
    </Container>
  );
}
