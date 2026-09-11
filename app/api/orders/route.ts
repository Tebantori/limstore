import { env } from "cloudflare:workers";
import { z } from "zod";
import { db, ensureCatalogSeeded, makeOrderCode } from "../../../lib/store";

const itemSchema = z.object({ sku:z.string().min(1), quantity:z.number().int().min(1).max(10), color:z.string().min(1), engraving:z.string().max(40).optional().default(""), font:z.string().max(30).optional().default(""), icon:z.string().max(30).optional().default("") });
const orderSchema = z.object({ customerName:z.string().min(3).max(100), email:z.string().email(), phone:z.string().min(7).max(20), document:z.string().max(20).optional().default(""), department:z.string().min(2), district:z.string().max(80).optional().default(""), address:z.string().max(180).optional().default(""), reference:z.string().max(180).optional().default(""), shippingMethod:z.enum(["pickup","lima","province"]), notes:z.string().max(300).optional().default(""), items:z.array(itemSchema).min(1).max(20) });

export async function POST(request: Request) {
  try {
    await ensureCatalogSeeded();
    const input = orderSchema.parse(await request.json());
    const uniqueSkus = [...new Set(input.items.map((i) => i.sku))];
    const placeholders = uniqueSkus.map(() => "?").join(",");
    const rows = await db().prepare(`SELECT sku,name,price,image,colors_json,customizable FROM products WHERE active=1 AND sku IN (${placeholders})`).bind(...uniqueSkus).all<Record<string, unknown>>();
    const products = new Map(rows.results.map((p) => [String(p.sku), p]));
    const settings = await db().prepare("SELECT key,value FROM settings WHERE key IN ('shipping_lima','shipping_province','engraving_price')").all<{key:string;value:string}>();
    const fees = Object.fromEntries(settings.results.map((r)=>[r.key,Number(r.value)]));
    const orderItems = input.items.map((item) => {
      const p = products.get(item.sku); if (!p) throw new Error("Uno de los productos ya no está disponible.");
      const colors = JSON.parse(String(p.colors_json||"[]")) as {name:string;stock:number}[];
      const variant = colors.find((v) => v.name === item.color);
      if (!variant || variant.stock < item.quantity) throw new Error(`${String(p.name)} en ${item.color} no tiene stock suficiente.`);
      const engraving = p.customizable ? item.engraving.trim() : "";
      const engravingFee = engraving ? (fees.engraving_price ?? 5) : 0;
      const unitPrice = Number(p.price) + engravingFee;
      return { ...item, name:String(p.name), price:Number(p.price), unitPrice, engravingFee, image:String(p.image), engraving, lineTotal:unitPrice*item.quantity };
    });
    const shippingCost = input.shippingMethod === "pickup" ? 0 : input.shippingMethod === "lima" ? (fees.shipping_lima ?? 10) : (fees.shipping_province ?? 10);
    const subtotal = orderItems.reduce((sum,item)=>sum+item.lineTotal,0); const total=subtotal+shippingCost; const code=makeOrderCode();
    const result = await db().prepare(`INSERT INTO orders (code,customer_name,email,phone,document,department,district,address,reference,shipping_method,shipping_cost,subtotal,total,items_json,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(code,input.customerName,input.email,input.phone,input.document,input.department,input.district,input.address,input.reference,input.shippingMethod,shippingCost,subtotal,total,JSON.stringify(orderItems),input.notes).run();
    let paymentUrl: string | null = null;
    if (env.MERCADOPAGO_ACCESS_TOKEN) {
      const origin = env.SITE_URL || new URL(request.url).origin;
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", { method:"POST", headers:{ "authorization":`Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,"content-type":"application/json" }, body:JSON.stringify({
        external_reference:code,
        items:[...orderItems.map((i)=>({id:i.sku,title:`${i.name} · ${i.color}${i.engraving?` · grabado “${i.engraving}”`:""}`,quantity:i.quantity,currency_id:"PEN",unit_price:i.unitPrice})),...(shippingCost?[{id:"shipping",title:"Envío",quantity:1,currency_id:"PEN",unit_price:shippingCost}]:[])],
        payer:{name:input.customerName,email:input.email,phone:{number:input.phone}},
        back_urls:{success:`${origin}/?pedido=${code}&pago=exitoso`,pending:`${origin}/?pedido=${code}&pago=pendiente`,failure:`${origin}/?pedido=${code}&pago=fallido`}, auto_return:"approved", notification_url:`${origin}/api/payments/webhook`
      }) });
      if (response.ok) { const preference=await response.json() as {id:string;init_point:string}; paymentUrl=preference.init_point; await db().prepare("UPDATE orders SET payment_id=?,payment_url=? WHERE id=?").bind(preference.id,paymentUrl,result.meta.last_row_id).run(); }
      else console.error("Mercado Pago", await response.text());
    }
    return Response.json({ code,total,paymentUrl,status:paymentUrl?"payment_ready":"reserved" });
  } catch (error) {
    const message = error instanceof z.ZodError ? "Revisa los datos de contacto y entrega." : error instanceof Error ? error.message : "No pudimos crear el pedido.";
    return Response.json({ error:message }, { status:400 });
  }
}
