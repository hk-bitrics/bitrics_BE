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

  return {
    categorizedData: categorizeMarketData(data),
  };
};

const getCoinpaprikaData = async () => {
  try {
    const response = await axios.get(
      "https://api.coinpaprika.com/v1/tickers?quotes=USD,KRW"
    );

    const coinData = response.data.map((coin) => ({
      rank: coin.rank,
      name: coin.name,
      symbol: coin.symbol,
      marketCap: coin.quotes.KRW.market_cap,
      volume24h: coin.quotes.KRW.volume_24h,
      usdPrice: coin.quotes.USD.price,
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
    const btcResponse = await axios.get(
      "https://api.coinpaprika.com/v1/tickers/btc-bitcoin?quotes=USD,KRW"
    );

    return {
      usdToKrw: exchangeRateResponse.data.rates.KRW,
      marketCapUsd: btcDominanceResponse.data.market_cap_usd,
      volume24hUsd: btcDominanceResponse.data.volume_24h_usd,
      btcDominance: btcDominanceResponse.data.bitcoin_dominance_percentage,
      btcUsd: btcResponse.data.quotes.USD.price,
      btcKrw: btcResponse.data.quotes.KRW.price,
    };
  } catch (error) {
    throw new Error(`Error fetching additional data: ${error.message}`);
  }
};

const calculateKimchiPremium = (marketPriceKrw, marketPriceUsd, usdToKrw) => {
  const usdConvertedToKrw = marketPriceUsd * usdToKrw;
  return ((marketPriceKrw - usdConvertedToKrw) / usdConvertedToKrw) * 100;
};

const getIntegratedData = async () => {
  try {
    const { categorizedData } = await getUpbitMarketData();
    const coinpaprikaData = await getCoinpaprikaData();
    const additionalData = await getAdditionalData();

    const coinSymbolMap = coinpaprikaData.reduce((acc, coin) => {
      acc[coin.name] = coin.symbol;
      return acc;
    }, {});

    const coinUsdPrices = coinpaprikaData.reduce((acc, coin) => {
      acc[coin.symbol] = coin.usdPrice;
      return acc;
    }, {});

    const btcKrwKimchiPremium = calculateKimchiPremium(
      categorizedData.KRW.find((item) => item.englishName === "Bitcoin")
        .tradePrice,
      coinUsdPrices["BTC"],
      additionalData.usdToKrw
    );

    return {
      exchangeRate: {
        usdToKrw: additionalData.usdToKrw,
        marketCapUsd: additionalData.marketCapUsd,
        volume24hUsd: additionalData.volume24hUsd,
        btcDominance: additionalData.btcDominance,
        btcUsd: additionalData.btcUsd,
        btcKrwKimchiPremium: btcKrwKimchiPremium,
      },
      upbitData: {
        KRW: categorizedData.KRW.map((item) => ({
          market: item.market,
          koreanName: item.koreanName,
          englishName: item.englishName,
          tradePrice: item.tradePrice,
          kimchiPremium: calculateKimchiPremium(
            item.tradePrice,
            coinUsdPrices[coinSymbolMap[item.englishName]],
            additionalData.usdToKrw
          ),
          change: item.change,
          changePrice: item.changePrice,
          changeRate: item.changeRate,
          accTradePrice24h: item.accTradePrice24h,
        })),
        BTC: categorizedData.BTC.map((item) => ({
          market: item.market,
          koreanName: item.koreanName,
          englishName: item.englishName,
          tradePrice: item.tradePrice,
          change: item.change,
          changePrice: item.changePrice,
          changeRate: item.changeRate,
          accTradePrice24h: item.accTradePrice24h,
        })),
        USDT: categorizedData.USDT.map((item) => ({
          market: item.market,
          koreanName: item.koreanName,
          englishName: item.englishName,
          tradePrice: item.tradePrice,
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
