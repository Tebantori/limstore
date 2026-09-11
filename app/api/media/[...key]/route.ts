import { env } from "cloudflare:workers";

export async function GET(request: Request, context: { params: Promise<{ key: string[] }> }) {
  if (!env.BUCKET) return new Response("No disponible", { status:503 });
  const { key } = await context.params;
  const object = await env.BUCKET.get(key.join("/"));
  if (!object) return new Response("No encontrado", { status:404 });
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("etag",object.httpEtag); headers.set("cache-control","public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
