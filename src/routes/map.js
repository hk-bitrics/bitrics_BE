const express = require("express");
const { getAtmLocations } = require("../api/controllers/map");
const router = express.Router();

// GET /map
router.get("/map", getAtmLocations);

module.exports = router;
