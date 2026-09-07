/**
 * Fuente única de verdad del portfolio.
 *
 * Todo dato de esta lista está verificado contra una de estas fuentes:
 *  - CV de Ian Monfil (fechas, empresas, titulaciones, tecnologías, idiomas)
 *  - Los `package.json` públicos de los repos (stack real de cada proyecto)
 *  - Las webs desplegadas de los cuatro proyectos (qué hace cada una)
 *
 * Nada aquí es una estimación ni una métrica de negocio. Si un dato no se puede
 * verificar en una de esas fuentes, no entra en este fichero.
 */

export type Lang = "es" | "en";

export const LANGS: Lang[] = ["es", "en"];

/* ------------------------------------------------------------------ */
/* Datos de contacto y perfiles                                        */
/* ------------------------------------------------------------------ */

export const PROFILE = {
  name: "Ian Monfil",
  firstName: "IAN",
  lastName: "MONFIL",
  email: "ianmonfil2006@gmail.com",
  location: "Premià de Mar, Barcelona",
  github: "https://github.com/infernal99",
  githubHandle: "infernal99",
  linkedin: "https://www.linkedin.com/in/ian-monfil-odena-806850406/",
  studio: "https://velhouraempyre.vercel.app/",
} as const;

/* ------------------------------------------------------------------ */
/* Proyectos                                                           */
/* ------------------------------------------------------------------ */

export type ProjectStatus = "live" | "building";

export interface Project {
  id: string;
  index: string;
  name: string;
  url: string;
  domain: string;
  year: string;
  status: ProjectStatus;
  featured: boolean;
  /** Stack leído del package.json del repo o de la propia web. */
  stack: string[];
  /** Acento cálido propio de la pieza, dentro de la paleta del sitio. */
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    id: "velhoura-empyre",
    index: "01",
    name: "Velhoura Empyre",
    url: "https://velhouraempyre.vercel.app/",
    domain: "velhouraempyre.vercel.app",
    year: "2026",
    status: "live",
    featured: true,
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Three.js",
      "React Three Fiber",
      "Theatre.js",
      "Motion",
    ],
    accent: "#C2571E",
  },
  {
    id: "gym-tracker",
    index: "02",
    name: "Gym Tracker",
    url: "https://gym-tracker-teal-xi.vercel.app/",
    domain: "gym-tracker-teal-xi.vercel.app",
    year: "2026",
    status: "building",
    featured: false,
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Supabase",
      "Tailwind CSS 4",
      "Recharts",
      "MediaPipe Vision",
      "React Hook Form",
      "Zod",
    ],
    accent: "#8A6A3F",
  },
  {
    id: "roady",
    index: "03",
    name: "Roady",
    url: "https://drivy-rho.vercel.app/",
    domain: "drivy-rho.vercel.app",
    year: "2026",
    status: "building",
    featured: false,
    stack: [
      "React 19",
      "Vite",
      "TypeScript",
      "Supabase",
      "Zustand",
      "React Router",
      "Stripe",
      "Web Push",
      "PWA",
    ],
    accent: "#A8542C",
  },
  {
    id: "velhoura",
    index: "04",
    name: "Velhoura",
    url: "https://velhoura.com/",
    domain: "velhoura.com",
    year: "2025",
    status: "live",
    featured: false,
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "E-commerce"],
    accent: "#6E5B47",
  },
];

/* ------------------------------------------------------------------ */
/* Trayectoria                                                         */
/* ------------------------------------------------------------------ */

export type MilestoneKind = "education" | "work" | "product";

export interface Milestone {
  id: string;
  period: string;
  kind: MilestoneKind;
  place: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: "smx",
    period: "2022 — 2024",
    kind: "education",
    place: "Escola Pia Santa Anna, Mataró",
  },
  {
    id: "vimtech",
    period: "Jul 2023 — Ene 2024",
    kind: "work",
    place: "Vimtech, Masnou",
  },
  {
    id: "daw",
    period: "2024 — 2026",
    kind: "education",
    place: "Escola Pia Santa Anna, Mataró",
  },
  {
    id: "worldline",
    period: "Oct 2025 — Jun 2026",
    kind: "work",
    place: "Worldline, Barcelona",
  },
  {
    id: "velhoura",
    period: "2025 — hoy",
    kind: "product",
    place: "Velhoura",
  },
  {
    id: "tecnocampus",
    period: "2026 — ...",
    kind: "education",
    place: "Tecnocampus",
  },
];

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */

