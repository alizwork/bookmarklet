javascript:(function(){
const path = location.pathname;

// ----------- 通用工具 -----------
function showMsg(msg, ms=2000){
    let bar = document.getElementById('tc-status-bar');
    if(!bar){
        bar = document.createElement('div');
        bar.id = 'tc-status-bar';
        bar.style.cssText = `position:fixed;top:10px;left:50%;transform:translateX(-50%);padding:10px 20px;background:#333;color:#fff;z-index:100000;border-radius:8px;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.3);`;
        document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.style.display = 'block';
    setTimeout(()=> bar.style.display='none', ms);
}

function htmlToPlainText(html) {
    let temp = document.createElement("div");
    temp.innerHTML = html;
    temp.querySelectorAll('.important').forEach(el => {
        el.prepend("【");
        el.append("】");
    });
    return (temp.innerText || temp.textContent).split('\n').map(l => l.trim()).filter(l => l).join('\n');
}

// ----------- 邏輯 A：個案列表頁 (Search, Nav, Copy, Jump) -----------
if(path.includes('cases_approve') && !path.includes('completetutorlist_new')){
    if(document.getElementById("tc_control_panel")) document.getElementById("tc_control_panel").remove();

    const panel = document.createElement("div");
    panel.id = "tc_control_panel";
    panel.style = `position:fixed;top:60px;right:20px;z-index:9999;background:#fff;border:2px solid #ff8a00;padding:15px;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.2);width:220px;display:flex;flex-direction:column;gap:10px;font-family:sans-serif;`;
    
    panel.innerHTML = `
        <div style="font-weight:bold;color:#ff8a00;font-size:16px;">個案控制台</div>
        <input id="tc_search" type="text" placeholder="輸入 Case ID 搜尋..." style="padding:8px;border:1px solid #ccc;border-radius:4px;">
        <div style="display:flex;gap:5px;">
            <button id="tc_prev" style="flex:1;padding:5px;background:#eee;border:1px solid #ccc;cursor:pointer;">↑ 上一個</button>
            <button id="tc_next" style="flex:1;padding:5px;background:#eee;border:1px solid #ccc;cursor:pointer;">↓ 下一個</button>
        </div>
        <button id="tc_copy_phone" style="padding:8px;background:#5bc0de;color:white;border:none;border-radius:4px;cursor:pointer;">複製此案電話</button>
        <button id="tc_go_list" style="padding:10px;background:#ff8a00;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">爬取並開啟導師列表</button>
        <div id="tc_info" style="font-size:12px;color:#666;"></div>
    `;
    document.body.appendChild(panel);

    let allRows = Array.from(document.querySelectorAll("tr")).filter(tr => tr.innerText.includes('TC'));
    let currentIndex = -1;

    function highlightRow(index) {
        allRows.forEach(tr => {
            tr.style.backgroundColor = "";
            tr.style.outline = "";
        });
        if (index >= 0 && index < allRows.length) {
            const row = allRows[index];
            row.style.backgroundColor = "#fff3e0";
            row.style.outline = "2px solid #ff8a00";
            row.scrollIntoView({ behavior: "smooth", block: "center" });
            
            const caseIdLink = row.querySelector('a[href*="id="]');
            if(caseIdLink) {
                document.getElementById("tc_search").value = caseIdLink.innerText.trim();
                document.getElementById("tc_info").textContent = `選中案號: ${caseIdLink.innerText.trim()}`;
            }
        }
    }

    // 搜尋功能
    document.getElementById("tc_search").oninput = (e) => {
        const val = e.target.value.trim();
        const foundIndex = allRows.findIndex(tr => tr.innerText.includes(val));
        if (foundIndex !== -1) {
            currentIndex = foundIndex;
            highlightRow(currentIndex);
        }
    };

    // 上下移動
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

    // 複製電話 (假設電話在包含 8 位數字的單元格中)
    document.getElementById("tc_copy_phone").onclick = () => {
        if (currentIndex === -1) return alert("請先選中一個個案");
        const row = allRows[currentIndex];
        const text = row.innerText;
        const phoneMatch = text.match(/[569]\d{7}/); // 匹配香港手機號格式
        if (phoneMatch) {
            navigator.clipboard.writeText(phoneMatch[0]);
            showMsg("已複製電話: " + phoneMatch[0]);
        } else {
            alert("找不到電話號碼");
        }
    };

    // 核心：爬取並跳轉
    document.getElementById("tc_go_list").onclick = async () => {
        const caseId = document.getElementById("tc_search").value.trim();
        if(!caseId) return alert("請輸入或選中 Case ID");

        showMsg("正在爬取個案內容...");
        try {
            const resp = await fetch(`/panel/admin/cases_approve/case.php?id=${caseId}`);
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const detailEl = doc.getElementById('case_detail');
            
            if(!detailEl) throw new Error("找不到個案內容");
            const content = htmlToPlainText(detailEl.innerHTML);

            // 將資料存入 localStorage，讓新分頁讀取
            localStorage.setItem('tc_auto_fill_data', content);
            localStorage.setItem('tc_auto_fill_id', caseId);

            showMsg("資料已就緒，跳轉中...");
            window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${caseId}`, "_blank");
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

    // 檢查是否是剛才從列表頁跳轉過來的對應 ID
    if(pendingData && pendingId === currentId){
        showMsg("檢測到待處理資料，正在開啟工具箱...");
        
        // 1. 模擬 Alt+4 觸發您的 Part 2 UI
        const isMac = /Mac/.test(navigator.platform);
        const eventInit = { key: "4", code: "Digit4", keyCode: 52, which: 52, bubbles: true, cancelable: true };
        if (isMac) eventInit.ctrlKey = true; else eventInit.altKey = true;
        window.dispatchEvent(new KeyboardEvent('keydown', eventInit));

        // 2. 等待並填入資料
        let attempts = 0;
        const fillInterval = setInterval(() => {
            const root = document.querySelector('my-funcbox-root');
            let textarea = root?.shadowRoot?.querySelector('textarea') || document.querySelector('textarea');
            
            if(textarea){
                textarea.value = pendingData;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                showMsg("資料已自動填入！", 3000);
                
                // 清除暫存，避免重新整理頁面時重複觸發
                localStorage.removeItem('tc_auto_fill_data');
                localStorage.removeItem('tc_auto_fill_id');
                clearInterval(fillInterval);
            }
            if(attempts++ > 30) clearInterval(fillInterval); // 最多等 6 秒
        }, 200);
    }
}
})();
