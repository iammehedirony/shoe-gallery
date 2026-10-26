const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for JH Shoe Gallery...");

  // 1. Seed Admin User & Customer User
  const adminPassword = await bcrypt.hash("admin123456", 10);
  // const customerPassword = await bcrypt.hash("user123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@jhshoe.com" },
    update: {},
    create: {
      name: "JH Gallery Admin",
      email: "admin@jhshoe.com",
      phone: "01700000000",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user ready: admin@jhshoe.com");

  // await prisma.user.upsert({
  //   where: { email: "customer@jhshoe.com" },
  //   update: {},
  //   create: {
  //     name: "Rony Ahmed",
  //     email: "customer@jhshoe.com",
  //     phone: "01800000000",
  //     password: customerPassword,
  //     role: "CUSTOMER",
  //   },
  // });

  // 2. Seed Categories
  // const categoriesData = [
  //   { name: "Sneakers", slug: "sneakers", icon: "sports", description: "Trendy and athletic sneakers" },
  //   { name: "Loafers", slug: "loafers", icon: "loafer", description: "Classic leather and casual loafers" },
  //   { name: "Formal Shoes", slug: "formal", icon: "formal", description: "Executive and wedding collection" },
  //   { name: "Boots", slug: "boots", icon: "boot", description: "Rugged and durable high ankle boots" },
  //   { name: "Sandals & Slides", slug: "sandals", icon: "sandal", description: "Comfortable everyday slides and sandals" },
  //   { name: "Casual Shoes", slug: "casual", icon: "casual", description: "Daily comfort wear" },
  // ];

  // const categories = {};
  // for (const cat of categoriesData) {
  //   const record = await prisma.category.upsert({
  //     where: { slug: cat.slug },
  //     update: cat,
  //     create: cat,
  //   });
  //   categories[cat.slug] = record;
  // }
  // console.log("✅ Categories seeded");

  // // 3. Seed Hero Banners
  // const bannersData = [
  //   {
  //     title: "Step Into Elegance",
  //     script: "Exclusive Collection",
  //     tagline: "Up to 30% Off on Premium Formal Shoes",
  //     image: "/images/hero-model-1.jpg",
  //     type: "HERO",
  //     sortOrder: 1,
  //   },
  //   {
  //     title: "Urban Street Vibes",
  //     script: "New Arrivals",
  //     tagline: "Engineered for maximum comfort and all-day traction",
  //     image: "/images/hero-model-2.jpg",
  //     type: "HERO",
  //     sortOrder: 2,
  //   },
  // ];

  // for (const banner of bannersData) {
  //   const existing = await prisma.banner.findFirst({ where: { title: banner.title } });
  //   if (!existing) {
  //     await prisma.banner.create({ data: banner });
  //   }
  // }
  // console.log("✅ Banners seeded");

  // // 4. Seed Featured Shoe Products
  // const sampleProducts = [
  //   {
  //     title: "Air Cloud Low-Top Leather Sneakers White",
  //     slug: "air-cloud-low-top-leather-sneakers-white",
  //     sku: "SKU-SNK-001",
  //     description: "Step into unparalleled comfort and classic style with our handcrafted leather sneakers. Engineered for the modern individual.",
  //     price: 2750.0,
  //     oldPrice: 3200.0,
  //     discount: 14,
  //     badge: "NEW_IN",
  //     image: "/images/products/24.jpg",
  //     images: ["/images/products/24.jpg", "/images/products/02.jpg", "/images/products/16.jpg"],
  //     categorySlug: "sneakers",
  //     sizes: ["39", "40", "41", "42", "43", "44"],
  //   },
  //   {
  //     title: "Retro Runner Lifestyle Shoes Orange",
  //     slug: "retro-runner-lifestyle-shoes-orange",
  //     sku: "SKU-SNK-002",
  //     description: "Vibrant and energetic street style runners with cushioned sole.",
  //     price: 1950.0,
  //     oldPrice: 2500.0,
  //     discount: 22,
  //     badge: "FRESH_STOCK",
  //     image: "/images/products/02.jpg",
  //     images: ["/images/products/02.jpg"],
  //     categorySlug: "sneakers",
  //     sizes: ["39", "40", "41", "42", "43"],
  //   },
  //   {
  //     title: "Graceland Super Durable Slip-On Shoes Full Black",
  //     slug: "graceland-super-durable-slip-on-shoes-full-black",
  //     sku: "SKU-LOA-003",
  //     description: "Breathable, lightweight, and durable slip-on shoes for office and regular wear.",
  //     price: 1750.0,
  //     oldPrice: 2100.0,
  //     discount: 16,
  //     badge: "HOT",
  //     image: "/images/products/06.jpg",
  //     images: ["/images/products/06.jpg"],
  //     categorySlug: "loafers",
  //     sizes: ["38", "39", "40", "41", "42", "43"],
  //   },
  //   {
  //     title: "Classic Oxford Premium Handcrafted Leather Shoes",
  //     slug: "classic-oxford-premium-handcrafted-leather-shoes",
  //     sku: "SKU-FOR-004",
  //     description: "Pure cowhide leather executive formal shoe with Goodyear welt construction.",
  //     price: 3850.0,
  //     oldPrice: 4500.0,
  //     discount: 15,
  //     badge: "LIMITED",
  //     image: "/images/products/12.jpg",
  //     images: ["/images/products/12.jpg"],
  //     categorySlug: "formal",
  //     sizes: ["40", "41", "42", "43", "44"],
  //   },
  // ];

  // for (const item of sampleProducts) {
  //   const { categorySlug, sizes, ...prodData } = item;
  //   const category = categories[categorySlug];

  //   const product = await prisma.product.upsert({
  //     where: { slug: prodData.slug },
  //     update: {
  //       ...prodData,
  //       categoryId: category ? category.id : null,
  //     },
  //     create: {
  //       ...prodData,
  //       categoryId: category ? category.id : null,
  //     },
  //   });

  //   // Seed size-wise variants with stock
  //   for (const size of sizes) {
  //     await prisma.productVariant.upsert({
  //       where: {
  //         productId_size: {
  //           productId: product.id,
  //           size: size,
  //         },
  //       },
  //       update: { stock: 15 },
  //       create: {
  //         productId: product.id,
  //         size: size,
  //         stock: 15,
  //       },
  //     });
  //   }
  // }

  // console.log("✅ Sample Products with Variants & Stock seeded");
  // console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