export interface StackGroup {
  id: string;
  items: string[];
}

export const STACK: StackGroup[] = [
  {
    id: "frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Motion",
      "Three.js",
      "React Three Fiber",
    ],
  },
  {
    id: "backend",
    items: ["Supabase", "PHP", "Python", "MySQL", "APIs REST", "Stripe"],
  },
  {
    id: "tools",
    items: ["Git", "GitHub", "Vercel", "Vite", "PWA / Web Push", "Scrum"],
  },
];

export const LANGUAGES = [
  { id: "ca", level: "native" },
  { id: "es", level: "native" },
  { id: "en", level: "b1" },
] as const;

/* ------------------------------------------------------------------ */
/* Copy bilingüe                                                       */
/* ------------------------------------------------------------------ */

interface ProjectCopy {
  role: string;
  tagline: string;
  problem: string;
  description: string;
}

export interface Dictionary {
  meta: { title: string; description: string };
  nav: { sections: Record<string, string>; menu: string; close: string };
  hero: {
    role: string;
    lead: string;
    scroll: string;
    availability: string;
  };
  manifesto: { lines: string[]; note: string };
  path: {
    label: string;
    title: string;
    intro: string;
    kinds: Record<MilestoneKind, string>;
    items: Record<string, { title: string; detail: string }>;
  };
  work: {
    label: string;
    title: string;
    intro: string;
    featured: string;
    status: Record<ProjectStatus, string>;
    visit: string;
    role: string;
    problem: string;
    stack: string;
    preview: string;
    projects: Record<string, ProjectCopy>;
  };
  stack: {
    label: string;
    title: string;
    intro: string;
    groups: Record<string, string>;
    languagesTitle: string;
    languages: Record<string, string>;
    levels: Record<string, string>;
  };
  now: {
    label: string;
    title: string;
    body: string[];
  };
  contact: {
    label: string;
    title: string;
    intro: string;
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    githubNote: string;
    studioLabel: string;
    studioNote: string;
    footer: string;
  };
  a11y: { langToggle: string; toTop: string };
}

