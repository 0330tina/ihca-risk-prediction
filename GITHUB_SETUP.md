# GitHub 發布完整指南

本指南將幫助您將專案發布到 GitHub 並部署到線上。

## 📋 前置準備

1. **安裝 Git**（如果尚未安裝）
   - Windows: 下載 [Git for Windows](https://git-scm.com/download/win)
   - Mac: `brew install git` 或從 [官網](https://git-scm.com/download/mac) 下載
   - Linux: `sudo apt-get install git`

2. **建立 GitHub 帳號**（如果還沒有）
   - 前往 [github.com](https://github.com) 註冊

## 🚀 步驟 1：初始化 Git 倉庫

在專案根目錄開啟終端機（Terminal 或 PowerShell），執行：

```bash
# 檢查 Git 是否已安裝
git --version

# 初始化 Git 倉庫
git init

# 檢查檔案狀態
git status
```

## 📝 步驟 2：第一次提交

```bash
# 添加所有檔案到暫存區
git add .

# 提交變更（這是第一次提交）
git commit -m "Initial commit: IHCA risk prediction system with ward dashboard"
```

## 🌐 步驟 3：在 GitHub 創建倉庫

### 方法 A：使用網頁介面

1. 登入 [GitHub](https://github.com)
2. 點擊右上角的 **+** 圖示 → 選擇 **New repository**
3. 填寫以下資訊：
   ```
   Repository name: ihca-risk-prediction
   Description: 非預期心跳驟停風險預測系統 - Next.js 14 + TypeScript + 病房電子看板
   Visibility: Public（公開）或 Private（私有）
   ```
4. **重要**：不要勾選以下選項：
   - ❌ Add a README file（我們已經有 README.md）
   - ❌ Add .gitignore（我們已經有 .gitignore）
   - ❌ Choose a license（可選）
5. 點擊 **Create repository**

### 方法 B：使用 GitHub CLI（進階）

如果您安裝了 GitHub CLI：

```bash
gh repo create ihca-risk-prediction --public --source=. --remote=origin --push
```

## 🔗 步驟 4：連接本地倉庫到 GitHub

在終端機執行以下命令（將 `YOUR_USERNAME` 替換為您的 GitHub 用戶名）：

```bash
# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/ihca-risk-prediction.git

# 將分支命名為 main（GitHub 預設）
git branch -M main

# 推送到 GitHub
git push -u origin main
```

**注意**：第一次推送時，GitHub 可能會要求您輸入帳號密碼。建議使用 Personal Access Token：
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 生成新 token，勾選 `repo` 權限
3. 使用 token 作為密碼

## ✅ 步驟 5：驗證上傳

1. 重新整理 GitHub 網頁
2. 您應該能看到所有檔案都已上傳
3. README.md 會自動顯示在倉庫首頁

## 🚀 步驟 6：部署到 Vercel（推薦）

Vercel 是 Next.js 官方推薦的部署平台，提供免費方案。

### 6.1 使用 Vercel 網頁介面

1. 前往 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點擊 **Add New Project**
4. 選擇您的倉庫 `ihca-risk-prediction`
5. Vercel 會自動偵測 Next.js 設定：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. 點擊 **Deploy**
7. 等待部署完成（約 1-2 分鐘）
8. 部署完成後會獲得網址，例如：`https://ihca-risk-prediction.vercel.app`

### 6.2 使用 Vercel CLI（可選）

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 在專案目錄執行
vercel

# 按照提示操作
```

## 🔄 步驟 7：後續更新

當您修改程式碼後，使用以下命令更新 GitHub：

```bash
# 查看變更
git status

# 添加變更的檔案
git add .

# 提交變更（寫清楚這次修改了什麼）
git commit -m "Add: 新增病房看板功能"

# 推送到 GitHub
git push

# Vercel 會自動重新部署（如果已連接）
```

## 📦 其他部署選項

### Netlify

1. 前往 [netlify.com](https://netlify.com)
2. 使用 GitHub 登入
3. 選擇 **Add new site** → **Import an existing project**
4. 選擇您的 GitHub 倉庫
5. 設定：
   - Build command: `npm run build`
   - Publish directory: `.next`
6. 點擊 **Deploy site**

### 自架伺服器

```bash
# 在伺服器上
git clone https://github.com/YOUR_USERNAME/ihca-risk-prediction.git
cd ihca-risk-prediction
npm install
npm run build
npm start
```

## 🛠️ 常見問題

### Q: 推送時出現認證錯誤
**A**: 使用 Personal Access Token 代替密碼，或設定 SSH key

### Q: 如何設定 Git 用戶資訊？
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Q: 如何忽略某些檔案？
**A**: 編輯 `.gitignore` 檔案，已包含常見的忽略項目

### Q: 如何回退到之前的版本？
```bash
# 查看提交歷史
git log

# 回退到特定版本
git reset --hard <commit-hash>
```

## 📚 有用的 Git 命令

```bash
# 查看狀態
git status

# 查看提交歷史
git log --oneline

# 查看遠端倉庫
git remote -v

# 拉取最新變更
git pull

# 建立新分支
git checkout -b feature/new-feature

# 切換分支
git checkout main
```

## 🎉 完成！

現在您的專案已經：
- ✅ 上傳到 GitHub
- ✅ 可以透過 GitHub 分享給他人
- ✅ 可以部署到線上環境
- ✅ 可以進行版本控制

祝您使用愉快！如有問題，歡迎提交 Issue。

