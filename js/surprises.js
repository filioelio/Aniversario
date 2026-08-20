/* ============================================================
   surprises.js — Razones para amarte, contador de tiempo juntos,
   pregunta "¿me amas?", caja de regalo, corazón gigante,
   carta final y gran final. El corazón emocional de la experiencia.
   ============================================================ */

/* ---------- Frases editables: "cosas que amo de ti" ---------- */
const reasonsILoveYou = [
  'Tu sonrisa',
  'La manera en que me miras',
  'Cómo conviertes días normales en recuerdos especiales',
  'Tu forma de hacerme reír',
  'Cada momento que hemos construido juntos',
  'Tu paciencia conmigo',
  'La forma en que me abrazas'
];

/* ---------- Mensajes sorpresa (Easter eggs) ---------- */
const surpriseMessages = [
  'Te amo ❤️',
  'Qué suerte encontrarte.',
  'Mi lugar favorito es contigo.',
  'Todavía nos quedan muchas aventuras.'
];

/* ---------- Párrafos de la carta final (editables) ---------- */
const finalLetterParagraphs = [
  'Después de todos estos recuerdos solo quiero decirte algo...',
  'Gracias por cada momento, cada sonrisa, cada aventura y cada instante que hemos construido.',
  'Nuestra historia todavía tiene muchísimas páginas por escribir.',
  'Y quiero seguir escribiéndolas contigo.',
  'Feliz aniversario, mi amor. ❤️'
];

/* ============================================================
   SECCIÓN "LO QUE AMO DE TI"
   ============================================================ */
function renderReasons() {
  const contenedor = document.getElementById('razones-contenedor');
  if (!contenedor || !Array.isArray(reasonsILoveYou)) return;

  // Orden aleatorio para que la revelación se sienta distinta cada vez
  const indicesDisponibles = reasonsILoveYou.map((_, i) => i);

  reasonsILoveYou.forEach((_, i) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'razon-corazon';
    boton.textContent = '❤️';
    boton.setAttribute('aria-label', 'Descubrir una razón');
    boton.dataset.reasonIndex = String(i);

    boton.addEventListener('click', () => {
      if (boton.classList.contains('descubierto')) {
        mostrarRazon(i);
        return;
      }
      boton.classList.add('descubierto');
      mostrarRazon(i);

      const rect = boton.getBoundingClientRect();
      if (typeof createHeartExplosion === 'function') {
        createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
      }
    });

    contenedor.appendChild(boton);
  });
}

function mostrarRazon(index) {
  const salida = document.getElementById('razones-revelada');
  if (!salida) return;
  const texto = '❤️ ' + reasonsILoveYou[index];
  if (typeof typeWriter === 'function') {
    typeWriter(salida, texto, 28);
  } else {
    salida.textContent = texto;
  }
}

/* ============================================================
   CONTADOR DE TIEMPO JUNTOS
   ============================================================ */
function updateCounter() {
  const inicio = new Date((anniversaryConfig.dates.relationshipStart || '2020-01-01') + 'T00:00:00');
  const ahora = new Date();

  if (isNaN(inicio.getTime())) return;

  let diffMs = ahora - inicio;
  if (diffMs < 0) diffMs = 0;

  let anios = ahora.getFullYear() - inicio.getFullYear();
  let meses = ahora.getMonth() - inicio.getMonth();
  let dias = ahora.getDate() - inicio.getDate();

  if (dias < 0) {
    meses -= 1;
    const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
    dias += mesAnterior.getDate();
  }
  if (meses < 0) {
    anios -= 1;
    meses += 12;
  }

  const horas = Math.floor(diffMs / (1000 * 60 * 60));

  setTexto('contador-anios', anios);
  setTexto('contador-meses', meses);
  setTexto('contador-dias', dias);
  setTexto('contador-horas', horas.toLocaleString('es-ES'));
}

