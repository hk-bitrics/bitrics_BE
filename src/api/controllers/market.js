const {
  getAllMarkets,
  getMarketData,
  categorizeMarketData,
} = require("../services/market");

exports.getMarketData = async (req, res) => {
  try {
    const markets = await getAllMarkets();
    const data = await getMarketData(markets);
    const categorizedData = categorizeMarketData(data);
    res.status(200).json(categorizedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
