import Link from 'next/link'

export default function HomePage() {
  // 學術風格配色 - 馬卡龍色調但更沉穩
  const colors = {
    background: 'linear-gradient(135deg, #f5f0ff 0%, #e8f4f8 50%, #fff5f0 100%)',
    card: '#ffffff',
    cardBorder: 'rgba(200, 162, 200, 0.2)',
    primary: '#6b4c6b',
    secondary: '#8b7a8b',
    accent: '#a8c8e8',
    riskFactor: '#e8b4b8',
    protectiveFactor: '#b8e8d1',
    textPrimary: '#2c3e50',
    textSecondary: '#5a6c7d',
    divider: '#e0e0e0',
    button: 'linear-gradient(135deg, #a8c8e8 0%, #c8a2c8 100%)',
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: colors.background,
      padding: '24px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '48px',
      padding: '32px 0',
    },
    title: {
      fontSize: 'clamp(24px, 4vw, 36px)',
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: '12px',
      letterSpacing: '0.5px',
    },
    subtitle: {
      fontSize: 'clamp(14px, 2vw, 18px)',
      color: colors.textSecondary,
      fontWeight: '400',
      marginBottom: '8px',
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '24px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colors.cardBorder}`,
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: colors.primary,
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: `2px solid ${colors.divider}`,
    },
    sectionText: {
      fontSize: '15px',
      lineHeight: '1.8',
      color: colors.textSecondary,
      marginBottom: '16px',
    },
    modelInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginTop: '20px',
    },
    modelCard: {
      padding: '16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: `1px solid ${colors.divider}`,
    },
    modelLabel: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginBottom: '8px',
      fontWeight: '500',
    },
    modelValue: {
      fontSize: '16px',
      color: colors.primary,
      fontWeight: '600',
    },
    factorsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    factorCard: {
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid',
    },
    factorTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    factorList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    factorItem: {
      padding: '10px 0',
      borderBottom: `1px solid ${colors.divider}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    factorName: {
      fontSize: '14px',
      color: colors.textPrimary,
      flex: 1,
    },
    factorOR: {
      fontSize: '15px',
      fontWeight: '600',
      padding: '4px 12px',
      borderRadius: '4px',
      minWidth: '60px',
      textAlign: 'center' as const,
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    stepCard: {
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: `1px solid ${colors.divider}`,
      textAlign: 'center' as const,
    },
    stepNumber: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: colors.button,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: '600',
      margin: '0 auto 12px',
    },
    stepText: {
      fontSize: '14px',
      color: colors.textPrimary,
      lineHeight: '1.6',
    },
    disclaimer: {
      backgroundColor: '#fff9e6',
      border: '1px solid #ffd700',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '24px',
    },
    disclaimerTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: '12px',
    },
    disclaimerText: {
      fontSize: '13px',
      lineHeight: '1.8',
      color: colors.textSecondary,
      marginBottom: '8px',
    },
    actionButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
      marginTop: '32px',
      paddingTop: '32px',
      borderTop: `1px solid ${colors.divider}`,
    },
    button: {
      display: 'inline-block',
      padding: '14px 32px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      background: colors.button,
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* 頁首 */}
        <header style={styles.header}>
          <h1 style={styles.title}>
            非預期心臟驟停風險預測系統
          </h1>
          <p style={styles.subtitle}>
            In-Hospital Cardiac Arrest (IHCA) Risk Prediction
          </p>
          <p style={{ ...styles.subtitle, fontSize: 'clamp(12px, 1.5vw, 15px)', marginTop: '8px' }}>
            入院首日邏輯式回歸模型 | Logistic Regression Model
          </p>
        </header>

        {/* 研究背景 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>研究背景</h2>
          <p style={styles.sectionText}>
            非預期心臟驟停（In-Hospital Cardiac Arrest, IHCA）是住院病人最嚴重的併發症之一。
            本研究旨在建立一個入院首日風險預測模型，協助臨床醫師早期識別高風險病人，
            並提供適當的監測與處置建議。
          </p>
          <p style={styles.sectionText}>
            本模型採用多變項邏輯式回歸分析（Multivariable Logistic Regression），
            整合病人基本資料、病史、生命徵象及檢驗數據，計算入院首日發生 IHCA 的風險機率。
          </p>
        </section>

        {/* 模型簡介 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>模型方法</h2>
          <div style={styles.modelInfo}>
            <div style={styles.modelCard}>
              <div style={styles.modelLabel}>分析方法</div>
              <div style={styles.modelValue}>邏輯式回歸</div>
            </div>
            <div style={styles.modelCard}>
              <div style={styles.modelLabel}>分析類型</div>
              <div style={styles.modelValue}>多變項分析</div>
            </div>
            <div style={styles.modelCard}>
              <div style={styles.modelLabel}>預測時點</div>
              <div style={styles.modelValue}>入院首日</div>
            </div>
            <div style={styles.modelCard}>
              <div style={styles.modelLabel}>預測目標</div>
              <div style={styles.modelValue}>IHCA 發生風險</div>
            </div>
          </div>
          <p style={{ ...styles.sectionText, marginTop: '20px', fontSize: '14px', fontStyle: 'italic' }}>
            模型包含 15 個預測變項，涵蓋基本資料、病史、生命徵象及檢驗數據。
            所有變項均經過統計檢定，僅納入統計顯著（p &lt; 0.05）的因子。
          </p>
        </section>

        {/* 顯著因子 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>統計顯著因子（p &lt; 0.05）</h2>
          <div style={styles.factorsGrid}>
            {/* 風險因子 */}
            <div style={{
              ...styles.factorCard,
              backgroundColor: '#fff5f5',
              borderColor: colors.riskFactor,
            }}>
              <div style={{ ...styles.factorTitle, color: '#c85a5a' }}>
                <span>⚠️</span>
                <span>風險因子</span>
              </div>
              <ul style={styles.factorList}>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>肋膜積水</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.riskFactor, color: '#ffffff' }}>
                    OR 1.91
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>心衰竭病史</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.riskFactor, color: '#ffffff' }}>
                    OR 1.64
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>血鉀</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.riskFactor, color: '#ffffff' }}>
                    OR 1.44
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>心肌梗塞病史</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.riskFactor, color: '#ffffff' }}>
                    OR 1.34
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>性別（男性）</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.riskFactor, color: '#ffffff' }}>
                    OR 1.27
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>年齡（每 10 歲）</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.riskFactor, color: '#ffffff' }}>
                    OR 1.12
                  </span>
                </li>
              </ul>
            </div>

            {/* 保護因子 */}
            <div style={{
              ...styles.factorCard,
              backgroundColor: '#f0fff4',
              borderColor: colors.protectiveFactor,
            }}>
              <div style={{ ...styles.factorTitle, color: '#2d8659' }}>
                <span>🛡️</span>
                <span>保護因子</span>
              </div>
              <ul style={styles.factorList}>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>白蛋白</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.protectiveFactor, color: '#ffffff' }}>
                    OR 0.60
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>血紅素</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.protectiveFactor, color: '#ffffff' }}>
                    OR 0.80
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>體溫</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.protectiveFactor, color: '#ffffff' }}>
                    OR 0.86
                  </span>
                </li>
                <li style={styles.factorItem}>
                  <span style={styles.factorName}>血氧飽和度</span>
                  <span style={{ ...styles.factorOR, backgroundColor: colors.protectiveFactor, color: '#ffffff' }}>
                    OR 0.96
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p style={{ ...styles.sectionText, marginTop: '20px', fontSize: '13px', color: colors.textSecondary }}>
            OR = Odds Ratio（勝算比）。OR &gt; 1 表示風險因子，OR &lt; 1 表示保護因子。
          </p>
        </section>

        {/* 使用流程 */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>使用流程</h2>
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepText}>
                輸入病人基本資料、病史、生命徵象及檢驗數據
              </div>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepText}>
                系統自動計算風險機率與風險等級
              </div>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepText}>
                檢視詳細預測結果與風險因子分析
              </div>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>4</div>
              <div style={styles.stepText}>
                於病房看板管理多位病人風險狀態
              </div>
            </div>
          </div>
        </section>

        {/* 免責聲明 */}
        <section style={styles.disclaimer}>
          <h3 style={styles.disclaimerTitle}>⚠️ 醫療免責與研究聲明</h3>
          <p style={styles.disclaimerText}>
            <strong>研究性質：</strong>本系統為學術研究工具，非醫療設備，計算結果僅供臨床參考使用。
          </p>
          <p style={styles.disclaimerText}>
            <strong>臨床決策：</strong>預測結果不應作為臨床決策的唯一依據。
            所有醫療處置應由臨床醫師根據完整臨床評估、專業判斷及臨床指引進行。
          </p>
          <p style={styles.disclaimerText}>
            <strong>研究用途：</strong>本模型基於歷史資料建立，預測準確性可能因不同族群、機構或時間而異。
            使用本系統進行研究時，應遵循相關倫理規範與資料保護法規。
          </p>
          <p style={styles.disclaimerText}>
            <strong>責任聲明：</strong>本系統開發者與提供者不對任何臨床決策或醫療結果承擔責任。
            使用者應自行評估模型適用性，並對臨床決策負完全責任。
          </p>
        </section>

        {/* 操作按鈕 */}
        <div style={styles.actionButtons}>
          <Link href="/input" style={styles.button}>
            開始使用系統
          </Link>
          <Link href="/ward" style={styles.button}>
            查看病房看板
          </Link>
        </div>
      </div>
    </div>
  )
}

