/**
 * Input component for the native package.
 *
 * The component satisfies the framework's input contract: the same value,
 * initial value, change handlers, label, description, message, status, alignment and
 * width as the web field, implemented as the platform's own text field. Four things are
 * deliberately native rather than portable:
 *
 * 1. The field announces itself through `accessibilityLabel` and
 *    `accessibilityHint`, which is where the platform reads a field's name and
 *    its explanation, instead of the web's referenced description.
 * 2. Focus is a state the component tracks, because the platform has no focus
 *    variant to style against.
 * 3. `type` is a **mapping**, not a forwarded attribute. A browser changes the control it
 *    renders for `type="password"`; a platform has no such switch, so the type is read here
 *    and translated into the platform's own props — `secureTextEntry` for a password,
 *    `keyboardType` and `autoComplete` for the others. A value this table does not know
 *    warns once in development rather than being silently ignored, because a field that
 *    stays visible while the consumer asked for a password is the defect WP-09 names.
 * 4. The content slots are absolutely placed siblings of the field rather than children,
 *    because a native text input has no children to draw.
 */

import {
  type ColorRole,
  type FieldStatus,
  isFieldInvalid,
  type LabelAlign,
  type Radius,
  resolveCascade,
  resolveChange,
  resolveFieldStatusColor,
  type Size,
  type Variant,
} from "@asheeui/core";
import { type ReactNode, useState } from "react";
import type { StyleProp, TextInputProps, TextStyle } from "react-native";
import { TextInput, View } from "react-native";
import { useAsheeConfig } from "../../../provider/AsheeUIProvider";
import {
  NATIVE_INPUT_BASE_CLASS,
  NATIVE_INPUT_DISABLED_CLASS,
  NATIVE_INPUT_EDGE_ACCENT_CLASS,
  NATIVE_INPUT_EDGE_NEUTRAL_CLASS,
  NATIVE_INPUT_EDGE_WIDTH_CLASS,
  NATIVE_INPUT_MULTILINE_CLASS,
  NATIVE_INPUT_SIZE_CLASS,
  NATIVE_INPUT_VARIANT_CLASS,
} from "../../../styles/input";
import { NATIVE_RADIUS_CLASS } from "../../../styles/radius";
import { cn } from "../../../utils/cn";
import { FieldShell } from "../field/FieldShell";
import {
  FALLBACK_NATIVE_INPUT_CONFIG,
  type NativeInputConfig,
} from "./input-config";

/**
 * The field types a shared form writes, and the platform props each stands for.
 *
 * `text` states nothing, because it is the platform's own default. The others name the
 * keyboard, the autofill vocabulary and — for a password — the secure entry, which is the
 * platform's mechanism for masking (there is no secure-input package in this one).
 */
export type NativeInputType =
  | "text"
  | "password"
  | "email"
  | "tel"
  | "number"
  | "url"
  | "search";

/** The platform props one field type resolves to. */
type InputTypeMapping = Pick<
  TextInputProps,
  | "autoComplete"
  | "keyboardType"
  | "returnKeyType"
  | "secureTextEntry"
  | "textContentType"
>;

const INPUT_TYPE_MAP: Record<NativeInputType, InputTypeMapping> = {
  text: {},
  password: {
    secureTextEntry: true,
    textContentType: "password",
    autoComplete: "current-password",
  },
  email: {
    keyboardType: "email-address",
    autoComplete: "email",
    textContentType: "emailAddress",
  },
  tel: {
    keyboardType: "phone-pad",
    autoComplete: "tel",
    textContentType: "telephoneNumber",
  },
  number: {
    keyboardType: "numeric",
    autoComplete: "off",
  },
  url: {
    keyboardType: "url",
    autoComplete: "url",
    textContentType: "URL",
  },
  search: {
    returnKeyType: "search",
    autoComplete: "off",
  },
};

/**
 * The field types this process has already warned about.
 *
 * Once per value rather than once per render: a field re-renders on every keystroke, and a
 * warning on each one is a warning the reader filters out.
 */
const warnedTypes = new Set<string>();

/**
 * Turn a `type` into the platform props it stands for.
 *
 * @param type - The type the consumer wrote.
 * @returns The mapping, or `undefined` for the platform's default or an unknown value.
 */
