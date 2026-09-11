import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }), sku: text("sku").notNull().unique(),
  name: text("name").notNull(), slug: text("slug").notNull().unique(), category: text("category").notNull(),
  price: real("price").notNull(), capacity: text("capacity").notNull().default(""), material: text("material").notNull().default(""),
  measure: text("measure").notNull().default(""), description: text("description").notNull().default(""), image: text("image").notNull().default(""),
  colorsJson: text("colors_json").notNull().default("[]"), featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  customizable: integer("customizable", { mode: "boolean" }).notNull().default(true), active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_products_active_category").on(table.active, table.category)]);

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }), code: text("code").notNull().unique(),
  status: text("status").notNull().default("pending_payment"), customerName: text("customer_name").notNull(),
  email: text("email").notNull(), phone: text("phone").notNull(), document: text("document").notNull().default(""),
  department: text("department").notNull(), district: text("district").notNull().default(""), address: text("address").notNull().default(""),
  reference: text("reference").notNull().default(""), shippingMethod: text("shipping_method").notNull(),
  shippingCost: real("shipping_cost").notNull().default(0), subtotal: real("subtotal").notNull(), total: real("total").notNull(),
  itemsJson: text("items_json").notNull(), notes: text("notes").notNull().default(""), paymentId: text("payment_id"), paymentUrl: text("payment_url"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_orders_status_created").on(table.status, table.createdAt)]);

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(), value: text("value").notNull(), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
