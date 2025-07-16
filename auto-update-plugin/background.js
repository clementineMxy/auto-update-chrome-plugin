// import './background2'
console.log("插件已加载，当前版本：5.0.0");


/**
 * service_worker(background)
 *
 * 浏览器触发事件，例如导航到一个新页面，删除一个书签，或关闭一个标签。扩展使用后台 service worker
 * 监听这些事件，并在触发时执行回调。
 *
 * 1、service_worker ，是一个常驻的页面，它的生命周期是插件中所有类型页面中最长的，
 *  它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以通常把需要一直运行的、启动就运行的、
 *  全局的代码放在background里面。
 *  service_worker 跑在一个单独的线程，可以使用插件特有的 API，它本质上也是一个 js 文件，和 content_script 的区别在于:
 *      - service_worker 的生命周期更长，浏览器打开时开始，关闭浏览器才会结束。
 *          而 content_script 的生命周期跟随插件的打开和关闭。通常使用 service_worker 来监听用户的
 *          一些操作从而执行回调。
 *      - service_worker 不能访问目标页面的 DOM，而 content_script 可以。
 *
 */


// 通讯： 1-1、（popup -> background）background 收到 popup 的消息后回复
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'popup -> background') {
        console.log('1-1、（popup -> background）--- 收到了popup消息，准备回复', request)
        sendResponse({ success: true, message: '1-1、（popup -> background）--- background 收到消息了' })
    }
})

// 通讯：1-2、（background -> popup）background 发送消息给 popup
// 因为 popup.js 的生命周期随弹框打开才开始，所以这里需要先监听
// popup 页面的连接
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
        console.log('Popup 页面已打开');

        // background 发送消息给 popup
        console.log('1-2、（background -> popup） --- background 开始给 popup 发送消息了!!')
        chrome.runtime.sendMessage({ type: 'background -> popup' }, (response) => {
            console.log('1-2、（background -> popup）--- 收到popup消息 end', response)
        })

        // 监听 popup 页面断开连接
        port.onDisconnect.addListener(() => {
            console.log('Popup 页面已关闭');
        });
    }
})


// 通讯 2-1、（content-script -> background）background 收到 content-script 的消息后回复
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'content-script -> background') {
        console.log('2-1、（content-script -> background）--- 收到了content-script消息，准备回复', request)
        sendResponse({ success: true, message: '2-1、（content-script -> background）--- background 收到 content-script 的消息了' })
    }
})

// 通讯 2-2、（background -> content-script）content-script 发送消息给 background
setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        tabs.forEach(tab => {
            // 可以在这里写个if 判断，但是最好别在query方法中传入 active:true，测不了
            console.log('2-2、（background -> content-script） --- background 开始给 content-script 发送消息了!!')
            // 注意！！这里使用的是 tabs，但是在 content-script 中监听时，还是用的chrome.runtime.onMessage.add
            chrome.tabs.sendMessage(tab.id, { type: 'background -> content-script', tabId: tab.id }, (response) => {
                console.log('2-2、（background -> content-script）--- 收到了content-script消息 end', response)
            })
        })
    })
}, 3000)


// chrome.alarms.create("auto-update", { periodInMinutes: 2 });

// chrome.alarms.onAlarm.addListener(function (alarm) {
//     console.log(alarm.name)
//     if (alarm.name === 'auto-update') {
//         console.log('更新了啦啦啦')
//     }
// })


// 获取当前窗口所有的tab页面
// chrome.tabs.query({ currentWindow: true, }, function (tabs) {
//     // 向指定网址注入js代码
//     tabs.forEach(tab => {
//         if (tab.url.includes('https://www.cnblogs.com/')) {
//             console.log('进入当前的页面：', tab)
//             console.log(`chrome.scripting`, chrome.scripting);

//             chrome.scripting.executeScript({
//                 target: { tabId: tab.id },
//                 // files: ['scripts/inject.js'] // 指定要注入的JS文件路径
//                 func: injectedFunction,
//                 args: ["orange"],
//                 // function: () => {
//                 //     console.log('哈哈哈哈哈')
//                 //     window.xx = 'xx'

//                 //     function a() {
//                 //         console.log('这是啊')
//                 //     }
//                 // }
//             });
//         }
//     })
// });


// chrome.action.onClicked.addListener(function (tab) {
//     console.log('action 被点击了，tab', tab)
//     chrome.action.setBadgeText({ text: '1' })
//     chrome.action.setBadgeBackgroundColor({ color: 'red' })
// })


// var views = chrome.extension.getViews({ type: 'popup' })
// console.log(`views`, views);


// chrome.runtime.onInstalled.addListener(function () {
//     chrome.tabs.onActivated.addListener(function (tabId, changeInfo, tab) {
//         console.log('bg:', tabId)
//         chrome.tabs.sendMessage(tabId, 'changed')
//     })
// })


// const port = chrome.runtime.connect({ name: 'background' })
// port.postMessage({ text: 'Hello' })
// console.log('发送消息给content')

// port.onMessage.addListener(function (request, sender, sendResponse) {
//     console.log('收到消息：', request.text)
//     sendResponse({ response: `You said: "${request.text}"` });
// }, false);