function mappingFor(type: string | undefined): InputTypeMapping | undefined {
  if (type === undefined) return undefined;
  if (type in INPUT_TYPE_MAP) return INPUT_TYPE_MAP[type as NativeInputType];

  // An unknown value is never silently ignored: the consumer asked for a control the
  // platform does not have, and the field is about to render as an ordinary text input.
  if (process.env.NODE_ENV !== "production" && !warnedTypes.has(type)) {
    warnedTypes.add(type);
    console.warn(
      `[@asheeui] Input does not know type "${type}", so it renders the platform's plain text field. Known types: ${Object.keys(INPUT_TYPE_MAP).join(", ")}.`,
    );
  }

  return undefined;
}

/**
 * Props for the native Input.
 */
export interface InputProps
  extends NativeInputConfig,
    Omit<
      TextInputProps,
      "children" | "multiline" | "style" | "onChange" | "onChangeText"
    > {
  /** The field's label, which also names the control. */
  label?: string;

  /** Description shown under the label, and the control's hint. */
  description?: string;

  /** Validation message shown under the field. */
  message?: string;

  /**
   * The kind of field, under the name the web renderer uses.
   *
   * The platform has no `type` attribute, so the value is translated: `password` becomes
   * `secureTextEntry` and the password autofill vocabulary, and the input kinds state the
   * keyboard and autofill hint a device understands. An unknown string is accepted by the
   * type (a shared configuration may compute one) and warns once in development.
   */
  type?: NativeInputType | (string & {});

  /** Whether the field is waiting for something, which shows a pending marker. */
  isLoading?: boolean;

  /** Content rendered at the start of the field, typically an icon. */
  startContent?: ReactNode;

  /** Content rendered at the end of the field, typically a control or an adornment. */
  endContent?: ReactNode;

  /**
   * Called with the field's next value, under the name the browser gives the event.
   *
   * The event is a shim with `target.value`, which is the part a web form reads; the
   * platform's text event carries its value somewhere else, so the field reports the value
   * in the shape a handler copied from the web already expects. `preventDefault` and
   * `stopPropagation` are not part of it.
   */
  onChange?: (event: { target: { value: string } }) => void;

  /** Called with the field's next value, under the platform's most specific name. */
  onChangeText?: (value: string) => void;

  /** Called with the field's next value, under the name the picker family already used. */
  onValueChange?: (value: string) => void;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<TextStyle>;
}

/**
 * A single or multi-line text field.
 *
 * @param props - The field's options and the platform's text input props.
 * @param props.label - The field's label.
 * @param props.description - The explanation under the label.
 * @param props.message - The validation message under the field.
 * @param props.type - The kind of field. `"password"` masks the value.
 * @param props.status - Validation status. Defaults to the configured value.
 * @param props.size - Density. Defaults to the configured value.
 * @param props.multiline - Accept several lines. Defaults to the configured value.
 * @param props.isDisabled - Make the field unavailable. Defaults to the configured value.
 * @param props.startContent - Content before the value.
 * @param props.endContent - Content after the value.
 * @returns The rendered field.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   onChangeText={setEmail}
 * />
 * ```
 *
 * @see PasswordInput - The field with the reveal control.
 * @see FieldShell - The label, description and message block the field shows.
 */
export function Input({
  label,
  description,
  message,
  type,
  status,
  size,
  radius,
  variant,
  color,
  multiline,
  isDisabled,
  isLoading,
  required,
  labelAlign,
  fullWidth,
  startContent,
  endContent,
  className,
  style,
  onFocus,
  onBlur,
  onChange,
  onChangeText,
  onValueChange,
  secureTextEntry,
  keyboardType,
  autoComplete,
  textContentType,
  returnKeyType,
  ...rest
}: InputProps) {
  const config = useAsheeConfig();
  const sectionConfig = config.components.input;
  const [isFocused, setIsFocused] = useState(false);

  const typeMapping = mappingFor(type);

  const resolvedStatus = resolveCascade<FieldStatus>(
    status,
    sectionConfig?.status,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.status,
  );
  const resolvedSize = resolveCascade<Size>(
    size,
    sectionConfig?.size,
    config.defaultSize,
    FALLBACK_NATIVE_INPUT_CONFIG.size,
  );
  const resolvedRadius = resolveCascade<Radius>(
    radius,
    sectionConfig?.radius,
    config.defaultRadius,
    FALLBACK_NATIVE_INPUT_CONFIG.radius,
  );
  const resolvedVariant = resolveCascade<Variant>(
    variant,
    sectionConfig?.variant,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.variant,
  );
  const resolvedColor = resolveCascade<ColorRole>(
    color,
    sectionConfig?.color,
    config.defaultColor,
    FALLBACK_NATIVE_INPUT_CONFIG.color,
  );
  const resolvedMultiline = resolveCascade<boolean>(
    multiline,
    sectionConfig?.multiline,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.multiline,
  );
  const resolvedDisabled = resolveCascade<boolean>(
    isDisabled,
    sectionConfig?.isDisabled,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.isDisabled,
  );
  const resolvedRequired = resolveCascade<boolean>(
    required,
    sectionConfig?.required,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.required,
  );
  const resolvedLabelAlign = resolveCascade<LabelAlign>(
    labelAlign,
    sectionConfig?.labelAlign,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.labelAlign,
  );
  const resolvedFullWidth = resolveCascade<boolean>(
    fullWidth,
    sectionConfig?.fullWidth,
    undefined,
    FALLBACK_NATIVE_INPUT_CONFIG.fullWidth,
  );

  const isInvalid = isFieldInvalid(resolvedStatus);

  // The accent a field takes is the family's rule, not this component's: a status outranks
  // the configured colour, and native now resolves the same colour role the web field does
  // before mapping it to the platform's own edge class.
  const statusColor = resolveFieldStatusColor(resolvedStatus, resolvedColor);
  const edgeClass = cn(
    NATIVE_INPUT_EDGE_WIDTH_CLASS[resolvedVariant],
    resolvedStatus !== "default"
      ? NATIVE_INPUT_EDGE_ACCENT_CLASS[statusColor]
      : isFocused
        ? NATIVE_INPUT_EDGE_ACCENT_CLASS[resolvedColor]
        : NATIVE_INPUT_EDGE_NEUTRAL_CLASS[resolvedVariant],
  );

  return (
    // The width belongs to the field rather than to the control, so a field that is not
    // full width takes its label and its message with it.
    <View
      className={cn(
        "min-w-0",
        resolvedFullWidth ? "w-full" : "self-start",
      )}>
      <FieldShell
        label={label}
        labelAlign={resolvedLabelAlign}
        description={description}
        message={message}
        status={resolvedStatus}
        required={resolvedRequired}
        isLoading={isLoading}>
        <View className="relative w-full">
          {startContent ? (
            <View
              pointerEvents="none"
              className="absolute left-3 z-10 flex items-center text-foreground/50">
              {startContent}
            </View>
          ) : null}
          <TextInput
            {...rest}
            accessibilityLabel={label}
            accessibilityHint={description}
            aria-invalid={isInvalid}
            editable={!resolvedDisabled}
            multiline={resolvedMultiline}
            secureTextEntry={
              secureTextEntry ?? typeMapping?.secureTextEntry ?? false
            }
            keyboardType={keyboardType ?? typeMapping?.keyboardType}
            autoComplete={autoComplete ?? typeMapping?.autoComplete}
            textContentType={textContentType ?? typeMapping?.textContentType}
            returnKeyType={returnKeyType ?? typeMapping?.returnKeyType}
            onChangeText={(value) =>
              resolveChange({ onChange, onChangeText, onValueChange }, value)
            }
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            className={cn(
              NATIVE_INPUT_BASE_CLASS,
              NATIVE_INPUT_SIZE_CLASS[resolvedSize],
              NATIVE_RADIUS_CLASS[resolvedRadius],
              NATIVE_INPUT_VARIANT_CLASS[resolvedVariant],
              edgeClass,
              resolvedMultiline && NATIVE_INPUT_MULTILINE_CLASS,
              resolvedDisabled && NATIVE_INPUT_DISABLED_CLASS,
              startContent ? "pl-11" : undefined,
              endContent ? "pr-11" : undefined,
              className,
            )}
            style={style}
          />
          {endContent ? (
            <View className="absolute right-3 z-10 flex items-center text-foreground/50">
              {endContent}
            </View>
          ) : null}
        </View>
      </FieldShell>
    </View>
  );
}
