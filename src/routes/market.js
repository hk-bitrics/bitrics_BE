const express = require("express");
const { getMarketData } = require("../api/controllers/market");
const router = express.Router();

// GET
/**
 * @swagger
 * /api/markets:
 *   get:
 *     summary: Get market data
 *     description: Retrieve a list of market data
 *     tags: [Market]
 *     responses:
 *       200:
 *         description: A list of market data categorized by currency.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 KRW:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       market:
 *                         type: string
 *                         description: The market symbol.
 *                         example: KRW-BTC
 *                       tradePrice:
 *                         type: number
 *                         description: The latest trading price.
 *                         example: 79264000
 *                       change:
 *                         type: string
 *                         description: The change direction (RISE or FALL).
 *                         example: FALL
 *                       changePrice:
 *                         type: number
 *                         description: The amount of price change.
 *                         example: 998000
 *                       changeRate:
 *                         type: number
 *                         description: The rate of price change.
 *                         example: 0.0124342777
 *                       highPrice:
 *                         type: number
 *                         description: The highest price in the last 24 hours.
 *                         example: 80370000
 *                       lowPrice:
 *                         type: number
 *                         description: The lowest price in the last 24 hours.
 *                         example: 79010000
 *                       accTradePrice24h:
 *                         type: number
 *                         description: The accumulated trading price in the last 24 hours.
 *                         example: 118221746267.25134
 *       500:
 *         description: Server error
 */
router.get("/market-data", getMarketData);

module.exports = router;
