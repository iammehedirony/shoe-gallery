const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get Admin Dashboard Stats (Revenue, Orders, Customers, Low Stock)
// @route   GET /api/v1/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalCustomers, orders, lowStockVariants] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({ select: { totalAmount: true, paymentStatus: true } }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 5 } },
        include: { product: { select: { title: true } } },
      }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "PAID")
      .reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

    return ApiResponse.success(
      res,
      {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount: lowStockVariants.length,
        lowStockVariants,
      },
      "Dashboard statistics retrieved"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for admin
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: { select: { title: true, image: true } } },
        },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.success(res, orders, "Admin orders retrieved");
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/v1/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return ApiResponse.success(res, updatedOrder, "Order status updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PATCH /api/v1/admin/orders/:id/payment
// @access  Private/Admin
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });

    return ApiResponse.success(res, updatedOrder, "Payment status updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory stock table & stats
// @route   GET /api/v1/admin/inventory
// @access  Private/Admin
const getInventory = async (req, res, next) => {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: { select: { id: true, title: true, price: true, image: true, sku: true } },
      },
      orderBy: { product: { title: "asc" } },
    });

    const totalProducts = await prisma.product.count();
    let outOfStockCount = 0;
    let lowStockCount = 0;
    let totalInventoryValue = 0;

    variants.forEach((v) => {
      if (v.stock === 0) {
        outOfStockCount++;
      } else if (v.stock <= 5) {
        lowStockCount++;
      }
      totalInventoryValue += Number(v.product.price) * v.stock;
    });

    return ApiResponse.success(
      res,
      {
        variants,
        stats: {
          totalProducts,
          outOfStockCount,
          lowStockCount,
          totalInventoryValue,
        },
      },
      "Inventory retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock quantity for a variant
// @route   PATCH /api/v1/admin/inventory/:variantId
// @access  Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const { stock } = req.body;

    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw ApiError.notFound("Product variant not found");
    }

    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
      include: { product: { select: { title: true } } },
    });

    return ApiResponse.success(res, updatedVariant, "Stock updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers
// @route   GET /api/v1/admin/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: { select: { totalAmount: true, paymentStatus: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.success(res, customers, "Customers retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PATCH /api/v1/admin/customers/:id
// @access  Private/Admin
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, isActive } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw ApiError.notFound("Customer not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, phone, isActive },
      select: { id: true, name: true, email: true, phone: true, isActive: true },
    });

    return ApiResponse.success(res, updatedUser, "Customer updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/v1/admin/customers/:id
// @access  Private/Admin
const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw ApiError.notFound("Customer not found");
    }

    await prisma.user.delete({ where: { id } });

    return ApiResponse.success(res, null, "Customer deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product with variants, tags, and flash sale
// @route   POST /api/v1/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { 
      title, slug, sku, description, price, oldPrice, discount, badge, 
      image, images, categoryId, tagIds, isFlashSale, flashSaleStartTime, flashSaleEndTime, variants 
    } = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        sku,
        description,
        price,
        oldPrice,
        discount,
        badge,
        isFlashSale: isFlashSale || false,
        flashSaleStartTime: flashSaleStartTime ? new Date(flashSaleStartTime) : null,
        flashSaleEndTime: flashSaleEndTime ? new Date(flashSaleEndTime) : null,
        image,
        images: images || [image],
        categoryId,
        tags: tagIds && tagIds.length > 0 ? { connect: tagIds.map((id) => ({ id })) } : undefined,
        variants: {
          create: variants.map((v) => ({
            size: v.size,
            stock: v.stock,
          })),
        },
      },
      include: {
        variants: true,
        category: true,
        tags: true,
      },
    });

    return ApiResponse.created(res, product, "Product created successfully with tags & flash sale info");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    await prisma.product.delete({ where: { id } });

    return ApiResponse.success(res, null, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new badge (Admin)
// @route   POST /api/v1/admin/badges
// @access  Private/Admin
const createBadge = async (req, res, next) => {
  try {
    const { name, slug, color } = req.body;
    const badge = await prisma.badge.create({
      data: {
        name,
        slug,
        color: color || "bg-gray-100 text-gray-700",
      },
    });

    return ApiResponse.created(res, badge, "Badge created successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete badge (Admin)
// @route   DELETE /api/v1/admin/badges/:id
// @access  Private/Admin
const deleteBadge = async (req, res, next) => {
  try {
    const { id } = req.params;

    const badge = await prisma.badge.findUnique({ where: { id } });
    if (!badge) {
      throw ApiError.notFound("Badge not found");
    }

    await prisma.badge.delete({ where: { id } });

    return ApiResponse.success(res, null, "Badge deleted successfully");
  } catch (error) {
    next(error);
  }
};

const productController = require("./product.controller");
const cmsController = require("./cms.controller");

module.exports = {
  getDashboardStats,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getInventory,
  updateStock,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  createProduct,
  deleteProduct,
  createCategory: productController.createCategory,
  updateCategory: productController.updateCategory,
  deleteCategory: productController.deleteCategory,
  createTag: productController.createTag,
  deleteTag: productController.deleteTag,
  createBadge,
  deleteBadge,
  getBanners: cmsController.getBanners,
  createBanner: cmsController.createBanner,
  deleteBanner: cmsController.deleteBanner,
};
