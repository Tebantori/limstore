CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`status` text DEFAULT 'pending_payment' NOT NULL,
	`customer_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`document` text DEFAULT '' NOT NULL,
	`department` text NOT NULL,
	`district` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`reference` text DEFAULT '' NOT NULL,
	`shipping_method` text NOT NULL,
	`shipping_cost` real DEFAULT 0 NOT NULL,
	`subtotal` real NOT NULL,
	`total` real NOT NULL,
	`items_json` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`payment_id` text,
	`payment_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_code_unique` ON `orders` (`code`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sku` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`price` real NOT NULL,
	`capacity` text DEFAULT '' NOT NULL,
	`material` text DEFAULT '' NOT NULL,
	`measure` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`colors_json` text DEFAULT '[]' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`customizable` integer DEFAULT true NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
