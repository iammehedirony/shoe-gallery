export type ProductBadge = "Fresh Stock" | "New In" | "Hot" | "Limited";

export interface Product {
  id: string;
  title: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice: number;
  discount: number;
  sizes: string[];
  badge?: ProductBadge;
  sku?: string;
  categories?: string[];
  tags?: string[];
  description?: string;
}

export interface HeroSlide {
  id: string;
  script: string;
  title: string;
  tagline: string;
  image: string;
  alt: string;
}

export type ShoeCategoryIcon =
  | "boot"
  | "loafer"
  | "formal"
  | "sandal"
  | "casual"
  | "sports"
  | "heels"
  | "flats";

export interface NavChild {
  label: string;
  href: string;
  icon: ShoeCategoryIcon;
}

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
  children?: NavChild[];
}
