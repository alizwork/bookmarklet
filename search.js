(function(){
const nearbyMap = {
  "中環": ["中環","金鐘","上環","西營盤","半山","蘭桂坊"],
  "金鐘": ["金鐘","中環","灣仔","金鐘道"],
  "灣仔": ["灣仔","銅鑼灣","金鐘","跑馬地","大坑"],
  "銅鑼灣": ["銅鑼灣","灣仔","天后","跑馬地","大坑"],
  "天后": ["天后","銅鑼灣","北角"],
  "北角": ["北角","炮台山","天后","鰂魚涌"],
  "炮台山": ["炮台山","北角","鰂魚涌"],
  "鰂魚涌": ["鰂魚涌","太古城","西灣河","北角"],
  "太古城": ["太古城","鰂魚涌","西灣河"],
  "西灣河": ["西灣河","筲箕灣","太古城"],
  "筲箕灣": ["筲箕灣","西灣河","柴灣","杏花邨"],
  "柴灣": ["柴灣","筲箕灣","杏花邨","小西灣"],
  "杏花邨": ["杏花邨","小西灣","筲箕灣","柴灣"],
  "小西灣": ["小西灣","杏花邨","柴灣"],
  "薄扶林": ["薄扶林","數碼港","鋼綫灣"],
  "數碼港": ["數碼港","薄扶林"],
  "鋼綫灣": ["鋼綫灣","薄扶林"],
  "香港仔": ["香港仔","鴨脷洲","田灣"],
  "鴨脷洲": ["鴨脷洲","香港仔","利東","海怡半島"],
  "田灣": ["田灣","香港仔"],
  "黃竹坑": ["黃竹坑","海怡半島","利東"],
  "海怡半島": ["海怡半島","鴨脷洲","黃竹坑","利東"],
  "利東": ["利東","鴨脷洲","黃竹坑","海怡半島"],
  "深水灣": ["深水灣","淺水灣","黃竹坑"],
  "淺水灣": ["淺水灣","深水灣","赤柱"],
  "赤柱": ["赤柱","淺水灣","石澳","大潭"],
  "大潭": ["大潭","赤柱","石澳"],
  "石澳": ["石澳","赤柱","大潭"],
  "石排灣": ["石排灣","華富","香港仔"],
  "華富": ["華富","石排灣","薄扶林"],
  "跑馬地": ["跑馬地","銅鑼灣","大坑","灣仔"],
  "大坑": ["大坑","跑馬地","銅鑼灣","灣仔"],
  "九龍城": ["九龍城","九龍仔","馬頭圍","土瓜灣","紅磡","何文田","黃埔"],
  "九龍塘": ["九龍塘","又一村","大窩坪","石硤尾"],
  "牛頭角": ["牛頭角","九龍灣","觀塘"],
  "九龍灣": ["九龍灣","牛頭角","觀塘"],
  "觀塘": ["觀塘","牛頭角","九龍灣","藍田"],
  "藍田": ["藍田","油塘","觀塘"],
  "油塘": ["油塘","藍田","鯉魚門"],
  "鯉魚門": ["鯉魚門","油塘"],
  "黃大仙": ["黃大仙","慈雲山","竹園","鑽石山","斧山"],
  "鑽石山": ["鑽石山","牛池灣","黃大仙","慈雲山"],
  "牛池灣": ["牛池灣","鑽石山","黃大仙"],
  "樂富": ["樂富","橫頭磡","黃大仙"],
  "長沙灣": ["長沙灣","深水埗","荔枝角"],
  "深水埗": ["深水埗","長沙灣","荔枝角","石硤尾"],
  "荔枝角": ["荔枝角","長沙灣","美孚"],
  "美孚": ["美孚","荔枝角","南昌"],
  "南昌": ["南昌","美孚"],
  "旺角": ["旺角","油麻地","太子","佐敦","大角咀"],
  "油麻地": ["油麻地","旺角","佐敦"],
  "佐敦": ["佐敦","油麻地","尖沙咀"],
  "尖沙咀": ["尖沙咀","佐敦","柯士甸"],
  "柯士甸": ["柯士甸","尖沙咀","佐敦"],
  "太子": ["太子","旺角","大角咀"],
  "大角咀": ["大角咀","旺角","奧運"],
  "奧運": ["奧運","大角咀","旺角"],
  "屯門": ["屯門","兆康","新墟","蝴蝶灣","龍門","洪水橋"],
  "兆康": ["兆康","屯門","洪水橋"],
  "洪水橋": ["洪水橋","兆康","屯門","元朗"],
  "元朗": ["元朗","天水圍","洪水橋","錦上路","朗屏"],
  "天水圍": ["天水圍","元朗","流浮山"],
  "流浮山": ["流浮山","天水圍","元朗"],
  "錦上路": ["錦上路","元朗","朗屏"],
  "朗屏": ["朗屏","元朗","錦上路"],
  "荃灣": ["荃灣","葵涌","青衣","梨木樹"],
  "葵涌": ["葵涌","青衣","石籬","荃灣"],
  "青衣": ["青衣","葵涌","荃灣"],
  "石籬": ["石籬","葵涌"],
  "葵盛": ["葵盛","葵涌"],
  "馬鞍山": ["馬鞍山","烏溪沙","馬料水","西貢","沙田"],
  "烏溪沙": ["烏溪沙","馬鞍山","馬料水"],
  "馬料水": ["馬料水","烏溪沙","馬鞍山","沙田"],
  "沙田": ["沙田","大圍","火炭","馬鞍山","馬料水","小瀝源","石門","第一城","恆安","沙田圍","車公廟","顯徑"],
  "大圍": ["大圍","沙田","火炭","車公廟"],
  "火炭": ["火炭","大圍","沙田"],
  "小瀝源": ["小瀝源","沙田"],
  "石門": ["石門","沙田"],
  "第一城": ["第一城","沙田","恆安"],
  "恆安": ["恆安","第一城","沙田"],
  "沙田圍": ["沙田圍","沙田"],
  "車公廟": ["車公廟","沙田","大圍"],
  "顯徑": ["顯徑","沙田"],
  "大埔": ["大埔","太和"],
  "太和": ["太和","大埔"],
  "上水": ["上水","粉嶺"],
  "粉嶺": ["粉嶺","上水"],
  "沙頭角": ["沙頭角","上水"],
  "西貢": ["西貢","清水灣","將軍澳","調景嶺","馬鞍山"],
  "調景嶺": ["調景嶺","將軍澳","西貢"],
  "將軍澳": ["將軍澳","調景嶺","坑口","寶琳","康城","西貢"],
  "坑口": ["坑口","將軍澳","寶琳"],
  "寶琳": ["寶琳","將軍澳","坑口"],
  "康城": ["康城","將軍澳"],
  "東涌": ["東涌","大嶼山"],
  "大嶼山": ["大嶼山","東涌"],
  "愉景灣": ["愉景灣","坪洲"],
  "坪洲": ["坪洲","愉景灣"],
  "長洲": ["長洲"],
  "南丫島": ["南丫島"],
  "澳門大堂區": ["澳門大堂區","澳門新馬路","澳門皇朝"],
  "澳門新馬路": ["澳門新馬路","澳門大堂區"],
  "澳門皇朝": ["澳門皇朝","澳門大堂區"]
};
function clearHighlight(){
  document.querySelectorAll('.gpt-num-highlight,.gpt-area-highlight,.gpt-multikey-highlight,.gpt-multi-highlight').forEach(function(e){
    if(e.classList.contains('gpt-num-highlight')||e.classList.contains('gpt-area-highlight')||e.classList.contains('gpt-multikey-highlight')){
      var parent=e.parentNode;parent.replaceChild(document.createTextNode(e.textContent),e);parent.normalize();
    }else{
      e.style.background='';e.style.outline='';e.classList.remove('gpt-multi-highlight');
    }
  });
  var oldNav=document.getElementById('gpt-nav-ui');
  if(oldNav)oldNav.remove();
}
clearHighlight();
var mode=prompt('💩 Welcome to Aliz Search 💩\n請輸入數字選擇搜尋模式：\n1 = 學費範圍 💰\n2 = 多組關鍵字 🔍\n3 = 鄰近地區 📍\n4 = 進階複合搜尋（可多條件同時篩選）✨\n其它 = 關閉 ❌');
if(!['1','2','3','4'].includes(mode)) return;
function getTextNodes(node){
  var nodes=[];
  if(node.nodeType===3){nodes.push(node);}
  else if(node.nodeType===1&&node.childNodes&&!/^(script|style|textarea|input)$/i.test(node.tagName)){
    for(var i=0;i<node.childNodes.length;i++)nodes=nodes.concat(getTextNodes(node.childNodes[i]));
  }
  return nodes;
}
var textNodes=getTextNodes(document.body);
function showNav(highlights,infoText){
  if(!highlights.length){alert('找不到符合的結果！');return;}
  var idx=0;
  function scrollToHighlight(i){
    highlights.forEach(function(h){h.style.outline='';});
    highlights[i].scrollIntoView({behavior:'smooth',block:'center'});
    highlights[i].style.outline='2.5px solid orange';
  }
  scrollToHighlight(idx);
  var navDiv=document.createElement('div');
  navDiv.id="gpt-nav-ui";
  navDiv.style.position='fixed';
  navDiv.style.top='30px';
  navDiv.style.right='30px';
  navDiv.style.background='rgba(255,255,200,0.97)';
  navDiv.style.border='1px solid #aaa';
  navDiv.style.zIndex=999999;
  navDiv.style.padding='8px 12px';
  navDiv.style.borderRadius='6px';
  navDiv.style.boxShadow='0 2px 8px #ccc';
  navDiv.style.fontFamily='sans-serif';
  navDiv.style.fontSize='15px';
  navDiv.innerHTML=
    '<button id="gpt-prev">上一個</button>' +
    '<span id="gpt-counter">'+(idx+1)+' / '+highlights.length+'</span>' +
    '<button id="gpt-next">下一個</button>' +
    '<button id="gpt-close" style="margin-left:10px;">關閉</button>' +
    '<span style="margin-left:10px;font-size:90%;color:#444;">'+infoText+'</span>';
  document.body.appendChild(navDiv);
  document.getElementById('gpt-prev').onclick=function(){
    idx=(idx-1+highlights.length)%highlights.length;
    scrollToHighlight(idx);
    document.getElementById('gpt-counter').textContent=(idx+1)+' / '+highlights.length;
  };
  document.getElementById('gpt-next').onclick=function(){
    idx=(idx+1)%highlights.length;
    scrollToHighlight(idx);
    document.getElementById('gpt-counter').textContent=(idx+1)+' / '+highlights.length;
  };
  document.getElementById('gpt-close').onclick=function(){
    navDiv.remove();
    highlights.forEach(function(h){
      if(h.classList.contains('gpt-num-highlight')||h.classList.contains('gpt-area-highlight')||h.classList.contains('gpt-multikey-highlight')){
        var parent=h.parentNode;parent.replaceChild(document.createTextNode(h.textContent),h);parent.normalize();
      }else{
        h.style.background='';h.style.outline='';h.classList.remove('gpt-multi-highlight');
      }
    });
  };
}
if(mode==='1'){
  var min=parseFloat(prompt('請輸入最低學費（不建議搜尋個位數）：','100'));
  var max=parseFloat(prompt('請輸入最高學費：','300'));
  if(isNaN(min)||isNaN(max)||min>max)return alert('輸入無效');
  var numberRegex=/\d+(\.\d+)?/g;
  var highlights=[];
  textNodes.forEach(function(node){
    var text=node.nodeValue,match,lastIndex=0,parent=node.parentNode,frag=document.createDocumentFragment();
    numberRegex.lastIndex=0;var found=false;
    while((match=numberRegex.exec(text))!==null){
      var num=parseFloat(match[0]);
      if(num>=min&&num<=max){
        found=true;
        frag.appendChild(document.createTextNode(text.slice(lastIndex,match.index)));
        var span=document.createElement('span');
        span.textContent=match[0];
        span.className='gpt-num-highlight';
        span.style.background='yellow';
        span.style.color='black';
        span.style.fontWeight='bold';
        frag.appendChild(span);
        highlights.push(span);
        lastIndex=match.index+match[0].length;
      }
    }
    if(found){
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      parent.replaceChild(frag,node);
    }
  });
  showNav(highlights,'數值範圍：'+min+' ~ '+max);
}
if(mode==='2'){
  var input=prompt('請輸入關鍵字（可多個，用逗號或空格分隔）：\n例如：幼稚園,幼兒');
  if(!input)return;
  var keywords=input.split(/[,，\s]+/).map(function(s){return s.trim();}).filter(Boolean);
  if(!keywords.length)return;
  var regex=new RegExp(keywords.map(function(k){return k.replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1");}).join('|'),'g');
  var highlights=[];
  textNodes.forEach(function(node){
    var text=node.nodeValue,match,lastIndex=0,parent=node.parentNode,frag=document.createDocumentFragment();
    regex.lastIndex=0;var found=false;
    while((match=regex.exec(text))!==null){
      found=true;
      frag.appendChild(document.createTextNode(text.slice(lastIndex,match.index)));
      var span=document.createElement('span');
      span.textContent=match[0];
      span.className='gpt-multikey-highlight';
      span.style.background='gold';
      span.style.color='black';
      span.style.fontWeight='bold';
      frag.appendChild(span);
      highlights.push(span);
      lastIndex=match.index+match[0].length;
    }
    if(found){
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      parent.replaceChild(frag,node);
    }
  });
  showNav(highlights,"多關鍵字："+keywords.join(", "));
}
if(mode==='3'){
  var area=prompt('請輸入一個地區名稱（如：馬鞍山 / 新蒲崗 / 西灣河...）：');
  if(!area)return;
  area=area.trim();
  var keywords=[],foundKey=null;
  for(var key in nearbyMap){
    if(key===area){keywords=nearbyMap[key];foundKey=key;break;}
  }
  if(!foundKey){
    for(var key in nearbyMap){
      if(nearbyMap[key].includes(area)){keywords=nearbyMap[key];foundKey=key;break;}
    }
  }
  if(!foundKey){alert('抱歉，未有此地區的鄰近地區資料，可聯絡開發者擴充！');return;}
  var regex=new RegExp(keywords.map(function(k){return k.replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1");}).join('|'),'g');
  var highlights=[];
  textNodes.forEach(function(node){
    var text=node.nodeValue,match,lastIndex=0,parent=node.parentNode,frag=document.createDocumentFragment();
    regex.lastIndex=0;var found=false;
    while((match=regex.exec(text))!==null){
      found=true;
      frag.appendChild(document.createTextNode(text.slice(lastIndex,match.index)));
      var span=document.createElement('span');
      span.textContent=match[0];
      span.className='gpt-area-highlight';
      span.style.background='lime';
      span.style.color='black';
      span.style.fontWeight='bold';
      frag.appendChild(span);
      highlights.push(span);
      lastIndex=match.index+match[0].length;
    }
    if(found){
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      parent.replaceChild(frag,node);
    }
  });
  showNav(highlights,'地區：「'+area+'」及鄰近 ('+keywords.join('、')+')');
}
if(mode==='4'){
  const searchExamples = [
    {
      label: "最低學費（例如：200，留空=不限）",
      example: "例：200",
      key: "minFee",
      placeholder: ""
    },
    {
      label: "最高學費（例如：400，留空=不限）",
      example: "例：400",
      key: "maxFee",
      placeholder: ""
    },
    {
      label: "性別（例如：男 或 女，留空=不限）",
      example: "例：女",
      key: "gender",
      placeholder: ""
    },
    {
      label: "關鍵字（多個用逗號、空格或頓號分隔，留空=不限）",
      example: "例：英文,幼兒",
      key: "keywords",
      placeholder: ""
    },
    {
      label: "地區（可只填地區名或地鐵站名，留空=不限）",
      example: "例：沙田",
      key: "area",
      placeholder: ""
    }
  ];
  var values = {};
  for(var i=0;i<searchExamples.length;i++){
    var filled = '';
    if(i>0){
      filled = '\n\n已填資料：\n' + searchExamples.slice(0,i)
        .map(function(e){
          var val=values[e.key]; 
          return e.label.replace(/（[^）]*）/,'')+'：'+(val?val:'（未填）');
        }).join('\n');
    }
    var msg =
      '【'+searchExamples[i].label+'】\n'+searchExamples[i].example+'\n\n（全部可留空）'+filled;
    var v = prompt(msg, searchExamples[i].placeholder || "");
    if(v === null) return;
    values[searchExamples[i].key] = v.trim();
  }
  var min = values["minFee"] ? parseFloat(values["minFee"]) : null;
  var max = values["maxFee"] ? parseFloat(values["maxFee"]) : null;
  var gender = values["gender"] ? values["gender"].replace(/[^男女]/g,'') : '';
  var keywords = values["keywords"] ? values["keywords"].split(/[,，\s]+/).map(function(s){return s.trim();}).filter(Boolean) : [];
  var area = values["area"] ? values["area"].trim() : '';
  var areaList = [];
  if(area){
    areaList = [area];
    for(var key in nearbyMap){
      if(key === area){areaList = nearbyMap[key];break;}
      if(nearbyMap[key].includes(area)){areaList = nearbyMap[key];break;}
    }
  }
  document.querySelectorAll('.gpt-multi-highlight').forEach(function(e){
    e.style.background='';e.classList.remove('gpt-multi-highlight');e.style.outline='';
  });
  var tutors = Array.from(document.querySelectorAll('a.sentence[data-tutor-id]'));
  var results = [];
  tutors.forEach(function(card){
    var feeText = card.querySelector('.tutor-response-fee')?card.querySelector('.tutor-response-fee').textContent:'';
    var fee = feeText?parseFloat(feeText.replace(/[^\d.]/g,'')):null;
    var feeOK = true;
    if(min!==null||max!==null){
      feeOK = false;
      if(fee!==null&&!isNaN(fee)){
        feeOK = ((!min||fee>=min)&&(!max||fee<=max));
      }
    }
    var genderText = card.querySelector('.gender')?card.querySelector('.gender').textContent.trim():'';
    var genderOK = gender ? (genderText===gender) : true;
    var mainText = card.innerText||'';
    var keywordOK = keywords.length ? keywords.some(function(k){return mainText.includes(k)}) : true;
    var areaText = '';
    var areaLabel = card.querySelector('label[style*="font-weight:bold"]');
    if(areaLabel) areaText = areaLabel.textContent.trim();
    var areaOK = areaList.length ? areaList.some(function(a){return areaText.includes(a)||mainText.includes(a)}) : true;
    if(feeOK&&genderOK&&keywordOK&&areaOK){
      card.classList.add('gpt-multi-highlight');
      card.style.background = 'linear-gradient(90deg,#fffd96,#a2ffd6)';
      results.push(card);
    }
  });
  if(!results.length){
    alert('找不到符合的導師');
    return;
  }
  var idx=0;
  function scrollTo(i){
    results.forEach(function(x){x.style.outline='';});
    results[i].scrollIntoView({behavior:'smooth',block:'center'});
    results[i].style.outline='3px solid #3af';
  }
  scrollTo(idx);
  var nav=document.createElement('div');
  nav.id="gpt-nav-ui";
  nav.style.position='fixed';
  nav.style.top='35px';
  nav.style.right='35px';
  nav.style.background='#fff8cc';
  nav.style.border='1px solid #aaa';
  nav.style.zIndex=999999;
  nav.style.padding='8px 16px';
  nav.style.borderRadius='7px';
  nav.style.boxShadow='0 2px 8px #bbb';
  nav.style.fontFamily='sans-serif';
  nav.style.fontSize='16px';
  function condText(){
    var arr=[];
    if(min||min===0) arr.push(min+'元以上');
    if(max||max===0) arr.push(max+'元以下');
    if(gender) arr.push(gender);
    if(keywords.length) arr.push(keywords.join('、'));
    if(areaList.length) arr.push(areaList.join('、'));
    return arr.join('，');
  }
  nav.innerHTML=
    '<button id="gpt-prev">上一個</button>' +
    '<span id="gpt-count">'+(idx+1)+' / '+results.length+'</span>' +
    '<button id="gpt-next">下一個</button>' +
    '<button id="gpt-close" style="margin-left:12px;">關閉</button>' +
    '<span style="color:#444;font-size:90%;margin-left:10px;">'+condText()+'</span>';
  document.body.appendChild(nav);
  document.getElementById('gpt-prev').onclick=function(){
    idx=(idx-1+results.length)%results.length;
    scrollTo(idx);
    document.getElementById('gpt-count').textContent = (idx+1)+' / '+results.length;
  };
  document.getElementById('gpt-next').onclick=function(){
    idx=(idx+1)%results.length;
    scrollTo(idx);
    document.getElementById('gpt-count').textContent = (idx+1)+' / '+results.length;
  };
  document.getElementById('gpt-close').onclick=function(){
    nav.remove();
    results.forEach(function(x){
      x.style.background='';x.style.outline='';x.classList.remove('gpt-multi-highlight');
    });
  };
}
})();
