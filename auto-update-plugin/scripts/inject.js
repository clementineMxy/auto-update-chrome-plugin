

const xx = 'xx'
const sayHello = () => {
    console.log('hello', xx, window.xx)
}

window.xx = xx
window.sayHello = sayHello

console.log('这里是注入的 js，并暴露出来了一些变量和方法', window.sayHello())