import axios from 'axios';

// Types
export interface BitcoinData {
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  lastUpdated: string;
}

/**
 * Fetches real-time Bitcoin data from CoinGecko
 */
export const fetchBitcoinData = async (): Promise<BitcoinData> => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
    );
    
    const data = response.data;
    
    return {
      price: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_24h_in_currency.usd,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      circulatingSupply: data.market_data.circulating_supply,
      lastUpdated: data.last_updated
    };
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    // Return fallback data
    return {
      price: 60000,
      priceChange24h: 1200,
      priceChangePercentage24h: 2.0,
      marketCap: 1200000000000,
      volume24h: 50000000000,
      circulatingSupply: 19000000,
      lastUpdated: new Date().toISOString()
    };
  }
};

/**
 * Gets Fear & Greed index (from alternative.me API)
 */
export const fetchFearGreedIndex = async (): Promise<{value: number, valueText: string}> => {
  try {
    const response = await axios.get('https://api.alternative.me/fng/');
    const data = response.data;
    
    return {
      value: parseInt(data.data[0].value),
      valueText: data.data[0].value_classification
    };
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    // Return fallback data
    return {
      value: 50, 
      valueText: 'Neutral'
    };
  }
};