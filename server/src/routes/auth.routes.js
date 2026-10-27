const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
} = require("../validations/auth.validation");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// Protected routes
router.get("/me", verifyToken, authController.getMe);
router.put("/profile", verifyToken, validate(updateProfileSchema), authController.updateProfile);
router.post("/change-password", verifyToken, validate(changePasswordSchema), authController.changePassword);

router.get("/addresses", verifyToken, authController.getAddresses);
router.post("/addresses", verifyToken, validate(addressSchema), authController.addAddress);
router.put("/addresses/:id", verifyToken, validate(addressSchema), authController.updateAddress);
router.delete("/addresses/:id", verifyToken, authController.deleteAddress);

module.exports = router;
