"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Flame,
  MessageCircle,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { engravingFonts, engravingIcons, type Product } from "../lib/catalog";
import type { CartItem } from "./storefront";
import { EngravingPreview } from "./engraving-preview";

const money = (value: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);

const visualOrders: Record<string, string[]> = {
  "LIM-MOON-350": ["Rosa", "Blanco", "Azul marino", "Crema", "Negro"],
  "LIM-SPIRIT-400": ["Beige", "Rosa", "Negro", "Azul"],
  "LIM-SKY-500": ["Rosa", "Azul", "Crema", "Negro"],
  "LIM-FREE-500": ["Lila", "Blanco", "Rosa", "Negro"],
  "LIM-STAR-500": ["Beige", "Lila", "Azul"],
  "LIM-FLY-600": ["Blanco", "Rosa pastel", "Lila", "Azul", "Negro"],
  "LIM-LIGHT-500": ["Negro", "Azul", "Rosa", "Beige"],
  "LIM-FAITH-MINI-600": ["Azul", "Negro", "Lila", "Rosa pastel", "Blanco"],
  "LIM-PEACE-MINI-620": ["Rosa", "Rosa pastel", "Morado", "Lila pastel", "Negro"],
  "LIM-PEACE-720": ["Beige", "Rosa", "Azul", "Negro"],
  "LIM-PRIME-800": ["Melón", "Beige", "Azul", "Negro"],
  "LIM-FAITH-900": ["Negro", "Azul", "Cuarzo", "Rosa", "Blanco", "Beige"],
  "LIM-GRACE-1000": ["Beige", "Rosa", "Negro", "Blanco"],
  "LIM-SHINE-1000": ["Rosa", "Crema", "Azul", "Lila", "Negro"],
  "LIM-MAF-1200": ["Azul", "Negro", "Fucsia", "Lila", "Crema", "Rosa"],
  "LIM-GLOW-600": ["Azul", "Rosa", "Negro"],
};

export function VariantProductImage({
  product,
  color,
}: {
  product: Product;
  color: string;
}) {
  const variant = product.colors.find((item) => item.name === color);
  if (variant?.image) {
    return (
      <img
        key={variant.image}
        className="variant-unit-image object-contain max-h-[82%] max-w-[82%]"
        src={variant.image}
        alt={`${product.name} color ${color}`}
      />
    );
  }
  const order = visualOrders[product.sku] || product.colors.map((item) => item.name);
  const index = Math.max(0, order.indexOf(color));
  const size = Math.max(100, order.length * 78);
  const position = order.length <= 1 ? 50 : (index / (order.length - 1)) * 100;
  return (
    <div
      key={`${product.sku}-${color}`}
      className="variant-crop w-full h-full"
      role="img"
      aria-label={`${product.name} color ${color}`}
      style={{
        backgroundImage: `url(${product.image})`,
        backgroundSize: `${size}% auto`,
        backgroundPosition: `${position}% center`,
      }}
    />
  );
}

