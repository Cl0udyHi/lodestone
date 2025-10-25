import { useEffect, useRef, RefObject } from "react";

/**
 * Hook that detects clicks outside of the referenced element
 *
 * @param callback - Function to call when a click outside is detected
 * @param enabled - Whether the hook is active (default: true)
 * @returns A ref to attach to the element you want to monitor
 *
 * @example
 * ```tsx
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useOutsideClick(() => setIsOpen(false), isOpen);
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <div>Dropdown content</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  enabled: boolean = true
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent | TouchEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Add a small delay to prevent immediate triggering on the same click that opens the element
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [callback, enabled]);

  return ref as RefObject<T>;
}

/**
 * Alternative hook that accepts multiple refs to monitor
 * Useful when you have multiple elements that should all be considered "inside"
 *
 * @param callback - Function to call when a click outside is detected
 * @param enabled - Whether the hook is active (default: true)
 * @returns An array of refs to attach to elements you want to monitor
 *
 * @example
 * ```tsx
 * function SplitDropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const [buttonRef, menuRef] = useOutsideClickMultiple(() => setIsOpen(false), isOpen);
 *
 *   return (
 *     <>
 *       <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && (
 *         <div ref={menuRef} className="menu">Dropdown content</div>
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
// export function useOutsideClickMultiple<T extends HTMLElement = HTMLElement>(
//   callback: () => void,
//   enabled: boolean = true,
//   refCount: number = 2
// ): RefObject<T>[] {
//   const refs = useRef<RefObject<T>[]>(
//     Array.from({ length: refCount }, () => ({ current: null }))
//   ).current;

//   useEffect(() => {
//     if (!enabled) return;

//     function handleClick(event: MouseEvent | TouchEvent): void {
//       const clickedInside = refs.some(
//         (ref) => ref.current && ref.current.contains(event.target as Node)
//       );

//       if (!clickedInside) {
//         callback();
//       }
//     }

//     const timer = setTimeout(() => {
//       document.addEventListener("mousedown", handleClick);
//       document.addEventListener("touchstart", handleClick);
//     }, 0);

//     return () => {
//       clearTimeout(timer);
//       document.removeEventListener("mousedown", handleClick);
//       document.removeEventListener("touchstart", handleClick);
//     };
//   }, [callback, enabled, refs]);

//   return refs;
// }

/**
 * Hook with additional options for fine-grained control
 *
 * @example
 * ```tsx
 * function AdvancedDropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useOutsideClickAdvanced(() => setIsOpen(false), {
 *     enabled: isOpen,
 *     eventTypes: ['mousedown'],
 *     excludeScrollbar: true
 *   });
 *
 *   return <div ref={ref}>...</div>;
 * }
 * ```
 */
export interface UseOutsideClickOptions {
  /** Whether the hook is active */
  enabled?: boolean;
  /** Event types to listen for (default: ['mousedown', 'touchstart']) */
  eventTypes?: (
    | "mousedown"
    | "mouseup"
    | "touchstart"
    | "touchend"
    | "click"
  )[];
  /** Exclude clicks on the scrollbar */
  excludeScrollbar?: boolean;
}

export function useOutsideClickAdvanced<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  options: UseOutsideClickOptions = {}
): RefObject<T> {
  const {
    enabled = true,
    eventTypes = ["mousedown", "touchstart"],
    excludeScrollbar = false,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent | TouchEvent): void {
      // Exclude scrollbar clicks if option is enabled
      if (excludeScrollbar && event instanceof MouseEvent) {
        const target = event.target as HTMLElement;
        if (target === document.documentElement || target === document.body) {
          const clickedOnScrollbar =
            event.clientX >= document.documentElement.clientWidth ||
            event.clientY >= document.documentElement.clientHeight;

          if (clickedOnScrollbar) return;
        }
      }

      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    const timer = setTimeout(() => {
      eventTypes.forEach((eventType) => {
        document.addEventListener(eventType, handleClick as EventListener);
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      eventTypes.forEach((eventType) => {
        document.removeEventListener(eventType, handleClick as EventListener);
      });
    };
  }, [callback, enabled, eventTypes, excludeScrollbar]);

  return ref as RefObject<T>;
}
