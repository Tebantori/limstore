"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Check,
  ChevronDown,
  Flame,
  Heart,
  HelpCircle,
  Menu,
  MessageCircle,
  Minus,
  Music2,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import type { Product } from "../lib/catalog";
import { engravingFonts, engravingIcons } from "../lib/catalog";
import {
  ProductDialogV2,
  VariantProductImage as VariantVisual,
  colorClass,
} from "./product-dialog-v2";
import { EngravingPreview } from "./engraving-preview";

export type CartItem = {
  key: string;
  sku: string;
  name: string;
  price: number;
  engravingFee?: number;
  image: string;
  quantity: number;
  color: string;
  engraving: string;
  font: string;
  icon: string;
};

type Settings = Record<string, string>;

const money = (value: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    value
  );

export function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({
    shipping_lima: "10",
    shipping_province: "10",
    engraving_price: "5",
  });
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  const [capacityFilter, setCapacityFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState("featured");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState("");

  // Quick card color preview states
  const [cardColorOverrides, setCardColorOverrides] = useState<
    Record<string, string>
  >({});

  // Interactive Engraving Studio (Homepage Playground)
  const [studioText, setStudioText] = useState("Andrea");
  const [studioFont, setStudioFont] = useState("Clásica");
  const [studioIcon, setStudioIcon] = useState("Corazón");
  const [studioProductSku, setStudioProductSku] = useState("LIM-FAITH-900");
  const [studioColor, setStudioColor] = useState("Rosa");
  const [studioOrientation, setStudioOrientation] = useState<
    "vertical" | "horizontal"
  >("vertical");

  useEffect(() => {
    const saved = localStorage.getItem("lim-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (d.products) setProducts(d.products);
        if (d.settings) setSettings(d.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("lim-cart", JSON.stringify(cart));
  }, [cart]);

  // Selected studio product reference
  const studioProduct = useMemo(() => {
    return (
      products.find((p) => p.sku === studioProductSku) ||
      products[0] ||
      null
    );
  }, [products, studioProductSku]);

  // Filtered and sorted products
  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          category === "Todos" || p.category === category;
        const matchesSearch = `${p.name} ${p.capacity} ${p.description}`
          .toLowerCase()
          .includes(search.toLowerCase());

        let matchesCapacity = true;
        const numCapacity = parseInt(p.capacity) || 0;
        if (capacityFilter === "< 500 ml") {
          matchesCapacity = numCapacity < 500 && numCapacity > 0;
        } else if (capacityFilter === "500 - 900 ml") {
          matchesCapacity = numCapacity >= 500 && numCapacity <= 900;
        } else if (capacityFilter === "1000+ ml") {
          matchesCapacity = numCapacity >= 1000;
        }

        return matchesCategory && matchesSearch && matchesCapacity;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        // default "featured": featured items first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, category, capacityFilter, search, sortBy]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce(
    (s, i) => s + (i.price + (i.engravingFee || 0)) * i.quantity,
    0
  );

  const add = (item: CartItem) => {
    setCart((old) => {
      const hit = old.find((i) => i.key === item.key);
      return hit
        ? old.map((i) =>
            i.key === item.key
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...old, item];
    });
    setSelected(null);
    setCartOpen(true);
    setNotice(`${item.name} (${item.color}) se agregó a tu bolsa`);
    setTimeout(() => setNotice(""), 3000);
  };

  const updateQty = (key: string, delta: number) => {
    setCart((old) =>
      old
        .map((i) =>
          i.key === key ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1c1f1d] font-sans selection:bg-[#28543d] selection:text-white">
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="bg-[#173b2a] text-[#f4efe6] text-center py-2.5 px-4 text-[11px] sm:text-xs tracking-wider uppercase font-semibold flex items-center justify-center flex-wrap gap-x-6 gap-y-1 border-b border-emerald-900/40">
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#e9aeb9]" />
          Envíos a todo el Perú (Olva Courier & Shalom)
        </span>
        <span className="hidden md:inline text-emerald-600">·</span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#e9aeb9]" />
          Grabado láser de alta precisión permanente
        </span>
        <span className="hidden lg:inline text-emerald-600">·</span>
        <span className="hidden sm:inline">Recojo gratuito en Ate, Lima</span>
      </div>

      {/* 2. STICKY LUXURY HEADER */}
      <header className="sticky top-0 z-40 h-20 bg-[#fffdf9]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 lg:px-12 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <img
            src="/images/brand/lim-wordmark.png"
            alt="LIM Shop Perú"
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.14em] text-stone-700">
          <a
            href="#catalogo"
            className="hover:text-[#28543d] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#28543d] after:transition-all"
          >
            Catálogo 2026
          </a>
          <a
            href="#estudio-grabado"
            className="hover:text-[#28543d] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#28543d] after:transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulador Láser</span>
          </a>
          <a
            href="#ingenieria"
            className="hover:text-[#28543d] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#28543d] after:transition-all"
          >
            Tecnología Térmica
          </a>
          <a
            href="#testimonios"
            className="hover:text-[#28543d] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#28543d] after:transition-all"
          >
            Comunidad LIM
          </a>
          <a
            href="#faq"
            className="hover:text-[#28543d] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#28543d] after:transition-all"
          >
            Preguntas
          </a>
        </nav>

        {/* Header Actions: Socials, Cart & Mobile Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            aria-label="Instagram LIM"
            href="https://www.instagram.com/limshop.pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-stone-600 hover:text-[#28543d] hover:bg-stone-100 transition-colors"
          >
            <Camera size={18} />
          </a>
          <a
            aria-label="TikTok LIM"
            href="https://www.tiktok.com/@limshop.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-stone-600 hover:text-[#28543d] hover:bg-stone-100 transition-colors"
          >
            <Music2 size={18} />
          </a>

          {/* Cart Bag Trigger */}
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger
              render={
                <button
                  className="flex items-center gap-2 bg-[#28543d] hover:bg-[#1a3a2a] text-white px-3.5 py-2 rounded-full text-xs font-semibold shadow-xs transition-transform active:scale-95"
                  aria-label={`Bolsa con ${cartCount} productos`}
                >
                  <ShoppingBag size={16} />
                  <span className="hidden sm:inline">Bolsa</span>
                  <span className="w-5 h-5 rounded-full bg-white text-[#28543d] font-bold text-[11px] flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              }
            />
            <CartPanel
              cart={cart}
              subtotal={subtotal}
              onQty={updateQty}
              onCheckout={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
            />
          </Sheet>

          {/* Mobile Menu Drawer Trigger */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              render={
                <button
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors"
                  aria-label="Menú de navegación"
                >
                  <Menu size={20} />
                </button>
              }
            />
            <SheetContent
              side="left"
              className="w-[85vw] max-w-[340px] bg-[#fffdf9] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                  <img
                    src="/images/brand/lim-wordmark.png"
                    alt="LIM"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-col gap-4 mt-6 text-sm font-semibold text-stone-800">
                  <a
                    href="#inicio"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100"
                  >
                    Inicio
                  </a>
                  <a
                    href="#catalogo"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100"
                  >
                    Catálogo de Termos 2026
                  </a>
                  <a
                    href="#estudio-grabado"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100 flex items-center gap-2 text-[#28543d]"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Simulador de Grabado Láser</span>
                  </a>
                  <a
                    href="#ingenieria"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100"
                  >
                    Tecnología Térmica
                  </a>
                  <a
                    href="#testimonios"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100"
                  >
                    Opiniones y Comunidad
                  </a>
                  <a
                    href="#corporativo"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100"
                  >
                    Pedidos Corporativos
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-stone-100"
                  >
                    Preguntas Frecuentes
                  </a>
                  <a
                    href="/admin"
                    onClick={() => setMobileNavOpen(false)}
                    className="py-2 px-3 rounded-lg text-stone-500 hover:text-stone-900 border-t border-stone-200 mt-2 pt-4 text-xs font-normal"
                  >
                    Administración de Tienda
                  </a>
                </nav>
              </div>

              <div className="pt-6 border-t border-stone-200 space-y-3">
                <a
                  href="https://wa.me/51969961922?text=Hola%20LIM,%20tengo%20una%20consulta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: 969 961 922</span>
                </a>
                <div className="flex justify-center gap-4 text-stone-500 pt-2">
                  <a
                    href="https://www.instagram.com/limshop.pe/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Camera size={18} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@limshop.pe"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Music2 size={18} />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>
        {/* 3. HERO SECTION */}
        <section
          id="inicio"
          className="relative overflow-hidden bg-gradient-to-b from-[#fffdf9] to-[#faf7f2] border-b border-stone-200/80"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 bg-[#28543d]/10 text-[#173b2a] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Colección Oficial 2026 · Perú</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-stone-900 tracking-tight leading-[1.05]">
                Hay mucho <br />
                <span className="italic text-[#28543d] font-normal">
                  por vivir.
                </span>
              </h1>

              {/* Description */}
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                Diseñamos compañeros para todos tus días: fabricados en acero
                quirúrgico de doble pared al vacío, térmicos por 24 horas y
                personalizados con grabado láser permanente que cuenta tu
                historia.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a
                  href="#estudio-grabado"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#28543d] hover:bg-[#1a3a2a] text-white px-7 py-4 rounded-xl text-sm font-bold shadow-lg shadow-[#28543d]/20 transition-all hover:translate-y-[-1px] text-center"
                >
                  <Sparkles className="w-4 h-4 text-[#e9aeb9]" />
                  <span>Personalizar mi LIM</span>
                  <span>→</span>
                </a>
                <a
                  href="#catalogo"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-6 py-4 rounded-xl text-sm font-bold transition-all text-center"
                >
                  <span>Explorar Catálogo</span>
                </a>
              </div>

              {/* Social Proof & Trust Badges */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <strong className="block text-xs text-stone-900 font-bold">
                    4.9 / 5 estrellas
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    +2,500 clientes
                  </span>
                </div>
                <div>
                  <strong className="block text-xs text-stone-900 font-bold">
                    Acero 304 / 316
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    Apto para alimentos
                  </span>
                </div>
                <div>
                  <strong className="block text-xs text-stone-900 font-bold">
                    24h Frío / 12h Calor
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    Aislamiento al vacío
                  </span>
                </div>
              </div>
            </div>

            {/* Right Visual Frame */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 sm:aspect-square max-h-[580px] w-full group">
                <img
                  src="/images/brand/lim-hero.jpg"
                  alt="Termo LIM personalizado en mesa de trabajo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Aesthetic Floating Badge */}
                <div className="absolute top-6 right-6 bg-[#e9aeb9] text-[#173b2a] w-24 h-24 rounded-full flex flex-col items-center justify-center text-center shadow-lg -rotate-12 border-2 border-white/60">
                  <span className="text-[10px] font-bold tracking-wider uppercase leading-none">
                    Grabado
                  </span>
                  <strong className="text-sm font-black tracking-tight leading-tight">
                    LÁSER
                  </strong>
                  <span className="text-[9px] font-semibold opacity-80">
                    Permanente
                  </span>
                </div>

                {/* Floating Preview Pill */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#28543d]/10 flex items-center justify-center text-[#28543d]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-xs font-bold text-stone-900">
                        Tu nombre nunca se borrará
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        Grabado láser permanente en fibra óptica
                      </span>
                    </div>
                  </div>
                  <a
                    href="#estudio-grabado"
                    className="text-xs font-bold text-[#28543d] hover:underline"
                  >
                    Probar →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. VALUE PILLARS BAR */}
        <section className="bg-[#173b2a] text-white py-8 px-4 sm:px-8 border-y border-emerald-950">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#e9aeb9] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-white tracking-wide">
                  Envíos a Todo el Perú
                </strong>
                <span className="text-[11px] text-stone-300">
                  Olva Courier, Shalom y Motorizado
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#e9aeb9] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-white tracking-wide">
                  Grabado Permanente
                </strong>
                <span className="text-[11px] text-stone-300">
                  Elige tipografía e ícono a tu gusto
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#e9aeb9] shrink-0">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-white tracking-wide">
                  24 Horas Frío · 12h Calor
                </strong>
                <span className="text-[11px] text-stone-300">
                  Doble pared de acero al vacío
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#e9aeb9] shrink-0">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-xs font-bold text-white tracking-wide">
                  Yape, Plin o Tarjeta
                </strong>
                <span className="text-[11px] text-stone-300">
                  Pagos 100% seguros y coordinados
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE ENGRAVING STUDIO (SHOWCASE ON HOMEPAGE) */}
        <section
          id="estudio-grabado"
          className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#faf7f2] via-[#f3ede3] to-[#faf7f2] border-b border-stone-200"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#28543d] bg-[#28543d]/10 px-3.5 py-1 rounded-full mb-3 inline-block">
                Experiencia Interactiva
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-stone-900 tracking-tight">
                Simulador de Grabado Láser
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-3">
                Escribe tu nombre o frase especial y mira cómo cobra vida en tu
                termo LIM antes de pedirlo.
              </p>
            </div>

            {/* Interactive Studio Box */}
            <div className="bg-[#fffdfa] rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Visualizer Stage */}
              <div className="lg:col-span-7 p-6 sm:p-10 bg-[#f7f3ec] flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-stone-200">
                {studioProduct && (
                  <div className="w-full max-w-md h-[460px] sm:h-[520px]">
                    <EngravingPreview
                      product={studioProduct}
                      color={studioColor}
                      text={studioText}
                      font={studioFont}
                      icon={studioIcon}
                      orientation={studioOrientation}
                    />
                  </div>
                )}
                <div className="w-full flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-300/60 mt-4">
                  <span>💡 Grabado de alta precisión por láser óptico</span>
                  <span className="font-semibold text-[#28543d]">
                    No se borra con los lavados
                  </span>
                </div>
              </div>

              {/* Controls Palette */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-stone-900 mb-1">
                    Diseña tu compañero
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ajusta los detalles para ver el resultado en vivo.
                  </p>

                  {/* 1. Model Selector */}
                  <div className="mt-5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                      1. Elige el modelo
                    </Label>
                    <Select
                      value={studioProductSku}
                      onValueChange={(sku) => {
                        setStudioProductSku(sku);
                        const prod = products.find((p) => p.sku === sku);
                        if (prod && prod.colors[0]) {
                          setStudioColor(prod.colors[0].name);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white border-stone-300 h-10 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white max-h-64">
                        {products
                          .filter((p) => p.customizable)
                          .map((p) => (
                            <SelectItem
                              key={p.sku}
                              value={p.sku}
                              className="text-xs"
                            >
                              {p.name} ({p.capacity}) — {money(p.price)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 2. Color Swatches */}
                  {studioProduct && (
                    <div className="mt-4">
                      <Label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                        2. Color:{" "}
                        <span className="text-stone-900 font-semibold">
                          {studioColor}
                        </span>
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {studioProduct.colors.map((c) => (
                          <button
                            type="button"
                            key={c.name}
                            onClick={() => setStudioColor(c.name)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all ${
                              studioColor === c.name
                                ? "border-[#28543d] bg-[#28543d]/10 text-[#173b2a] font-semibold ring-1 ring-[#28543d]"
                                : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
                            }`}
                          >
                            <span
                              className={`${colorClass(
                                c.name
                              )} w-3 h-3 rounded-full inline-block border border-black/10`}
                            />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Text to Engrave */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <Label
                        htmlFor="studio-input"
                        className="text-xs font-bold uppercase tracking-wider text-stone-700"
                      >
                        3. Texto a grabar
                      </Label>
                      <span className="text-[11px] text-stone-500">
                        {studioText.length}/30
                      </span>
                    </div>
                    <Input
                      id="studio-input"
                      maxLength={30}
                      value={studioText}
                      onChange={(e) => setStudioText(e.target.value)}
                      placeholder="Ej. Andrea, Dr. Carlos, 14.02.26…"
                      className="bg-white border-stone-300 h-10 text-sm focus-visible:ring-[#28543d]"
                    />
                  </div>

                  {/* 4. Font & Icon */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                        Tipografía
                      </Label>
                      <Select
                        value={studioFont}
                        onValueChange={(f) => setStudioFont(f || "Clásica")}
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
                      <Label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                        Ícono
                      </Label>
                      <Select
                        value={studioIcon}
                        onValueChange={(ic) => setStudioIcon(ic || "Sin ícono")}
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

                  {/* 5. Orientation */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-200 text-xs">
                    <span className="font-semibold text-stone-700">
                      Orientación:
                    </span>
                    <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setStudioOrientation("vertical")}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          studioOrientation === "vertical"
                            ? "bg-[#28543d] text-white shadow-xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Vertical (lateral)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudioOrientation("horizontal")}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          studioOrientation === "horizontal"
                            ? "bg-[#28543d] text-white shadow-xs"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        Horizontal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-4 border-t border-stone-200">
                  <Button
                    className="w-full h-12 bg-[#28543d] hover:bg-[#1a3a2a] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    onClick={() => {
                      if (studioProduct) {
                        setSelected(studioProduct);
                      }
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-[#e9aeb9]" />
                    <span>Quiero este modelo personalizado</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PRODUCT CATALOG WITH RICH FILTERS */}
        <section
          id="catalogo"
          className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto"
        >
          {/* Catalog Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#28543d] bg-[#28543d]/10 px-3 py-1 rounded-full mb-2 inline-block">
                Colección 2026
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-stone-900 tracking-tight">
                Elige tu compañero
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
                Del primer sorbo de café matutino a la última repetición en el
                gimnasio. Hay un LIM hecho a tu medida.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar modelo o capacidad…"
                className="pl-9 pr-8 bg-white border-stone-300 h-11 text-xs rounded-xl focus-visible:ring-[#28543d]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Catalog Controls: Categories, Capacities & Sorting */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {["Todos", "Cups", "Termos", "Accesorios"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    category === c
                      ? "bg-[#28543d] text-white shadow-xs"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Subfilters: Capacity & Sort By */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              {/* Capacity Filter */}
              <div className="flex items-center gap-1 text-xs text-stone-500 shrink-0">
                <span className="hidden sm:inline">Capacidad:</span>
                <Select
                  value={capacityFilter}
                  onValueChange={setCapacityFilter}
                >
                  <SelectTrigger className="bg-white border-stone-200 h-9 text-xs rounded-lg min-w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Todas">Todas las medidas</SelectItem>
                    <SelectItem value="< 500 ml">&lt; 500 ml</SelectItem>
                    <SelectItem value="500 - 900 ml">500 - 900 ml</SelectItem>
                    <SelectItem value="1000+ ml">1000+ ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-1 text-xs text-stone-500 shrink-0">
                <span className="hidden sm:inline">Ordenar:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white border-stone-200 h-9 text-xs rounded-lg min-w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="featured">Más Destacados</SelectItem>
                    <SelectItem value="price-asc">Menor precio</SelectItem>
                    <SelectItem value="price-desc">Mayor precio</SelectItem>
                    <SelectItem value="name-asc">Nombre A - Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-4/5 bg-stone-200/70 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
              <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-stone-800">
                No encontramos modelos con ese filtro
              </h3>
              <p className="text-stone-500 text-xs mt-1">
                Intenta buscar otra capacidad o cambia la categoría seleccionada.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-xl text-xs"
                onClick={() => {
                  setCategory("Todos");
                  setCapacityFilter("Todas");
                  setSearch("");
                }}
              >
                Restablecer filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {filtered.map((p) => {
                const activeColor =
                  cardColorOverrides[p.sku] ||
                  p.colors.find((c) => c.stock > 0)?.name ||
                  p.colors[0]?.name ||
                  "";

                return (
                  <article
                    key={p.sku}
                    className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Top Image Stage */}
                    <div className="relative aspect-4/5 bg-[#f5f1ea] overflow-hidden flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="w-full h-full p-4 block cursor-pointer"
                        aria-label={`Ver detalles de ${p.name}`}
                      >
                        <VariantVisual product={p} color={activeColor} />
                      </button>

                      {/* Featured / Popular Badge */}
                      {p.featured && (
                        <span className="absolute top-3 left-3 bg-[#173b2a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-xs">
                          Favorito LIM
                        </span>
                      )}

                      {/* Laser Engraving Tag */}
                      {p.customizable && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#28543d] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 border border-stone-200/60">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Grabable</span>
                        </span>
                      )}

                      {/* Quick Personalize Hover Action */}
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="absolute bottom-3 left-3 right-3 bg-[#28543d] hover:bg-[#1a3a2a] text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#e9aeb9]" />
                        <span>Personalizar / Elegir color</span>
                      </button>
                    </div>

                    {/* Bottom Card Info */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                          <span className="uppercase font-semibold tracking-wider text-[#28543d]">
                            {p.category}
                          </span>
                          <span>{p.capacity}</span>
                        </div>

                        <h3
                          onClick={() => setSelected(p)}
                          className="font-serif text-lg text-stone-900 font-normal hover:text-[#28543d] transition-colors cursor-pointer leading-snug line-clamp-1"
                        >
                          {p.name.replace(` ${p.capacity}`, "")}
                        </h3>

                        <div className="flex items-baseline justify-between mt-2">
                          <strong className="text-base font-bold text-stone-900">
                            {money(p.price)}
                          </strong>
                          <span className="text-[10px] text-stone-500">
                            {p.customizable
                              ? "Grabado láser permanente"
                              : "Diseño ergonómico"}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Swatch Dots */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {p.colors.slice(0, 5).map((c) => (
                            <button
                              type="button"
                              key={c.name}
                              title={`${c.name}${c.stock ? "" : " (Agotado)"}`}
                              onClick={() =>
                                setCardColorOverrides((prev) => ({
                                  ...prev,
                                  [p.sku]: c.name,
                                }))
                              }
                              className={`w-4 h-4 rounded-full border transition-all ${
                                activeColor === c.name
                                  ? "ring-2 ring-[#28543d] scale-110"
                                  : "hover:scale-105"
                              } ${colorClass(c.name)} ${
                                c.stock ? "" : "opacity-40 line-through"
                              }`}
                            />
                          ))}
                          {p.colors.length > 5 && (
                            <span className="text-[10px] text-stone-500 font-medium">
                              +{p.colors.length - 5}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelected(p)}
                          className="text-[11px] font-bold text-[#28543d] hover:underline"
                        >
                          Ver detalles →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 7. THERMAL & MATERIAL ENGINEERING SECTION */}
        <section
          id="ingenieria"
          className="py-16 sm:py-24 bg-[#173b2a] text-white px-4 sm:px-8 lg:px-12 border-y border-emerald-950"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e9aeb9] bg-white/10 px-3.5 py-1 rounded-full mb-3 inline-block">
                Ingeniería y Durabilidad
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
                La ciencia de mantener tu temperatura ideal
              </h2>
              <p className="text-stone-300 text-sm sm:text-base mt-3">
                Cada termo LIM está construido bajo estrictos estándares de
                acero inoxidable de grado alimentario para asegurar cero olores,
                máxima durabilidad y una retención térmica insuperable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                  <Snowflake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white mb-2">
                    Doble Pared al Vacío
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    La cámara intermedia entre las dos capas de acero elimina el
                    aire, impidiendo la transferencia térmica por conducción.
                    Tus bebidas frías con hielo se mantienen hasta por 24 horas.
                  </p>
                </div>
                <span className="mt-6 text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                  Sin condensación exterior
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white mb-2">
                    Acero Quirúrgico 304 & 316
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Acero inoxidable de grado alimentario de alta pureza. No se
                    oxida, no altera el sabor de tus infusiones ni absorbe
                    olores. 100% libre de BPA y toxinas.
                  </p>
                </div>
                <span className="mt-6 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Grado alimentario certificado
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#e9aeb9] flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white mb-2">
                    Grabado Láser Permanente
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    A diferencia del vinil o la serigrafía que se despegan,
                    nuestro láser de fibra óptica vaporiza la capa externa de
                    color para exponer el acero inoxidable real para siempre.
                  </p>
                </div>
                <span className="mt-6 text-[11px] font-bold text-[#e9aeb9] uppercase tracking-wider">
                  Inalterable al lavado y roce
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CUSTOMER REVIEWS & SOCIAL PROOF */}
        <section
          id="testimonios"
          className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto"
        >
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#28543d] bg-[#28543d]/10 px-3.5 py-1 rounded-full mb-3 inline-block">
              #ComunidadLIM
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-stone-900 tracking-tight">
              Lo que dicen quienes ya viven con LIM
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2">
              Más de 2,500 pedidos personalizados entregados con cariño en Lima
              y provincias del Perú.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  “Compré el Termo Faith 900 con mi nombre y un ícono de
                  corazón. El grabado quedó con un detalle impresionante y el
                  agua fría dura con hielo hasta el final del día en mi
                  oficina. ¡100% recomendado!”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <strong className="block text-xs font-bold text-stone-900">
                    Mariana Sifuentes
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    Miraflores, Lima
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Compra Verificada
                </span>
              </div>
            </article>

            <article className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  “Pedí dos Cup Moon personalizados para el cumpleaños de mi
                  pareja. Los enviaron a Arequipa por Olva Courier y llegaron en
                  menos de 48 horas súper bien protegidos. La atención por
                  WhatsApp es de primera.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <strong className="block text-xs font-bold text-stone-900">
                    Rodrigo Tejada
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    Yanahuara, Arequipa
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Compra Verificada
                </span>
              </div>
            </article>

            <article className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  “Mandamos a hacer 30 termos con el logo de nuestro estudio de
                  abogados para regalos de fin de año. La nitidez del grabado del
                  logo y la calidad de los acabados superó todas nuestras
                  expectativas.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <strong className="block text-xs font-bold text-stone-900">
                    Camila Valdivia
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    Trujillo, La Libertad
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Pedido Corporativo
                </span>
              </div>
            </article>
          </div>
        </section>

        {/* 9. CORPORATE & B2B ORDERS */}
        <section
          id="corporativo"
          className="py-14 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-[#28543d] to-[#173b2a] text-white"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e9aeb9] bg-white/10 px-3.5 py-1 rounded-full mb-3 inline-block">
                Ventas Corporativas & Eventos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
                Tu marca o evento también puede vivir en un LIM
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Cotiza pedidos al por mayor con el logotipo de tu empresa o
                nombres individuales para tu equipo. Precios especiales por
                volumen desde 12 unidades, muestras previas y factura con RUC.
              </p>
            </div>

            <a
              href="https://wa.me/51969961922?text=Hola%20LIM,%20quisiera%20cotizar%20un%20pedido%20corporativo%20personalizado"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-stone-100 text-[#173b2a] px-8 py-4 rounded-xl text-xs sm:text-sm font-bold shadow-xl transition-transform hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Cotizar Pedido Corporativo</span>
            </a>
          </div>
        </section>

        {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section
          id="faq"
          className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#28543d] bg-[#28543d]/10 px-3.5 py-1 rounded-full mb-3 inline-block">
              Resolvemos tus dudas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Preguntas Frecuentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem
              value="faq-1"
              className="bg-white rounded-2xl border border-stone-200 px-6 py-1"
            >
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#28543d] text-left">
                ¿Cuánto tiempo demora la personalización y la entrega?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                El grabado láser se realiza en un plazo de 24 horas hábiles tras
                confirmar tu pedido. En Lima Metropolitana la entrega se realiza
                en 24 a 48 horas con motorizado. Para provincias, el envío se
                hace mediante Olva Courier o encomienda Shalom (2 a 4 días
                hábiles con código de seguimiento).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="faq-2"
              className="bg-white rounded-2xl border border-stone-200 px-6 py-1"
            >
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#28543d] text-left">
                ¿El grabado se borra o se despinta con el uso?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                No, de ninguna manera. El grabado se realiza mediante un haz
                láser que vaporiza la capa de recubrimiento del termo para
                revelar el acero quirúrgico subyacente. No es un vinil adhesivo
                ni pintura, por lo que nunca se pelará ni despintará.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="faq-3"
              className="bg-white rounded-2xl border border-stone-200 px-6 py-1"
            >
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#28543d] text-left">
                ¿Cuáles son los métodos de pago aceptados?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Aceptamos pagos directos mediante <strong>Yape</strong>,{" "}
                <strong>Plin</strong>, transferencias bancarias (BCP, BBVA,
                Interbank) y todas las tarjetas de crédito o débito a través de
                Mercado Pago.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="faq-4"
              className="bg-white rounded-2xl border border-stone-200 px-6 py-1"
            >
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#28543d] text-left">
                ¿Dónde queda el punto de recojo gratuito en Lima?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Contamos con punto de recojo sin costo adicional en el distrito
                de Ate, Lima. Al registrar tu pedido con la opción "Recojo en
                Ate", te enviaremos la ubicación exacta y coordinaremos el
                horario por WhatsApp.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="faq-5"
              className="bg-white rounded-2xl border border-stone-200 px-6 py-1"
            >
              <AccordionTrigger className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#28543d] text-left">
                ¿Cómo debo cuidar y lavar mi termo LIM?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Recomendamos lavar el interior con agua tibia, jabón suave y una
                esponja no abrasiva. La tapa hermética se puede desmontar para
                una higiene profunda. No se recomienda introducir en microondas
                ni congelador, ya que el aislamiento al vacío hace innecesario el
                frío externo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      {/* 11. BOUTIQUE FOOTER */}
      <footer className="bg-[#173b2a] text-white pt-16 pb-8 px-4 sm:px-8 lg:px-12 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          <div className="space-y-4">
            <img
              src="/images/brand/lim-wordmark.png"
              alt="LIM Shop Perú"
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="text-xs text-stone-300 leading-relaxed">
              Termos y cups de acero quirúrgico que acompañan cada momento de tu
              rutina. Diseñados con intención y grabados con tu esencia.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e9aeb9] mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-medium">
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Catálogo de Termos
                </a>
              </li>
              <li>
                <a
                  href="#estudio-grabado"
                  className="hover:text-white transition-colors"
                >
                  Simulador de Grabado Láser
                </a>
              </li>
              <li>
                <a
                  href="#ingenieria"
                  className="hover:text-white transition-colors"
                >
                  Tecnología Térmica
                </a>
              </li>
              <li>
                <a
                  href="#corporativo"
                  className="hover:text-white transition-colors"
                >
                  Pedidos Corporativos
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition-colors">
                  Administrar Tienda
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e9aeb9] mb-4">
              Contacto y Envíos
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300 font-medium">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#e9aeb9]" />
                <a
                  href="https://wa.me/51969961922"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp: 969 961 922
                </a>
              </li>
              <li>Envíos Lima: 24 - 48 horas</li>
              <li>Provincias: Olva Courier & Shalom</li>
              <li>Recojo sin costo: Ate, Lima</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e9aeb9] mb-4">
              Síguenos en Redes
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://www.instagram.com/limshop.pe/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Camera size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@limshop.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Music2 size={16} />
              </a>
            </div>
            <p className="text-[11px] text-stone-400">
              Etiquétanos en tus fotos con el hashtag{" "}
              <strong className="text-white">#MomentoLIM</strong>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 LIM Shop Perú · Lima, Perú. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Doble pared al vacío</span>
            <span>·</span>
            <span>Acero Quirúrgico 304/316</span>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/51969961922?text=Hola%20LIM,%20tengo%20una%20consulta%20sobre%20los%20termos%20personalizados"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center gap-2 group"
      >
        <MessageCircle size={24} className="fill-current" />
        <span className="hidden sm:inline text-xs font-bold pr-1">
          ¿Dudas? Chatea con nosotros
        </span>
      </a>

      {/* Product Detail Modal */}
      <ProductDialogV2
        product={selected}
        engravingPrice={Number(settings.engraving_price) || 5}
        onClose={() => setSelected(null)}
        onAdd={add}
      />

      {/* Checkout Modal */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        subtotal={subtotal}
        settings={settings}
        onComplete={() => setCart([])}
      />

      {/* Notice Toast */}
      {notice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#173b2a] text-white px-5 py-3 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 border border-emerald-800 animate-in fade-in slide-in-from-bottom-3">
          <Check size={16} className="text-[#e9aeb9]" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// CART PANEL DRAWER COMPONENT
// ----------------------------------------------------
function CartPanel({
  cart,
  subtotal,
  onQty,
  onCheckout,
}: {
  cart: CartItem[];
  subtotal: number;
  onQty: (key: string, delta: number) => void;
  onCheckout: () => void;
}) {
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const whatsappCartMessage = encodeURIComponent(
    `¡Hola LIM! Quisiera realizar la compra de mi carrito:\n\n` +
      cart
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.name}* (${item.color})\n` +
            `   - Cantidad: ${item.quantity}\n` +
            (item.engraving
              ? `   - Grabado: "${item.engraving}" (${item.font}, ${item.icon})\n`
              : `   - Sin grabado\n`) +
            `   - Subtotal: ${money(item.price * item.quantity)}`
        )
        .join("\n\n") +
      `\n\n*Total estimado:* ${money(subtotal)}\n\n` +
      `¿Podemos coordinar los datos de envío y pago por aquí?`
  );

  return (
    <SheetContent className="cart-sheet w-full sm:max-w-md bg-[#fffdf9] p-0 flex flex-col justify-between">
      <SheetHeader className="p-6 border-b border-stone-200">
        <SheetTitle className="font-serif text-2xl text-stone-900 flex items-center justify-between">
          <span>Tu Bolsa de Compras</span>
          <span className="text-xs font-sans font-bold bg-[#28543d] text-white px-2.5 py-1 rounded-full">
            {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
          </span>
        </SheetTitle>
      </SheetHeader>

      {!cart.length ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
            <ShoppingBag size={28} />
          </div>
          <h3 className="font-serif text-xl text-stone-800">
            Tu bolsa está vacía
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            Encuentra tu termo o cup ideal y personalízalo con tu nombre para
            acompañarte todos los días.
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.map((item) => (
              <div
                key={item.key}
                className="flex items-start gap-4 pb-4 border-b border-stone-200/80 last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                    <p>
                      Color:{" "}
                      <span className="font-semibold text-stone-700">
                        {item.color}
                      </span>
                    </p>
                    {item.engraving ? (
                      <p className="text-[#28543d] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>“{item.engraving}”</span>
                        <span className="text-stone-400 font-normal">
                          ({item.font})
                        </span>
                      </p>
                    ) : (
                      <p className="text-stone-400">Sin grabado</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onQty(item.key, -1)}
                        className="px-2 py-1 hover:bg-stone-100 text-stone-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onQty(item.key, 1)}
                        className="px-2 py-1 hover:bg-stone-100 text-stone-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <strong className="text-sm font-bold text-stone-900">
                      {money(item.price * item.quantity)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#f7f4ed] border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600 font-medium">Subtotal</span>
              <strong className="text-lg font-bold text-stone-900">
                {money(subtotal)}
              </strong>
            </div>
            <p className="text-[11px] text-stone-500">
              * El costo de entrega (Lima o Provincia) se calcula en el siguiente
              paso.
            </p>

            <Button
              onClick={onCheckout}
              className="w-full h-12 bg-[#28543d] hover:bg-[#1a3a2a] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              Continuar compra en línea
            </Button>

            <a
              href={`https://wa.me/51969961922?text=${whatsappCartMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Pedir este carrito por WhatsApp directo</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Compra segura · Envíos garantizados</span>
            </div>
          </div>
        </>
      )}
    </SheetContent>
  );
}

// ----------------------------------------------------
// CHECKOUT DIALOG COMPONENT
// ----------------------------------------------------
function CheckoutDialog({
  open,
  onOpenChange,
  cart,
  subtotal,
  settings,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  subtotal: number;
  settings: Settings;
  onComplete: () => void;
}) {
  const [shipping, setShipping] = useState("lima");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    code: string;
    total: number;
    paymentUrl: string | null;
  } | null>(null);
  const [error, setError] = useState("");

  const fee =
    shipping === "pickup"
      ? 0
      : Number(
          shipping === "lima"
            ? settings.shipping_lima
            : settings.shipping_province
        ) || 10;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form);

    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...body,
          shippingMethod: shipping,
          items: cart,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error al crear pedido");
      setResult(d);
      onComplete();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos crear el pedido. Intenta nuevamente o contáctanos por WhatsApp."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(() => setResult(null), 300);
      }}
    >
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#fffdf9] border border-stone-200 shadow-2xl">
        <DialogHeader className="mb-4">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#28543d]">
            Finalizar Compra
          </span>
          <DialogTitle className="font-serif text-2xl sm:text-3xl text-stone-900">
            {result ? "¡Tu pedido está reservado!" : "Datos de Entrega"}
          </DialogTitle>
          <DialogDescription className="text-xs text-stone-500">
            {result
              ? "Guarda tu código para consultar el estado de tu compra."
              : "Completa tus datos para coordinar el despacho de tus termos LIM."}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                Código de Pedido
              </p>
              <strong className="block text-xl sm:text-2xl font-mono text-stone-900 mt-1 bg-stone-100 py-2 px-4 rounded-xl border border-stone-200">
                {result.code}
              </strong>
              <h3 className="font-serif text-2xl text-stone-900 mt-3">
                Total a pagar: {money(result.total)}
              </h3>
            </div>

            {result.paymentUrl ? (
              <Button
                render={
                  <a
                    href={result.paymentUrl}
                    className="w-full h-12 bg-[#28543d] text-white font-bold rounded-xl flex items-center justify-center"
                  />
                }
              >
                Pagar ahora con Mercado Pago
              </Button>
            ) : (
              <div className="bg-[#fcf8ec] p-5 rounded-2xl border border-amber-200 text-left space-y-3">
                <p className="text-xs text-stone-800 font-medium">
                  <strong>Instrucciones para completar tu compra:</strong>
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  1. Puedes pagar mediante <strong>Yape</strong> o{" "}
                  <strong>Plin</strong> al número <strong>969 961 922</strong> a
                  nombre de LIM Shop.
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  2. Envíanos la captura de tu comprobante junto a tu código de
                  pedido para iniciar el grabado láser inmediatamente.
                </p>
                <a
                  href={`https://wa.me/51969961922?text=Hola%20LIM,%20mi%20código%20de%20pedido%20es%20${result.code}.%20Adjunto%20mi%20constancia%20de%20pago`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar pago por WhatsApp →</span>
                </a>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl text-xs"
            >
              Seguir explorando la tienda
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Nombres y Apellidos *
                </Label>
                <Input
                  name="customerName"
                  required
                  minLength={3}
                  className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                  placeholder="Ej. Andrea Morales"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Celular WhatsApp *
                </Label>
                <Input
                  name="phone"
                  required
                  inputMode="tel"
                  className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                  placeholder="Ej. 969 961 922"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Correo Electrónico *
                </Label>
                <Input
                  name="email"
                  type="email"
                  required
                  className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  DNI o RUC
                </Label>
                <Input
                  name="document"
                  inputMode="numeric"
                  className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                  placeholder="Para tu comprobante"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-stone-700 block mb-1.5">
                ¿Cómo deseas recibir tu pedido? *
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["pickup", "Recojo en Ate", 0],
                  [
                    "lima",
                    "Envío en Lima",
                    Number(settings.shipping_lima) || 10,
                  ],
                  [
                    "province",
                    "A Provincia",
                    Number(settings.shipping_province) || 10,
                  ],
                ].map(([v, label, price]) => (
                  <button
                    type="button"
                    key={String(v)}
                    onClick={() => setShipping(String(v))}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      shipping === v
                        ? "border-[#28543d] bg-[#28543d]/10 text-[#173b2a] font-bold ring-1 ring-[#28543d]"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <span className="text-[11px]">{label}</span>
                    <strong className="text-xs text-stone-900 mt-0.5">
                      {Number(price) === 0 ? "Gratis" : money(Number(price))}
                    </strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Departamento *
                </Label>
                <Input
                  name="department"
                  required
                  defaultValue={shipping === "lima" ? "Lima" : ""}
                  className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Distrito o Ciudad *
                </Label>
                <Input
                  name="district"
                  required={shipping !== "pickup"}
                  className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            {shipping !== "pickup" && (
              <>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">
                    Dirección o Agencia de Destino *
                  </Label>
                  <Input
                    name="address"
                    required
                    placeholder={
                      shipping === "province"
                        ? "Dirección o Agencia Olva / Shalom"
                        : "Av., calle, número, dpto."
                    }
                    className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">
                    Referencia de entrega
                  </Label>
                  <Input
                    name="reference"
                    placeholder="Frente al parque, portón blanco…"
                    className="bg-white border-stone-300 h-10 text-xs rounded-xl"
                  />
                </div>
              </>
            )}

            <div>
              <Label className="text-xs font-semibold text-stone-700">
                Instrucciones u observaciones opcionales
              </Label>
              <Textarea
                name="notes"
                placeholder="Si necesitas una fecha especial o nota de dedicatoria de regalo…"
                className="bg-white border-stone-300 text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f4ed] border border-stone-200">
              <span className="text-sm font-semibold text-stone-700">
                Total a pagar (con envío):
              </span>
              <strong className="text-xl font-bold text-stone-900">
                {money(subtotal + fee)}
              </strong>
            </div>

            {error && (
              <p className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <Button
              disabled={sending || !cart.length}
              className="w-full h-12 bg-[#28543d] hover:bg-[#1a3a2a] text-white font-bold rounded-xl text-sm shadow-md"
            >
              {sending ? "Registrando pedido…" : "Confirmar Pedido"}
            </Button>

            <p className="text-[10px] text-center text-stone-500">
              Tus datos están protegidos y solo se utilizarán para la entrega de
              tu compra.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
