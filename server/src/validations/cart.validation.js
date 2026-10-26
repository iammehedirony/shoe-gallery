const { z } = require("zod");

const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid product ID"),
    variantId: z.string().uuid("Invalid variant ID").optional(),
    size: z.string().min(1, "Shoe size is required"),
    quantity: z.number().int().positive("Quantity must be at least 1").default(1),
  }),
});

const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive("Quantity must be at least 1"),
  }),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
};
