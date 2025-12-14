# 🔑 如何取得 GitHub Personal Access Token

這份指南會詳細說明如何在 GitHub 上找到並建立 Personal Access Token。

---

## 📍 方法 1：直接連結（最快）

**直接點擊這個連結：**
```
https://github.com/settings/tokens
```

如果已登入 GitHub，會直接進入 Token 設定頁面。

---

## 🗺️ 方法 2：逐步導航

### 步驟 1：進入設定頁面

1. **登入 GitHub**（如果還沒登入）

2. **點擊右上角的頭像**（您的個人資料照片）

3. **在下拉選單中，點擊「Settings」**

   ![示意：頭像 → Settings]

### 步驟 2：找到 Developer settings

在 Settings 頁面的**左側選單**中：

1. **向下滾動**，找到最下方的選項

2. **找到「Developer settings」**（通常在選單最底部）

   - 如果沒看到，繼續向下滾動
   - 或者按 `Ctrl + F` 搜尋 "Developer"

3. **點擊「Developer settings」**

### 步驟 3：進入 Personal access tokens

在 Developer settings 頁面：

1. **左側選單中，點擊「Personal access tokens」**

2. **選擇「Tokens (classic)」**（經典版本，比較常用）

   - 或者選擇「Fine-grained tokens」（新版本，更細緻的權限控制）

---

## 🎯 方法 3：使用搜尋功能

1. **在 GitHub 任何頁面，按 `Ctrl + K`**（或 `Cmd + K` on Mac）

2. **輸入「token」或「personal access token」**

3. **選擇相關選項**

---

## ✨ 建立 Token 的完整步驟

### 1. 進入 Token 建立頁面

使用以下任一方法：
- 直接連結：https://github.com/settings/tokens/new
- 或從 Developer settings → Personal access tokens → Tokens (classic) → Generate new token

### 2. 填寫 Token 資訊

**Note（名稱）**：
```
Git Push Token
```
或任何您喜歡的名稱

**Expiration（有效期限）**：
- 選擇 `90 days`（建議）
- 或 `No expiration`（永不過期，但較不安全）

**Select scopes（選擇權限）**：
- ✅ **勾選 `repo`**（這是最重要的！）
  - 這會自動勾選所有 repo 相關的子選項

### 3. 生成 Token

1. **向下滾動到頁面底部**

2. **點擊綠色的「Generate token」按鈕**

3. **⚠️ 重要：立即複製 Token！**
   - Token 只會顯示一次
   - 如果關閉頁面就看不到了
   - 建議先複製到記事本保存

### 4. 使用 Token

在終端機執行 `git push` 時：

- **Username（用戶名）**：輸入您的 GitHub 用戶名
- **Password（密碼）**：**貼上剛才複製的 Token**（不是您的 GitHub 密碼！）

---

## 🆘 找不到 Developer settings 的解決方法

### 問題 1：選單太長，找不到

**解決方法：**
- 使用瀏覽器的搜尋功能：`Ctrl + F`，輸入 "Developer"
- 或直接使用連結：https://github.com/settings/tokens

### 問題 2：沒有看到 Developer settings 選項

**可能原因：**
- 您使用的是組織帳號（Organization account）
- 或帳號權限限制

**解決方法：**
- 使用個人帳號（Personal account）
- 或直接使用連結：https://github.com/settings/tokens

### 問題 3：頁面顯示不同

**GitHub 有時會更新介面，如果找不到：**

1. **直接使用連結：**
   ```
   https://github.com/settings/tokens
   ```

2. **或搜尋：**
   - 在 GitHub 搜尋框輸入 "personal access token"
   - 或 Google 搜尋 "GitHub personal access token"

---

## 🔗 快速連結總整理

- **Token 列表頁面**：https://github.com/settings/tokens
- **建立新 Token**：https://github.com/settings/tokens/new
- **Settings 首頁**：https://github.com/settings/profile

---

## 💡 替代方案：使用 SSH Key（進階）

如果您熟悉 SSH，也可以使用 SSH Key 代替 Token：

1. 生成 SSH Key
2. 添加到 GitHub
3. 使用 SSH URL 連接倉庫

但對於初學者，**Personal Access Token 更簡單**。

---

## ✅ 完成後

當您成功建立 Token 後：

1. **保存 Token**（建議存到安全的地方）
2. **回到終端機**
3. **執行 `git push -u origin main`**
4. **輸入用戶名和 Token**（作為密碼）

---

## 📸 視覺化路徑

```
GitHub 首頁
  ↓
點擊右上角頭像
  ↓
選擇「Settings」
  ↓
左側選單向下滾動
  ↓
找到「Developer settings」（最底部）
  ↓
點擊「Personal access tokens」
  ↓
選擇「Tokens (classic)」
  ↓
點擊「Generate new token (classic)」
  ↓
填寫資訊並生成
  ↓
複製 Token ✅
```

---

## 🎯 最簡單的方法

**直接複製這個連結到瀏覽器：**
```
https://github.com/settings/tokens/new
```

這會直接帶您到建立 Token 的頁面！

---

如果還是找不到，請告訴我您看到什麼畫面，我可以提供更具體的協助！💪

