import { DICTIONARIES, PROFILE, STACK } from "@/lib/content";

/**
 * Datos estructurados. Solo hechos verificables del CV y de los perfiles
 * públicos: ni un puesto, ni una fecha, ni una habilidad de más.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: "Fullstack Developer",
    email: `mailto:${PROFILE.email}`,
    description: DICTIONARIES.es.meta.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Premià de Mar",
      addressRegion: "Barcelona",
      addressCountry: "ES",
    },
    sameAs: [PROFILE.github, PROFILE.linkedin],
    knowsLanguage: ["ca", "es", "en"],
    knowsAbout: STACK.flatMap((group) => group.items),
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Escola Pia Santa Anna, Mataró",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // El objeto es estático y no contiene entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
