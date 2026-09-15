/**
 * CopyButton component for AsheeUI.
 *
 * This file provides `CopyButton`, the framework's copy control: a button that
 * writes a value to the clipboard, reports success in its own label and
 * announces the result through a status region. It is built on the headless
 * {@link Clipboard} primitive, so the copy behaviour has one implementation.
 */

"use client";

import { forwardRef, type ReactNode } from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { CopyIcon } from "../../icons/CopyIcon";
import { useAsheeConfig } from "../../libs/context";
import { resolveCascade } from "../../utils/resolve-token";
import { Button, type ButtonProps } from "../button/Button";
import { Clipboard } from "./Clipboard";
import { FALLBACK_CLIPBOARD_CONFIG } from "./clipboard-config";
import { CLIPBOARD_STATUS_CLASS } from "./clipboard-styles";

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

  /** Icon shown before the copy. @default CopyIcon */
  copyIcon?: ReactNode;

  /** Icon shown after a successful copy. @default CheckIcon */
  copiedIcon?: ReactNode;
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
      timeout,
      onCopy,
      onError,
      copyIcon,
      copiedIcon,
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

    return (
      <Clipboard
        value={value}
        timeout={timeout}
        onCopy={onCopy}
        onError={onError}>
        {({ copied, copy }) => (
          <>
            <Button
              ref={ref}
              type="button"
              variant={rest.variant ?? sectionConfig?.variant ?? undefined}
              color={rest.color ?? sectionConfig?.color ?? undefined}
              size={rest.size ?? sectionConfig?.size ?? undefined}
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
              {copied
                ? (copiedAnnouncement ??
                  `${String(resolvedCopiedLabel)}: ${value}`)
                : ""}
            </span>
          </>
        )}
      </Clipboard>
    );
  },
);

CopyButton.displayName = "CopyButton";
