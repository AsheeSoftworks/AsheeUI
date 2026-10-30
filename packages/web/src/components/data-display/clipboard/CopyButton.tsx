/**
 * CopyButton component for AsheeUI.
 *
 * This file provides `CopyButton`, the framework's copy control: a button that
 * writes a value to the clipboard, reports success in its own label and
 * announces the result through a status region. It is built on the headless
 * {@link Clipboard} primitive, so the copy behaviour has one implementation.
 */

"use client";

import { type Radius, resolveCascade } from "@asheeui/core";
import { forwardRef, type ReactNode } from "react";
import { CheckIcon } from "../../../icons/CheckIcon";
import { CopyIcon } from "../../../icons/CopyIcon";
import { useAsheeConfig } from "../../../libs/context";
import { CLIPBOARD_STATUS_CLASS } from "../../../styles/clipboard";
import { Button, type ButtonProps } from "../../forms/button/Button";
import { Clipboard } from "./Clipboard";
import { FALLBACK_CLIPBOARD_CONFIG } from "./clipboard-config";

type BaseCopyButtonProps = Omit<
  ButtonProps,
  | "children"
  | "startContent"
  | "endContent"
  | "onClick"
  | "onCopy"
  | "isLoading"
>;

/**
 * Props for the CopyButton component.
 */
export interface CopyButtonProps extends BaseCopyButtonProps {
  /** Text written to the clipboard. */
  value: string;

  /** Name of the control. Defaults to `components.clipboard.label`. */
  label?: ReactNode | undefined;

  /** Name of the control once the text is copied. Defaults to
   * `components.clipboard.copiedLabel`. */
  copiedLabel?: ReactNode | undefined;

  /** Announcement made through the status region once the text is copied. */
  copiedAnnouncement?: string | undefined;

  /**
   * Announcement made through the status region when the copy fails.
   * Without it the region says which control failed — `Copy failed` by default.
   */
  errorAnnouncement?: string | undefined;

  /**
   * How long the copied state lasts, in milliseconds.
   * Defaults to `components.clipboard.timeout`.
   */
  timeout?: number | undefined;

  /** Called after a successful copy. */
  onCopy?: ((text: string) => void) | undefined;

  /** Called after a failed copy. */
  onError?: ((error: unknown) => void) | undefined;

  /** Icon shown before the copy. @default CopyIcon */
  copyIcon?: ReactNode | undefined;

  /** Icon shown after a successful copy. @default CheckIcon */
  copiedIcon?: ReactNode | undefined;
}

/**
 * A button that copies a value to the clipboard.
 *
 * The control reports its result twice: the label changes to the copied wording
 * and a status region announces the same thing, because a label change alone is
 * not announced by a screen reader. Focus stays on the button, so a reader can
 * copy again immediately.
 *
 * @param props - CopyButton configuration options and button props.
 * @param props.value - Text written to the clipboard.
 * @param props.label - Name of the control before a copy.
 * @param props.copiedLabel - Name of the control after a copy.
 * @param props.copiedAnnouncement - Announcement made after a copy.
 * @param props.errorAnnouncement - Announcement made after a failed copy.
 * @param props.timeout - How long the copied state lasts.
 * @param props.onCopy - Called after a successful copy.
 * @param props.onError - Called after a failed copy.
 * @param props.copyIcon - Icon shown before the copy.
 * @param props.copiedIcon - Icon shown after a copy.
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
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      label,
      copiedLabel,
      copiedAnnouncement,
      errorAnnouncement,
      timeout,
      onCopy,
      onError,
      copyIcon,
      copiedIcon,
      radius,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.clipboard;

    const resolvedLabel = resolveCascade<ReactNode>(
      label,
      sectionConfig?.label,
      undefined,
      FALLBACK_CLIPBOARD_CONFIG.label,
    );

    const resolvedCopiedLabel = resolveCascade<ReactNode>(
      copiedLabel,
      sectionConfig?.copiedLabel,
      undefined,
      FALLBACK_CLIPBOARD_CONFIG.copiedLabel,
    );

    // The rounding used to be Button's alone, so `components.clipboard.radius`
    // was declared, registered and never read. It resolves here like the rest of
    // the section, and the application's `defaultRadius` — which Button also
    // reads — stays the tier below it, so an unconfigured control rounds exactly
    // as it did before.
    const resolvedRadius = resolveCascade<Radius>(
      radius,
      sectionConfig?.radius,
      config.defaultRadius,
      FALLBACK_CLIPBOARD_CONFIG.radius,
    );

    return (
      <Clipboard
        value={value}
        timeout={timeout}
        onCopy={onCopy}
        onError={onError}>
        {({ copied, error, copy }) => {
          // The region reports both outcomes: a failed copy is a change of state
          // the reader is not otherwise told about, since the label stays put.
          let announcement = "";
          if (copied) {
            announcement =
              copiedAnnouncement ?? `${String(resolvedCopiedLabel)}: ${value}`;
          } else if (error) {
            announcement =
              errorAnnouncement ?? `${String(resolvedLabel)} failed`;
          }

          return (
            <>
              <Button
                ref={ref}
                type="button"
                variant={rest.variant ?? sectionConfig?.variant ?? undefined}
                color={rest.color ?? sectionConfig?.color ?? undefined}
                size={rest.size ?? sectionConfig?.size ?? undefined}
                radius={resolvedRadius}
                startContent={
                  copied
                    ? (copiedIcon ?? <CheckIcon />)
                    : (copyIcon ?? <CopyIcon />)
                }
                onClick={() => {
                  void copy();
                }}
                {...rest}>
                {copied ? resolvedCopiedLabel : resolvedLabel}
              </Button>
              <span
                role="status"
                aria-live="polite"
                className={CLIPBOARD_STATUS_CLASS}
                data-copied={copied ? "true" : undefined}>
                {announcement}
              </span>
            </>
          );
        }}
      </Clipboard>
    );
  },
);

CopyButton.displayName = "CopyButton";
