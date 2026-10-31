/**
 * Form component for the native package.
 *
 * The component satisfies the framework's form contract: it groups its fields, it may name the
 * group, and it submits through the control it renders and the handler it was given. Two things
 * are deliberately native rather than portable:
 *
 * 1. There is no form element and no submit event. The platform has neither, so submitting is
 *    the control's press rather than the browser's own event.
 * 2. The group is a view whose legend is drawn above its fields, because the platform has no
 *    fieldset to read a legend out of; the fields inside name themselves, as they do on the web.
 */

import {
  type Color,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/core";
import type { ElementType, ReactNode } from "react";
import { useMemo, useRef } from "react";
import { View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_FORM_CLASS,
  NATIVE_FORM_GROUP_CLASS,
  NATIVE_FORM_LEGEND_CLASS,
  NATIVE_FORM_SUBMIT_ROW_CLASS,
} from "../../../styles/form";
import { setAccessibilityFocus, type ViewRef } from "../../../utils/accessibility";
import { announce } from "../../../utils/announce";
import { cn } from "../../../utils/cn";
import { Typography } from "../../typography/text/Text";
import { Button } from "../button/Button";
import { type FormControl, FormContext } from "./form-context";
import {
  FALLBACK_NATIVE_FORM_CONFIG,
  type NativeFormConfig,
} from "./form-config";

/**
 * Props for the native Form.
 */
export interface FormProps extends NativeFormConfig {
  /** The fields the form groups. */
  children: ReactNode;

  /**
   * Called when the reader submits the form.
   *
   * Returning `false` says the submission was refused. The form then announces the refusal
   * and moves accessibility focus to itself, so the reader is placed at the form rather than
   * left wherever the press started; any other return value is a success.
   */
  // biome-ignore lint/suspicious/noConfusingVoidType: a consumer's own handler returns nothing; `boolean | undefined` alone would refuse every `() => save()`.
  onSubmit?: () => boolean | void;

  /**
   * Called when a control of type `reset` asks the form to clear itself.
   *
   * The form does not own its fields' values — a consumer does — so resetting is a
   * callback rather than something the framework can do. A form with no handler still
   * accepts the button; it simply has nothing to clear.
   */
  onReset?: () => void;

  /** The name of the group, shown above the fields. */
  legend?: string;

  /**
   * A component that replaces the form's root, such as its framework's own form.
   *
   * The form's meaning is carried by the context, so a substitute is a container: it
   * receives the classes and the children, and its own props are spread last. The web
   * renderer's `component`/`componentProps` are the same two options.
   */
  component?: ElementType;

  /** Props for {@link component}, spread last so they win. */
  componentProps?: Record<string, unknown>;

  /** The submit control's label. Without one the form renders no control. */
  submitLabel?: string;

  /** Whether the form is waiting for something, which the submit control reports. */
  isPending?: boolean;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Identifier for the submit control, so a test can reach it. */
  submitTestID?: string;
}

/**
 * A group of fields that submits.
 *
 * @param props - The form's children and the control it submits with.
 * @param props.children - The fields the form groups.
 * @param props.legend - The name of the group.
 * @param props.submitLabel - The submit control's label.
 * @param props.onSubmit - Called when the reader submits the form.
 * @returns The rendered form.
 *
 * @example
 * ```tsx
 * <Form legend="Shipping" submitLabel="Continue" onSubmit={save}>
 *   <Input label="Street" onChangeText={setStreet} />
 *   <Input label="City" onChangeText={setCity} />
 * </Form>
 * ```
 *
 * @see Input - The field a form usually groups.
 */
export function Form({
  children,
  onSubmit,
  onReset,
  legend,
  submitLabel,
  isPending,
  submitVariant,
  submitColor,
  submitSize,
  submitRadius,
  component,
  componentProps,
  className,
  submitTestID,
}: FormProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.form;

  const resolvedVariant = resolveCascade<Variant>(
    submitVariant,
    sectionConfig?.submitVariant,
    undefined,
    FALLBACK_NATIVE_FORM_CONFIG.submitVariant,
  );
  const resolvedColor = resolveCascade<Color>(
    submitColor,
    sectionConfig?.submitColor,
    config.defaultColor,
    FALLBACK_NATIVE_FORM_CONFIG.submitColor,
  );
  const resolvedSize = resolveCascade<Size>(
    submitSize,
    sectionConfig?.submitSize,
    config.defaultSize,
    FALLBACK_NATIVE_FORM_CONFIG.submitSize,
  );
  const resolvedRadius = resolveCascade<Radius>(
    submitRadius,
    sectionConfig?.submitRadius,
    config.defaultRadius,
    FALLBACK_NATIVE_FORM_CONFIG.submitRadius,
  );

  const body = legend ? (    <View className={NATIVE_FORM_GROUP_CLASS}>
      <Typography role="label" className={NATIVE_FORM_LEGEND_CLASS}>
        {legend}
      </Typography>
      {children}
    </View>
  ) : (
    children
  );

  // Stable for as long as its handlers are: a button inside the form re-renders when the
  // form does, and a new context object on every render would re-render every control.
  const formRef = useRef<ViewRef>(null);

  const submit = () => {
    const accepted = onSubmit?.();

    if (accepted === false) {
      setAccessibilityFocus(formRef);
      announce("The form could not be submitted.", "alert");
    }
  };

  const control = useMemo<FormControl>(
    () => ({
      submit,
      reset: () => onReset?.(),
    }),
    // `submit` closes over `onSubmit`; the dependency below is the value it reads.
    [onSubmit, onReset],
  );

  const content = (
    <>
      {body}
      {submitLabel && (
        <View className={NATIVE_FORM_SUBMIT_ROW_CLASS}>
          <Button
            testID={submitTestID}
            variant={resolvedVariant}
            color={resolvedColor}
            size={resolvedSize}
            radius={resolvedRadius}
            isLoading={isPending}
            isDisabled={isPending}
            onPress={submit}>
            {submitLabel}
          </Button>
        </View>
      )}
    </>
  );

  const rootClassName = cn(NATIVE_FORM_CLASS, className);
  const Substitute = component;

  return (
    <FormContext.Provider value={control}>
      {Substitute ? (
        <Substitute className={rootClassName} {...componentProps}>
          {content}
        </Substitute>
      ) : (
        <View ref={formRef} className={rootClassName}>
          {content}
        </View>
      )}
    </FormContext.Provider>
  );
}
