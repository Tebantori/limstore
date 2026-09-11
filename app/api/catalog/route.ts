import { db, ensureCatalogSeeded, productFromRow } from "../../../lib/store";
import { seedProducts } from "../../../lib/catalog";

export async function GET() {
  try {
    await ensureCatalogSeeded();
    const rows = await db()
      .prepare("SELECT * FROM products WHERE active = 1 ORDER BY featured DESC, id ASC")
      .all();
    const settingsRows = await db()
      .prepare("SELECT key,value FROM settings")
      .all<{ key: string; value: string }>();
    const settings = Object.fromEntries(
      settingsRows.results.map((r) => [r.key, r.value])
    );
    return Response.json({
      products: rows.results.map((r) => productFromRow(r as never)),
      settings,
    });
  } catch (error) {
    console.warn("D1 not ready or unavailable, falling back to seedCatalog:", error);
    return Response.json({
      products: seedProducts.filter((p) => p.active),
      settings: {
        shipping_lima: "10",
        shipping_province: "10",
        pickup_address: "Ate, Lima — coordinamos el punto exacto al confirmar",
        engraving_price: "5",
      },
    });
  }
}
