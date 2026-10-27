const { z } = require("zod");

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
  }),
});

const updatePaymentStatusSchema = z.object({
  body: z.object({
    paymentStatus: z.enum(["UNPAID", "PAID", "FAILED", "REFUNDED"]),
  }),
});

const updateStockSchema = z.object({
  body: z.object({
    stock: z.number().int().min(0, "Stock cannot be negative"),
  }),
});

const productVariantInputSchema = z.object({
  size: z.string().min(1, "Size is required"),
  stock: z.number().int().min(0).default(10),
});

const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),
    slug: z.string().min(2, "Slug is required"),
    sku: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    oldPrice: z.number().optional().nullable(),
    discount: z.number().int().min(0).max(100).default(0),
    badge: z.string().optional().nullable(),
    image: z.string().min(1, "Primary image is required"),
    images: z.array(z.string()).optional(),
    categoryId: z.string().optional().nullable(),
    tagIds: z.array(z.string()).optional(),
    isFlashSale: z.boolean().optional(),
    flashSaleStartTime: z.string().optional().nullable(),
    flashSaleEndTime: z.string().optional().nullable(),
    variants: z.array(productVariantInputSchema).min(1, "At least one size variant is required"),
  }),
});

module.exports = {
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  updateStockSchema,
  createProductSchema,
};
