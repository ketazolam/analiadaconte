export const smoothScrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
};
