const express = require("express");
const router = express.Router();
const cmsController = require("../controllers/cms.controller");

router.get("/banners", cmsController.getBanners);

module.exports = router;
