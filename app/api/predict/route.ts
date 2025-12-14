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

    // 邏輯式回歸計算
    // 變項對應關係
    const Temp = body.Temp__01_1
    const SBP = body.Sp_01_1
    const DBP = body.Dp_01_1
    const SpO2 = body.Spo2_01_1
    const Age_per_10_year = body.Age / 10  // 年齡除以 10
    const Sex = body.Sex  // 二元變項：1 = 男，0 = 女
    const PleuralEffusion = body.pleuraleffusion  // 二元變項：1 = 有，0 = 無
    const MI = body.MI  // 二元變項：1 = 有，0 = 無
    const HF = body.HF  // 二元變項：1 = 有，0 = 無
    const Albumin = body.Albumin
    const Glucose = body.GlucoseAC
    const Hemoglobin = body.Hemoglobin
    const WBC = body.WBC
    const eGFR = body.e_GFR
    const Potassium = body.Potassium

    // 計算 logit(p)
    const logit = 
      8.282
      - 0.146 * Temp
      - 0.012 * SBP
      + 0.008 * DBP
      - 0.037 * SpO2
      + 0.112 * Age_per_10_year
      + 0.242 * Sex
      + 0.645 * PleuralEffusion
      + 0.292 * MI
      + 0.495 * HF
      - 0.506 * Albumin
      - 0.002 * Glucose
      - 0.220 * Hemoglobin
      + 0.095 * WBC
      + 0.010 * eGFR
      + 0.365 * Potassium

    // 計算機率 p = 1 / (1 + exp(-logit))
    const probability = 1 / (1 + Math.exp(-logit))

    // 判斷風險等級
    let riskLevel: string
    if (probability < 0.3) {
      riskLevel = '低風險'
    } else if (probability < 0.7) {
      riskLevel = '中風險'
    } else {
      riskLevel = '高風險'
    }

    const result = {
      logit: logit,
      probability: probability,
      riskLevel: riskLevel,
      timestamp: new Date().toISOString(),
      inputData: body,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { message: '伺服器錯誤', error: 'Invalid request' },
      { status: 500 }
    )
  }
}

