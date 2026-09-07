"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query como fuente externa. `useSyncExternalStore` es la vía correcta
 * para esto: nada de leer el ancho en un efecto y provocar un render en
 * cascada, y en servidor devuelve siempre `false` sin desajustar la hidratación.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
