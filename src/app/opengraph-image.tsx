import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ian Monfil — Desarrollador Fullstack";

/** Tarjeta para compartir: misma paleta y misma jerarquía que el hero. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f1e8",
          color: "#171512",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6b6355",
            fontFamily: "monospace",
          }}
        >
          <span>Desarrollador Fullstack</span>
          <span>Barcelona</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 168, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
            IAN
          </div>
          <div
            style={{
              fontSize: 168,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "#c2571e",
            }}
          >
            MONFIL
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#4a443a",
          }}
        >
          <span style={{ maxWidth: 620 }}>
            Construyo productos digitales de principio a fin.
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 20 }}>
            {PROFILE.githubHandle}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
