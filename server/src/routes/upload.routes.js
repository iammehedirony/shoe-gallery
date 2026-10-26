const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const upload = require("../middlewares/upload.middleware");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

// Protected Admin Upload Route (Supports single or multiple up to 10 images with field name 'images')
router.post("/", verifyToken, requireAdmin, upload.array("images", 10), uploadController.uploadImages);

module.exports = router;
