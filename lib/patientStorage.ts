// 病人資料管理工具

export interface PatientData {
  id: string
  name?: string
  bedNumber?: string
  result: {
    logit?: number
    probability?: number
    riskLevel?: string
    timestamp?: string
    inputData?: any
  }
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'ihca_patients'

// 獲取所有病人資料
export function getAllPatients(): PatientData[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to get patients:', error)
    return []
  }
}

// 保存病人資料
export function savePatient(patient: PatientData): void {
  if (typeof window === 'undefined') return
  
  try {
    const patients = getAllPatients()
    const existingIndex = patients.findIndex(p => p.id === patient.id)
    
    if (existingIndex >= 0) {
      // 更新現有病人
      patients[existingIndex] = {
        ...patient,
        updatedAt: new Date().toISOString(),
      }
    } else {
      // 新增病人
      patients.push(patient)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients))
  } catch (error) {
    console.error('Failed to save patient:', error)
  }
}

// 刪除病人資料
export function deletePatient(patientId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const patients = getAllPatients()
    const filtered = patients.filter(p => p.id !== patientId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete patient:', error)
  }
}

// 根據 ID 獲取病人資料
export function getPatientById(patientId: string): PatientData | null {
  const patients = getAllPatients()
  return patients.find(p => p.id === patientId) || null
}

// 生成新的病人 ID
export function generatePatientId(): string {
  return `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 從結果資料創建病人資料
export function createPatientFromResult(
  result: PatientData['result'],
  name?: string,
  bedNumber?: string
): PatientData {
  return {
    id: generatePatientId(),
    name: name || `病人-${new Date().toLocaleDateString('zh-TW')}`,
    bedNumber: bedNumber || '',
    result,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

