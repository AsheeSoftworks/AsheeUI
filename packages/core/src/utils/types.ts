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
