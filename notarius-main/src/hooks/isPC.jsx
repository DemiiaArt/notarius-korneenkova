import { useState, useEffect } from "react";

export function useIsPC(breakpoint = 1024){
  const [isPC, setIsPC] = useState(() => window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsPC(window.innerWidth >= breakpoint);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint])

  return isPC;
}