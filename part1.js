javascript:(function(){
const path = location.pathname;

/* 注入優化後的 CSS */
const style = document.createElement('style');
style.id = 'tc_enhanced_style'; /* 增加 ID 方便完全移除 */
style.innerHTML = `
    :root {
        --tc-primary: #007AFF;
        --tc-primary-dark: #005BB7;
        --tc-secondary: #00B4D8;
        --tc-secondary-dark: #0077B6;
        --tc-gradient-blue: linear-gradient(135deg, #007AFF 0%, #005BB7 100%);
        --tc-gradient-teal: linear-gradient(135deg, #08D9D6 0%, #00ADB5 100%);
        --tc-bg: rgba(255, 255, 255, 0.98);
        --tc-shadow: 0 12px 40px rgba(0,0,0,0.18);
        --tc-radius: 16px;
        --tc-border: 1px solid #d1d1d6;
    }
    @keyframes tc-bounce-x {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(5px); }
    }
    @keyframes tc-glow-pulse {
        0% { box-shadow: 0 0 5px rgba(0, 122, 255, 0.2); border-color: rgba(0, 122, 255, 0.4); }
        50% { box-shadow: 0 0 15px rgba(0, 122, 255, 0.6); border-color: rgba(0, 122, 255, 0.8); }
        100% { box-shadow: 0 0 5px rgba(0, 122, 255, 0.2); border-color: rgba(0, 122, 255, 0.4); }
    }
    .tc-highlight-row {
        outline: 3px solid var(--tc-primary) !important;
        outline-offset: -3px;
        position: relative;
        z-index: 50 !important;
        animation: tc-glow-pulse 2s infinite ease-in-out !important;
        background-clip: padding-box; 
    }
    .tc-marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--tc-gradient-blue) !important;
        color: white !important;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        font-weight: bold;
        margin-right: 12px;
        font-size: 12px;
        animation: tc-bounce-x 0.8s infinite ease-in-out;
        box-shadow: 0 2px 6px rgba(0,122,255,0.3);
        vertical-align: middle;
    }
    #tc_enhanced_panel {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: var(--tc-border) !important;
        position: relative;
    }
    #tc_enhanced_panel * { box-sizing: border-box; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
    
    /* 關閉按鈕樣式 */
    .tc-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8e8e93;
        font-size: 16px;
        border-radius: 50%;
        z-index: 10;
    }
    .tc-close-btn:hover {
        background: rgba(0,0,0,0.05);
        color: #333;
    }

    .tc-btn {
        cursor: pointer;
        border: 1px solid #d1d1d6;
        background: #fff;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        padding: 10px 5px;
        color: #444;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    .tc-btn:hover { 
        background: #f2f2f7; 
        border-color: var(--tc-primary); 
        color: var(--tc-primary);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .tc-btn:active { transform: translateY(0); }
    
    .tc-btn-primary {
        background: var(--tc-gradient-blue);
        color: white;
        border: none;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,122,255,0.3);
    }
    .tc-btn-primary:hover { 
        background: var(--tc-gradient-blue);
        color: white;
        box-shadow: 0 6px 20px rgba(0,122,255,0.4);
        filter: brightness(1.05);
    }

    .tc-btn-teal {
        background: var(--tc-gradient-teal);
        color: white;
        border: none;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,173,181,0.2);
    }
    .tc-btn-teal:hover {
        background: var(--tc-gradient-teal);
        color: white;
        box-shadow: 0 6px 20px rgba(0,173,181,0.3);
        filter: brightness(1.05);
    }
    
    .tc-input {
        width: 100%;
        padding: 10px 12px;
        border: 1.5px solid #d1d1d6;
        border-radius: 10px;
        font-size: 14px;
        outline: none;
        background: #fff;
    }
    .tc-input:focus {
        border-color: var(--tc-primary);
        box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
    }
    .tc-badge {
        font-size: 11px;
        background: rgba(0,122,255,0.1);
        padding: 3px 10px;
        border-radius: 20px;
        color: var(--tc-primary);
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    .tc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
`;
document.head.appendChild(style);

function showMsg(msg, ms=2000){
    let bar = document.getElementById('tc-status-bar');
    if(!bar){
        bar = document.createElement('div');
        bar.id = 'tc-status-bar';
        bar.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:rgba(0,0,0,0.85);color:#fff;z-index:100001;border-radius:12px;font-size:14px;backdrop-filter:blur(8px);box-shadow:0 10px 30px rgba(0,0,0,0.3);font-weight:500;`;
        document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.style.display = 'block';
    setTimeout(()=> { if(bar) bar.style.display='none'; }, ms);
}

async function copyAndGo(id) {
    if(!id) return alert("請輸入 ID");
    showMsg("⏳ 正在讀取個案詳情...");
    
    try {
        const resp = await fetch(`/panel/admin/cases_approve/case.php?id=${id}`);
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const detail = doc.getElementById('case_detail');
        
        if(!detail) throw new Error("找不到個案內容，請檢查 ID 是否正確");

        let temp = document.createElement("div");
        temp.innerHTML = detail.innerHTML;
        temp.querySelectorAll('.important').forEach(el => { 
            el.innerText = `【${el.innerText.trim()}】`; 
        });
        const content = temp.innerText.split('\n').map(l => l.trim()).filter(l => l).join('\n');

        const textArea = document.createElement("textarea");
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showMsg("✅ 已複製到剪貼簿，正在開啟列表...");

        setTimeout(() => {
            window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${id}`, "_blank");
        }, 500);

    } catch (e) {
        alert("出錯了: " + e.message);
    }
}

if(path.includes('cases_approve') && !path.includes('completetutorlist')){
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
        const countVal = document.getElementById("tc_count_val");
        if(countVal) countVal.innerText = allRows.length;
        showMsg(`🔍 掃描完成：${allRows.length} 個待處理`);
    }

    const panel = document.createElement("div");
    panel.id = "tc_enhanced_panel";
    panel.style = `position:fixed;top:30px;right:30px;z-index:9999;background:var(--tc-bg);padding:20px;border-radius:var(--tc-radius);box-shadow:var(--tc-shadow);width:240px;display:flex;flex-direction:column;gap:12px;`;
    
    panel.innerHTML = `
        <div id="tc_close_tool" class="tc-close-btn" title="關閉並還原網頁">✕</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;padding-right:20px;">
            <div style="font-weight:800;font-size:16px;color:#1d1d1f;letter-spacing:-0.5px;">個案工具</div>
            <div class="tc-badge">剩餘 <span id="tc_count_val">0</span></div>
        </div>
        
        <div style="display:flex; gap:8px;">
            <input id="tc_search" class="tc-input" type="text" placeholder="輸入個案 ID...">
            <button id="tc_rescan" class="tc-btn" style="width:45px; flex-shrink:0;" title="重新掃描">🔄</button>
        </div>

        <div class="tc-grid">
            <button id="tc_prev" class="tc-btn">上一個</button>
            <button id="tc_next" class="tc-btn">下一個</button>
        </div>

        <button id="tc_copy_phone" class="tc-btn" style="width:100%;">
            <span>📋</span> 複製電話號碼
        </button>

        <div class="tc-grid" style="margin-top:5px;">
            <button id="tc_old_link" class="tc-btn tc-btn-teal">舊 Link</button>
            <button id="tc_new_link" class="tc-btn tc-btn-primary">新 Link</button>
        </div>

        <button id="tc_go_list" class="tc-btn tc-btn-primary" style="padding:14px; background: #1d1d1f; color: white;">
            開啟並讀取 ➤
        </button>
    `;
    document.body.appendChild(panel);

    /* 關閉按鈕：完全還原網頁 */
    document.getElementById("tc_close_tool").onclick = () => {
        /* 1. 移除高亮類名 */
        document.querySelectorAll(".tc-highlight-row").forEach(el => el.classList.remove("tc-highlight-row"));
        /* 2. 移除 ID 指示器 */
        document.querySelectorAll(".tc-marker").forEach(el => el.remove());
        /* 3. 移除面板 */
        panel.remove();
        /* 4. 移除注入的 Style 標籤 */
        const s = document.getElementById('tc_enhanced_style');
        if(s) s.remove();
        /* 5. 移除狀態列 */
        const b = document.getElementById('tc-status-bar');
        if(b) b.remove();
    };

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
            marker.innerText = "ID";
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
        if(val.length < 4) return;
        const fIdx = allRows.findIndex(tr => tr.innerText.includes(val));
        if (fIdx !== -1) { 
            currentIndex = fIdx; 
            highlightRow(currentIndex); 
        }
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
        let rowText = currentIndex !== -1 ? allRows[currentIndex].innerText : "";
        let phoneMatch = rowText.match(/[456789]\d{7}/);
        if (phoneMatch) {
            navigator.clipboard.writeText(phoneMatch[0]);
            showMsg("✅ 電話已複製: " + phoneMatch[0]);
        } else {
            alert("找不到電話，請先選中個案行");
        }
    };

    /* 舊 Link 功能 */
    document.getElementById("tc_old_link").onclick = () => {
        const id = document.getElementById("tc_search").value.trim();
        if(!id) return alert("請輸入 ID");
        window.open(`https://www.tutorcircle.hk/panel/admin/cases_approve/completetutorlist.php?id=${id}`, "_blank");
    };

    /* 新 Link 功能 */
    document.getElementById("tc_new_link").onclick = () => {
        const id = document.getElementById("tc_search").value.trim();
        if(!id) return alert("請輸入 ID");
        window.open(`https://www.tutorcircle.hk/panel/admin/cases_approve/completetutorlist_new.php?id=${id}`, "_blank");
    };

    /* 開啟並讀取功能 */
    document.getElementById("tc_go_list").onclick = () => {
        const id = document.getElementById("tc_search").value.trim();
        copyAndGo(id);
    };

} else if (!path.includes('cases_approve')) {
    showMsg("請在個案審批頁面使用此工具");
}
})();
