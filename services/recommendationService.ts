import { v4 as uuidv4 } from 'uuid';

// Types for recommendation system
export type RecommendationCategory = 'buy' | 'sell' | 'hold' | 'dca' | 'alert';
export type RecommendationStatus = 'active' | 'completed' | 'expired' | 'dismissed';
export type RecommendationSource = 'technical_analysis' | 'fear_greed_index' | 'price_action' | 'ai_generated';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: RecommendationCategory;
  status: RecommendationStatus;
  riskLevel: RiskLevel;
  dateCreated: string;
  expiryDate?: string;
  source: RecommendationSource;
  confidence: number; // 0-100
  potentialImpact: number; // 1-10
  relatedMetrics?: {
    metric: string;
    value: number;
    significance: string;
  }[];
  aiAnalysis?: string;
}

/**
 * Generate recommendations based on market data
 */
export const generateRecommendations = (
  bitcoinData: any,
  fearGreedIndex: any,
  tradingSignals: any,
): Recommendation[] => {
  try {
    const recommendations: Recommendation[] = [];
    const now = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(now.getDate() + 14);
    
    // Generate recommendation based on Fear & Greed index
    if (fearGreedIndex && fearGreedIndex.value !== undefined) {
      let recommendation: Partial<Recommendation> | null = null;
      
      if (fearGreedIndex.value <= 25) {  // Extreme Fear
        recommendation = {
          title: 'Extreme Fear: Consider Buying Opportunity',
          description: 'Market sentiment is showing extreme fear. Historically, this has often represented a good buying opportunity.',
          category: 'buy',
          riskLevel: 'medium',
          source: 'fear_greed_index',
          confidence: 75,
          potentialImpact: 7,
          relatedMetrics: [
            { metric: 'Fear & Greed Index', value: fearGreedIndex.value, significance: 'Primary indicator' }
          ]
        };
      } else if (fearGreedIndex.value >= 75) {  // Extreme Greed
        recommendation = {
          title: 'Extreme Greed: Consider Taking Profits',
          description: 'Market sentiment is showing extreme greed. This may indicate the market is due for a correction.',
          category: 'sell',
          riskLevel: 'medium',
          source: 'fear_greed_index',
          confidence: 70,
          potentialImpact: 6,
          relatedMetrics: [
            { metric: 'Fear & Greed Index', value: fearGreedIndex.value, significance: 'Primary indicator' }
          ]
        };
      }
      
      if (recommendation) {
        recommendations.push({
          ...recommendation,
          id: uuidv4(),
          status: 'active',
          dateCreated: now.toISOString(),
          expiryDate: twoWeeksFromNow.toISOString()
        } as Recommendation);
      }
    }
    
    // Generate recommendation based on TradingView signals
    if (tradingSignals && tradingSignals.summary) {
      let recommendation: Partial<Recommendation> | null = null;
      const { recommendation: tvRecommendation } = tradingSignals.summary;
      
      if (tvRecommendation === 'STRONG_BUY') {
        recommendation = {
          title: 'Strong Buy Signal from Technical Indicators',
          description: 'Multiple technical indicators are aligned suggesting a strong buy opportunity.',
          category: 'buy',
          riskLevel: 'medium',
          source: 'technical_analysis',
          confidence: 80,
          potentialImpact: 8,
          relatedMetrics: [
            { metric: 'TradingView Signal', value: 5, significance: 'Primary indicator' },
            { metric: 'Oscillators', value: tradingSignals.oscillators.buy, significance: 'Supporting data' },
            { metric: 'Moving Averages', value: tradingSignals.movingAverages.buy, significance: 'Supporting data' }
          ]
        };
      } else if (tvRecommendation === 'STRONG_SELL') {
        recommendation = {
          title: 'Strong Sell Signal from Technical Indicators',
          description: 'Multiple technical indicators are aligned suggesting a strong sell opportunity.',
          category: 'sell',
          riskLevel: 'medium',
          source: 'technical_analysis',
          confidence: 80,
          potentialImpact: 8,
          relatedMetrics: [
            { metric: 'TradingView Signal', value: 1, significance: 'Primary indicator' },
            { metric: 'Oscillators', value: tradingSignals.oscillators.sell, significance: 'Supporting data' },
            { metric: 'Moving Averages', value: tradingSignals.movingAverages.sell, significance: 'Supporting data' }
          ]
        };
      }
      
      if (recommendation) {
        recommendations.push({
          ...recommendation,
          id: uuidv4(),
          status: 'active',
          dateCreated: now.toISOString(),
          expiryDate: twoWeeksFromNow.toISOString()
        } as Recommendation);
      }
    }
    
    // Price action based recommendation
    if (bitcoinData && bitcoinData.priceChange24h !== undefined) {
      let recommendation: Partial<Recommendation> | null = null;
      
      // Major price drop (>10%)
      if (bitcoinData.priceChange24h <= -10) {
        recommendation = {
          title: 'Significant Price Drop: Potential Entry Point',
          description: `Bitcoin has dropped ${Math.abs(bitcoinData.priceChange24h).toFixed(2)}% in the last 24 hours, which may present a buying opportunity for long-term investors.`,
          category: 'buy',
          riskLevel: 'high',
          source: 'price_action',
          confidence: 65,
          potentialImpact: 8,
          relatedMetrics: [
            { metric: '24h Price Change', value: bitcoinData.priceChange24h, significance: 'Primary indicator' },
            { metric: 'Current Price', value: bitcoinData.price, significance: 'Current value' }
          ]
        };
      }
      // Major price increase (>10%)
      else if (bitcoinData.priceChange24h >= 10) {
        recommendation = {
          title: 'Significant Price Increase: Consider Taking Profits',
          description: `Bitcoin has risen ${bitcoinData.priceChange24h.toFixed(2)}% in the last 24 hours. Consider taking partial profits if you're overexposed.`,
          category: 'sell',
          riskLevel: 'medium',
          source: 'price_action',
          confidence: 70,
          potentialImpact: 7,
          relatedMetrics: [
            { metric: '24h Price Change', value: bitcoinData.priceChange24h, significance: 'Primary indicator' },
            { metric: 'Current Price', value: bitcoinData.price, significance: 'Current value' }
          ]
        };
      }
      // Stable price (-2% to 2%)
      else if (bitcoinData.priceChange24h >= -2 && bitcoinData.priceChange24h <= 2) {
        recommendation = {
          title: 'Stable Price: Continue Dollar-Cost Averaging',
          description: 'Bitcoin price has been relatively stable in the last 24 hours. Consider continuing your regular DCA strategy.',
          category: 'dca',
          riskLevel: 'low',
          source: 'price_action',
          confidence: 75,
          potentialImpact: 5,
          relatedMetrics: [
            { metric: '24h Price Change', value: bitcoinData.priceChange24h, significance: 'Primary indicator' },
            { metric: 'Current Price', value: bitcoinData.price, significance: 'Current value' }
          ]
        };
      }
      
      if (recommendation) {
        recommendations.push({
          ...recommendation,
          id: uuidv4(),
          status: 'active',
          dateCreated: now.toISOString(),
          expiryDate: twoWeeksFromNow.toISOString()
        } as Recommendation);
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

/**
 * Generate AI analysis based on market data
 */
export const generateAIAnalysis = (
  bitcoinData: any, 
  fearGreedIndex: any,
  tradingSignals: any,
  userRiskProfile: string = 'moderate'
): string => {
  try {
    // Price trend determination
    const priceDirection = bitcoinData.priceChange24h >= 0 ? 'upward' : 'downward';
    const priceMagnitude = Math.abs(bitcoinData.priceChange24h) > 5 ? 'significant' : 'moderate';
    
    // Fear & Greed interpretation
    let sentimentAnalysis = '';
    if (fearGreedIndex.value <= 25) {
      sentimentAnalysis = 'extremely fearful, which has historically presented buying opportunities';
    } else if (fearGreedIndex.value <= 40) {
      sentimentAnalysis = 'fearful, suggesting potential value entry points';
    } else if (fearGreedIndex.value <= 60) {
      sentimentAnalysis = 'neutral, indicating a balanced market';
    } else if (fearGreedIndex.value <= 75) {
      sentimentAnalysis = 'greedy, suggesting caution may be warranted';
    } else {
      sentimentAnalysis = 'extremely greedy, which has historically preceded corrections';
    }
    
    // Technical analysis summary
    const technicalOutlook = tradingSignals.summary.recommendation.toLowerCase();
    
    // Risk-based recommendation
    let strategyAdvice = '';
    if (userRiskProfile === 'conservative') {
      if (fearGreedIndex.value <= 30 && tradingSignals.summary.recommendation === 'STRONG_BUY') {
        strategyAdvice = 'Consider a modest increase in your DCA amount (5-10%) to take advantage of current conditions while maintaining your conservative approach.';
      } else if (fearGreedIndex.value >= 70 && tradingSignals.summary.recommendation === 'STRONG_SELL') {
        strategyAdvice = 'Consider slightly reducing exposure or setting aside some funds for potential future buying opportunities.';
      } else {
        strategyAdvice = 'Maintain your regular DCA schedule and conservative allocation strategy.';
      }
    } else if (userRiskProfile === 'moderate') {
      if (fearGreedIndex.value <= 30 && tradingSignals.summary.recommendation === 'STRONG_BUY') {
        strategyAdvice = 'Consider increasing your bitcoin allocation by 10-15% to capitalize on the current market sentiment and technical signals.';
      } else if (fearGreedIndex.value >= 70 && tradingSignals.summary.recommendation === 'STRONG_SELL') {
        strategyAdvice = 'Consider taking some profits (10-15% of position) while maintaining your core holdings.';
      } else {
        strategyAdvice = 'Continue your balanced approach with regular investments and periodic rebalancing.';
      }
    } else { // aggressive
      if (fearGreedIndex.value <= 30 && tradingSignals.summary.recommendation === 'STRONG_BUY') {
        strategyAdvice = 'Consider a significant position increase (15-25%) as current conditions align with an aggressive buying opportunity.';
      } else if (fearGreedIndex.value >= 70 && tradingSignals.summary.recommendation === 'STRONG_SELL') {
        strategyAdvice = 'Consider taking partial profits while preparing for potential high-volatility trading opportunities in the near future.';
      } else {
        strategyAdvice = 'Maintain your aggressive stance but watch technical indicators closely for short-term trading opportunities.';
      }
    }
    
    // Combine into a complete analysis
    return `
Market Analysis: Bitcoin is showing a ${priceMagnitude} ${priceDirection} trend at $${bitcoinData.price.toLocaleString()}, with a ${bitcoinData.priceChange24h.toFixed(2)}% change in the last 24 hours. Market sentiment is ${sentimentAnalysis}, while technical indicators are giving a ${technicalOutlook} signal.

Strategy Recommendation: Based on your ${userRiskProfile} risk profile, ${strategyAdvice}

Outlook: The combination of ${fearGreedIndex.valueText} market sentiment and ${technicalOutlook} technical signals suggests a ${fearGreedIndex.value < 50 ? 'potentially favorable' : 'cautiously optimistic'} short-term outlook for bitcoin. Key resistance levels to watch are $${(bitcoinData.price * 1.05).toFixed(0)} and $${(bitcoinData.price * 1.1).toFixed(0)}, with support at $${(bitcoinData.price * 0.95).toFixed(0)}.
    `.trim();
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return "Unable to generate analysis due to insufficient data.";
  }
};