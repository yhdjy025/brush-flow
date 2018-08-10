//为兼容firefox和chrome
var getip_url = 'https://survey.yhdjy.cn/admin/getip';
if (typeof chrome == 'undefined') {
    var chrome = browser;
}

/**
 * 助手类
 */
class Helper {
    /**
     * 去掉自负床的空格换行等
     * @param testStr
     * @returns {*}
     */
    iGetInnerText(testStr) {
        let resultStr = testStr.replace(/\ +/g, ""); //去掉空格
        resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
        resultStr = testStr.replace(/[\r\n\t]/g, ""); //去掉回车换行
        return resultStr;
    }

    /**
     * 获取元素的xpath
     * @param element       要获取元素dom，不是jquerydom
     * @returns {string}    返回xpath
     */
    getDomXpath(element) {
        if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
            return '//*[@id=\"' + element.id + '\"]';
        }
        //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
        if (element == document.body) {//递归到body处，结束递归
            return '/html/' + element.tagName.toLowerCase();
        }
        var ix = 1,//在nodelist中的位置，且每次点击初始化
            siblings = element.parentNode.childNodes;//同级的子元素

        for (var i = 0, l = siblings.length; i < l; i++) {
            let sibling = siblings[i];
            //如果这个元素是siblings数组中的元素，则执行递归操作
            if (sibling == element) {
                return this.getDomXpath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
                //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
            } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
                ix++;
            }
        }
    }

    getIp() {
        $.get(getip_url, function (ret) {
            chrome.runtime.sendMessage({message: "sendIp", data: ret});
        });
    }

    /**
     * 通过xpath找到指定元素
     * @returns {Array}
     */
    parseXpath(xpath) {
        let xresult = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        let xnodes = [];
        let xres;
        while (xres = xresult.iterateNext()) {
            xnodes.push(xres);
        }
        return xnodes;
    }

    /**
     * 调用指定window的方法
     * @param toWindow
     * @param method
     * @param params
     * @param domain
     */
    callTop(method, params = {}, domain = '*') {
        if (!window.parent) return false;

        this.postMessage(window.parent, 'callTop', {method: method, params: params}, domain);
    }

    callIframe(method, params = {}, domain = '*') {
        let iframe = this.getiframeWindow();
        if (!iframe) return false;
        this.postMessage(iframe, 'callIframe', {method: method, params: params}, domain);
    }

    /**
     * 监听消息调用，如果调用的函数有指定的返回值，还会回调回去
     */
    onCall() {
        window.addEventListener('message', function (ev) {
            if (ev.data.key == window.callFunction) {
                let method = ev.data.data.method.split('.');
                let fun = window;
                for (let i = 0; i < method.length; i++) {
                    fun = fun[method[i]];
                }
                if (typeof fun == 'function') {
                    fun(ev.data.data.params);
                }
            }
        }, false);
    }

    /**
     * 向指定window发送消息
     * @param toWindow
     * @param key
     * @param data
     * @param domain
     */
    postMessage(toWindow, key, data = {}, domain = '*') {
        toWindow.postMessage({key: key, data: data}, domain);
    }

    /**
     * 获取当前窗口下的第一个iframe弹窗
     * @returns {Window}
     */
    getiframeWindow() {
        let iframe = $('iframe');
        if (iframe.length == 0)
            return false;
        else
            return iframe[0].contentWindow;
    }

    /**
     * 存储
     * @param key   键
     * @param data  值
     */
    setStorage(key, data) {
        let param = {};
        param[key] = data;
        chrome.storage.local.set(param);
    }

    /**
     * 取存储
     * @param key       键
     * @param callback  回调  因为是异步取的 只能回调
     */
    getStorage(key, callback) {
        chrome.storage.local.get(key, function (data) {
            if (data[key]) {
                if (typeof callback == 'function')
                    callback(data[key]);
            }
        });
    }

    /**
     * 更改分辨率
     * 原理，在页面的js加载之前 先把windows.screen里的屏幕信息修改了，
     * 这样登网页的js加载后获取到的信息 就是你改了以后的
     */
    setScreen() {
        var newScreen = {};
        $.each(window.screen, function (i, v) {
            newScreen[i] = v;
        })
        let screens = [
            {width: 2560, height: 1080},
            {width: 2560, height: 1440},
            {width: 1920, height: 1080},
            {width: 1600, height: 1200},
            {width: 1600, height: 900},
            {width: 1440, height: 900},
            {width: 1366, height: 768}
        ];
        let screenBit = [
            8, 10, 12, 16, 24, 32
        ];
        let random = this.randomArr(screens);
        let rdBit = this.randomArr(screenBit);
        newScreen.width = random.width;
        newScreen.height = random.height;
        newScreen.availWidth = random.width;
        newScreen.pixelDepth = rdBit;
        newScreen.colorDepth = rdBit;
        let jsCode = 'window.screen = ' + JSON.stringify(newScreen) + ';';
        this.runJsByTag(jsCode, 'change-screen');

    }

    /**
     * 运行js
     * @param jsCode
     * @param id
     * 因为 插件js是不能直接调用网页的js的 所以这里通过页面插入一个元素 点后用点击时间取运行网页的js
     */
    runJsByTag(jsCode, id) {
        $('body').find('#' + id).remove();
        let html = "<a id='" + id + "' href='javascript:;' onclick='" + jsCode + "'></a>"
        $('body').append(html);
        document.getElementById(id).click();
    }

    /**
     * 这个是用prop页面取调用js 但调用到的不是网页的js而是插件的js
     * @param code
     */
    runJs(code) {
        chrome.runtime.sendMessage({message: "runJs", data: code}, function (response) {
            console.log(response)
        });
    }

    /**
     * 随机取数组匀速
     * @param arr
     * @returns {*}
     */
    randomArr(arr) {
        return arr[this.random(0, arr.length)];
    }

    /**
     * 随机数
     * @param min
     * @param max
     * @returns {number}
     */
    random(min, max) {
        return Math.round(min + Math.random() * max);
    }
}

var helper = new Helper();