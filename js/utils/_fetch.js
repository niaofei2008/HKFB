//由于fetch没有原生的timeout设置，故通过setTimeout引发reject操作
module.exports=function _fetch(fetch_promise, timeout) {
    //这是一个可以被reject的promise
    let abort_promise = new Promise((resolve, reject) => 
        setTimeout(reject, timeout, "访问超时")
    );
    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    return Promise.race([fetch_promise, abort_promise]);
}