"use client";

import { useCallback, useEffect, useRef } from "react";

export function usePausableTimeout(callback: () => void, delay?: number) {
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const remainingRef = useRef<number>(delay ?? 0);

  const pause = useCallback(() => {
    if (!delay || delay <= 0) return;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current -= Date.now() - startRef.current;
    }
  }, [delay]);

  const resume = useCallback(() => {
    if (!delay || delay <= 0 || remainingRef.current <= 0) return;
    startRef.current = Date.now();
    timerRef.current = window.setTimeout(callback, remainingRef.current);
  }, [callback, delay]);

  useEffect(() => {
    if (delay && delay > 0) {
      resume();
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [resume, delay]);

  return { pause, resume };
}
