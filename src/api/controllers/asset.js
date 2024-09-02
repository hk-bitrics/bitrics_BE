const { getAssetData, getSavedAssetData } = require("../services/asset");

exports.getSavedAssetData = async (req, res) => {
  try {
    const userId = req.user.user_id;
    await getAssetData(userId);
    const data = await getSavedAssetData(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
