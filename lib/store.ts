import { env } from "cloudflare:workers";
import { seedProducts, type Product } from "./catalog";

export function db(): D1Database {
  if (!env.DB) throw new Error("La base de datos no está disponible");
  return env.DB;
}

export async function ensureCatalogSeeded() {
  const database = db();
  const row = await database.prepare("SELECT COUNT(*) AS total FROM products").first<{ total: number }>();
  if ((row?.total ?? 0) === 0) {
    const statements = seedProducts.map((p) => database.prepare(`
      INSERT OR IGNORE INTO products
        (sku,name,slug,category,price,capacity,material,measure,description,image,colors_json,featured,customizable,active)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(p.sku,p.name,p.slug,p.category,p.price,p.capacity,p.material,p.measure,p.description,p.image,JSON.stringify(p.colors),p.featured?1:0,p.customizable?1:0,1));
    await database.batch(statements);
  }
  await database.batch([
    database.prepare("INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)").bind("shipping_lima","10"),
    database.prepare("INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)").bind("shipping_province","10"),
    database.prepare("INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)").bind("pickup_address","Ate, Lima — coordinamos el punto exacto al confirmar"),
    database.prepare("INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)").bind("engraving_price","5"),
  ]);
  const faith = await database.prepare("SELECT colors_json FROM products WHERE sku=?").bind("LIM-FAITH-900").first<{colors_json:string}>();
  if (faith) {
    const generated: Record<string,string> = { Negro:"/images/products/faith-900/negro.png", Azul:"/images/products/faith-900/azul.png", Rosa:"/images/products/faith-900/rosa.png" };
    const colors = (JSON.parse(faith.colors_json || "[]") as {name:string;stock:number;image?:string}[]).map((color) => color.image || !generated[color.name] ? color : { ...color, image: generated[color.name] });
    await database.prepare("UPDATE products SET colors_json=?,updated_at=CURRENT_TIMESTAMP WHERE sku=?").bind(JSON.stringify(colors),"LIM-FAITH-900").run();
  }
}

type ProductRow = Omit<Product, "colors" | "featured" | "customizable" | "active"> & {
  colors_json: string; featured: number; customizable: number; active: number;
};

export function productFromRow(row: ProductRow): Product {
  return { ...row, price: Number(row.price), colors: JSON.parse(row.colors_json || "[]"), featured: Boolean(row.featured), customizable: Boolean(row.customizable), active: Boolean(row.active) };
}

export function makeOrderCode() {
  return `LIM-${new Date().toISOString().slice(2,10).replaceAll("-","")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
}
