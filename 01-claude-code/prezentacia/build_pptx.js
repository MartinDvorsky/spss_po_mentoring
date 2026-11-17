// Generuje 01-claude-code.pptx
// Spustenie: npm install && npm run build
const path = require("path");
const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");

const OUT = path.join(__dirname, "01-claude-code.pptx");
const REPO = "https://github.com/MartinDvorsky/spss_po_mentoring";
const INSTALL = "https://code.claude.com/docs/en/quickstart";

const THEME = {
  name: "SPS Mentoring",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1F1E1D", lt1: "FFFFFF", dk2: "3D3A36", lt2: "F3F1EC",
    accent1: "D97757", accent2: "2E7D6B", accent3: "B3412F",
    accent4: "6B7A8F", accent5: "E8B04B", accent6: "8A5A44",
    hlink: "D97757", folHlink: "8A5A44",
  },
};
const COL = {
  ink: "1F1E1D", ink2: "3D3A36", muted: "6E6A64", paper: "FFFFFF",
  tint: "F3F1EC", accent: "D97757", accentSoft: "F8E4DB",
  good: "2E7D6B", goodSoft: "DDEEE9", bad: "B3412F", badSoft: "F6DEDA",
  code: "26241F", codeText: "F3F1EC",
};
const MONO = "Consolas";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.author = "Martin Dvorsky";
pres.title = "AI v praxi: od chatu k agentom (Claude Code)";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "DARK",
  background: { color: COL.ink },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.6, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: COL.paper, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 2.9, w: 8.8, h: 0.8, fontSize: 20, color: "CFCAC2", valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: COL.paper },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.3, w: 9.0, h: 0.75, fontSize: 30, bold: true, color: COL.ink, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 9.2, y: 5.25, w: 0.5, h: 0.25, fontSize: 10, color: COL.muted, align: "right" },
});

// ---------- helpers ----------
function content(title, section) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  return s;
}
function dark(title, sub, section) {
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  if (sub) s.addText(sub, { placeholder: "body" });
  return s;
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08, fill: { color: fill || COL.tint }, line: { color: fill || COL.tint },
  });
}
function badge(s, x, y, label, fill, color) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.5, h: 0.5, fill: { color: fill || COL.accent }, line: { color: fill || COL.accent } });
  s.addText(label, { x, y, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: color || COL.paper, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
function text(s, t, x, y, w, h, o) {
  s.addText(t, Object.assign({ x, y, w, h, fontSize: 15, color: COL.ink2, valign: "top", margin: 0, isTextBox: true }, o || {}));
}
function code(s, t, x, y, w, h, fontSize) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: COL.code }, line: { color: COL.code } });
  s.addText(t, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2, fontFace: MONO, fontSize: fontSize || 12, color: COL.codeText, valign: "top", margin: 0, isTextBox: true });
}
function bullets(items, o) {
  return items.map((it, i) => {
    const runs = typeof it === "string" ? [{ text: it }] : it;
    return runs.map((r, j) => ({
      text: r.text,
      options: Object.assign({}, r.options || {}, j === 0 ? { bullet: { indent: 14 } } : {}, j === runs.length - 1 && i < items.length - 1 ? { breakLine: true, paraSpaceAfter: (o && o.space) || 6 } : {}),
    }));
  }).flat();
}
const B = (t) => ({ text: t, options: { bold: true, color: COL.ink } });
const M = (t) => ({ text: t, options: { fontFace: MONO, color: COL.accent, bold: true } });

