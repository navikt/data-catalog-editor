import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useDebouncedState<T>(initialValue: T, delay: number): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      },
      [value]
  );

  return [debouncedValue, setValue];
}

export function useForceUpdate() {
  const [val, setVal] = useState(true);
  return () => setVal(!val);
}

export function useAwait<T>(p: Promise<T>) {
  const update = useForceUpdate()

  useEffect(() => {
    (async () => {
      await p
      update()
    })()
  }, [])
}