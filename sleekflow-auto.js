(function() {
  // 1. 觸發條件設計
  const triggers = [
    {
      groups: [
        { all: ["鏈結的導師", "如有合適"] },
        { all: ["名單中", "合適的導師"] },
        { all: ["圖中", "請盡快通知我們"] },
        { all: ["不合適", "有什麼要求"] },
        { all: ["Fine Tune", "Search"] },
        { all: ["你會考慮此導師嗎"] },
        { all: ["履歷合適", "提供上堂時間"] },
        { all: ["實時更新", "有合適"] }
      ],
      reply: "請問仍需要尋找補習導師嗎😊？見未收到你的回覆，或者是有什麼疑惑的地方嗎？請回覆我們一下讓我們知道😊🙏🏻"
    },
    {
      groups: [
        { all: ["個案編號", "你嘅個案"] }
        ],
      reply: "請問鏈結的導師合適嗎😊？如有合適的話請盡快通知我們為你安排，以免導師約滿😊🙏🏻"
    },
    {
      groups: [
        { all: ["名單", "未收到你的回覆"] },
        { all: ["仍需要尋找補習導師", "未收到你的回覆"] }
      ],
      reply: "見仍未收到你的回覆，個案會為你先關閉。有需要的話歡迎再聯絡我哋Tutor Circle尋補，或可以重新在網站再作申請，謝謝😊🙏🏻"
    },
    {
      groups:[
        { all: ["沒有合適"] },
        { all: ["不合適"] }
        ],
      reply: "如果不合適，請問您對導師是另有什麼要求嗎？可以告訴我們，讓我們能重新根據您的要求更快找到合適的導師😊"
    }
  ];

  // 2. 取得所有訊息節點
  let msgNodes = Array.from(document.querySelectorAll('span[data-testid="inbox-conversation-text-message"] > span'));
  if (!msgNodes.length) {
    alert("無法取得訊息內容，請確認在對話畫面！");
    return;
  }
  let lastMsgNode = msgNodes[msgNodes.length - 1];
  let lastMsg = lastMsgNode.innerText.trim();

  // 3. 向上遍歷，找上一個日期分隔
  let dateText = null;
  let node = lastMsgNode.parentElement;
  while (node) {
    // 查找同層的之前兄弟節點
    let prev = node.previousSibling;
    while (prev) {
      if (
        prev.matches &&
        prev.matches('button[data-sentry-element="StickyDateIndicatorButtonBase"]')
      ) {
        dateText = (prev.childNodes[0]?.textContent || prev.textContent).trim();
        break;
      }
      prev = prev.previousSibling;
    }
    if (dateText) break;
    node = node.parentElement;
  }
  if (!dateText) {
    // 若還找不到，抓全頁最後一個日期分隔
    let dateBtns = Array.from(document.querySelectorAll('button[data-sentry-element="StickyDateIndicatorButtonBase"]'));
    if (dateBtns.length) {
      dateText = (dateBtns[dateBtns.length-1].childNodes[0]?.textContent || dateBtns[dateBtns.length-1].textContent).trim();
    }
  }

  // 4. 分析這個日期
  let isToday = false;
  if (dateText) {
    if (/^today$/i.test(dateText)) isToday = true;
    // 你可在這裡擴充中文 Today
  }

  if (isToday) {
    alert("今天已經有過溝通，不會再自動輸入訊息。");
    return;
  }

  // 5. 判斷要回覆的內容
  function getReply(msg) {
    for (let t of triggers) {
      if (t.groups) {
        for (let g of t.groups) {
          let allPass = !g.all || g.all.every(k => msg.includes(k));
          let anyPass = !g.any || g.any.some(k => msg.includes(k));
          if (allPass && anyPass) return t.reply;
        }
      } else {
        let allPass = !t.all || t.all.every(k => msg.includes(k));
        let anyPass = !t.any || t.any.some(k => msg.includes(k));
        if (allPass && anyPass) return t.reply;
      }
    }
    return "";
  }
  let reply = getReply(lastMsg);
  if (!reply) {
    alert("最後一則訊息不符合任何回覆條件，未自動輸入。");
    return;
  }

  // 6. 填入回覆到輸入框（優先用直接輸入）
  let inputBox = document.querySelector('textarea[data-testid="inbox-conversation-input-textbox"]');
  if (inputBox && !inputBox.disabled && !inputBox.readOnly) {
    setReactTextareaValue(inputBox, reply);
    inputBox.focus();
    return;
  }

  // 7. 進入範本流程
  function findTemplateMainBtn() {
    let btns = document.querySelectorAll('button');
    for (let btn of btns) {
      if (btn.textContent && btn.textContent.trim().toLowerCase() === "choose template") {
        return btn;
      }
    }
    return null;
  }
  let templateBtn = findTemplateMainBtn();
  if (!templateBtn) {
    alert("找不到『Choose template』按鈕！");
    return;
  }
  templateBtn.click();

  function waitForTemplateCardAndClick(maxTry = 50) {
    let card = document.querySelector('button[data-testid="whatsapp-template-card-greetings_hello_1-en"]');
    if (card) {
      card.click();
      setTimeout(clickConfirmChooseTemplate, 50);
    } else if (maxTry > 0) {
      setTimeout(() => waitForTemplateCardAndClick(maxTry - 1), 50);
    } else {
      alert("找不到目標範本選項！");
    }
  }

  function clickConfirmChooseTemplate(maxTry = 50) {
    let confirmBtn = document.querySelector('button[data-testid="broadcasts-template-dialog-choose-template-button"]');
    if (confirmBtn) {
      confirmBtn.click();
      setTimeout(fillTemplateInput, 50);
    } else if (maxTry > 0) {
      setTimeout(() => clickConfirmChooseTemplate(maxTry - 1), 50);
    } else {
      alert("找不到確認選擇範本的按鈕！");
    }
  }

  function fillTemplateInput(maxTry = 50) {
    let span = document.querySelector('span[data-testid="inbox-insert-template-variable-body\\.0\\.text"]');
    if (span && span.getAttribute("contenteditable") === "true") {
      span.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);
      insertTextToContentEditable(span, reply);
    } else if (maxTry > 0) {
      setTimeout(() => fillTemplateInput(maxTry - 1), 50);
    } else {
      alert("找不到範本輸入框！");
    }
  }

  setTimeout(waitForTemplateCardAndClick, 50);

  // 工具函式
  function setReactTextareaValue(textarea, value) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    setter.call(textarea, value);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function insertTextToContentEditable(el, text) {
    el.innerText = text;
    el.dispatchEvent(new InputEvent("input", { bubbles: true }));
  }
})();


