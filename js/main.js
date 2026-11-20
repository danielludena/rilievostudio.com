/* ==========================================================
   Rilievo Studio — interacción
   ========================================================== */
(function () {
  "use strict";

  // ---- Datos de contacto (cámbialos aquí si algún día cambian) ----
  var WHATSAPP = "593968665914";
  var INSTAGRAM = "https://instagram.com/rilievostudioec";

  function enlaceWhatsApp(texto) {
    return "https://wa.me/" + WHATSAPP + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }

  // Todos los enlaces con data-wa abren WhatsApp con su mensaje
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = enlaceWhatsApp(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-ig]").forEach(function (a) {
    a.href = INSTAGRAM;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // ---- Encabezado: borde al hacer scroll y menú móvil ----
  var encabezado = document.querySelector(".encabezado");
  var menu = document.getElementById("menu");
  var botonMenu = document.querySelector(".menu-boton");
  window.addEventListener("scroll", function () {
    encabezado.classList.toggle("con-borde", window.scrollY > 10);
  }, { passive: true });
  botonMenu.addEventListener("click", function () {
    var abierto = menu.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", abierto);
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("abierto");
      botonMenu.setAttribute("aria-expanded", "false");
    });
  });

  // ---- Aparición al hacer scroll ----
  var revelables = document.querySelectorAll(".revelar, .espiral-grande");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revelables.forEach(function (el) { obs.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---- Galería ----
  var fotos = (window.GALERIA || []).filter(function (f) { return f && f.foto; });
  var galeria = document.getElementById("galeria-grid");
  var filtros = document.getElementById("filtros");
  var vacia = document.getElementById("galeria-vacia");
  var visibles = [];
  var actual = 0;
  var nombres = { figuras: "Figuras", regalos: "Regalos y recuerdos", decoracion: "Decoración" };

  function pintarGaleria(cat) {
    visibles = fotos.filter(function (f) { return cat === "todo" || f.categoria === cat; });
    galeria.innerHTML = "";
    visibles.forEach(function (f, i) {
      var b = document.createElement("button");
      b.className = "foto";
      b.type = "button";
      b.setAttribute("aria-label", "Ver " + (f.titulo || "foto") + " en grande");
      var img = document.createElement("img");
      img.src = f.foto; img.alt = f.titulo || ""; img.loading = "lazy";
      b.appendChild(img);
      if (f.titulo) {
        var t = document.createElement("span");
        t.className = "foto__texto"; t.textContent = f.titulo;
        b.appendChild(t);
      }
      b.addEventListener("click", function () { abrirVisor(i); });
      galeria.appendChild(b);
    });
  }

  if (fotos.length === 0) {
    filtros.hidden = true;
    galeria.hidden = true;
    vacia.hidden = false;
  } else {
    vacia.hidden = true;
    // Solo mostrar filtros de categorías que tienen fotos
    var cats = {};
    fotos.forEach(function (f) { cats[f.categoria] = true; });
    filtros.querySelectorAll(".filtro").forEach(function (b) {
      var c = b.getAttribute("data-cat");
      if (c !== "todo" && !cats[c]) b.hidden = true;
      b.addEventListener("click", function () {
        filtros.querySelectorAll(".filtro").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        pintarGaleria(c);
      });
    });
    pintarGaleria("todo");
  }

  // Visor de fotos
  var visor = document.getElementById("visor");
  var visorImg = visor.querySelector("img");
  var visorTxt = visor.querySelector("figcaption");
  function mostrar(i) {
    actual = (i + visibles.length) % visibles.length;
    var f = visibles[actual];
    visorImg.src = f.foto; visorImg.alt = f.titulo || "";
    visorTxt.textContent = (f.titulo || "") + (nombres[f.categoria] ? " · " + nombres[f.categoria] : "");
  }
  function abrirVisor(i) { mostrar(i); visor.classList.add("abierto"); visor.querySelector(".visor__cerrar").focus(); }
  function cerrarVisor() { visor.classList.remove("abierto"); }
  visor.querySelector(".visor__cerrar").addEventListener("click", cerrarVisor);
  visor.querySelector(".visor__nav--prev").addEventListener("click", function () { mostrar(actual - 1); });
  visor.querySelector(".visor__nav--next").addEventListener("click", function () { mostrar(actual + 1); });
  visor.addEventListener("click", function (e) { if (e.target === visor) cerrarVisor(); });
  document.addEventListener("keydown", function (e) {
    if (!visor.classList.contains("abierto")) return;
    if (e.key === "Escape") cerrarVisor();
    if (e.key === "ArrowLeft") mostrar(actual - 1);
    if (e.key === "ArrowRight") mostrar(actual + 1);
  });

  // ---- Calculadora de capas ----
  var altura = document.getElementById("altura");
  var alturaTxt = document.getElementById("altura-valor");
  var capasTxt = document.getElementById("capas");
  var capaTxt = document.getElementById("capa-texto");
  var pila = document.querySelector(".pila__capas");
  var grosor = 0.08;
  var mostrado = 0;
  var anim;

  function animarNumero(destino) {
    cancelAnimationFrame(anim);
    var inicio = mostrado, t0 = performance.now(), dur = 450;
    (function paso(t) {
      var p = Math.min(1, (t - t0) / dur);
      p = 1 - Math.pow(1 - p, 3);
      mostrado = Math.round(inicio + (destino - inicio) * p);
      capasTxt.textContent = mostrado.toLocaleString("es-EC");
      if (p < 1) anim = requestAnimationFrame(paso);
    })(t0);
  }
  function calcular() {
    var cm = parseInt(altura.value, 10);
    alturaTxt.textContent = cm + " cm";
    var capas = Math.round((cm * 10) / grosor);
    animarNumero(capas);
    capaTxt.textContent = String(grosor).replace(".", ",") + " mm";
    pila.style.height = Math.max(6, (cm / 30) * 100) + "%";
    pila.style.setProperty("--grosor", grosor === 0.08 ? "1px" : "2.5px");
    pila.style.setProperty("--hueco", grosor === 0.08 ? "1.5px" : "3.5px");
  }
  altura.addEventListener("input", calcular);
  document.querySelectorAll("[data-grosor]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-grosor]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      grosor = parseFloat(b.getAttribute("data-grosor"));
      calcular();
    });
  });
  calcular();

  // ---- Arma tu pedido ----
  var form = document.getElementById("form-pedido");
  var previa = document.getElementById("vista-previa");
  var ciudadOtra = document.getElementById("ciudad-otra");

  function valor(nombre) {
    var el = form.querySelector('[name="' + nombre + '"]:checked');
    return el ? el.value : "";
  }
  function armarMensaje() {
    var tipo = valor("tipo");
    var tam = valor("tamano");
    var ciudad = valor("ciudad");
    if (ciudad === "Otra ciudad") {
      ciudad = ciudadOtra.value.trim() ? ciudadOtra.value.trim() : "Otra ciudad de Ecuador";
    }
    var idea = form.idea.value.trim();
    var nombre = form.nombre.value.trim();
    var l = ["¡Hola, Rilievo Studio! 👋 Quiero cotizar una pieza."];
    if (tipo) l.push("• Tipo: " + tipo);
    if (tam) l.push("• Tamaño: " + tam);
    if (idea) l.push("• Mi idea: " + idea);
    if (ciudad) l.push("• Entrega en: " + ciudad);
    if (nombre) l.push("• Mi nombre: " + nombre);
    return l.join("\n");
  }
  function actualizar() {
    ciudadOtra.hidden = valor("ciudad") !== "Otra ciudad";
    previa.textContent = armarMensaje();
  }
  form.addEventListener("input", actualizar);
  form.addEventListener("change", actualizar);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    window.open(enlaceWhatsApp(armarMensaje()), "_blank", "noopener");
  });
  actualizar();

  // Botones "Pedir esto" de las tarjetas: preseleccionan el tipo
  document.querySelectorAll("[data-pedir]").forEach(function (b) {
    b.addEventListener("click", function () {
      var radio = form.querySelector('[name="tipo"][value="' + b.getAttribute("data-pedir") + '"]');
      if (radio) { radio.checked = true; actualizar(); }
    });
  });

  // Año del pie
  document.getElementById("anio").textContent = new Date().getFullYear();
})();
