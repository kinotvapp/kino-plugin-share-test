// Share-cards device check: buttons that open the target through go.plugin, and a thumbnail made by kino.image.thumbnail.
const TARGET = "kinotvapp/kino-plugin-share-test/target";
const MISSING = "kinotvapp/kino-plugin-share-test/missing";
const POSTER = "https://image.tmdb.org/t/p/w780/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg";

const text = (s, more = {}) => ({ type: "Text", text: s, textEn: s, ...more });
const go = (key, label, plugin) => ({ type: "ElevatedButton", key, labelText: label, labelTextEn: label, onPressed: { go: { plugin } } });

const CARD = {
  title: "Prueba de tarjeta",
  description: "Abre el item 42 de este plugin",
  image: POSTER,
  route: { name: "item", argsJson: "{\"id\":\"42\"}" },
  text: "Mira esta tarjeta",
};

export async function screen({ state = {}, route } = {}) {
  const s = state || {};
  if (route && route.name === "item") {
    const shown = "item " + String((route.args && route.args.id) || "?");
    return {
      type: "Scaffold",
      appBar: { type: "AppBar", title: "Abre tarjetas", titleEn: "Card opener" },
      body: { type: "Column", padding: 24, gap: 12, children: [text(shown, { key: "shown", style: "h2" })] },
    };
  }
  const children = [
    go("item", "1. Abrir item 42", { repo: TARGET, route: "item", args: { id: "42" } }),
    go("other", "2. Ruta no listada (otra)", { repo: TARGET, route: "other", args: { id: "7" }, query: "otra" }),
    go("query", "3. Sin ruta, buscar hola", { repo: TARGET, query: "hola" }),
    go("missing", "4. Plugin no instalado", { repo: MISSING, route: "item", args: { id: "1" } }),
    { type: "ElevatedButton", key: "thumb", labelText: "5. Miniatura", labelTextEn: "5. Thumbnail", onPressed: "thumb" },
    { type: "ElevatedButton", key: "card", labelText: "6. Compartir tarjeta", labelTextEn: "6. Share a card", onPressed: "card" },
    { type: "ElevatedButton", key: "cardNow", labelText: "7. Publicar ya", labelTextEn: "7. Post now", onPressed: "cardNow" },
  ];
  if (s.thumbInfo) children.push(text(s.thumbInfo, { key: "info", style: "caption" }));
  if (s.thumb) children.push({ type: "Image", key: "img", url: s.thumb, fit: "contain", height: 300 });
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", title: "Abre tarjetas", titleEn: "Card opener" },
    body: { type: "SingleChildScrollView", children: [{ type: "Column", padding: 16, gap: 12, children }] },
  };
}

export async function screenEvent({ name } = {}) {
  if (name === "card" || name === "cardNow") {
    try {
      const arg = name === "cardNow" ? { ...CARD, publish: true } : CARD;
      const r = await kino.plugins.call("social", "card", arg);
      const info = "card: " + JSON.stringify(r);
      kino.log(info);
      return { state: { thumbInfo: info } };
    } catch (e) {
      const code = String((e && e.code) || e);
      kino.log("card error: " + code);
      if (code === "provider_missing") return { state: { thumbInfo: "card error: " + code }, go: { installPlugin: { repo: "kinotvapp/kino-social" } } };
      return { state: { thumbInfo: "card error: " + code } };
    }
  }
  if (name !== "thumb") return null;
  try {
    const t = Date.now();
    const uri = await kino.image.thumbnail(POSTER);
    const b64 = uri.slice(uri.indexOf(",") + 1);
    const bytes = Math.floor((b64.length * 3) / 4) - (b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0);
    const info = "ok: " + uri.slice(0, 23) + "… " + bytes + " bytes, " + (Date.now() - t) + " ms";
    kino.log("thumbnail " + info);
    return { state: { thumb: uri, thumbInfo: info } };
  } catch (e) {
    const info = "error: " + String((e && e.code) || e);
    kino.log("thumbnail " + info);
    return { state: { thumb: null, thumbInfo: info } };
  }
}
