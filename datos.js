/* ============================================================================
   DATOS DE LA PAGINA
   ----------------------------------------------------------------------------
   Todo lo que se puede cambiar esta ACA. No hace falta tocar nada mas: la
   pagina lee estos valores y arma sola el texto, los botones de WhatsApp y de
   telefono, y el pie.

   Lo que dice <<CAMBIAR>> o esta vacio hay que completarlo antes de publicar.
   ========================================================================== */

const DATOS = {
  // ---- Quién es -----------------------------------------------------------
  nombre: "Pierini Emmanuel",
  titulo: "Lic. en Kinesiología",
  matricula: "1614/2",
  foto: "", // Ruta a una foto tuya o del consultorio. Vacío = sin foto.

  // ---- Contacto -----------------------------------------------------------
  // WhatsApp: se escribe con el 54 y sin el cero. Ej: 5493412345678
  whatsapp: "5493416508941",
  // Teléfono a la vista. Con el 0 y los guiones, como se escribe.
  telefono: "341-650-8941",
  email: "", // <<CAMBIAR>>

  // ---- Dónde --------------------------------------------------------------
  direccion: "Mendoza 6461",
  ciudad: "Rosario",
  mapa: "", // Link de Google Maps del consultorio. Opcional pero muy útil.
  horario: "Lunes a viernes de 8 a 12 y de 15 a 18 hs",

  // ---- Qué ofrece ---------------------------------------------------------
  titular: "Kinesiofit",
  bajada:
    "Atención de kinesiología para recuperar el movimiento y dejar atrás " +
    "el dolor. Evaluación, tratamiento y ejercicios para seguir en tu casa.",

  // ---- Cómo reservar ------------------------------------------------------
  // Si Formspree está configurado, el formulario manda el mensaje ahí.
  // Si está vacío, el formulario arma el mensaje y lo abre en WhatsApp.
  formularioEndpoint: "",
  nombreFormulario: "Formulario de contacto",

  // ---- SEO ----------------------------------------------------------------
  tituloPagina: "Kinesiología | Atención y tratamiento del dolor",
  descripcion:
    "Consultorio de kinesiología. Evaluación, tratamiento y ejercicios " +
    "para recuperar el movimiento. Pedí turno por WhatsApp o por teléfono.",
};

/* ============================================================================
   ARMADO DE LA PAGINA
   Acá abajo está toda la lógica. No hace falta tocarlo salvo que falte algo.
   ========================================================================== */

const d = DATOS;

/* ---- Encabezado ---------------------------------------------------------- */

document.title = `${d.tituloPagina} — ${d.nombre}`;

/* El retrato de la portada se quitó: en su lugar va el logo de Kinesiofit.
   El bloque queda en la página por si algún día se quiere volver a poner una
   foto, así que se pregunta si existe antes de tocarlo en vez de dar por hecho
   que está. Si no está, no se rompe nada. */
const conFoto = document.querySelector("#retrato");
if (conFoto) {
  if (d.foto) {
    conFoto.src = d.foto;
    conFoto.hidden = false;
  } else {
    conFoto.hidden = true;
  }
}

const firma = document.querySelector("#firma");
firma.textContent = [d.titulo, d.nombre].filter(Boolean).join(" · ");
if (d.matricula) {
  const mat = document.createElement("p");
  mat.className = "matricula";
  mat.textContent = `Matrícula ${d.matricula}`;
  firma.after(mat);
}

/* ---- Botones de contacto ------------------------------------------------- */

// Arma el link de WhatsApp con un mensaje ya escrito, que es lo que hace que
// la gente empiece a escribir en vez de solo abrir el chat en blanco.
function mensajeWhatsapp() {
  const saludo =
    d.nombre ? `Hola, soy un paciente de ${d.nombre}.` : "Hola,";
  return encodeURIComponent(
    `${saludo} Quisiera pedir un turno para kinesiología. ¿Tienen horario?`
  );
}

for (const nodo of document.querySelectorAll("[data-whatsapp]")) {
  if (!d.whatsapp) {
    nodo.dataset.falta = "whatsapp";
    continue;
  }
  nodo.href = `https://wa.me/${d.whatsapp}?text=${mensajeWhatsapp()}`;
}

