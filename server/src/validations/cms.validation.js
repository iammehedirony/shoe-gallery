const { z } = require("zod");

const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),
    script: z.string().optional(),
    tagline: z.string().optional(),
    image: z.string().min(1, "Image URL is required"),
    alt: z.string().optional(),
    link: z.string().optional(),
    type: z.enum(["HERO", "SUB_BANNER", "PROMO"]).default("HERO"),
    sortOrder: z.number().int().optional(),
  }),
});

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name is required"),
    slug: z.string().min(2, "Slug is required"),
    icon: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
  }),
});

module.exports = {
  createBannerSchema,
  createCategorySchema,
};
