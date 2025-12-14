'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllPatients, deletePatient, PatientData } from '@/lib/patientStorage'

// 馬卡龍色調配色
const colors = {
  background: 'linear-gradient(135deg, #ffeef8 0%, #e8f4f8 100%)',
  card: '#ffffff',
  cardBorder: 'rgba(255, 182, 193, 0.3)',
  titleBg: 'linear-gradient(135deg, #ffb6c1 0%, #87ceeb 100%)',
  lowRisk: '#d4edda',
  mediumRisk: '#fff3cd',
  highRisk: '#f8d7da',
  button: 'linear-gradient(135deg, #c8a2c8 0%, #a8c8e8 100%)',
  textPrimary: '#6b4c6b',
  textSecondary: '#8b7a8b',
  deleteButton: '#ff6b9d',
}

export default function WardPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<PatientData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = () => {
    const allPatients = getAllPatients()
    // 按更新時間排序，最新的在前
    allPatients.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    setPatients(allPatients)
    setIsLoading(false)
  }

  const handleDelete = (patientId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('確定要刪除此病人的資料嗎？')) {
      deletePatient(patientId)
      loadPatients()
    }
  }

  const handleViewDetail = (patient: PatientData) => {
    // 將病人資料存到 sessionStorage，然後跳轉到 dashboard
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ihca_result', JSON.stringify(patient.result))
    }
    router.push('/dashboard')
  }

  const getRiskColor = (probability?: number) => {
    if (!probability) return colors.mediumRisk
    if (probability < 0.3) return colors.lowRisk
    if (probability < 0.7) return colors.mediumRisk
    return colors.highRisk
  }

  const getRiskLevelText = (probability?: number) => {
    if (!probability) return '未知'
    if (probability < 0.3) return '低風險'
    if (probability < 0.7) return '中風險'
    return '高風險'
  }

  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return '未知時間'
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-TW', {
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 標題區 */}
        <div style={styles.header}>
          <h1 style={styles.title}>病房電子看板</h1>
          <p style={styles.subtitle}>非預期心臟驟停風險監控</p>
        </div>

        {/* 統計資訊 */}
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{patients.length}</div>
            <div style={styles.statLabel}>總病人數</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>
              {patients.filter(p => (p.result.probability || 0) >= 0.7).length}
            </div>
            <div style={styles.statLabel}>高風險</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>
              {patients.filter(p => {
                const prob = p.result.probability || 0
                return prob >= 0.3 && prob < 0.7
              }).length}
            </div>
            <div style={styles.statLabel}>中風險</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>
              {patients.filter(p => (p.result.probability || 0) < 0.3).length}
            </div>
            <div style={styles.statLabel}>低風險</div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div style={styles.actionBar}>
          <button
            onClick={() => router.push('/input')}
            style={styles.addButton}
          >
            ➕ 新增病人評估
          </button>
          <button
            onClick={loadPatients}
            style={styles.refreshButton}
          >
            🔄 重新整理
          </button>
        </div>

        {/* 病人卡片列表 */}
        {patients.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🏥</div>
            <p style={styles.emptyText}>目前沒有病人資料</p>
            <button
              onClick={() => router.push('/input')}
              style={styles.addButton}
            >
              新增第一個病人評估
            </button>
          </div>
        ) : (
          <div style={styles.patientGrid} className="patient-grid">
            {patients.map((patient) => {
              const probability = patient.result.probability || 0
              const riskColor = getRiskColor(probability)
              const riskLevelText = getRiskLevelText(probability)

              return (
                <div
                  key={patient.id}
                  className="patient-card"
                  style={{
                    ...styles.patientCard,
                    backgroundColor: riskColor,
                    borderColor: riskColor,
                  }}
                  onClick={() => handleViewDetail(patient)}
                >
                  {/* 卡片標題 */}
                  <div style={styles.cardHeader}>
                    <div style={styles.patientInfo}>
                      <div style={styles.patientName}>
                        {patient.name || '未命名病人'}
                      </div>
                      {patient.bedNumber && (
                        <div style={styles.bedNumber}>
                          病床：{patient.bedNumber}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(patient.id, e)}
                      style={styles.deleteButton}
                      className="delete-button-ward"
                      title="刪除"
                      aria-label="刪除病人"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 風險機率 */}
                  <div style={styles.riskDisplay}>
                    <div style={styles.riskPercentage}>
                      {(probability * 100).toFixed(1)}%
                    </div>
                    <div style={styles.riskLevel}>{riskLevelText}</div>
                  </div>

                  {/* 快速資訊 */}
                  <div style={styles.quickInfo}>
                    {patient.result.inputData && (
                      <>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>年齡：</span>
                          <span style={styles.infoValue}>
                            {patient.result.inputData.Age || 'N/A'} 歲
                          </span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>性別：</span>
                          <span style={styles.infoValue}>
                            {patient.result.inputData.Sex === 1
                              ? '男'
                              : patient.result.inputData.Sex === 0
                              ? '女'
                              : 'N/A'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 時間戳記 */}
                  <div style={styles.timestamp}>
                    更新：{formatDateTime(patient.updatedAt)}
                  </div>

                  {/* 點擊提示 */}
                  <div style={styles.clickHint}>
                    點擊查看詳細資料 →
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 免責聲明 */}
        <div style={styles.disclaimer}>
          <p style={styles.disclaimerText}>
            <strong>免責聲明：</strong>
            此為研究/臨床輔助工具，非醫囑。計算結果僅供參考，不應作為臨床決策的唯一依據。
          </p>
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
    background: colors.background,
  },
  card: {
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    backgroundColor: colors.card,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(255, 182, 193, 0.2)',
    border: `1px solid ${colors.cardBorder}`,
  },
  loadingCard: {
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
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
    fontSize: '32px',
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
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  statItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    border: `1px solid ${colors.cardBorder}`,
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  actionBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  addButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: colors.button,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(200, 162, 200, 0.3)',
  },
  refreshButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    backgroundColor: '#ffffff',
    border: `2px solid ${colors.cardBorder}`,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  patientGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  patientCard: {
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '12px',
    minHeight: 0,
  },
  patientInfo: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  patientName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: '4px',
  },
  bedNumber: {
    fontSize: '14px',
    color: colors.textSecondary,
  },
  deleteButton: {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    minHeight: '28px',
    maxWidth: '28px',
    maxHeight: '28px',
    borderRadius: '50%',
    backgroundColor: colors.deleteButton,
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    padding: '0',
    margin: '0',
    lineHeight: '1',
    textAlign: 'center' as const,
    position: 'relative',
    overflow: 'hidden',
    // 確保在 iPhone 上保持圓形
    aspectRatio: '1 / 1',
  },
  riskDisplay: {
    textAlign: 'center',
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
  },
  riskPercentage: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: '4px',
  },
  riskLevel: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  infoLabel: {
    color: colors.textSecondary,
  },
  infoValue: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: '12px',
    color: colors.textSecondary,
    marginBottom: '8px',
  },
  clickHint: {
    fontSize: '12px',
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '8px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '18px',
    color: colors.textSecondary,
    marginBottom: '24px',
  },
  disclaimer: {
    padding: '16px',
    backgroundColor: colors.mediumRisk,
    border: `1.5px solid #ffd700`,
    borderRadius: '8px',
    marginTop: '24px',
  },
  disclaimerText: {
    fontSize: '13px',
    color: '#8b6914',
    margin: 0,
    lineHeight: '1.6',
  },
}

