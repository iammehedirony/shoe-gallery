const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get all products with filters, search, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const { search, category, tag, badge, minPrice, maxPrice, size, sort } = req.query;

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      };
    }

    if (badge) {
      where.badge = badge.toUpperCase();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (size) {
      where.variants = {
        some: {
          size: size,
          stock: { gt: 0 },
        },
      };
    }

    // Build sorting
    let orderBy = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
          variants: { select: { id: true, size: true, stock: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return ApiResponse.success(
      res,
      {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Products retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/v1/products/:identifier
// @access  Public
const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    // Check if identifier is uuid or slug
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(identifier);

    const product = await prisma.product.findUnique({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        tags: { select: { id: true, name: true, slug: true } },
        variants: { select: { id: true, size: true, stock: true }, orderBy: { size: "asc" } },
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isPublished) {
      throw ApiError.notFound("Product not found");
    }

    return ApiResponse.success(res, product, "Product details retrieved");
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories (including parent and subcategories hierarchy)
// @route   GET /api/v1/products/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null }, // Fetch root categories
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return ApiResponse.success(res, categories, "Categories and subcategories retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create category or subcategory (Admin)
// @route   POST /api/v1/admin/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, icon, image, description, parentId } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon,
        image,
        description,
        parentId: parentId || null,
      },
      include: { parent: true },
    });

    return ApiResponse.created(res, category, "Category/Subcategory created successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    await prisma.category.delete({ where: { id } });

    return ApiResponse.success(res, null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Update category or subcategory (Admin)
// @route   PATCH /api/v1/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, image, description, parentId } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw ApiError.notFound("Category not found");
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        icon,
        image,
        description,
        parentId: parentId !== undefined ? (parentId || null) : category.parentId,
      },
      include: { parent: true, children: true },
    });

    return ApiResponse.success(res, updatedCategory, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tags
// @route   GET /api/v1/tags
// @access  Public
const getTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });

    return ApiResponse.success(res, tags, "Tags retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get all badges
// @route   GET /api/v1/products/badges
// @access  Public
const getBadges = async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { name: "asc" },
    });

    return ApiResponse.success(res, badges, "Badges retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tag (Admin)
// @route   POST /api/v1/admin/tags
// @access  Private/Admin
const createTag = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const tag = await prisma.tag.create({
      data: { name, slug },
    });
    return ApiResponse.created(res, tag, "Tag created successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tag
// @route   DELETE /api/v1/admin/tags/:id
// @access  Private/Admin
const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({ where: { id } });
    return ApiResponse.success(res, null, "Tag deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTags,
  getBadges,
  createTag,
  deleteTag,
};
