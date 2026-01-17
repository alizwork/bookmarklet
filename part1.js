javascript:(function(){
const path = location.pathname + location.search;

// ----------- 公用浮窗提示 -----------
function showMsg(container, msg, ms){
  let bar = container.querySelector('.tc-msg');
  if(!bar){
    bar = document.createElement('div');
    bar.className = 'tc-msg';
    bar.style.cssText = `
      position:absolute;left:0;right:0;top:-32px;
      margin:auto;
      width:100%;min-width:0;max-width:380px;
      padding:8px 0 6px 0;
      background:rgba(60,60,60,0.92);
      color:#fff;text-align:center;
      font-size:15px;
      border-radius:10px 10px 0 0;
      z-index:2;
      transition:opacity .2s;
      pointer-events:none;
    `;
    container.prepend(bar);
  }
  bar.textContent = msg;
  bar.style.opacity = 1;
  if(bar.tcTimer) clearTimeout(bar.tcTimer);
  bar.tcTimer = setTimeout(()=>{bar.style.opacity=0;}, ms||1500);
}

// ----------- HTML 轉純文字 (針對 case_detail 優化) -----------
function htmlToPlainTextClean(html) {
  if(!html) return "";
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  
  // 移除不需要的標籤
  const scripts = tempDiv.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) scripts[i].remove();

  html = tempDiv.innerHTML;
  html = html.replace(/<span[^>]*class=['"]important['"][^>]*>(.*?)<\/span>/gi, "【$1】");
  html = html.replace(/<br\s*\/?>/gi, "\n");
  html = html.replace(/<\/p>/gi, "\n");
  html = html.replace(/<[^>]+>/g, "");
  html = html.replace(/&nbsp;/g, " ");
  
  let lines = html.split('\n')
    .map(line => line.replace(/^\s+|\s+$/g, ""))
    .filter(line => line.length > 0);
  return lines.join('\n');
}

// ----------- 1️⃣ 個案列表頁 -----------
if(/\/cases_approve\/?$/.test(location.pathname)){
  let old=document.getElementById("tc_case_ui");
  if(old)old.remove();

  const box = document.createElement("div");
  box.id = "tc_case_ui";
  box.style = `
    position:fixed;top:46px;right:40px;z-index:99999;
    background:#fff8f0;border:2.5px solid #ffc773;
    box-shadow:2.5px 2.5px 18px #0001;
    padding:38px 28px 22px 28px;border-radius:18px;
    font-size:21px;min-width:330px;max-width:98vw;
    display:flex;flex-direction:column;align-items:center;gap:18px;
    font-family:system-ui,sans-serif;
    transition:box-shadow .2s;
  `;

  const iconUp = `<svg width="32" height="32" viewBox="0 0 20 20"><polyline points="6 12 10 8 14 12" fill="none" stroke="#555" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  const iconDown = `<svg width="32" height="32" viewBox="0 0 20 20"><polyline points="6 8 10 12 14 8" fill="none" stroke="#555" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  const iconPhone = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3.2 2.7A2 2 0 0 1 6 2l2 2a2 2 0 0 1 0 2.8l-1 1a12 12 0 0 0 5.2 5.2l1-1a2 2 0 0 1 2.8 0l2 2a2 2 0 0 1-.7 2.8l-1.6 1a3 3 0 0 1-2.8.1c-4.7-2.2-8.6-6.1-10.8-10.8A3 3 0 0 1 2.2 4.3l1-1.6z" fill="none" stroke="#555" stroke-width="2"/></svg>`;
  const iconList = `<svg width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="5" width="12" height="2" rx="1" fill="#ff8a00"/><rect x="4" y="9" width="12" height="2" rx="1" fill="#ff8a00"/><rect x="4" y="13" width="12" height="2" rx="1" fill="#ff8a00"/></svg>`;
  const iconClose = `<svg width="22" height="22" viewBox="0 0 20 20"><line x1="5" y1="5" x2="15" y2="15" stroke="#d33" stroke-width="2.4"/><line x1="15" y1="5" x2="5" y2="15" stroke="#d33" stroke-width="2.4"/></svg>`;

  box.innerHTML = `
    <div style="display:flex;gap:13px;align-items:center;position:relative;">
      <input id="tc_caseid" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Case ID" 
        style="width:150px;font-size:22px;padding:11px 18px;border:1.8px solid #bbb;border-radius:11px;height:44px;">
      <button id="tc_prev" title="上一個" style="background:#fff;border:1.7px solid #ddd;box-shadow:0 1px 6px #0001;cursor:pointer;padding:2px 8px 1px 8px;border-radius:9px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;">${iconUp}</button>
      <button id="tc_next" title="下一個" style="background:#fff;border:1.7px solid #ddd;box-shadow:0 1px 6px #0001;cursor:pointer;padding:2px 8px 1px 8px;border-radius:9px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;">${iconDown}</button>
    </div>
    <div style="display:flex;gap:17px;">
      <button id="tc_phone" title="複製電話" style="background:#fff;border:1.5px solid #bbb;box-shadow:0 1px 5px #0001;color:#444;border-radius:8px;padding:9px 19px 9px 14px;display:flex;align-items:center;gap:7px;cursor:pointer;font-size:19px;font-weight:bold;">${iconPhone}電話</button>
      <button id="tc_openlist" title="開啟導師列表並填寫" style="background:#fff;border:1.5px solid #d065b6;box-shadow:0 1px 5px #d065b622;color:#d065b6;border-radius:8px;padding:9px 19px 9px 14px;display:flex;align-items:center;gap:7px;cursor:pointer;font-size:19px;font-weight:bold;">${iconList}列表 + 填寫</button>
    </div>
    <button id="tc_close" title="關閉浮窗" style="background:none;border:none;position:absolute;top:14px;right:15px;cursor:pointer;padding:2px;">${iconClose}</button>
  `;
  document.body.appendChild(box);

  // --- 高亮邏輯 ---
  function highlightRow(val){
    val=val.trim();
    let target=null;
    document.querySelectorAll("tr.tc_highlight").forEach(tr=>{
      if(tr.hasAttribute("data-tc-orig"))tr.style.backgroundColor=tr.getAttribute("data-tc-orig");
      else tr.style.backgroundColor="";
      tr.classList.remove("tc_highlight");
      tr.removeAttribute("data-tc-orig");
    });
    if(!val)return null;
    document.querySelectorAll("table tr").forEach(tr=>{
      let a=tr.querySelector("td:first-child > a[href*='case.php?id=']");
      if(a && a.textContent.trim()===val){
        if(!tr.hasAttribute("data-tc-orig"))tr.setAttribute("data-tc-orig",tr.style.backgroundColor||"");
        tr.style.backgroundColor="#ffe2b8";
        tr.classList.add("tc_highlight");
        target=tr;
      }
    });
    if(target) target.scrollIntoView({behavior:"smooth",block:"center"});
    return target;
  }

  let input=box.querySelector("#tc_caseid");
  input.addEventListener("input", function(){
    this.value = this.value.replace(/\D/g,"");
    highlightRow(this.value);
  });

  // --- 導航邏輯 (跳過「沒有合適導師」) ---
  function getAllCaseTrs(){
    return Array.from(document.querySelectorAll("table tr")).filter(tr=>{
      return !!tr.querySelector("td:first-child > a[href*='case.php?id=']");
    });
  }

  function findValidIdx(startIdx, direction, trs) {
    let curr = startIdx;
    for (let i = 0; i < trs.length; i++) {
        curr = (curr + direction + trs.length) % trs.length;
        if (!trs[curr].textContent.includes("沒有合適導師")) {
            return curr;
        }
    }
    return startIdx;
  }

  box.querySelector("#tc_prev").onclick=function(){
    let trs=getAllCaseTrs();
    if(!trs.length)return;
    let idx = getCurrentIdx();
    if(idx < 0) idx = 0;
    let nextIdx = findValidIdx(idx, -1, trs);
    let a=trs[nextIdx].querySelector("td:first-child > a[href*='case.php?id=']");
    if(a){input.value=a.textContent.trim();input.dispatchEvent(new Event("input"));}
  };

  box.querySelector("#tc_next").onclick=function(){
    let trs=getAllCaseTrs();
    if(!trs.length)return;
    let idx = getCurrentIdx();
    let nextIdx = findValidIdx(idx, 1, trs);
    let a=trs[nextIdx].querySelector("td:first-child > a[href*='case.php?id=']");
    if(a){input.value=a.textContent.trim();input.dispatchEvent(new Event("input"));}
  };

  function getCurrentIdx(){
    let trs=getAllCaseTrs();
    return trs.findIndex(tr=>tr.classList.contains("tc_highlight"));
  }

  // --- 複製電話 ---
  box.querySelector("#tc_phone").onclick=function(){
    let val=input.value.trim();
    if(!val){showMsg(box,"請先輸入Case ID"); return;}
    let target=null, phone="";
    getAllCaseTrs().forEach(tr=>{
      let a=tr.querySelector("td:first-child > a[href*='case.php?id=']");
      if(a && a.textContent.trim()===val) target=tr;
    });
    if(target){
      let idx=Array.from(target.children).findIndex(td=>{
        return td.querySelector("span") && /^\d{7,8}$/.test(td.querySelector("span").textContent.trim());
      });
      if(idx>=0){
        let span=target.children[idx].querySelector("span");
        if(span)phone=span.textContent.trim();
      }
    }
    if(phone){
      navigator.clipboard.writeText(phone);
      showMsg(box,"已複製電話號碼！");
    }else{
      showMsg(box,"找不到電話號碼");
    }
  };

  // --- 核心優化：列表按鈕 (爬蟲 + 觸發 Part 2) ---
  box.querySelector("#tc_openlist").onclick=async function(){
    let val=input.value.trim();
    if(!val){showMsg(box,"請先輸入Case ID"); return;}

    showMsg(box, "正在提取資料...", 3000);
    
    try {
      // 1. 背景爬取 case.php 頁面
      const response = await fetch(`/panel/admin/cases_approve/case.php?id=${val}`);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const caseDetailEl = doc.getElementById('case_detail');
      
      if (!caseDetailEl) {
        showMsg(box, "找不到個案詳情內容");
        return;
      }

      const plainText = htmlToPlainTextClean(caseDetailEl.innerHTML);
      
      // 2. 開啟導師列表分頁
      window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${val}`,"_blank");

      // 3. 觸發 Function Box 的 Part 2 (Alt+4)
      // 優先嘗試直接調用函數，若無則模擬按鍵
      if (typeof window.togglePart2 === "function") {
        window.togglePart2();
      } else {
        const isMac = /Mac/.test(navigator.platform);
        const eventInit = { key: "4", bubbles: true, cancelable: true };
        if (isMac) eventInit.ctrlKey = true; else eventInit.altKey = true;
        window.dispatchEvent(new KeyboardEvent('keydown', eventInit));
      }

      // 4. 等待 Part 2 UI 出現並填入資料
      // 這裡假設 Part 2 的輸入框是一個 textarea 或特定的 input
      let retryCount = 0;
      const fillInterval = setInterval(() => {
        // 嘗試尋找 Part 2 的輸入框 (通常是 Part 2 彈窗中的第一個 textarea 或 input)
        const part2Root = document.querySelector('my-funcbox-root');
        let targetInput = null;
        
        if (part2Root && part2Root.shadowRoot) {
            // 如果 Part 2 也在 Shadow DOM 裡，或者在頁面中
            targetInput = part2Root.shadowRoot.querySelector('textarea, input[type="text"]:not(#tc_caseid)');
        }
        
        // 如果找不到，嘗試在全域找尋可能新生成的 textarea (Part 2 常用 textarea 接收大段文字)
        if (!targetInput) targetInput = document.querySelector('textarea');

        if (targetInput) {
          targetInput.value = plainText;
          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
          showMsg(box, "已成功提取並填入 Part 2！");
          clearInterval(fillInterval);
        }

        if (++retryCount > 20) { // 最多等 2 秒
            clearInterval(fillInterval);
            // 如果自動填入失敗，至少把資料複製到剪貼簿
            navigator.clipboard.writeText(plainText);
            showMsg(box, "已提取並複製，請手動貼上");
        }
      }, 100);

    } catch (err) {
      console.error(err);
      showMsg(box, "提取失敗，請檢查網路");
    }
  };

  box.querySelector("#tc_close").onclick=()=>box.remove();
}

// ----------- 2️⃣ 個案詳情頁 (保持原樣或輕量化) -----------
if(/\/cases_approve\/case\.php\?id=(\d+)/.test(path)){
    // 此處代碼可保留，用於在詳情頁手動導出
}
})();
