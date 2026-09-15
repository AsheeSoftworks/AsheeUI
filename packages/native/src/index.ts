/**
 * The native package's public surface.
 *
 * The native implementation shares the framework's component vocabulary, its prop
 * contracts and its design language with the web implementation, and shares none of
 * its source. An application importing from `@asheeui/native` therefore finds the
 * components it already knows, behaving the way the platform behaves.
 */

export * from "./components/button";
export * from "./config/resolve-config";
export * from "./provider/AsheeNativeProvider";
