# 本地測試診斷指南

## ✅ 已驗證的部分
- 後端伺服器：運行在 http://localhost:3000 ✓
- 後端 API 能正常取得留言 ✓
- 按讚功能正常工作 ✓
- CORS 已設定 ✓
- 前端 API_URL 已改為 http://localhost:3000/api/messages ✓

## 🔍 前端測試步驟

### 步驟 1: 強制重新整理頁面
- 按 `Ctrl + F5` (Windows) 或 `Cmd + Shift + R` (Mac)
- 清除快取並重新載入

### 步驟 2: 檢查瀏覽器控制台
1. 按 F12 打開開發工具
2. 切到 **Console** 標籤
3. 尋找以下類型的錯誤：
   - `CORS` 錯誤 → 應該不會有，因為後端已設定
   - `fetch` 失敗 → 檢查 API_URL
   - `JSON 解析` 失敗 → 檢查後端回應格式

### 步驟 3: 檢查網路請求
1. 在 DevTools 中切到 **Network** 標籤
2. 重新整理頁面
3. 尋找 `/api/messages` 的 GET 請求
4. 檢查：
   - 狀態碼應該是 `200`
   - Response 應該是 JSON 陣列
   - 如果是 404，表示 URL 錯誤

### 步驟 4: 手動測試點讚
在控制台執行：
```javascript
const testAction = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/messages/9/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add' })
    });
    const data = await response.json();
    console.log('點讚成功:', data);
  } catch (error) {
    console.error('點讚失敗:', error);
  }
};
testAction();
```

## 🔧 可能的解決方案

| 問題 | 解決方案 |
|------|--------|
| 留言版不顯示 | 1. Ctrl+F5 重新整理 2. 檢查 Console 錯誤 3. 檢查 Network 中的 API 請求 |
| 點讚按鈕不動作 | 檢查 localStorage 是否被禁用 / 檢查 Console 錯誤訊息 |
| API 無法連接 | 確認後端伺服器還在運行（終端應有 server 訊息） |
| 跨網域錯誤 (CORS) | 檢查 index.js 是否有 `app.use(cors())` |

## 📝 提交前的檢查清單
- [ ] 本地測試所有功能正常
- [ ] 按讚可正常增減
- [ ] localStorage 記錄狀態正確
- [ ] 將 API_URL 改回 Render 的正式網址
- [ ] git add / commit / push
