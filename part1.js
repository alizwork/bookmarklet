javascript:(function(){
const path = location.pathname;

// ----------- 通用工具：顯示訊息 -----------
function showMsg(msg, ms=2000){
    let bar = document.getElementById('tc-status-bar');
    if(!bar){
        bar = document.createElement('div');
        bar.id = 'tc-status-bar';
        bar.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(0,0,0,0.8);color:#fff;z-index:100001;border-radius:50px;font-size:14px;box-shadow:0 4px 15px rgba(0,0,0,0.3);`;
        document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.style.display = 'block';
    setTimeout(()=> bar.style.display='none', ms);
}

// ----------- 邏輯 A：個案列表頁 -----------
if(path.includes('cases_approve') && !path.includes('completetutorlist_new')){
    if(document.getElementById("tc_enhanced_panel")) document.getElementById("tc_enhanced_panel").remove();

    const panel = document.createElement("div");
    panel.id = "tc_enhanced_panel";
    // 樣式模仿您的截圖：橘色邊框、圓角、白色背景
    panel.style = `position:fixed;top:100px;right:20px;z-index:9999;background:#fff;border:2px solid #ff8a00;padding:20px;border-radius:20px;box-shadow:0 4px 15px rgba(0,0,0,0.1);width:260px;display:flex;flex-direction:column;gap:12px;font-family:sans-serif;`;
    
    panel.innerHTML = `
        <div style="color:#ff8a00;font-weight:bold;font-size:18px;">個案工具箱 (V2.0)</div>
        
        <input id="tc_search" type="text" placeholder="輸入 Case ID" style="width:100%;padding:12px;border:1px solid #ccc;border-radius:8px;font-size:18px;box-sizing:border-box;">

        <div style="display:flex;gap:10px;">
            <button id="tc_prev" style="flex:1;padding:10px;background:#f8f8f8;border:1px solid #ddd;border-radius:8px;cursor:pointer;font-weight:bold;">↑ 上一個</button>
            <button id="tc_next" style="flex:1;padding:10px;background:#f8f8f8;border:1px solid #ddd;border-radius:8px;cursor:pointer;font-weight:bold;">↓ 下一個</button>
        </div>

        <button id="tc_copy_phone" style="padding:10px;background:#e1f5fe;color:#0288d1;border:1px solid #b3e5fc;border-radius:8px;cursor:pointer;font-weight:bold;">📋 複製該行電話</button>
        
        <button id="tc_go_list" style="padding:15px;background:#ff8a00;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:bold;font-size:16px;">爬取並開啟導師列表</button>
        
        <div id="tc_info" style="font-size:12px;color:#999;text-align:center;">尚未選中個案</div>
    `;
    document.body.appendChild(panel);

    let allRows = Array.from(document.querySelectorAll("tr")).filter(tr => tr.innerText.includes('TC'));
    let currentIndex = -1;

    function highlightRow(index) {
        allRows.forEach(tr => { tr.style.backgroundColor = ""; tr.style.outline = ""; });
        if (index >= 0 && index < allRows.length) {
            const row = allRows[index];
            row.style.backgroundColor = "#fff3e0";
            row.style.outline = "2px solid #ff8a00";
            row.scrollIntoView({ behavior: "smooth", block: "center" });
            
            const caseIdLink = row.querySelector('a[href*="id="]');
            const caseId = caseIdLink ? caseIdLink.innerText.trim() : "";
            if(caseId) document.getElementById("tc_search").value = caseId;
            document.getElementById("tc_info").innerText = `當前: ${caseId} (${index + 1}/${allRows.length})`;
        }
    }

    // 功能：搜尋
    document.getElementById("tc_search").oninput = (e) => {
        const val = e.target.value.trim().toLowerCase();
        const fIdx = allRows.findIndex(tr => tr.innerText.toLowerCase().includes(val));
        if (fIdx !== -1) { currentIndex = fIdx; highlightRow(currentIndex); }
    };

    // 功能：上下移動
    document.getElementById("tc_prev").onclick = () => { if(currentIndex > 0) highlightRow(--currentIndex); };
    document.getElementById("tc_next").onclick = () => { if(currentIndex < allRows.length-1) highlightRow(++currentIndex); };

    // 功能：複製電話
    document.getElementById("tc_copy_phone").onclick = () => {
        if (currentIndex === -1) return alert("請先選中一行");
        const phone = allRows[currentIndex].innerText.match(/[569]\d{7}/);
        if (phone) {
            navigator.clipboard.writeText(phone[0]);
            showMsg("已複製: " + phone[0]);
        } else { alert("找不到電話"); }
    };

    // 功能：爬取並跳轉
    document.getElementById("tc_go_list").onclick = async () => {
        const id = document.getElementById("tc_search").value.trim();
        if(!id) return alert("請輸入 ID");
        showMsg("爬取中...");
        try {
            const resp = await fetch(`/panel/admin/cases_approve/case.php?id=${id}`);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const detail = doc.getElementById('case_detail');
            if(!detail) throw new Error("ID 錯誤或找不到內容");

            let temp = document.createElement("div");
            temp.innerHTML = detail.innerHTML;
            temp.querySelectorAll('.important').forEach(el => { el.prepend("【"); el.append("】"); });
            const content = temp.innerText.split('\n').map(l => l.trim()).filter(l => l).join('\n');

            localStorage.setItem('tc_auto_data', content);
            localStorage.setItem('tc_auto_id', id);
            window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${id}`, "_blank");
        } catch (e) { alert(e.message); }
    };
} 

// ----------- 邏輯 B：自動填表頁 -----------
if(path.includes('completetutorlist_new.php')){
    const data = localStorage.getItem('tc_auto_data');
    const tid = localStorage.getItem('tc_auto_id');
    const cid = new URLSearchParams(window.location.search).get('id');

    if(data && tid === cid){
        showMsg("正在自動填入...", 3000);
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
                showMsg("✅ 填寫完成");
            }
            if(count++ > 30) clearInterval(timer);
        }, 300);
    }
}
})();
