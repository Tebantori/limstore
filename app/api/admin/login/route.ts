import { adminConfigured, createAdminToken, validPassword } from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json() as { password?: string };
  if (!adminConfigured()) return Response.json({ error: "El acceso administrativo aún no está configurado." }, { status: 503 });
  if (!password || !validPassword(password)) return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  const token = await createAdminToken();
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": `lim_admin=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200` } });
}

export async function DELETE() {
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type":"application/json", "set-cookie":"lim_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0" } });
}
