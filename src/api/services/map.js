const { VcAtmLoc } = require("../../models");

const getAllAtmLocations = async () => {
  try {
    return await VcAtmLoc.findAll();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllAtmLocations };
