# Nuestra Historia ❤️ — Experiencia romántica de aniversario

Este proyecto es un sitio web estático (HTML, CSS y JavaScript puro, sin
frameworks ni backend) que muestra una experiencia interactiva para
celebrar un aniversario. Está pensado para abrirse desde el celular,
después de escanear un código QR.

Todo lo que necesitas personalizar está explicado abajo, paso a paso.

---

## 1. Estructura del proyecto

```text
aniversario/
├── index.html              → La experiencia principal
├── qr-generator.html       → Herramienta para generar el QR (solo para ti)
├── README.md                → Este archivo
├── css/
│   ├── styles.css           → Estilos generales
│   ├── animations.css       → Animaciones y corazones
│   └── responsive.css       → Ajustes para distintos tamaños de pantalla
├── js/
│   ├── app.js                → Configuración central y navegación
│   ├── hearts.js              → Corazones flotantes, explosiones, lluvia, confeti
│   ├── timeline.js            → Timeline, galería y recuerdos
│   ├── surprises.js           → Sorpresas: razones, contador, regalo, carta, final
│   └── music.js               → Música de fondo
├── assets/
│   ├── images/
│   │   ├── portada.jpg        → Foto de portada (opcional)
│   │   ├── historia/          → Fotos de cada momento de la historia
│   │   └── galeria/            → Fotos de la galería y fotos secretas
│   ├── music/
│   │   └── nuestra-cancion.mp3 → Su canción (opcional)
│   └── icons/
│       └── favicon.png         → Ícono del sitio (opcional)
└── qr/
    └── README.md              → Instrucciones para guardar el QR
```

Puedes abrir `index.html` directamente haciendo doble clic (funciona sin
necesidad de servidor) y también funcionará igual una vez publicado en
GitHub Pages.

---

## 2. Cambiar los nombres

Abre `js/app.js` y busca el objeto `anniversaryConfig`, al principio del
archivo:

```javascript
const anniversaryConfig = {
    couple: {
        person1: "TU NOMBRE",
        person2: "NOMBRE DE TU PAREJA"
    },
    ...
};
```

Reemplaza `"TU NOMBRE"` y `"NOMBRE DE TU PAREJA"` por los nombres reales.

---

## 3. Cambiar la fecha de inicio de la relación

En el mismo objeto `anniversaryConfig`, dentro de `js/app.js`:

```javascript
dates: {
    relationshipStart: "AAAA-MM-DD", // Ej: "2020-05-14"
    anniversary: "AAAA-MM-DD"
}
```

`relationshipStart` es la fecha que se usa para calcular el contador de
años, meses, días y horas juntos (capítulo 4).

---

## 4. Agregar fotografías

Coloca tus fotos dentro de `assets/images/`:

- `assets/images/portada.jpg` — imagen de portada (opcional).
- `assets/images/historia/01.jpg`, `02.jpg`, etc. — una foto por cada
  recuerdo del array `ourStory` (ver punto 6).
- `assets/images/galeria/01.jpg`, `02.jpg`, etc. — fotos de la galería
  tipo Polaroid (capítulo 3).
- `assets/images/galeria/secreto-1.jpg`, `secreto-2.jpg` — las "fotos
  escondidas" que se revelan al tocarlas.
- `assets/images/galeria/regalo.jpg` — la foto que aparece dentro de la
  caja de regalo (capítulo 5).

Si alguna foto no existe todavía, el sitio no se rompe: simplemente no
se muestra esa imagen hasta que la agregues.

**Recomendación:** usa fotos en formato `.jpg` o `.webp`, no demasiado
pesadas (idealmente menos de 500 KB cada una) para que el sitio cargue
rápido en el celular.

---

## 5. Cambiar los textos

Los textos principales están centralizados en dos lugares dentro de
`js/app.js` y `js/surprises.js`:

- `anniversaryConfig.messages` (en `app.js`) — frases de bienvenida y
  el mensaje final.
- El texto de cada capítulo también puede editarse directamente en
  `index.html` (busca los `id="cap0-fecha"`, `id="cap0-lugar"`,
  `id="cap0-historia"`, etc.).
- `reasonsILoveYou` (en `js/surprises.js`) — las frases que aparecen al
  tocar los corazones en "Lo que amo de ti".
- `surpriseMessages` (en `js/surprises.js`) — los mensajes sorpresa
  (Easter eggs).
- `finalLetterParagraphs` (en `js/surprises.js`) — el texto de la carta
  final.

---

## 6. Agregar o modificar recuerdos (la historia)

