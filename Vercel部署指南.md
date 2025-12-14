# 🚀 Vercel 部署完整指南

這份指南會帶您完成網站部署，讓您的專案可以在網路上使用！

---

## 📋 部署步驟（約 2 分鐘）

### 步驟 1：前往 Vercel

1. **開啟瀏覽器**
2. **前往** [https://vercel.com](https://vercel.com)
3. **點擊右上角的「Sign Up」或「Log In」**

---

### 步驟 2：使用 GitHub 登入

1. **選擇「Continue with GitHub」**
2. **授權 Vercel 存取您的 GitHub 帳號**
   - 點擊綠色的「Authorize Vercel」按鈕
   - 這會讓 Vercel 可以讀取您的倉庫

---

### 步驟 3：匯入專案

1. **登入後，點擊「Add New Project」**
   - 或點擊「Import Project」按鈕

2. **在倉庫列表中，找到 `ihca-risk-prediction`**
   - 如果沒看到，點擊「Configure GitHub App」來授權更多倉庫

3. **點擊「Import」按鈕**

---

### 步驟 4：設定專案（通常不需要修改）

Vercel 會自動偵測 Next.js，設定通常已經正確：

- **Framework Preset**: Next.js（自動偵測）
- **Root Directory**: `./`（預設）
- **Build Command**: `npm run build`（自動）
- **Output Directory**: `.next`（自動）
- **Install Command**: `npm install`（自動）

**通常不需要修改任何設定，直接繼續即可！**

---

### 步驟 5：部署

1. **點擊綠色的「Deploy」按鈕**

2. **等待部署完成**（約 1-2 分鐘）
   - 您會看到建置進度
   - 等待所有步驟完成（綠色勾勾）

---

### 步驟 6：完成！

部署完成後，您會看到：

- ✅ **成功訊息**
- 🌐 **您的網站網址**（例如：`https://ihca-risk-prediction.vercel.app`）
- 📊 **部署詳情**

**點擊網址就可以看到您的網站了！** 🎉

---

## ✨ 自動部署功能

**之後每次您更新 GitHub，Vercel 會自動重新部署！**

工作流程：
1. 您修改程式碼
2. 執行 `git push` 推送到 GitHub
3. Vercel 自動偵測到變更
4. 自動重新部署（約 1-2 分鐘）
5. 網站自動更新

**完全自動化，不需要手動操作！**

---

## 🔧 常見問題

### Q: 部署失敗怎麼辦？

**A:** 檢查：
1. 確認 `package.json` 中有正確的 `build` 腳本
2. 確認所有依賴都已正確安裝
3. 查看 Vercel 的錯誤訊息

### Q: 可以修改網址嗎？

**A:** 可以！
1. 前往 Vercel Dashboard
2. 選擇您的專案
3. 點擊「Settings」→「Domains」
4. 可以添加自訂網域或修改專案名稱

### Q: 如何查看部署歷史？

**A:** 
1. 在 Vercel Dashboard 中選擇專案
2. 點擊「Deployments」標籤
3. 可以看到所有部署歷史

### Q: 如何取消部署？

**A:**
1. 在 Vercel Dashboard 中選擇專案
2. 點擊「Settings」→「General」
3. 滾動到底部，點擊「Delete Project」

---

## 📊 Vercel Dashboard 功能

部署完成後，您可以在 Vercel Dashboard 中：

- ✅ **查看部署狀態**
- ✅ **查看網站分析**
- ✅ **管理環境變數**
- ✅ **查看日誌**
- ✅ **設定自訂網域**
- ✅ **查看效能指標**

---

## 🎯 部署後的檢查清單

- [ ] 網站可以正常開啟
- [ ] 輸入頁面 (`/input`) 可以正常顯示
- [ ] 表單可以正常提交
- [ ] API 路由 (`/api/predict`) 可以正常運作
- [ ] 結果頁面 (`/dashboard`) 可以正常顯示
- [ ] 病房看板 (`/ward`) 可以正常顯示

---

## 💡 小技巧

### 預覽部署

每次 push 到 GitHub，Vercel 會：
- 建立一個新的部署
- 給每個部署一個唯一的網址
- 生產環境使用主要網址

### 環境變數

如果需要設定環境變數（例如 API Key）：
1. 前往 Vercel Dashboard
2. 選擇專案 → Settings → Environment Variables
3. 添加變數

---

## 🎉 完成！

部署完成後，您就可以：
- ✅ 在網路上使用您的網站
- ✅ 分享給其他人
- ✅ 自動更新（每次 push 到 GitHub）

**恭喜！您的專案已經上線了！** 🚀

---

## 📞 需要幫助？

如果遇到任何問題：
1. 查看 Vercel 的錯誤訊息
2. 檢查終端機的建置日誌
3. 確認所有檔案都已推送到 GitHub

告訴我您在哪一步遇到問題，我可以協助解決！

