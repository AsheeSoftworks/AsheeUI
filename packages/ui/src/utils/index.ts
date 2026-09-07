/**
 * AsheeUI shared utilities.
 *
 * Client-safe helpers (`cn`, `mergeObject`) plus the `DeepPartial` type,
 * migrated from the former `@asheeui/utils` package. Node-only helpers
 * (config discovery) live under `./node`.
 */
export { cn } from "./cn";
export { mergeObject } from "./merge-object";
export type { DeepPartial } from "./types";
