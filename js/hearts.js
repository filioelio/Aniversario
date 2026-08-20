/* ============================================================
   hearts.js — Corazones flotantes de fondo, explosiones,
   lluvia de corazones, confeti romántico y toques en pantalla.
   Todo optimizado para no saturar el DOM en móviles.
   ============================================================ */

const HEART_EMOJIS = ['❤️', '💕', '💗', '💖', '💘'];

/* ============================================================
   FONDO DE CORAZONES FLOTANTES
   ============================================================ */
let floatingHeartsInterval = null;
let activeFloatingHearts = 0;

function createHeart() {
  const contenedor = document.getElementById('floating-hearts');
  if (!contenedor) return;

  const max = (window.anniversaryConfig && anniversaryConfig.effects.maxFloatingHearts) || 12;
  if (activeFloatingHearts >= max) return;

  const corazon = document.createElement('span');
  corazon.className = 'corazon-flotante';
  corazon.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  corazon.setAttribute('aria-hidden', 'true');

  const tamano = 0.9 + Math.random() * 1.6; // rem
  const izquierda = Math.random() * 100; // %
  const duracion = 9 + Math.random() * 8; // segundos
  const deriva = (Math.random() * 60 - 30) + 'px';
  const opacidad = (0.25 + Math.random() * 0.4).toFixed(2);

  corazon.style.left = izquierda + '%';
  corazon.style.fontSize = tamano + 'rem';
  corazon.style.setProperty('--deriva', deriva);
  corazon.style.setProperty('--opacidad-max', opacidad);
  corazon.style.animationDuration = duracion + 's';
  corazon.style.filter = 'blur(' + (Math.random() > 0.6 ? '1.5px' : '0px') + ')';

  contenedor.appendChild(corazon);
  activeFloatingHearts++;

  // Elimina el corazón del DOM al terminar su animación (evita fugas de memoria)
  corazon.addEventListener('animationend', () => {
    corazon.remove();
    activeFloatingHearts--;
  });
}

function startFloatingHearts() {
  if (floatingHeartsInterval) return;
  // Limita la cantidad de partículas para evitar problemas
  // de rendimiento en dispositivos móviles.
  floatingHeartsInterval = setInterval(createHeart, 1400);
  createHeart();
}

/* ============================================================
   EXPLOSIÓN DE CORAZONES
   ============================================================ */

/**
 * Genera una explosión romántica de corazones desde (x, y).
 * Reutilizable en toda la experiencia.
 */
function createHeartExplosion(x, y, cantidad) {
  const max = cantidad || (window.anniversaryConfig && anniversaryConfig.effects.maxExplosionHearts) || 18;

  for (let i = 0; i < max; i++) {
    const corazon = document.createElement('span');
    corazon.className = 'corazon-explosion';
    corazon.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    corazon.setAttribute('aria-hidden', 'true');

    const angulo = Math.random() * Math.PI * 2;
    const distancia = 60 + Math.random() * 140;
    const dx = Math.cos(angulo) * distancia;
    const dy = Math.sin(angulo) * distancia;

    corazon.style.left = x + 'px';
    corazon.style.top = y + 'px';
    corazon.style.fontSize = (1 + Math.random() * 1.4) + 'rem';
    corazon.style.setProperty('--dx', dx + 'px');
    corazon.style.setProperty('--dy', dy + 'px');
    corazon.style.setProperty('--rotacion', (Math.random() * 360 - 180) + 'deg');
    corazon.style.setProperty('--escala-final', (0.6 + Math.random() * 0.8).toFixed(2));
    corazon.style.animationDuration = (0.7 + Math.random() * 0.5) + 's';

    document.body.appendChild(corazon);
    corazon.addEventListener('animationend', () => corazon.remove());
  }
}

/* ============================================================
   INTERACCIÓN AL TOCAR LA PANTALLA
   ============================================================ */
let tapHeartsCount = 0;
let tapHeartsResetTimer = null;

function crearCorazonTap(x, y) {
  // Limita la cantidad de corazones generados por toques rápidos
  if (tapHeartsCount >= 10) return;
  tapHeartsCount++;

  clearTimeout(tapHeartsResetTimer);
  tapHeartsResetTimer = setTimeout(() => { tapHeartsCount = 0; }, 1200);

  const corazon = document.createElement('span');
  corazon.className = 'corazon-tap';
  corazon.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  corazon.style.left = (x - 10) + 'px';
  corazon.style.top = (y - 10) + 'px';
  corazon.style.fontSize = (1 + Math.random() * 0.8) + 'rem';
  corazon.setAttribute('aria-hidden', 'true');

  document.body.appendChild(corazon);
  corazon.addEventListener('animationend', () => corazon.remove());
}

function initTapHearts() {
  const experiencia = document.getElementById('experiencia');
  if (!experiencia) return;

  // Zonas interactivas donde SÍ se generan corazones al tocar
  // (evita disparar corazones sobre botones y controles)
  const esZonaValida = (target) =>
    target.closest('.capitulo__texto, .foto-portada, .timeline__contenido, .contador, figure, .carta') &&
    !target.closest('button, a, input, .btn');

  experiencia.addEventListener('click', (e) => {
    if (esZonaValida(e.target)) {
      crearCorazonTap(e.clientX, e.clientY);
    }
  });
}

/* ============================================================
   LLUVIA DE CORAZONES (gran final)
   ============================================================ */
function startHeartRain(duracionMs) {
  const max = (window.anniversaryConfig && anniversaryConfig.effects.maxRainHearts) || 26;
  const duracion = duracionMs || 4500;
  let creados = 0;
  let activos = 0;

  const intervalo = setInterval(() => {
    if (creados >= max) {
      clearInterval(intervalo);
      return;
    }
    if (activos >= 14) return; // evita saturar el DOM en un mismo instante

    const corazon = document.createElement('span');
    corazon.className = 'corazon-lluvia';
    corazon.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    corazon.style.left = Math.random() * 100 + '%';
    corazon.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    corazon.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
    corazon.setAttribute('aria-hidden', 'true');

    document.body.appendChild(corazon);
    activos++;
    creados++;

    corazon.addEventListener('animationend', () => {
      corazon.remove();
      activos--;
    });
  }, 160);

  // Seguridad: detener por completo pasado el tiempo indicado
  setTimeout(() => clearInterval(intervalo), duracion);
}

/* ============================================================
   CONFETI ROMÁNTICO
   ============================================================ */
const CONFETI_COLORES = ['#d9435f', '#e0b876', '#f2a6c0', '#fdf6f3', '#4a1027'];

function startConfetti(cantidad) {
  const max = cantidad || (window.anniversaryConfig && anniversaryConfig.effects.maxConfetti) || 20;

  for (let i = 0; i < max; i++) {
    const pieza = document.createElement('span');
    pieza.className = 'confeti';
    pieza.style.left = Math.random() * 100 + '%';
    pieza.style.top = '-5%';
    pieza.style.width = (5 + Math.random() * 5) + 'px';
    pieza.style.height = pieza.style.width;
    pieza.style.background = CONFETI_COLORES[Math.floor(Math.random() * CONFETI_COLORES.length)];
    pieza.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    pieza.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
    pieza.setAttribute('aria-hidden', 'true');

    document.body.appendChild(pieza);
    pieza.addEventListener('animationend', () => pieza.remove());
  }
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const reducirMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducirMovimiento) {
    startFloatingHearts();
  }

  initTapHearts();

  // Explosión también disponible al hacer click con el botón derecho de utilidades táctiles
  document.addEventListener('click', (e) => {
    if (e.target.closest('.corazon-gigante__boton')) return; // manejado en surprises.js
  });
});
