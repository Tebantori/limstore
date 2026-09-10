declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_PASSWORD?: string;
    ADMIN_SESSION_SECRET?: string;
    MERCADOPAGO_ACCESS_TOKEN?: string;
    SITE_URL?: string;
  }
}
