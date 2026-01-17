javascript:(function(){
const path = location.pathname;

/* 注入 CSS：電光藍呼吸燈 + 背景保留 + 跳動指標 */
const style = document.createElement('style');
style.innerHTML = `
    @keyframes tc-bounce-x {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(6px); }
    }
    @keyframes tc-glow-pulse {
        0% { outline-color: rgba(0, 122, 255, 0.4); box-shadow: 0 0 8px rgba(0, 122, 255, 0.3); }
        50% { outline-color: rgba(0, 122, 255, 1); box-shadow: 0 0 20px rgba(0, 122, 255, 0.6); }
        100% { outline-color: rgba(0, 122, 255, 0.4); box-shadow: 0 0 8px rgba(0, 122, 255, 0.3); }
    }
    .tc-highlight-row {
        outline: 4px solid #007AFF !important;
        outline-offset: -4px;
        position: relative;
        z-index: 50 !important;
        animation: tc-glow-pulse 1.5s infinite ease-in-out !important;
        /* 確保背景色（黃/粉）不被覆蓋 */
        background-clip: padding-box; 
    }
    .tc-marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #007AFF !important;
        color: white !important;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        font-weight: bold;
        margin-right: 10px;
        font-size: 14px;
        animation: tc-bounce-x 0.8s infinite ease-in-out;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        vertical-align: middle;
    }
    #tc_enhanced_panel {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #tc_enhanced_panel * { box-sizing: border-box; }
    .tc-btn {
        cursor: pointer;
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 6px;
        font-size: 13px;
        padding: 8px 5px;
        transition: all 0.2s;
        width: 100%;
        display: block;
    }
    .tc-btn:hover { background: #f0f7ff; border-color: #007AFF; }
    .tc-btn-primary {
        background: #007AFF;
        color: white;
        border: none;
        font-weight: bold;
    }
    .tc-btn-primary:hover { background: #005BB7; box-shadow: 0 2px 8px rgba(0,122,255,0.3); }
    .tc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; }
`;
document.head.appendChild(style);

function showMsg(msg, ms=2000){
    let bar = document.getElementById('tc-status-bar');
    if(!bar){
        bar = document.createElement('div');
        bar.id = 'tc-status-bar';
        bar.style.cssText = `position:fixed;top:15px;left:50%;transform:translateX(-50%);padding:8px 16px;background:rgba(0,0,0,0.85);color:#fff;z-index:100001;border-radius:20px;font-size:13px;backdrop-filter:blur(4px);`;
        document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.style.display = 'block';
    setTimeout(()=> bar.style.display='none', ms);
}

if(path.includes('cases_approve') && !path.includes('completetutorlist_new')){
    if(document.getElementById("tc_enhanced_panel")) document.getElementById("tc_enhanced_panel").remove();

    let allRows = [];
    let currentIndex = -1;

    function scanRows() {
        const skipKeywords = ["沒有合適導師", "導師已回覆", "學生已選導師"];
        const rows = Array.from(document.querySelectorAll("tr")).filter(tr => {
            const hasLink = tr.querySelector('a[href*="id="]') !== null;
            const text = tr.innerText;
            const shouldSkip = skipKeywords.some(kw => text.includes(kw));
            return hasLink && !shouldSkip;
        });
        allRows = rows;
        document.getElementById("tc_count_val").innerText = allRows.length;
        showMsg(`掃描完成：${allRows.length} 個待處理`);
    }

    const panel = document.createElement("div");
    panel.id = "tc_enhanced_panel";
    panel.style = `position:fixed;top:80px;right:20px;z-index:9999;background:#fff;border:1px solid #ddd;padding:15px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12);width:220px;display:flex;flex-direction:column;gap:12px;`;
    
    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee;padding-bottom:10px;">
            <div style="font-weight:bold;font-size:15px;color:#333;">個案工具 V2.8</div>
            <div style="font-size:12px;background:#eef5ff;padding:2px 8px;border-radius:10px;color:#007AFF;">剩餘: <span id="tc_count_val">0</span></div>
        </div>
        
        <div style="display:flex; gap:6px;">
            <input id="tc_search" type="text" placeholder="輸入 ID..." style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px;font-size:13px;outline:none;">
            <button id="tc_rescan" class="tc-btn" style="width:40px;" title="重新掃描">🔄</button>
        </div>

        <div class="tc-grid">
            <button id="tc_prev" class="tc-btn">↑ 上一個</button>
            <button id="tc_next" class="tc-btn">↓ 下一個</button>
        </div>

        <button id="tc_copy_phone" class="tc-btn">📋 複製電話號碼</button>

        <button id="tc_go_list" class="tc-btn tc-btn-primary" style="padding:12px;">開啟導師列表 ➤</button>
    `;
    document.body.appendChild(panel);

    function highlightRow(index) {
        if (index < 0 || index >= allRows.length) return;
        
        document.querySelectorAll(".tc-highlight-row").forEach(el => el.classList.remove("tc-highlight-row"));
        document.querySelectorAll(".tc-marker").forEach(el => el.remove());

        const row = allRows[index];
        row.classList.add("tc-highlight-row");
        
        const firstCell = row.cells[0];
        if(firstCell) {
            const marker = document.createElement("span");
            marker.className = "tc-marker";
            marker.innerText = "➤";
            firstCell.prepend(marker);
        }
        
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        
        const idLink = row.querySelector('a[href*="id="]');
        if(idLink) {
            document.getElementById("tc_search").value = idLink.innerText.trim();
        }
    }

    scanRows();

    document.getElementById("tc_rescan").onclick = scanRows;
    document.getElementById("tc_search").oninput = (e) => {
        const val = e.target.value.trim();
        if(val.length < 3) return;
        const fIdx = allRows.findIndex(tr => tr.innerText.includes(val));
        if (fIdx !== -1) { currentIndex = fIdx; highlightRow(currentIndex); }
    };
    document.getElementById("tc_prev").onclick = () => {
        if(currentIndex > 0) { currentIndex--; highlightRow(currentIndex); }
        else showMsg("已是第一個");
    };
    document.getElementById("tc_next").onclick = () => {
        if(currentIndex < allRows.length - 1) { currentIndex++; highlightRow(currentIndex); }
        else showMsg("已到最後一個");
    };
    document.getElementById("tc_copy_phone").onclick = () => {
        if (currentIndex === -1) return alert("請先選中個案");
        const text = allRows[currentIndex].innerText;
        const phoneMatch = text.match(/[456789]\d{7}/);
        if (phoneMatch) {
            navigator.clipboard.writeText(phoneMatch[0]);
            showMsg("✅ 已複製: " + phoneMatch[0]);
        } else alert("找不到電話");
    };
    document.getElementById("tc_go_list").onclick = async () => {
        const id = document.getElementById("tc_search").value.trim();
        if(id) startFetch(id);
        else alert("請輸入 ID");
    };

    async function startFetch(id) {
        showMsg("🚀 正在獲取個案詳情...");
        try {
            const resp = await fetch(`/panel/admin/cases_approve/case.php?id=${id}`);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const detail = doc.getElementById('case_detail');
            if(!detail) throw new Error("無法讀取個案內容");

            let temp = document.createElement("div");
            temp.innerHTML = detail.innerHTML;
            temp.querySelectorAll('.important').forEach(el => { el.prepend("【"); el.append("】"); });
            const content = temp.innerText.split('\n').map(l => l.trim()).filter(l => l).join('\n');

            localStorage.setItem('tc_auto_data', content);
            localStorage.setItem('tc_auto_id', id);
            window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${id}`, "_blank");
        } catch (e) { alert("出錯了: " + e.message); }
    }
} 

if(path.includes('completetutorlist_new.php')){
    const data = localStorage.getItem('tc_auto_data');
    const tid = localStorage.getItem('tc_auto_id');
    const cid = new URLSearchParams(window.location.search).get('id');
    if(data && tid === cid){
        const isMac = /Mac/.test(navigator.platform);
        const ev = { key: "4", keyCode: 52, bubbles: true };
        if (isMac) ev.ctrlKey = true; else ev.altKey = true;
        window.dispatchEvent(new KeyboardEvent('keydown', ev));
        let count = 0;
        const timer = setInterval(() => {
            const root = document.querySelector('my-funcbox-root');
            const tx = root?.shadowRoot?.querySelector('textarea') || document.querySelector('textarea');
            if(tx){
                tx.value = data;
                tx.dispatchEvent(new Event('input', { bubbles: true }));
                localStorage.removeItem('tc_auto_data');
                clearInterval(timer);
                showMsg("✅ 已自動填寫備註");
            }
            if(count++ > 30) clearInterval(timer);
        }, 300);
    }
}
})();
