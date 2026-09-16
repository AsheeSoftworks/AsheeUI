/**
 * Grid component for the native package.
 *
 * The grid is the portable half of the web `Grid`: a two-dimensional layout whose
 * column count changes with the window. The web states the count per breakpoint
 * as class variants; native reads the window through `useBreakpoint` and picks
 * the count, because the platform has no breakpoint variants of its own.
 */

import { resolveConfigCascade } from "@asheeui/shared";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useBreakpoint } from "../hooks/use-breakpoint";
import { useAsheeNativeConfig } from "../provider/AsheeNativeProvider";
import { classNames } from "../utils/class-names";
import {
  FALLBACK_NATIVE_GRID_CONFIG,
  type NativeGridConfig,
  resolveGridColumns,
} from "./layout-config";
import {
  GRID_BASE_CLASS,
  GRID_COLUMN_CLASS,
  GRID_GAP_CLASS,
} from "./layout-styles";

/**
 * Props for the native Grid.
 */
export interface GridProps
  extends NativeGridConfig,
    Omit<ViewProps, "children" | "style"> {
  /** The cells, in order. */
  children?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A responsive column grid.
 *
 * The column count is stated at the framework's breakpoints and resolved from the
 * window the platform reports, so a deck of cards is one column on a phone and two
 * or three on a tablet without a media query. A count left undefined inherits the
 * value of the next smaller breakpoint, exactly as it does on the web.
 *
 * @param props - The grid's options and the platform's view props.
 * @param props.columns - Columns from the smallest window. Defaults to the configured value.
 * @param props.columnsMd - Columns from the `md` breakpoint upwards.
 * @param props.columnsLg - Columns from the `lg` breakpoint upwards.
 * @param props.gap - Space between cells. Defaults to the configured value.
 * @returns The rendered grid.
 *
 * @example
 * ```tsx
 * <Grid columns={1} columnsMd={2} gap="lg">
 *   <Card title="Inbox" description="12 unread" />
 *   <Card title="Sent" description="348 this month" />
 * </Grid>
 * ```
 *
 * @see Stack - The one-axis equivalent.
 * @see useBreakpoint - The vocabulary the grid resolves against.
 */
export function Grid({
  columns,
  columnsMd,
  columnsLg,
  gap,
  className,
  style,
  children,
  ...rest
}: GridProps) {
  const config = useAsheeNativeConfig();
  const { breakpoint } = useBreakpoint();

  const resolved = resolveConfigCascade<
    NativeGridConfig,
    Required<Pick<NativeGridConfig, "columns" | "gap">> & NativeGridConfig
  >(
    { columns, columnsMd, columnsLg, gap },
    config.components.grid,
    FALLBACK_NATIVE_GRID_CONFIG,
  );

  const columnCount = resolveGridColumns(resolved, breakpoint);
  const cellClass = GRID_COLUMN_CLASS[columnCount] ?? GRID_COLUMN_CLASS[1];

  return (
    <View
      className={classNames(
        GRID_BASE_CLASS,
        GRID_GAP_CLASS[resolved.gap],
        className,
      )}
      style={style}
      {...rest}>
      {Children.map(children, (cell) => {
        if (!isValidElement(cell)) {
          return cell;
        }

        // The width is placed on the cell itself rather than on a wrapper: one
        // view fewer per cell, and the consumer's own class still wins because
        // it is merged after the grid's.
        const cellProps = cell.props as { className?: string };

        return cloneElement(
          cell as React.ReactElement<{ className?: string }>,
          {
            className: classNames(cellClass, cellProps.className),
          },
        );
      })}
    </View>
  );
}
