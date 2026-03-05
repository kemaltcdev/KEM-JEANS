export type Category = "Farmerke" | "Majice" | "Dukserice" | "Trenerke" | "Šorcevi";
export type Badge = "Novo" | "Popularno";
export type Size = "S" | "M" | "L" | "XL";
export type Color = "Crna" | "Plava" | "Siva" | "Bijela";

export interface Product {
  id: number;
  slug: string;
  name: string;
  priceKM: number;
  compareAtKM?: number;
  description: string;
  category: Category;
  badge?: Badge;
  /** Primary thumbnail used in cards */
  image: string;
  /** Full gallery for product detail page */
  images: string[];
  sizes: Size[];
  colors: Color[];
}

export const PRODUCTS: Product[] = [
  /* ── Farmerke ──────────────────────────────────────────────────────────────── */
  {
    id: 1,
    slug: "slim-fit-farmerke",
    name: "Slim Fit Farmerke",
    priceKM: 89,
    compareAtKM: 119,
    description:
      "Slim fit kroj koji naglašava liniju tijela bez ograničavanja pokreta. Izrađene od premium stretch denim tkanine za maksimalnu udobnost tokom cijelog dana. Klasičan 5-džepni dizajn sa modernom obradom.",
    category: "Farmerke",
    badge: "Popularno",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Plava", "Siva"],
  },
  {
    id: 2,
    slug: "relaxed-fit-farmerke",
    name: "Relaxed Fit Farmerke",
    priceKM: 95,
    description:
      "Opušteni kroj za svakodnevni komfor. Kvalitetni denim koji se nosi lagano i izgleda premium. Idealan za casual i poluformalnu kombinaciju.",
    category: "Farmerke",
    badge: "Popularno",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Crna", "Plava"],
  },
  {
    id: 3,
    slug: "denim-jakna",
    name: "Denim Jakna",
    priceKM: 149,
    compareAtKM: 189,
    description:
      "Klasična denim jakna modernog kroja. Savršena za prijelazne sezone, lako se kombinira sa svim odjevnim kombinacijama.",
    category: "Farmerke",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900&q=85",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Plava", "Crna"],
  },
  {
    id: 4,
    slug: "straight-cut-farmerke",
    name: "Straight Cut Farmerke",
    priceKM: 99,
    description:
      "Ravni kroj koji odgovara svim tipovima tijela. Klasičan denim sa modernim detaljima i preciznom obradom šavova.",
    category: "Farmerke",
    image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=900&q=85",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Plava", "Siva"],
  },
  {
    id: 5,
    slug: "distressed-farmerke",
    name: "Distressed Farmerke",
    priceKM: 109,
    description:
      "Namjerno oštećene farmerke za street look. Svaki par je jedinstven — premium denim s autentičnom obradom.",
    category: "Farmerke",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=900&q=85",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Crna", "Plava"],
  },

  /* ── Majice ────────────────────────────────────────────────────────────────── */
  {
    id: 6,
    slug: "crna-basic-majica",
    name: "Crna Basic Majica",
    priceKM: 39,
    description:
      "Esencijalni komad svake garderobe. Meka pamučna tkanina, precizno šivanje i clean minimal dizajn.",
    category: "Majice",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Bijela", "Siva"],
  },
  {
    id: 7,
    slug: "classic-polo-majica",
    name: "Classic Polo Majica",
    priceKM: 55,
    description:
      "Klasična polo majica od premium pique tkanine. Elegantna za poslovne prilike, opuštena za vikend izlazak.",
    category: "Majice",
    badge: "Popularno",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=85",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Bijela", "Crna", "Plava"],
  },
  {
    id: 8,
    slug: "bijela-oversized-majica",
    name: "Bijela Oversized Majica",
    priceKM: 45,
    description:
      "Oversized fit sa clean dizajnom. Savršen bijeli komad koji se lako slaže s bilo čim.",
    category: "Majice",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900&q=85",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Bijela", "Crna"],
  },
  {
    id: 9,
    slug: "graficka-majica",
    name: "Grafička Majica",
    priceKM: 49,
    description:
      "Premium pamučna majica s minimalističkim grafičkim dizajnom. Iskazuje stil bez pretjerivanja.",
    category: "Majice",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Bijela"],
  },
  {
    id: 10,
    slug: "linen-majica",
    name: "Linen Majica",
    priceKM: 59,
    description:
      "Lagana lanen majica za toplo vrijeme. Prirodni materijal koji diše, premium tekstura, moderan kroj.",
    category: "Majice",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Bijela", "Siva"],
  },

  /* ── Dukserice ─────────────────────────────────────────────────────────────── */
  {
    id: 11,
    slug: "premium-dukserica",
    name: "Premium Dukserica",
    priceKM: 79,
    compareAtKM: 99,
    description:
      "Heavyweight fleece dukserica od organskog pamuka. Meka iznutra, strukturirana izvana — idealna za hladnije dane.",
    category: "Dukserice",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85",
      "https://images.unsplash.com/photo-1580657018950-c7f7d993a821?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Siva"],
  },
  {
    id: 12,
    slug: "zip-up-dukserica",
    name: "Zip-Up Dukserica",
    priceKM: 89,
    description:
      "Zip-up hoodie od premium materijala. Funkcionalan i stilski detalj za hladnije dane.",
    category: "Dukserice",
    image: "https://images.unsplash.com/photo-1580657018950-c7f7d993a821?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1580657018950-c7f7d993a821?w=900&q=85",
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Siva", "Plava"],
  },
  {
    id: 13,
    slug: "hoodie-dukserica",
    name: "Classic Hoodie",
    priceKM: 75,
    description:
      "Klasičan hoodie od premium flis materijala sa velikom kapuljačom i kangurovim džepom.",
    category: "Dukserice",
    badge: "Popularno",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=900&q=85",
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Siva"],
  },
  {
    id: 14,
    slug: "oversized-dukserica",
    name: "Oversized Dukserica",
    priceKM: 85,
    description:
      "Oversized fit za opušteni, moderniji look. Deblji materijal, dropirani rameni šav — premium streetwear estetika.",
    category: "Dukserice",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=900&q=85",
      "https://images.unsplash.com/photo-1580657018950-c7f7d993a821?w=900&q=85",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Crna", "Bijela"],
  },

  /* ── Trenerke ──────────────────────────────────────────────────────────────── */
  {
    id: 15,
    slug: "urban-trenerka",
    name: "Urban Trenerka",
    priceKM: 119,
    description:
      "Set koji kombinuje atletski performans i street stil. Elastičan struk, manžetne i moderan kroj.",
    category: "Trenerke",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Crna", "Siva", "Plava"],
  },
  {
    id: 16,
    slug: "classic-trenerka",
    name: "Classic Trenerka",
    priceKM: 109,
    description:
      "Klasičan trenerka set za svakodnevni aktivni stil. Udoban materijal, premium osjaj i moderan kroj.",
    category: "Trenerke",
    badge: "Popularno",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Siva"],
  },
  {
    id: 17,
    slug: "slim-trenerka",
    name: "Slim Fit Trenerka",
    priceKM: 99,
    description:
      "Slim kroj trenerke s tehnološkim materijalom koji prati tijelo. Idealna za aktivni stil i sport.",
    category: "Trenerke",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Crna", "Plava"],
  },
  {
    id: 18,
    slug: "cargo-trenerka",
    name: "Cargo Trenerka",
    priceKM: 129,
    description:
      "Trenerka s cargo džepovima za funkcionalnost i streetwear estetiku. Premium materijal, slobodan kroj.",
    category: "Trenerke",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=900&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Crna", "Siva"],
  },

  /* ── Šorcevi ───────────────────────────────────────────────────────────────── */
  {
    id: 19,
    slug: "ljetni-sorc",
    name: "Ljetni Šorc",
    priceKM: 49,
    description:
      "Lagani ljetni šorc od brzo-sušeće tkanine. Savršen za plažu, grad ili sportske aktivnosti.",
    category: "Šorcevi",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Plava", "Siva"],
  },
  {
    id: 20,
    slug: "cargo-sorc",
    name: "Cargo Šorc",
    priceKM: 59,
    description:
      "Cargo šorc s višestrukim džepovima. Funkcionalan, moderan i premium izrađen za svakodnevno nošenje.",
    category: "Šorcevi",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=900&q=85",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Siva"],
  },
  {
    id: 21,
    slug: "swim-sorc",
    name: "Swim Šorc",
    priceKM: 45,
    description:
      "Brzo-sušeći swim šorc s modernim printom. Idealan za bazen, plažu ili ljetni casual look.",
    category: "Šorcevi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Plava"],
  },
  {
    id: 22,
    slug: "chino-sorc",
    name: "Chino Šorc",
    priceKM: 55,
    description:
      "Chino šorc od stretch materijala. Elegantno i udobno — savršen prijelaz između casual i smart-casual stila.",
    category: "Šorcevi",
    badge: "Popularno",
    image: "https://images.unsplash.com/photo-1591196694535-3944d6197c6d?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591196694535-3944d6197c6d?w=900&q=85",
      "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Siva", "Bijela", "Crna"],
  },
  {
    id: 23,
    slug: "tech-sorc",
    name: "Tech Šorc",
    priceKM: 65,
    description:
      "Tech material šorc sa 4-way stretch za maksimalnu slobodu pokreta. Idealan za trening i casual nošenje.",
    category: "Šorcevi",
    badge: "Novo",
    image: "https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crna", "Siva", "Plava"],
  },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────────── */

export const CATEGORIES: Category[] = ["Farmerke", "Majice", "Dukserice", "Trenerke", "Šorcevi"];
export const SIZES: Size[] = ["S", "M", "L", "XL"];
export const COLORS: Color[] = ["Crna", "Plava", "Siva", "Bijela"];
export const COLOR_MAP: Record<Color, string> = {
  Crna: "#1a1a1a",
  Plava: "#2563eb",
  Siva: "#6b7280",
  Bijela: "#f4f4f2",
};
