import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 基本驗證（後端也應該驗證）
    const requiredFields = [
      'Age',
      'Sex',
      'pleuraleffusion',
      'MI',
      'HF',
      'Temp__01_1',
      'Sp_01_1',
      'Dp_01_1',
      'Spo2_01_1',
      'Albumin',
      'GlucoseAC',
      'Hemoglobin',
      'WBC',
      'e_GFR',
      'Potassium',
    ]

    const errors: string[] = []
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field} 為必填欄位`)
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { message: '驗證失敗', errors },
        { status: 400 }
      )
    }

    // TODO: 這裡應該實作邏輯式回歸計算
    // 目前回傳模擬結果
    const mockResult = {
      logit: 0.5,
      probability: 0.62,
      riskLevel: '中風險',
      timestamp: new Date().toISOString(),
      inputData: body,
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { message: '伺服器錯誤', error: 'Invalid request' },
      { status: 500 }
    )
  }
}

