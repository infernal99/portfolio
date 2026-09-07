/**
 * Captura una imagen de cada proyecto desde su web desplegada.
 *
 * Las imágenes del portfolio son capturas reales, no maquetas: si un proyecto
 * cambia de diseño, se vuelve a ejecutar esto y el portfolio queda al día.
 *
 *   node scripts/capture-shots.mjs
 *
 * Necesita un Chrome instalado. Si no está en la ruta habitual de Windows,
 * pásalo con CHROME_PATH=/ruta/a/chrome.
 */
import { existsSync, mkdirSync } from "node:fs";
import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT_DIR = path.join(ROOT, "public", "projects");

const VIEWPORT = { width: 1440, height: 900 };
/** Ancho final del webp: el doble del hueco en pantalla, para pantallas retina. */
const OUTPUT_WIDTH = 1440;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);

const SHOTS = [
  { id: "velhoura-empyre", url: "https://velhouraempyre.vercel.app/" },
  { id: "gym-tracker", url: "https://gym-tracker-teal-xi.vercel.app/" },
  { id: "roady", url: "https://drivy-rho.vercel.app/" },
  { id: "velhoura", url: "https://velhoura.com/" },
];

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      `No he encontrado Chrome. Rutas probadas:\n  ${CHROME_CANDIDATES.join("\n  ")}\n` +
        "Ejecuta con CHROME_PATH=/ruta/a/chrome.exe",
    );
  }
  return found;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: "shell",
    args: ["--hide-scrollbars", "--disable-features=IsolateOrigins"],
  });

  try {
    for (const shot of SHOTS) {
      const page = await browser.newPage();
      await page.setViewport({ ...VIEWPORT, deviceScaleFactor: 2 });

      process.stdout.write(`· ${shot.id} … `);
      await page.goto(shot.url, { waitUntil: "networkidle2", timeout: 60_000 });

      // Las cuatro webs animan la entrada: sin esta espera se captura el
      // estado inicial, con el contenido todavía invisible.
      await new Promise((r) => setTimeout(r, 3500));

      // Roady saluda con el aviso de cookies y el de instalación de la PWA.
      // Son correctos en la app y ruido en una captura de portfolio.
      const dismissed = await page.evaluate(() => {
        const closers = document.querySelectorAll(
          'button[aria-label="Cerrar"], button[aria-label="Close"]',
        );
        closers.forEach((b) => b.click());
        return closers.length;
      });
      if (dismissed) await new Promise((r) => setTimeout(r, 900));

      const tmp = path.join(OUT_DIR, `${shot.id}.png`);
      await page.screenshot({ path: tmp });
      await page.close();

      const webp = path.join(OUT_DIR, `${shot.id}.webp`);
      await sharp(await readFile(tmp))
        .resize(OUTPUT_WIDTH)
        .webp({ quality: 82 })
        .toFile(webp);
      await unlink(tmp);

      const { size } = await sharp(webp).metadata();
      process.stdout.write(`ok (${Math.round((size ?? 0) / 1024)} kB)\n`);
    }
  } finally {
    await browser.close();
  }

  console.log(`\nImágenes en ${path.relative(ROOT, OUT_DIR)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
