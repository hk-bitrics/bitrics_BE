const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { getSavedAssetData } = require("../api/controllers/asset");
const router = express.Router();

router.get("/asset", isLoggedIn, getSavedAssetData);

module.exports = router;