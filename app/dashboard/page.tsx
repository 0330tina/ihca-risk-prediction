'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { classifyRisk, RISK_CLASSIFICATION_DESCRIPTION, type RiskClassificationResult } from '@/lib/riskClassification'

// 馬卡龍色調配色（與輸入頁面一致）
const colors = {
  background: 'linear-gradient(135deg, #ffeef8 0%, #e8f4f8 100%)',
  card: '#ffffff',
  cardBorder: 'rgba(255, 182, 193, 0.3)',
  titleBg: 'linear-gradient(135deg, #ffb6c1 0%, #87ceeb 100%)',
  button: 'linear-gradient(135deg, #c8a2c8 0%, #a8c8e8 100%)',
  textPrimary: '#6b4c6b',
  textSecondary: '#8b7a8b',
  disclaimerBg: '#fff9e6',
  disclaimerBorder: '#e8d4a0',
}

interface ResultData {
  logit?: number
  probability?: number
  riskLevel?: string
  riskLevelEn?: string
  riskLevelKey?: 'low' | 'moderate' | 'high'
  timestamp?: string
  inputData?: any
}

export default function DashboardPage() {
  const router = useRouter()
  const [result, setResult] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 從 sessionStorage 讀取結果
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('ihca_result')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setResult(parsed)
        } catch (e) {
          console.error('Failed to parse result:', e)
          router.push('/input')
        }
      } else {
        // 如果沒有結果，導回輸入頁
        router.push('/input')
      }
      setIsLoading(false)
    }
  }, [router])

  // 使用集中管理的風險分級邏輯
  const getRiskClassification = (probability?: number): RiskClassificationResult | null => {
    if (probability === undefined || probability === null) return null
    return classifyRisk(probability)
  }

  // 格式化日期時間
  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return '未知時間'
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return '未知時間'
    }
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}>載入中...</div>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const probability = result.probability || 0
  const riskClassification = getRiskClassification(probability)
  
  // 如果沒有風險分級結果，顯示錯誤
  if (!riskClassification) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.errorMessage}>
            <p>無法讀取風險預測結果，請重新計算。</p>
            <button
              onClick={() => router.push('/input')}
              style={styles.primaryButton}
            >
              返回輸入頁面
            </button>
          </div>
        </div>
      </div>
    )
  }

  const riskConfig = riskClassification.config
  const riskLevelText = result.riskLevel || riskConfig.label
  const riskLevelEn = result.riskLevelEn || riskConfig.labelEn

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 標題區 */}
        <div style={styles.header}>
          <h1 style={styles.title}>風險預測結果</h1>
          <p style={styles.subtitle}>非預期心臟驟停風險評估</p>
        </div>

        {/* 主要結果卡片 */}
        <div style={{
          ...styles.resultCard,
          backgroundColor: riskConfig.color.background,
          borderColor: riskConfig.color.border,
        }}>
          <div style={styles.resultHeader}>
            <h2 style={styles.resultTitle}>預測風險機率</h2>
            <div style={styles.probabilityCircle}>
              <div style={{
                ...styles.probabilityValue,
                color: riskConfig.color.text,
              }}>
                {riskClassification.probabilityPercent}%
              </div>
            </div>
          </div>
          
          {/* 風險分級標籤 */}
          <div style={{
            ...styles.riskLevelBadge,
            backgroundColor: riskConfig.color.background,
            borderColor: riskConfig.color.border,
          }}>
            <span style={{
              ...styles.riskLevelText,
              color: riskConfig.color.text,
            }}>
              {riskLevelText}
            </span>
            {riskLevelEn && (
              <span style={{
                ...styles.riskLevelTextEn,
                color: riskConfig.color.text,
              }}>
                {riskLevelEn}
              </span>
            )}
          </div>

          {/* 臨床解讀 */}
          <div style={styles.interpretationBox}>
            <div style={{
              ...styles.interpretationIcon,
              color: riskConfig.color.text,
            }}>
              ℹ️
            </div>
            <div style={styles.interpretationText}>
              <div style={styles.interpretationTitle}>臨床解讀</div>
              <div style={{
                ...styles.interpretationContent,
                color: riskConfig.color.text,
              }}>
                {riskConfig.interpretation}
              </div>
            </div>
          </div>

          {/* 模型說明 */}
          <div style={styles.modelDescription}>
            <p style={styles.modelDescriptionText}>
              {RISK_CLASSIFICATION_DESCRIPTION}
            </p>
          </div>

          {/* 進階資訊（可折疊） */}
          <details style={styles.advancedInfo}>
            <summary style={styles.advancedInfoSummary}>
              進階資訊（供研究人員參考）
            </summary>
            <div style={styles.advancedInfoContent}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Logit 值：</span>
                <span style={styles.detailValue}>{result.logit?.toFixed(4) || 'N/A'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>計算時間：</span>
                <span style={styles.detailValue}>{formatDateTime(result.timestamp)}</span>
              </div>
            </div>
          </details>
        </div>

        {/* 輸入資料摘要（可選） */}
        {result.inputData && (
          <div style={styles.inputSummary}>
            <h3 style={styles.summaryTitle}>輸入資料摘要</h3>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>年齡：</span>
                <span style={styles.summaryValue}>{result.inputData.Age || 'N/A'} 歲</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>性別：</span>
                <span style={styles.summaryValue}>{result.inputData.Sex === 1 ? '男' : result.inputData.Sex === 0 ? '女' : 'N/A'}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>體溫：</span>
                <span style={styles.summaryValue}>{result.inputData.Temp__01_1 || 'N/A'} °C</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>收縮壓：</span>
                <span style={styles.summaryValue}>{result.inputData.Sp_01_1 || 'N/A'} mmHg</span>
              </div>
            </div>
          </div>
        )}

        {/* 免責聲明 */}
        <div style={styles.disclaimer}>
          <div style={styles.disclaimerHeader}>
            <span style={styles.disclaimerIcon}>⚠️</span>
            <strong style={styles.disclaimerTitle}>醫療免責與研究聲明</strong>
          </div>
          <div style={styles.disclaimerContent}>
            <p style={styles.disclaimerText}>
              <strong>研究性質：</strong>本系統為學術研究工具，非醫療設備，計算結果僅供臨床參考使用。
            </p>
            <p style={styles.disclaimerText}>
              <strong>臨床決策：</strong>預測結果不應作為臨床決策的唯一依據。
              所有醫療處置應由臨床醫師根據完整臨床評估、專業判斷及臨床指引進行。
            </p>
            <p style={styles.disclaimerText}>
              <strong>責任聲明：</strong>本系統開發者與提供者不對任何臨床決策或醫療結果承擔責任。
              使用者應自行評估模型適用性，並對臨床決策負完全責任。
            </p>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => router.push('/input')}
            style={styles.primaryButton}
          >
            重新計算
          </button>
          <button
            onClick={() => router.push('/ward')}
            style={styles.secondaryButton}
          >
            病房看板
          </button>
          <button
            onClick={() => router.push('/')}
            style={styles.secondaryButton}
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  )
}