function setTexto(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

/* ============================================================
   PREGUNTA "¿ME AMAS?" — el botón NO que escapa
   ============================================================ */
let intentosNo = 0;

function initLoveQuestion() {
  const btnSi = document.getElementById('btn-si');
  const btnNo = document.getElementById('btn-no');
  const contenedor = document.getElementById('pregunta-botones');
  const resultado = document.getElementById('pregunta-resultado');
  if (!btnSi || !btnNo || !contenedor) return;

  const escaparBoton = () => {
    intentosNo++;

    const areaAncho = contenedor.clientWidth;
    const areaAlto = contenedor.clientHeight;
    const botonAncho = btnNo.offsetWidth;
    const botonAlto = btnNo.offsetHeight;

    const maxX = Math.max(areaAncho - botonAncho, 0);
    const maxY = Math.max(areaAlto - botonAlto, 0);

    const nuevoX = Math.random() * maxX;
    const nuevoY = Math.random() * maxY;

    btnNo.style.position = 'absolute';
    btnNo.style.left = nuevoX + 'px';
    btnNo.style.top = nuevoY + 'px';

    if (intentosNo >= 5) {
      resultado.textContent = 'Creo que ese botón no quiere funcionar 😂❤️';
    }
  };

  // Funciona tanto con mouse (hover simulado vía focus/pointerenter) como con touch
  btnNo.addEventListener('pointerenter', escaparBoton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    escaparBoton();
  }, { passive: false });
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    escaparBoton();
  });

  btnSi.addEventListener('click', () => {
    const rect = btnSi.getBoundingClientRect();
    if (typeof createHeartExplosion === 'function') {
      createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
    }
    resultado.textContent = 'Sabía que elegirías esa respuesta ❤️';
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.disabled = true;
    btnSi.disabled = true;
  });
}

/* ============================================================
   CAJA DE REGALO DIGITAL
   ============================================================ */
function initGiftBox() {
  const caja = document.getElementById('caja-regalo');
  const contenido = document.getElementById('regalo-contenido');
  if (!caja || !contenido) return;

  let toques = 0;

  caja.addEventListener('click', () => {
    toques++;
    caja.classList.remove('caja-regalo--tiembla', 'caja-regalo--entreabierta', 'caja-regalo--abierta');

    // Fuerza reflow para reiniciar animaciones repetidas
    void caja.offsetWidth;

    if (toques === 1) {
      caja.classList.add('caja-regalo--tiembla');
    } else if (toques === 2) {
      caja.classList.add('caja-regalo--entreabierta');
    } else if (toques >= 3) {
      caja.classList.add('caja-regalo--abierta');
      caja.querySelector('.caja-regalo__emoji').textContent = '💝';

      const rect = caja.getBoundingClientRect();
      if (typeof createHeartExplosion === 'function') {
        createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
      }
      if (typeof startConfetti === 'function') {
        startConfetti(16);
      }

      contenido.classList.remove('oculto');
      caja.disabled = true;
    }
  });
}

/* ============================================================
   CORAZÓN GIGANTE — desbloquea el capítulo final
   ============================================================ */
function initGiantHeart() {
  const boton = document.getElementById('btn-corazon-gigante');
  const contador = document.getElementById('corazon-gigante-contador');
  if (!boton || !contador) return;

  const metaDesbloqueo = 7;
  let toques = 0;

  boton.addEventListener('click', () => {
    toques++;
    contador.textContent = `❤️ x ${toques}`;

    boton.classList.remove('corazon-gigante__boton--tocado');
    void boton.offsetWidth;
    boton.classList.add('corazon-gigante__boton--tocado');

    const rect = boton.getBoundingClientRect();
    if (typeof createHeartExplosion === 'function') {
      createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    }

    if (toques === metaDesbloqueo) {
      if (typeof createHeartExplosion === 'function') {
        createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 30);
      }
      boton.disabled = true;
      setTimeout(() => goToChapter(currentChapter + 1), 900);
    }
  });
}

