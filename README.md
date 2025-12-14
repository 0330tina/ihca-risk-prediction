# 非預期心臟驟停風險預測系統

使用 Next.js 14 (App Router) + TypeScript 開發的風險預測輸入介面與病房電子看板系統。

## ✨ 功能特色

- 📝 **輸入頁面** (`/input`)：收集模型所需變項，馬卡龍色調設計
- ✅ **前端驗證**：確保所有欄位正確填寫，即時錯誤提示
- 🔮 **API 端點** (`/api/predict`)：處理預測計算
- 📊 **結果頁面** (`/dashboard`)：顯示詳細預測結果
- 🏥 **病房看板** (`/ward`)：電子看板管理多個病人資料
- 💾 **資料持久化**：使用 localStorage 保存病人資料
- 📱 **響應式設計**：適配各種裝置尺寸

## 安裝與執行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置
npm run build

# 生產模式
npm start
```

## 📁 專案結構

```
app/
  ├── input/
  │   └── page.tsx          # 輸入表單頁面
  ├── dashboard/
  │   └── page.tsx          # 結果顯示頁面
  ├── ward/
  │   └── page.tsx          # 病房電子看板
  ├── api/
  │   └── predict/
  │       └── route.ts      # 預測 API 端點
  ├── layout.tsx            # 根布局
  ├── page.tsx              # 首頁
  └── globals.css           # 全域樣式
lib/
  └── patientStorage.ts     # 病人資料管理工具
```

## 表單欄位

### 基本資料
- 年齡 (Age)
- 性別 (Sex)

### 病史
- 肋膜積水 (pleuraleffusion)
- 心肌梗塞病史 (MI)
- 心衰竭病史 (HF)

### 生命徵象
- 體溫 (Temp__01_1)
- 收縮壓 (Sp_01_1)
- 舒張壓 (Dp_01_1)
- 血氧 (Spo2_01_1)

### 檢驗
- 白蛋白 (Albumin)
- 空腹血糖 (GlucoseAC)
- 血紅素 (Hemoglobin)
- 白血球 (WBC)
- eGFR (e_GFR)
- 血鉀 (Potassium)

## 🚀 部署到 GitHub

### 步驟 1：初始化 Git 倉庫

```bash
# 初始化 git 倉庫
git init

# 添加所有檔案
git add .

# 提交變更
git commit -m "Initial commit: IHCA risk prediction system"
```

### 步驟 2：在 GitHub 創建倉庫

1. 前往 [GitHub](https://github.com) 並登入
2. 點擊右上角的 **+** → **New repository**
3. 填寫倉庫資訊：
   - Repository name: `ihca-risk-prediction` (或您喜歡的名稱)
   - Description: `非預期心臟驟停風險預測系統 - Next.js 14 + TypeScript`
   - 選擇 Public 或 Private
   - **不要**勾選 "Initialize this repository with a README"（因為我們已經有 README）
4. 點擊 **Create repository**

### 步驟 3：連接本地倉庫到 GitHub

```bash
# 添加遠端倉庫（將 YOUR_USERNAME 替換為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/ihca-risk-prediction.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步驟 4：部署到 Vercel（推薦）

1. 前往 [Vercel](https://vercel.com) 並使用 GitHub 帳號登入
2. 點擊 **Add New Project**
3. 選擇您的 GitHub 倉庫
4. Vercel 會自動偵測 Next.js 專案
5. 點擊 **Deploy**，等待部署完成
6. 部署完成後會獲得一個網址，例如：`https://your-project.vercel.app`

### 其他部署選項

- **Netlify**: 類似 Vercel，支援 Next.js
- **GitHub Pages**: 需要額外配置（不推薦，因為是動態應用）
- **自架伺服器**: 使用 `npm run build` 和 `npm start`

## 📋 注意事項

- ⚠️ 此為研究/臨床輔助工具，非醫囑
- ⚠️ 計算結果僅供參考，不應作為臨床決策的唯一依據
- ⚠️ API 端點目前回傳模擬結果，需實作實際的邏輯式回歸計算
- 💾 資料儲存在瀏覽器 localStorage，清除瀏覽器資料會遺失
- 🔒 如需生產環境使用，建議實作後端資料庫與身份驗證

## 📄 授權

此專案僅供研究與教育用途使用。

## 👥 貢獻

歡迎提交 Issue 或 Pull Request！

