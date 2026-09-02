import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return initialValue;
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initialValue;
      const parsed = JSON.parse(raw) as T;
      return parsed ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`useLocalStorage set ${key} failed:`, e);
    }
  }, [key, value]);

  return [value, setValue];
}

export function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}
