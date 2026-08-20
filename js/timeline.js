/* ============================================================
   timeline.js — Tarjetas de recuerdos, línea de tiempo vertical,
   galería estilo Polaroid, fotos secretas y modal ampliado.
   Todo generado dinámicamente a partir de ourStory / galleryMemories.
   ============================================================ */

function formatearFecha(fechaISO) {
  try {
    const fecha = new Date(fechaISO + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return fechaISO;
  }
}

/* ============================================================
   TARJETAS DE RECUERDOS (capítulo 2)
   ============================================================ */
function renderMemoryCards() {
  const contenedor = document.getElementById('tarjetas-recuerdos');
  if (!contenedor || !Array.isArray(ourStory)) return;

  ourStory.forEach((recuerdo, i) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-recuerdo ' + (i % 2 === 0 ? 'reveal-left' : 'reveal-right');

    const img = document.createElement('img');
    img.src = recuerdo.image;
    img.alt = recuerdo.title;
    img.loading = 'lazy';
    img.onerror = function () {
      this.onerror = null;
      this.style.display = 'none';
    };

    const cuerpo = document.createElement('div');
    cuerpo.className = 'tarjeta-recuerdo__cuerpo';
    cuerpo.innerHTML = `
      <p class="tarjeta-recuerdo__fecha">${formatearFecha(recuerdo.date)}</p>
      <h3 class="tarjeta-recuerdo__titulo">${recuerdo.title} ❤️</h3>
      <p>${recuerdo.description}</p>
    `;

    tarjeta.appendChild(img);
    tarjeta.appendChild(cuerpo);
    contenedor.appendChild(tarjeta);
  });
}

/* ============================================================
   TIMELINE VERTICAL (capítulo 3)
   ============================================================ */
function renderTimeline() {
  const contenedor = document.getElementById('timeline');
  if (!contenedor || !Array.isArray(ourStory)) return;

  ourStory.forEach((momento) => {
    const item = document.createElement('div');
    item.className = 'timeline__item reveal';
    item.innerHTML = `
      <span class="timeline__punto" aria-hidden="true">❤️</span>
      <div class="timeline__contenido">
        <p class="timeline__fecha">${formatearFecha(momento.date)}</p>
        <h4 class="timeline__titulo">${momento.title}</h4>
      </div>
    `;
    contenedor.appendChild(item);
  });
}

/* ============================================================
   GALERÍA ESTILO POLAROID + MODAL
   ============================================================ */
let modalIndex = 0;

function renderGallery() {
  const contenedor = document.getElementById('galeria');
  if (!contenedor || !Array.isArray(galleryMemories)) return;

  galleryMemories.forEach((item, i) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'polaroid reveal-scale';
    boton.setAttribute('aria-label', 'Ampliar fotografía: ' + item.caption);

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.caption;
    img.loading = 'lazy';
    img.onerror = function () {
      this.onerror = null;
      this.style.background = 'linear-gradient(135deg, #4a1027, #23111a)';
    };

    const frase = document.createElement('p');
    frase.className = 'polaroid__frase';
    frase.textContent = item.caption.split('.')[0];

    boton.appendChild(img);
    boton.appendChild(frase);
    boton.addEventListener('click', () => abrirModal(i));

    contenedor.appendChild(boton);
  });
}

function abrirModal(index) {
  const modal = document.getElementById('modal-foto');
  const imagen = document.getElementById('modal-imagen');
  const descripcion = document.getElementById('modal-descripcion');
  if (!modal || !imagen || !descripcion) return;

  modalIndex = index;
  const item = galleryMemories[modalIndex];
  imagen.src = item.image;
  imagen.alt = item.caption;
  descripcion.textContent = item.caption;

  modal.classList.remove('oculto');
  modal.setAttribute('aria-hidden', 'false');
}

function cerrarModal() {
  const modal = document.getElementById('modal-foto');
  if (!modal) return;
  modal.classList.add('oculto');
  modal.setAttribute('aria-hidden', 'true');
}

function navegarModal(direccion) {
  if (!Array.isArray(galleryMemories) || galleryMemories.length === 0) return;
  modalIndex = (modalIndex + direccion + galleryMemories.length) % galleryMemories.length;
  abrirModal(modalIndex);
}

/* ============================================================
   FOTOS SECRETAS
   ============================================================ */
function renderHiddenMemories() {
  const contenedor = document.getElementById('fotos-secretas');
  if (!contenedor || !Array.isArray(hiddenMemories)) return;

  hiddenMemories.forEach((secreto) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'foto-secreta reveal-scale';
    boton.setAttribute('aria-label', 'Toca para descubrir un recuerdo escondido');

    boton.innerHTML = `
      <div class="foto-secreta__overlay">
        <span class="foto-secreta__candado" aria-hidden="true">🔒</span>
        <span>Un recuerdo escondido</span>
        <span>Toca para descubrirlo</span>
      </div>
    `;

    boton.addEventListener('click', function revelar() {
      if (boton.classList.contains('revelada')) return;

      const rect = boton.getBoundingClientRect();
      if (typeof createHeartExplosion === 'function') {
        createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
      }

      const img = document.createElement('img');
      img.src = secreto.image;
      img.alt = secreto.caption;
      img.loading = 'lazy';
      img.onerror = function () {
        this.onerror = null;
        this.style.display = 'none';
      };
      boton.appendChild(img);
      boton.classList.add('revelada');

      const mensaje = document.createElement('p');
      mensaje.className = 'foto-secreta__mensaje';
      mensaje.textContent = secreto.caption;
      boton.parentElement.insertAdjacentElement('afterend', mensaje);
    });

    contenedor.appendChild(boton);
  });
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderMemoryCards();
  renderTimeline();
  renderGallery();
  renderHiddenMemories();

  document.getElementById('modal-cerrar')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-fondo')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-prev')?.addEventListener('click', () => navegarModal(-1));
  document.getElementById('modal-next')?.addEventListener('click', () => navegarModal(1));
});
