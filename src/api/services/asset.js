const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { UpbitAccounts } = require("../../models");

const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
const server_url = process.env.UPBIT_OPEN_API_SERVER_URL;

const getAuthToken = () => {
  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };
  return jwt.sign(payload, secret_key);
};

const getAssetData = async () => {
  try {
    const token = getAuthToken();
    const options = {
      method: "GET",
      url: `${server_url}/v1/accounts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios(options);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching account data: ${error.message}`);
  }
};

// const removeSaveAssetData = async (userId) => {
//   try {
//     const apiData = await getAssetData();
//     await UpbitAccounts.destroy({ where: { user_id: userId } });
//     await UpbitAccounts.bulkCreate(
//       apiData.map((account) => ({
//         currency: account.currency,
//         balance: account.balance,
//         locked: account.locked,
//         avg_buy_price: account.avg_buy_price,
//         unit_currency: account.unit_currency,
//         user_id: userId,
//       }))
//     );
//   } catch (error) {
//     throw new Error(`Error saving account data: ${error.message}`);
//   }
// };

// const getSavedAssetData = async (userId) => {
//   try {
//     const accounts = await UpbitAccounts.findAll({
//       where: { user_id: userId },
//     });
//     return accounts;
//   } catch (error) {
//     throw new Error(`Error fetching saved asset data: ${error.message}`);
//   }
// };

module.exports = { getAssetData };
