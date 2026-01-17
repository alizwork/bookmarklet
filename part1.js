javascript:(function(){
const path = location.pathname + location.search;

// ----------- 公用工具 -----------
function showMsg(container, msg, ms){
  let bar = container.querySelector('.tc-msg');
  if(!bar){
    bar = document.createElement('div');
    bar.className = 'tc-msg';
    bar.style.cssText = `position:absolute;left:0;right:0;top:-32px;margin:auto;width:100%;max-width:380px;padding:8px 0;background:rgba(60,60,60,0.92);color:#fff;text-align:center;font-size:15px;border-radius:10px 10px 0 0;z-index:2;transition:opacity .2s;pointer-events:none;`;
    container.prepend(bar);
  }
  bar.textContent = msg;
  bar.style.opacity = 1;
  if(bar.tcTimer) clearTimeout(bar.tcTimer);
  bar.tcTimer = setTimeout(()=>{bar.style.opacity=0;}, ms||1500);
}

function htmlToPlainTextClean(html) {
  if(!html) return "";
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const scripts = tempDiv.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) scripts[i].remove();
  html = tempDiv.innerHTML;
  html = html.replace(/<span[^>]*class=['"]important['"][^>]*>(.*?)<\/span>/gi, "【$1】");
  html = html.replace(/<br\s*\/?>/gi, "\n");
  html = html.replace(/<\/p>/gi, "\n");
  html = html.replace(/<[^>]+>/g, "");
  html = html.replace(/&nbsp;/g, " ");
  return html.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');
}

// ----------- 主邏輯 -----------
if(/\/cases_approve\/?$/.test(location.pathname)){
  let old=document.getElementById("tc_case_ui");
  if(old)old.remove();

  const box = document.createElement("div");
  box.id = "tc_case_ui";
  box.style = `position:fixed;top:46px;right:40px;z-index:99999;background:#fff8f0;border:2.5px solid #ffc773;box-shadow:2.5px 2.5px 18px #0001;padding:38px 28px 22px 28px;border-radius:18px;font-size:21px;min-width:330px;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;gap:18px;`;

  const iconUp = `<svg width="32" height="32" viewBox="0 0 20 20"><polyline points="6 12 10 8 14 12" fill="none" stroke="#555" stroke-width="2.2"/></svg>`;
  const iconDown = `<svg width="32" height="32" viewBox="0 0 20 20"><polyline points="6 8 10 12 14 8" fill="none" stroke="#555" stroke-width="2.2"/></svg>`;
  const iconList = `<svg width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="5" width="12" height="2" rx="1" fill="#ff8a00"/><rect x="4" y="9" width="12" height="2" rx="1" fill="#ff8a00"/><rect x="4" y="13" width="12" height="2" rx="1" fill="#ff8a00"/></svg>`;

  box.innerHTML = `
    <div style="display:flex;gap:13px;align-items:center;">
      <input id="tc_caseid" type="text" placeholder="Case ID" style="width:150px;font-size:22px;padding:11px;border:1.8px solid #bbb;border-radius:11px;">
      <button id="tc_prev" style="background:#fff;border:1.7px solid #ddd;padding:5px;border-radius:9px;cursor:pointer;">${iconUp}</button>
      <button id="tc_next" style="background:#fff;border:1.7px solid #ddd;padding:5px;border-radius:9px;cursor:pointer;">${iconDown}</button>
    </div>
    <button id="tc_openlist" style="background:#fff;border:1.5px solid #d065b6;color:#d065b6;border-radius:8px;padding:10px 20px;display:flex;align-items:center;gap:7px;cursor:pointer;font-size:19px;font-weight:bold;">${iconList}開啟列表並填入資料</button>
    <button id="tc_close" style="position:absolute;top:10px;right:10px;background:none;border:none;cursor:pointer;font-size:20px;">×</button>
  `;
  document.body.appendChild(box);

  const input = box.querySelector("#tc_caseid");

  // 核心功能：開啟新分頁並操控它
  box.querySelector("#tc_openlist").onclick = async function(){
    const val = input.value.trim();
    if(!val){ showMsg(box,"請輸入Case ID"); return; }

    showMsg(box, "正在提取資料...", 2000);

    try {
      // 1. 爬取資料
      const response = await fetch(`/panel/admin/cases_approve/case.php?id=${val}`);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const caseDetailEl = doc.getElementById('case_detail');
      if (!caseDetailEl) { showMsg(box, "找不到個案詳情"); return; }
      const plainText = htmlToPlainTextClean(caseDetailEl.innerHTML);

      // 2. 開啟新分頁
      const targetUrl = `/panel/admin/cases_approve/completetutorlist_new.php?id=${val}`;
      const newWin = window.open(targetUrl, "_blank");

      if (!newWin) {
        showMsg(box, "分頁被瀏覽器攔截，請允許彈出視窗");
        return;
      }

      // 3. 監控新分頁載入狀況並注入操作
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        try {
          // 檢查新分頁是否載入完成且可以存取
          if (newWin.document.readyState === 'complete') {
            clearInterval(checkInterval);
            
            // 在新分頁執行：觸發 Alt+4 並填值
            // 我們使用 newWin.eval 或直接操控其 window 物件
            
            // A. 嘗試觸發 togglePart2
            if (typeof newWin.togglePart2 === 'function') {
              newWin.togglePart2();
            } else {
              const isMac = /Mac/.test(newWin.navigator.platform);
              const eventInit = { key: "4", code: "Digit4", keyCode: 52, which: 52, bubbles: true, cancelable: true };
              if (isMac) eventInit.ctrlKey = true; else eventInit.altKey = true;
              newWin.dispatchEvent(new newWin.KeyboardEvent('keydown', eventInit));
            }

            // B. 等待 UI 出現並填值
            let fillRetry = 0;
            const fillInterval = setInterval(() => {
              fillRetry++;
              const root = newWin.document.querySelector('my-funcbox-root');
              let target = null;
              if (root && root.shadowRoot) target = root.shadowRoot.querySelector('textarea');
              if (!target) target = newWin.document.querySelector('textarea');

              if (target) {
                target.value = plainText;
                target.dispatchEvent(new newWin.Event('input', { bubbles: true }));
                clearInterval(fillInterval);
                showMsg(box, "已成功填入新分頁！");
              }

              if (fillRetry > 40) clearInterval(fillInterval);
            }, 100);
          }
        } catch (e) {
          // 如果因為跨網域暫時無法存取，忽略錯誤繼續嘗試
        }
        if (attempts > 100) clearInterval(checkInterval); // 最多等 10 秒
      }, 200);

    } catch (err) {
      console.error(err);
      showMsg(box, "執行失敗");
    }
  };

  // 輔助：高亮與導航 (保留原本功能)
  function highlightRow(val){
    document.querySelectorAll("tr.tc_highlight").forEach(tr=>{
      tr.style.backgroundColor=tr.getAttribute("data-tc-orig")||"";
      tr.classList.remove("tc_highlight");
    });
    let target=null;
    document.querySelectorAll("table tr").forEach(tr=>{
      let a=tr.querySelector("td:first-child > a[href*='case.php?id=']");
      if(a && a.textContent.trim()===val){
        if(!tr.hasAttribute("data-tc-orig")) tr.setAttribute("data-tc-orig",tr.style.backgroundColor||"");
        tr.style.backgroundColor="#ffe2b8";
        tr.classList.add("tc_highlight");
        target=tr;
      }
    });
    if(target) target.scrollIntoView({behavior:"smooth",block:"center"});
  }

  input.oninput = function(){ this.value=this.value.replace(/\D/g,""); highlightRow(this.value); };
  box.querySelector("#tc_close").onclick = () => box.remove();
  
  const getTrs = () => Array.from(document.querySelectorAll("table tr")).filter(tr=>tr.querySelector("td:first-child > a[href*='case.php?id=']"));
  box.querySelector("#tc_prev").onclick = () => {
    let trs=getTrs(), cur=trs.findIndex(t=>t.classList.contains("tc_highlight")), idx=(cur<=0?trs.length-1:cur-1);
    let a=trs[idx].querySelector("a"); if(a){input.value=a.textContent.trim(); highlightRow(input.value);}
  };
  box.querySelector("#tc_next").onclick = () => {
    let trs=getTrs(), cur=trs.findIndex(t=>t.classList.contains("tc_highlight")), idx=(cur>=trs.length-1?0:cur+1);
    let a=trs[idx].querySelector("a"); if(a){input.value=a.textContent.trim(); highlightRow(input.value);}
  };
}
})();
