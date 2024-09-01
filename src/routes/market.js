const express = require("express");
const { getMarketData } = require("../api/controllers/market");
const router = express.Router();

// GET
/**
 * @swagger
 * tags:
 *   name: Market
 *   description: Market data operations
 */

/**
 * @swagger
 * /markets:
 *   get:
 *     summary: Retrieve and categorize market data
 *     description: Fetches market data and categorizes it by market type (KRW, BTC, USDT).
 *     tags: [Market]
 *     responses:
 *       200:
 *         description: Successful response with categorized market data
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
 *                         example: "KRW-BTC"
 *                       koreanName:
 *                         type: string
 *                         example: "비트코인"
 *                       englishName:
 *                         type: string
 *                         example: "Bitcoin"
 *                       tradePrice:
 *                         type: number
 *                         format: float
 *                         example: 79264000
 *                       change:
 *                         type: string
 *                         example: "FALL"
 *                       changePrice:
 *                         type: number
 *                         format: float
 *                         example: 998000
 *                       changeRate:
 *                         type: number
 *                         format: float
 *                         example: 0.0124342777
 *                       highPrice:
 *                         type: number
 *                         format: float
 *                         example: 80370000
 *                       lowPrice:
 *                         type: number
 *                         format: float
 *                         example: 79010000
 *                       accTradePrice24h:
 *                         type: number
 *                         format: float
 *                         example: 118221746267.25134
 *                 BTC:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       market:
 *                         type: string
 *                         example: "BTC-ETH"
 *                       koreanName:
 *                         type: string
 *                         example: "이더리움"
 *                       englishName:
 *                         type: string
 *                         example: "Ethereum"
 *                       tradePrice:
 *                         type: number
 *                         format: float
 *                         example: 0.04261715
 *                       change:
 *                         type: string
 *                         example: "RISE"
 *                       changePrice:
 *                         type: number
 *                         format: float
 *                         example: 0.00020996
 *                       changeRate:
 *                         type: number
 *                         format: float
 *                         example: 0.0049510472
 *                       highPrice:
 *                         type: number
 *                         format: float
 *                         example: 0.04277092
 *                       lowPrice:
 *                         type: number
 *                         format: float
 *                         example: 0.04211948
 *                       accTradePrice24h:
 *                         type: number
 *                         format: float
 *                         example: 0.68990957
 *                 USDT:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       market:
 *                         type: string
 *                         example: "USDT-GAS"
 *                       koreanName:
 *                         type: string
 *                         example: "가스"
 *                       englishName:
 *                         type: string
 *                         example: "Gas"
 *                       tradePrice:
 *                         type: number
 *                         format: float
 *                         example: 3.375
 *                       change:
 *                         type: string
 *                         example: "FALL"
 *                       changePrice:
 *                         type: number
 *                         format: float
 *                         example: 0.005
 *                       changeRate:
 *                         type: number
 *                         format: float
 *                         example: 0.0015
 *                       highPrice:
 *                         type: number
 *                         format: float
 *                         example: 3.500
 *                       lowPrice:
 *                         type: number
 *                         format: float
 *                         example: 3.300
 *                       accTradePrice24h:
 *                         type: number
 *                         format: float
 *                         example: 35000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching market data: [error message]"
 */
router.get("/markets", getMarketData);

module.exports = router;
