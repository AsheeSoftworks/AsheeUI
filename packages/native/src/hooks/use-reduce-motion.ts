/**
 * The platform's motion preference, for the native package.
 *
 * The web asks a media query whether the reader has asked for less motion. The platform
 * has no media query; it has an accessibility setting of its own, which is the same
 * question asked in the platform's vocabulary, and it can change while a screen is on —
 * a reader can turn it on in the middle of using one. So this is a hook rather than a
 * value read once: it reports the setting and follows it.
 *
 * A component that loops uses it to decide whether to loop at all. The setting is a
 * request rather than a prohibition on motion, and the framework honours it as one: the
 * content is shown standing still, where it can still be read, rather than hidden.
 */

import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Read the platform's motion preference.
 *
 * @returns Whether the platform asks for less motion.
 *
 * @example
 * ```tsx
 * const reduceMotion = useReduceMotion();
 *
 * // A loop yields; a state change that explains something still happens.
 * const moves = isAnimated && !reduceMotion;
 * ```
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let answered = false;

    void AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        // A slow answer must not overwrite a newer one: the setting can change between the
        // question and its answer.
        if (!answered) {
          setReduceMotion(enabled);
        }
      })
      // A platform that cannot answer is not a platform that asked for less motion, and an
      // unhandled rejection is not a way to say so.
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        answered = true;
        setReduceMotion(enabled);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
