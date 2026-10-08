/**
 * The AsheeUI Puck integration, native branch.
 *
 * Metro reaches this file for a React Native platform — through the manifest's
 * `react-native` field, through the `react-native` condition of the exports map, or by
 * resolving the platform extension (`.native`) beside `index.ts` — so an application's
 * import specifiers do not change between the web and a device.
 *
 * It exports the native registry and the native page renderer alongside the same shared
 * specs the web branch exports, because the point of the package is that the import a
 * developer writes is the same one on both platforms. It imports no DOM renderer and
 * nothing from the editor: resolving this file must not pull Tailwind, React DOM or
 * `@puckeditor/core` into a native bundle.
 *
 * The file is published as source rather than only as a build, and so are the modules it
 * imports, because the manifest's `react-native` field cannot be redirected at publish
 * time the way `main` and `types` are: whatever that field names has to exist in the
 * tarball, and a resolver that reads the field instead of the exports map has to be able
 * to compile it and everything it reaches.
 */

export * from "./native";
