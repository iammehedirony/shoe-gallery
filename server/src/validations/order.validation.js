const { z } = require("zod");

const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  variantId: z.string().uuid("Invalid variant ID"),
  size: z.string().min(1, "Size is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

const checkoutSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, "Customer name is required"),
    customerPhone: z.string().min(10, "Valid phone number is required"),
    shippingCity: z.string().min(2, "Shipping city is required"),
    shippingAddress: z.string().min(5, "Shipping address is required"),
    orderNotes: z.string().optional(),
    paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "CARD"]).default("COD"),
    items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  }),
});

const calculateShippingSchema = z.object({
  body: z.object({
    city: z.string().min(1, "City is required"),
  }),
});

module.exports = {
  checkoutSchema,
  calculateShippingSchema,
};
