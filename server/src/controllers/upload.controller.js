const { uploadToCloudinary } = require("../config/cloudinary");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// @desc    Upload multiple or single images to Cloudinary
// @route   POST /api/v1/admin/upload
// @access  Private/Admin
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest("No image files uploaded");
    }

    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer, "jh-shoe-gallery"));
    const uploadResults = await Promise.all(uploadPromises);

    const uploadedUrls = uploadResults.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    return ApiResponse.success(
      res,
      {
        count: uploadedUrls.length,
        images: uploadedUrls,
      },
      "Images uploaded successfully to Cloudinary"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImages,
};
