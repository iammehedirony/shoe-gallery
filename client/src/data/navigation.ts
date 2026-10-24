import type { NavChild, NavLink } from "@/src/types/product";

const menCategories: NavChild[] = [
  { label: "Boot", href: "#mens-collection", icon: "boot" },
  { label: "Loafer", href: "#mens-loafer", icon: "loafer" },
  { label: "Formal", href: "#mens-loafer", icon: "formal" },
  { label: "Sandals", href: "#mens-collection", icon: "sandal" },
  { label: "Casual", href: "#mens-collection", icon: "casual" },
  { label: "Sports", href: "#mens-collection", icon: "sports" },
];

const womenCategories: NavChild[] = [
  { label: "Heels", href: "#ladies-collection", icon: "heels" },
  { label: "Flats", href: "#ladies-collection", icon: "flats" },
  { label: "Sandals", href: "#ladies-collection", icon: "sandal" },
  { label: "Sneakers", href: "#ladies-collection", icon: "casual" },
  { label: "Boots", href: "#ladies-collection", icon: "boot" },
  { label: "Formal", href: "#ladies-collection", icon: "formal" },
];

const accessoriesCategories: NavChild[] = [
  { label: "Bags", href: "#", icon: "casual" },
  { label: "Wallets", href: "#", icon: "formal" },
  { label: "Belts", href: "#", icon: "loafer" },
];

const footwearCategories: NavChild[] = [
  { label: "Running", href: "#", icon: "sports" },
  { label: "Casual", href: "#", icon: "casual" },
];

const boysCategories: NavChild[] = [
  { label: "School Shoes", href: "#", icon: "formal" },
  { label: "Sneakers", href: "#", icon: "sports" },
];

export const navLinks: NavLink[] = [
  { label: "Men", href: "#mens-collection", active: true, children: menCategories },
  { label: "Women", href: "#ladies-collection", children: womenCategories },
  { label: "Accessories", href: "#best-selling", children: accessoriesCategories },
  { label: "Footwear", href: "#mens-loafer", children: footwearCategories },
  { label: "Boys", href: "#new-arrival", children: boysCategories },
];

export const policyLinks = [
  { label: "Shipping policy", href: "#" },
  { label: "Exchange & complaint", href: "#" },
  { label: "Return policy", href: "#" },
  { label: "Privacy policy", href: "#" },
  { label: "Terms & conditions", href: "#" },
];
