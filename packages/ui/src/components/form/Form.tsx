/**
 * Form component for AsheeUI.
 * This file provides the Form component, a thin interoperability wrapper over
 * the native form element.
 */

"use client";

import {
  type ElementType,
  type FormHTMLAttributes,
  forwardRef,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import type { Color, Radius, Size, Variant } from "../../shared";
import { cn } from "../../utils";
import { resolveCascade, resolveRadiusKey } from "../../utils/resolve-token";
import { Button } from "../button";
import { type FormConfig, FALLBACK_FORM_CONFIG } from "./form-config";
import {
  FORM_BASE_CLASS,
  FORM_FIELD_GROUP_CLASS,
  FORM_LEGEND_CLASS,
  FORM_SUBMIT_ROW_CLASS,
} from "./form-styles";

type BaseFormProps = FormConfig &
  Omit<FormHTMLAttributes<HTMLFormElement>, "color" | "children">;

/**
 * Configuration options for the Form component.
 */
export interface FormProps extends BaseFormProps {
  /**
   * The fields and other content of the form.
   */
  children?: ReactNode;

  /**
   * Legend that groups the fields.
   * When it is given the fields are wrapped in a `fieldset` with that legend,
   * which is how a form tells assistive technology which set of controls it is
   * describing. A form whose fields are already grouped by other landmarks
   * omits it and names itself with `aria-label` or `aria-labelledby`.
   */
  legend?: string;

  /**
   * Label of the submit control.
   * When it is given the component renders an AsheeUI `Button` as the form's
   * submit control, so no consumer has to rebuild one. Without it the
   * consumer places its own control.
   */
  submitLabel?: string;

  /**
   * Whether a submission is in progress.
   * While it is true the submit control is disabled and busy, which is how a
   * consumer shows a pending submission without bespoke markup.
   *
   * @default false
   */
  isPending?: boolean;

  /**
   * Component that replaces the native `form` element, such as a framework
   * form primitive.
   *
   * The substitution API is shared with `Link` and `Image`: `component` names
   * the component and `componentProps` carries the props it needs.
   */
  component?: ElementType;

  /**
   * Additional props for `component`.
   */
  componentProps?: Record<string, unknown>;
}

/**
 * A framework-native form element.
 *
 * Form wraps the native `form` element the way `Link` wraps the anchor and
 * `Image` wraps the picture, so form-level improvements have one home without
 * the framework taking responsibility for form state. It preserves native
 * submission and validation: `action`, `method`, `encType`, `target`,
 * `noValidate` and the submit event all pass through untouched, and the
 * forwarded ref reaches the element itself.
 *
 * It is deliberately thin, because a consumer's form state belongs to the
 * consumer or to a form library. There is no AsheeUI field registry, no
 * validation schema, and no submission state: `onSubmit` is the native event,
 * so a form library binds to it exactly as it binds to a plain form.
 *
 * Fields keep their own presentation through the framework's field
 * components, and the component renders an AsheeUI `Button` as the submit
 * control when a label is given for it. Page layout stays with the consumer's
 * Tailwind classes.
 *
 * The form never moves focus, on mount or on a rejected submission: where a
 * consumer sends focus after a failed validation is a consumer decision.
 *
 * The form element itself can be replaced, the way `Link` replaces the anchor
 * and `Image` replaces the picture: pass `component` to name a form component
 * and `componentProps` for the props it needs.
 *
 * @param props - Form configuration options and native form attributes.
 * @param props.children - The fields and other content of the form.
 * @param props.legend - Legend that groups the fields.
 * @param props.submitLabel - Label of the submit control the component renders.
 * @param props.isPending - Whether a submission is in progress. Defaults to false.
 * @param props.component - Component that replaces the native form element.
 * @param props.componentProps - Additional props for that component.
 * @param props.submitVariant - Style of the submit control. Defaults to the configured value.
 * @param props.submitColor - Colour of the submit control. Defaults to the configured value.
 * @param props.submitSize - Size of the submit control. Defaults to "md".
 * @param props.submitRadius - Corner rounding of the submit control. Defaults to "md".
 * @param props.className - Extra classes applied last.
 *
 * @example
 * ```tsx
 * <Form legend="Invoice details" submitLabel="Save" onSubmit={handleSubmit}>
 *   <Input label="Reference" name="reference" />
 *   <Textarea label="Notes" name="notes" />
 * </Form>
 * ```
 *
 * @example
 * ```tsx
 * // A form library binds to the native submit event, unchanged.
 * <Form onSubmit={form.handleSubmit(save)}>
 *   <Input label="Email" name="email" />
 * </Form>
 * ```
 *
 * @see FormConfig - The configuration type for component defaults.
 * @see Button - The submit control the component renders.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      children,
      legend,
      submitLabel,
      isPending = false,
      component,
      componentProps: componentPropsProp,
      submitVariant,
      submitColor,
      submitSize,
      submitRadius,
      className,
      ...props
    },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.form as FormConfig | undefined;

    const resolvedSubmitVariant = resolveCascade<Variant>(
      submitVariant,
      sectionConfig?.submitVariant,
      config.defaultVariant,
      FALLBACK_FORM_CONFIG.submitVariant,
    );

    const resolvedSubmitColor = resolveCascade<Color>(
      submitColor,
      sectionConfig?.submitColor,
      config.defaultColor,
      FALLBACK_FORM_CONFIG.submitColor,
    );

    const resolvedSubmitSize = resolveCascade<Size>(
      submitSize,
      sectionConfig?.submitSize,
      undefined,
      FALLBACK_FORM_CONFIG.submitSize,
    );

    const resolvedSubmitRadius = resolveRadiusKey(
      submitRadius,
      sectionConfig?.submitRadius,
      config.defaultRadius,
      FALLBACK_FORM_CONFIG.submitRadius,
    );

    const content = (
      <>
        {children}
        {submitLabel && (
          <div className={FORM_SUBMIT_ROW_CLASS}>
            <Button
              type="submit"
              variant={resolvedSubmitVariant}
              color={resolvedSubmitColor}
              size={resolvedSubmitSize}
              radius={resolvedSubmitRadius as Radius}
              isLoading={isPending}
              isDisabled={isPending}>
              {submitLabel}
            </Button>
          </div>
        )}
      </>
    );

    // Choose the element: the substitution component or the native form
    const FormComponent = component || "form";

    return (
      <FormComponent
        ref={ref}
        className={cn(FORM_BASE_CLASS, className)}
        {...props}
        {...componentPropsProp}>
        {legend ? (
          <fieldset className={FORM_FIELD_GROUP_CLASS}>
            <legend className={FORM_LEGEND_CLASS}>{legend}</legend>
            {content}
          </fieldset>
        ) : (
          content
        )}
      </FormComponent>
    );
  },
);

Form.displayName = "Form";
