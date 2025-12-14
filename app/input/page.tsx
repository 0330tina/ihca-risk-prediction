'use client'

import { useState, FormEvent, useEffect, useCallback, useRef } from 'react'
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
    placeholder: '例如：65',
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
    placeholder: '例如：36.5',
    type: 'number',
    min: 30,
    max: 43,
    required: true,
  },
  {
    key: 'Sp_01_1',
    label: '收縮壓',
    unit: 'mmHg',
    placeholder: '例如：120',
    type: 'number',
    min: 50,
    max: 250,
    required: true,
  },
  {
    key: 'Dp_01_1',
    label: '舒張壓',
    unit: 'mmHg',
    placeholder: '例如：80',
    type: 'number',
    min: 30,
    max: 150,
    required: true,
  },
  {
    key: 'Spo2_01_1',
    label: '血氧',
    unit: '%',
    placeholder: '例如：98',
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
    placeholder: '例如：4.0',
    type: 'number',
    min: 1.0,
    max: 6.0,
    required: true,
  },
  {
    key: 'GlucoseAC',
    label: '空腹血糖',
    unit: 'mg/dL',
    placeholder: '例如：100',
    type: 'number',
    min: 20,
    max: 600,
    required: true,
  },
  {
    key: 'Hemoglobin',
    label: '血紅素',
    unit: 'g/dL',
    placeholder: '例如：14.0',
    type: 'number',
    min: 3,
    max: 20,
    required: true,
  },
  {
    key: 'WBC',
    label: '白血球',
    unit: '10³/µL',
    placeholder: '例如：7.5',
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
    placeholder: '例如：60',
    type: 'number',
    min: 0,
    max: 200,
    required: true,
  },
  {
    key: 'Potassium',
    label: '血鉀',
    unit: 'mEq/L',
    placeholder: '例如：4.0',
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

// 表單草稿管理 Hook
const DRAFT_STORAGE_KEY = 'ihca_input_draft'

function useFormDraft() {
  const [isLoaded, setIsLoaded] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 讀取草稿
  const loadDraft = useCallback((): FormData => {
    if (typeof window === 'undefined') return {}
    try {
      const draft = sessionStorage.getItem(DRAFT_STORAGE_KEY)
      if (draft) {
        return JSON.parse(draft)
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
    return {}
  }, [])

  // 儲存草稿（節流）
  const saveDraft = useCallback((data: FormData) => {
    if (typeof window === 'undefined') return
    
    // 清除之前的 timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // 設置新的 timeout（節流 400ms）
    saveTimeoutRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data))
      } catch (error) {
        console.error('Failed to save draft:', error)
      }
    }, 400)
  }, [])

  // 清除草稿
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear draft:', error)
    }
  }, [])

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return { loadDraft, saveDraft, clearDraft, isLoaded, setIsLoaded }
}

