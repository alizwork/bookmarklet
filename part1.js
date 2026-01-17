javascript:(function(){
const path = location.pathname;

// ----------- 工具函數 -----------
function showMsg(msg, ms=2000){
  let bar = document.getElementById('tc-status-bar');
  if(!bar){
    bar = document.createElement('div');
    bar.id = 'tc-status-bar';
    bar.style.cssText = `position:fixed;top:10px;left:50%;transform:translateX(-50%);padding:10px 20px;background:rgba(0,0,0,0.8);color:#fff;z-index:100000;border-radius:8px;font-size:16px;`;
    document.body.appendChild(bar);
  }
  bar.textContent = msg;
  bar.style.display = 'block';
  setTimeout(()=> bar.style.display='none', ms);
}

function htmlToPlainText(html) {
  let temp = document.createElement("div");
  temp.innerHTML = html;
  // 處理特定標籤
  temp.querySelectorAll('.important').forEach(el => el.prepend("【"));
  temp.querySelectorAll('.important').forEach(el => el.append("】"));
  let text = temp.innerText || temp.textContent;
  return text.split('\n').map(l => l.trim()).filter(l => l).join('\n');
}

// ----------- 主程式 -----------

// 判斷是否在「個案列表頁」
if(path.includes('cases_approve') && !path.includes('completetutorlist_new')){
  
  // 1. 建立 UI
  if(document.getElementById("tc_case_box")) document.getElementById("tc_case_box").remove();
  const box = document.createElement("div");
  box.id = "tc_case_box";
  box.style = `position:fixed;top:60px;right:20px;z-index:9999;background:#fff;border:2px solid #ff8a00;padding:20px;border-radius:15px;box-shadow:0 4px 15px rgba(0,0,0,0.2);display:flex;flex-direction:column;gap:10px;`;
  
  box.innerHTML = `
    <div style="font-weight:bold;color:#ff8a00;margin-bottom:5px;">個案工具箱 (Part 1)</div>
    <input id="tc_id_input" type="text" placeholder="輸入 Case ID" style="padding:8px;border:1px solid #ccc;border-radius:5px;width:150px;">
    <button id="tc_btn_go" style="padding:10px;background:#ff8a00;color:white;border:none;border-radius:5px;cursor:pointer;font-weight:bold;">爬取並開啟導師列表</button>
  `;
  document.body.appendChild(box);

  const input = box.querySelector("#tc_id_input");
  
  // 自動填入當前選中的 ID (如果有)
  input.oninput = () => {
    document.querySelectorAll("tr").forEach(tr => tr.style.outline = "");
    const targetA = Array.from(document.querySelectorAll("a")).find(a => a.innerText.trim() === input.value);
    if(targetA) targetA.closest("tr").style.outline = "2px solid #ff8a00";
  };

  // 2. 點擊按鈕後的邏輯
  box.querySelector("#tc_btn_go").onclick = async () => {
    const caseId = input.value.trim();
    if(!caseId) return alert("請輸入 Case ID");

    showMsg("正在爬取個案資料...");

    try {
      // A. 爬取資料
      const resp = await fetch(`/panel/admin/cases_approve/case.php?id=${caseId}`);
      const html = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const detailEl = doc.getElementById('case_detail');
      
      if(!detailEl) throw new Error("找不到個案內容");
      const content = htmlToPlainText(detailEl.innerHTML);

      // B. 開啟新分頁
      showMsg("資料已取得，正在開啟導師列表...");
      const targetUrl = `/panel/admin/cases_approve/completetutorlist_new.php?id=${caseId}`;
      const newWin = window.open(targetUrl, "_blank");

      if(!newWin) {
        alert("分頁被攔截，請允許彈出視窗");
        return;
      }

      // C. 關鍵：在新分頁載入後注入動作
      const checkLoad = setInterval(() => {
        try {
          // 檢查新分頁是否載入完成
          if (newWin.document.readyState === 'complete' && newWin.location.href.includes(caseId)) {
            clearInterval(checkLoad);
            
            showMsg("正在新分頁觸發工具箱...");

            // 執行新分頁中的動作
            setTimeout(() => {
              // 1. 觸發 Alt+4 (呼叫 Part 2)
              const isMac = /Mac/.test(newWin.navigator.platform);
              const eventInit = { key: "4", code: "Digit4", keyCode: 52, which: 52, bubbles: true, cancelable: true };
              if (isMac) eventInit.ctrlKey = true; else eventInit.altKey = true;
              newWin.dispatchEvent(new newWin.KeyboardEvent('keydown', eventInit));

              // 2. 等待 Textarea 出現並填值
              let retry = 0;
              const fillData = setInterval(() => {
                const root = newWin.document.querySelector('my-funcbox-root');
                let textarea = null;
                if (root && root.shadowRoot) {
                  textarea = root.shadowRoot.querySelector('textarea');
                } else {
                  textarea = newWin.document.querySelector('textarea');
                }

                if (textarea) {
                  textarea.value = content;
                  textarea.dispatchEvent(new newWin.Event('input', { bubbles: true }));
                  clearInterval(fillData);
                  showMsg("完成！資料已填入新分頁");
                }
                
                if (retry++ > 50) clearInterval(fillData);
              }, 200);
            }, 500); // 給予一點緩衝時間
          }
        } catch (e) {
          // 跨網域安全限制可能會暫時報錯，忽略它直到頁面載入
        }
      }, 500);

    } catch (err) {
      console.error(err);
      alert("失敗: " + err.message);
    }
  };
} else {
  showMsg("請在「個案列表頁」執行此書籤");
}
})();