// 樣式定義
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: colors.background,
  },
  card: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: colors.card,
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(255, 182, 193, 0.2)',
    border: `1px solid ${colors.cardBorder}`,
  },
  loadingCard: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: colors.card,
    borderRadius: '16px',
    padding: '60px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(255, 182, 193, 0.2)',
  },
  loadingSpinner: {
    fontSize: '18px',
    color: colors.textPrimary,
  },
  header: {
    background: colors.titleBg,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  subtitle: {
    fontSize: '16px',
    color: '#ffffff',
    opacity: 0.95,
    margin: 0,
  },
  resultCard: {
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
    border: '2px solid',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  resultHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  resultTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '16px',
  },
  probabilityCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginBottom: '16px',
  },
  probabilityValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  riskLevelBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 24px',
    borderRadius: '20px',
    border: '1px solid',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    marginBottom: '24px',
  },
  riskLevelText: {
    fontSize: '20px',
    fontWeight: '600',
  },
  riskLevelTextEn: {
    fontSize: '14px',
    fontWeight: '400',
    opacity: 0.8,
  },
  interpretationBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  interpretationIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  interpretationText: {
    flex: 1,
  },
  interpretationTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: colors.textPrimary,
  },
  interpretationContent: {
    fontSize: '15px',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  modelDescription: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  modelDescriptionText: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: colors.textSecondary,
    margin: 0,
    fontStyle: 'italic',
  },
  advancedInfo: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: `1px solid ${colors.cardBorder}`,
  },
  advancedInfoSummary: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textSecondary,
    cursor: 'pointer',
    userSelect: 'none' as const,
    padding: '8px 0',
  },
  advancedInfoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '12px',
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: '14px',
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '16px',
    color: colors.textPrimary,
    fontWeight: '600',
  },
  inputSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: `1px solid ${colors.cardBorder}`,
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '16px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryLabel: {
    fontSize: '12px',
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: '14px',
    color: colors.textPrimary,
    fontWeight: '500',
  },
  errorMessage: {
    textAlign: 'center' as const,
    padding: '40px',
  },
  disclaimer: {
    padding: '20px',
    backgroundColor: colors.disclaimerBg,
    border: `1.5px solid ${colors.disclaimerBorder}`,
    borderRadius: '8px',
    marginBottom: '24px',
  },
  disclaimerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  disclaimerIcon: {
    fontSize: '18px',
  },
  disclaimerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  disclaimerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  disclaimerText: {
    fontSize: '13px',
    color: colors.textSecondary,
    margin: 0,
    lineHeight: '1.7',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: colors.button,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(200, 162, 200, 0.3)',
    minWidth: '140px',
  },
  secondaryButton: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    backgroundColor: '#ffffff',
    border: `2px solid ${colors.cardBorder}`,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    minWidth: '140px',
  },
}

