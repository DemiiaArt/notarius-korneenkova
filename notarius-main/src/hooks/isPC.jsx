import { useState, useEffect, useCallback } from "react";

export function useIsPC(breakpoint = 1024){
  const [isPC, setIsPC] = useState(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= breakpoint;
  });

  const handleResize = useCallback(() => {
    const newIsPC = window.innerWidth >= breakpoint;
    setIsPC(prevIsPC => {
      // Only update if the value actually changed
      if (prevIsPC !== newIsPC) {
        return newIsPC;
      }
      return prevIsPC;
    });
  }, [breakpoint]);

  useEffect(() => {
    // Debounce resize events to prevent excessive re-renders
    let timeoutId;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  return isPC;
}