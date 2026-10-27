const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const validate = require("../middlewares/validate.middleware");
const {
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  updateStockSchema,
  createProductSchema,
} = require("../validations/admin.validation");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

// All admin routes require token authentication and ADMIN role
router.use(verifyToken, requireAdmin);

router.get("/dashboard/stats", adminController.getDashboardStats);

router.get("/orders", adminController.getAdminOrders);
router.patch("/orders/:id/status", validate(updateOrderStatusSchema), adminController.updateOrderStatus);
router.patch("/orders/:id/payment", validate(updatePaymentStatusSchema), adminController.updatePaymentStatus);

router.get("/inventory", adminController.getInventory);
router.patch("/inventory/:variantId", validate(updateStockSchema), adminController.updateStock);

router.get("/customers", adminController.getCustomers);
router.patch("/customers/:id", adminController.updateCustomer);
router.delete("/customers/:id", adminController.deleteCustomer);

router.post("/products", validate(createProductSchema), adminController.createProduct);
router.delete("/products/:id", adminController.deleteProduct);

// Category & Subcategory Management
router.post("/categories", adminController.createCategory);
router.patch("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// Tag Management
router.post("/tags", adminController.createTag);
router.delete("/tags/:id", adminController.deleteTag);

// Badge Management
router.post("/badges", adminController.createBadge);
router.delete("/badges/:id", adminController.deleteBadge);

// CMS Banners Management
router.get("/cms/banners", adminController.getBanners);
router.post("/cms/banners", adminController.createBanner);
router.delete("/cms/banners/:id", adminController.deleteBanner);

// Cloudinary Image Upload Route
router.use("/upload", require("./upload.routes"));

module.exports = router;
