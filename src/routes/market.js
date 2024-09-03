const express = require("express");
const { getMarketInfo } = require("../api/controllers/market");
const router = express.Router();

// GET /market
router.get("/market", getMarketInfo);

module.exports = router;
