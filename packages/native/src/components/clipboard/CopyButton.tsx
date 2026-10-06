/**
 * CopyButton component for the native package.
 *
 * This file provides `CopyButton`, the framework's copy control: a button that writes a
 * value to the clipboard, reports success in its own label and announces the result through
 * a status region. It is built on the headless {@link Clipboard} primitive, so the copy
 * behaviour has one implementation on each platform and only the dressing differs.
 *
 * The web control states its affordances as drawings in a `startContent` slot. This package
 * ships no icon set, so the affordances are characters and the button's own row lays them
 * out beside the label; a consumer who wants a drawing passes `copyIcon` or `copiedIcon` and
 * it takes the character's place. The accessible name is the label rather than the label
 * with a glyph in front of it, because a reader asked to press "Copy" should hear "Copy".
 */

import {
  NATIVE_ANNOUNCEMENT_LIVE_REGION,
  NATIVE_CLIPBOARD_COPIED_GLYPH,
  NATIVE_CLIPBOARD_COPY_GLYPH,
  NATIVE_CLIPBOARD_STATUS_CLASS,
  resolveCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { Button, type ButtonProps } from "../button/Button";
import { Text } from "../text/Text";
import { Clipboard } from "./Clipboard";
import { FALLBACK_NATIVE_CLIPBOARD_CONFIG } from "./clipboard-config";

type BaseCopyButtonProps = Omit<
  ButtonProps,
  "children" | "onPress" | "onCopy" | "isLoading"
>;

/**
 * Props for the CopyButton component.
 */
export interface CopyButtonProps extends BaseCopyButtonProps {
  /** Text written to the clipboard. */
  value: string;

  /** Name of the control. Defaults to `components.clipboard.label`. */
  label?: ReactNode;

  /** Name of the control once the text is copied. Defaults to
   * `components.clipboard.copiedLabel`. */
  copiedLabel?: ReactNode;

  /** Announcement made through the status region once the text is copied. */
  copiedAnnouncement?: string;

  /**
   * How long the copied state lasts, in milliseconds.
   * Defaults to `components.clipboard.timeout`.
   */
  timeout?: number;

  /** Called after a successful copy. */
  onCopy?: (text: string) => void;

  /** Called after a failed copy. */
  onError?: (error: unknown) => void;

  /** Affordance shown before the copy. @default the framework's copy glyph */
  copyIcon?: ReactNode;

  /** Affordance shown after a successful copy. @default the framework's tick */
  copiedIcon?: ReactNode;
}

/**
 * A button that copies a value to the clipboard.
 *
 * The control reports its result twice: the label changes to the copied wording, and a
 * status region announces the same thing, because a label change alone is not announced on
 * either platform. Focus stays on the button, so a reader can copy again immediately.
 *
 * @param props - CopyButton configuration options and button props.
 * @param props.value - Text written to the clipboard.
 * @param props.label - Name of the control before a copy.
 * @param props.copiedLabel - Name of the control after a copy.
 * @param props.copiedAnnouncement - Announcement made after a copy.
 * @param props.timeout - How long the copied state lasts.
 * @param props.onCopy - Called after a successful copy.
 * @param props.onError - Called after a failed copy.
 * @param props.copyIcon - Affordance shown before the copy.
 * @param props.copiedIcon - Affordance shown after a copy.
 * @returns The rendered control and its status region.
 *
 * @example
 * ```tsx
 * <CopyButton
 *   value="INV-1042"
 *   label="Copy invoice number"
 *   copiedAnnouncement="Invoice number copied"
 * />
 * ```
 *
 * @see Clipboard - The headless primitive, for a consumer's own control.
 */
export function CopyButton({
  value,
  label,
  copiedLabel,
  copiedAnnouncement,
  timeout,
  onCopy,
  onError,
  copyIcon,
  copiedIcon,
  ...rest
}: CopyButtonProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.clipboard;

  const resolvedLabel = resolveCascade<ReactNode>(
    label,
    sectionConfig?.label,
    undefined,
    FALLBACK_NATIVE_CLIPBOARD_CONFIG.label,
  );

  const resolvedCopiedLabel = resolveCascade<ReactNode>(
    copiedLabel,
    sectionConfig?.copiedLabel,
    undefined,
    FALLBACK_NATIVE_CLIPBOARD_CONFIG.copiedLabel,
  );

  return (
    <Clipboard
      value={value}
      timeout={timeout}
      onCopy={onCopy}
      onError={onError}>
      {({ copied, copy }) => {
        const wording = copied ? resolvedCopiedLabel : resolvedLabel;
        const affordance = copied
          ? (copiedIcon ?? NATIVE_CLIPBOARD_COPIED_GLYPH)
          : (copyIcon ?? NATIVE_CLIPBOARD_COPY_GLYPH);

        return (
          <>
            <Button
              variant={rest.variant ?? sectionConfig?.variant ?? undefined}
              color={rest.color ?? sectionConfig?.color ?? undefined}
              size={rest.size ?? sectionConfig?.size ?? undefined}
              // A worded label is the control's name; the glyph beside it is decoration, and
              // naming the control here is what keeps the glyph out of what a reader hears.
              // A label that is not text has no name to state, so the consumer names it.
              accessibilityLabel={
                typeof wording === "string" ? wording : rest.accessibilityLabel
              }
              onPress={() => {
                void copy();
              }}
              {...rest}>
              {typeof affordance === "string" ? (
                <Text>{affordance}</Text>
              ) : (
                affordance
              )}
              <Text>{wording}</Text>
            </Button>
            <Text
              accessibilityLiveRegion={NATIVE_ANNOUNCEMENT_LIVE_REGION.status}
              className={NATIVE_CLIPBOARD_STATUS_CLASS}
              testID="clipboard-status">
              {copied
                ? (copiedAnnouncement ??
                  `${String(resolvedCopiedLabel)}: ${value}`)
                : ""}
            </Text>
          </>
        );
      }}
    </Clipboard>
  );
}
