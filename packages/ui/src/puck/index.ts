/**
 * Puck integration for AsheeUI.
 *
 * The subpath holds the framework's block configuration: the fields a builder
 * can edit, one block per component, the categories they are filed under and the
 * page shell a published page renders into. Nothing here is imported by the
 * component library itself, so a consumer that does not use Puck never loads it.
 *
 * ```tsx
 * import { asheePuckConfig } from "asheeui/puck";
 * ```
 */

export * from "./adapters";
export * from "./blocks/content";
export * from "./blocks/layout";
export * from "./blocks/navigation";
export * from "./blocks/sections";
export * from "./blocks/utility";
export * from "./config";
export * from "./fields";
