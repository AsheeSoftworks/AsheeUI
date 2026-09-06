/**
 * Recursively make every property of `T` optional.
 *
 * Arrays and primitives are left untouched; only object properties are
 * mapped. Useful for typed partial configuration overrides.
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
