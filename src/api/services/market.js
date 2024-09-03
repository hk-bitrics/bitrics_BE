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

const getUpbitMarketData = async () => {
  const markets = await getAllMarkets();
  const data = await getMarketData(markets);

  const btcUsdtMarket = data.find((item) => item.market === "USDT-BTC");
  return {
    categorizedData: categorizeMarketData(data),
    btcUsdtPrice: btcUsdtMarket ? btcUsdtMarket.tradePrice : null,
  };
};

const getCoinpaprikaData = async () => {
  try {
    const response = await axios.get(
      "https://api.coinpaprika.com/v1/tickers?quotes=KRW"
    );

    const coinData = response.data.map((coin) => ({
      rank: coin.rank,
      name: coin.name,
      symbol: coin.symbol,
      marketCap: coin.quotes.KRW.market_cap,
      volume24h: coin.quotes.KRW.volume_24h,
    }));

    return coinData;
  } catch (error) {
    console.error(`Error fetching coin data: ${error.message}`);
  }
};

const getAdditionalData = async () => {
  try {
    const exchangeRateResponse = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const btcDominanceResponse = await axios.get(
      "https://api.coinpaprika.com/v1/global"
    );
    const fearGreedIndexResponse = await axios.get(
      "https://api.alternative.me/fng/"
    );

    return {
      usdToKrw: exchangeRateResponse.data.rates.KRW,
      btcDominance: btcDominanceResponse.data.bitcoin_dominance_percentage,
      fearGreedIndex: fearGreedIndexResponse.data.value,
    };
  } catch (error) {
    throw new Error(`Error fetching additional data: ${error.message}`);
  }
};

const calculateKimchiPremium = (btcKrw, btcUsdt, usdToKrw) => {
  const btcUsdConverted = btcUsdt * usdToKrw;
  return ((btcKrw - btcUsdConverted) / btcUsdConverted) * 100;
};

const getIntegratedData = async () => {
  try {
    const { categorizedData, btcUsdtPrice } = await getUpbitMarketData();
    const coinpaprikaData = await getCoinpaprikaData();
    const additionalData = await getAdditionalData();

    return {
      exchangeRate: {
        usdToKrw: additionalData.usdToKrw,
        btcDominance: additionalData.btcDominance,
        fearGreedIndex: additionalData.fearGreedIndex,
      },
      upbitData: {
        KRW: categorizedData.KRW.map((item) => ({
          koreanName: item.koreanName,
          englishName: item.englishName,
          tradePrice: item.tradePrice,
          kimchiPremium: calculateKimchiPremium(
            item.tradePrice,
            btcUsdtPrice,
            additionalData.usdToKrw
          ),
          change: item.change,
          changePrice: item.changePrice,
          changeRate: item.changeRate,
          accTradePrice24h: item.accTradePrice24h,
        })),
        BTC: categorizedData.BTC.map((item) => ({
          koreanName: item.koreanName,
          englishName: item.englishName,
          tradePrice: item.tradePrice,
          kimchiPremium: calculateKimchiPremium(
            item.tradePrice,
            btcUsdtPrice,
            additionalData.usdToKrw
          ),
          change: item.change,
          changePrice: item.changePrice,
          changeRate: item.changeRate,
          accTradePrice24h: item.accTradePrice24h,
        })),
        USDT: categorizedData.USDT.map((item) => ({
          koreanName: item.koreanName,
          englishName: item.englishName,
          tradePrice: item.tradePrice,
          kimchiPremium: calculateKimchiPremium(
            item.tradePrice,
            btcUsdtPrice,
            additionalData.usdToKrw
          ),
          change: item.change,
          changePrice: item.changePrice,
          changeRate: item.changeRate,
          accTradePrice24h: item.accTradePrice24h,
        })),
      },
      coinpaprikaData: coinpaprikaData.map((coin) => ({
        rank: coin.rank,
        name: coin.name,
        symbol: coin.symbol,
        marketCap: coin.marketCap,
        volume24h: coin.volume24h,
      })),
    };
  } catch (error) {
    throw new Error(`Error fetching integrated data: ${error.message}`);
  }
};

module.exports = {
  getIntegratedData,
};
