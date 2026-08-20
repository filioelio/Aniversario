/* ============================================================
   music.js — Control de la música de fondo.
   Debe iniciarse solo tras una interacción del usuario
   (restricciones de autoplay en navegadores móviles) y no
   debe romper el sitio si el archivo de audio no existe.
   ============================================================ */

let musicaHabilitada = false;
let musicaDisponible = true;

function getAudioElement() {
  return document.getElementById('audio-musica');
}

/**
 * Intenta iniciar la reproducción de música. Se llama únicamente
 * después de una interacción explícita del usuario (por ejemplo,
 * al presionar "DESCUBRIR NUESTRA HISTORIA").
 */
function startMusic() {
  const audio = getAudioElement();
  if (!audio || !musicaDisponible) return;

  const promesa = audio.play();
  if (promesa && typeof promesa.then === 'function') {
    promesa
      .then(() => {
        musicaHabilitada = true;
        actualizarIconoMusica();
      })
      .catch(() => {
        // El navegador bloqueó la reproducción automática o el archivo
        // no existe: la experiencia continúa funcionando con normalidad.
        musicaHabilitada = false;
        actualizarIconoMusica();
      });
  }
}

function toggleMusic() {
  const audio = getAudioElement();
  if (!audio || !musicaDisponible) return;

  if (musicaHabilitada) {
    audio.pause();
    musicaHabilitada = false;
  } else {
    const promesa = audio.play();
    if (promesa && typeof promesa.then === 'function') {
      promesa
        .then(() => { musicaHabilitada = true; actualizarIconoMusica(); })
        .catch(() => { musicaHabilitada = false; actualizarIconoMusica(); });
      return;
    }
    musicaHabilitada = true;
  }
  actualizarIconoMusica();
}

function actualizarIconoMusica() {
  const icono = document.getElementById('btn-musica-icono');
  const boton = document.getElementById('btn-musica');
  if (!icono || !boton) return;

  icono.textContent = musicaHabilitada ? '♫' : '🔇';
  boton.setAttribute('aria-pressed', String(musicaHabilitada));
  boton.setAttribute('aria-label', musicaHabilitada ? 'Desactivar música' : 'Activar música');
}

document.addEventListener('DOMContentLoaded', () => {
  const audio = getAudioElement();
  const btnMusica = document.getElementById('btn-musica');

  if (audio) {
    // Si la canción no existe o falla al cargar, se desactiva el botón
    // discretamente sin generar errores visibles para quien visite el sitio.
    audio.addEventListener('error', () => {
      musicaDisponible = false;
      musicaHabilitada = false;
      actualizarIconoMusica();
      if (btnMusica) {
        btnMusica.style.opacity = '0.35';
        btnMusica.title = 'La canción aún no fue agregada';
      }
    });
  }

  btnMusica?.addEventListener('click', toggleMusic);
  actualizarIconoMusica();
});
