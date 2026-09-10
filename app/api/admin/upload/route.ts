import { env } from "cloudflare:workers";
import { isAdmin } from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!await isAdmin(request)) return Response.json({ error:"No autorizado" }, { status:401 });
  if (!env.BUCKET) return Response.json({ error:"Almacenamiento no disponible" }, { status:503 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 8_000_000) return Response.json({ error:"Usa una imagen JPG, PNG o WebP de máximo 8 MB." }, { status:400 });
  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi,"") || "jpg";
  const key = `products/${crypto.randomUUID()}.${ext}`;
  await env.BUCKET.put(key, file.stream(), { httpMetadata:{ contentType:file.type } });
  return Response.json({ url:`/api/media/${key}` });
}
