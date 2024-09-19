import { useEffect } from "react";

export function useDisableBodyScroll(disableScroll: boolean) {
  useEffect(() => {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [disableScroll]);
}
