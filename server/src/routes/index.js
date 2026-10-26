const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const cartRoutes = require("./cart.routes");
const orderRoutes = require("./order.routes");
const adminRoutes = require("./admin.routes");

router.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "JH Shoe Gallery API is operational",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
