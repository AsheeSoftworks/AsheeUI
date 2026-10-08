"use client";

/**
 * The web half of the Puck integration.
 *
 * It is the shared layer plus this platform's drawings: the block specs, the field
 * builders and the adapters are re-exported unchanged, and the block registrations and
 * the page renderer are the web's own. Nothing here imports React Native, and nothing
 * here imports the native half of the package, so a browser bundle reaches only the DOM
 * renderer.
 */

export * from "../shared";
export * from "./blocks/content";
export * from "./blocks/layout";
export * from "./blocks/navigation";
export * from "./blocks/sections";
export * from "./blocks/utility";
export * from "./config";
export * from "./page";
export * from "./root";
