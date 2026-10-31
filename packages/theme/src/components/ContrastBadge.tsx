/**
 * A contrast verdict for one pair of colours.
 *
 * The editor uses this on the palette's own pairs — foreground on background, and primary on the
 * fixed ink that sits over a solid fill — so a reader can see an unreadable theme before saving
 * it. It is a hint, not a gate: a theme with a low ratio is allowed.
 */

import { contrastLevel, contrastRatio } from "@asheeui/core";
import { Badge } from "asheeui";

export interface ContrastBadgeProps {
  /** The text or foreground colour. */
  foreground: string;

  /** The surface colour. */
  background: string;

  /** An optional name for the pair, e.g. "Body text". */
  label?: string;
}

/**
 * Show the WCAG ratio and level for two colours.
 *
 * @param props - The pair and its optional label.
 * @returns A badge, or a muted note when either colour is not portable.
 */
export function ContrastBadge({
  foreground,
  background,
  label,
}: ContrastBadgeProps) {
  const ratio = contrastRatio(foreground, background);

  if (ratio === undefined) {
    return (
      <Badge color="danger" variant="faded" size="sm">
        {label ? `${label}: not a portable colour` : "Not a portable colour"}
      </Badge>
    );
  }

  const level = contrastLevel(ratio);
  const tone = level === "fail" ? "danger" : level === "AA" ? "warning" : "success";
  const text = `${ratio.toFixed(1)}:1 · ${level === "fail" ? "fails AA" : level}`;

  return (
    <Badge color={tone} variant="bordered" size="sm">
      {label ? `${label} ${text}` : text}
    </Badge>
  );
}
