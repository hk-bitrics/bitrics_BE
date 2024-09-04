const { getAllAtmLocations } = require("../services/map");

exports.getAtmLocations = async (req, res) => {
  try {
    const locations = await getAllAtmLocations();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};
