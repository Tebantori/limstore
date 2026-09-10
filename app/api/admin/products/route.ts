import { isAdmin } from "../../../../lib/admin-auth";
import { db, ensureCatalogSeeded, productFromRow } from "../../../../lib/store";

export async function GET(request: Request) {
  if (!await isAdmin(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  await ensureCatalogSeeded();
  const rows = await db().prepare("SELECT * FROM products ORDER BY active DESC, id ASC").all();
  return Response.json({ products: rows.results.map((r) => productFromRow(r as never)) });
}

export async function POST(request: Request) {
  if (!await isAdmin(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const p = await request.json() as Record<string, unknown>;
  const sku = String(p.sku || "").trim(); const name = String(p.name || "").trim(); const slug = String(p.slug || "").trim();
  if (!sku || !name || !slug || Number(p.price) < 0) return Response.json({ error: "Completa SKU, nombre, enlace y precio." }, { status: 400 });
  const stmt = db().prepare(`INSERT INTO products (sku,name,slug,category,price,capacity,material,measure,description,image,colors_json,featured,customizable,active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(sku,name,slug,String(p.category||"Termos"),Number(p.price),String(p.capacity||""),String(p.material||"Acero inoxidable 304"),String(p.measure||""),String(p.description||""),String(p.image||""),JSON.stringify(p.colors||[]),p.featured?1:0,p.customizable===false?0:1,p.active===false?0:1);
  try { const result = await stmt.run(); return Response.json({ ok:true, id:result.meta.last_row_id }); }
  catch { return Response.json({ error:"El SKU o enlace ya existe." }, { status:409 }); }
}

export async function PUT(request: Request) {
  if (!await isAdmin(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const p = await request.json() as Record<string, unknown>;
  if (!p.id) return Response.json({ error:"Producto inválido" }, { status:400 });
  await db().prepare(`UPDATE products SET sku=?,name=?,slug=?,category=?,price=?,capacity=?,material=?,measure=?,description=?,image=?,colors_json=?,featured=?,customizable=?,active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .bind(String(p.sku),String(p.name),String(p.slug),String(p.category),Number(p.price),String(p.capacity||""),String(p.material||""),String(p.measure||""),String(p.description||""),String(p.image||""),JSON.stringify(p.colors||[]),p.featured?1:0,p.customizable?1:0,p.active?1:0,Number(p.id)).run();
  return Response.json({ ok:true });
}

export async function DELETE(request: Request) {
  if (!await isAdmin(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await db().prepare("UPDATE products SET active=0, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(id).run();
  return Response.json({ ok:true });
}
