/**
 * The platform half of the Puck integration.
 *
 * It is the shared layer plus this platform's drawings, and the renderer that turns a
 * stored page into a screen. Nothing here imports React DOM, Tailwind or the editor: a
 * device reaches this file without loading a single byte of the web edition, which is
 * the property the whole split exists for.
 */

export * from "../shared";
export * from "./blocks/content";
export * from "./blocks/layout";
export * from "./blocks/navigation";
export * from "./blocks/sections";
export * from "./blocks/utility";
export * from "./config";
export * from "./render";
export * from "./root";
