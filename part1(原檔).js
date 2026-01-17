javascript:(function(){
const path = location.pathname+location.search;

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

// ----------- HTML 轉純文字，每行一資訊，無多餘空行 -----------
function htmlToPlainTextClean(html) {
  // <span class='important'>xxx</span> → 【xxx】
  html = html.replace(/<span[^>]*class=['"]important['"][^>]*>(.*?)<\/span>/gi, "【$1】");
  // <br> → 換行
  html = html.replace(/<br\s*\/?>/gi, "\n");
  // </p> → 換行
  html = html.replace(/<\/p>/gi, "\n");
  // 其它所有標籤移除
  html = html.replace(/<[^>]+>/g, "");
  // &nbsp; → 空格
  html = html.replace(/&nbsp;/g, " ");
  // 將多行空白合併，且每一行都trim掉首尾空格
  let lines = html.split('\n')
    .map(line => line.replace(/^\s+|\s+$/g, "")) // 去首尾空白
    .filter(line => line.length > 0); // 只保留非空行
  return lines.join('\n');
}

// ----------- 1️⃣ 個案列表頁 -----------
if(/\/cases_approve\/?$/.test(location.pathname)){
  let old=document.getElementById("tc_case_ui");
  if(old)old.remove();

  // 浮窗UI
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

  // 按鈕icon
  const iconUp = `<svg width="32" height="32" viewBox="0 0 20 20"><polyline points="6 12 10 8 14 12" fill="none" stroke="#555" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  const iconDown = `<svg width="32" height="32" viewBox="0 0 20 20"><polyline points="6 8 10 12 14 8" fill="none" stroke="#555" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  const iconPhone = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3.2 2.7A2 2 0 0 1 6 2l2 2a2 2 0 0 1 0 2.8l-1 1a12 12 0 0 0 5.2 5.2l1-1a2 2 0 0 1 2.8 0l2 2a2 2 0 0 1-.7 2.8l-1.6 1a3 3 0 0 1-2.8.1c-4.7-2.2-8.6-6.1-10.8-10.8A3 3 0 0 1 2.2 4.3l1-1.6z" fill="none" stroke="#555" stroke-width="2"/></svg>`;
  const iconCopy = `<svg width="20" height="20" viewBox="0 0 20 20"><rect x="7" y="7" width="9" height="11" rx="2" fill="none" stroke="#555" stroke-width="2"/><rect x="4" y="2" width="9" height="11" rx="2" fill="none" stroke="#ff8a00" stroke-width="2"/></svg>`;
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
      <button id="tc_copycase" title="複製個案資料" style="background:#fff;border:1.5px solid #ffb658;box-shadow:0 1px 5px #ffb65833;color:#ff8a00;border-radius:8px;padding:9px 19px 9px 14px;display:flex;align-items:center;gap:7px;cursor:pointer;font-size:19px;font-weight:bold;">${iconCopy}複製資料</button>
      <button id="tc_openlist" title="開啟導師列表" style="background:#fff;border:1.5px solid #d065b6;box-shadow:0 1px 5px #d065b622;color:#d065b6;border-radius:8px;padding:9px 19px 9px 14px;display:flex;align-items:center;gap:7px;cursor:pointer;font-size:19px;font-weight:bold;">${iconList}列表</button>
    </div>
    <button id="tc_close" title="關閉浮窗" style="background:none;border:none;position:absolute;top:14px;right:15px;cursor:pointer;padding:2px;">${iconClose}</button>
  `;
  document.body.appendChild(box);

  // --- 高亮 + 滾動 ---
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
    if(target){
      target.scrollIntoView({behavior:"smooth",block:"center"});
    }
    return target;
  }

  // --- 輸入與切換 ---
  let input=box.querySelector("#tc_caseid");
  input.addEventListener("input",function(){
    let val=this.value.replace(/\D/g,"");
    this.value=val;
    highlightRow(val);
  });

  // 上/下一個符號
  function getAllCaseTrs(){
    return Array.from(document.querySelectorAll("table tr")).filter(tr=>{
      let a=tr.querySelector("td:first-child > a[href*='case.php?id=']");
      return !!a;
    });
  }
  function getCurrentIdx(){
    let trs=getAllCaseTrs();
    return trs.findIndex(tr=>tr.classList.contains("tc_highlight"));
  }
  box.querySelector("#tc_prev").onclick=function(){
    let trs=getAllCaseTrs();
    if(!trs.length)return;
    let idx=getCurrentIdx();
    idx = idx<=0? trs.length-1 : idx-1;
    let a=trs[idx].querySelector("td:first-child > a[href*='case.php?id=']");
    if(a){input.value=a.textContent.trim();input.dispatchEvent(new Event("input"));}
  };
  box.querySelector("#tc_next").onclick=function(){
    let trs=getAllCaseTrs();
    if(!trs.length)return;
    let idx=getCurrentIdx();
    idx = idx<0? 0 : (idx+1)%trs.length;
    let a=trs[idx].querySelector("td:first-child > a[href*='case.php?id=']");
    if(a){input.value=a.textContent.trim();input.dispatchEvent(new Event("input"));}
  };

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
    if(!phone){
      let span=document.querySelector("span[class]:not([class=''])");
      if(span && /^\d{7,8}$/.test(span.textContent.trim()))phone=span.textContent.trim();
    }
    if(phone){
      navigator.clipboard.writeText(phone);
      showMsg(box,"已複製電話號碼！");
    }else{
      showMsg(box,"找不到電話號碼");
    }
  };

  // --- 複製個案資料（AJAX取資料，轉純文字）---
  box.querySelector("#tc_copycase").onclick=function(){
    let val=input.value.trim();
    if(!val){showMsg(box,"請先輸入Case ID"); return;}
    box.querySelector("#tc_copycase").disabled = true;
    fetch('get_template.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'caseid=' + encodeURIComponent(val)
    })
    .then(resp => resp.text())
    .then(txt => {
      let plain = htmlToPlainTextClean(txt.trim());
      navigator.clipboard.writeText(plain);
      showMsg(box,"已複製個案資料！");
    })
    .catch(()=>{ showMsg(box,"複製失敗！"); })
    .finally(()=>{ box.querySelector("#tc_copycase").disabled = false; });
  };

  // --- 導師列表 ---
  box.querySelector("#tc_openlist").onclick=function(){
    let val=input.value.trim();
    if(!val){showMsg(box,"請先輸入Case ID"); return;}
    window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${val}`,"_blank");
  };

  // --- 關閉 ---
  box.querySelector("#tc_close").onclick=function(){
    box.remove();
    document.querySelectorAll("tr.tc_highlight").forEach(tr=>{
      if(tr.hasAttribute("data-tc-orig"))tr.style.backgroundColor=tr.getAttribute("data-tc-orig");
      else tr.style.backgroundColor="";
      tr.classList.remove("tc_highlight");
      tr.removeAttribute("data-tc-orig");
    });
  };
  return;
}

// ----------- 2️⃣ 個案詳情頁 -----------
if(/\/cases_approve\/case\.php\?id=(\d+)/.test(path)){
  const caseId=RegExp.$1;
  if(document.getElementById("tc_case_detail_float"))return;
  const box=document.createElement("div");
  box.id="tc_case_detail_float";
  box.style=`
    position:fixed;top:62px;right:44px;z-index:99999;
    background:#fff6ef;border:2.5px solid #ffc773;padding:44px 36px 30px 36px;border-radius:19px;
    font-size:21px;box-shadow:2.5px 2.5px 22px #0002;
    display:flex;flex-direction:column;align-items:center;min-width:320px;max-width:95vw;
    font-family:system-ui,sans-serif;
  `;
  box.innerHTML=`
    <button id="tc_copy" style="padding:15px 38px 15px 28px;font-size:21px;border-radius:12px;background:#ffae00;color:#fff;border:none;box-shadow:1px 1px 10px #0001;cursor:pointer;font-weight:bold;letter-spacing:1px;">導出個案資料↪️</button>
    <div style="font-size:15px;color:#ba6c00;margin-top:13px;text-align:center;">💡提示：導出後如複製了其他文字，需再次按導出</div>
    <button id="tc_close" style="position:absolute;top:14px;right:18px;background:none;border:none;font-size:28px;line-height:1;color:#e74c3c;cursor:pointer;">&#10006;</button>
  `;
  document.body.appendChild(box);

  function showFloatMsg(msg){
    showMsg(box, msg, 2800);
  }

  box.querySelector("#tc_copy").onclick=function(){
    box.querySelector("#tc_copy").disabled = true;
    fetch('get_template.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'caseid=' + encodeURIComponent(caseId)
    })
    .then(resp => resp.text())
    .then(txt => {
      let plain = htmlToPlainTextClean(txt.trim());
      navigator.clipboard.writeText(plain);
      showFloatMsg("已複製個案資料！");
      setTimeout(()=>{box.querySelector("#tc_copy").textContent="導出個案資料↪️"},1400);
      window.open(`/panel/admin/cases_approve/completetutorlist_new.php?id=${caseId}`,"_blank");
    })
    .catch(()=>{ showFloatMsg("複製失敗！"); })
    .finally(()=>{ box.querySelector("#tc_copy").disabled = false; });
  };
  box.querySelector("#tc_close").onclick=()=>box.remove();
  return;
}
})();
