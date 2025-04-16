import axios from 'axios';

// Types for trading signals
export interface TradingSignals {
  summary: {
    recommendation: string;
    score: number;
  };
  oscillators: {
    recommendation: string;
    buy: number;
    neutral: number;
    sell: number;
  };
  movingAverages: {
    recommendation: string;
    buy: number;
    neutral: number;
    sell: number;
  };
  calculatedAt: string;
}

/**
 * Generates trading signals similar to TradingView
 * Note: In a real app, this would call a trading API like TradingView
 */
export const generateTradingSignals = async (): Promise<TradingSignals> => {
  try {
    // In a production app, you would call a real API
    // For demo purposes, we'll simulate technical analysis
    
    // Generate random but realistic-looking signal data
    const generateRandomDistribution = (bias: 'buy' | 'neutral' | 'sell') => {
      let buy = Math.floor(Math.random() * 7); // 0-6
      let neutral = Math.floor(Math.random() * 7); // 0-6
      let sell = Math.floor(Math.random() * 7); // 0-6
      
      // Add bias to one category
      if (bias === 'buy') buy += 10;
      else if (bias === 'neutral') neutral += 10;
      else sell += 10;
      
      const total = buy + neutral + sell;
      
      // Normalize to ensure they sum to 17 (like TradingView's 17 indicators)
      buy = Math.round(buy * 17 / total);
      neutral = Math.round(neutral * 17 / total);
      sell = 17 - buy - neutral;
      
      return { buy, neutral, sell };
    };
    
    // Decide overall market bias randomly
    const biases: Array<'buy' | 'neutral' | 'sell'> = ['buy', 'neutral', 'sell'];
    const marketBias = biases[Math.floor(Math.random() * biases.length)];
    
    // Generate oscillator distribution with a slight negative bias (oscillators often counter trend)
    const oscillatorBias = marketBias === 'buy' ? 'neutral' : 
                           marketBias === 'sell' ? 'neutral' : 'buy';
    const oscillatorDistribution = generateRandomDistribution(oscillatorBias);
    
    // Generate moving average distribution with bias (MAs often follow trend)
    const maDistribution = generateRandomDistribution(marketBias);
    
    // Determine recommendations based on distribution
    const getRecommendation = (dist: {buy: number, neutral: number, sell: number}) => {
      if (dist.buy > dist.sell * 2 && dist.buy > dist.neutral) return 'STRONG_BUY';
      if (dist.buy > dist.sell && dist.buy > dist.neutral) return 'BUY';
      if (dist.sell > dist.buy * 2 && dist.sell > dist.neutral) return 'STRONG_SELL';
      if (dist.sell > dist.buy && dist.sell > dist.neutral) return 'SELL';
      return 'NEUTRAL';
    };
    
    const oscillatorRecommendation = getRecommendation(oscillatorDistribution);
    const maRecommendation = getRecommendation(maDistribution);
    
    // Calculate overall score (0-100, where 0 = Strong Sell, 100 = Strong Buy)
    const totalBuy = oscillatorDistribution.buy + maDistribution.buy;
    const totalSell = oscillatorDistribution.sell + maDistribution.sell;
    const totalIndicators = 34; // 17 oscillators + 17 moving averages
    const score = Math.round((totalBuy / totalIndicators) * 100);
    
    // Determine overall recommendation
    let summaryRecommendation;
    if (score <= 20) summaryRecommendation = 'STRONG_SELL';
    else if (score <= 40) summaryRecommendation = 'SELL';
    else if (score <= 60) summaryRecommendation = 'NEUTRAL';
    else if (score <= 80) summaryRecommendation = 'BUY';
    else summaryRecommendation = 'STRONG_BUY';
    
    return {
      summary: {
        recommendation: summaryRecommendation,
        score,
      },
      oscillators: {
        recommendation: oscillatorRecommendation,
        ...oscillatorDistribution,
      },
      movingAverages: {
        recommendation: maRecommendation,
        ...maDistribution,
      },
      calculatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating trading signals:', error);
    
    // Return fallback data
    return {
      summary: {
        recommendation: 'NEUTRAL',
        score: 50,
      },
      oscillators: {
        recommendation: 'NEUTRAL',
        buy: 5,
        neutral: 6,
        sell: 6,
      },
      movingAverages: {
        recommendation: 'NEUTRAL',
        buy: 6,
        neutral: 5,
        sell: 6,
      },
      calculatedAt: new Date().toISOString(),
    };
  }
};