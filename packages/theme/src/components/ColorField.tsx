/**
 * A colour field for the theme editor.
 *
 * The field is a normal `Input` with a swatch at its start and a row of preset swatches beneath
 * it. A reader can type a hex or rgb() value; the field normalises it on blur and only calls
 * `onChange` when the value is one a device can paint. It deliberately does not open a platform
 * colour dialog: that would make the field behave differently on the two renderers, and the
 * portable hex/rgb set is small enough to type.
 */

import {
  isPortableColor,
  normalizeColor,
} from "@asheeui/core";
import {
  Chip,
  ColorSwatch,
  HStack,
  Input,
  VStack,
} from "asheeui";
import { useEffect, useState } from "react";

export interface ColorFieldProps {
  /** The field's label. */
  label: string;

  /** The current colour. An empty value shows an empty field. */
  value: string;

  /** Called with a canonical `#rrggbb` value when the reader commits a valid colour. */
  onChange(value: string): void;

  /** Text under the label. */
  description?: string;

  /** A status message stated by the caller, e.g. a theme-level error. */
  message?: string;

  /** Overrides the computed status. */
  status?: "default" | "error" | "success" | "warning";

  /** Swatches offered beneath the field. */
  presets?: readonly string[];
}

/**
 * A labelled hex/rgb input with a swatch and presets.
 *
 * @param props - The field's value, change handler and presentation.
 */
export function ColorField({
  label,
  value,
  onChange,
  description,
  message,
  status,
  presets = [],
}: ColorFieldProps) {
  const [text, setText] = useState(value);
  const [invalid, setInvalid] = useState(false);

  // The parent may change the value after a preset or a base-theme switch.
  useEffect(() => {
    setText(value);
    setInvalid(false);
  }, [value]);

  const commit = (next: string) => {
    if (!isPortableColor(next)) {
      setInvalid(true);
      return;
    }

    const normalized = normalizeColor(next);
    if (!normalized) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    setText(normalized);
    if (normalized !== value) onChange(normalized);
  };

  const fieldStatus = invalid ? "error" : status;
  const fieldMessage = invalid
    ? "Use a hex colour (#rgb or #rrggbb) or rgb()/rgba()."
    : message;

  return (
    <VStack gap="xs">
      <Input
        label={label}
        description={description}
        value={text}
        status={fieldStatus}
        message={fieldMessage}
        startContent={
          <ColorSwatch
            color={isPortableColor(text) ? text : "transparent"}
            size="sm"
          />
        }
        onChange={(event) => setText(event.target.value)}
        onBlur={() => commit(text)}
      />

      {presets.length > 0 && (
        <HStack gap="xs" wrap>
          {presets.map((preset) => (
            <Chip
              key={preset}
              size="sm"
              variant="bordered"
              onPress={() => commit(preset)}
            >
              <ColorSwatch color={preset} size="sm" label={preset} />
            </Chip>
          ))}
        </HStack>
      )}
    </VStack>
  );
}
