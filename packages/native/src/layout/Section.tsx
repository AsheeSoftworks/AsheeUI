/**
 * Section component for the native package.
 *
 * A section is a band of a screen: vertical rhythm and a background, with the
 * content supplied by whatever the section holds. It is the native counterpart of
 * the web `Section`, so a screen composed of bands is written the same way on
 * both platforms.
 */

import { resolveConfigCascade } from "@asheeui/shared";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useAsheeNativeConfig } from "../provider/AsheeNativeProvider";
import { classNames } from "../utils/class-names";
import {
  FALLBACK_NATIVE_SECTION_CONFIG,
  type NativeSectionConfig,
} from "./layout-config";
import {
  SECTION_BACKGROUND_CLASS,
  SECTION_BASE_CLASS,
  SECTION_SPACING_CLASS,
} from "./layout-styles";

/**
 * Props for the native Section.
 */
export interface SectionProps
  extends NativeSectionConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The section's content. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A band with vertical rhythm and a background.
 *
 * @param props - The section's options and the platform's view props.
 * @param props.spacing - Vertical padding. Defaults to the configured value.
 * @param props.background - Background to paint. Defaults to the configured value.
 * @returns The rendered section.
 *
 * @example
 * ```tsx
 * <Section spacing="lg" background="muted">
 *   <Container>
 *     <Text role="heading-lg">Campaigns</Text>
 *   </Container>
 * </Section>
 * ```
 *
 * @see Container - The maximum-width column a section usually holds.
 */
export function Section({
  spacing,
  background,
  className,
  style,
  children,
  ...rest
}: SectionProps) {
  const config = useAsheeNativeConfig();

  const resolved = resolveConfigCascade<
    NativeSectionConfig,
    Required<NativeSectionConfig>
  >(
    { spacing, background },
    config.components.section,
    FALLBACK_NATIVE_SECTION_CONFIG,
  );

  return (
    <View
      className={classNames(
        SECTION_BASE_CLASS,
        SECTION_SPACING_CLASS[resolved.spacing],
        SECTION_BACKGROUND_CLASS[resolved.background],
        className,
      )}
      style={style}
      {...rest}>
      {children}
    </View>
  );
}
