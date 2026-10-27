const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const validate = require("../middlewares/validate.middleware");
const { productQuerySchema, reviewSchema } = require("../validations/product.validation");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", validate(productQuerySchema), productController.getProducts);
router.get("/categories", productController.getCategories);
router.get("/tags", productController.getTags);
router.get("/badges", productController.getBadges);
router.get("/cms/banners", require("../controllers/cms.controller").getBanners);
router.get("/:identifier", productController.getProductByIdOrSlug);
router.post("/:id/reviews", verifyToken, validate(reviewSchema), productController.addReview);

module.exports = router;