export default function InputPage() {
  const router = useRouter()
  const { loadDraft, saveDraft, clearDraft, isLoaded, setIsLoaded } = useFormDraft()
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')

  // 初始化：載入草稿
  useEffect(() => {
    if (!isLoaded) {
      const draft = loadDraft()
      if (Object.keys(draft).length > 0) {
        setFormData(draft)
      }
      setIsLoaded(true)
    }
  }, [isLoaded, loadDraft])

  // 自動儲存草稿
  useEffect(() => {
    if (isLoaded && Object.keys(formData).length > 0) {
      saveDraft(formData)
    }
  }, [formData, isLoaded, saveDraft])

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
        
        // 提交成功後保留輸入資料（不清除草稿，方便返回修改）
      }

      // 導向結果頁
      router.push('/dashboard')
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError('網路錯誤，請檢查連線後再試')
      setIsLoading(false)
    }
  }

  // 渲染欄位
  const renderField = (config: FieldConfig) => {
    const hasError = !!errors[config.key]
    const fieldId = `field-${config.key}`

    if (config.type === 'number') {
      return (
        <div key={config.key} style={styles.field}>
          <label htmlFor={fieldId} style={styles.label}>
            {config.label}
            {config.required && <span style={styles.required} aria-label="必填"> *</span>}
            {config.unit && <span style={styles.unit}> ({config.unit})</span>}
          </label>
          <div style={styles.inputWrapper}>
            <input
              id={fieldId}
              type="number"
              inputMode="decimal"
              step={config.key === 'Age' ? '1' : '0.1'}
              min={config.min}
              max={config.max}
              placeholder={config.placeholder}
              value={formData[config.key] || ''}
              onChange={(e) => handleChange(config.key, e.target.value)}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${fieldId}-error` : config.helperText ? `${fieldId}-helper` : undefined}
              style={{
                ...styles.input,
                ...(hasError ? styles.inputError : {}),
              }}
            />
            {config.unit && <span style={styles.inputSuffix}>{config.unit}</span>}
          </div>
          {hasError && (
            <div id={`${fieldId}-error`} role="alert" style={styles.errorText}>
              {errors[config.key]}
            </div>
          )}
          {config.helperText && !hasError && (
            <div id={`${fieldId}-helper`} style={styles.helperText}>
              {config.helperText}
            </div>
          )}
        </div>
      )
    }

    if (config.type === 'radio') {
      return (
        <div key={config.key} style={styles.field}>
          <label style={styles.label}>
            {config.label}
            {config.required && <span style={styles.required} aria-label="必填"> *</span>}
          </label>
          <div style={styles.radioGroup} role="radiogroup" aria-labelledby={`${fieldId}-label`}>
            {config.options?.map((option) => (
              <label
                key={option.value}
                style={{
                  ...styles.radioLabel,
                  ...(formData[config.key] === option.value ? styles.radioLabelSelected : {}),
                }}
                className="radio-label"
              >
                <input
                  type="radio"
                  name={config.key}
                  value={option.value}
                  checked={formData[config.key] === option.value}
                  onChange={(e) => handleChange(config.key, parseInt(e.target.value, 10))}
                  style={styles.radio}
                  aria-invalid={hasError}
                />
                {option.label}
              </label>
            ))}
          </div>
          {hasError && (
            <div role="alert" style={styles.errorText}>
              {errors[config.key]}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  // 分組欄位
  const basicFields = fieldConfigs.slice(0, 2)
  const historyFields = fieldConfigs.slice(2, 5)
  const vitalFields = fieldConfigs.slice(5, 9)
  const labFields = fieldConfigs.slice(9)

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>非預期心臟驟停風險預測</h1>
            <p style={styles.subtitle}>入院首日邏輯式回歸計算</p>
          </div>
          {isLoaded && Object.keys(formData).length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('確定要清除所有輸入資料嗎？')) {
                  setFormData({})
                  clearDraft()
                  setErrors({})
                }
              }}
              style={styles.clearButton}
              aria-label="清除草稿"
            >
              清除
            </button>
          )}
        </div>
      </header>

      {/* Main Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formContent}>
          {/* 基本資料 */}
          <section style={styles.section}>
            <div style={styles.sectionDivider} />
            <h2 style={styles.sectionTitle}>基本資料</h2>
            <div style={styles.fieldGrid} className="field-grid">
              {basicFields.map(renderField)}
            </div>
          </section>

          {/* 病史 */}
          <section style={styles.section}>
            <div style={styles.sectionDivider} />
            <h2 style={styles.sectionTitle}>病史</h2>
            <div style={styles.fieldGrid} className="field-grid">
              {historyFields.map(renderField)}
            </div>
          </section>

          {/* 生命徵象 */}
          <section style={styles.section}>
            <div style={styles.sectionDivider} />
            <h2 style={styles.sectionTitle}>生命徵象</h2>
            <div style={styles.fieldGrid} className="field-grid">
              {vitalFields.map(renderField)}
            </div>
          </section>

          {/* 檢驗 */}
          <section style={styles.section}>
            <div style={styles.sectionDivider} />
            <h2 style={styles.sectionTitle}>檢驗</h2>
            <div style={styles.fieldGrid} className="field-grid">
              {labFields.map(renderField)}
            </div>
          </section>
        </div>

        {/* 錯誤訊息 */}
        {submitError && (
          <div style={styles.submitError} role="alert">
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

        {/* 提交按鈕 - 固定在底部 */}
        <div style={styles.submitContainer}>
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
        </div>
      </form>
    </div>
  )
}

// 馬卡龍色調配色（與其他頁面一致）
const colors = {
  background: 'linear-gradient(135deg, #ffeef8 0%, #e8f4f8 100%)',
  headerBg: 'linear-gradient(135deg, #ffb6c1 0%, #87ceeb 100%)',
  headerText: '#ffffff',
  divider: 'rgba(255, 182, 193, 0.3)',
  input: '#ffffff',
  inputBorder: 'rgba(255, 182, 193, 0.4)',
  inputFocus: '#a8c8e8',
  button: 'linear-gradient(135deg, #c8a2c8 0%, #a8c8e8 100%)',
  buttonHover: 'linear-gradient(135deg, #b892b8 0%, #98b8d8 100%)',
  buttonDisabled: '#d0d0d0',
  error: '#e85a7a',
  errorBg: '#fff0f5',
  textPrimary: '#6b4c6b',
  textSecondary: '#8b7a8b',
  textTertiary: '#ab9aab',
  disclaimer: '#fff9e6',
  disclaimerText: '#8b7a8b',
}

// 樣式定義
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: colors.background,
    paddingBottom: '100px', // 為 sticky submit button 留空間
    WebkitOverflowScrolling: 'touch',
  },
  header: {
    background: colors.headerBg,
    color: colors.headerText,
    padding: '20px 16px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  clearButton: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    color: colors.headerText,
    backgroundColor: 'transparent',
    border: `1px solid rgba(255, 255, 255, 0.3)`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
    opacity: 0.9,
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
    marginBottom: '4px',
    lineHeight: '1.3',
  },
  subtitle: {
    fontSize: '13px',
    margin: 0,
    opacity: 0.9,
    lineHeight: '1.4',
    fontWeight: '400',
  },
  form: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionDivider: {
    height: '1px',
    backgroundColor: colors.divider,
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
    margin: 0,
    letterSpacing: '0.2px',
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: '1.4',
  },
  unit: {
    fontSize: '13px',
    color: colors.textSecondary,
    fontWeight: '400',
  },
  required: {
    color: colors.error,
    fontSize: '14px',
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 80px 12px 16px', // 右側留空間給單位
    fontSize: '16px', // 手機友善，避免自動縮放
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: colors.input,
    color: colors.textPrimary,
    minHeight: '44px', // 手機友善觸控目標
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  },
  inputSuffix: {
    position: 'absolute',
    right: '16px',
    fontSize: '14px',
    color: colors.textSecondary,
    pointerEvents: 'none',
    backgroundColor: 'transparent',
    paddingLeft: '4px',
    whiteSpace: 'nowrap',
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  radioGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    color: colors.textPrimary,
    padding: '12px 16px',
    borderRadius: '4px',
    border: `1px solid ${colors.inputBorder}`,
    backgroundColor: colors.input,
    minHeight: '44px',
    transition: 'background-color 0.2s, border-color 0.2s',
    flex: '1 1 auto',
    minWidth: '120px',
  },
  radioLabelSelected: {
    borderColor: colors.inputFocus,
    backgroundColor: '#fff0f5',
  },
  radio: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: colors.inputFocus,
    flexShrink: 0,
  },
  errorText: {
    fontSize: '13px',
    color: colors.error,
    fontWeight: '500',
    lineHeight: '1.4',
  },
  helperText: {
    fontSize: '12px',
    color: colors.textSecondary,
    lineHeight: '1.4',
  },
  submitError: {
    padding: '12px 16px',
    backgroundColor: colors.errorBg,
    border: `1px solid ${colors.error}`,
    borderRadius: '4px',
    color: colors.error,
    marginTop: '24px',
  },
  errorPre: {
    margin: 0,
    fontSize: '13px',
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
    lineHeight: '1.5',
  },
  disclaimer: {
    padding: '12px 16px',
    backgroundColor: colors.disclaimer,
    borderRadius: '4px',
    marginTop: '24px',
  },
  disclaimerText: {
    fontSize: '12px',
    color: colors.disclaimerText,
    margin: 0,
    lineHeight: '1.5',
  },
  submitContainer: {
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '16px',
    marginTop: '24px',
    marginLeft: '-16px',
    marginRight: '-16px',
    borderTop: `1px solid ${colors.divider}`,
    boxShadow: '0 -2px 12px rgba(200, 162, 200, 0.15)',
  },
  submitButton: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: colors.button,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '48px',
    letterSpacing: '0.3px',
    boxShadow: '0 2px 8px rgba(200, 162, 200, 0.3)',
  },
  submitButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
    cursor: 'not-allowed',
    opacity: 0.6,
  },
}
