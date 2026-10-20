/**
 * Built-in types that should never be recursed into.
 *
 * Functions (including React components/render callbacks), primitives, and
 * well-known built-in objects are terminal values for the deep mapping, so
 * `DeepPartial` stops instead of walking their members. This prevents
 * excessively deep/infinite type instantiation when configs reference React
 * nodes, DOM elements, or function-valued fields.
 */
type Builtin =
  | Date
  | Error
  | RegExp
  | boolean
  | number
  | string
  | symbol
  | null
  | undefined;

/**
 * Recursively make every property of `T` optional.
 *
 * Built-ins (primitives, functions, dates, etc.) are left untouched and
 * arrays are mapped element-wise; only plain object properties are mapped
 * with optional keys. Useful for typed partial configuration overrides.
 */
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;

/**
 * A configuration with every optional key present and no `undefined` in any value.
 *
 * `Required<T>` only removes the optionality marker, so a key declared `size?: Size | undefined` stays a
 * `Size | undefined` value under it. That matters wherever a fallback table is typed `Required<Config>`: the
 * table states every key, but TypeScript still treats its values as possibly missing, so reading one cannot feed a
 * resolver that requires a value. This mapped type is the honest description of what the table actually is.
 */
export type Concrete<T> = { [K in keyof T]-?: NonNullable<T[K]> };