En `js/app.js` encontrarás el array `ourStory`:

```javascript
const ourStory = [
    {
        date: "AAAA-MM-DD",
        title: "Cuando comenzó todo",
        description: "Descripción corta del momento",
        image: "assets/images/historia/01.jpg"
    },
    ...
];
```

Puedes agregar, quitar o editar tantos objetos como quieras. Cada uno
se usa automáticamente para generar las tarjetas de recuerdos y la
línea de tiempo (timeline) del sitio.

Para la galería estilo Polaroid, edita el array `galleryMemories`
(también en `app.js`), y para las fotos escondidas, el array
`hiddenMemories`.

---

## 7. Agregar su canción

Coloca el archivo de audio en:

```text
assets/music/nuestra-cancion.mp3
```

Debe llamarse exactamente `nuestra-cancion.mp3`. Si prefieres otro
nombre o formato, actualiza la ruta dentro de `index.html`, en la
etiqueta `<audio>`.

Si no agregas ninguna canción, el sitio funciona igual: el botón de
música simplemente queda desactivado, sin generar errores.

---

## 8. Probar el sitio localmente

Simplemente haz doble clic en `index.html` y se abrirá en tu navegador.
También puedes probarlo en tu celular copiando la carpeta completa a
tu teléfono, o mejor aún, siguiendo los pasos de publicación de abajo.

---

## 9. Publicar gratis en GitHub Pages

1. Crea una cuenta en [GitHub](https://github.com) si no tienes una.
2. Crea un nuevo repositorio (por ejemplo, llamado `aniversario`).
3. Sube todos los archivos de este proyecto al repositorio (puedes
   arrastrarlos desde la web de GitHub, o usar Git desde la terminal).
4. Dentro del repositorio, ve a **Settings**.
5. En el menú lateral, entra a **Pages**.
6. En "Build and deployment", elige **Deploy from a branch**.
7. En **Branch**, selecciona `main` y la carpeta `/ (root)`.
8. Presiona **Save**.
9. Espera uno o dos minutos. GitHub te mostrará una URL parecida a:

   ```text
   https://TU-USUARIO.github.io/aniversario/
   ```

10. Abre esa URL desde tu celular para confirmar que todo funciona
    correctamente.

No es necesario escribir esa URL en ningún archivo del proyecto: todas
las rutas del sitio son relativas, así que funcionará sin importar el
nombre del repositorio.

---

## 10. Generar el código QR

1. Una vez publicado tu sitio y con la URL de GitHub Pages en mano,
   abre el archivo `qr-generator.html` (localmente, con doble clic, o
   también puedes subirlo y abrirlo desde GitHub Pages).
2. Pega la URL de tu sitio.
3. Presiona **Generar QR ❤️**.
4. Presiona **Guardar QR como imagen** para descargarlo.
5. Comparte esa imagen con tu pareja (impresa, por mensaje, etc.), o
   guárdala dentro de la carpeta `qr/` de este proyecto si quieres
   tenerla ordenada.

`qr-generator.html` es solo una herramienta para ti: no forma parte de
la experiencia romántica y tu pareja nunca necesita abrirla.

---

## 11. Advertencia de privacidad

GitHub Pages es un servicio **público**: cualquier persona que tenga el
enlace (o lo encuentre) podrá ver el sitio, incluyendo las fotografías
que subas.

Antes de publicar, ten en cuenta:

- No coloques direcciones físicas, números de teléfono, documentos de
  identidad ni otra información personal sensible.
- Las fotografías que subas a `assets/images/` quedarán accesibles
  públicamente a través de la URL del sitio.
- Este proyecto no utiliza analíticas ni rastreadores (*trackers*) de
  ningún tipo.
- Si te preocupa la privacidad, puedes hacer el repositorio de GitHub
  privado y activar GitHub Pages solo si tu plan lo permite, o
  simplemente evitar compartir el enlace públicamente.

---

## 12. Si algo no se ve

- Si falta una fotografía, esa sección se muestra sin imagen, sin
  romper el resto del sitio.
- Si falta la música, el botón de música se desactiva discretamente.
- Revisa que los nombres de archivo coincidan exactamente (mayúsculas,
  minúsculas y extensión) con lo que se indica en `js/app.js`.
- Si algo no carga después de publicar en GitHub Pages, confirma que
  las rutas no comiencen con `/` (por ejemplo, deben ser
  `assets/images/foto.jpg`, no `/assets/images/foto.jpg`).

¡Que disfruten mucho la experiencia! ❤️
