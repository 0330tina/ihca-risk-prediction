'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// 馬卡龍色調配色（與輸入頁面一致）
const colors = {
  background: 'linear-gradient(135deg, #ffeef8 0%, #e8f4f8 100%)',
  card: '#ffffff',
  cardBorder: 'rgba(255, 182, 193, 0.3)',
  titleBg: 'linear-gradient(135deg, #ffb6c1 0%, #87ceeb 100%)',
  resultCard: '#fff0f5',
  resultCardBorder: 'rgba(255, 182, 193, 0.5)',
  button: 'linear-gradient(135deg, #c8a2c8 0%, #a8c8e8 100%)',
  lowRisk: '#d4edda',
  mediumRisk: '#fff3cd',
  highRisk: '#f8d7da',
  textPrimary: '#6b4c6b',
  textSecondary: '#8b7a8b',
  disclaimerBorder: '#ffd700',
}

interface ResultData {
  logit?: number
  probability?: number
  riskLevel?: string
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

  // 根據風險機率判斷風險等級顏色
  const getRiskColor = (probability?: number) => {
    if (!probability) return colors.mediumRisk
    if (probability < 0.3) return colors.lowRisk
    if (probability < 0.7) return colors.mediumRisk
    return colors.highRisk
  }

  // 根據風險機率判斷風險等級文字
  const getRiskLevelText = (probability?: number) => {
    if (!probability) return '未知'
    if (probability < 0.3) return '低風險'
    if (probability < 0.7) return '中風險'
    return '高風險'
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
  const riskColor = getRiskColor(probability)
  const riskLevelText = result.riskLevel || getRiskLevelText(probability)

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 標題區 */}
        <div style={styles.header}>
          <h1 style={styles.title}>風險預測結果</h1>
          <p style={styles.subtitle}>非預期心跳驟停風險評估</p>
        </div>

        {/* 主要結果卡片 */}
        <div style={{ ...styles.resultCard, backgroundColor: riskColor }}>
          <div style={styles.resultHeader}>
            <h2 style={styles.resultTitle}>預測風險機率</h2>
            <div style={styles.probabilityCircle}>
              <div style={styles.probabilityValue}>
                {(probability * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div style={styles.riskLevelBadge}>
            <span style={styles.riskLevelText}>{riskLevelText}</span>
          </div>

          <div style={styles.resultDetails}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Logit 值：</span>
              <span style={styles.detailValue}>{result.logit?.toFixed(4) || 'N/A'}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>計算時間：</span>
              <span style={styles.detailValue}>{formatDateTime(result.timestamp)}</span>
            </div>
          </div>
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
          <p style={styles.disclaimerText}>
            <strong>免責聲明：</strong>
            此為研究/臨床輔助工具，非醫囑。計算結果僅供參考，不應作為臨床決策的唯一依據。
            請結合臨床專業判斷使用。
          </p>
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
    border: `2px solid ${colors.resultCardBorder}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
    display: 'inline-block',
    padding: '8px 24px',
    borderRadius: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  riskLevelText: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '20px',
    borderTop: `1px solid ${colors.cardBorder}`,
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
  disclaimer: {
    padding: '16px',
    backgroundColor: colors.mediumRisk,
    border: `1.5px solid ${colors.disclaimerBorder}`,
    borderRadius: '8px',
    marginBottom: '24px',
  },
  disclaimerText: {
    fontSize: '13px',
    color: '#8b6914',
    margin: 0,
    lineHeight: '1.6',
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

