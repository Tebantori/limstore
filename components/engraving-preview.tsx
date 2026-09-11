"use client";

import React from "react";
import { Sparkles, Heart, Star, Flower2, Zap, Infinity as InfinityIcon } from "lucide-react";
import type { Product } from "../lib/catalog";
import { VariantProductImage } from "./product-dialog-v2";

interface EngravingPreviewProps {
  product: Product;
  color: string;
  text: string;
  font: string;
  icon: string;
  orientation?: "vertical" | "horizontal";
}

export const ICON_MAP: Record<string, React.ReactNode> = {
  "Sin ícono": null,
  "Corazón": <Heart className="w-4 h-4 fill-current inline-block" />,
  "Estrella": <Star className="w-4 h-4 fill-current inline-block" />,
  "Flor": <Flower2 className="w-4 h-4 inline-block" />,
  "Cruz": (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current inline-block" aria-hidden="true">
      <path d="M10 2h4v6h6v4h-6v10h-4V12H4V8h6V2z" />
    </svg>
  ),
  "Rayo": <Zap className="w-4 h-4 fill-current inline-block" />,
  "Huella": (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current inline-block" aria-hidden="true">
      <circle cx="12" cy="7" r="2.5" />
      <circle cx="6.5" cy="10" r="2" />
      <circle cx="17.5" cy="10" r="2" />
      <path d="M12 11c-2.8 0-5 2-5 4.5 0 2 1.6 3.5 3.5 3.5 1 0 1.5-.5 1.5-.5s.5.5 1.5.5c1.9 0 3.5-1.5 3.5-3.5 0-2.5-2.2-4.5-5-4.5z" />
    </svg>
  ),
  "Infinito": <InfinityIcon className="w-4 h-4 inline-block" />,
};

export function EngravingPreview({
  product,
  color,
  text,
  font,
  icon,
  orientation = "vertical",
}: EngravingPreviewProps) {
  const isDark = ["negro", "azul", "plomo", "morado", "cuarzo"].some((c) =>
    color.toLowerCase().includes(c)
  );

  const fontClass =
    font === "Manuscrita"
      ? "font-engraving-script text-xl"
      : font === "Clásica"
      ? "font-engraving-serif tracking-[0.25em] uppercase text-xs font-serif"
      : font === "Fuerte"
      ? "font-engraving-bold tracking-wider uppercase text-sm font-black"
      : "font-engraving-minimal tracking-[0.3em] uppercase text-xs font-semibold";

  const etchColor = isDark
    ? "text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] [text-shadow:0_0_2px_rgba(255,255,255,0.7)]"
    : "text-zinc-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] [text-shadow:0_0_1px_rgba(0,0,0,0.3)]";

  const hasText = Boolean(text.trim());
  const selectedIcon = ICON_MAP[icon] || null;

  return (
    <div className="relative w-full h-full min-h-[420px] md:min-h-[520px] flex items-center justify-center overflow-hidden bg-[#f3efe8] rounded-2xl select-none group border border-[#e5dfd5]">
      {/* Product Image Base */}
      <div className="w-full h-full absolute inset-0 flex items-center justify-center p-3 transition-transform duration-500 group-hover:scale-[1.02]">
        <VariantProductImage product={product} color={color} />
      </div>

      {/* Subtle Studio Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/10 pointer-events-none" />

      {/* Engraving Simulation Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {hasText ? (
          <div
            className={`transition-all duration-300 transform ${
              orientation === "vertical"
                ? "-rotate-90 origin-center tracking-widest flex items-center justify-center gap-3 px-4 py-1.5 rounded-sm backdrop-blur-[1px] bg-black/5"
                : "flex items-center justify-center gap-2 px-3 py-1 rounded-sm backdrop-blur-[1px] bg-black/5"
            } ${fontClass} ${etchColor}`}
            style={{
              maxWidth: "280px",
              opacity: 0.95,
            }}
          >
            {selectedIcon && <span className="opacity-90">{selectedIcon}</span>}
            <span className="truncate max-w-[200px]">{text}</span>
          </div>
        ) : (
          product.customizable && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-medium text-emerald-950 shadow-sm border border-emerald-900/10 animate-pulse whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Escribe tu nombre para simular el grabado</span>
            </div>
          )
        )}
      </div>

      {/* Laser Etch Verification Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-zinc-700 shadow-sm border border-zinc-200/70">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>Simulador Láser LIM</span>
      </div>

      {/* Active Color & Capacity Indicator */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-medium text-zinc-700 shadow-sm border border-zinc-200/70">
        <span className="font-semibold text-zinc-900">{color}</span>
        <span className="text-zinc-400">·</span>
        <span>{product.capacity}</span>
      </div>
    </div>
  );
}
