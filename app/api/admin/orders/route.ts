import { isAdmin } from "../../../../lib/admin-auth";
import { db } from "../../../../lib/store";

export async function GET(request: Request) {
  if (!await isAdmin(request)) return Response.json({error:"No autorizado"},{status:401});
  const rows=await db().prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 200").all();
  return Response.json({orders:rows.results.map((o)=>({...o,items:JSON.parse(String((o as Record<string,unknown>).items_json||"[]"))}))});
}

export async function PUT(request: Request) {
  if (!await isAdmin(request)) return Response.json({error:"No autorizado"},{status:401});
  const {id,status}=await request.json() as {id:number;status:string};
  if (!["pending_payment","paid","preparing","shipped","delivered","cancelled"].includes(status)) return Response.json({error:"Estado inválido"},{status:400});
  await db().prepare("UPDATE orders SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(status,id).run();
  return Response.json({ok:true});
}
