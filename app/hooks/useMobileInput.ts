// hooks/useMobileInput.ts
import { useEffect, RefObject } from "react";

export const useMobileInput = (inputRef: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    input.addEventListener("touchstart", preventZoom, { passive: false });
    return () => {
      input.removeEventListener("touchstart", preventZoom);
    };
  }, [inputRef]);
};