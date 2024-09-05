const express = require("express");
const { getNews } = require("../api/controllers/news");
const router = express.Router();

router.get("/news", getNews);

module.exports = router;
