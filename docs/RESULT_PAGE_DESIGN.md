# 邏輯式回歸模型結果呈現設計說明

## 設計概述

本文件說明 IHCA 風險預測平台的結果呈現頁面（Dashboard）設計，符合臨床決策支援系統（CDSS）標準。

---

## 1. UI 結構說明

### 1.1 結果卡片（Result Card）

**位置**：頁面主要區域

**結構**：
```
┌─────────────────────────────────┐
│  預測風險機率                      │
│                                   │
│        ┌─────┐                   │
│        │ 27.4%│                   │
│        └─────┘                   │
│                                   │
│  [低風險 / Low Risk]              │
│                                   │
│  ℹ️ 臨床解讀                      │
│  目前風險低，請依常規照護與觀察    │
│                                   │
│  此風險分級來自多變項邏輯式回歸... │
│                                   │
│  ▼ 進階資訊（供研究人員參考）     │
│    • Logit 值: -2.3456           │
│    • 計算時間: 2024/12/14 10:30  │
└─────────────────────────────────┘
```

**視覺特點**：
- 背景顏色根據風險等級動態變化（低彩度）
- 圓形顯示風險機率百分比
- 風險分級標籤（中英文）
- 臨床解讀區塊（帶圖示）
- 模型說明文字（小字、斜體）
- 進階資訊可折疊（details/summary）

### 1.2 風險標籤（Risk Badge）

**設計**：
- 圓角矩形標籤
- 顯示中文風險等級 + 英文對照
- 顏色與結果卡片背景一致
- 低彩度邊框

**範例**：
- `低風險 / Low Risk`
- `中等風險 / Moderate Risk`
- `高風險 / High Risk`

### 1.3 臨床解讀區塊（Interpretation Box）

**設計**：
- 半透明白色背景
- 左側資訊圖示（ℹ️）
- 標題：「臨床解讀」
- 內容：根據風險等級顯示對應解讀文字

**解讀文字**：
- **Low**: 「目前風險低，請依常規照護與觀察。」
- **Moderate**: 「建議提高臨床警覺，密切追蹤生命徵象與臨床變化。」
- **High**: 「顯示為高風險族群，建議優先評估與照護，考慮加強監測措施。」

---

## 2. 風險分級邏輯程式設計

### 2.1 集中管理配置

**檔案位置**：`lib/riskClassification.ts`

**配置結構**：
```typescript
export const RISK_CLASSIFICATION: RiskClassificationConfig = {
  low: {
    threshold: 0.10,        // p < 0.10
    label: '低風險',
    labelEn: 'Low Risk',
    color: { ... },
    interpretation: '...',
  },
  moderate: {
    threshold: 0.30,          // 0.10 ≤ p < 0.30
    label: '中等風險',
    labelEn: 'Moderate Risk',
    color: { ... },
    interpretation: '...',
  },
  high: {
    threshold: 0.30,          // p ≥ 0.30
    label: '高風險',
    labelEn: 'High Risk',
    color: { ... },
    interpretation: '...',
  },
}
```

### 2.2 分級函數

**函數名稱**：`classifyRisk(probability: number)`

**邏輯**：
```typescript
if (probability < 0.10) {
  return { level: 'low', ... }
} else if (probability < 0.30) {
  return { level: 'moderate', ... }
} else {
  return { level: 'high', ... }
}
```

**優點**：
- 集中管理，易於調整 cut-off 值
- 避免 hard-code 在 UI 元件中
- 類型安全（TypeScript）
- 可擴展（未來可加入更多分級）

### 2.3 使用方式

**在 Dashboard 頁面**：
```typescript
import { classifyRisk } from '@/lib/riskClassification'

const riskClassification = classifyRisk(probability)
const riskConfig = riskClassification.config
```

**在 API 路由**：
```typescript
import { classifyRisk } from '@/lib/riskClassification'

const riskClassification = classifyRisk(probability)
// 回傳風險分級資訊
```

---

## 3. 視覺呈現原則

### 3.1 顏色系統

**設計原則**：
- 低彩度、非刺眼
- 避免造成恐慌
- 僅用於結果頁（不回流到輸入頁）

**顏色配置**：

| 風險等級 | 背景色 | 文字色 | 邊框色 |
|---------|--------|--------|--------|
| Low | `#f0f4f0` (柔和灰綠) | `#4a6b4a` | `#c8d8c8` |
| Moderate | `#fff4e6` (柔和橘) | `#8b6f3f` | `#e8d4b8` |
| High | `#f8e8e8` (穩定紅) | `#8b4a4a` | `#e8c8c8` |

