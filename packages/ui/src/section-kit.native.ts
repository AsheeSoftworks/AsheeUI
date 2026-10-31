/**
 * The umbrella's section kit, native branch.
 *
 * The same two names as the web branch. The native renderer's section kit has no `SkipLink`
 * because a device has no tab order to skip, which is why the portable kit exports only the
 * parts both platforms have.
 */

export { ActionGroup, SectionHeading } from "@asheeui/native/section-kit";
