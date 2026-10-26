const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// @desc    Calculate shipping fee based on city
// @route   POST /api/v1/orders/calculate-shipping
// @access  Public
const calculateShipping = async (req, res, next) => {
  try {
    const { city } = req.body;
    const isDhaka = city?.trim().toLowerCase() === "dhaka";
    const shippingFee = isDhaka ? 60.00 : 120.00;

    return ApiResponse.success(res, { shippingFee, city }, "Shipping fee calculated");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order (Checkout with Transaction & Stock Reduction)
// @route   POST /api/v1/orders/checkout
// @access  Public / Private (supports guest and logged-in users)
const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, shippingCity, shippingAddress, orderNotes, paymentMethod, items } = req.body;
    const userId = req.user?.id || null;

    if (!items || items.length === 0) {
      throw ApiError.badRequest("No items provided in order");
    }

    // Execute order placement inside a Prisma Interactive Transaction
    const orderResult = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        // 1. Fetch variant and product to verify stock and price
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant || variant.productId !== item.productId) {
          throw ApiError.badRequest(`Invalid product variant for size ${item.size}`);
        }

        if (variant.stock < item.quantity) {
          throw ApiError.badRequest(`Insufficient stock for "${variant.product.title}" in size ${item.size}. Available: ${variant.stock}`);
        }

        // 2. Decrement stock atomically
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });

        const unitPrice = Number(variant.product.price);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          title: variant.product.title,
          size: item.size,
          unitPrice,
          quantity: item.quantity,
          totalPrice,
        });
      }

      // 3. Calculate shipping & totals
      const isDhaka = shippingCity?.trim().toLowerCase() === "dhaka";
      const shippingFee = isDhaka ? 60.00 : 120.00;
      const discountTotal = 0.00; // Can apply promo codes if needed
      const totalAmount = subtotal + shippingFee - discountTotal;

      const orderNumber = `JHG-${Date.now().toString().slice(-8)}`;

      // 4. Create Order record
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName,
          customerPhone,
          shippingCity,
          shippingAddress,
          orderNotes,
          subtotal,
          shippingFee,
          discountTotal,
          totalAmount,
          paymentMethod: paymentMethod || "COD",
          paymentStatus: paymentMethod === "COD" ? "UNPAID" : "PAID", // Assuming online payment is paid instantly
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: { select: { title: true, image: true } },
            },
          },
        },
      });

      // 5. If user is logged in, clear their cart items
      if (userId) {
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      return order;
    });

    return ApiResponse.created(res, orderResult, "Order placed successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.success(res, orders, "User orders retrieved");
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by order number or ID
// @route   GET /api/v1/orders/:identifier
// @access  Public / Private
const getOrderDetails = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

    const order = await prisma.order.findUnique({
      where: isUuid ? { id: identifier } : { orderNumber: identifier },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, image: true, slug: true } },
          },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    return ApiResponse.success(res, order, "Order details retrieved");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateShipping,
  createOrder,
  getMyOrders,
  getOrderDetails,
};
