const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const validate = require("../middlewares/validate.middleware");
const { addToCartSchema, updateCartItemSchema } = require("../validations/cart.validation");
const { verifyToken } = require("../middlewares/auth.middleware");

// All cart routes require authentication
router.use(verifyToken);

router.get("/", cartController.getCart);
router.post("/items", validate(addToCartSchema), cartController.addToCart);
router.post("/sync", cartController.syncCart);
router.patch("/items/:itemId", validate(updateCartItemSchema), cartController.updateCartItem);
router.delete("/items/:itemId", cartController.removeCartItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
