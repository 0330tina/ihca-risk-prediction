'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { savePatient, createPatientFromResult } from '@/lib/patientStorage'

// 表單欄位定義
interface FieldConfig {
  key: string
  label: string
  unit?: string
  placeholder?: string
  type: 'number' | 'select' | 'radio'
  min?: number
  max?: number
  required: boolean
  options?: { label: string; value: number }[]
  helperText?: string
}

const fieldConfigs: FieldConfig[] = [
  // 基本資料
  {
    key: 'Age',
    label: '年齡',
    unit: '歲',
    placeholder: '請輸入年齡',
    type: 'number',
    min: 0,
    max: 120,
    required: true,
  },
  {
    key: 'Sex',
    label: '性別',
    type: 'radio',
    required: true,
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 0 },
    ],
  },
  // 病史（二元）
  {
    key: 'pleuraleffusion',
    label: '肋膜積水',
    type: 'radio',
    required: true,
    options: [
      { label: '有', value: 1 },
      { label: '無', value: 0 },
    ],
  },
  {
    key: 'MI',
    label: '心肌梗塞病史',
    type: 'radio',
    required: true,
    options: [
      { label: '有', value: 1 },
      { label: '無', value: 0 },
    ],
  },
  {
    key: 'HF',
    label: '心衰竭病史',
    type: 'radio',
    required: true,
    options: [
      { label: '有', value: 1 },
      { label: '無', value: 0 },
    ],
  },
  // 生命徵象
  {
    key: 'Temp__01_1',
    label: '體溫',
    unit: '°C',
    placeholder: '請輸入體溫',
    type: 'number',
    min: 30,
    max: 43,
    required: true,
  },
  {
    key: 'Sp_01_1',
    label: '收縮壓 (SBP)',
    unit: 'mmHg',
    placeholder: '請輸入收縮壓',
    type: 'number',
    min: 50,
    max: 250,
    required: true,
  },
  {
    key: 'Dp_01_1',
    label: '舒張壓 (DBP)',
    unit: 'mmHg',
    placeholder: '請輸入舒張壓',
    type: 'number',
    min: 30,
    max: 150,
    required: true,
  },
  {
    key: 'Spo2_01_1',
    label: '血氧 (SpO2)',
    unit: '%',
    placeholder: '請輸入血氧',
    type: 'number',
    min: 50,
    max: 100,
    required: true,
  },
  // 檢驗
  {
    key: 'Albumin',
    label: '白蛋白',
    unit: 'g/dL',
    placeholder: '請輸入白蛋白',
    type: 'number',
    min: 1.0,
    max: 6.0,
    required: true,
  },
  {
    key: 'GlucoseAC',
    label: '空腹血糖',
    unit: 'mg/dL',
    placeholder: '請輸入空腹血糖',
    type: 'number',
    min: 20,
    max: 600,
    required: true,
  },
  {
    key: 'Hemoglobin',
    label: '血紅素',
    unit: 'g/dL',
    placeholder: '請輸入血紅素',
    type: 'number',
    min: 3,
    max: 20,
    required: true,
  },
  {
    key: 'WBC',
    label: '白血球',
    unit: '10³/µL',
    placeholder: '例如：12 代表 12×10³/µL',
    type: 'number',
    min: 0,
    max: 100,
    required: true,
    helperText: '例如：12 代表 12×10³/µL',
  },
  {
    key: 'e_GFR',
    label: 'eGFR',
    unit: 'mL/min/1.73m²',
    placeholder: '請輸入 eGFR',
    type: 'number',
    min: 0,
    max: 200,
    required: true,
  },
  {
    key: 'Potassium',
    label: '血鉀',
    unit: 'mEq/L',
    placeholder: '請輸入血鉀',
    type: 'number',
    min: 1.5,
    max: 8.5,
    required: true,
  },
]

interface FormData {
  [key: string]: string | number
}

interface FieldErrors {
  [key: string]: string
}

