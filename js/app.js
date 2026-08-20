/* ============================================================
   app.js — Configuración central, navegación de capítulos,
   barra de progreso, revelado al hacer scroll y persistencia.
   ============================================================ */

/* ---------- CONFIGURACIÓN CENTRALIZADA ----------
   Cambia aquí los nombres, fechas y frases principales.
   No es necesario buscar en el resto del proyecto. */
const anniversaryConfig = {

  couple: {
    person1: 'FILIO CARRASCO SAUÑE',
    person2: 'VALERIA MAXIMILIANA'
  },

  dates: {
    // Fecha en la que comenzó la relación (para el contador del capítulo 4)
    relationshipStart: '2024-06-29',
    // Fecha del aniversario que se celebra
    anniversary: '2026-06-029'
  },

  messages: {
    welcome: 'Tengo algo preparado para ti ❤️',
    welcomeSub: 'Nuestra historia merece ser recordada...',
    final: 'Te elegiría una y mil veces.'
  },

  // Configuración de efectos: ajusta si el dispositivo es muy limitado
  effects: {
    maxFloatingHearts: 12,
    maxExplosionHearts: 18,
    maxRainHearts: 26,
    maxConfetti: 20
  }
};

/* ---------- DATOS DE LA HISTORIA ----------
   Array fácil de editar: agrega, quita o modifica recuerdos.
   Se usa para generar el timeline, las tarjetas y la galería. */
const ourStory = [
  {
    date: '2020-01-01',
    title: 'Cuando comenzó todo',
    description: 'Ese día quizás ninguno de los dos imaginaba todo lo que vendría después.',
    image: 'assets/images/historia/01.jpg'
  },
  {
    date: '2020-03-15',
    title: 'Nuestra primera salida',
    description: 'Todavía recuerdo cada detalle de ese día.',
    image: 'assets/images/historia/02.jpg'
  },
  {
    date: '2021-07-10',
    title: 'Nuestro primer viaje',
    description: 'Descubrimos juntos un lugar nuevo, y también un poco más el uno del otro.',
    image: 'assets/images/historia/03.jpg'
  },
  {
    date: '2023-11-02',
    title: 'Un momento inolvidable',
    description: 'Uno de esos días que se quedan guardados para siempre.',
    image: 'assets/images/historia/04.jpg'
  },
  {
    date: '2024-05-10',
    title: 'Un recuerdo especial',
    description: 'Un día lleno de emociones y momentos compartidos.',
    image: 'assets/images/historia/05.jpg'
  },
  {
    date: '2024-08-15',
    title: 'Un día lleno de amor',
    description: 'Un recuerdo que nunca olvidaré ❤️',
    image: 'assets/images/historia/06.jpg'
  },
];

/* ---------- Frases secretas para las "fotos escondidas" ---------- */
const hiddenMemories = [
  {
    caption: 'Encontraste uno de mis recuerdos favoritos ❤️',
    image: 'assets/images/galeria/secreto-1.jpg'
  },
  {
    caption: 'Este momento significó mucho para mí ❤️',
    image: 'assets/images/galeria/secreto-2.jpg'
  },
  {
    caption: 'Este momento significó mucho para mí ❤️',
    image: 'assets/images/galeria/secreto-3.jpg'
  }
];

/* ---------- Frases para la galería de recuerdos (estilo Polaroid) ---------- */
const galleryMemories = [
  { image: 'assets/images/galeria/01.jpg', caption: 'Ese día ❤️. Uno de mis recuerdos favoritos contigo.' },
  { image: 'assets/images/galeria/02.jpg', caption: 'Nunca voy a olvidar esta sonrisa.' },
  { image: 'assets/images/galeria/03.jpg', caption: 'Contigo, hasta lo simple se vuelve especial.' },
  { image: 'assets/images/galeria/04.jpg', caption: 'Otro recuerdo más para nuestra colección ❤️' },
  { image: 'assets/images/galeria/05.jpg', caption: 'Conoci el verdadero amor ❤️' },
  { image: 'assets/images/galeria/06.jpg', caption: 'Un recuerdo que nunca olvidaré ❤️' },
];

/* ============================================================
   ESTADO GLOBAL DE NAVEGACIÓN
   ============================================================ */
const totalChapters = 7;
let currentChapter = 0;
let isTransitioning = false;

/* ============================================================
   UTILIDADES
   ============================================================ */

/**
 * Ejecuta un efecto de escritura progresiva sobre un elemento.
 * Reutilizable: typeWriter(elemento, texto, velocidadMs)
 */
function typeWriter(element, text, speed = 35) {
  if (!element) return;
  element.textContent = '';
  element.classList.add('escritura-cursor');

  let index = 0;
  const escribir = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(escribir, speed);
    } else {
      element.classList.remove('escritura-cursor');
    }
  };
  escribir();
}

/**
 * Prepara el revelado de elementos al entrar en pantalla,
 * usando IntersectionObserver (sin listeners de scroll).
 */
function initScrollReveal(root = document) {
  const targets = root.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  targets.forEach((el) => observer.observe(el));
}

/* ============================================================
   NAVEGACIÓN ENTRE CAPÍTULOS
   ============================================================ */

function updateProgress() {
  const relleno = document.getElementById('progreso-relleno');
  const barra = document.querySelector('.progreso__barra');
  const puntosContenedor = document.getElementById('progreso-puntos');
  if (!relleno || !puntosContenedor) return;

  const porcentaje = Math.round(((currentChapter + 1) / totalChapters) * 100);
  relleno.style.width = porcentaje + '%';
  if (barra) barra.setAttribute('aria-valuenow', String(porcentaje));

  // Generar puntos si aún no existen
  if (puntosContenedor.children.length === 0) {
    for (let i = 0; i < totalChapters; i++) {
      const punto = document.createElement('span');
      punto.className = 'progreso__punto';
      puntosContenedor.appendChild(punto);
    }
  }

  Array.from(puntosContenedor.children).forEach((punto, i) => {
    punto.classList.toggle('progreso__punto--activo', i === currentChapter);
    punto.classList.toggle('progreso__punto--visitado', i < currentChapter);
  });
}

