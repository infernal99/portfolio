/**
 * Auditoría de contraste: mide cada texto de la página contra su fondo real.
 *
 *   npm run dev          # en otra terminal
 *   npm run audit        # (o: node scripts/audit-contrast.mjs 390)
 *
 * Abre la web local en un Chrome headless, recorre la página para que todo lo
 * animado quede visible y compone cada color de texto —con su transparencia—
 * sobre el fondo efectivo. Falla (y lo lista) todo lo que no llegue a AA:
 * 4,5:1 para texto normal y 3:1 para texto grande.
 *
 * El degradado del cierre se mide contra sus dos extremos (azure y teal) y se
 * queda el peor. Si cambias esos colores en globals.css, cámbialos aquí.
 */
import puppeteer from "puppeteer-core";
const width = Number(process.argv[2] ?? 1440);
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "shell" });
const page = await browser.newPage();
await page.setViewport({ width, height: 900 });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 2000));
// Recorre la página para que todo lo animado al entrar quede visible.
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 800)); });

const res = await page.evaluate(() => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 2;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = (css) => { ctx.clearRect(0, 0, 2, 2); ctx.fillStyle = "#000"; ctx.fillStyle = css; ctx.fillRect(0, 0, 2, 2); const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (f, b) => { const a = f[3]; return [0, 1, 2].map((i) => f[i] * a + b[i] * (1 - a)).concat(1); };
  const L = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + [0.2126, 0.7152, 0.0722][i] * v, 0);
  const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

  // Fondo efectivo: apila los fondos translúcidos hasta dar con uno opaco. Los
  // degradados se miden contra sus dos extremos y se queda el peor caso.
  function backgrounds(el) {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage.includes("gradient") && n.id === "contact") return [[10, 82, 214, 1], [0, 105, 91, 1]];
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) { stack.push(c); if (c[3] === 1) break; }
    }
    let base = [242, 252, 249, 1];
    for (const c of stack.reverse()) base = over(c, base);
    return [base];
  }

  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("body *")) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(" ");
    if (!own) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width < 2 || r.height < 2 || cs.visibility === "hidden" || +cs.opacity === 0 || el.closest("[aria-hidden=true]")) continue;
    // Anula elementos con opacidad heredada (tooltips ocultos, etc.).
    let hidden = false; for (let n = el; n; n = n.parentElement) if (+getComputedStyle(n).opacity === 0) hidden = true;
    if (hidden) continue;
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const fg = rgba(cs.color);
    const worst = Math.min(...backgrounds(el).map((bg) => ratio(over(fg, bg), bg)));
    const key = el.tagName + own.slice(0, 24) + worst.toFixed(1);
    if (seen.has(key)) continue; seen.add(key);
    out.push({ txt: own.slice(0, 38), r: +worst.toFixed(2), need: large ? 3 : 4.5, size: Math.round(size), sec: el.closest("section,footer,header,nav,dialog")?.id || el.closest("header,nav")?.tagName || "-" });
  }
  return out;
});

const fails = res.filter((x) => x.r < x.need).sort((a, b) => a.r - b.r);
console.log(`${width}px — ${res.length} textos medidos, ${fails.length} por debajo de AA`);
for (const f of fails.slice(0, 30)) console.log(`  ${String(f.r).padStart(5)}:1 (min ${f.need})  ${f.size}px  [${f.sec}]  "${f.txt}"`);
await browser.close();
