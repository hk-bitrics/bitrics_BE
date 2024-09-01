const axios = require("axios");

const getAllMarkets = async () => {
  try {
    const response = await axios.get(
      "https://api.upbit.com/v1/market/all?isDetails=false"
    );
    return response.data.map((item) => item.market);
  } catch (error) {
    throw new Error(`Error fetching markets: ${error.message}`);
  }
};

const getMarketData = (markets) => {
  const url = `https://api.upbit.com/v1/ticker?markets=${markets.join(",")}`;

  return axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const processedData = data.map((item) => ({
        market: item.market,
        tradePrice: item.trade_price,
        change: item.change,
        changePrice: item.change_price,
        changeRate: item.change_rate,
        highPrice: item.high_price,
        lowPrice: item.low_price,
        accTradePrice24h: item.acc_trade_price_24h,
      }));

      return processedData;
    })
    .catch((error) => {
      throw new Error(`Error fetching market data: ${error.message}`);
    });
};

const categorizeMarketData = (data) => {
  const categorizedData = {
    KRW: [],
    BTC: [],
    USDT: [],
  };

  data.forEach((item) => {
    const marketType = item.market.split("-")[0];

    if (categorizedData[marketType]) {
      categorizedData[marketType].push(item);
    }
  });

  return categorizedData;
};

const run = async () => {
  try {
    const markets = await getAllMarkets();
    const marketData = await getMarketData(markets);
    const categorizedData = categorizeMarketData(marketData);
    return categorizedData;
  } catch (error) {
    console.error(error.message);
  }
};

run();

module.exports = { getAllMarkets, getMarketData, categorizeMarketData };
