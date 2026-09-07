"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { DICTIONARIES, type Dictionary, type Lang } from "@/lib/content";

const STORAGE_KEY = "im-lang";
const EVENT = "im-lang-change";

/**
 * El idioma elegido vive en localStorage, que es un almacén externo a React.
 * `useSyncExternalStore` lo lee sin efectos ni renders en cascada, y el
 * snapshot de servidor fija "es" para que el HTML servido y el hidratado
 * coincidan siempre.
 */
function readLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" ? "en" : "es";
  } catch {
    // Navegación privada o almacenamiento bloqueado: castellano por defecto.
    return "es";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

interface LangContextValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "es" as Lang);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sin persistencia, pero el cambio de idioma sigue aplicándose.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  // El atributo lang del documento debe seguir al idioma mostrado: de ello
  // dependen los lectores de pantalla y el guionado del navegador.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      t: DICTIONARIES[lang],
      setLang,
      toggle: () => setLang(lang === "es" ? "en" : "es"),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang debe usarse dentro de <LangProvider>");
  return ctx;
}
