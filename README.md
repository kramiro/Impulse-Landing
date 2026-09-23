# Impulse Landing — Production

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
