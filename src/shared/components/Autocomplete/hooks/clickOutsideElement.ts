import { MutableRefObject, useEffect, useRef } from "react";

const refStack: MutableRefObject<Element | null>[] = [];

export const useClickOutsideElement = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect((): ReturnType<React.EffectCallback> => {
    refStack.push(ref);

    const listener: EventListener = (event): void => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      if (refStack[refStack.length - 1] === ref) {
        callback();
      }
    };
    document.addEventListener("click", listener);

    return (): void => {
      refStack.pop();
      document.removeEventListener("click", listener);
    };
  }, [ref, callback]);

  return ref;
};
