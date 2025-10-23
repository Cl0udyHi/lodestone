import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay = 500) => {
  const [deboundedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value]);

  return deboundedValue;
};
