const { VcAtmLoc } = require("../../models");

const getAllAtmLocations = async () => {
  try {
    return await VcAtmLoc.findAll();
  } catch (error) {
    throw new Error(`Error fetching ATM locations: ${error.message}`);
  }
};

module.exports = { getAllAtmLocations };
