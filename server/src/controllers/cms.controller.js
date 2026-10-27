const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get all banners (Hero & Sub Banners)
// @route   GET /api/v1/cms/banners
// @access  Public/Admin
const getBanners = async (req, res, next) => {
  try {
    const { type, all } = req.query; // 'HERO' or 'SUB_BANNER'
    const where = {};
    if (req.user?.role !== "ADMIN" && all !== "true") {
      where.isActive = true;
    }
    if (type) {
      where.type = type.toUpperCase();
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return ApiResponse.success(res, banners, "Banners retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new banner (Hero or Sub Banner)
// @route   POST /api/v1/admin/cms/banners
// @access  Private/Admin
const createBanner = async (req, res, next) => {
  try {
    const { title, script, tagline, image, alt, link, type, sortOrder } = req.body;

    const banner = await prisma.banner.create({
      data: {
        title,
        script,
        tagline,
        image,
        alt,
        link,
        type: type || "HERO",
        sortOrder: sortOrder || 0,
      },
    });

    return ApiResponse.created(res, banner, "Banner created successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/v1/admin/cms/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw ApiError.notFound("Banner not found");
    }

    await prisma.banner.delete({ where: { id } });

    return ApiResponse.success(res, null, "Banner deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  createBanner,
  deleteBanner,
};
