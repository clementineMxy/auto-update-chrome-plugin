console.log('这里是 popup.js')

// const bg = chrome.extension.getBackgroundPage()
// console.log(`bg`, bg);
// console.log(`bg.params()`, bg.params());
// console.log(`bg.fn()`, bg.fn());
// console.log(`bg.document.body.innerHTML`, bg.document.body.innerHTML);

/**
 * popup.js 和 backgound.js 之间的通信通常通过 chrome.runtime.sendMessage 来实现
 */
// 通讯：1-1、（popup -> background）popup 发送消息给 background（每次打开popup，就会走一遍这里的代码，也就是说 background 会再次接收到这条消息）
console.log('1-1、（popup -> background）--- popup 开始给 background 发送消息了!!')
chrome.runtime.sendMessage({ type: 'popup -> background' }, (response) => {
    console.log('1-1、（popup -> background）--- 收到background消息 end', response)
})


// 通讯：1-2、（background -> popup）background 发送消息给 popup
// 因为 popup.js 的生命周期随弹框打开才开始，所以这里需要连接，让 background
// 知道 popup 页面已打开
const port = chrome.runtime.connect({ name: 'popup' });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'background -> popup') {
        console.log('1-2、（background -> popup）--- 收到了background消息，准备回复', request)
        sendResponse({ success: true, message: '1-2、（background -> popup）--- popup 收到 background 的消息了' })
    }
})

// 通讯 3-1、（content-script -> popup）popup 收到 content-script 的消息后回复
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'content-script -> popup') {
        console.log('3-1、（content-script -> popup）--- 收到了content-script消息，准备回复', request)
        sendResponse({ success: true, message: '3-1、（content-script -> popup）--- popup 收到 content-script 的消息了' })
    }
})

// 通讯：3-2、（popup -> content-script）popup 发送消息给 content-script
chrome.tabs.query({ currentWindow: true }, function (tabs) {
    tabs.forEach(tab => {
        // 可以在这里写个if 判断，但是最好别在query方法中传入 active:true，测不了
        console.log('3-2、（popup -> content-script）--- popup 开始给 content-script 发送消息了!!')
        // 注意！！这里使用的是 tabs，但是在 content-script 中监听时，还是用的chrome.runtime.onMessage.add
        chrome.tabs.sendMessage(tab.id, { type: 'popup -> content-script' }, (response) => {
            console.log('3-2、（popup -> content-script）--- 收到了content-script消息 end', response)
        })
    })
})