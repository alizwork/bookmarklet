javascript:(function(){
const nearbyMapURL="https://alizzzxoxo.github.io/bookmarklet-/nearbyMap.js";
function loadNearbyMap(cb){
  if(window.nearbyMap) return cb();
  var s=document.createElement('script');
  s.src=nearbyMapURL;
  s.onload=()=>cb();
  document.head.appendChild(s);
}
loadNearbyMap(main);

function main(){
// ===== CSS =====
const style = `
#tc_tutor_filter_ui {
  position:fixed;top:54px;left:auto;right:24px;z-index:99999;
  background:#fff;border:2px solid #99c9ff;border-radius:14px;
  box-shadow:2px 2px 16px #0002;
  min-width:320px;max-width:96vw;width:380px;height:auto;
  padding:13px 15px 10px 15px;
  font-family:system-ui,sans-serif;font-size:15px;
  cursor:grab;user-select:none;
  transition:box-shadow .2s,opacity .18s;
}
#tc_tutor_filter_ui.dragging { box-shadow:0 0 0 4px #2196f366; }
#tc_tutor_filter_ui .tc-row {margin-bottom:10px;}
#tc_tutor_filter_ui .tc-tags {display:flex;flex-wrap:wrap;gap:6px;}
#tc_tutor_filter_ui .tc-tag {
  border-radius:6px;padding:5px 13px;font-size:15px;font-weight:500;
  border:1.4px solid #c4e0ff;background:#f9fcff;color:#1976d2;
  cursor:pointer;transition:all .13s;
}
#tc_tutor_filter_ui .tc-tag.tc-on {
  background:#d1ebff;color:#1976d2;border-color:#2196f3;font-weight:bold;
}
#tc_tutor_filter_ui .tc-tag.tc-off {
  background:#f5f6fa;color:#aaa;border-color:#e5e9f2;
}
#tc_tutor_filter_ui .tc-btn {
  margin-top:7px;padding:7px 13px;border-radius:7px;
  border:1.2px solid #69b6ff;background:#f2faff;
  color:#2196f3;font-size:15px;cursor:pointer;font-weight:bold;
}
#tc_tutor_filter_ui .tc-btn.tc-close {
  float:right;margin:0 0 0 7px;background:none;border:none;
  color:#ec5050;font-size:17px;font-weight:normal;cursor:pointer;
}
#tc_tutor_filter_ui .tc-btn.tc-minimize {
  float:right;margin:0 0 0 7px;background:none;border:none;
  color:#407fa6;font-size:20px;font-weight:normal;cursor:pointer;
  transition:color .15s;
}
#tc_tutor_filter_ui .tc-btn.tc-minimize:hover {
  color:#2196f3;
}
#tc_tutor_filter_ui .tc-label {
  font-size:18px;
  color:#407fa6;
  margin-bottom:3px;
  font-weight:bold;
}
#tc_tutor_filter_ui textarea {
  width:100%;min-height:220px;max-height:420px;height:220px;overflow:auto;
  font-size:15px;margin-top:3px;margin-bottom:2px;
  border-radius:5px;border:1.2px solid #b8e0ff;
  padding:6px 8px;background:#fafdff;
  resize:vertical;box-sizing:border-box;line-height:1.5;
  display:block;
}
#tc_tutor_filter_ui .tc-taginput {
  border:1.1px solid #b8e0ff;border-radius:5px;padding:3px 7px;font-size:15px;margin-top:6px;margin-bottom:2px;width:96%;
  display:block;
  background:#fffbe6;
}
#tc_tutor_filter_ui .tc-none {margin-top:9px;color:#999;font-size:14px;}
.tc-tutor-reason-box {
  display:flex !important; align-items:center; justify-content:center;
  min-height:0; min-width:0; width:100%;
  background:transparent !important; border:none !important; box-shadow:none !important;
  padding:0 !important; margin:12px auto 12px auto !important;
  transition:max-height .25s cubic-bezier(.85,0,.15,1), opacity .22s;
  opacity:1; max-height:200px; overflow:visible;
}
.tc-tutor-reason {
  background:#fff2f2;
  color:#c33;font-size:17px;line-height:1.7;
  border-radius:12px;padding:18px 20px 16px 20px;
  margin:0 auto;display:block;max-width:95vw;min-width:0;width:100%;
  border:2px solid #ffbebe;
  font-weight:bold;
  cursor:pointer;
  box-shadow:0 2px 14px #ffcaca4d;
  transition:box-shadow .2s,background .2s,transform .25s;
  text-align:center;
  word-break:break-word;white-space:pre-line;
  letter-spacing:0.5px;
  min-height:36px;
  z-index:2;
  opacity:1;
  user-select: text;
}
.tc-tutor-reason:hover {background:#ffe5e5;box-shadow:0 2px 24px #ff8d8d44; }
.tc-tutor-card-collapsed {
  display:block !important; max-height:0 !important; overflow:hidden !important; opacity:0 !important; padding:0 !important; margin:0 !important; border:none !important; box-shadow:none !important;
  pointer-events:none !important;
  transition:max-height .25s cubic-bezier(.85,0,.15,1), opacity .22s;
}
.tc-tutor-card-expanded {
  display:block !important; opacity:1 !important; max-height:4000px !important; transition:max-height .25s cubic-bezier(.85,0,.15,1), opacity .22s;
}
.tc-highlight {
  background: #ffe066 !important;
  color: #c65000 !important;
  font-weight: bold;
  border-radius: 4px;
  padding: 1px 3px;
  box-shadow: 0 0 0 1px #ffdf80;
}
#tc_tutor_filter_ui .tc-btn.tc-expand {
  display:none !important;
}
#tc_tutor_filter_ui.tc-min .tc-btn.tc-expand {
  display:inline-flex !important;
  align-items:center;justify-content:center;
  margin:7px 7px 7px 7px !important;
  padding:0 !important;
  background:#1976d2 !important;
  color:#fff !important;
  border-radius:50% !important;
  border:none !important;
  width:44px !important;height:44px !important;
  font-size:24px !important;
  box-shadow:0 2px 12px #1976d244;
  font-weight:normal;
  cursor:pointer;
  transition:background .18s,box-shadow .18s;
}
#tc_tutor_filter_ui.tc-min .tc-btn.tc-expand:hover {
  background:#2196f3 !important;
  box-shadow:0 3px 18px #2196f388;
}
#tc_tutor_filter_ui.tc-min { 
  min-width:0 !important; width:auto !important; height:auto !important; max-width:none !important; 
  padding:0 !important; background:transparent !important; border:none !important; box-shadow:none !important; 
  cursor:pointer; right:24px !important; top:54px !important; z-index:99999 !important;
  opacity:0.92;
}
#tc_tutor_filter_ui.tc-min *:not(.tc-btn.tc-expand) { display:none !important; }
`;
if(!document.getElementById("tc_tutor_filter_ui_style")) {
  let styleElem=document.createElement('style');
  styleElem.id="tc_tutor_filter_ui_style";
  styleElem.innerHTML=style;
  document.head.appendChild(styleElem);
}

// ====== UI ======
if(document.getElementById("tc_tutor_filter_ui")) return;
const box = document.createElement("div");
box.id = "tc_tutor_filter_ui";
box.innerHTML = `
  <button class="tc-btn tc-close" title="關閉浮窗" style="float:right;">✕</button>
  <button class="tc-btn tc-minimize" title="縮小/收起浮窗" style="float:right;">－</button>
  <button class="tc-btn tc-expand" title="展開功能視窗">📂</button>
  <div class="tc-row">
    <div class="tc-label">【視窗拖拉可移動位置】</div>
    <textarea id="tc_case_input" placeholder="個案編號： 
科⽬： 
學費：
地點： 
詳細地址：
交通⽅法： 
堂數／時間：
每堂時間: 
特別要求："></textarea>
    <button class="tc-btn" id="tc_submit">提交 ➔ 智能篩選</button>
  </div>
  <div class="tc-row" id="tc_filter_box" style="display:none;">
    <div class="tc-label">篩選條件：</div>
    <div class="tc-tags" id="tc_tags"></div>
    <input type="text" id="tc_special_input" class="tc-taginput" style="display:none;" placeholder="輸入關鍵字後Enter（多詞以半形逗號,分隔）">
  </div>
  <div class="tc-row" id="tc_none" style="display:none;">
    <div class="tc-none">沒有符合條件的導師。</div>
  </div>
`;
document.body.appendChild(box);

const closeBtn = box.querySelector(".tc-close");
const minBtn = box.querySelector(".tc-minimize");
const expandBtn = box.querySelector(".tc-expand");

closeBtn.onclick=function(){
  document.querySelectorAll('.tc-tutor-reason-box').forEach(div=>div.remove());
  document.querySelectorAll('.mb-3.btn.btn-light.sentence').forEach(node=>{
    node.classList.remove('tc-tutor-card-collapsed');
    node.classList.remove('tc-tutor-card-expanded');
    node.style.display="";
    removeHighlights(node);
  });
  box.remove();
};

minBtn.onclick=function(e){
  box.classList.add("tc-min");
};
expandBtn.onclick=function(e){
  box.classList.remove("tc-min");
};

(function dragElement(el){
  let pos1=0,pos2=0,pos3=0,pos4=0,dragging=false;
  el.onmousedown=dragMouseDown;
  function dragMouseDown(e){
    if(e.target.tagName==="TEXTAREA"||e.target.tagName==="INPUT"||e.target.classList.contains("tc-btn")) return;
    e.preventDefault();
    dragging=true;
    el.classList.add("dragging");
    pos3=e.clientX;pos4=e.clientY;
    document.onmouseup=closeDragElement;
    document.onmousemove=elementDrag;
  }
  function elementDrag(e){
    if(!dragging) return;
    e.preventDefault();
    let dx = e.clientX-pos3, dy = e.clientY-pos4;
    pos3=e.clientX;pos4=e.clientY;
    let rect = el.getBoundingClientRect();
    let newLeft = rect.left+dx, newTop = rect.top+dy;
    newLeft = Math.max(0, Math.min(window.innerWidth-el.offsetWidth, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight-el.offsetHeight, newTop));
    el.style.left = newLeft+"px";
    el.style.top = newTop+"px";
    el.style.right = "auto";
    el.style.bottom = "auto";
  }
  function closeDragElement(){
    dragging=false;
    el.classList.remove("dragging");
    document.onmouseup=null;
    document.onmousemove=null;
  }
})(box);

// ===== 狀態 =====
const TAGS = [
  { key: "fee", label: "學費", desc: "導師價格不高於個案最高學費" },
  { key: "area", label: "地點", desc: "地點或鄰近區" },
  { key: "gender", label: "性別", desc: "指定性別" },
  { key: "grade", label: "成績", desc: "DSE等級符合" },
  { key: "verified", label: "已驗證", desc: "需已驗證成績" },
  { key: "fresh", label: "應屆", desc: "只顯示應屆考生" },
  { key: "exp", label: "有經驗", desc: "需有經驗" },
  { key: "special", label: "其他要求", desc: "自訂關鍵字" },
  { key: "bad", label: "差評導師", desc: "顯示有差評的導師" }
];

let filterState = {
  fee:true, area:false, gender:false, grade:false, verified:false, fresh:false, exp:false, special:false, bad:false,
  feeRange:null, genderVal:null, gradeVal:null, verifiedVal:null, expVal:null, specialVal:[],
  areaVal:null, caseData:null, tutorData:[]
};

function showMsg(msg, ms){
  let bar = box.querySelector('.tc-msg');
  if(!bar){
    bar = document.createElement('div');
    bar.className = 'tc-msg';
    bar.style.cssText = `
      position:absolute;left:0;right:0;top:-28px;
      margin:auto;width:90%;min-width:0;max-width:290px;
      padding:7px 0 6px 0;
      background:rgba(60,60,120,0.93);
      color:#fff;text-align:center;
      font-size:14px;
      border-radius:10px 10px 0 0;
      z-index:2;transition:opacity .2s;
      pointer-events:none;
    `;
    box.prepend(bar);
  }
  bar.textContent = msg;
  bar.style.opacity = 1;
  if(bar.tcTimer) clearTimeout(bar.tcTimer);
  bar.tcTimer = setTimeout(()=>{bar.style.opacity=0;}, ms||1300);
}

function toNum(str){return parseInt((str+"").replace(/[^\d]/g,""))||0;}
function parseFee(str){
  if(!str) return null;
  let m = str.match(/學費[:：]?\s*\$?[\s]*(\d+)(?:\s*-\s*(\d+))?/);
  if(m) return m[2] ? [parseInt(m[1]), parseInt(m[2])] : [parseInt(m[1]), parseInt(m[1])];
  let nums = (str.match(/\d+/g)||[]).map(Number);
  if(nums.length==1) return [nums[0],nums[0]];
  if(nums.length>=2) return [Math.min(...nums),Math.max(...nums)];
  return null;
}
function parseArea(str){
  let m = str.match(/地點[:：]?\s*([^\s(（]+)/);
  return m ? m[1] : "";
}
function parseGender(str){
  if(/女導師/.test(str)) return "女";
  if(/男導師/.test(str)) return "男";
  return null;
}
function parseGradeByLine(str){
  let reg = /((英|英文|中|中文|數|數學|通|通識|物|物理|化|化學|生|生物|經|經濟|BBA|BAFS|地|地理|歷|歷史|資|資訊|ICT)?)\s*:?[\s\-]*([345][\*＊星]{0,2})\s*(以上)?/g;
  let m, out=[];
  while((m=reg.exec(str))!==null){
    let subj = m[1]||null;
    let grade = m[3].replace(/[＊星]/g,"*");
    let above = !!m[4];
    out.push({subj,grade,above});
  }
  return out;
}
function expandGrades(grade,above){
  let all=["3","4","5","5*","5**"];
  let idx=all.indexOf(grade);
  if(idx<0) return [grade];
  if(above) return all.slice(idx);
  return [grade];
}
function parseVerified(str){
  if(/驗證/.test(str) && /已驗證/.test(str)) return true;
  if(/未驗證/.test(str)) return false;
  return null;
}
function parseExp(str){if(/經驗/.test(str)) return true;return null;}
function parseSpecial(str){
  if(/sen/i.test(str)) return "sen";
  let m = str.match(/指定學校[：: ]*([\u4e00-\u9fa5A-Za-z]+)/);
  if(m) return m[1];
  return null;
}
function removeHighlights(node){
  node.querySelectorAll && node.querySelectorAll('.tc-highlight').forEach(span=>{
    let parent = span.parentNode;
    parent.replaceChild(document.createTextNode(span.textContent), span);
    parent.normalize && parent.normalize();
  });
}
function highlightKeywords(node, kws){
  removeHighlights(node);
  if(!kws || !kws.length) return;
  let introArr = Array.from(node.querySelectorAll('.col-12.text-left'));
  if(introArr.length){
    introArr.forEach(box=>{
      let html = box.innerHTML;
      let found=false;
      kws.forEach(kw=>{
        if(!kw) return;
        let safeKW = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let reg = new RegExp("("+safeKW+")","ig");
        if(reg.test(html)){
          found=true;
          html = html.replace(reg, '<span class="tc-highlight">$1</span>');
        }
      });
      if(found) box.innerHTML=html;
    });
  }
}

function analyzeCase(txt){
  let lines = txt.replace(/\r/g,"").split('\n').map(v=>v.trim()).filter(v=>v.length>0);
  let fullText = lines.join('\n');
  fullText = fullText.replace(/你好！多謝你使用Tutor Circle尋補服務呀，?\s*請問以上資料正確嗎？如無問題，這邊正為您聯繫導師😊如資料後續有需要修改的地方，或有需要聯繫之導師編號，請直接留言告知我就可以了，無須再次填寫表格以免影響處理流程😉/g, '');
  lines = fullText.split('\n').map(v=>v.trim()).filter(v=>v.length>0);

  let data = {fee:null, area:null, gender:null, grade:[], verified:null, fresh:null, exp:null, special:null};
  lines.forEach(line=>{
    if(!data.fee && /學費/.test(line)){
      let f = parseFee(line);
      if(f) data.fee = f;
    }
    if(!data.area && /地點/.test(line)){
      let a = parseArea(line);
      if(a) data.area = a;
    }
    if(!data.gender && /導師/.test(line)){
      let g = parseGender(line);
      if(g) data.gender = g;
    }
    let parsed=parseGradeByLine(line);
    if(parsed.length) data.grade.push(...parsed);
    if(!data.verified){
      let v = parseVerified(line);
      if(v!==null) data.verified = v;
    }
    if(!data.exp){
      let e = parseExp(line);
      if(e!==null) data.exp = e;
    }
    if(!data.special){
      let s = parseSpecial(line);
      if(s) data.special = s;
    }
  });
  return data;
}
function parseTutorList(){
  let nodes = Array.from(document.querySelectorAll('.mb-3.btn.btn-light.sentence[data-tutor-id]'));
  let tutors = nodes.map(node=>{
    let feeNode = node.querySelector('.tutor-response-fee');
    let fee = feeNode ? parseInt(feeNode.textContent.replace(/[^\d]/g,"")) : null;
    let areaNode = node.querySelector('.col-6.text-right label[style*="font-weight:bold"]');
    let area = areaNode ? areaNode.textContent.trim() : "";
    let genderNode = node.querySelector('.gender');
    let gender = genderNode ? genderNode.textContent.trim() : "";
    let gradeNodeList = node.querySelectorAll('.col-12.text-left');
    let subjGrades = [];
    gradeNodeList.forEach(gn=>{
      let html = gn.innerHTML;
      if(html.includes("成績")){
        let lines = html.replace(/<br\s*\/?>/gi,"\n").split('\n').map(v=>v.trim()).filter(Boolean);
        lines.forEach(line=>{
          let m = line.match(/^([^\s\-:]+)\s*[\-:]\s*([345][\*＊星]{0,2})$/);
          if(m){
            let subj = m[1].replace(/英國語文/,"英文").replace(/中國語文/,"中文").replace(/數學/,"數學");
            let grade = m[2].replace(/[＊星]/g,"*");
            subjGrades.push({subj,grade});
          }
        });
      }
    });
    let verified = /(已驗證)/.test(node.textContent) ? true : (/(未驗證)/.test(node.textContent) ? false : null);
    let fresh = /預測/.test(node.textContent);
    let bad = node.querySelector('.remark-tag.badge.badge-danger') ? true : false;
    let exp = /導師經驗[:：].{2,}/.test(node.textContent);
    let intro = "";
    let introMatch = node.textContent.match(/導師自我介紹[:：]?\s*([\s\S]+)/);
    if (introMatch) intro = introMatch[1].trim();
    return {node,fee,area,gender,verified,fresh,bad,exp,intro,subjGrades,reasons:[]};
  });
  return tutors;
}

function areaMatch(tutArea,caseArea){
  if(!tutArea||!caseArea) return false;
  if(tutArea===caseArea) return true;
  if(window.nearbyMap && window.nearbyMap[caseArea]){
    return window.nearbyMap[caseArea].includes(tutArea);
  }
  return false;
}

function tutorFilter(tut, state){
  let reasons = [];
  if(state.fee && state.feeRange && tut.fee!==null){
    if(tut.fee > state.feeRange[1]) reasons.push("學費不符");
  }
  if(state.area && state.caseData.area && tut.area){
    if(!areaMatch(tut.area,state.caseData.area)) reasons.push("地點不符");
  }
  if(state.gender && state.genderVal && tut.gender){
    if(!tut.gender.includes(state.genderVal)) reasons.push("性別不符");
  }
  if(state.grade && state.caseData.grade && tut.subjGrades){
    let ok=false;
    for(let need of state.caseData.grade){
      let targetGrades=expandGrades(need.grade,need.above);
      if(need.subj){
        for(let sg of tut.subjGrades){
          if(sg.subj && sg.subj.includes(need.subj.replace(/英文/,"英").replace(/中文/,"中"))) {
            if(targetGrades.includes(sg.grade)) ok=true;
          }
        }
      }else{
        for(let sg of tut.subjGrades){
          if(targetGrades.includes(sg.grade)) ok=true;
        }
      }
    }
    if(!ok) reasons.push("成績不符");
  }
  if(state.verified){
    if(tut.verified!==true) reasons.push("未驗證");
  }
  if (!state.fresh && tut.fresh) reasons.push("應屆考生");
  if(state.exp && tut.exp!==true) reasons.push("無經驗");
  if (!state.bad && tut.bad) reasons.push("差評導師");
  if(state.special && Array.isArray(state.specialVal) && state.specialVal.length){
    let matched=false;
    let intro = tut.intro ? tut.intro.toLowerCase() : "";
    for(let kw of state.specialVal){
      if(kw && intro.includes(kw)) { matched=true; break; }
    }
    if(!matched) reasons.push("無特殊關鍵字");
  }
  tut.reasons = reasons;
  return reasons.length===0;
}

function updateTagUI(){
  let tagbox = box.querySelector("#tc_tags");
  tagbox.innerHTML = "";
  TAGS.forEach(tag=>{
    let btn = document.createElement("span");
    btn.className = "tc-tag";
    btn.textContent = tag.label;
    btn.title = tag.desc;
    if(filterState[tag.key]) btn.classList.add("tc-on");
    else btn.classList.add("tc-off");
    btn.onclick = function(){
      filterState[tag.key] = !filterState[tag.key];
      if(tag.key==="special"){
        let inp=box.querySelector("#tc_special_input");
        inp.style.display=filterState.special?"block":"none";
        if(filterState.special) inp.focus();
      }
      renderTutors();
      updateTagUI();
      showMsg("["+tag.label+"]篩選已"+(filterState[tag.key]?"開啟":"關閉"));
    };
    tagbox.appendChild(btn);
  });
  let inp=box.querySelector("#tc_special_input");
  inp.style.display=filterState.special?"block":"none";
}

function renderTutors(){
  document.querySelectorAll('.tc-tutor-reason-box').forEach(div=>div.remove());
  filterState.tutorData.forEach(tut=>{
    let show = tutorFilter(tut, filterState);
    let node = tut.node;
    node.classList.remove('tc-tutor-card-collapsed','tc-tutor-card-expanded');
    node.style.display="";
    removeHighlights(node);
    if(show){
      node.style.display = "";
      if(filterState.special && Array.isArray(filterState.specialVal) && filterState.specialVal.length){
        highlightKeywords(node, filterState.specialVal);
      }
    }else{
      node.style.display = "none";
      let reasonDiv = document.createElement('div');
      reasonDiv.className = "tc-tutor-reason-box";
      let reasonCont = document.createElement('div');
      reasonCont.className = "tc-tutor-reason";
      reasonCont.textContent = "不顯示原因：" + tut.reasons.join("，") + "\n（點擊可展開/收起導師卡片）";
      reasonDiv.appendChild(reasonCont);
      if(node.parentNode) node.parentNode.insertBefore(reasonDiv, node);
      let expanded = false;
      reasonCont.onclick=function(e){
        expanded = !expanded;
        if(expanded){
          node.style.display="";
          node.classList.remove('tc-tutor-card-collapsed');
          node.classList.add('tc-tutor-card-expanded');
          if(filterState.special && Array.isArray(filterState.specialVal) && filterState.specialVal.length){
            highlightKeywords(node, filterState.specialVal);
          }
        }else{
          node.classList.remove('tc-tutor-card-expanded');
          node.classList.add('tc-tutor-card-collapsed');
          setTimeout(()=>{node.style.display="none";},220);
        }
      };
      node.classList.remove('tc-tutor-card-expanded');
      node.classList.add('tc-tutor-card-collapsed');
    }
  });
  let showCount=filterState.tutorData.filter(tut=>tutorFilter(tut,filterState)).length;
  box.querySelector("#tc_none").style.display = showCount? "none":"block";
}

function hasDSEGradeKeyword(txt) {
  return /5\s*(\*{1,2}|星{1,2}|星星)?/i.test(txt);
}

box.querySelector("#tc_submit").onclick=function(){
  let txt = box.querySelector("#tc_case_input").value.trim();
  if(!txt){ showMsg("請先貼上個案資料！"); return;}
  let c = analyzeCase(txt);
  filterState.caseData = c;
  filterState.feeRange = c.fee;
  filterState.genderVal = c.gender;
  filterState.gradeVal = c.grade;
  filterState.verifiedVal = c.verified;
  filterState.expVal = c.exp;
  filterState.specialVal = [];
  filterState.areaVal = c.area;
  filterState.fee = !!c.fee;
  filterState.area = false; // 默認關閉地點
  filterState.gender = !!c.gender;

  let specialTxt = "";
  let lines = txt.replace(/\r/g,"").split('\n').map(v=>v.trim());
  for (let line of lines) {
    if (/特別要求/.test(line)) {
      let m = line.match(/特別要求[:：]?\s*(.*)/);
      specialTxt = m ? m[1] : "";
      break;
    }
  }
  filterState.grade = hasDSEGradeKeyword(specialTxt);

  filterState.verified = !!c.verified;
  filterState.exp = !!c.exp;
  filterState.special = false;
  filterState.bad = false;
  filterState.fresh = false;
  box.querySelector("#tc_filter_box").style.display = "block";
  filterState.tutorData = parseTutorList();
  updateTagUI();
  renderTutors();
  setTimeout(()=>{let t=box.querySelector("#tc_case_input");t.style.height="auto";t.style.height=Math.min(t.scrollHeight,420)+"px";},300);
  showMsg("已自動篩選導師，點擊按鈕可切換條件！");
};
const specialInput = box.querySelector("#tc_special_input");
specialInput.onkeydown = function(e){
  if(e.key==="Enter"){
    e.preventDefault();
    let val = this.value.trim();
    let arr = val.split(",").map(v=>v.replace(/^\s+|\s+$/g,"").toLowerCase()).filter(Boolean);
    filterState.specialVal = arr;
    renderTutors();
    if(arr.length){
      showMsg("已搜尋關鍵字");
    }
  }
};
specialInput.oninput = function(e){};
}
})();
