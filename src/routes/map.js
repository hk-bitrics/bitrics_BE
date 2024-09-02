const express = require("express");
const { getAtmLocations } = require("../api/controllers/map");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Map
 *   description: Operations related to ATM locations
 */

/**
 * @swagger
 * /map:
 *   get:
 *     summary: Retrieve ATM locations
 *     description: Fetches all ATM locations from the database.
 *     tags: [Map]
 *     responses:
 *       200:
 *         description: Successful response with ATM locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   atm_id:
 *                     type: integer
 *                     example: 1
 *                   city:
 *                     type: string
 *                     example: "Seoul"
 *                   lat:
 *                     type: number
 *                     format: float
 *                     example: 37.5665
 *                   lon:
 *                     type: number
 *                     format: float
 *                     example: 126.978
 *                   buy_sell:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching ATM locations: [error message]"
 */
router.get("/map", getAtmLocations);

module.exports = router;
