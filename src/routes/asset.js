const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { getSavedAssetData } = require("../api/controllers/asset");
const router = express.Router();

// GET /assets
// router.get("/assets", isLoggedIn, getSavedAssetData);
router.get("/assets", getSavedAssetData);

module.exports = router;
