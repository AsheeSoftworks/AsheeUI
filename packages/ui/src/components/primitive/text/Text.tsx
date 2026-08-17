"use client";

import type { FontSizeKey, FontWeight, LineHeight, Size } from "@ashee/theme";
import { cn } from "@ashee/utils";
import {
  createElement,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../../libs/context";
import { resolveValue } from "../../../utils/resolve-token";
import { defaultTextConfig } from "./default-text-config";
import type { TextAs, TextConfig } from "./text-config";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextAs;
  size?: keyof Size;
  weight?: keyof FontWeight;
  lineHeight?: keyof LineHeight;
  className?: string;
  children?: ReactNode;
}

const SIZE_CLASS: Record<FontSizeKey, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    { as, size, weight, lineHeight, className, style, children, ...props },
    ref,
  ) => {
    const config = useAsheeConfig();
    const sectionConfig = config.components?.text as TextConfig | undefined;

    const tag = (as ?? sectionConfig?.as ?? defaultTextConfig.as) as TextAs;

    const resolvedSize = resolveValue(
      size,
      sectionConfig?.size,
      defaultTextConfig.size as keyof Size,
    ) as FontSizeKey;

    const resolvedWeight = resolveValue(
      weight,
      sectionConfig?.weight,
      defaultTextConfig.weight as keyof FontWeight,
    );

    const resolvedLineHeight = resolveValue(
      lineHeight,
      sectionConfig?.lineHeight,
      defaultTextConfig.lineHeight as keyof LineHeight,
    );

    return createElement(
      tag,
      {
        ref,
        className: cn(
          SIZE_CLASS[resolvedSize] ?? "text-base",
          sectionConfig?.className,
          className,
        ),
        style: {
          fontWeight: config.theme?.typography?.weight?.[resolvedWeight],
          lineHeight:
            config.theme?.typography?.lineHeight?.[resolvedLineHeight],
          ...style,
        },
        ...props,
      },
      children,
    );
  },
);

Text.displayName = "Text";
