// 風險分級配置 - 集中管理，易於未來調整
// Risk Classification Configuration - Centralized Management

export interface RiskClassificationConfig {
  low: {
    threshold: number // p < threshold
    label: string
    labelEn: string
    color: {
      background: string
      text: string
      border: string
    }
    interpretation: string
  }
  moderate: {
    threshold: number // threshold ≤ p < high.threshold
    label: string
    labelEn: string
    color: {
      background: string
      text: string
      border: string
    }
    interpretation: string
  }
  high: {
    threshold: number // p ≥ threshold
    label: string
    labelEn: string
    color: {
      background: string
      text: string
      border: string
    }
    interpretation: string
  }
}

// 風險分級配置（可於未來調整 cut-off 值）
export const RISK_CLASSIFICATION: RiskClassificationConfig = {
  low: {
    threshold: 0.10, // p < 0.10
    label: '低風險',
    labelEn: 'Low Risk',
    color: {
      background: '#f0f4f0', // 柔和灰綠
      text: '#4a6b4a',
      border: '#c8d8c8',
    },
    interpretation: '目前風險低，請依常規照護與觀察。',
  },
  moderate: {
    threshold: 0.30, // 0.10 ≤ p < 0.30
    label: '中等風險',
    labelEn: 'Moderate Risk',
    color: {
      background: '#fff4e6', // 柔和橘
      text: '#8b6f3f',
      border: '#e8d4b8',
    },
    interpretation: '建議提高臨床警覺，密切追蹤生命徵象與臨床變化。',
  },
  high: {
    threshold: 0.30, // p ≥ 0.30
    label: '高風險',
    labelEn: 'High Risk',
    color: {
      background: '#f8e8e8', // 穩定紅（非鮮紅）
      text: '#8b4a4a',
      border: '#e8c8c8',
    },
    interpretation: '顯示為高風險族群，建議優先評估與照護，考慮加強監測措施。',
  },
}

// 風險分級函數
export interface RiskClassificationResult {
  level: 'low' | 'moderate' | 'high'
  config: RiskClassificationConfig['low'] | RiskClassificationConfig['moderate'] | RiskClassificationConfig['high']
  probability: number
  probabilityPercent: string
}

/**
 * 根據機率值判斷風險分級
 * @param probability 風險機率 (0-1)
 * @returns 風險分級結果
 */
export function classifyRisk(probability: number): RiskClassificationResult {
  if (probability < RISK_CLASSIFICATION.low.threshold) {
    return {
      level: 'low',
      config: RISK_CLASSIFICATION.low,
      probability,
      probabilityPercent: (probability * 100).toFixed(1),
    }
  } else if (probability < RISK_CLASSIFICATION.moderate.threshold) {
    return {
      level: 'moderate',
      config: RISK_CLASSIFICATION.moderate,
      probability,
      probabilityPercent: (probability * 100).toFixed(1),
    }
  } else {
    return {
      level: 'high',
      config: RISK_CLASSIFICATION.high,
      probability,
      probabilityPercent: (probability * 100).toFixed(1),
    }
  }
}

/**
 * 風險分級說明文字（供 UI 顯示）
 */
export const RISK_CLASSIFICATION_DESCRIPTION = 
  '此風險分級來自多變項邏輯式回歸模型之預測結果，基於入院首日臨床資料進行風險評估。'