const es: Dictionary = {
  meta: {
    title: "Ian Monfil — Desarrollador Fullstack",
    description:
      "Desarrollador fullstack de Premià de Mar. Formado en DAW, con prácticas en Worldline y cofundador de Velhoura, donde construyo productos digitales propios de principio a fin.",
  },
  nav: {
    sections: {
      hero: "Inicio",
      manifesto: "Manifiesto",
      path: "Trayectoria",
      work: "Proyectos",
      stack: "Stack",
      now: "Ahora",
      contact: "Contacto",
    },
    menu: "Menú",
    close: "Cerrar",
  },
  hero: {
    role: "Desarrollador Fullstack",
    lead:
      "Construyo productos digitales de principio a fin. Del primer commit al dominio en producción.",
    scroll: "Desliza",
    availability: "Premià de Mar · Barcelona",
  },
  manifesto: {
    lines: [
      "Empecé abriendo ordenadores.",
      "Aprendí a escribir el software que corre dentro.",
      "Ahora construyo los productos que la gente usa.",
    ],
    note:
      "Tres años, tres capas: hardware, código y producto. Cada paso me acercó a lo mismo — entender la máquina entera, de la placa base al usuario final.",
  },
  path: {
    label: "01 — Trayectoria",
    title: "Cómo he llegado hasta aquí.",
    intro:
      "Una progresión con una dirección clara: de reparar máquinas a construir productos propios, y de ahí a la ingeniería.",
    kinds: { education: "Formación", work: "Experiencia", product: "Producto" },
    items: {
      smx: {
        title: "Grado Medio en Sistemas Microinformáticos y Redes",
        detail:
          "El punto de partida: hardware, sistemas y redes. Aprender cómo funciona una máquina antes de programarla.",
      },
      vimtech: {
        title: "Técnico Informático — Prácticas FCT",
        detail:
          "Reparación y mantenimiento de equipos, diagnóstico de hardware y sustitución de componentes. Soporte técnico y atención al cliente.",
      },
      daw: {
        title: "Grado Superior en Desarrollo de Aplicaciones Web",
        detail:
          "El salto al software: desarrollo web fullstack, bases de datos y bases de programación que sigo usando cada día.",
      },
      worldline: {
        title: "Desarrollador Fullstack — Prácticas FCT",
        detail:
          "Ocho meses en una empresa de pagos: componentes y páginas con React y Next.js, integración con APIs REST en entornos reales de producción, metodología ágil (Scrum) y revisión de código.",
      },
      velhoura: {
        title: "Cofundador y desarrollador",
        detail:
          "Estudio digital fundado por dos socios. Aquí dejé de hacer ejercicios y empecé a construir productos con usuarios reales, marca y decisiones propias.",
      },
      tecnocampus: {
        title: "Ingeniería Informática",
        detail:
          "El siguiente capítulo: profundizar en los fundamentos —algoritmia, arquitectura, sistemas— mientras sigo construyendo.",
      },
    },
  },
  work: {
    label: "02 — Proyectos",
    title: "Lo que he construido.",
    intro:
      "Cuatro productos en producción, con su dominio, sus usuarios y sus decisiones técnicas. No son ejercicios de clase.",
    featured: "Proyecto destacado",
    status: { live: "En producción", building: "En desarrollo activo" },
    visit: "Ver proyecto",
    role: "Rol",
    problem: "Qué resuelve",
    stack: "Stack",
    preview: "Captura de la web de",
    projects: {
      "velhoura-empyre": {
        role: "Cofundador · Desarrollo y producto",
        tagline: "El estudio desde el que construyo todo lo demás.",
        problem:
          "Las ideas se quedan en ideas. Velhoura existe para llevarlas hasta el final: diseñar, construir y lanzar productos digitales propios, y desarrollar webs para quien las necesita.",
        description:
          "Web del estudio: ocho secciones con narrativa continua, animación dirigida por scroll, 3D en tiempo real y presentación de los productos que construimos. Fundado por dos socios; yo llevo desarrollo y producto.",
      },
      "gym-tracker": {
        role: "Desarrollo fullstack",
        tagline: "Un ecosistema de entrenamiento, no una hoja de cálculo.",
        problem:
          "Llevar el progreso en el gimnasio suele acabar en notas sueltas que nadie mantiene. Gym Tracker registra los entrenamientos, los convierte en progreso visible y añade la motivación que falta: logros y retos entre amigos.",
        description:
          "Aplicación con cuentas de usuario sobre Supabase: registro de entrenamientos, biblioteca de ejercicios, estadísticas y retos sociales. Formularios validados con Zod y gráficas de progreso.",
      },
      roady: {
        role: "Desarrollo fullstack · Contenido",
        tagline: "Aprobar el teórico entendiendo, no memorizando.",
        problem:
          "Las apps del teórico del permiso B repiten bancos de preguntas de origen dudoso. Roady construye el suyo desde normativa y fuentes oficiales, cita cada fuente y usa repetición espaciada para que estudiar se convierta en aprender.",
        description:
          "Aplicación instalable (PWA) con cuentas, progreso, exámenes y notificaciones push. Cada pregunta lleva su origen y su enlace a la fuente; las señales son ilustraciones propias en SVG, no material redistribuido.",
      },
      velhoura: {
        role: "Desarrollo web",
        tagline: "Marca propia, tienda propia.",
        problem:
          "Una marca de gafas de sol necesita algo más que un catálogo: necesita una tienda que transmita la marca. Esta es la nuestra, diseñada y construida de cero.",
        description:
          "Tienda online completa: catálogo de modelos, fichas de producto con variantes de color, carrito, checkout y secciones editoriales de campaña.",
      },
    },
  },
  stack: {
    label: "03 — Stack",
    title: "Con qué construyo.",
    intro:
      "Solo tecnologías que uso de verdad en los proyectos de arriba o que he trabajado en formación y prácticas.",
    groups: {
      frontend: "Frontend",
      backend: "Backend y datos",
      tools: "Herramientas y método",
    },
    languagesTitle: "Idiomas",
    languages: { ca: "Catalán", es: "Castellano", en: "Inglés" },
    levels: { native: "Nativo", b1: "B1" },
  },
  now: {
    label: "04 — Ahora",
    title: "Lo que viene.",
    body: [
      "Empiezo Ingeniería Informática en Tecnocampus, con la intención de construir la base teórica que sostenga todo lo que ya estoy haciendo en la práctica.",
      "En paralelo sigo desarrollando los productos de Velhoura. Gym Tracker y Roady están en desarrollo activo: se despliegan, se rompen, se arreglan y se vuelven a desplegar cada semana.",
      "Busco seguir creciendo como desarrollador en equipos donde el código se revisa, se discute y se lanza.",
    ],
  },
  contact: {
    label: "05 — Contacto",
    title: "Construyamos algo.",
    intro:
      "¿Un proyecto, una oportunidad o simplemente hablar de producto? Escríbeme.",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    githubNote: "El código y el día a día",
    studioLabel: "Velhoura",
    studioNote: "El estudio que cofundé",
    footer: "Diseñado y desarrollado por Ian Monfil",
  },
  a11y: { langToggle: "Cambiar idioma", toTop: "Volver arriba" },
};

