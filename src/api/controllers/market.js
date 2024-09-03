const { getIntegratedData } = require("../services/market");

exports.getMarketInfo = async (req, res) => {
  try {
    const data = await getIntegratedData();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
