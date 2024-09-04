const express = require("express");
const { getMarketInfo } = require("../api/controllers/market");
const router = express.Router();

// GET /markets
router.get("/markets", getMarketInfo);

module.exports = router;
