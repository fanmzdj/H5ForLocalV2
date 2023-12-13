function sendMessageToSwift(blob) {
  // 使用 window.webkit.messageHandlers.callbackHandler.postMessage() 向 Swift 发送数据
  if (window.webkit && window.webkit.messageHandlers) {
    window.webkit.messageHandlers.callbackHandler.postMessage(blob);
  } else {
    saveAs(blob, new Date().getTime());
  }
}

function callJSFunction() {
  greetFromJS();
}
