# 🚀 快速開始：GitHub 發布（圖文版）

這份指南用最簡單的方式，帶您完成 GitHub 發布。

---

## 📋 第一步：開啟終端機

### Windows 用戶

1. **找到您的專案資料夾**
   - 路徑：`C:\Users\tina0\OneDrive\桌面\20251214_WEB`
   - 在檔案總管中開啟這個資料夾

2. **在資料夾內空白處**
   - **按住 `Shift` 鍵**
   - **右鍵點擊**
   - **選擇「在此處開啟 PowerShell 視窗」**

3. **會看到一個黑色視窗開啟**
   - 視窗標題或內容應該顯示：`PS C:\Users\tina0\OneDrive\桌面\20251214_WEB>`
   - 這就對了！✅

### Mac 用戶

1. **找到您的專案資料夾**
   - 在 Finder 中開啟專案資料夾

2. **在資料夾內空白處**
   - **按住 `Control` 鍵 + 右鍵點擊**（或雙指點擊觸控板）
   - **選擇「新增位於資料夾位置的終端機視窗」**

3. **終端機會自動開啟**
   - 應該顯示類似：`YourName@MacBook-Pro 20251214_WEB %`
   - 這就對了！✅

---

## 📝 第二步：確認位置

在終端機中輸入以下命令，然後按 `Enter`：

**Windows:**
```powershell
dir
```

**Mac:**
```bash
ls
```

**您應該看到這些檔案/資料夾：**
- `package.json`
- `README.md`
- `app/`
- `lib/`
- `.gitignore`

如果看到了，就表示位置正確！✅

---

## 🔧 第三步：初始化 Git

在終端機中，**一行一行**輸入以下命令，每輸入一行就按 `Enter`：

```bash
git init
```

**預期結果：**
```
Initialized empty Git repository in C:/Users/tina0/OneDrive/桌面/20251214_WEB/.git/
```

---

## 📦 第四步：添加檔案

```bash
git add .
```

**預期結果：**
- 通常不會顯示任何訊息（這是正常的）
- 如果有錯誤訊息，請告訴我

---

## 💾 第五步：第一次提交

```bash
git commit -m "Initial commit: IHCA risk prediction system"
```

**預期結果：**
```
[main (root-commit) xxxxxxx] Initial commit: IHCA risk prediction system
 X files changed, X insertions(+)
```

---

## 🌐 第六步：在 GitHub 創建倉庫

### 6.1 前往 GitHub

1. **開啟瀏覽器**
2. **前往** [https://github.com](https://github.com)
3. **登入您的帳號**（如果沒有帳號，先註冊）

### 6.2 創建新倉庫

1. **點擊右上角的 `+` 圖示**
2. **選擇「New repository」**

3. **填寫資訊：**
   - **Repository name**: `ihca-risk-prediction`（或您喜歡的名稱）
   - **Description**: `非預期心跳驟停風險預測系統`
   - **選擇 Public 或 Private**
   - **⚠️ 重要：不要勾選以下選項：**
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license

4. **點擊綠色的「Create repository」按鈕**

### 6.3 記下您的資訊

創建完成後，GitHub 會顯示一個頁面，上面有：
- 您的用戶名（例如：`your-username`）
- 倉庫名稱（例如：`ihca-risk-prediction`）

**記下這些資訊，等一下會用到！**

---

## 🔗 第七步：連接並推送

回到終端機，執行以下命令（**記得替換成您的資訊**）：

```bash
git remote add origin https://github.com/您的用戶名/倉庫名稱.git
```

**例如：**
```bash
git remote add origin https://github.com/tina0/ihca-risk-prediction.git
```

然後：

```bash
git branch -M main
```

最後：

```bash
git push -u origin main
```

### 如果要求輸入帳號密碼：

1. **用戶名**：輸入您的 GitHub 用戶名
2. **密碼**：**不要輸入 GitHub 密碼**，而是使用 Personal Access Token

#### 如何取得 Token：

1. 前往 GitHub → 右上角頭像 → **Settings**
2. 左側選單最下方 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. **Note**: 輸入 `Git Push`（隨便取個名字）
6. **Expiration**: 選擇期限（建議 90 天）
7. **勾選 `repo` 權限**
8. **點擊「Generate token」**
9. **複製顯示的 token**（只會顯示一次！）
10. **回到終端機，貼上這個 token 作為密碼**

---

## ✅ 完成！

如果看到類似這樣的訊息：

```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), done.
To https://github.com/您的用戶名/倉庫名稱.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**恭喜！您的專案已經上傳到 GitHub 了！** 🎉

---

## 🌐 查看您的倉庫

前往：
```
https://github.com/您的用戶名/倉庫名稱
```

您應該能看到所有檔案都已經上傳了！

---

## 🚀 下一步：部署到線上

### 使用 Vercel（推薦，免費）

1. **前往** [https://vercel.com](https://vercel.com)
2. **使用 GitHub 帳號登入**
3. **點擊「Add New Project」**
4. **選擇您的倉庫**
5. **點擊「Deploy」**
6. **等待 1-2 分鐘**
7. **完成！會獲得一個網址，例如：`https://your-project.vercel.app`**

---

## 🆘 遇到問題？

### 問題：`git: command not found`
**解決方法：** 需要先安裝 Git
- Windows: 下載 [Git for Windows](https://git-scm.com/download/win)
- Mac: `brew install git` 或從官網下載

### 問題：推送時認證失敗
**解決方法：** 使用 Personal Access Token（見上方說明）

### 問題：找不到資料夾
**解決方法：** 
- 在 VS Code 中，右鍵點擊專案資料夾 → 「在終端機中開啟」
- 或使用檔案總管，在位址列輸入 `powershell` 然後按 Enter

---

## 📞 需要幫助？

如果遇到任何問題，請告訴我：
- 您在哪一步遇到問題
- 終端機顯示的錯誤訊息
- 您的作業系統（Windows/Mac）

我會協助您解決！💪

