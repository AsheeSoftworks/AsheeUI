import type { AnchorHTMLAttributes } from "react";

/**
 * A stand-in for a client-side router's link.
 *
 * The playground has no router, so it substitutes this component to prove that a
 * consumer's own link reaches every component that renders one. It keeps the
 * destination the library passes on the anchor, cancels the navigation the way a
 * router does, and marks the anchors it produced so the end-to-end test can tell
 * them apart from a plain anchor.
 *
 * The `href` is spelled out rather than only spread from the library, so the
 * element is a valid anchor whatever is passed to it: the marker and the click
 * handler are additions to a working link, not a replacement for one.
 *
 * @param props - Anchor attributes, including the `href` the library supplies.
 * @param props.href - Destination the library resolved for this link.
 * @param props.onClick - Handler the consumer supplied, if any.
 * @returns The anchor a router would render.
 */
export function AppLink({
  href = "/",
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      href={href}
      data-app-link="true"
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    />
  );
}