export function ProductDialogV2({
  product,
  engravingPrice,
  onClose,
  onAdd,
}: {
  product: Product | null;
  engravingPrice: number;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}) {
  const [color, setColor] = useState("");
  const [engraving, setEngraving] = useState("");
  const [font, setFont] = useState("Clásica");
  const [icon, setIcon] = useState("Sin ícono");
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");

  useEffect(() => {
    setColor(product?.colors.find((item) => item.stock > 0)?.name || product?.colors[0]?.name || "");
    setEngraving("");
    setFont("Clásica");
    setIcon("Sin ícono");
    setOrientation("vertical");
  }, [product]);

  if (!product) return null;

  const variant = product.colors.find((item) => item.name === color);
  const fee = engraving.trim() ? engravingPrice : 0;
  const total = product.price + fee;

  const whatsappMessage = encodeURIComponent(
    `¡Hola LIM! Quisiera pedir este modelo personalizado:\n\n` +
      `*Producto:* ${product.name} (${product.capacity})\n` +
      `*Color:* ${color}\n` +
      (engraving.trim()
        ? `*Grabado:* "${engraving.trim()}"\n*Tipografía:* ${font}\n*Ícono:* ${icon}\n*Orientación:* ${
            orientation === "vertical" ? "Vertical (lateral)" : "Horizontal (frontal)"
          }\n`
        : `*Sin grabado personalizado*\n`) +
      `*Precio total:* ${money(total)}\n\n` +
      `¿Tienen disponibilidad para coordinar la entrega?`
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="product-dialog-v3 max-w-[1060px]! w-[95vw]! p-0! overflow-hidden rounded-3xl! border border-stone-200 shadow-2xl bg-[#fffdf9]">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Personaliza tu termo LIM con grabado láser</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px] max-h-[90vh] overflow-y-auto lg:overflow-visible">
          {/* Left Column: Live Engraving Previewer */}
          <div className="lg:col-span-6 p-5 sm:p-7 bg-[#f6f2ea] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200/80">
            <div className="relative w-full aspect-4/5 sm:aspect-square lg:aspect-auto lg:h-[480px]">
              <EngravingPreview
                product={product}
                color={color}
                text={engraving}
                font={font}
                icon={icon}
                orientation={orientation}
              />
            </div>

            {/* Feature Highlights beneath preview */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-300/60 text-center">
              <div className="flex flex-col items-center gap-1 bg-white/70 py-2 px-1 rounded-xl border border-stone-200/60">
                <Snowflake className="w-4 h-4 text-sky-600" />
                <span className="text-[10px] font-bold text-stone-800">Frío 24 Horas</span>
                <span className="text-[9px] text-stone-500">Doble pared al vacío</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/70 py-2 px-1 rounded-xl border border-stone-200/60">
                <Flame className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] font-bold text-stone-800">Calor 12 Horas</span>
                <span className="text-[9px] text-stone-500">Sin condensación</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/70 py-2 px-1 rounded-xl border border-stone-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-[10px] font-bold text-stone-800">
                  {product.material.includes("316") ? "Acero 316" : "Acero 304"}
                </span>
                <span className="text-[9px] text-stone-500">Quirúrgico & BPA Free</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls & Actions */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
            <div>
              {/* Category, Capacity & Close Button */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block text-[11px] font-bold tracking-[0.16em] uppercase text-[#28543d] bg-[#28543d]/10 px-2.5 py-0.5 rounded-full mb-2">
                    {product.category} · {product.capacity}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
                    {product.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center text-stone-600 shrink-0"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price & Engraving Callout */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-stone-900">{money(total)}</span>
                {fee > 0 && (
                  <span className="text-xs text-stone-500 font-medium">
                    (Base: {money(product.price)} + Grabado: {money(fee)})
                  </span>
                )}
                {fee === 0 && product.customizable && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Grabado gratis
                  </span>
                )}
              </div>

              {/* Product description */}
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Technical specs pills */}
              <div className="flex flex-wrap gap-2 mt-4 text-[11px] text-stone-700 font-medium">
                <span className="bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                  {product.material}
                </span>
                <span className="bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                  {product.measure}
                </span>
                <span className="bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                  Tapa 100% Hermética
                </span>
              </div>

              {/* Color Swatch Selection */}
              <div className="mt-6 pt-5 border-t border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Color: <span className="text-stone-900 font-semibold">{color}</span>
                  </Label>
                  <span className="text-[11px] text-stone-500">
                    {variant?.stock ? `${variant.stock} disponibles` : "Agotado"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.colors.map((item) => {
                    const isSelected = color === item.name;
                    const isOutOfStock = !item.stock;
                    return (
                      <button
                        type="button"
                        key={item.name}
                        disabled={isOutOfStock}
                        onClick={() => setColor(item.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? "border-[#28543d] bg-[#28543d]/10 text-[#173b2a] shadow-xs font-semibold ring-1 ring-[#28543d]"
                            : isOutOfStock
                            ? "border-stone-200 bg-stone-100 text-stone-400 line-through cursor-not-allowed opacity-60"
                            : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        <span className={`${colorClass(item.name)} inline-block w-3.5 h-3.5 rounded-full border border-black/10 shrink-0`} />
                        <span>{item.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#28543d]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Laser Engraving Customizer Studio */}
              {product.customizable && (
                <div className="mt-6 p-4 rounded-2xl bg-[#f8f5ee] border border-[#e5dfd5]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#28543d] uppercase tracking-wide">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Personalización Láser Permanente</span>
                    </div>
                    <span className="text-[11px] font-semibold text-stone-600">
                      {fee > 0 ? `+${money(fee)}` : "Incluida"}
                    </span>
                  </div>

                  <div className="space-y-3 mt-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
                        <label htmlFor="modal-engraving" className="font-semibold text-stone-800">
                          Texto grabado (nombre, palabra, fecha o frase)
                        </label>
                        <span>{engraving.length}/30</span>
                      </div>
                      <Input
                        id="modal-engraving"
                        maxLength={30}
                        value={engraving}
                        onChange={(e) => setEngraving(e.target.value)}
                        placeholder="Ej. Andrea, Dr. Carlos, Vive Bonito…"
                        className="bg-white border-stone-300 h-10 text-sm focus-visible:ring-[#28543d]"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">
                        Déjalo vacío si prefieres recibir el termo en su acabado limpio sin grabado.
                      </p>
                    </div>

                    {/* Font & Icon Selection */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <Label className="text-[11px] font-semibold text-stone-700 mb-1 block">
                          Tipografía
                        </Label>
                        <Select
                          disabled={!engraving.trim()}
                          value={font}
                          onValueChange={(v) => setFont(v || "Clásica")}
                        >
                          <SelectTrigger className="bg-white border-stone-300 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {engravingFonts.map((f) => (
                              <SelectItem key={f} value={f} className="text-xs">
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-stone-700 mb-1 block">
                          Ícono grabado
                        </Label>
                        <Select
                          disabled={!engraving.trim()}
                          value={icon}
                          onValueChange={(v) => setIcon(v || "Sin ícono")}
                        >
                          <SelectTrigger className="bg-white border-stone-300 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {engravingIcons.map((ic) => (
                              <SelectItem key={ic} value={ic} className="text-xs">
                                {ic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Engraving Orientation Toggle */}
                    {engraving.trim() && (
                      <div className="flex items-center justify-between pt-2 text-xs">
                        <span className="text-stone-600 font-medium text-[11px]">
                          Orientación del grabado:
                        </span>
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-stone-300">
                          <button
                            type="button"
                            onClick={() => setOrientation("vertical")}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                              orientation === "vertical"
                                ? "bg-[#28543d] text-white shadow-xs"
                                : "text-stone-600 hover:text-stone-900"
                            }`}
                          >
                            Vertical (lateral)
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrientation("horizontal")}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                              orientation === "horizontal"
                                ? "bg-[#28543d] text-white shadow-xs"
                                : "text-stone-600 hover:text-stone-900"
                            }`}
                          >
                            Horizontal (frontal)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Bag & WhatsApp Direct */}
            <div className="mt-6 pt-5 border-t border-stone-200 space-y-2.5">
              <Button
                className="w-full h-12 bg-[#28543d] hover:bg-[#1c3d2c] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                disabled={!color || !variant?.stock}
                onClick={() =>
                  onAdd({
                    key: `${product.sku}-${color}-${engraving}-${font}-${icon}-${orientation}`,
                    sku: product.sku,
                    name: product.name,
                    price: total,
                    engravingFee: 0,
                    image: variant?.image || product.image,
                    quantity: 1,
                    color,
                    engraving: engraving.trim(),
                    font,
                    icon,
                  })
                }
              >
                <span>Agregar a mi bolsa · {money(total)}</span>
              </Button>

              <a
                href={`https://wa.me/51969961922?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300/80 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Pedir directo por WhatsApp (Atención inmediata)</span>
              </a>

              <div className="flex items-center justify-center gap-4 text-[10px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-stone-400" />
                  Envíos a todo el Perú (Olva / Shalom)
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-stone-400" />
                  Garantía de acero y grabado
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function colorClass(name: string) {
  const n = name.toLowerCase();
  if (n.includes("negro")) return "swatch black";
  if (n.includes("azul")) return "swatch blue";
  if (n.includes("rosa") || n.includes("fucsia") || n.includes("melón")) return "swatch pink";
  if (n.includes("lila") || n.includes("morado")) return "swatch lilac";
  if (n.includes("blanco")) return "swatch white";
  if (n.includes("plomo")) return "swatch gray";
  if (n.includes("cuarzo")) return "swatch quartz";
  return "swatch cream";
}
