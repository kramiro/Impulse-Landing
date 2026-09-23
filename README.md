# Impulse Landing — V1.5

V1 conserva el código original y oficial. V1.5 continúa sobre V1.4.

## Cambios en V1.5

- Se eliminó el núcleo de impulso y su trayectoria curva.
- El hero incorpora una lluvia de estrellas fugaces que atraviesa el titular de arriba hacia abajo y se desvanece.
- La densidad, escala, velocidad y longitud de las estrellas se adaptan a celulares, tablets y computadoras.
- Se conservaron el carrusel corregido y todos los cambios de V1.4.

## Cambios en V1.4

- Se eliminó completamente el cursor personalizado con el texto “VIEW”.
- Se restauró el arrastre horizontal del carrusel con mouse y dispositivos táctiles.
- Se diferencian el arrastre y el clic: arrastrar cambia de proyecto; tocar una tarjeta o su icono abre el sitio.
- Se conservaron todos los cambios de V1.3.

## Cambios en V1.3

- La bombilla fue sustituida por un núcleo de impulso abstracto e interactivo.
- Al activarlo, una onda expansiva sale de la esfera y un destello recorre la trayectoria del hero.
- Se conservaron todos los cambios y enlaces de V1.2.

## Cambios en V1.2

- El foco del hero ahora es únicamente una bombilla interactiva.
- Cualquier tarjeta de proyecto abre directamente su sitio y el botón vuelve a ser solo el icono de salida.
- Los títulos de la sección 03 tienen una iluminación móvil y sutil.
- El título de la sección 02 es más grande y se eliminó la explicación del carrusel.
- El footer incluye iconos enlazados de Instagram y X.

## Cambios en V1.1

- Se corrigió el recorte de letras en titulares grandes.
- Los Tetris del hero fueron sustituidos por un foco interactivo.
- Los cuatro proyectos muestran un enlace claro y la tarjeta activa también abre el sitio.
- La sección 06 se compactó para caber en una pantalla de escritorio y el titular ahora aprovecha mejor el ancho.

Proyecto estático preparado para GitHub + Cloudflare Pages.

## Estructura

```text
impulse-landing-production/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   │   ├── superhorchatas.webp
│   │   ├── galletalis.webp
│   │   ├── lee-mi-carta.webp
│   │   ├── impulse-landing.webp
│   │   ├── powered-by-impulse-landing.webp
│   │   ├── og-image.jpg
│   │   └── noise.svg
│   └── icons/
├── favicon.png
├── _headers
├── robots.txt
├── sitemap.xml
└── README.md
```

## Cloudflare Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecciona el repositorio.
4. Framework preset: **None**.
5. Build command: **dejar vacío**.
6. Build output directory: **`.`** (raíz del repositorio).
7. Deploy.
8. En **Custom domains**, conecta `impulselanding.com` y `www.impulselanding.com`.

No requiere Node, npm ni servidor.

## Datos que debes completar

### WhatsApp
Abre `js/script.js` y cambia:

```js
whatsappNumber: ""
```

por tu número con código de país, sin `+`, espacios ni guiones. Ejemplo:

```js
whatsappNumber: "50499999999"
```

El botón permanece desactivado mientras no haya número configurado.

### Email
No se agregó un email porque no fue proporcionado. Puedes añadirlo en el footer cuando lo tengas.

## Links de proyectos

- Galletalis → https://galletalis.com/
- Lee Mi Carta (en proceso) → https://testing-sites.kevinramiro.workers.dev/
- Impulse Landing → https://impulselanding.com/
- Superhorchatas → https://superhorchatas.com/

## Instagram

`@impulselanding` está enlazado en el footer.

## Notas

- No hay rutas locales `C:/...` ni `file:///`.
- No hay imágenes embebidas en base64.
- Todos los assets locales usan rutas relativas.
- Se agregó metadata SEO/Open Graph.
- Se agregó `prefers-reduced-motion`, `focus-visible` y navegación de teclado para el carrusel.
- El sello **Powered by Impulse Landing** está en el footer.
