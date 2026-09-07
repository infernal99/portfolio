# Portfolio — Ian Monfil

Portfolio personal de una sola página, en castellano con conmutador a inglés.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
npm run shots    # vuelve a capturar las imágenes de los proyectos
```

## Las imágenes de los proyectos

Las cuatro imágenes de `public/projects/` son **capturas reales de las webs
desplegadas**, no maquetas. Las genera
[`scripts/capture-shots.mjs`](scripts/capture-shots.mjs) abriendo cada sitio en
un Chrome headless a 1440×900, esperando a que terminen las animaciones de
entrada y cerrando los avisos de cookies e instalación que taparían la
captura.

Cuando rediseñes cualquiera de los cuatro proyectos, ejecuta `npm run shots` y
el portfolio queda al día. Necesita un Chrome instalado; si no está en la ruta
habitual, pásalo con `CHROME_PATH=/ruta/a/chrome.exe`.

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

## Variables de entorno

Copia [`.env.example`](.env.example) a `.env.local` y rellénalo. Ninguna es
obligatoria para que el sitio arranque, pero sin ellas dos cosas no funcionan:

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública. Sin ella, el Open Graph y la canónica apuntan a `localhost` |
| `RESEND_API_KEY` | Envío del formulario de contacto |
| `CONTACT_TO_EMAIL` | A dónde llegan los mensajes (por defecto, el email del CV) |
| `CONTACT_FROM_EMAIL` | Remitente (por defecto `onboarding@resend.dev`) |

En Vercel hay que definirlas también en el panel del proyecto: `.env.local` no
se despliega.

## El formulario de contacto

El botón **EMAIL** del cierre abre el formulario en una ventana modal, que envía a través de
[Resend](https://resend.com) desde la server action
[`src/app/actions.ts`](src/app/actions.ts). No usa el SDK: es una llamada
`fetch` a su API, para no arrastrar una dependencia por tres campos.

Cómo ponerlo en marcha:

1. Crea una cuenta en [resend.com](https://resend.com) (plan gratuito: 3.000
   emails al mes) y genera una API key.
2. Ponla en `RESEND_API_KEY`, en `.env.local` y en Vercel.
3. Con el remitente por defecto (`onboarding@resend.dev`) **solo se puede
   escribir a la dirección dueña de la cuenta de Resend**. Para recibir en
   cualquier otra, verifica un dominio en Resend y pon el remitente en
   `CONTACT_FROM_EMAIL`.

**Si falta la clave, el formulario no finge que ha enviado nada**: dice en
pantalla que el envío no está configurado y ofrece el correo directo, de modo
que un mensaje nunca se pierde en silencio. Lo mismo si Resend devuelve error.

Contra los bots hay un campo trampa (`company`), colocado fuera de la vista
pero sin `display:none`, que es lo que los delata. Si llega relleno, la acción
responde "enviado" y no manda nada.

## Decisiones que conviene no deshacer sin querer

- **El titular del hero se anima en CSS, no con Motion.** Es el LCP de la
  página: si su estado inicial dependiera de JavaScript, el nombre quedaría
  invisible hasta hidratar (o para siempre, si el bundle falla).
- **El 3D es opcional por diseño.** Se monta solo en pantallas anchas, con
  puntero fino, CPU suficiente y sin `prefers-reduced-motion`. En el resto se
  dibuja la misma silueta en SVG, con coste cero.
- **Las comprobaciones de tamaño usan `useMediaQuery`** ([`src/lib/use-media-query.ts`](src/lib/use-media-query.ts)),
  no una lectura única de `window.innerWidth` en un efecto: medir una sola vez
  al montar dejaba el 3D apagado si la ventana arrancaba estrecha.
- **La trayectoria no secuestra el scroll.** Fue una fila horizontal movida
  por el scroll de la página y se leía fatal: cualquier gesto mínimo
  desplazaba el texto que estabas leyendo. Ahora es una línea temporal
  vertical y lo único que reacciona al scroll es el raíl, que se dibuja por
  detrás. Si vuelve la tentación del scroll horizontal, este es el motivo por
  el que se quitó.
- **Las secciones reservan un carril a la derecha (`lg:pr-32`)** para el índice
  lateral fijo, que al ser `position: fixed` no participa del flujo. Sin ese
  hueco se superpone al contenido. Por lo mismo, el índice solo muestra el
  nombre de la sección al apuntarla: enseñarlo siempre lo hacía tan ancho que
  se comía la última columna.
- **El modal de contacto se cierra por estado de React, nunca por el cierre
  nativo del `<dialog>`** ([`src/components/contact-dialog.tsx`](src/components/contact-dialog.tsx)).
  El `onCancel` del Escape se cancela a propósito. Dejar que el navegador lo
  cerrara por su cuenta desincronizaba el estado: React lo seguía creyendo
  abierto, no se ejecutaba la limpieza del efecto y **el `body` se quedaba con
  `overflow: hidden`**, es decir, la página entera sin scroll.
