const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const validate = require("../middlewares/validate.middleware");
const { productQuerySchema } = require("../validations/product.validation");

router.get("/", validate(productQuerySchema), productController.getProducts);
router.get("/categories", productController.getCategories);
router.get("/tags", productController.getTags);
router.get("/badges", productController.getBadges);
router.get("/cms/banners", require("../controllers/cms.controller").getBanners);
router.get("/:identifier", productController.getProductByIdOrSlug);

module.exports = router;
