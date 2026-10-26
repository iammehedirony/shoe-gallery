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

// @desc    Get inventory stock table
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

    return ApiResponse.success(res, variants, "Inventory retrieved successfully");
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
      },
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.success(res, customers, "Customers retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product with variants
// @route   POST /api/v1/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { title, slug, sku, description, price, oldPrice, discount, badge, image, images, categoryId, variants } = req.body;

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
        image,
        images: images || [image],
        categoryId,
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
      },
    });

    return ApiResponse.created(res, product, "Product created successfully");
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
  createProduct,
  deleteProduct,
  createCategory: productController.createCategory,
  deleteCategory: productController.deleteCategory,
  getBanners: cmsController.getBanners,
  createBanner: cmsController.createBanner,
  deleteBanner: cmsController.deleteBanner,
};
