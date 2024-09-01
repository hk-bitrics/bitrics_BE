const axios = require("axios");

const getAllMarkets = async () => {
  try {
    const response = await axios.get(
      "https://api.upbit.com/v1/market/all?isDetails=false"
    );
    return response.data.map((item) => ({
      market: item.market,
      koreanName: item.korean_name,
      englishName: item.english_name,
    }));
  } catch (error) {
    throw new Error(`Error fetching markets: ${error.message}`);
  }
};

const getMarketData = async (markets) => {
  const marketCodes = markets.map((item) => item.market);
  const url = `https://api.upbit.com/v1/ticker?markets=${marketCodes.join(
    ","
  )}`;
  try {
    const response = await axios.get(url);
    const marketData = response.data;
    return marketData.map((item) => {
      const marketInfo = markets.find(
        (market) => market.market === item.market
      );
      return {
        market: item.market,
        koreanName: marketInfo.koreanName,
        englishName: marketInfo.englishName,
        tradePrice: item.trade_price,
        change: item.change,
        changePrice: item.change_price,
        changeRate: item.change_rate,
        highPrice: item.high_price,
        lowPrice: item.low_price,
        accTradePrice24h: item.acc_trade_price_24h,
      };
    });
  } catch (error) {
    throw new Error(`Error fetching market data: ${error.message}`);
  }
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

module.exports = { getAllMarkets, getMarketData, categorizeMarketData };
