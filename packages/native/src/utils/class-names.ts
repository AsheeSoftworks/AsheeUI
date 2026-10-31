/**
 * The native class helper, under the name this package published before 2.8.
 *
 * A rename, not a second helper: `classNames` is the very function `cn` is, so a component
 * that composes classes through it produces what the merge produces. The module announces
 * the move once per process and only outside a production bundle.
 */

import { deprecatedAlias, deprecateMany } from "@asheeui/core";
import { cn } from "./cn";

deprecateMany("@asheeui/native/utils", [
  { from: "classNames", to: "cn", since: "2.8.0" },
]);

/** Join class names, under the name this package published before 2.8. */
export const classNames = deprecatedAlias(cn);
