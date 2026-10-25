# IZUMI · 泉

Landing page premium para **IZUMI**, un restaurante japonés de omakase ficticio en Ginza, Tokio.
Estética cinematográfica en negro, rojo japonés y detalles blancos, con animaciones fluidas y un menú interactivo en forma de libro.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Motion (Framer Motion) · Lenis

---

## Funcionalidades

- **Hero:** entrada coreografiada de 2.4 s. El brillo rojo aparece primero, los titulares se revelan con máscara, las letras de IZUMI se desenfocan y suben, el plato sale desde abajo y los palillos entran sosteniendo el nigiri. En reposo hay flotación suave, parallax con el cursor y un efecto de salida al hacer scroll.
- **About:** fotos con parallax a dos velocidades, contadores animados y los principios del restaurante (旬 · 拘り · 持て成し).
- **Menu (libro cuadrado):** 16 páginas con un *page flip* 3D propio, sin librerías externas.
  - Cada hoja se divide en 3 franjas articuladas para simular la curvatura del papel.
  - El sombreado es dinámico y la hoja proyecta sombra sobre las páginas de abajo.
  - El grosor del bloque de páginas crece según las páginas que hay en cada lado.
  - Se puede pasar la página con clic, arrastre, swipe, flechas del teclado y botones.
  - Los tabs saltan de capítulo pasando varias páginas seguidas.
  - En desktop se ve la doble página; en mobile, una página a la vez.
  - El libro se abre solo al entrar en pantalla.
- **Gallery:** revelado tipo cortina con clip-path, estado hover con caption, lightbox con transición compartida (Esc y ←/→) y un marquee infinito que reacciona a la velocidad del scroll.
- **Contact / Reservations:** formulario con validación en vivo, horarios con disponibilidad (chips), stepper de comensales, estado de carga y tarjeta de confirmación. Es demostrativo, sin backend.
- **Footer:** navegación, redes sociales, newsletter demo y wordmark gigante.
- **Navbar:**
  - Es transparente arriba y se convierte en una píldora de vidrio al hacer scroll.
  - Se esconde al bajar y reaparece al subir.
  - Marca la sección activa (scroll-spy).
  - En mobile abre un menú a pantalla completa con revelado circular.
- **Idiomas (EN / ES):** el sitio se genera de forma estática en `/en` y `/es`.
  - En la primera visita, `/` redirige según el idioma del navegador; después manda la elección guardada en una cookie.
  - El switch EN/ES está en la navbar, el menú móvil y el footer.
  - Cambiar de idioma es instantáneo: no recarga la página, mantiene el scroll, la página abierta del libro y lo que lleves escrito en el formulario, y actualiza la URL, `<html lang>` y el título.
  - Cada idioma tiene metadatos propios y etiquetas `hreflang` para SEO.
- **Accesibilidad:**
  - HTML semántico, link "Skip to content" y `focus-visible`.
  - Atributos ARIA en el libro, los diálogos y los tabs.
  - Con `prefers-reduced-motion` se desactivan las animaciones de movimiento y el smooth scroll.
- **Rendimiento y SEO:**
  - Todo es estático (SSG) y las imágenes usan `next/image` (AVIF/WebP con placeholder blur).
  - Las fuentes se cargan con `next/font`.
  - Incluye Open Graph, `sitemap.xml`, `robots.txt` y JSON-LD de tipo `Restaurant`.

## Arquitectura

```
src/
├─ app/
│  ├─ [lang]/              layout (fuentes, metadata por idioma, providers) y page
│  └─ globals.css (tokens @theme), icon.svg, opengraph-image.jpg, robots.ts, sitemap.ts
├─ i18n/                   config (idiomas), I18nProvider (cambio de idioma), dictionaries/en.ts · es.ts
├─ proxy.ts                redirige "/" al idioma preferido
├─ assets/images/          fotos optimizadas + recortes del hero (importación estática)
├─ components/
│  ├─ layout/              Navbar, MobileMenu, Footer
│  ├─ sections/            hero/ (Hero, Wordmark, HeroComposition, Chopsticks),
│  │                       About, Menu, gallery/ (Gallery, Lightbox), contact/ (Contact, ReservationForm)
│  ├─ menu-book/           MenuBook (orquesta el libro), TurningLeaf (hoja 3D segmentada),
│  │                       ChapterTabs, BookControls, pages/ (contenido de cada página)
│  ├─ motion/              Reveal, MaskText, Parallax, ClipReveal, Marquee, CountUp
│  ├─ providers/           Providers (Lenis + MotionConfig)
│  └─ ui/                  Button, IconButton, Field, Stepper, Chip, SectionLabel, Logo, SocialIcon
├─ data/                   site, menu, about, gallery, images  ← contenido editable
├─ hooks/                  usePageFlip (máquina de estados del libro), useScrollDirection,
│                          useActiveSection, useScrollTo, usePointerParallax, useElementWidth, useMediaQuery
├─ lib/                    animations (easings, timeline del hero, variants), cn
└─ types/                  menu, site
design/izumi.pen           diseños originales en PenDev (desktop, mobile, storyboard, libro)
```

Los datos (estructura del menú, precios, fotos, contacto) viven en `src/data/`. Todos los textos visibles, incluidos los nombres y descripciones de los platos, están en `src/i18n/dictionaries/en.ts` y `es.ts`. TypeScript exige que ambos diccionarios tengan exactamente las mismas claves, así que no se puede olvidar una traducción.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run lint       # ESLint
npm run typecheck  # TypeScript (requiere haber corrido dev o build una vez)
```

Requiere Node.js 20.9 o superior.

## Despliegue (GitLab → Vercel)

1. Crea un repositorio en GitLab y sube el proyecto:
   ```bash
   git init
   git add .
   git commit -m "feat: IZUMI landing page"
   git branch -M main
   git remote add origin https://gitlab.com/<usuario>/izumi.git
   git push -u origin main
   ```
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repositorio de GitLab. Vercel detecta Next.js automáticamente; no hace falta configurar nada.
3. (Opcional) En **Settings → Environment Variables** añade `NEXT_PUBLIC_SITE_URL` con tu dominio final (por ejemplo, `https://izumi.com`). Sin ella, el sitio usa el dominio de producción de Vercel.
4. **Settings → Domains** → añade tu dominio y configura el DNS que indica Vercel.

---

Restaurante ficticio, creado como pieza de portafolio. Las fotografías de comida y del interior provienen de las referencias del proyecto; las de bebidas, vino y postres se generaron con IA.
