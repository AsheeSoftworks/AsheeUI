/**
 * Stepper component for AsheeUI.
 *
 * This file provides the `Stepper` pattern: the reader's progress through a
 * sequence of steps, which a checkout, an onboarding flow and a wizard all
 * present. It composes the framework's typography and icon set, and it states
 * the sequence as an ordered list, so the steps are announced as a list and the
 * reader is told where they are rather than being left to infer it from colour.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { Typography } from "../typography/Typography";
import { FALLBACK_STEPPER_CONFIG, type StepperConfig } from "./stepper-config";
import {
  STEPPER_CONNECTOR_CLASS,
  STEPPER_DESCRIPTION_CLASS,
  STEPPER_ITEM_BUTTON_CLASS,
  STEPPER_ITEM_CLASS,
  STEPPER_LABEL_CLASS,
  STEPPER_LIST_CLASS,
  STEPPER_MARKER_CLASS,
  STEPPER_MARKER_SIZE_CLASS,
  STEPPER_MARKER_STATE_CLASS,
  STEPPER_STATE_TEXT_CLASS,
  type StepperStepState,
} from "./stepper-styles";

/**
 * One step of a stepper.
 */
export interface StepperStep {
  /**
   * Stable identifier of the step.
   */
  key: string;

  /**
   * Name of the step.
   */
  label: ReactNode;

  /**
   * What the step asks for, shown under the label when descriptions are on.
   */
  description?: ReactNode;
}

type BaseStepperProps = StepperConfig &
  Omit<HTMLAttributes<HTMLOListElement>, "color">;

/**
 * Props for the Stepper component.
 */
export interface StepperProps extends BaseStepperProps {
  /**
   * The steps, in order.
   */
  steps: StepperStep[];

  /**
   * Zero-based index of the step the reader is on.
   */
  currentStep: number;

  /**
   * Called with the index of the step a reader asked for.
   * Its presence is what makes the steps the reader has not reached yet
   * interactive; without it the stepper only reports progress.
   */
  onStepChange?: (index: number) => void;

  /**
   * Name of the list, for a page that has more than one.
   */
  label?: string;

  /**
   * Element to render.
   * Defaults to an `ol`, which is what makes the sequence a list.
   *
   * @default "ol"
   */
  as?: ElementType;
}

/**
 * The reader's progress through a sequence of steps.
 *
 * Each step reports its own state: the steps before the current one are
 * complete, the current one carries `aria-current="step"`, and the rest are
 * upcoming. The state is carried by the marker's colour and by text as well, so
 * the sequence does not depend on colour alone.
 *
 * The arrangement follows the breakpoint rather than a fixed choice: by default
 * the steps are a column on a narrow screen and a row from the `md` breakpoint,
 * which is the shape a checkout summary takes without a media query at each use.
 *
 * @param props - Stepper configuration options and list attributes.
 * @param props.steps - The steps, in order.
 * @param props.currentStep - Zero-based index of the current step.
 * @param props.onStepChange - Called with the index a reader asked for.
 * @param props.orientation - How the steps are arranged. Defaults to
 * "responsive".
 * @param props.size - Density of markers and labels. Defaults to "md".
 * @param props.showDescriptions - Show each step's description. Defaults to
 * true.
 * @param props.label - Name of the list, for a page with more than one.
 * @param props.as - Element to render. Defaults to "ol".
 * @returns The rendered stepper.
 *
 * @example
 * ```tsx
 * <Stepper
 *   currentStep={1}
 *   onStepChange={setStep}
 *   steps={[
 *     { key: "cart", label: "Cart" },
 *     { key: "address", label: "Address", description: "Where it ships" },
 *     { key: "payment", label: "Payment" },
 *   ]}
 * />
 * ```
 *
 * @see Tabs - Switching between panels rather than reporting progress.
 * @see Pagination - Moving through pages of a collection.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      onStepChange,
      label,
      orientation,
      size,
      showDescriptions,
      as,
      className,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      StepperConfig,
      Required<StepperConfig>
    >(
      { orientation, size, showDescriptions },
      config.components?.stepper,
      FALLBACK_STEPPER_CONFIG,
    );

    const Component: ElementType = as ?? "ol";

    return (
      <Component
        ref={ref}
        aria-label={label}
        className={cn(STEPPER_LIST_CLASS[resolved.orientation], className)}
        {...rest}>
        {steps.map((step, index) => {
          const state: StepperStepState =
            index < currentStep
              ? "complete"
              : index === currentStep
                ? "current"
                : "upcoming";

          const isReachable = Boolean(onStepChange) && state !== "current";
          const isLast = index === steps.length - 1;

          const content = (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  STEPPER_MARKER_CLASS,
                  STEPPER_MARKER_SIZE_CLASS[resolved.size],
                  STEPPER_MARKER_STATE_CLASS[state],
                )}>
                {state === "complete" ? (
                  <CheckIcon className="size-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="flex min-w-0 flex-col">
                <Typography
                  as="span"
                  role="label"
                  className={STEPPER_LABEL_CLASS[state]}>
                  {step.label}
                </Typography>
                {resolved.showDescriptions && step.description && (
                  <Typography
                    as="span"
                    role="caption"
                    className={STEPPER_DESCRIPTION_CLASS}>
                    {step.description}
                  </Typography>
                )}
              </span>
            </>
          );

          return (
            <li
              key={step.key}
              aria-current={state === "current" ? "step" : undefined}
              className={STEPPER_ITEM_CLASS}>
              {/* The state is stated in words as well, so a reader who cannot
                  see the marker is told what is done and where they are. */}
              <span className={STEPPER_STATE_TEXT_CLASS}>
                {state === "complete"
                  ? "Completed:"
                  : state === "current"
                    ? "Current step:"
                    : "Not started:"}
              </span>

              {isReachable ? (
                <button
                  type="button"
                  className={STEPPER_ITEM_BUTTON_CLASS}
                  onClick={() => onStepChange?.(index)}>
                  {content}
                </button>
              ) : (
                <span className="flex min-w-0 items-center gap-2">
                  {content}
                </span>
              )}

              {!isLast && (
                <span
                  aria-hidden="true"
                  className={STEPPER_CONNECTOR_CLASS[resolved.orientation]}
                />
              )}
            </li>
          );
        })}
      </Component>
    );
  },
);

Stepper.displayName = "Stepper";
