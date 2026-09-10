import { isAdmin } from "../../../../lib/admin-auth";
import { db } from "../../../../lib/store";

export async function PUT(request: Request) {
  if (!await isAdmin(request)) return Response.json({error:"No autorizado"},{status:401});
  const input=await request.json() as Record<string,string>; const allowed=["shipping_lima","shipping_province","pickup_address","engraving_price"];
  const statements=allowed.filter((key)=>input[key]!==undefined).map((key)=>db().prepare("INSERT INTO settings (key,value,updated_at) VALUES (?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(key,String(input[key])));
  if (statements.length) await db().batch(statements); return Response.json({ok:true});
}