export default function InputPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')

  // 驗證單一欄位
  const validateField = (key: string, value: string | number): string => {
    const config = fieldConfigs.find((f) => f.key === key)
    if (!config) return ''

    // 必填驗證
    if (config.required) {
      if (value === '' || value === null || value === undefined) {
        return '此欄位為必填'
      }
    }

    // 數值驗證
    if (config.type === 'number') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(numValue)) {
        return '請輸入有效數值'
      }

      // 範圍驗證
      if (config.min !== undefined && numValue < config.min) {
        return `${config.label}需介於 ${config.min}–${config.max}${config.unit || ''}`
      }
      if (config.max !== undefined && numValue > config.max) {
        return `${config.label}需介於 ${config.min}–${config.max}${config.unit || ''}`
      }
    }

    // 二元欄位驗證（radio）
    if (config.type === 'radio') {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value
      if (numValue !== 0 && numValue !== 1) {
        return '請選擇一個選項'
      }
    }

    return ''
  }

  // 驗證所有欄位
  const validateAll = (): boolean => {
    const newErrors: FieldErrors = {}
    let isValid = true

    fieldConfigs.forEach((config) => {
      const value = formData[config.key]
      const error = validateField(config.key, value)
      if (error) {
        newErrors[config.key] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // 處理輸入變更
  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    // 清除該欄位的錯誤
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
    setSubmitError('')
  }

  // 處理表單提交
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    // 驗證所有欄位
    if (!validateAll()) {
      return
    }

    setIsLoading(true)

    try {
      // 準備請求資料（確保數值類型正確）
      const requestData: { [key: string]: number } = {}
      fieldConfigs.forEach((config) => {
        const value = formData[config.key]
        if (config.type === 'number') {
          requestData[config.key] = typeof value === 'string' ? parseFloat(value) : value as number
        } else {
          // radio 欄位
          requestData[config.key] = typeof value === 'string' ? parseInt(value, 10) : value as number
        }
      })

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '請求失敗' }))
        
        if (response.status === 400) {
          // 處理驗證錯誤
          let errorMessage = '輸入資料有誤：\n'
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += errorData.errors.join('\n')
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else {
            errorMessage = '請檢查所有欄位是否正確填寫'
          }
          setSubmitError(errorMessage)
        } else {
          setSubmitError(`伺服器錯誤：${errorData.message || '請稍後再試'}`)
        }
        setIsLoading(false)
        return
      }

      const result = await response.json()
      
      // 儲存結果到 sessionStorage（用於 dashboard 顯示）
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ihca_result', JSON.stringify(result))
        
        // 同時保存到 localStorage（持久化，用於看板）
        const patient = createPatientFromResult(result)
        savePatient(patient)
      }

      // 導向結果頁
      router.push('/dashboard')
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError('網路錯誤，請檢查連線後再試')
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>非預期心跳驟停風險預測</h1>
          <p style={styles.subtitle}>入院首日邏輯式回歸計算</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formContent} className="form-content-grid">
            {/* 基本資料 */}
            <section style={{ ...styles.section, backgroundColor: colors.section1 }}>
              <h2 style={styles.sectionTitle}>基本資料</h2>
              <div style={styles.fieldGrid} className="field-grid">
                {fieldConfigs.slice(0, 2).map((config) => (
                  <div key={config.key} style={styles.field}>
                    <label style={styles.label}>
                      {config.label}
                      {config.unit && <span style={styles.unit}> ({config.unit})</span>}
                      {config.required && <span style={styles.required}> *</span>}
                    </label>
                    {config.type === 'number' && (
                      <input
                        type="number"
                        step={config.key === 'Age' ? '1' : '0.1'}
                        min={config.min}
                        max={config.max}
                        placeholder={config.placeholder}
                        value={formData[config.key] || ''}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                        style={{
                          ...styles.input,
                          ...(errors[config.key] ? styles.inputError : {}),
                        }}
                      />
                    )}
                    {config.type === 'radio' && (
                      <div style={styles.radioGroup}>
                        {config.options?.map((option) => (
                          <label key={option.value} style={styles.radioLabel}>
                            <input
                              type="radio"
                              name={config.key}
                              value={option.value}
                              checked={formData[config.key] === option.value}
                              onChange={(e) => handleChange(config.key, parseInt(e.target.value, 10))}
                              style={styles.radio}
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    )}
                    {errors[config.key] && (
                      <div style={styles.errorText}>{errors[config.key]}</div>
                    )}
                    {config.helperText && !errors[config.key] && (
                      <div style={styles.helperText}>{config.helperText}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 病史 */}
            <section style={{ ...styles.section, backgroundColor: colors.section2 }}>
              <h2 style={styles.sectionTitle}>病史</h2>
              <div style={styles.fieldGrid} className="field-grid">
                {fieldConfigs.slice(2, 5).map((config) => (
                  <div key={config.key} style={styles.field}>
                    <label style={styles.label}>
                      {config.label}
                      {config.required && <span style={styles.required}> *</span>}
                    </label>
                    <div style={styles.radioGroup}>
                      {config.options?.map((option) => (
                        <label key={option.value} style={styles.radioLabel}>
                          <input
                            type="radio"
                            name={config.key}
                            value={option.value}
                            checked={formData[config.key] === option.value}
                            onChange={(e) => handleChange(config.key, parseInt(e.target.value, 10))}
                            style={styles.radio}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                    {errors[config.key] && (
                      <div style={styles.errorText}>{errors[config.key]}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 生命徵象 */}
            <section style={{ ...styles.section, backgroundColor: colors.section3 }}>
              <h2 style={styles.sectionTitle}>生命徵象</h2>
              <div style={styles.fieldGrid} className="field-grid">
                {fieldConfigs.slice(5, 9).map((config) => (
                  <div key={config.key} style={styles.field}>
                    <label style={styles.label}>
                      {config.label}
                      {config.unit && <span style={styles.unit}> ({config.unit})</span>}
                      {config.required && <span style={styles.required}> *</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={config.min}
                      max={config.max}
                      placeholder={config.placeholder}
                      value={formData[config.key] || ''}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors[config.key] ? styles.inputError : {}),
                      }}
                    />
                    {errors[config.key] && (
                      <div style={styles.errorText}>{errors[config.key]}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 檢驗 */}
            <section style={{ ...styles.section, backgroundColor: colors.section4 }}>
              <h2 style={styles.sectionTitle}>檢驗</h2>
              <div style={styles.fieldGrid} className="field-grid">
                {fieldConfigs.slice(9).map((config) => (
                  <div key={config.key} style={styles.field}>
                    <label style={styles.label}>
                      {config.label}
                      {config.unit && <span style={styles.unit}> ({config.unit})</span>}
                      {config.required && <span style={styles.required}> *</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={config.min}
                      max={config.max}
                      placeholder={config.placeholder}
                      value={formData[config.key] || ''}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      style={{
                        ...styles.input,
                        ...(errors[config.key] ? styles.inputError : {}),
                      }}
                    />
                    {errors[config.key] && (
                      <div style={styles.errorText}>{errors[config.key]}</div>
                    )}
                    {config.helperText && !errors[config.key] && (
                      <div style={styles.helperText}>{config.helperText}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 錯誤訊息 */}
          {submitError && (
            <div style={styles.submitError}>
              <pre style={styles.errorPre}>{submitError}</pre>
            </div>
          )}

          {/* 免責聲明 */}
          <div style={styles.disclaimer}>
            <p style={styles.disclaimerText}>
              <strong>免責聲明：</strong>
              此為研究/臨床輔助工具，非醫囑。計算結果僅供參考，不應作為臨床決策的唯一依據。
            </p>
          </div>

          {/* 提交按鈕 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {}),
            }}
          >
            {isLoading ? '計算中...' : '計算風險'}
          </button>
        </form>
      </div>
    </div>
  )
}

// 馬卡龍色調配色
const colors = {
  background: 'linear-gradient(135deg, #ffeef8 0%, #e8f4f8 100%)',
  card: '#ffffff',
  cardBorder: 'rgba(255, 182, 193, 0.3)',
  section1: '#fff0f5', // 淡粉色
  section2: '#e6f3ff', // 淡藍色
  section3: '#f0fff4', // 淡綠色
  section4: '#fffacd', // 淡黃色
  titleBg: 'linear-gradient(135deg, #ffb6c1 0%, #87ceeb 100%)',
  input: '#ffffff',
  inputBorder: '#d4a5c7',
  inputFocus: '#ffb6c1',
  button: 'linear-gradient(135deg, #c8a2c8 0%, #a8c8e8 100%)',
  buttonHover: 'linear-gradient(135deg, #b892b8 0%, #98b8d8 100%)',
  error: '#ff6b9d',
  errorBg: '#ffeef8',
  disclaimer: '#fff8dc',
  disclaimerBorder: '#ffd700',
}

// 樣式定義
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    background: colors.background,
    WebkitOverflowScrolling: 'touch', // iOS 平滑滾動
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  card: {
    width: '100%',
    maxWidth: '1400px',
    backgroundColor: colors.card,
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 20px rgba(255, 182, 193, 0.2)',
    border: `1px solid ${colors.cardBorder}`,
    maxHeight: 'calc(100vh - 16px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    WebkitOverflowScrolling: 'touch', // iOS 平滑滾動
  },
  header: {
    background: colors.titleBg,
    borderRadius: '10px',
    padding: '10px 14px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '2px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '11px',
    color: '#ffffff',
    opacity: 0.95,
    margin: 0,
    lineHeight: '1.3',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    overflow: 'hidden',
  },
  formContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '8px',
    overflowY: 'auto',
    paddingRight: '4px',
    flex: 1,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '8px',
    borderRadius: '8px',
    border: `2px solid ${colors.cardBorder}`,
    minHeight: 'fit-content',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#8b4789',
    marginBottom: '4px',
    paddingBottom: '3px',
    borderBottom: `2px solid ${colors.inputBorder}`,
    lineHeight: '1.3',
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '6px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#6b4c6b',
    marginBottom: '1px',
    lineHeight: '1.3',
  },
  unit: {
    fontSize: '10px',
    color: '#8b7a8b',
    fontWeight: 'normal',
  },
  required: {
    color: colors.error,
    fontSize: '12px',
  },
  input: {
    padding: '9px 11px',
    fontSize: '12px',
    border: `1.5px solid ${colors.inputBorder}`,
    borderRadius: '6px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: colors.input,
    color: '#333',
    width: '100%',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    minHeight: '42px',
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  radioGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '2px',
    flexWrap: 'wrap',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#6b4c6b',
    padding: '4px 8px',
    borderRadius: '5px',
    transition: 'background-color 0.2s',
    minHeight: '36px',
  },
  radio: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: colors.inputFocus,
  },
  errorText: {
    fontSize: '11px',
    color: colors.error,
    marginTop: '2px',
    fontWeight: '500',
  },
  helperText: {
    fontSize: '11px',
    color: '#8b7a8b',
    marginTop: '2px',
    fontStyle: 'italic',
  },
  submitError: {
    padding: '10px 14px',
    backgroundColor: colors.errorBg,
    border: `1.5px solid ${colors.error}`,
    borderRadius: '8px',
    color: colors.error,
  },
  errorPre: {
    margin: 0,
    fontSize: '13px',
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
  },
  disclaimer: {
    padding: '8px 10px',
    backgroundColor: colors.disclaimer,
    border: `1.5px solid ${colors.disclaimerBorder}`,
    borderRadius: '6px',
    marginTop: '4px',
  },
  disclaimerText: {
    fontSize: '10px',
    color: '#8b6914',
    margin: 0,
    lineHeight: '1.4',
  },
  submitButton: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: colors.button,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    alignSelf: 'stretch',
    minHeight: '48px',
    boxShadow: '0 4px 12px rgba(200, 162, 200, 0.3)',
    marginTop: '4px',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}

