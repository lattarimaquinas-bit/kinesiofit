/* ============================================================================
   Lo que se mueve: aparecen las cosas al ir bajando, y la barra de arriba
   marca en qué sección estás.
   ----------------------------------------------------------------------------
   Va aparte de datos.js a propósito. datos.js es lo que la persona va a
   tocar; este archivo es movimiento y no hay por qué tocarlo nunca. Si algo
   de acá se rompe, la página sigue mostrando todo el contenido: solo deja de
   moverse.
   ========================================================================== */

const SIN_MOVIMIENTO = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---- Las cosas aparecen al entrar en pantalla ---------------------------- */

/* El que mira algo ya es porque apareció por lo menos una vez. Por eso, si el
   navegador no soporta el API, se muestra todo de una y no queda invisible. */
if ("IntersectionObserver" in window && !SIN_MOVIMIENTO) {
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target); // una vez que apareció, listo
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  for (const nodo of document.querySelectorAll(".aparece")) {
    observador.observe(nodo);
  }
} else {
  for (const nodo of document.querySelectorAll(".aparece")) {
    nodo.classList.add("visible");
  }
}

/* ---- La barra marca la sección que estás mirando ------------------------- */

const enlaces = [...document.querySelectorAll("[data-enlace]")];
const secciones = enlaces
  .map((enlace) => document.getElementById(enlace.dataset.enlace))
  .filter(Boolean);

if ("IntersectionObserver" in window && secciones.length) {
  // rootMargin chopado por arriba: marca la sección que ocupa la parte de
  // arriba de la pantalla, que es la que se está leyendo.
  const marcar = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        for (const enlace of enlaces) {
          enlace.classList.toggle(
            "activo",
            enlace.dataset.enlace === entrada.target.id
          );
        }
      }
    },
    { rootMargin: "-25% 0px -60% 0px" }
  );
  for (const seccion of secciones) marcar.observe(seccion);
}