"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { engravingFonts, engravingIcons, type Product } from "../lib/catalog";
import type { CartItem } from "./storefront";

const money = (value:number) => new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN"}).format(value);

const visualOrders: Record<string,string[]> = {
  "LIM-MOON-350":["Rosa","Blanco","Azul marino","Crema","Negro"],
  "LIM-SPIRIT-400":["Beige","Rosa","Negro","Azul"],
  "LIM-SKY-500":["Rosa","Azul","Crema","Negro"],
  "LIM-FREE-500":["Lila","Blanco","Rosa","Negro"],
  "LIM-STAR-500":["Beige","Lila","Azul"],
  "LIM-FLY-600":["Blanco","Rosa pastel","Lila","Azul","Negro"],
  "LIM-LIGHT-500":["Negro","Azul","Rosa","Beige"],
  "LIM-FAITH-MINI-600":["Azul","Negro","Lila","Rosa pastel","Blanco"],
  "LIM-PEACE-MINI-620":["Rosa","Rosa pastel","Morado","Lila pastel","Negro"],
  "LIM-PEACE-720":["Beige","Rosa","Azul","Negro"],
  "LIM-PRIME-800":["Melón","Beige","Azul","Negro"],
  "LIM-FAITH-900":["Negro","Azul","Cuarzo","Rosa","Blanco","Beige"],
  "LIM-GRACE-1000":["Beige","Rosa","Negro","Blanco"],
  "LIM-SHINE-1000":["Rosa","Crema","Azul","Lila","Negro"],
  "LIM-MAF-1200":["Azul","Negro","Fucsia","Lila","Crema","Rosa"],
  "LIM-GLOW-600":["Azul","Rosa","Negro"],
};

export function VariantProductImage({product,color}:{product:Product;color:string}) {
  const variant=product.colors.find((item)=>item.name===color);
  if (variant?.image) return <img key={variant.image} className="variant-unit-image" src={variant.image} alt={`${product.name} color ${color}`}/>;
  const order=visualOrders[product.sku] || product.colors.map((item)=>item.name);
  const index=Math.max(0,order.indexOf(color));
  const size=Math.max(100,order.length*78);
  const position=order.length<=1?50:(index/(order.length-1))*100;
  return <div key={`${product.sku}-${color}`} className="variant-crop" role="img" aria-label={`${product.name} color ${color}`} style={{backgroundImage:`url(${product.image})`,backgroundSize:`${size}% auto`,backgroundPosition:`${position}% center`}}/>;
}

export function ProductDialogV2({product,engravingPrice,onClose,onAdd}:{product:Product|null;engravingPrice:number;onClose:()=>void;onAdd:(item:CartItem)=>void}) {
  const [color,setColor]=useState(""); const [engraving,setEngraving]=useState(""); const [font,setFont]=useState("Clásica"); const [icon,setIcon]=useState("Sin ícono");
  useEffect(()=>{ setColor(product?.colors.find((item)=>item.stock>0)?.name||""); setEngraving(""); },[product]);
  if(!product)return null;
  const variant=product.colors.find((item)=>item.name===color); const fee=engraving.trim()?engravingPrice:0; const total=product.price+fee;
  return <Dialog open onOpenChange={(open)=>!open&&onClose()}><DialogContent className="product-dialog"><DialogHeader className="sr-only"><DialogTitle>{product.name}</DialogTitle><DialogDescription>Elige color y personalización</DialogDescription></DialogHeader>
    <div className="dialog-image"><VariantProductImage product={product} color={color}/><span className="variant-caption">Vista referencial · {color}</span></div>
    <div className="dialog-copy"><button onClick={onClose} className="dialog-close" aria-label="Cerrar"><X/></button><p className="eyebrow">{product.category} · {product.capacity}</p><h2>{product.name}</h2><strong className="dialog-price">{money(product.price)}</strong><p className="description">{product.description}</p><div className="specs"><span>{product.material}</span><span>{product.measure}</span></div>
      <Label>Color: <strong>{color}</strong></Label><div className="color-options">{product.colors.map((item)=><button type="button" disabled={!item.stock} onClick={()=>setColor(item.name)} className={`${color===item.name?"selected":""} ${!item.stock?"disabled":""}`} key={item.name}><span className={colorClass(item.name)}/>{item.name}{!item.stock&&<small>Agotado</small>}</button>)}</div>
      {product.customizable&&<div className="engraving"><div className="included"><Sparkles size={16}/> Grabado opcional · +{money(engravingPrice)}</div><Label htmlFor="engraving">Texto para grabar <small>{engraving.length}/40</small></Label><Input id="engraving" maxLength={40} value={engraving} onChange={(event)=>setEngraving(event.target.value)} placeholder="Nombre, palabra, fecha o frase corta"/><p className="engraving-help">Puedes dejarlo vacío si deseas el termo sin grabado.</p><div className="two-cols"><div><Label>Tipografía</Label><Select disabled={!engraving.trim()} value={font} onValueChange={(value)=>setFont(value||"Clásica")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{engravingFonts.map((value)=><SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div><Label>Ícono</Label><Select disabled={!engraving.trim()} value={icon} onValueChange={(value)=>setIcon(value||"Sin ícono")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{engravingIcons.map((value)=><SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div></div></div>}
      <Button className="add-button" disabled={!color||!variant?.stock} onClick={()=>onAdd({key:`${product.sku}-${color}-${engraving}-${font}-${icon}`,sku:product.sku,name:product.name,price:total,engravingFee:0,image:variant?.image||product.image,quantity:1,color,engraving:engraving.trim(),font,icon})}>Agregar a mi bolsa · {money(total)}</Button><p className="microcopy">La foto cambia según el color elegido · Envíos a todo el Perú</p>
    </div></DialogContent></Dialog>;
}

function colorClass(name:string){const n=name.toLowerCase();if(n.includes("negro"))return"swatch black";if(n.includes("azul"))return"swatch blue";if(n.includes("rosa")||n.includes("fucsia")||n.includes("melón"))return"swatch pink";if(n.includes("lila")||n.includes("morado"))return"swatch lilac";if(n.includes("blanco"))return"swatch white";if(n.includes("plomo"))return"swatch gray";if(n.includes("cuarzo"))return"swatch quartz";return"swatch cream"}
