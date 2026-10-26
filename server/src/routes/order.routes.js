const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const validate = require("../middlewares/validate.middleware");
const { checkoutSchema, calculateShippingSchema } = require("../validations/order.validation");
const { verifyToken, optionalAuth } = require("../middlewares/auth.middleware");

router.post("/calculate-shipping", validate(calculateShippingSchema), orderController.calculateShipping);
router.post("/checkout", optionalAuth, validate(checkoutSchema), orderController.createOrder);

router.get("/my-orders", verifyToken, orderController.getMyOrders);
router.get("/:identifier", orderController.getOrderDetails);

module.exports = router;
