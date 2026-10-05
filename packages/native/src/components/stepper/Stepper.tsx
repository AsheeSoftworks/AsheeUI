/**
 * Stepper component for the native package.
 *
 * The component satisfies the framework's stepper contract: the same steps, the same current
 * step, the same change handler and the same three states as the web stepper. Three things are
 * deliberately native rather than portable:
 *
 * 1. `responsive` is answered with the column, because the platform has no breakpoints and a
 *    phone is narrow.
 * 2. A step's state is read from the control's own accessible state, instead of from text a
 *    screen reader would have to reach beside it.
 * 3. The steps are pressable controls when the consumer can move between them, and plain rows
 *    when it cannot, because a control that does nothing is worse than no control.
 */

import {
  NATIVE_STEPPER_CONNECTOR_CLASS,
  NATIVE_STEPPER_DESCRIPTION_CLASS,
  NATIVE_STEPPER_ITEM_CLASS,
  NATIVE_STEPPER_LABEL_CLASS,
  NATIVE_STEPPER_LIST_CLASS,
  NATIVE_STEPPER_MARKER_CLASS,
  NATIVE_STEPPER_MARKER_FONT_CLASS,
  NATIVE_STEPPER_MARKER_SIZE_CLASS,
  NATIVE_STEPPER_MARKER_STATE_CLASS,
  NATIVE_STEPPER_MARKER_TEXT_CLASS,
  NATIVE_STEPPER_TEXT_CLASS,
  resolveCascade,
  type Size,
  type StepperOrientation,
  type StepperStepState,
} from "@asheeui/core";
import { Fragment } from "react";
import { Pressable, View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Text } from "../text/Text";
import {
  FALLBACK_NATIVE_STEPPER_CONFIG,
  type NativeStepperConfig,
} from "./stepper-config";

/**
 * One step of a sequence.
 *
 * The label and the description are strings here, because a native step's text is text.
 */
export interface StepperStep {
  /** The step's stable key. */
  key: string;

  /** The step's name. */
  label: string;

  /** What the step involves. */
  description?: string;
}

/**
 * Props for the native Stepper.
 */
export interface StepperProps extends NativeStepperConfig {
  /** The steps, in order. */
  steps: readonly StepperStep[];

  /** The index of the step the reader is on. */
  currentStep: number;

  /** Called with the index of a step the reader moved to. */
  onStepChange?: (index: number) => void;

  /** The sequence's name, so a reader knows what the steps are steps of. */
  label?: string;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Identifier prefix for the steps, so a test can reach one. */
  testID?: string;
}

/**
 * The state a step is in, relative to the current one.
 *
 * @param index - The step's position.
 * @param currentStep - The position the reader is on.
 * @returns The step's state.
 */
function stepState(index: number, currentStep: number): StepperStepState {
  if (index < currentStep) return "complete";
  if (index === currentStep) return "current";
  return "upcoming";
}

/**
 * An ordered sequence of steps.
 *
 * @param props - The steps, the current one and what to do when it changes.
 * @param props.steps - The steps, in order.
 * @param props.currentStep - The index the reader is on.
 * @param props.onStepChange - Called with the index a reader moved to.
 * @param props.label - The sequence's name.
 * @returns The rendered sequence.
 *
 * @example
 * ```tsx
 * <Stepper
 *   label="Checkout"
 *   currentStep={1}
 *   onStepChange={setStep}
 *   steps={[
 *     { key: "cart", label: "Cart" },
 *     { key: "pay", label: "Payment", description: "Card details" },
 *   ]}
 * />
 * ```
 *
 * @see Form - The fields a step usually holds.
 */
export function Stepper({
  steps,
  currentStep,
  onStepChange,
  label,
  orientation,
  size,
  showDescriptions,
  className,
  testID,
}: StepperProps) {
  const config = useAsheeNativeConfig();
  const sectionConfig = config.components.stepper;

  const resolvedOrientation = resolveCascade<StepperOrientation>(
    orientation,
    sectionConfig?.orientation,
    undefined,
    FALLBACK_NATIVE_STEPPER_CONFIG.orientation,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_STEPPER_CONFIG.size,
  );
  const resolvedShowDescriptions = resolveCascade<boolean>(
    showDescriptions,
    sectionConfig?.showDescriptions,
    undefined,
    FALLBACK_NATIVE_STEPPER_CONFIG.showDescriptions,
  );

  return (
    <View
      accessibilityLabel={label}
      className={classNames(
        NATIVE_STEPPER_LIST_CLASS[resolvedOrientation],
        className,
      )}>
      {steps.map((step, index) => {
        const state = stepState(index, currentStep);
        const marker = (
          <View
            className={classNames(
              NATIVE_STEPPER_MARKER_CLASS,
              NATIVE_STEPPER_MARKER_SIZE_CLASS[resolvedSize],
              NATIVE_STEPPER_MARKER_STATE_CLASS[state],
            )}>
            <Text
              role="label"
              className={classNames(
                NATIVE_STEPPER_MARKER_FONT_CLASS[resolvedSize],
                NATIVE_STEPPER_MARKER_TEXT_CLASS[state],
              )}>
              {state === "complete" ? "✓" : String(index + 1)}
            </Text>
          </View>
        );

        const text = (
          <View className={NATIVE_STEPPER_TEXT_CLASS}>
            <Text role="label" className={NATIVE_STEPPER_LABEL_CLASS[state]}>
              {step.label}
            </Text>
            {resolvedShowDescriptions && step.description && (
              <Text role="body-sm" className={NATIVE_STEPPER_DESCRIPTION_CLASS}>
                {step.description}
              </Text>
            )}
          </View>
        );

        return (
          <Fragment key={step.key}>
            {onStepChange ? (
              <Pressable
                testID={testID ? `${testID}-${step.key}` : undefined}
                accessibilityRole="button"
                accessibilityLabel={step.label}
                accessibilityHint={step.description}
                accessibilityState={{ selected: index === currentStep }}
                onPress={() => onStepChange(index)}
                className={NATIVE_STEPPER_ITEM_CLASS}>
                {marker}
                {text}
              </Pressable>
            ) : (
              <View
                testID={testID ? `${testID}-${step.key}` : undefined}
                accessible={false}
                className={NATIVE_STEPPER_ITEM_CLASS}>
                {marker}
                {text}
              </View>
            )}
            {index < steps.length - 1 && (
              <View
                accessible={false}
                className={NATIVE_STEPPER_CONNECTOR_CLASS[resolvedOrientation]}
              />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}
