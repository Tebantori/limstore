export type ProductColor = { name: string; stock: number; image?: string };

export type Product = {
  id?: number;
  sku: string;
  name: string;
  slug: string;
  category: "Cups" | "Termos" | "Accesorios";
  price: number;
  capacity: string;
  material: string;
  measure: string;
  description: string;
  image: string;
  featured?: boolean;
  customizable: boolean;
  active: boolean;
  colors: ProductColor[];
};

const c = (names: string[], unavailable: string[] = []): ProductColor[] =>
  names.map((name) => ({ name, stock: unavailable.includes(name) ? 0 : 12 }));

export const seedProducts: Product[] = [
  { sku:"LIM-MOON-350",name:"Cup Moon 350 ml",slug:"cup-moon-350-ml",category:"Cups",price:40,capacity:"350 ml",material:"Acero inoxidable 304",measure:"12 cm de alto aprox. y 8 cm de diámetro",description:"Para el café o tu bebida favorita en cualquier ocasión. Mantiene la temperatura sin que el exterior cambie.",image:"/images/products/moon.jpg",featured:true,customizable:true,active:true,colors:c(["Rosa","Blanco","Azul marino","Crema","Negro"]) },
  { sku:"LIM-SPIRIT-400",name:"Cup Spirit 400 ml",slug:"cup-spirit-400-ml",category:"Cups",price:55,capacity:"400 ml",material:"Acero inoxidable 304",measure:"11.5 cm de alto aprox. y 8.5 cm de diámetro",description:"Un diseño que combina estilo y practicidad para esos pequeños momentos que hacen especial tu día.",image:"/images/products/spirit.jpg",customizable:true,active:true,colors:c(["Beige","Rosa","Negro","Azul"]) },
  { sku:"LIM-SKY-500",name:"Cup Sky 500 ml",slug:"cup-sky-500-ml",category:"Cups",price:49,capacity:"500 ml",material:"Acero inoxidable 304",measure:"15.5 cm de alto aprox. y 7 cm de diámetro",description:"Compacto, ligero y con doble pared al vacío. Antiderrame y con base antideslizante.",image:"/images/products/sky.jpg",customizable:true,active:true,colors:c(["Crema","Negro","Rosa","Azul"],["Rosa","Azul"]) },
  { sku:"LIM-FREE-500",name:"Cup Free 500 ml",slug:"cup-free-500-ml",category:"Cups",price:49,capacity:"500 ml",material:"Acero inoxidable 304",measure:"15.5 cm de alto aprox. y 7 cm de diámetro",description:"Antiderrame, elegante y con doble pared al vacío. Incluye base antideslizante.",image:"/images/products/free.jpg",customizable:true,active:true,colors:c(["Blanco","Rosa","Lila","Negro"],["Lila","Negro"]) },
  { sku:"LIM-STAR-500",name:"Cup Star 500 ml",slug:"cup-star-500-ml",category:"Cups",price:49,capacity:"500 ml",material:"Acero inoxidable 304",measure:"17 cm de alto aprox. y 6.5 cm de diámetro",description:"Su diseño de doble pico lo hace práctico y versátil para cada momento de tu rutina.",image:"/images/products/star.jpg",customizable:true,active:true,colors:c(["Lila","Azul","Beige"],["Beige"]) },
  { sku:"LIM-FLY-600",name:"Cup Fly 600 ml",slug:"cup-fly-600-ml",category:"Cups",price:55,capacity:"600 ml",material:"Acero inoxidable 304",measure:"17.5 cm de alto aprox. y 6.5 cm de diámetro",description:"Para el coworking, la oficina o la calle, manteniendo siempre la temperatura ideal.",image:"/images/products/fly.jpg",featured:true,customizable:true,active:true,colors:c(["Negro","Beige","Rosa pastel","Blanco","Lila","Azul"]) },
  { sku:"LIM-LIGHT-500",name:"Termo Light 500 ml",slug:"termo-light-500-ml",category:"Termos",price:55,capacity:"500 ml",material:"Acero inoxidable 304",measure:"22 cm de alto aprox. y 7 cm de diámetro",description:"Ligero, práctico y estilizado, perfecto para llevar tu bebida favorita a donde vayas.",image:"/images/products/light.jpg",customizable:true,active:true,colors:c(["Negro","Azul","Rosa","Beige"]) },
  { sku:"LIM-FAITH-MINI-600",name:"Termo Faith Mini 600 ml",slug:"termo-faith-mini-600-ml",category:"Termos",price:55,capacity:"600 ml",material:"Acero inoxidable 304",measure:"17.5 cm de alto aprox. y 6.5 cm de diámetro",description:"Compacto, cómodo de llevar y perfecto para disfrutar tus bebidas estés donde estés.",image:"/images/products/faith-mini.jpg",customizable:true,active:true,colors:c(["Negro","Beige","Rosa pastel","Blanco","Lila","Azul"]) },
  { sku:"LIM-PEACE-MINI-620",name:"Termo Peace Mini 620 ml",slug:"termo-peace-mini-620-ml",category:"Termos",price:55,capacity:"620 ml",material:"Acero inoxidable 304",measure:"17.5 cm de alto aprox. y 6.5 cm de diámetro",description:"Diseño funcional con asa superior para llevarlo fácilmente y tener tu bebida siempre cerca.",image:"/images/products/peace-mini.jpg",customizable:true,active:true,colors:c(["Rosa","Morado","Negro","Rosa pastel","Lila pastel"],["Rosa pastel","Lila pastel"]) },
  { sku:"LIM-PEACE-720",name:"Termo Peace 720 ml",slug:"termo-peace-720-ml",category:"Termos",price:59,capacity:"720 ml",material:"Acero inoxidable 304",measure:"29 cm de alto aprox. y 7 cm de diámetro",description:"Ligero y listo para convertirse en tu nuevo favorito: de esos termos que se quedan contigo.",image:"/images/products/peace-720.jpg",featured:true,customizable:true,active:true,colors:c(["Beige","Rosa","Azul","Negro"]) },
  { sku:"LIM-PRIME-800",name:"Termo Prime 800 ml",slug:"termo-prime-800-ml",category:"Termos",price:65,capacity:"800 ml",material:"Acero inoxidable 316",measure:"27 cm de alto aprox. y 7 cm de diámetro",description:"Diseño sofisticado y acabado premium para acompañarte todos los días.",image:"/images/products/prime.jpg",customizable:true,active:true,colors:c(["Melón","Beige","Azul","Negro"]) },
  { sku:"LIM-FAITH-900",name:"Termo Faith 900 ml",slug:"termo-faith-900-ml",category:"Termos",price:59,capacity:"900 ml",material:"Acero inoxidable 304",measure:"24 cm de alto aprox. y 6.5 cm de diámetro",description:"Conserva bebidas frías o calientes por más de 10 horas aproximadamente.",image:"/images/products/faith-900.jpg",featured:true,customizable:true,active:true,colors:[{name:"Negro",stock:12,image:"/images/products/faith-900/negro.png"},{name:"Azul",stock:12,image:"/images/products/faith-900/azul.png"},{name:"Cuarzo",stock:12},{name:"Rosa",stock:12,image:"/images/products/faith-900/rosa.png"},{name:"Blanco",stock:12},{name:"Beige",stock:12}] },
  { sku:"LIM-GRACE-1000",name:"Termo Grace 1000 ml",slug:"termo-grace-1000-ml",category:"Termos",price:59,capacity:"1000 ml",material:"Acero inoxidable 304",measure:"27 cm de alto aprox. y 7 cm de diámetro",description:"Doble pico para una experiencia más cómoda al beber, combinando funcionalidad y estilo.",image:"/images/products/grace.jpg",customizable:true,active:true,colors:c(["Rosa","Beige","Blanco","Negro"],["Blanco","Negro"]) },
  { sku:"LIM-SHINE-1000",name:"Termo Shine 1000 ml",slug:"termo-shine-1000-ml",category:"Termos",price:65,capacity:"1000 ml",material:"Acero inoxidable 304",measure:"27 cm de alto aprox. y 7 cm de diámetro",description:"Un termo antiderrame que se ve bien en tu escritorio, el gym o donde lo lleves.",image:"/images/products/shine.jpg",customizable:true,active:true,colors:c(["Rosa","Crema","Azul","Lila","Negro"],["Negro"]) },
  { sku:"LIM-MAF-1200",name:"Termo MAF 1200 ml",slug:"termo-maf-1200-ml",category:"Termos",price:65,capacity:"1200 ml",material:"Acero inoxidable 304",measure:"26.5 cm de alto aprox. y 7.5 cm de diámetro",description:"Hidratación completa en un tamaño ideal para tu día a día. Antiderrame.",image:"/images/products/maf.jpg",customizable:true,active:true,colors:c(["Negro","Fucsia","Crema","Rosa","Blanco","Lila"],["Lila"]) },
  { sku:"LIM-GLOW-600",name:"Termo Glow 600 ml",slug:"termo-glow-600-ml",category:"Termos",price:65,capacity:"600 ml",material:"Acero inoxidable 304",measure:"27 cm de alto aprox. y 7 cm de diámetro",description:"Lleva tu shaker y tus proteínas en su recipiente adicional. Antiderrame.",image:"/images/products/glow.jpg",customizable:true,active:true,colors:c(["Negro","Azul","Rosa"],["Rosa"]) },
  { sku:"LIM-LOW-1400",name:"Termo Low 1400 ml",slug:"termo-low-1400-ml",category:"Termos",price:75,capacity:"1400 ml",material:"Acero inoxidable 304",measure:"29 cm de alto aprox. y 14.5 cm de diámetro",description:"Para rutinas largas, con la capacidad ideal para esos días de gym o trabajo. Antiderrame.",image:"/images/products/low.jpg",customizable:true,active:true,colors:c(["Negro"]) },
  { sku:"LIM-PORTA",name:"Portatermos LIM",slug:"portatermos-lim",category:"Accesorios",price:29,capacity:"Hasta 40 oz",material:"Textil",measure:"Compatible con termos de hasta 40 oz",description:"Lleva tu LIM cómodamente y protégelo durante tus recorridos.",image:"/images/products/porta-termos.jpg",customizable:false,active:true,colors:c(["Lila","Rosado","Beige","Negro"]) },
  { sku:"LIM-BASE-SILICONA",name:"Base de silicona LIM",slug:"base-silicona-lim",category:"Accesorios",price:12,capacity:"7.5 cm de diámetro",material:"Silicona",measure:"7.5 cm de diámetro",description:"Protege la base de tu termo y mejora su estabilidad sobre distintas superficies.",image:"/images/products/base-silicona.jpg",customizable:false,active:true,colors:c(["Plomo","Negro","Azul","Rosa","Lila"]) }
];

export const engravingFonts = ["Clásica", "Manuscrita", "Minimal", "Fuerte"];
export const engravingIcons = ["Sin ícono", "Corazón", "Estrella", "Flor", "Cruz", "Rayo"];
