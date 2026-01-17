javascript:(function(){
const path = location.pathname;

function showMsg(msg, ms=2000){
    let bar = document.getElementById('tc-status-bar');
    if(!bar){
        bar = document.createElement('div');
        bar.id = 'tc-status-bar';
        bar.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;background:#333;color:#fff;z-index:100001;border-radius:50px;font-size:14px;box-shadow:0 4px 15px rgba(0,0,0,0.3);`;
        document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.style.display = 'block';
    setTimeout(()=> bar.style.display='none', ms);
}

if(path.includes('cases_approve') && !path.includes('completetutorlist_new')){
    if(document.getElementById("tc_enhanced_panel")) document.getElementById("tc_enhanced_panel").remove();

    // 1. 重新定義抓取邏輯：抓取所有含有數字 ID 的 <tr>
    function getAllCaseRows() {
        return Array.from(document.querySelectorAll("tr")).filter(tr => {
            // 只要這一列裡面有包含連結到 case.php?id= 的，就是我們要的案子
            return tr.querySelector('a[href*="id="]') !== null;
        });
    }

    let allRows = getAllCaseRows();
    let currentIndex = -1;

    const panel = document.createElement("div");
    panel.id = "tc_enhanced_panel";
    panel.style = `position:fixed;top:80px;right:20px;z-index:9999;background:#fff;border:2px solid #ff8a00;padding:20px;border-radius:20px;box-shadow:0 4px 15px rgba(0,0,0,0.2);width:260px;display:flex;flex-direction:column;gap:12px;font-family:sans-serif;`;
    
    panel.innerHTML = `
        <div style="color:#ff8a00;font-weight:bold;font-size:18px;display:flex;justify-content:space-between;">
            <span>個案工具箱 V2.1</span>
            <span id="tc_count" style="font-size:12px;background:#eee;padding:2px 6px;border-radius:4px;color:#666;">0</span>
        </div>
        
        <input id="tc_search" type="text" placeholder="輸入 Case ID (例如 212990)" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:18px;box-sizing:border-box;outline:none;">

        <div style="display:flex;gap:10px;">
            <button id="tc_prev" style="flex:1;padding:12px;background:#f0f0f0;border:1px solid #ccc;border-radius:8px;cursor:pointer;font-weight:bold;">↑ 上一個</button>
            <button id="tc_next" style="flex:1;padding:12px;background:#f0f0f0;border:1px solid #ccc;border-radius:8px;cursor:pointer;font-weight:bold;">↓ 下一個</button>
        </div>

        <button id="tc_copy_phone" style="padding:10px;background:#e3f2fd;color:#1976d2;border:1px solid #bbdefb;border-radius:8px;cursor:pointer;font-weight:bold;">📋 複製該行電話</button>
        
        <button id="tc_go_list" style="padding:15px;background:#ff8a00;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:bold;font-size:16px;box-shadow:0 4px 0 #d37200;">爬取並開啟導師列表</button>
        
        <div id="tc_info" style="font-size:12px;color:#888;text-align:center;min-height:14px;">等待輸入...</div>
    `;
    document.body.appendChild(panel);

    // 更新計數
    document.getElementById("tc_count").innerText = `共 ${allRows.length} 筆`;

    function highlightRow(index) {
        if (index < 0 || index >= allRows.length) return;
        
        // 清除舊的高亮
        allRows.forEach(tr => {
            tr.style.backgroundColor = "";
            tr.style.boxShadow = "";
        });

        const row = allRows[index];
        row.style.backgroundColor = "#fff9c4"; // 亮黃色底
        row.style.boxShadow = "inset 0 0 0 2px #ff8a00";
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // 嘗試從該列抓取 ID
        const idLink = row.querySelector('a[href*="id="]');
        if(idLink) {
            const id = idLink.innerText.trim();
            document.getElementById("tc_info").innerText = `選中個案: ${id} (${index + 1}/${allRows.length})`;
            // 如果搜尋框是空的，自動填入
            if(!document.getElementById("tc_search").value) {
                // 不自動填入以免干擾輸入，但更新資訊
            }
        }
    }

    // 搜尋功能：監聽輸入
    document.getElementById("tc_search").addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if(!val) return;
        
        const fIdx = allRows.findIndex(tr => tr.innerText.includes(val));
        if (fIdx !== -1) {
            currentIndex = fIdx;
            highlightRow(currentIndex);
        } else {
            document.getElementById("tc_info").innerText = "找不到該 ID";
        }
    });

    // 上下按鈕
    document.getElementById("tc_prev").onclick = () => {
        if(currentIndex > 0) { currentIndex--; highlightRow(currentIndex); }
    };
    document.getElementById("tc_next").onclick = () => {
        if(currentIndex < allRows.length - 1) { currentIndex++; highlightRow(currentIndex); }
    };

    // 複製電話
    document.getElementById("tc_copy_phone").onclick = () => {
        if (currentIndex === -1) return alert("請先搜尋或選中一個個案");
        const text = allRows[currentIndex].innerText;
        const phoneMatch = text.match(/[569]\d{7}/);
        if (phoneMatch) {
            navigator.clipboard.writeText(phoneMatch[0]);
            showMsg("已複製電話: " + phoneMatch[0]);
        } else {
            alert("該行找不到 8 位數電話號碼");
        }
    };

    // 爬取並跳轉
    document.getElementById("tc_go_list").onclick = async () => {
        const id = document.getElementById("tc_search").value.trim();
        if(!id) return alert("請輸入 Case ID");
        
        showMsg("正在爬取個案資料...");
        try {
            const resp = await fetch(`/panel/admin/cases_approve/case.php?id=${id}`);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const detail = doc.getElementById('case_detail');
            if(!detail) throw new Error("找不到個案詳情，請確認 ID 是否正確");

            let temp = document.createElement("div");
            temp.innerHTML = detail.innerHTML;
            temp.querySelectorAll('.important').forEach(el => {
                el.prepend("【");
                el.append("】");
            });
            const content = temp.innerText.split('\n').map(l => l.trim()).filter(l => l).join('\n');

            localStorage.setItem('tc_auto_data', content);
            localStorage.setItem('tc_auto_id', id);
            window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${id}`, "_blank");
        } catch (e) {
            alert("爬取失敗: " + e.message);
        }
    };
} 

// 自動填表邏輯 (保持不變)
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
