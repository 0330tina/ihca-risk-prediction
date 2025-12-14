import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '48px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '16px',
        }}>
          非預期心跳驟停風險預測
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '32px',
        }}>
          入院首日邏輯式回歸計算工具
        </p>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <Link
            href="/input"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#1976d2',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
          >
            開始輸入資料
          </Link>
          <Link
            href="/ward"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#c8a2c8',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
          >
            病房看板
          </Link>
        </div>
      </div>
    </div>
  )
}

