const express = require("express");
const { getIntegratedData } = require("../api/controllers/market");
const router = express.Router();

// GET /markets
router.get("/markets", getIntegratedData);

module.exports = router;
