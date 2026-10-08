"use client";

/**
 * The AsheeUI Puck integration.
 *
 * One import, two renderers. An application installs `@asheeui/puck` and writes the same
 * specifiers whether it runs in a browser or on a device; the resolver decides which half
 * answers:
 *
 * - On the web, it reads `main` (and the `import` condition) and reaches this file,
 *   which is the editor's block registry, the editor's page renderer and the shared
 *   specs behind them.
 * - Under Expo and Metro, it reads the manifest's `react-native` field, then the
 *   `react-native` condition of the exports map, and finally Metro's platform extension
 *   (`.native.ts` beside `.ts`), and reaches `./index.native`, which renders a stored
 *   page with the native components.
 *
 * The routing is a property of the file name and the manifest rather than of a runtime
 * check, which is what keeps a browser bundle free of React Native and a device bundle
 * free of the DOM edition of the framework. This module is the web branch, and it
 * imports no native renderer.
 */

export * from "./web";