async function build() {
  // ===== 1. Titulka =====
  pres.addSection({ title: "Úvod" });
  let s = dark("AI v praxi: od chatu k agentom", "Týždeň 1 · Claude Code v praxi", "Úvod");
  s.addText("Martin Dvorský", { x: 0.6, y: 4.6, w: 6, h: 0.4, fontSize: 16, color: COL.accent, bold: true, margin: 0, isTextBox: true });
  s.addText("SPŠ strojnícka · mentoring AI a embedded systémy", { x: 0.6, y: 4.95, w: 6, h: 0.3, fontSize: 12, color: "A39E96", margin: 0, isTextBox: true });
  s.addNotes("Privítanie. Dnes: ako reálne pracovať s LLM a s Claude Code – žiadna teória o tokenoch, len veci, ktoré používam každý deň. Druhá polovica je praktická ukážka na Arduine.");

  // ===== 2. O mne =====
  s = content("Kto som", "Úvod");
  card(s, 0.5, 1.3, 3.3, 3.75, COL.ink);
  s.addText("Martin Dvorský", { x: 0.75, y: 1.5, w: 2.9, h: 0.45, fontSize: 22, bold: true, color: COL.paper, margin: 0, isTextBox: true });
  s.addText("Špecializácia", { x: 0.75, y: 2.15, w: 2.9, h: 0.3, fontSize: 12, color: "A39E96", margin: 0, isTextBox: true });
  ["Machine Learning", "LLM & AI agenti", "Python", "Práca s dátami"].forEach((t, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.75, y: 2.5 + i * 0.6, w: 2.8, h: 0.45, rectRadius: 0.2, fill: { color: COL.accent }, line: { color: COL.accent } });
    s.addText(t, { x: 0.75, y: 2.5 + i * 0.6, w: 2.8, h: 0.45, fontSize: 14, bold: true, color: COL.paper, align: "center", valign: "middle", margin: 0, isTextBox: true });
  });
  const tl = [
    ["TUKE", "Informatika, 4. ročník", "Technická univerzita v Košiciach"],
    ["Elprokan s.r.o. · 3 roky", "Software developer", "Automatizácia procesov v stavebnom konaní"],
    ["BSH Slovakia · teraz", "Systémový architekt", "Focus: LLM a práca s dátami"],
  ];
  s.addShape(pres.shapes.LINE, { x: 4.45, y: 1.6, w: 0, h: 3.1, line: { color: "D8D3CB", width: 2 } });
  tl.forEach(([a, b, c], i) => {
    const y = 1.35 + i * 1.25;
    s.addShape(pres.shapes.OVAL, { x: 4.3, y: y + 0.12, w: 0.3, h: 0.3, fill: { color: i === 2 ? COL.accent : COL.paper }, line: { color: COL.accent, width: 2 } });
    text(s, a, 4.85, y, 4.6, 0.3, { fontSize: 12, color: COL.muted });
    text(s, b, 4.85, y + 0.3, 4.6, 0.38, { fontSize: 18, bold: true, color: COL.ink });
    text(s, c, 4.85, y + 0.68, 4.6, 0.3, { fontSize: 14 });
  });
  s.addNotes("4. ročník informatiky na TUKE. 3 roky v Elprokan s.r.o. ako SW developer – automatizovali sme procesy v stavebnom konaní (dokumenty, podania, kontrola). Teraz BSH Slovakia ako systémový architekt – hlavne LLM riešenia a práca s dátami. Špecializácia ML, LLM, Python.");

  // ===== 3. GitHub =====
  s = content("Všetky materiály nájdete na GitHube", "Úvod");
  const qr = await QRCode.toDataURL(REPO, { margin: 1, width: 512, color: { dark: "#1F1E1DFF", light: "#FFFFFFFF" } });
  card(s, 0.5, 1.35, 5.6, 3.6, COL.tint);
  text(s, "Repozitár kurzu", 0.8, 1.6, 5, 0.35, { fontSize: 14, color: COL.muted });
  s.addText("github.com/MartinDvorsky/\nspss_po_mentoring", { x: 0.8, y: 2.0, w: 5.1, h: 1.0, fontSize: 22, bold: true, color: COL.accent, fontFace: MONO, margin: 0, isTextBox: true, hyperlink: { url: REPO } });
  s.addText(bullets([
    "každý týždeň vlastný priečinok: 01-…, 02-…",
    "prezentácia + kód z ukážky + úloha",
    "pokojne si to klonujte a skúšajte doma",
  ]), { x: 0.8, y: 3.2, w: 5.1, h: 1.5, fontSize: 15, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  s.addImage({ data: qr, x: 6.6, y: 1.35, w: 2.9, h: 2.9, altText: "QR kód na GitHub repozitár" });
  text(s, "naskenuj", 6.6, 4.35, 2.9, 0.3, { fontSize: 12, color: COL.muted, align: "center" });
  s.addNotes("Nechajte ich naskenovať QR. Všetko, čo dnes ukážem, je v priečinku 01-claude-code.");

  // ===== 4. Čo nás čaká =====
  s = content("Čo si prejdeme", "Úvod");
  const topics = [
    "AI v praxi: od chatu k agentom",
    "Arduino + LLM: hardvér prirodzeným jazykom",
    "TinyML: prediktívna údržba",
    "Počítačové videnie na kontrolu kvality",
    "RAG chatbot nad školským poriadkom",
    "Vlastný MCP server: Claude ovláda Arduino",
  ];
  topics.forEach((t, i) => {
    const x = 0.5 + (i % 3) * 3.05, y = 1.35 + Math.floor(i / 3) * 1.9;
    card(s, x, y, 2.85, 1.7, i === 0 ? COL.accentSoft : COL.tint);
    badge(s, x + 0.25, y + 0.25, String(i + 1), i === 0 ? COL.accent : COL.ink);
    text(s, t, x + 0.25, y + 0.9, 2.4, 0.7, { fontSize: 15, bold: true, color: COL.ink });
  });
  s.addNotes("Len prehľad – každý týždeň jedna téma, vždy prezentácia + praktická ukážka s hardvérom. Dnes téma 1.");

  // ===== 5. LLM nie je deterministické =====
  pres.addSection({ title: "LLM v praxi" });
  s = content("LLM nie je deterministické", "LLM v praxi");
  code(s, "> Napíš funkciu na blikanie LED", 0.5, 1.35, 3.6, 0.6, 13);
  ["Verzia A: delay(500)", "Verzia B: millis() + stav", "Verzia C: Ticker knižnica"].forEach((t, i) => {
    const y = 2.25 + i * 0.85;
    s.addShape(pres.shapes.LINE, { x: 2.3, y: 1.95, w: 1.9, h: y + 0.3 - 1.95, line: { color: "C9C3BA", width: 1.5, endArrowType: "triangle" } });
    card(s, 4.2, y, 2.55, 0.6, COL.tint);
    text(s, t, 4.3, y, 2.4, 0.6, { fontSize: 12, valign: "middle", fontFace: MONO });
  });
  text(s, "Čo z toho plynie", 6.95, 1.35, 2.6, 0.35, { fontSize: 16, bold: true, color: COL.ink });
  s.addText(bullets([
    "rovnaký prompt ≠ rovnaká odpoveď",
    "keď niečo nevyjde, skús znova – alebo lepšie zadanie",
    "dôležité veci napíš explicitne („bez delay“)",
    "výsledok vždy over",
  ], { space: 8 }), { x: 6.95, y: 1.8, w: 2.6, h: 3.2, fontSize: 14, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  s.addNotes("Model generuje odpoveď pravdepodobnostne. Ten istý prompt dá zakaždým trochu iné riešenie. V praxi: nie je to kalkulačka. Ak chcem konkrétny prístup, musím ho napísať. A ak výsledok nesedí, často pomôže začať odznova s lepším zadaním.");

  // ===== 6. Kontextové okno =====
  s = content("Kontextové okno sa plní", "LLM v praxi");
  text(s, "Všetko, čo model „vidí“: tvoje správy, jeho odpovede, prečítané súbory, výstupy príkazov, CLAUDE.md…", 0.5, 1.25, 9, 0.6, { fontSize: 15 });
  const seg = [["CLAUDE.md", 1.0, COL.ink], ["konverzácia", 2.1, COL.accent], ["súbory", 1.7, "E8B04B"], ["výstupy príkazov", 1.9, COL.ink2], ["voľné", 2.3, "E6E2DB"]];
  let sx = 0.5;
  seg.forEach(([l, w, c], i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 2.05, w, h: 0.65, fill: { color: c }, line: { color: COL.paper, width: 1 } });
    s.addText(l, { x: sx, y: 2.05, w, h: 0.65, fontSize: 12, bold: true, color: i === 4 ? COL.muted : COL.paper, align: "center", valign: "middle", margin: 0, isTextBox: true });
    sx += w;
  });
  const ctx = [
    ["Plné okno = horšie výsledky", "Model zabúda začiatok, mieša staré a nové úlohy, robí viac chýb."],
    ["Jedna úloha = jeden kontext", "Po dokončení úlohy /clear. Nová úloha nemá čo robiť so starou."],
    ["Sleduj, čo tam je", "/context ukáže, čo zaberá miesto. Dlhé logy a veľké súbory ho zahltia."],
  ];
  ctx.forEach(([h, b], i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 3.05, 2.85, 1.95, COL.tint);
    text(s, h, x + 0.2, 3.2, 2.45, 0.6, { fontSize: 15, bold: true, color: COL.ink });
    text(s, b, x + 0.2, 3.85, 2.45, 1.1, { fontSize: 13 });
  });
  s.addNotes("Kontextové okno je pracovná pamäť modelu. Má limit a hlavne – kvalita klesá dávno pred tým, ako je plné. Najčastejšia chyba začiatočníkov: jedna nekonečná konverzácia na všetko. Ukážeme /context v ukážke.");

  // ===== 7. Halucinácie =====
  s = content("Halucinácie: sebavedomo a zle", "LLM v praxi");
  code(s, "#include <ArduinoFastLED.h>  // neexistuje\n\nvoid setup() {\n  setPinPWM(9, 128);  // neexistuje\n}", 0.5, 1.35, 4.5, 1.9, 13);
  text(s, "Vyzerá to dôveryhodne – a ani jedna z týchto vecí neexistuje.", 0.5, 3.4, 4.5, 0.6, { fontSize: 13, italic: true, color: COL.bad });
  text(s, "Ako sa brániť", 5.4, 1.35, 4.1, 0.35, { fontSize: 16, bold: true, color: COL.ink });
  const def = [["Kompiluj", "kompilátor nepustí neexistujúcu funkciu"], ["Testuj", "testy a reálny HW povedia pravdu"], ["Daj mu zdroj", "dokumentácia, datasheet, chybová hláška"], ["Pýtaj sa „si si istý?“", "lepšie: „over to v dokumentácii“"]];
  def.forEach(([h, b], i) => {
    const y = 1.85 + i * 0.8;
    badge(s, 5.4, y, "✓", COL.good);
    text(s, h, 6.05, y - 0.03, 3.45, 0.3, { fontSize: 14, bold: true, color: COL.ink });
    text(s, b, 6.05, y + 0.27, 3.45, 0.3, { fontSize: 13 });
  });
  s.addNotes("Halucinácia = model si vymyslí knižnicu, funkciu, pin, parameter. Najnebezpečnejšie je, že to vyzerá úplne presvedčivo. Preto agent, ktorý si kód sám skompiluje a otestuje, je oveľa spoľahlivejší ako chat – chyby sa ukážu hneď.");

  // ===== 8. Model vie len to, čo vidí =====
  s = content("Model vie len to, čo mu dáš", "LLM v praxi");
  card(s, 0.5, 1.35, 4.35, 3.65, COL.badSoft);
  text(s, "Zlé zadanie", 0.75, 1.5, 3.9, 0.35, { fontSize: 16, bold: true, color: COL.bad });
  code(s, "> nefunguje mi to, oprav to", 0.75, 1.95, 3.85, 0.55, 13);
  s.addText(bullets(["čo nefunguje?", "aká chyba?", "aký HW, aké zapojenie?", "čo už si skúšal?"]), { x: 0.75, y: 2.75, w: 3.9, h: 2.1, fontSize: 14, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  card(s, 5.15, 1.35, 4.35, 3.65, COL.goodSoft);
  text(s, "Dobré zadanie", 5.4, 1.5, 3.9, 0.35, { fontSize: 16, bold: true, color: COL.good });
  code(s, "> LED na pine 9 nesvieti.\n  Zapojenie: pin 9 → 220 Ω → LED\n  → GND. Serial vypisuje\n  \"Tlacidlo stlacene\". Pozri\n  @src/main.cpp a nájdi príčinu.", 5.4, 1.95, 3.85, 1.65, 12);
  s.addText(bullets(["čo sa deje vs. čo čakám", "kontext (HW, súbor, chyba)", "konkrétny cieľ"]), { x: 5.4, y: 3.8, w: 3.9, h: 1.1, fontSize: 14, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  s.addNotes("Model nevidí tvoju dosku, tvoju obrazovku ani chybovú hlášku, ktorú si nevložil. Čím presnejší kontext, tým lepší výsledok. Agent si veľa vecí zistí sám (prečíta súbory, spustí build), ale zapojenie a zámer mu musíš povedať ty.");

  // ===== 9. Chat vs agent =====
  pres.addSection({ title: "Claude Code" });
  s = content("Chat vs. agent", "Claude Code");
  card(s, 0.5, 1.35, 4.35, 3.65, COL.tint);
  text(s, "Chat (claude.ai, ChatGPT…)", 0.75, 1.55, 3.9, 0.35, { fontSize: 16, bold: true, color: COL.ink });
  s.addText(bullets(["ty kopíruješ kód tam a späť", "nevidí tvoje súbory", "nevie nič spustiť ani skompilovať", "chybu mu musíš vložiť ty"], { space: 10 }), { x: 0.75, y: 2.1, w: 3.9, h: 2.7, fontSize: 15, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  card(s, 5.15, 1.35, 4.35, 3.65, COL.ink);
  text(s, "Agent (Claude Code)", 5.4, 1.55, 3.9, 0.35, { fontSize: 16, bold: true, color: COL.accent });
  s.addText(bullets(["číta a upravuje súbory v projekte", "spúšťa príkazy (pio run, pytest, git)", "vidí chyby a sám ich opravuje", "pracuje v slučke, kým nie je hotovo"], { space: 10 }), { x: 5.4, y: 2.1, w: 3.9, h: 2.7, fontSize: 15, color: "E6E2DB", valign: "top", margin: 0, isTextBox: true });
  s.addNotes("Agent = LLM + nástroje + slučka. Sám si prečíta kód, urobí zmenu, spustí kompiláciu, uvidí chybu a opraví ju. Ty robíš zadanie a kontrolu.");

  // ===== 10. Inštalácia =====
  s = content("Inštalácia", "Claude Code");
  card(s, 0.5, 1.35, 9.0, 1.3, COL.accentSoft);
  text(s, "Oficiálny návod (vždy aktuálny)", 0.8, 1.5, 8.4, 0.35, { fontSize: 14, color: COL.muted });
  s.addText(INSTALL, { x: 0.8, y: 1.9, w: 8.4, h: 0.5, fontSize: 20, bold: true, color: COL.accent, fontFace: MONO, margin: 0, isTextBox: true, hyperlink: { url: INSTALL } });
  text(s, "Odporúčam: používať v termináli", 0.5, 2.95, 9, 0.4, { fontSize: 18, bold: true, color: COL.ink });
  code(s, "cd moj-projekt\nclaude", 0.5, 3.5, 3.0, 1.0, 15);
  s.addText(bullets([
    "terminál = plná funkcionalita, všetko nové príde najprv sem",
    "vedľa si otvor VS Code a sleduj zmeny v súboroch",
    "spúšťaj vždy v priečinku projektu – tam hľadá CLAUDE.md",
  ], { space: 8 }), { x: 3.8, y: 3.5, w: 5.7, h: 1.5, fontSize: 15, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  s.addNotes("Inštaláciu neukazujem krok po kroku – návod sa mení, vždy použite oficiálny link. Potrebujete účet (Pro plán alebo API). Ja odporúčam terminál – VS Code rozšírenie je fajn, ale terminál je základ.");

  // ===== 11. Základné príkazy =====
  s = content("Základné príkazy", "Claude Code");
  const cmds = [
    ["/clear", "nová konverzácia, čistý kontext"],
    ["/context", "čo zaberá kontextové okno"],
    ["/compact", "zhrnie konverzáciu, uvoľní miesto"],
    ["/init", "vytvorí CLAUDE.md pre projekt"],
    ["/model", "výber modelu"],
    ["/plan · Shift+Tab", "plan mode – najprv plán, potom kód"],
    ["Esc Esc · /rewind", "vrátiť kód aj konverzáciu späť"],
    ["@súbor", "pridá súbor do správy"],
    ["! príkaz", "spustí príkaz v termináli (! pio run)"],
    ["/advisor", "silnejší model ako poradca"],
  ];
  cmds.forEach(([c, d], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6, y = 1.3 + row * 0.75;
    card(s, x, y, 4.4, 0.62, COL.tint);
    s.addText(c, { x: x + 0.15, y, w: 2.05, h: 0.62, fontFace: MONO, fontSize: 12, bold: true, color: COL.accent, valign: "middle", margin: 0, isTextBox: true });
    text(s, d, x + 2.25, y, 2.05, 0.62, { fontSize: 12, valign: "middle" });
  });
  s.addNotes("Netreba sa učiť všetky. Každý deň používam /clear, /context, plan mode (Shift+Tab), @súbor a ! príkaz. Esc Esc je záchrana, keď agent niečo pokazí – vráti kód aj konverzáciu.");

  // ===== 12. Čo sa kedy načíta do kontextu =====
  s = content("Konfigurácia: čo sa kedy dostane do kontextu", "Claude Code");
  const cfg = [
    ["CLAUDE.md", "vždy, pri štarte", "Kontext projektu", COL.bad],
    [".claude/rules/*.md", "keď pracuje so súbormi, ktoré pravidlo pokrýva", "Pravidlá pre časť kódu", "E8B04B"],
    [".claude/skills/…", "popis vždy, obsah až pri použití", "Opakovateľný postup", COL.good],
    ["hooks (settings.json)", "nikdy – bežia mimo modelu", "Automatika, vždy sa vykoná", COL.ink2],
  ];
  text(s, "Súbor", 0.7, 1.25, 2.6, 0.3, { fontSize: 12, color: COL.muted });
  text(s, "Kedy je v kontexte", 3.65, 1.25, 3.5, 0.3, { fontSize: 12, color: COL.muted });
  text(s, "Na čo", 7.0, 1.25, 2.5, 0.3, { fontSize: 12, color: COL.muted });
  cfg.forEach(([f, w, n, c], i) => {
    const y = 1.6 + i * 0.85;
    card(s, 0.5, y, 9.0, 0.72, COL.tint);
    s.addShape(pres.shapes.OVAL, { x: 0.7, y: y + 0.26, w: 0.2, h: 0.2, fill: { color: c }, line: { color: c } });
    s.addText(f, { x: 1.0, y, w: 2.6, h: 0.72, fontFace: MONO, fontSize: 13, bold: true, color: COL.ink, valign: "middle", margin: 0, isTextBox: true });
    text(s, w, 3.65, y, 3.25, 0.72, { fontSize: 14, valign: "middle" });
    text(s, n, 7.0, y, 2.4, 0.72, { fontSize: 14, valign: "middle", bold: true, color: COL.ink });
  });
  text(s, "Čím viac je v kontexte vždy, tým menej miesta ostane na prácu.", 0.5, 5.0, 9, 0.3, { fontSize: 13, italic: true, color: COL.muted });
  s.addNotes("Toto je najdôležitejší slajd o konfigurácii. Kľúčová otázka pri každej veci: kedy sa načíta do kontextu a koľko miesta zaberie. CLAUDE.md je tam stále – preto krátky. Skill je tam len jeho popis – obsah sa načíta, až keď ho treba. Hook nie je v kontexte vôbec, je to obyčajný skript.");

  // ===== 13. CLAUDE.md =====
  s = content("CLAUDE.md – krátko a k veci", "Claude Code");
  card(s, 0.5, 1.35, 4.35, 3.7, COL.goodSoft);
  text(s, "✓ Dobré (~380 znakov)", 0.7, 1.45, 4, 0.35, { fontSize: 15, bold: true, color: COL.good });
  code(s, "# Arduino demo\n- PlatformIO, Arduino Uno (env uno)\n- Build: pio run\n- Upload: pio run -e uno -t upload\n- LED pin 9, tlačidlo pin 2\n  (INPUT_PULLUP)\n- Komentáre po slovensky\n- Po zmene over, že pio run\n  prejde", 0.7, 1.85, 3.95, 3.0, 12);
  card(s, 5.15, 1.35, 4.35, 2.0, COL.badSoft);
  text(s, "✗ Zlé", 5.35, 1.45, 4, 0.35, { fontSize: 15, bold: true, color: COL.bad });
  s.addText(bullets(["„Píš kvalitný a čistý kód“", "celá dokumentácia knižnice", "veci, ktoré vidí v kóde sám", "500 riadkov histórie projektu"]), { x: 5.35, y: 1.85, w: 4, h: 1.45, fontSize: 13, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  text(s, "Moje pravidlá", 5.15, 3.5, 4.35, 0.35, { fontSize: 15, bold: true, color: COL.ink });
  s.addText(bullets([
    [B("do ~500 znakov"), { text: " – ide do každej správy" }],
    [{ text: "len čo " }, B("nevie z kódu"), { text: ": príkazy, HW, konvencie" }],
    [{ text: "začni cez " }, M("/init"), { text: ", potom osekaj" }],
  ]), { x: 5.15, y: 3.9, w: 4.35, h: 1.2, fontSize: 13, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  s.addNotes("CLAUDE.md sa načíta pri každom štarte a je v kontexte celý čas. Oficiálne odporúčanie je pod 200 riadkov, ja odporúčam ešte oveľa menej – pár riadkov. Píš len to, čo model nezistí z kódu: ako buildovať, aký HW, aké zapojenie, konvencie. Všeobecné rady typu 'píš čistý kód' nemajú zmysel. /init vygeneruje návrh – a potom z neho vymaž polovicu.");

  // ===== 14. Rules =====
  s = content("Rules – pravidlá pre časť projektu", "Claude Code");
  text(s, ".claude/rules/arduino.md", 0.5, 1.3, 4.6, 0.35, { fontSize: 14, bold: true, fontFace: MONO, color: COL.muted });
  code(s, "---\npaths: \"src/**/*.cpp,src/**/*.h\"\n---\n# Pravidlá pre Arduino kód\n- Žiadne delay() v loop(),\n  časovanie cez millis()\n- Piny ako const uint8_t\n- Tlačidlá vždy s debounce\n- Serial len pri zmene stavu", 0.5, 1.7, 4.6, 3.3, 12);
  text(s, "Prečo nie všetko do CLAUDE.md?", 5.45, 1.3, 4.05, 0.35, { fontSize: 16, bold: true, color: COL.ink });
  s.addText(bullets([
    [M("paths:"), { text: " pravidlo sa načíta, až keď Claude pracuje s týmito súbormi" }],
    "bez paths: načíta sa vždy (ako CLAUDE.md)",
    "jeden súbor = jedna téma (arduino, testy, python…)",
    "krátke, konkrétne, overiteľné príkazy",
  ], { space: 10 }), { x: 5.45, y: 1.8, w: 4.05, h: 2.6, fontSize: 14, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  card(s, 5.45, 4.35, 4.05, 0.65, COL.accentSoft);
  text(s, "Pravidlo = rada, nie garancia. Garancia = hook.", 5.6, 4.35, 3.8, 0.65, { fontSize: 13, bold: true, color: COL.ink, valign: "middle" });
  s.addNotes("Rules sú ako CLAUDE.md, ale rozdelené podľa oblasti. S 'paths' sa načítajú len vtedy, keď Claude číta alebo upravuje zodpovedajúce súbory – takže nezaberajú miesto zbytočne. Ale pozor: model ich môže ignorovať. Ak niečo musí platiť vždy, patrí to do hooku.");

  // ===== 15. Skills =====
  s = content("Skills – opakovateľné postupy", "Claude Code");
  text(s, ".claude/skills/arduino-code-review/SKILL.md", 0.5, 1.3, 5, 0.35, { fontSize: 13, bold: true, fontFace: MONO, color: COL.muted });
  code(s, "---\nname: arduino-code-review\ndescription: Review Arduino kódu –\n  delay(), debounce, piny, pamäť.\n  Použi keď chce review/kontrolu.\n---\n1. Prečítaj src/main.cpp\n2. Spusti pio run\n3. Prejdi checklist …\n4. Výstup ako tabuľka", 0.5, 1.7, 4.6, 3.3, 12);
  const sk = [
    ["Spustenie", "ty: /arduino-code-review\nalebo Claude sám podľa description"],
    ["Kontext", "stále je tam len name + description, zvyšok až pri použití"],
    ["Kľúč = description", "podľa nej Claude spozná, kedy skill použiť"],
  ];
  sk.forEach(([h, b], i) => {
    const y = 1.3 + i * 1.25;
    card(s, 5.45, y, 4.05, 1.1, COL.tint);
    text(s, h, 5.65, y + 0.1, 3.7, 0.3, { fontSize: 15, bold: true, color: COL.ink });
    text(s, b, 5.65, y + 0.42, 3.7, 0.65, { fontSize: 13 });
  });
  s.addNotes("Skill = návod na postup, ktorý robíš opakovane: review, release, vytvorenie nového senzora… Výhoda oproti CLAUDE.md: v kontexte je len krátky popis, celý obsah sa načíta, až keď sa skill použije. Preto môže byť dlhší. Najdôležitejšia je description – zle napísaná = Claude skill nikdy sám nepoužije.");

  // ===== 16. Hooks =====
  s = content("Hooks – automatika, ktorá sa vykoná vždy", "Claude Code");
  const flow = [["Claude upraví\nmain.cpp", COL.tint, COL.ink], ["hook spustí\npio run", COL.ink, COL.paper], ["chyba?\nexit 2", COL.badSoft, COL.bad], ["Claude vidí\nchybu a opraví", COL.goodSoft, COL.good]];
  flow.forEach(([t, f, c], i) => {
    const x = 0.5 + i * 2.35;
    card(s, x, 1.35, 1.95, 1.0, f);
    s.addText(t, { x, y: 1.35, w: 1.95, h: 1.0, fontSize: 14, bold: true, color: c, align: "center", valign: "middle", margin: 0, isTextBox: true });
    if (i < 3) s.addShape(pres.shapes.LINE, { x: x + 2.0, y: 1.85, w: 0.3, h: 0, line: { color: COL.muted, width: 2, endArrowType: "triangle" } });
  });
  code(s, "\"PostToolUse\": [{\n  \"matcher\": \"Edit|Write\",\n  \"hooks\": [{\n    \"type\": \"command\",\n    \"command\": \"bash .claude/hooks/compile.sh\"\n  }]\n}]", 0.5, 2.65, 5.1, 2.35, 12);
  text(s, ".claude/settings.json", 5.85, 2.65, 3.65, 0.3, { fontSize: 12, fontFace: MONO, color: COL.muted });
  s.addText(bullets([
    [B("deterministické"), { text: " – na rozdiel od LLM sa vykoná vždy" }],
    "formátovanie, kompilácia, testy po zmene",
    "blokovanie nebezpečných príkazov (PreToolUse)",
    "nezaberá kontext – je to obyčajný skript",
  ], { space: 8 }), { x: 5.85, y: 3.05, w: 3.65, h: 2.0, fontSize: 14, color: COL.ink2, valign: "top", margin: 0, isTextBox: true });
  s.addNotes("Hook je skript, ktorý spustí Claude Code (nie model) pri udalosti – napr. po každej úprave súboru. Model ho nemôže 'zabudnúť'. V našom deme po každej úprave .cpp beží pio run a ak kompilácia zlyhá, skript vráti exit 2 a chyba sa pošle späť Claudovi, ktorý ju opraví. Toto je obrovský rozdiel oproti chatu.");

  // ===== 17. Rady 1 =====
  pres.addSection({ title: "Praktické rady" });
  s = content("Čo mi reálne funguje (1/2)", "Praktické rady");
  const tips1 = [
    ["/clear po každej úlohe", "Hotovo → /clear. Starý kontext mätie novú úlohu a míňa limit. Radšej 10 krátkych konverzácií ako 1 dlhá."],
    ["Plan mode pred väčšou zmenou", "Shift+Tab → Claude najprv len číta a navrhne plán. Plán si prečítaj, oprav, až potom schváľ. Chyba v pláne je lacná, chyba v kóde drahá."],
    ["/advisor na ťažké veci", "/advisor opus – pri práci pridá silnejší model ako poradcu: skontroluje prístup pred začatím a pomôže, keď sa zasekne. /advisor off ho vypne."],
  ];
  tips1.forEach(([h, b], i) => {
    const y = 1.3 + i * 1.27;
    card(s, 0.5, y, 9.0, 1.12, i % 2 ? COL.paper : COL.tint);
    badge(s, 0.75, y + 0.31, String(i + 1));
    text(s, h, 1.5, y + 0.12, 7.8, 0.35, { fontSize: 16, bold: true, color: COL.ink });
    text(s, b, 1.5, y + 0.48, 7.8, 0.6, { fontSize: 13 });
  });
  s.addNotes("/clear – najdôležitejší návyk. Plan mode – pri všetkom, čo mení viac ako pár riadkov; Claude v ňom nemôže meniť súbory. /advisor – experimentálna funkcia: k hlavnému modelu pridá silnejší model (napr. Opus), ktorý sa ozve v kľúčových momentoch – pred voľbou prístupu, keď sa agent točí v chybách, pred 'hotovo'. Funguje len na niektorých plánoch/poskytovateľoch.");

  // ===== 18. Rady 2 =====
  s = content("Čo mi reálne funguje (2/2)", "Praktické rady");
  const tips2 = [
    ["Daj mu spôsob overenia", "„a spusti pio run / pytest“ – agent, ktorý vidí výsledok, sa opraví sám"],
    ["Git commit pred veľkou zmenou", "keď to pokazí, máš kam sa vrátiť (alebo Esc Esc)"],
    ["Zasekol sa 2×? /clear", "nehádaj sa s ním – nový kontext + lepšie zadanie"],
    ["Čítaj diff", "neschvaľuj naslepo – zodpovedáš za kód ty, nie AI"],
    ["Malé kroky", "jedna funkcia, overiť, ďalšia – nie celý projekt naraz"],
    ["Opakuješ sa? Skill alebo rule", "3× to isté vysvetlenie = patrí to do súboru"],
  ];
  tips2.forEach(([h, b], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6, y = 1.3 + row * 1.25;
    card(s, x, y, 4.4, 1.1, COL.tint);
    text(s, h, x + 0.2, y + 0.12, 4.0, 0.35, { fontSize: 15, bold: true, color: COL.ink });
    text(s, b, x + 0.2, y + 0.5, 4.0, 0.55, { fontSize: 13 });
  });
  s.addNotes("Najväčší skok v kvalite: dať agentovi spôsob, ako si výsledok overiť – kompilácia, testy, simulácia. Keď sa zasekne v slučke opráv, ďalšie správy to väčšinou zhoršia – /clear a zadanie lepšie. A vždy čítajte diff: kód, ktorý nechápete, nepatrí do projektu.");

  // ===== 19. Praktická ukážka =====
  pres.addSection({ title: "Ukážka" });
  s = dark("Praktická ukážka", "Arduino + PlatformIO + Claude Code", "Ukážka");
  const demo = ["claude + /context", "/arduino-code-review", "plan mode → prepis na millis()", "hook skompiluje, Claude opraví", "Wokwi / Arduino", "/clear → ďalšia úloha"];
  demo.forEach((t, i) => {
    const x = 0.6 + (i % 3) * 3.0, y = 3.85 + Math.floor(i / 3) * 0.7;
    s.addText(String(i + 1), { x, y, w: 0.4, h: 0.5, fontSize: 18, bold: true, color: COL.accent, valign: "middle", margin: 0, isTextBox: true });
    s.addText(t, { x: x + 0.4, y, w: 2.5, h: 0.5, fontSize: 13, color: "E6E2DB", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addNotes("Postup a prompty sú v 01-claude-code/prompty.md. Záloha bez HW: demo-python (3 zámerné chyby, testy padajú).");

  // ===== 20. Úloha =====
  s = content("Úloha na doma", "Ukážka");
  const hw = [
    ["Nainštaluj Claude Code", "podľa oficiálneho návodu, spusti ho v demo-arduino/"],
    ["Semafor", "3 LED + tlačidlo pre chodca – najprv plan mode, potom implementácia"],
    ["Over vo Wokwi", "alebo na reálnej doske"],
    ["Vlastný skill", "napr. /vysvetli-kod – vysvetlí kód spolužiakovi riadok po riadku"],
  ];
  hw.forEach(([h, b], i) => {
    const y = 1.3 + i * 0.95;
    badge(s, 0.5, y + 0.1, String(i + 1), COL.ink);
    text(s, h, 1.2, y + 0.02, 5.2, 0.35, { fontSize: 16, bold: true, color: COL.ink });
    text(s, b, 1.2, y + 0.4, 5.2, 0.45, { fontSize: 13 });
  });
  card(s, 6.6, 1.3, 2.9, 3.7, COL.accentSoft);
  s.addImage({ data: qr, x: 6.95, y: 1.55, w: 2.2, h: 2.2, altText: "QR kód na GitHub repozitár" });
  text(s, "Materiály, kód aj prompty sú na GitHube", 6.8, 3.95, 2.5, 0.9, { fontSize: 13, bold: true, color: COL.ink, align: "center" });
  s.addNotes("Úloha na budúci týždeň. Nabudúce: ESP32 + LLM API – ovládanie hardvéru prirodzeným jazykom.");

  await pres.writeFile({ fileName: OUT });
  await stripZipFolders(OUT);
  console.log("OK:", OUT);
}

// pptxgenjs zapisuje do ZIPu aj prazdne priecinky – OneDrive/Teams s tym maju problem
async function stripZipFolders(file) {
  const fs = require("fs");
  const JSZip = require("jszip");
  const src = await JSZip.loadAsync(fs.readFileSync(file));
  const out = new JSZip();
  for (const name of Object.keys(src.files)) {
    if (!src.files[name].dir) out.file(name, await src.files[name].async("nodebuffer"), { createFolders: false });
  }
  fs.writeFileSync(file, await out.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

build().catch((e) => { console.error(e); process.exit(1); });