**特點**：
- 所有顏色均為低飽和度
- 避免鮮紅色、警示黃等刺眼色系
- 適合長時間閱讀

### 3.2 響應式設計（RWD）

**手機端**：
- 結果卡片全寬
- 機率圓形適當縮小
- 文字大小可讀
- 按鈕堆疊排列

**桌機端**：
- 結果卡片最大寬度 800px
- 居中顯示
- 適當留白

---

## 4. 必須顯示的資訊

### 4.1 核心資訊

✅ **風險機率**：百分比顯示（例如：27.4%）  
✅ **風險分級文字**：Low / Moderate / High（中英文）  
✅ **臨床解讀文字**：根據風險等級顯示對應解讀  
✅ **醫療免責聲明**：必須存在且明顯

### 4.2 進階資訊（可折疊）

✅ **Logit 值**：小字顯示，供研究人員參考  
✅ **計算時間**：ISO 格式轉換為本地時間

### 4.3 模型說明

✅ **說明文字**：「此風險分級來自多變項邏輯式回歸模型之預測結果，基於入院首日臨床資料進行風險評估。」

---

## 5. 風險分級說明文字（供 UI 使用）

### 低風險（Low Risk）
**條件**：p < 0.10

**臨床解讀**：
> 目前風險低，請依常規照護與觀察。

### 中等風險（Moderate Risk）
**條件**：0.10 ≤ p < 0.30

**臨床解讀**：
> 建議提高臨床警覺，密切追蹤生命徵象與臨床變化。

### 高風險（High Risk）
**條件**：p ≥ 0.30

**臨床解讀**：
> 顯示為高風險族群，建議優先評估與照護，考慮加強監測措施。

---

## 6. 醫療免責聲明

**必須包含的內容**：

1. **研究性質**：本系統為學術研究工具，非醫療設備
2. **臨床決策**：預測結果不應作為臨床決策的唯一依據
3. **責任聲明**：系統開發者與提供者不對任何臨床決策或醫療結果承擔責任

**呈現方式**：
- 獨立區塊
- 明顯邊框
- 警告圖示
- 清晰文字

---

## 7. 禁止事項

❌ **不可顯示**：
- 回歸係數（β）
- 模型計算細節
- 誇大預測能力的語言

❌ **不可使用**：
- 警示音效
- 動畫效果
- 閃爍效果
- 鮮紅色、警示黃等刺眼色系

❌ **不可回流**：
- 結果頁顏色不應影響輸入頁設計

---

## 8. 技術實作

### 8.1 檔案結構

```
lib/
  └── riskClassification.ts    # 風險分級配置與函數

app/
  ├── api/
  │   └── predict/
  │       └── route.ts         # 使用 classifyRisk()
  └── dashboard/
      └── page.tsx             # 結果呈現頁面
```

### 8.2 資料流

```
API 計算 probability
    ↓
classifyRisk(probability)
    ↓
返回 RiskClassificationResult
    ↓
Dashboard 頁面呈現
    ↓
使用 riskConfig 取得顏色、文字、解讀
```

---

## 9. 未來擴展性

### 9.1 調整 Cut-off 值

只需修改 `lib/riskClassification.ts` 中的 `RISK_CLASSIFICATION` 配置：

```typescript
low: {
  threshold: 0.10,  // 改為 0.15
  ...
}
```

### 9.2 新增風險等級

在配置中新增等級，更新 `classifyRisk()` 函數邏輯。

### 9.3 多語言支援

在配置中新增其他語言標籤。

---

## 10. 設計標準

本設計遵循以下標準：

- ✅ **臨床決策支援系統（CDSS）**標準
- ✅ **避免行銷語言**
- ✅ **避免誇大預測能力**
- ✅ **可解釋性**：清楚說明風險分級來源
- ✅ **不中斷臨床判斷**：提供資訊，不強制決策
- ✅ **不造成恐慌**：低彩度、穩定色系

---

## 總結

本設計提供了一個符合臨床研究標準的結果呈現系統，具有：

1. **集中管理**的風險分級配置
2. **清晰可讀**的視覺呈現
3. **臨床導向**的解讀文字
4. **完整免責**的醫療聲明
5. **易於維護**的程式架構

所有設計均以「輔助臨床決策，不取代專業判斷」為核心原則。