for (const nodo of document.querySelectorAll("[data-telefono]")) {
  if (!d.telefono) {
    nodo.dataset.falta = "telefono";
    continue;
  }
  // Para el link se limpian los espacios y guiones; lo que se muestra lleva
  // los guiones, como la gente lo escribe.
  nodo.href = `tel:${d.telefono.replace(/[^\d+]/g, "")}`;
  // El numero SOLO se escribe si el nodo lo pide con data-telefono-texto. Si no,
  // se pisa la etiqueta del boton ("Llamar") y queda un boton que solo dice un
  // numero, que no se sabe que hacer con el.
  if (nodo.hasAttribute("data-telefono-texto")) {
    nodo.textContent = d.telefono;
  }
}

for (const nodo of document.querySelectorAll("[data-email]")) {
  if (!d.email) {
    nodo.dataset.falta = "email";
    continue;
  }
  nodo.href = `mailto:${d.email}`;
  nodo.textContent = d.email;
}

/* ---- Datos sueltos ------------------------------------------------------- */

for (const nodo of document.querySelectorAll("[data-valor]")) {
  const clave = nodo.dataset.valor;
  const valor = d[clave];
  if (!valor) {
    // Sin dato no se muestra el bloque: es preferible que falte una línea a
    // que diga "null" o quede un espacio raro.
    const bloque = nodo.closest("[data-bloque]");
    if (bloque) bloque.hidden = true;
    continue;
  }
  if (nodo.tagName === "A") {
    nodo.href = d[clave];
    nodo.textContent = d[clave];
  } else {
    nodo.textContent = valor;
  }
}

const conMapa = document.querySelector("[data-mapa]");
if (conMapa) {
  if (d.mapa) {
    conMapa.href = d.mapa;
  } else {
    const bloque = conMapa.closest("[data-bloque]");
    if (bloque) bloque.hidden = true;
  }
}

/* ---- Botones que faltan configurados ------------------------------------- */

// Si falta un dato, el botón no manda a ninguna parte: mejor que parezca
// apagado a que lleve a un link roto. Se avisa en pantalla para que quede
// claro que es un dato sin completar y no una página que anda rota.
const faltan = new Set(
  [...document.querySelectorAll("[data-falta]")].map((n) => n.dataset.falta)
);
// Ojo: un Set no tiene "length", tiene "size". Con ".length" esto nunca entra
// y el aviso se queda sin mostrar, sin ningun error a la vista.
if (faltan.size) {
  const nombres = {
    whatsapp: "el número de WhatsApp",
    telefono: "el teléfono",
    email: "el email",
  };
  const lista = [...faltan].map((k) => nombres[k] || k).join(", ");
  document
    .querySelector("#pendientes")
    .append(`Falta completar: ${lista}. Está en el archivo datos.js`);
}

/* ---- Formulario ---------------------------------------------------------- */

const formulario = document.querySelector("#form-contacto");
const resultado = document.querySelector("#form-resultado");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = new FormData(formulario);

  if (d.formularioEndpoint) {
    // Hay destino real: se manda y se avisa.
    const boton = formulario.querySelector("button[type=submit]");
    boton.disabled = true;
    boton.textContent = "Enviando...";
    try {
      const respuesta = await fetch(d.formularioEndpoint, {
        method: "POST",
        body: datos,
        headers: { Accept: "application/json" },
      });
      if (!respuesta.ok) throw new Error("El servidor no aceptó el mensaje.");
      formulario.reset();
      resultado.textContent = "Listo, llegó tu mensaje. Te responden enseguida.";
      resultado.className = "resultado ok";
    } catch (error) {
      resultado.textContent = `No se pudo enviar: ${error.message}`;
      resultado.className = "resultado error";
    } finally {
      boton.disabled = false;
      boton.textContent = "Enviar mensaje";
    }
    return;
  }

  // Sin destino configurado: el mensaje se arma y se abre en WhatsApp. Es lo
  // que hace que el formulario sirva para algo desde el primer día, sin
  // contratar ningún servicio.
  if (!d.whatsapp) {
    resultado.textContent = "El formulario todavía no tiene dónde enviarse.";
    resultado.className = "resultado error";
    return;
  }
  const partes = [
    `Hola, soy ${datos.get("nombre") || "un paciente"}.`,
    datos.get("mensaje") ? `Consulta: ${datos.get("mensaje")}` : "",
  ].filter(Boolean);
  window.open(
    `https://wa.me/${d.whatsapp}?text=${encodeURIComponent(partes.join(" "))}`,
    "_blank",
    "noopener"
  );
  resultado.textContent =
    "Te abrimos WhatsApp con el mensaje escrito. Solo hay que enviarlo.";
  resultado.className = "resultado ok";
});

/* ---- El año del pie ------------------------------------------------------ */

document.querySelector("#anio").textContent = new Date().getFullYear();
