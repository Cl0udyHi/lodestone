import { useEffect, useState, useRef } from "react";

interface UseIsVisibleOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

/**
 * Custom hook to detect if an element is visible in the viewport
 * @param options - Intersection Observer options
 * @param options.threshold - Percentage of element visibility (0 to 1)
 * @param options.root - Root element for intersection (null = viewport)
 * @param options.rootMargin - Margin around root element
 * @returns Returns ref and visibility state
 */
export function useIsVisible<T extends Element = HTMLDivElement>(
  options: UseIsVisibleOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0, root = null, rootMargin = "0px" } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin]);

  return [elementRef, isVisible];
}

// Example usage:
// const [ref, isVisible] = useIsVisible({ threshold: 0.5 });
//
// <div ref={ref}>
//   {isVisible ? 'I am visible!' : 'I am hidden!'}
// </div>
