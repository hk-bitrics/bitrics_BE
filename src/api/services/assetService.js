const axios = require("axios");
const uuidv4 = require("uuid");
const sign = require("jsonwebtoken").sign;
const { UpbitAccounts } = require("../../models");

const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;
const server_url = process.env.UPBIT_OPEN_API_SERVER_URL;

const getAuthToken = () => {
  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };
  return sign(payload, secret_key);
};

const getAssetData = async () => {
  const token = getAuthToken();
  const options = {
    method: "GET",
    url: `${server_url}/v1/accounts`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching account data: ${error.message}`);
  }
};

const removeUpbitAsset = async (userId) => {
  await UpbitAccounts.destroy({ where: { user_id: userId } });
};

const saveUpbitAssetData = async (userId, apiData) => {
  await Promise.all(
    apiData.map(async (account) => {
      await UpbitAccounts.upsert({
        currency: account.currency,
        balance: account.balance,
        locked: account.locked,
        avg_buy_price: account.avg_buy_price,
        unit_currency: account.unit_currency,
        user_id: userId,
      });
    })
  );
};

const getSavedUpbitAssetData = async (userId) => {
  return await UpbitAccounts.findAll({ where: { user_id: userId } });
};

const processUpbitAssets = async (userId) => {
  try {
    const apiData = await getAssetData();
    await removeUpbitAsset(userId);
    await saveUpbitAssetData(userId, apiData);
    return await getSavedUpbitAssetData(userId);
  } catch (error) {
    console.error(`Error processing Upbit assets: ${error.message}`);
    throw error;
  }
};

module.exports = { processUpbitAssets, getSavedUpbitAssetData };
