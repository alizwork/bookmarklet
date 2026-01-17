javascript:(function(){
const path = location.pathname;

// ----------- 通用工具：顯示訊息 -----------
function showMsg(msg, ms=2000){
    let bar = document.getElementById('tc-status-bar');
    if(!bar){
        bar = document.createElement('div');
        bar.id = 'tc-status-bar';
        bar.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(0,0,0,0.8);color:#fff;z-index:100001;border-radius:50px;font-size:14px;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:all 0.3s;`;
        document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.style.display = 'block';
    setTimeout(()=> bar.style.display='none', ms);
}

// ----------- 邏輯 A：個案列表頁 (搜尋、導航、高亮、複製、爬取) -----------
if(path.includes('cases_approve') && !path.includes('completetutorlist_new')){
    if(document.getElementById("tc_enhanced_panel")) document.getElementById("tc_enhanced_panel").remove();

    // 建立面板
    const panel = document.createElement("div");
    panel.id = "tc_enhanced_panel";
    panel.style = `position:fixed;top:80px;right:20px;z-index:9999;background:#ffffff;border:2px solid #ff8a00;padding:15px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.2);width:260px;display:flex;flex-direction:column;gap:12px;font-family:system-ui, -apple-system, sans-serif;`;
    
    panel.innerHTML = `
        <div style="font-weight:bold;color:#ff8a00;font-size:18px;border-bottom:1px solid #eee;padding-bottom:8px;">個案全功能工具箱</div>
        
        <div style="display:flex;flex-direction:column;gap:5px;">
            <label style="font-size:12px;color:#666;">搜尋個案 (輸入 ID 或關鍵字)</label>
            <input id="tc_search" type="text" placeholder="例如: TC12345" style="padding:10px;border:2px solid #ddd;border-radius:6px;outline:none;font-size:14px;">
        </div>

        <div style="display:flex;gap:8px;">
            <button id="tc_prev" style="flex:1;padding:8px;background:#f0f0f0;border:1px solid #ccc;border-radius:6px;cursor:pointer;font-weight:bold;">↑ 上一個</button>
            <button id="tc_next" style="flex:1;padding:8px;background:#f0f0f0;border:1px solid #ccc;border-radius:6px;cursor:pointer;font-weight:bold;">↓ 下一個</button>
        </div>

        <button id="tc_copy_phone" style="padding:10px;background:#5bc0de;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:bold;transition:0.2s;">📋 複製當前電話</button>
        
        <button id="tc_go_list" style="padding:12px;background:#ff8a00;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:15px;box-shadow:0 4px 0 #d37200;margin-top:5px;">🚀 爬取並開啟導師列表</button>
        
        <div id="tc_status_info" style="font-size:12px;color:#888;text-align:center;margin-top:5px;">尚未選中個案</div>
    `;
    document.body.appendChild(panel);

    // 獲取所有包含 TC 的行
    let allRows = Array.from(document.querySelectorAll("tr")).filter(tr => tr.innerText.includes('TC'));
    let currentIndex = -1;

    // 高亮功能
    function highlightRow(index) {
        allRows.forEach(tr => {
            tr.style.backgroundColor = "";
            tr.style.outline = "";
            tr.style.position = "";
            tr.style.zIndex = "";
        });

        if (index >= 0 && index < allRows.length) {
            const row = allRows[index];
            row.style.backgroundColor = "#fff3e0"; // 淺橘色背景
            row.style.outline = "3px solid #ff8a00"; // 橘色粗邊框
            row.style.position = "relative";
            row.style.zIndex = "10";
            row.scrollIntoView({ behavior: "smooth", block: "center" });
            
            // 更新狀態資訊
            const caseIdLink = row.querySelector('a[href*="id="]');
            const caseId = caseIdLink ? caseIdLink.innerText.trim() : "未知";
            document.getElementById("tc_status_info").innerHTML = `當前選中: <b style="color:#ff8a00">${caseId}</b> (${index + 1}/${allRows.length})`;
            
            // 同步更新搜尋框內容
            if(caseId !== "未知") document.getElementById("tc_search").value = caseId;
        }
    }

    // 1. 搜尋功能
    document.getElementById("tc_search").oninput = (e) => {
        const val = e.target.value.trim().toLowerCase();
        if(!val) return;
        const foundIndex = allRows.findIndex(tr => tr.innerText.toLowerCase().includes(val));
        if (foundIndex !== -1) {
            currentIndex = foundIndex;
            highlightRow(currentIndex);
        }
    };

    // 2. 上下移動功能
    document.getElementById("tc_prev").onclick = () => {
        if (currentIndex > 0) {
            currentIndex--;
            highlightRow(currentIndex);
        }
    };
    document.getElementById("tc_next").onclick = () => {
        if (currentIndex < allRows.length - 1) {
            currentIndex++;
            highlightRow(currentIndex);
        }
    };

    // 3. 複製電話功能
    document.getElementById("tc_copy_phone").onclick = () => {
        if (currentIndex === -1) return alert("請先選中一個個案");
        const row = allRows[currentIndex];
        // 匹配香港 8 位電話號碼 (5/6/9 開頭)
        const phoneMatch = row.innerText.match(/[569]\d{7}/);
        if (phoneMatch) {
            navigator.clipboard.writeText(phoneMatch[0]);
            showMsg("✅ 已複製電話: " + phoneMatch[0]);
        } else {
            alert("在此行中找不到電話號碼");
        }
    };

    // 4. 爬取並跳轉功能
    document.getElementById("tc_go_list").onclick = async () => {
        const caseIdInput = document.getElementById("tc_search").value.trim();
        if(!caseIdInput) return alert("請輸入或選中一個 Case ID");

        showMsg("正在爬取個案內容...");
        try {
            // 嘗試從當前行獲取 ID，如果沒有則用輸入框的
            let finalId = caseIdInput;
            const resp = await fetch(`/panel/admin/cases_approve/case.php?id=${finalId}`);
            const html = await resp.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const detailEl = doc.getElementById('case_detail');
            
            if(!detailEl) throw new Error("找不到個案詳細內容，請確認 ID 是否正確");

            // 處理內容：保留 important 標籤的括號
            let temp = document.createElement("div");
            temp.innerHTML = detailEl.innerHTML;
            temp.querySelectorAll('.important').forEach(el => {
                el.prepend("【");
                el.append("】");
            });
            const content = (temp.innerText || temp.textContent).split('\n').map(l => l.trim()).filter(l => l).join('\n');

            // 存入 localStorage
            localStorage.setItem('tc_auto_fill_data', content);
            localStorage.setItem('tc_auto_fill_id', finalId);

            showMsg("資料就緒！開啟導師列表...");
            window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${finalId}`, "_blank");
        } catch (err) {
            alert("爬取失敗: " + err.message);
        }
    };
} 

// ----------- 邏輯 B：導師列表頁 (自動偵測並填表) -----------
if(path.includes('completetutorlist_new.php')){
    const pendingData = localStorage.getItem('tc_auto_fill_data');
    const pendingId = localStorage.getItem('tc_auto_fill_id');
    const currentId = new URLSearchParams(window.location.search).get('id');

    if(pendingData && pendingId === currentId){
        showMsg("檢測到待處理個案，正在自動填入...", 3000);
        
        // 觸發 Alt+4
        const isMac = /Mac/.test(navigator.platform);
        const eventInit = { key: "4", code: "Digit4", keyCode: 52, which: 52, bubbles: true, cancelable: true };
        if (isMac) eventInit.ctrlKey = true; else eventInit.altKey = true;
        window.dispatchEvent(new KeyboardEvent('keydown', eventInit));

        // 循環檢查輸入框是否出現並填入
        let attempts = 0;
        const fillInterval = setInterval(() => {
            const root = document.querySelector('my-funcbox-root');
            let textarea = root?.shadowRoot?.querySelector('textarea') || document.querySelector('textarea');
            
            if(textarea){
                textarea.value = pendingData;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                showMsg("✅ 資料已自動填入！");
                
                localStorage.removeItem('tc_auto_fill_data');
                localStorage.removeItem('tc_auto_fill_id');
                clearInterval(fillInterval);
            }
            if(attempts++ > 40) clearInterval(fillInterval); 
        }, 200);
    }
}
})();