const en: Dictionary = {
  meta: {
    title: "Ian Monfil — Fullstack Developer",
    description:
      "Fullstack developer from Premià de Mar, Spain. Trained in web development, interned at Worldline and co-founder of Velhoura, where I build digital products end to end.",
  },
  nav: {
    sections: {
      hero: "Home",
      manifesto: "Manifesto",
      path: "Path",
      work: "Work",
      stack: "Stack",
      now: "Now",
      contact: "Contact",
    },
    menu: "Menu",
    close: "Close",
  },
  hero: {
    role: "Fullstack Developer",
    lead:
      "I build digital products end to end. From the first commit to a live domain.",
    scroll: "Scroll",
    availability: "Premià de Mar · Barcelona",
  },
  manifesto: {
    lines: [
      "I started by opening up computers.",
      "Then I learned to write the software running inside.",
      "Now I build the products people actually use.",
    ],
    note:
      "Three years, three layers: hardware, code and product. Every step pushed me toward the same thing — understanding the whole machine, from the motherboard to the end user.",
  },
  path: {
    label: "01 — Path",
    title: "How I got here.",
    intro:
      "A progression with a clear direction: from repairing machines to building my own products, and from there into engineering.",
    kinds: { education: "Education", work: "Experience", product: "Product" },
    items: {
      smx: {
        title: "Vocational Degree in Microcomputer Systems & Networks",
        detail:
          "The starting point: hardware, systems and networks. Understanding how a machine works before programming it.",
      },
      vimtech: {
        title: "IT Technician — Internship",
        detail:
          "Repair and maintenance of computer equipment, hardware diagnostics and component replacement. Technical support and customer service.",
      },
      daw: {
        title: "Higher Vocational Degree in Web Application Development",
        detail:
          "The jump into software: fullstack web development, databases and the programming foundations I still use every day.",
      },
      worldline: {
        title: "Fullstack Developer — Internship",
        detail:
          "Eight months at a payments company: components and pages with React and Next.js, REST API integration in real production environments, agile methodology (Scrum) and code review.",
      },
      velhoura: {
        title: "Co-founder and developer",
        detail:
          "A digital studio founded by two partners. This is where I stopped doing exercises and started building products with real users, a real brand and my own decisions.",
      },
      tecnocampus: {
        title: "Computer Engineering",
        detail:
          "The next chapter: going deeper into the fundamentals — algorithms, architecture, systems — while I keep building.",
      },
    },
  },
  work: {
    label: "02 — Work",
    title: "What I've built.",
    intro:
      "Four products in production, each with its own domain, users and technical decisions. These are not class assignments.",
    featured: "Featured project",
    status: { live: "Live", building: "Actively building" },
    visit: "View project",
    role: "Role",
    problem: "What it solves",
    stack: "Stack",
    preview: "Screenshot of",
    projects: {
      "velhoura-empyre": {
        role: "Co-founder · Development and product",
        tagline: "The studio everything else is built from.",
        problem:
          "Ideas stay ideas. Velhoura exists to take them all the way: designing, building and launching our own digital products — and building websites for those who need them.",
        description:
          "The studio site: eight sections with continuous narrative, scroll-driven animation, real-time 3D and a showcase of the products we build. Founded by two partners; I handle development and product.",
      },
      "gym-tracker": {
        role: "Fullstack development",
        tagline: "A training ecosystem, not a spreadsheet.",
        problem:
          "Tracking gym progress usually ends up in scattered notes nobody keeps. Gym Tracker logs workouts, turns them into visible progress and adds the missing piece: achievements and challenges between friends.",
        description:
          "An app with user accounts on Supabase: workout logging, exercise library, statistics and social challenges. Forms validated with Zod and progress charts.",
      },
      roady: {
        role: "Fullstack development · Content",
        tagline: "Passing the theory test by understanding, not memorising.",
        problem:
          "Driving-theory apps recycle question banks of dubious origin. Roady builds its own from regulations and official sources, cites every source, and uses spaced repetition so studying becomes learning.",
        description:
          "An installable app (PWA) with accounts, progress tracking, mock exams and push notifications. Every question carries its origin and a link to the source; road signs are original SVG illustrations, not redistributed material.",
      },
      velhoura: {
        role: "Web development",
        tagline: "Our own brand, our own store.",
        problem:
          "A sunglasses brand needs more than a catalogue: it needs a store that carries the brand. This is ours, designed and built from scratch.",
        description:
          "A complete online store: model catalogue, product pages with colour variants, cart, checkout and editorial campaign sections.",
      },
    },
  },
  stack: {
    label: "03 — Stack",
    title: "What I build with.",
    intro:
      "Only technologies I actually use in the projects above or have worked with during my training and internships.",
    groups: {
      frontend: "Frontend",
      backend: "Backend & data",
      tools: "Tools & method",
    },
    languagesTitle: "Languages",
    languages: { ca: "Catalan", es: "Spanish", en: "English" },
    levels: { native: "Native", b1: "B1" },
  },
  now: {
    label: "04 — Now",
    title: "What's next.",
    body: [
      "I'm starting a Computer Engineering degree at Tecnocampus, to build the theoretical foundation underneath everything I'm already doing in practice.",
      "Alongside it I keep developing Velhoura's products. Gym Tracker and Roady are actively being built: deployed, broken, fixed and deployed again every week.",
      "I'm looking to keep growing as a developer in teams where code gets reviewed, argued about and shipped.",
    ],
  },
  contact: {
    label: "05 — Contact",
    title: "Let's build something.",
    intro:
      "A project, an opportunity, or just to talk product? Drop me a line.",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    githubNote: "The code and the day to day",
    studioLabel: "Velhoura",
    studioNote: "The studio I co-founded",
    footer: "Designed and developed by Ian Monfil",
  },
  a11y: { langToggle: "Switch language", toTop: "Back to top" },
};

export const DICTIONARIES: Record<Lang, Dictionary> = { es, en };

/** Periodos localizados (los meses cambian de idioma, las fechas no). */
export const PERIODS: Record<Lang, Record<string, string>> = {
  es: {
    smx: "2022 — 2024",
    vimtech: "Jul 2023 — Ene 2024",
    daw: "2024 — 2026",
    worldline: "Oct 2025 — Jun 2026",
    velhoura: "2025 — hoy",
    tecnocampus: "2026 — ...",
  },
  en: {
    smx: "2022 — 2024",
    vimtech: "Jul 2023 — Jan 2024",
    daw: "2024 — 2026",
    worldline: "Oct 2025 — Jun 2026",
    velhoura: "2025 — today",
    tecnocampus: "2026 — ...",
  },
};

export const SECTION_IDS = [
  "hero",
  "manifesto",
  "path",
  "work",
  "stack",
  "now",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
