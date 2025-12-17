javascript:(function(){
  // === 支援多種別名/正則的規則，優先比對 ===
  var subjectRules = [
    { match: /^英文$|^English$|^English SL$|^English HL$/i, code: "E" },
    { match: /^中文$|^Chinese$|^Chinese SL$|^Chinese HL$/i, code: "C" },
    { match: /^數學$|^Mathematics$|^Math$|^Mathematics HL$|^Mathematics SL$/i, code: "M" },
    { match: /^物理$|^Physics$|^Physics SL$|^Physics HL$/i, code: "P" },
    { match: /^化學$|^Chemistry$|^Chemistry SL$|^Chemistry HL$/i, code: "Chem" },
    { match: /^生物$|^Biology$|^Biology HL$|^Biology SL$/i, code: "Bio" },
    // 你可在這裡添加更多正則規則
  ];
  // === 精確對應表 ===
  var subjectMap = {
    "功課": "HW",
    "全科": "A",
    "地理": "G",
    "經濟": "Ec",
    "商業管理": "Bus",
    "會計": "Ac",
    "資訊及通訊科技": "ICT",
    "西史": "WHis",
    "中史": "CHis",
    "普通話": "PTH",
    "綜合科學": "IS",
    "廣東話": "CT",
    "旅遊與款待": "旅款",
    "升學面試課": "面試",
    "中國文學": "CL",
    "英國文學": "EL",
    "日語": "JP",
    "公民與社會發展科": "公民",
    "Further Mathematics": "FMaths",
    "Pure Mathematics": "PMaths"
    // ...可自行添加
  };

  // 取得所有case row
  var rows = Array.from(document.querySelectorAll('table tr')).filter(function(tr){
    return tr.querySelector('a[href]');
  });

  // 解析所有case資料
  var cases = rows.map(function(tr){
    var tds = tr.querySelectorAll('td');
    var caseId = tr.querySelector('a[href]')?.textContent.trim();
    var subject = tds[6]?.textContent.trim() || ""; // 第7欄為科目
    var phone = tds[8]?.textContent.trim().replace(/\(\d+\)$/, '').replace(/，/g, ',').replace(/ /g,'') || ""; // 第9欄為電話
    return {
      caseId: caseId,
      row: tr,
      tds: tds,
      subject: subject,
      phone: phone
    };
  }).filter(function(c){return !!c.caseId;});

  if (!cases.length) { alert('找不到任何case'); return; }

  // 輸入caseID
  var inputId = prompt('請輸入對上已開的case ID');
  if (!inputId) return;
  var idx = cases.findIndex(function(c){ return c.caseId == inputId; });
  if (idx === -1) { alert('找不到case ID: '+inputId); return; }

  // 先定義 highlight 樣式（#99CCFF亮藍色）
  var styleId = '__case_highlight_style__';
  document.getElementById(styleId)?.remove();
  var style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    .case-row-highlight-bookmarklet, .case-td-highlight-bookmarklet {
      background: #99CCFF !important;
      transition: background 0.4s, box-shadow 0.3s;
    }
    .case-td-highlight-bookmarklet {
      box-shadow: 0 0 0 2px #99CCFF !important;
      position: relative !important; 
      z-index: 2 !important;
    }
  `;
  document.head.appendChild(style);

  function highlightRowAndTds(row, tds) {
    document.querySelectorAll('.case-row-highlight-bookmarklet').forEach(function(tr){
      tr.classList.remove('case-row-highlight-bookmarklet');
    });
    document.querySelectorAll('.case-td-highlight-bookmarklet').forEach(function(td){
      td.classList.remove('case-td-highlight-bookmarklet');
    });
    if(row){
      row.classList.add('case-row-highlight-bookmarklet');
    }
    if(tds){
      for(var i=0; i<tds.length; i++){
        tds[i].classList.add('case-td-highlight-bookmarklet');
      }
      tds[0]?.parentElement.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  // 將科目名稱轉為代碼（rules > map > 原文）
  function mapSubjectToCode(subjectName) {
    // 比對 subjectRules（正則/多語）
    for(var i=0;i<subjectRules.length;i++){
      if(subjectRules[i].match.test(subjectName)) return subjectRules[i].code;
    }
    // 再查 subjectMap（精確）
    if(subjectMap[subjectName]) return subjectMap[subjectName];
    // 都沒中，用原字
    return subjectName;
  }

  function showPopup(atIdx) {
    idx = atIdx;
    var c = cases[idx];
    // 只用中英文逗號分割，空白不拆
    var codes = c.subject.split(/[,，]+/).map(function(s){
      return mapSubjectToCode(s.trim());
    }).filter(Boolean);
    var caseCode = 'T'+c.caseId+(codes.length ? codes.join('&') : '');

    // 彈窗內容
    var html = ''
      + '<div style="font-size:18px;margin-bottom:10px;">'
      + 'CaseID: <b>'+c.caseId+'</b><br>'
      + '科目: <b>'+c.subject+'</b><br>'
      + '電話: <b>'+c.phone+'</b><br>'
      + '</div>'
      + '<button id="pre_case" style="margin-right:10px;">上一個</button>'
      + '<button id="next_case" style="margin-right:10px;">下一個</button>'
      + '<button id="copy_phone" style="margin-right:10px;">複製電話</button>'
      + '<button id="copy_casecode">生成名稱</button>'
      + '<span style="float:right;cursor:pointer;font-size:16px;" id="close_popup">❌</span>'
      ;

    // 建立/刷新彈窗
    var popup = document.createElement('div');
    popup.id = 'case_popup_box';
    popup.innerHTML = html;
    Object.assign(popup.style, {
      position:'fixed',
      top:'16px',
      right:'16px',
      left:'auto',
      transform:'none',
      background:'#fff',
      border:'2px solid #888',
      padding:'24px',
      zIndex:99999,
      borderRadius:'12px',
      boxShadow:'0 6px 32px #0003',
      minWidth:'320px'
    });
    document.querySelectorAll('#case_popup_box').forEach(function(e){e.remove();});
    document.body.appendChild(popup);

    highlightRowAndTds(c.row, c.tds);

    document.getElementById('pre_case').onclick = function(){
      if(idx>0) showPopup(idx-1);
    };
    document.getElementById('next_case').onclick = function(){
      if(idx<cases.length-1) showPopup(idx+1);
    };
    document.getElementById('copy_phone').onclick = function(){
      copyToClipboard(c.phone);
    };
    document.getElementById('copy_casecode').onclick = function(){
      copyToClipboard(caseCode);
    };
    document.getElementById('close_popup').onclick = function(){
      popup.remove();
      highlightRowAndTds();
    };
  }

  function copyToClipboard(text){
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text);
    }else{
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly','');
      ta.style.position='absolute';
      ta.style.left='-9999px';
      document.body.appendChild(ta);
      ta.select();
      try{document.execCommand('copy');}catch(e){prompt('請手動複製',text);}
      document.body.removeChild(ta);
    }
  }

  showPopup(idx);
})();
