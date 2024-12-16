import { useEffect, useRef, useState } from 'react'

/**
 * creates a ref and a state, and sets the state to false
 * when clicking outside of the ref.
 * Returns state, set function and a ref
 *
 * @return [value, setValue, ref]
 */
export function useOutsideRef() {
  const ref = useRef(null)
  const [isOutside, setIsOutside] = useState(false)

  const handleClick = ({ target } = {}) => {
    if (ref.current && !ref.current.contains(target)) {
      setIsOutside(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick, true)
    return () => {
      document.removeEventListener('mousedown', handleClick, true)
    }
  }, [])

  return [isOutside, setIsOutside, ref]
}

export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
