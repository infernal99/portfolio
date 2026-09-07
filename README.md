# Portfolio — Ian Monfil

Portfolio personal de una sola página, en castellano con conmutador a inglés.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion ·
Lenis (scroll suave) · React Three Fiber + drei (un único objeto 3D).

## Dónde está cada cosa

| Ruta | Qué contiene |
| --- | --- |
| [`src/lib/content.ts`](src/lib/content.ts) | **Fuente única de verdad**: datos, proyectos, trayectoria, stack y todo el copy en ES/EN |
| [`src/app/layout.tsx`](src/app/layout.tsx) | Fuentes, metadata, Open Graph, providers |
| [`src/components/sections/`](src/components/sections) | Una sección por fichero, en el orden en que se leen |
| [`src/components/three/hero-object.tsx`](src/components/three/hero-object.tsx) | El objeto 3D del hero |
| [`src/components/nav.tsx`](src/components/nav.tsx) | Índice lateral, overlay móvil y conmutador de idioma |

Para cambiar un texto, una fecha o un proyecto **no hace falta tocar ningún
componente**: todo vive en `src/lib/content.ts`, tipado, con la versión
castellana y la inglesa una al lado de la otra.

## Regla de contenido

Todo dato del sitio procede de una fuente verificable: el CV, los
`package.json` públicos de cada repo (de ahí sale el stack de cada proyecto) y
las propias webs desplegadas. **No hay métricas de negocio, cifras de usuarios
ni testimonios**, porque no hay forma de verificarlos. Si añades algo, mantén
esa regla.

## Antes de desplegar

Define la URL pública para que el Open Graph y la canónica apunten al dominio
real:

```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

Sin esa variable el sitio funciona igual, pero las URL absolutas de metadata
apuntan a `localhost`.

## Decisiones que conviene no deshacer sin querer

- **El titular del hero se anima en CSS, no con Motion.** Es el LCP de la
  página: si su estado inicial dependiera de JavaScript, el nombre quedaría
  invisible hasta hidratar (o para siempre, si el bundle falla).
- **El 3D es opcional por diseño.** Se monta solo en pantallas anchas, con
  puntero fino, CPU suficiente y sin `prefers-reduced-motion`. En el resto se
  dibuja la misma silueta en SVG, con coste cero.
- **Las comprobaciones de tamaño usan `useMediaQuery`** ([`src/lib/use-media-query.ts`](src/lib/use-media-query.ts)),
  no una lectura única de `window.innerWidth` en un efecto: medir una sola vez
  al montar dejaba el 3D y las vistas previas apagados si la ventana arrancaba
  estrecha.
- **Las vistas previas de los proyectos son iframes de los sitios reales**, no
  capturas: nunca se quedan desactualizadas. Se cargan solo al acercarse a su
  panel y solo en escritorio.
