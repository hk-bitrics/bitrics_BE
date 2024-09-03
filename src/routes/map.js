const express = require("express");
const { getAtmLocations } = require("../api/controllers/map");
const router = express.Router();

router.get("/map", getAtmLocations);

module.exports = router;
