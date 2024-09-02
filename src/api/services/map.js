const VcAtmLoc = require("../../models/vcAtmLoc");

const getAllAtmLocations = async () => {
  try {
    return await VcAtmLoc.findAll();
  } catch (error) {
    throw new Error(`Error fetching ATM locations: ${error.message}`);
  }
};

module.exports = { getAllAtmLocations };
