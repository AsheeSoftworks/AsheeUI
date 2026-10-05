/**
 * The picker list, for the native package.
 *
 * A select, a multi-select and an autocomplete all show the same thing: a list of options
 * the reader picks from, opened from the field it belongs to. The web floats that list
 * beside the trigger, because a pointer can leave the field and reach it; the platform has
 * no hover and no pointer, so the list is one surface at a time, opened on demand and
 * dismissed when it is done.
 *
 * The list lives here once rather than in each component for the reason the field shell
 * does: three components that drew their own would be three lists that drift. It is
 * internal — it is not exported from the package entry point — because a consumer composes
 * a select, not a list. The frame it is drawn on is not its own either: a select opens one
 * and so does a date field, so `Surface` owns that.
 *
 * What it does not own is the field: the label, the description, the message and the
 * trigger around it are the family's, and the components that open the surface keep them.
 */

import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { classNames } from "../../utils/class-names";
import { Surface } from "../surface/Surface";
import { Text } from "../text/Text";
import {
  NATIVE_PICKER_CHECK_CLASS,
  NATIVE_PICKER_EMPTY_CLASS,
  NATIVE_PICKER_LIST_CLASS,
  NATIVE_PICKER_OPTION_CLASS,
  NATIVE_PICKER_OPTION_DESCRIPTION_CLASS,
  NATIVE_PICKER_OPTION_DISABLED_CLASS,
  NATIVE_PICKER_OPTION_LABEL_CLASS,
  NATIVE_PICKER_OPTION_SELECTED_CLASS,
} from "./picker-styles";

/**
 * One option a reader can pick.
 *
 * A value is a string here where the web's may be a number, because the platform's own
 * pickers identify an option by a string and a native list that carried a number would have
 * to convert it at every boundary. A consumer whose keys are numbers passes their string
 * form and reads the number back from it.
 */
export interface PickerSheetOption {
  /** The option's text, and its accessible name. */
  label: string;

  /** The stable value the field reports. */
  value: string;

  /** Supporting text shown under the label. */
  description?: string;

  /** Whether the option is unavailable. Defaults to false. */
  isDisabled?: boolean;
}

/**
 * Props for the internal picker surface.
 */
export interface PickerSheetProps {
  /** Whether the surface is showing. */
  isOpen: boolean;

  /** The options to pick from. */
  options: readonly PickerSheetOption[];

  /** The values that are picked. */
  selected: readonly string[];

  /** Called with the value the reader picked. */
  onSelect: (value: string) => void;

  /** Called when the surface is dismissed, however it was dismissed. */
  onClose: () => void;

  /** The surface's heading. */
  title?: string;

  /** What to say when there is nothing to pick from. */
  emptyLabel?: string;

  /** Whether several options may be picked, which changes how they announce themselves. */
  isMultiple?: boolean;

  /** Identifier prefix for the options, so a test can reach one. */
  testID?: string;

  /** Content rendered under the list, for a consumer that needs it beside the options. */
  footer?: ReactNode;
}

/**
 * The list of options a field opens.
 *
 * @param props - The surface's options and the values that are picked.
 * @returns The rendered surface.
 *
 * @see Surface - The panel every field that opens something draws on.
 * @see Dropmenu - The field that picks one option from it.
 * @see MultiSelect - The field that picks several.
 * @see Autocomplete - The field that filters it as the reader types.
 */
export function PickerSheet({
  isOpen,
  options,
  selected,
  onSelect,
  onClose,
  title,
  emptyLabel = "Nothing to pick from",
  isMultiple = false,
  testID,
  footer,
}: PickerSheetProps) {
  return (
    <Surface isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      {options.length === 0 ? (
        <Text role="body-sm" className={NATIVE_PICKER_EMPTY_CLASS}>
          {emptyLabel}
        </Text>
      ) : (
        <ScrollView className={NATIVE_PICKER_LIST_CLASS}>
          {options.map((option) => {
            const isSelected = selected.includes(option.value);

            return (
              <Pressable
                key={option.value}
                testID={testID ? `${testID}-${option.value}` : undefined}
                accessibilityRole={isMultiple ? "checkbox" : "radio"}
                accessibilityLabel={option.label}
                accessibilityHint={option.description}
                accessibilityState={{
                  checked: isSelected,
                  disabled: Boolean(option.isDisabled),
                }}
                disabled={option.isDisabled}
                onPress={() => onSelect(option.value)}
                className={classNames(
                  NATIVE_PICKER_OPTION_CLASS,
                  isSelected && NATIVE_PICKER_OPTION_SELECTED_CLASS,
                  option.isDisabled && NATIVE_PICKER_OPTION_DISABLED_CLASS,
                )}>
                <View className="flex-col flex-1 min-w-0">
                  <Text
                    role="body-md"
                    className={NATIVE_PICKER_OPTION_LABEL_CLASS}>
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text
                      role="body-sm"
                      className={NATIVE_PICKER_OPTION_DESCRIPTION_CLASS}>
                      {option.description}
                    </Text>
                  )}
                </View>
                {isSelected && (
                  <Text role="body-md" className={NATIVE_PICKER_CHECK_CLASS}>
                    ✓
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </Surface>
  );
}