/**
 * Cambia al capítulo indicado, gestionando transición,
 * scroll, progreso y efectos particulares.
 */
function goToChapter(chapterIndex) {
  if (isTransitioning) return;
  if (chapterIndex < 0 || chapterIndex >= totalChapters) return;

  isTransitioning = true;

  const actual = document.getElementById('capitulo-' + currentChapter);
  const siguiente = document.getElementById('capitulo-' + chapterIndex);

  const mostrarSiguiente = () => {
    if (actual) {
      actual.classList.remove('capitulo--activa', 'capitulo--activo', 'capitulo--saliendo');
      actual.classList.remove('capitulo--activo');
    }
    currentChapter = chapterIndex;

    if (siguiente) {
      siguiente.classList.add('capitulo--activo');
      initScrollReveal(siguiente);
    }

    updateProgress();
    updateNavButtons();
    guardarProgreso();

    // Efectos particulares de ciertos capítulos
    if (chapterIndex === 3 && typeof updateCounter === 'function') {
      updateCounter();
    }
    if (chapterIndex === 6 && typeof renderLetter === 'function') {
      renderLetter();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    isTransitioning = false;
  };

  if (actual) {
    actual.classList.add('capitulo--saliendo');
    setTimeout(mostrarSiguiente, 280);
  } else {
    mostrarSiguiente();
  }
}

function updateNavButtons() {
  const btnAnterior = document.getElementById('btn-anterior');
  const btnSiguiente = document.getElementById('btn-siguiente');
  if (!btnAnterior || !btnSiguiente) return;

  btnAnterior.disabled = currentChapter === 0;

  if (currentChapter === totalChapters - 1) {
    btnSiguiente.disabled = true;
    btnSiguiente.style.opacity = '0';
    btnSiguiente.style.pointerEvents = 'none';
  } else {
    btnSiguiente.disabled = false;
    btnSiguiente.style.opacity = '1';
    btnSiguiente.style.pointerEvents = 'auto';
  }
}

/* ---------- Persistencia temporal (sessionStorage) ---------- */
function guardarProgreso() {
  try {
    sessionStorage.setItem('aniversario_capitulo', String(currentChapter));
  } catch (e) {
    // sessionStorage no disponible: la experiencia sigue funcionando igual
  }
}

function recuperarProgreso() {
  try {
    const guardado = sessionStorage.getItem('aniversario_capitulo');
    return guardado !== null ? parseInt(guardado, 10) : 0;
  } catch (e) {
    return 0;
  }
}

function reiniciarExperiencia() {
  try {
    sessionStorage.removeItem('aniversario_capitulo');
  } catch (e) {
    /* noop */
  }
  currentChapter = 0;
  document.querySelectorAll('.capitulo').forEach((cap, i) => {
    cap.classList.toggle('capitulo--activo', i === 0);
  });
  document.getElementById('gran-final')?.classList.remove('oculto');
  document.getElementById('final-mensaje')?.classList.add('oculto');
  updateProgress();
  updateNavButtons();
  document.getElementById('experiencia').classList.add('oculto');
  document.getElementById('portada').classList.remove('oculto', 'portada--saliendo');
  window.scrollTo({ top: 0 });
}

/* ============================================================
   INICIO DE LA EXPERIENCIA (pantalla de bienvenida)
   ============================================================ */
function iniciarExperiencia() {
  const portada = document.getElementById('portada');
  const experiencia = document.getElementById('experiencia');

  // Animación de corazones al comenzar
  if (typeof createHeartExplosion === 'function') {
    const rect = document.getElementById('btn-descubrir').getBoundingClientRect();
    createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  // Intentar iniciar música (ya hay interacción del usuario)
  if (typeof startMusic === 'function') {
    startMusic();
  }

  portada.classList.add('portada--saliendo');

  setTimeout(() => {
    portada.classList.add('oculto');
    experiencia.classList.remove('oculto');

    const capituloInicial = recuperarProgreso();
    currentChapter = -1; // fuerza la transición inicial en goToChapter
    document.querySelectorAll('.capitulo').forEach((cap) => cap.classList.remove('capitulo--activo'));

    currentChapter = capituloInicial >= 0 && capituloInicial < totalChapters ? capituloInicial : 0;
    const inicial = document.getElementById('capitulo-' + currentChapter);
    if (inicial) {
      inicial.classList.add('capitulo--activo');
      initScrollReveal(inicial);
    }
    updateProgress();
    updateNavButtons();
    window.scrollTo({ top: 0 });
  }, 650);
}

/* ============================================================
   INICIALIZACIÓN GENERAL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Botón de portada
  const btnDescubrir = document.getElementById('btn-descubrir');
  if (btnDescubrir) {
    btnDescubrir.addEventListener('click', iniciarExperiencia);
  }

  // Navegación
  document.getElementById('btn-anterior')?.addEventListener('click', () => goToChapter(currentChapter - 1));
  document.getElementById('btn-siguiente')?.addEventListener('click', () => goToChapter(currentChapter + 1));

  // Botón de reinicio (aparece en el gran final)
  document.getElementById('btn-reiniciar')?.addEventListener('click', reiniciarExperiencia);

  // Revelado inicial para elementos ya visibles en portada
  initScrollReveal();
});
