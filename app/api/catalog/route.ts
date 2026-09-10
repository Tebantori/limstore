import { db, ensureCatalogSeeded, productFromRow } from "../../../lib/store";

export async function GET() {
  try {
    await ensureCatalogSeeded();
    const rows = await db().prepare("SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, id ASC").all();
    const settingsRows = await db().prepare("SELECT key,value FROM settings").all<{key:string;value:string}>();
    const settings = Object.fromEntries(settingsRows.results.map((r) => [r.key, r.value]));
    return Response.json({ products: rows.results.map((r) => productFromRow(r as never)), settings });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "No pudimos cargar el catálogo." }, { status: 503 });
  }
}
