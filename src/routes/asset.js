const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { getSavedAssetData } = require("../api/controllers/asset");
const router = express.Router();

// GET /assets
router.get("/assets", isLoggedIn, getSavedAssetData);

module.exports = router;
