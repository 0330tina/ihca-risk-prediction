# 🔓 移除 Vercel 密碼保護

如果您的 Vercel 網站需要密碼才能訪問，可以按照以下步驟移除。

---

## 🔍 檢查問題

### 可能的原因：

1. **Vercel 密碼保護（Password Protection）**
   - 專案設定了部署保護
   - 需要輸入密碼才能訪問

2. **專案權限設定**
   - 專案可能是私有的
   - 需要登入 Vercel 才能訪問

---

## ✅ 解決方法

### 方法 1：移除密碼保護（最常見）

1. **前往 Vercel Dashboard**
   - 網址：https://vercel.com
   - 登入您的帳號

2. **選擇您的專案**
   - 點擊專案名稱 `ihca-risk-prediction`

3. **前往 Settings（設定）**
   - 點擊頂部的「Settings」標籤

4. **找到「Deployment Protection」**
   - 在左側選單中找到「Deployment Protection」
   - 或滾動到「Security」區塊

5. **移除密碼保護**
   - 找到「Password Protection」選項
   - 如果已啟用，點擊「Disable」或關閉開關
   - 確認移除

6. **儲存設定**
   - 點擊「Save」按鈕

7. **重新部署（如果需要）**
   - 有時需要重新部署才會生效
   - 可以點擊「Deployments」→ 選擇最新部署 → 「Redeploy」

---

### 方法 2：檢查專案可見性

1. **前往 Settings → General**
   - 在專案設定中

2. **檢查「Visibility」**
   - 確保專案是「Public」（公開）
   - 如果是「Private」，改為「Public」

---

### 方法 3：檢查環境變數

1. **前往 Settings → Environment Variables**
   - 檢查是否有設定 `VERCEL_PASSWORD` 或類似變數
   - 如果有，刪除它

---

## 📋 詳細步驟（圖文說明）

### 步驟 1：登入 Vercel

1. 前往 https://vercel.com
2. 使用 GitHub 帳號登入

### 步驟 2：選擇專案

1. 在 Dashboard 中找到 `ihca-risk-prediction`
2. 點擊專案名稱

### 步驟 3：前往設定

1. 點擊頂部選單的「Settings」
2. 在左側選單中找到「Deployment Protection」

### 步驟 4：移除保護

1. 找到「Password Protection」區塊
2. 如果顯示「Enabled」，點擊「Disable」
3. 確認移除

### 步驟 5：確認

1. 儲存設定
2. 前往您的網站網址
3. 應該可以直接訪問，不需要密碼

---

## 🔧 如果找不到「Deployment Protection」

### 替代方法：

1. **檢查「Security」標籤**
   - 在 Settings 中尋找「Security」
   - 查看是否有密碼保護選項

2. **檢查專案設定**
   - Settings → General
   - 查看是否有「Access Control」或「Visibility」選項

3. **檢查團隊設定**
   - 如果專案屬於團隊，可能需要檢查團隊設定
   - Settings → Team → Security

---

## 💡 免費方案說明

### Vercel Hobby（免費）方案：

- ✅ **預設是公開的**，不需要密碼
- ✅ 任何人都可以訪問您的網站
- ❌ 不支援密碼保護（這是付費功能）

**如果看到密碼保護，可能是：**
- 之前測試時設定的
- 或使用了付費功能試用

---

## 🆘 常見問題

### Q: 找不到「Deployment Protection」選項？

**A:** 
- 免費方案可能沒有這個選項
- 檢查「Security」或「General」設定
- 或直接聯繫 Vercel 支援

### Q: 移除後還是需要密碼？

**A:**
1. 清除瀏覽器快取
2. 使用無痕模式測試
3. 確認已重新部署
4. 等待幾分鐘讓設定生效

### Q: 想要保留密碼保護但給特定人？

**A:**
- 免費方案不支援密碼保護
- 可以考慮使用自訂網域 + 其他保護方式
- 或升級到付費方案

---

## ✅ 完成後

移除密碼保護後：
- ✅ 任何人都可以訪問您的網站
- ✅ 不需要輸入密碼
- ✅ 可以直接分享網址

---

## 📝 快速檢查清單

- [ ] 前往 Vercel Dashboard
- [ ] 選擇專案
- [ ] 前往 Settings → Deployment Protection
- [ ] 移除 Password Protection
- [ ] 儲存設定
- [ ] 測試網站（應該可以直接訪問）

---

## 🎯 總結

**Vercel 免費方案預設是公開的**，如果看到密碼保護：
1. 前往 Settings → Deployment Protection
2. 移除 Password Protection
3. 儲存並測試

完成後，任何人都可以訪問您的網站，不需要密碼！

