const { z } = require("zod");

const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 12)),
    search: z.string().optional(),
    category: z.string().optional(), // category slug or id
    tag: z.string().optional(),
    badge: z.string().optional(),
    minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    size: z.string().optional(),
    sort: z.string().optional(), // 'price-asc', 'price-desc', 'newest', 'popular'
  }),
});

module.exports = {
  productQuerySchema,
};
