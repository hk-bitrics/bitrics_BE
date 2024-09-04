const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { getAssetData } = require("../api/controllers/asset");
// const { getSavedAssetData } = require("../api/controllers/asset");
const router = express.Router();

// GET /assets
// router.get("/assets", isLoggedIn, getSavedAssetData);
router.get("/assets", getAssetData);

module.exports = router;