/* ============================================================
   CARTA FINAL (con efecto de escritura progresiva)
   ============================================================ */
let cartaRenderizada = false;

function renderLetter() {
  const contenedor = document.getElementById('carta-texto');
  if (!contenedor || cartaRenderizada) return;
  cartaRenderizada = true;

  contenedor.innerHTML = '';

  finalLetterParagraphs.forEach((parrafo, i) => {
    setTimeout(() => {
      const p = document.createElement('p');
      contenedor.appendChild(p);
      if (typeof typeWriter === 'function') {
        typeWriter(p, parrafo, 22);
      } else {
        p.textContent = parrafo;
      }

      // Al terminar el último párrafo, mostrar el botón del gran final
      if (i === finalLetterParagraphs.length - 1) {
        setTimeout(() => {
          document.getElementById('gran-final')?.classList.remove('oculto');
        }, parrafo.length * 22 + 400);
      }
    }, i * 1600);
  });
}

/* ============================================================
   GRAN FINAL
   ============================================================ */
function initGrandFinale() {
  const boton = document.getElementById('btn-final');
  const granFinal = document.getElementById('gran-final');
  const mensajeFinal = document.getElementById('final-mensaje');
  if (!boton) return;

  boton.addEventListener('click', () => {
    // Explosión de corazones desde varias posiciones de la pantalla
    const ancho = window.innerWidth;
    const alto = window.innerHeight;
    const puntos = [
      [ancho * 0.2, alto * 0.3],
      [ancho * 0.8, alto * 0.3],
      [ancho * 0.5, alto * 0.5],
      [ancho * 0.3, alto * 0.7],
      [ancho * 0.7, alto * 0.7]
    ];

    puntos.forEach(([x, y], i) => {
      setTimeout(() => {
        if (typeof createHeartExplosion === 'function') createHeartExplosion(x, y, 14);
      }, i * 180);
    });

    if (typeof startHeartRain === 'function') startHeartRain(5000);
    if (typeof startConfetti === 'function') startConfetti(24);

    granFinal?.classList.add('oculto');
    setTimeout(() => {
      mensajeFinal?.classList.remove('oculto');
      mensajeFinal?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });
}

/* ============================================================
   EASTER EGGS — mensajes sorpresa aleatorios
   ============================================================ */
function initEasterEggs() {
  const corazonesDisponibles = document.querySelectorAll('.timeline__punto, .polaroid');
  let mostrados = 0;
  const maxMostrados = 3; // no saturar: deben sentirse como descubrimientos

  corazonesDisponibles.forEach((el) => {
    if (Math.random() > 0.35) return; // solo algunos elementos son "especiales"

    el.addEventListener('click', function eastereggHandler(e) {
      if (mostrados >= maxMostrados) return;
      if (Math.random() > 0.4) return; // no siempre se activa

      mostrados++;
      const mensaje = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
      mostrarToast(mensaje);
    });
  });
}

function mostrarToast(texto) {
  const toast = document.createElement('div');
  toast.textContent = texto;
  toast.style.position = 'fixed';
  toast.style.left = '50%';
  toast.style.bottom = 'calc(110px + env(safe-area-inset-bottom, 0px))';
  toast.style.transform = 'translateX(-50%) translateY(10px)';
  toast.style.background = 'rgba(74, 16, 39, 0.92)';
  toast.style.border = '1px solid rgba(255,255,255,0.14)';
  toast.style.borderRadius = '999px';
  toast.style.padding = '0.7rem 1.2rem';
  toast.style.color = '#fdf6f3';
  toast.style.fontStyle = 'italic';
  toast.style.zIndex = '60';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  toast.style.maxWidth = '80vw';
  toast.style.textAlign = 'center';

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderReasons();
  initLoveQuestion();
  initGiftBox();
  initGiantHeart();
  initGrandFinale();
  initEasterEggs();
});
