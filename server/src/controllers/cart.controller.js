const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// Helper to get or create cart for user
const getOrCreateUserCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, title: true, price: true, oldPrice: true, image: true, discount: true },
          },
          variant: {
            select: { id: true, size: true, stock: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, title: true, price: true, oldPrice: true, image: true, discount: true },
            },
            variant: {
              select: { id: true, size: true, stock: true },
            },
          },
        },
      },
    });
  }

  return cart;
};

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateUserCart(req.user.id);
    return ApiResponse.success(res, cart, "Cart retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/items
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, variantId, size, quantity } = req.body;

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isPublished) {
      throw ApiError.notFound("Product not found");
    }

    // Verify stock variant for size
    let targetVariantId = variantId;
    if (!targetVariantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { productId_size: { productId, size } },
      });
      if (!variant) {
        throw ApiError.badRequest(`Selected size (${size}) is not available for this product`);
      }
      targetVariantId = variant.id;
    }

    const variantRecord = await prisma.productVariant.findUnique({
      where: { id: targetVariantId },
    });

    if (!variantRecord || variantRecord.stock < quantity) {
      throw ApiError.badRequest("Requested quantity exceeds available stock");
    }

    const cart = await getOrCreateUserCart(req.user.id);

    // Check if item with same product and size already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (variantRecord.stock < newQuantity) {
        throw ApiError.badRequest("Total quantity in cart exceeds available stock");
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: targetVariantId,
          size,
          quantity,
        },
      });
    }

    const updatedCart = await getOrCreateUserCart(req.user.id);
    return ApiResponse.success(res, updatedCart, "Item added to cart successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PATCH /api/v1/cart/items/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, variant: true },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      throw ApiError.notFound("Cart item not found");
    }

    if (cartItem.variant && cartItem.variant.stock < quantity) {
      throw ApiError.badRequest("Requested quantity exceeds available stock");
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    const updatedCart = await getOrCreateUserCart(req.user.id);
    return ApiResponse.success(res, updatedCart, "Cart updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/items/:itemId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      throw ApiError.notFound("Cart item not found");
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    const updatedCart = await getOrCreateUserCart(req.user.id);
    return ApiResponse.success(res, updatedCart, "Item removed from cart");
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart/clear
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    const updatedCart = await getOrCreateUserCart(req.user.id);
    return ApiResponse.success(res, updatedCart, "Cart cleared successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Sync guest cart with user cart on login
// @route   POST /api/v1/cart/sync
// @access  Private
const syncCart = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      const cart = await getOrCreateUserCart(req.user.id);
      return ApiResponse.success(res, cart, "Cart retrieved (no sync items)");
    }

    const cart = await getOrCreateUserCart(req.user.id);

    for (const item of items) {
      const { productId, variantId, size, quantity } = item;
      if (!productId || !size || !quantity) continue;

      let targetVariantId = variantId;
      if (!targetVariantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { productId_size: { productId, size } },
        });
        if (variant) targetVariantId = variant.id;
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          size,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variantId: targetVariantId,
            size,
            quantity: quantity || 1,
          },
        });
      }
    }

    const updatedCart = await getOrCreateUserCart(req.user.id);
    return ApiResponse.success(res, updatedCart, "Cart synced successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncCart,
};
