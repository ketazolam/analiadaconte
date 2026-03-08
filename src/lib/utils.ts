import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Sanitize barrio field — scraper often puts garbage here */
export function sanitizeBarrio(barrio: string | null | undefined): string | null {
  if (!barrio) return null;
  const trimmed = barrio.trim();
  if (trimmed.length > 40) return null;
  if (trimmed.includes("@")) return null;
  if (/^(las fotos|planta baja|nuestra|enterate|ingresos)/i.test(trimmed)) return null;
  return trimmed;
}
