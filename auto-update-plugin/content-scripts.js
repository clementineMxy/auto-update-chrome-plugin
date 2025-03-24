console.log("js已注入，当前版本：5.0.6");


/**
 * content-scripts（可选）：给页面注入js / css，无法被DOM调用（定义内容脚本，可以访问和操作网页内容。）
 * 
 * 内容脚本是在目标页面上下文中运行的文件。通过使用标准的文档对象模型（Document Object Model，DOM），
 * 它们能够读取浏览器访问的目标页面的详细信息，对它们进行更改，并将信息传递给它们的父扩展。
 * 
 * 1、content-scripts 能获取到页面上 dom，但访问不到目标页下的window.xxx 变量，
 * 比如 window.___baidu_union！！
 * 也就是说 **content-scripts 和原始页面共享DOM，但是不共享JS！！**
 * content-scripts 不能访问绝大部分 chrome.xxx.api，除了下面这4种：
 * - chrome.extension(getURL, inIncognitoContext, lastError, onRequest, sendRequest)
 * - chrome.i18n
 * - chrome.runtime(connect, getManifest, getURL, id, onConnect, onMessage, sendMessage)
 * - chrome.storage
 * 
 */
const dom = document.getElementById('blogColumnPayAdvert')
dom?.addEventListener('click', () => {
    console.log(`dom click`, '输出页面上的 window.___baidu_union', window.___baidu_union)
})

/**
 * 2、content-script.js 和 background.js 通常通过 chrome.runtime.sendMessage 或 chrome.tabs.sendMessage 进行消息传递。
 */
// 通讯：2-1、（content-script -> background）content-script 发送消息给 background
console.log('2-1、（content-script -> background）--- content-script 开始给 background 发送消息了!!')
chrome.runtime.sendMessage({ type: 'content-script -> background' }, (response) => {
    console.log('2-1、（content-script -> background）--- 收到background消息 end', response)
})

// 通讯：2-2、（background -> content-script）background 发送消息给 content-script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'background -> content-script') {
        console.log('2-2、（background -> content-script）--- 收到了background消息，准备回复', request)
        sendResponse({ success: true, message: '2-2、（background -> content-script）--- content-script 收到 background 的消息了' })
    }
    // return true // 保持消息通道打开，以便异步发送响应，别打开，打开就接收不到了
})


// 通讯 3-1、（content-script -> popup）content-script 发送消息给 popup
setTimeout(() => {
    console.log('3-1、（content-script -> popup）--- content-script 开始给 popup 发送消息了!!')
    chrome.runtime.sendMessage({ type: 'content-script -> popup' }, (response) => {
        console.log('3-1、（content-script -> popup）--- 收到popup消息 end', response)
    })
}, 4000);

// 通讯：3-2、（popup -> content-script）popup 发送消息给 content-script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'popup -> content-script') {
        console.log('3-2、（popup -> content-script）--- 收到了popup消息，准备回复', request)
        sendResponse({ success: true, message: '3-2、（popup -> content-script）--- content-script 收到 popup 的消息了' })
    }
    // return true // 保持消息通道打开，以便异步发送响应，别打开，打开就接收不到了
})


