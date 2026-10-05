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
  NATIVE_FORM_CLASS,
  NATIVE_FORM_GROUP_CLASS,
  NATIVE_FORM_LEGEND_CLASS,
  NATIVE_FORM_SUBMIT_ROW_CLASS,
  type Radius,
  resolveCascade,
  type Size,
  type Variant,
} from "@asheeui/core";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { Button } from "../button/Button";
import { Text } from "../text/Text";
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

  /** Called when the reader submits the form. */
  onSubmit?: () => void;

  /** The name of the group, shown above the fields. */
  legend?: string;

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
  legend,
  submitLabel,
  isPending,
  submitVariant,
  submitColor,
  submitSize,
  submitRadius,
  className,
  submitTestID,
}: FormProps) {
  const config = useAsheeNativeConfig();
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

  const body = legend ? (
    <View className={NATIVE_FORM_GROUP_CLASS}>
      <Text role="label" className={NATIVE_FORM_LEGEND_CLASS}>
        {legend}
      </Text>
      {children}
    </View>
  ) : (
    children
  );

  return (
    <View className={classNames(NATIVE_FORM_CLASS, className)}>
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
            onPress={() => onSubmit?.()}>
            {submitLabel}
          </Button>
        </View>
      )}
    </View>
  );
}
