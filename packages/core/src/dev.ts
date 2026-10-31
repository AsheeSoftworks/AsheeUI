/**
 * The data only tooling reads — `@asheeui/core/dev`.
 *
 * The compatibility matrix classifies every public component by what it means on each platform.
 * Nothing a component renders depends on it: an application imports the design language, the
 * configuration and the cascade, while the matrix is for a tool — the parity guard, the umbrella
 * guard, the documentation's platform table, a CLI answering "does this exist on a device". Because
 * it was published from the root entry, every consumer carried the inventory, and "what core
 * exports" became a question about documentation rather than about the contract.
 *
 * C4 therefore gave it this subpath and took it off the root entry. **No name changed**: an import
 * moves from `@asheeui/core` to `@asheeui/core/dev` and nothing else.
 *
 * The matrix stays in core rather than moving into the tooling that reads it: B19's `PORTABLE_API`
 * and this classification are checked against each other, and B21 makes that check blocking.
 */

export type { ComponentSupport, PlatformSupport } from "./matrix";
export {
  COMPONENT_SUPPORT,
  findComponentSupport,
  PLATFORM_SUPPORT_LABEL,
} from "./matrix";
