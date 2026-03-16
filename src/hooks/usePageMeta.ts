import { useEffect } from "react";
import { SITE_URL } from "@/lib/constants";

const DEFAULT_TITLE = "Analía Daconte · Inversiones Inmobiliarias · Mar del Plata";
const DEFAULT_DESC =
  "28 años de trayectoria en el mercado inmobiliario de Mar del Plata. Compra, venta y tasación de propiedades con asesoramiento personalizado.";
const DEFAULT_IMAGE = `${SITE_URL}/images/mdp-aerial-hero.jpg`;

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

interface PageMetaOptions {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

export function usePageMeta({ title, description, image, type = "website" }: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = `${title} | Analía Daconte`;
    const img = image || DEFAULT_IMAGE;
    const url = `${SITE_URL}${window.location.pathname}`;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setCanonical(url);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "Analía Daconte Inversiones Inmobiliarias");
    setMeta("property", "og:locale", "es_AR");

    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("name", "description", DEFAULT_DESC);
      setCanonical(`${SITE_URL}/`);

      setMeta("property", "og:title", DEFAULT_TITLE);
      setMeta("property", "og:description", DEFAULT_DESC);
      setMeta("property", "og:url", `${SITE_URL}/`);
      setMeta("property", "og:image", DEFAULT_IMAGE);
      setMeta("property", "og:type", "website");
      setMeta("property", "og:site_name", "Analía Daconte Inversiones Inmobiliarias");
      setMeta("property", "og:locale", "es_AR");

      setMeta("name", "twitter:title", DEFAULT_TITLE);
      setMeta("name", "twitter:description", DEFAULT_DESC);
      setMeta("name", "twitter:image", DEFAULT_IMAGE);
    };
  }, [title, description, image, type]);
}
