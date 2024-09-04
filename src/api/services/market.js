const axios = require("axios");

// 모든 시장 데이터
const getAllMarkets = async () => {
  try {
    const response = await axios.get(
      "https://api.upbit.com/v1/market/all?isDetails=false"
    );

    // 시장(ex. KRW-BTC), 한국어 이름(ex. 비트코인), 영어 이름(Bitcoin)
    return response.data.map((item) => ({
      market: item.market,
      koreanName: item.korean_name,
      englishName: item.english_name,
    }));
  } catch (error) {
    throw new Error(`Error fetching markets: ${error.message}`);
  }
};

// 특정 시장 데이터
const getMarketData = async (markets) => {
  // 모든 시장 데이터에서 시장
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

// 시장 데이터 카테고리별(KRW, BTC, USDT) 분류
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
  // 모든 시장 데이터
  const markets = await getAllMarkets();
  // 특정 시장 데이터
  const data = await getMarketData(markets);

  // 특정 시장 -> 카테고리별 분류
  return {
    categorizedData: categorizeMarketData(data),
  };
};

const getCoinpaprikaData = async () => {
  try {
    const response = await axios.get(
      "https://api.coinpaprika.com/v1/tickers?quotes=USD,KRW"
    );

    // 순위, 이름(ex. Bitcoin), 심볼(ex. BTC), 시가 총액(KRW), 24시간 거래량(KRW), 가격(USD)
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

    // 환율(USD/KRW), 시가 총액(USD), 거래량(USD), BTC 점유율, BTC 가격(USD), BTC 가격(KRW)
    return {
      usdToKrw: exchangeRateResponse.data.rates.KRW,
      marketCapUsd: btcDominanceResponse.data.market_cap_usd,
      marketCapChange24h: btcDominanceResponse.data.market_cap_change_24h,
      volume24hUsd: btcDominanceResponse.data.volume_24h_usd,
      volume24hChange24h: btcDominanceResponse.data.volume_24h_change_24h,
      btcDominance: btcDominanceResponse.data.bitcoin_dominance_percentage,
      btcUsd: btcResponse.data.quotes.USD.price,
      btcUsdpercentChange24h:
        btcResponse.data.quotes.USD.btcUsdpercent_change_24h,
      btcKrw: btcResponse.data.quotes.KRW.price,
    };
  } catch (error) {
    throw new Error(`Error fetching additional data: ${error.message}`);
  }
};

// 김프(김치프리미엄)
const calculateKimchiPremium = (marketPriceKrw, marketPriceUsd, usdToKrw) => {
  const usdConvertedToKrw = marketPriceUsd * usdToKrw;
  return ((marketPriceKrw - usdConvertedToKrw) / usdConvertedToKrw) * 100;
};

// 반환
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
        marketCapChange24h: additionalData.marketCapChange24h,
        volume24hUsd: additionalData.volume24hUsd,
        volume24hChange24h: additionalData.volume24hChange24h,
        btcDominance: additionalData.btcDominance,
        btcUsd: additionalData.btcUsd,
        btcUsdpercentChange24h: additionalData.btcUsdpercentChange24h,
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
