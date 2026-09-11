import { env } from "cloudflare:workers";
import { db } from "../../../../lib/store";

export async function POST(request: Request) {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) return new Response("ok");
  const url = new URL(request.url); const body = await request.json().catch(()=>({})) as {data?:{id?:string}};
  const paymentId = body.data?.id || url.searchParams.get("data.id"); if (!paymentId) return new Response("ok");
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers:{authorization:`Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`} });
  if (!response.ok) return new Response("verification failed", { status:502 });
  const payment = await response.json() as {status:string;external_reference?:string};
  if (payment.status === "approved" && payment.external_reference) {
    const order = await db().prepare("SELECT status,items_json FROM orders WHERE code=?").bind(payment.external_reference).first<{status:string;items_json:string}>();
    if (order && order.status !== "paid") {
      const items=JSON.parse(order.items_json) as {sku:string;color:string;quantity:number}[];
      const updates=[];
      for (const item of items) {
        const row=await db().prepare("SELECT id,colors_json FROM products WHERE sku=?").bind(item.sku).first<{id:number;colors_json:string}>();
        if (!row) continue; const colors=JSON.parse(row.colors_json) as {name:string;stock:number}[];
        const next=colors.map((c)=>c.name===item.color?{...c,stock:Math.max(0,c.stock-item.quantity)}:c);
        updates.push(db().prepare("UPDATE products SET colors_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(JSON.stringify(next),row.id));
      }
      updates.push(db().prepare("UPDATE orders SET status='paid',payment_id=?,updated_at=CURRENT_TIMESTAMP WHERE code=? AND status!='paid'").bind(String(paymentId),payment.external_reference));
      await db().batch(updates);
    }
  }
  return new Response("ok");
}
