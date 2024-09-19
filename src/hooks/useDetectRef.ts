import React, { useEffect } from "react";

export function useDetectRef(
  ref: React.RefObject<Node>,
  handler: (event: Event) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !ref.current ||
        (event.target instanceof Node && ref.current.contains(event.target))
      ) {
        return;
      }
      handler(event);
    };

    // Delay adding the event listener to avoid immediate close
    setTimeout(() => {
      document.addEventListener("mousedown", listener);
    }, 0);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
}
