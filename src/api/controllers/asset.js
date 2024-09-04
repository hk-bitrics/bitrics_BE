// const { getAssetData } = require("../services/asset");
const { removeSaveAssetData, getSavedAssetData } = require("../services/asset");

exports.getSavedAssetData = async (req, res) => {
  try {
    console.log(req.user.user_id);
    const userId = req.user.user_id;
    await removeSaveAssetData(userId);
    const data = await getSavedAssetData(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

// TEST 용
// exports.getAssetData = async (req, res) => {
//   try {
//     const data = await getAssetData();
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//     console.error(error);
//   }
// };
