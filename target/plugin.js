// Share-cards device check: the target of go.plugin. Route "item" (listed in openFrom.routes) shows "item <args.id>".
const text = (s, more = {}) => ({ type: "Text", text: s, textEn: s, ...more });

export async function search(query) {
  const q = String((query && query.q) || "");
  return [{ id: "t1", ref: "t1", title: "Resultado de prueba: " + q, kind: "movie" }];
}

export async function resolve() {
  throw new Error("solo prueba");
}

export async function screen({ route } = {}) {
  const r = route || {};
  const shown = r.name === "item" ? "item " + String((r.args && r.args.id) || "?") : "pantalla principal (" + String(r.name || "main") + ")";
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", title: "Destino", titleEn: "Target" },
    body: { type: "Column", padding: 24, gap: 12, children: [text(shown, { key: "shown", style: "h2" })] },
  };
}

export async function screenEvent() {
  return null;
}
