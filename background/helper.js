//为兼容firefox和chrome
var getproxy_url = 'https://survey.yhdjy.cn/admin/getproxy';
var getproxy2_url = 'https://survey.yhdjy.cn/admin/getproxy2';
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
        var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
        resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
        resultStr = testStr.replace(/[\r\n\t]/g, ""); //去掉回车换行
        return resultStr;
    }

    /**
     * 存储
     * @param key   键
     * @param data  值
     */
    setStorage(key, data) {
        var param = {};
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
            if (typeof callback == 'function')
                callback(data[key] ? data[key] : []);
        });
    }

    /**
     * 获取代理IP   接口1
     * @param callback
     */
    gettProxy(callback) {
        this.getStorage('ip_list', function (data) {
            var url = getproxy_url;
            $.get(url, function (ret) {
                if (ret && ret.indexOf(':')) {
                    if (data.ips && data.ips == ret) {
                        helper.cancelProxy();
                        return false;
                    }
                    var count = data.count ? data.count + 1 : 1;
                    helper.setStorage('ip_list', {ips: ret, count: count})
                    if (typeof callback == 'function') {
                        var ip = ret.split(':');
                        callback(ip[0], ip[1]);
                    }
                }
            });
        });
    }

    /**
     * 获取代理IP   接口2
     * @param callback
     */
    gettProxy2(callback) {
        this.getStorage('ip_list', function (data) {
            var url = getproxy2_url;
            $.get(url, function (ret) {
                if (ret && ret.indexOf(':')) {
                    if (data.ips && data.ips == ret) {
                        helper.cancelProxy();
                        return false;
                    }
                    var count = data.count ? data.count + 1 : 1;
                    helper.setStorage('ip_list', {ips: ret, count: count})
                    if (typeof callback == 'function') {
                        var ip = ret.split(':');
                        callback(ip[0], ip[1]);
                    }
                }
            });
        });
    }


    /**
     * 设置代理
     * @param callback
     */
    setProxy(callback) {
        helper.cancelProxy();
        this.gettProxy2(function (ip, port) {
            var config = {
                mode: 'fixed_servers',
                rules: {
                    proxyForHttp: {
                        host: ip,
                        port: Math.floor(port)
                    },
                    proxyForHttps: {
                        host: ip,
                        port: Math.floor(port)
                    }
                }
            };
            console.log(ip)
            chrome.proxy.settings.set({
                value: config,
                scope: 'regular'
            }, function () {
                console.log('>>>>proxy success');
                if (typeof callback == 'function') {
                    callback()
                }
            });
        })
    }

    cancelProxy() {
        chrome.proxy.settings.clear({scope: 'regular'});
    }

    /**
     * 清理缓存
     * @param dayscallback
     * @param days
     * @param data
     */
    clearCache(callback, days = 365, data = null) {
        if (data == null) {
            data = {
                "appcache": true,
                //"cache": true,
                "cookies": true,
                "downloads": true,
                "fileSystems": true,
                "formData": true,
                "history": true,
                "indexedDB": true,
                "localStorage": true,
                "serverBoundCertificates": true,
                "webSQL": true
            };
        }
        var millisecondsPerWeek = 1000 * 60 * 60 * 24 * days;
        var ago = (new Date()).getTime() - millisecondsPerWeek;
        chrome.browsingData.remove({since: ago}, data, function () {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    /**
     *  生成随机秒数
     * @param avg           平均值
     * @returns {number}
     */
    randomSeconds(avg) {
        avg = Math.round(avg);
        let start = avg / 2;
        let end = avg + start;
        let random = Math.random();
        return Math.round(start + random * avg);
    }

    //随机获取浏览器UA信息
    getRandomUA() {
        var ua = [
            //IE
            {ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko', browser: 'IE'},
            {ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E)', browser: 'IE'},
            {ua: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E)', browser: 'IE'},
            {ua: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E)', browser: 'IE'},
            //QQ
            {ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.3427.400 QQBrowser/9.6.12201.400', browser: 'QQ'},
            //chrome
            {ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36', browser: 'chrome'},
            //firefox
            {ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:55.0) Gecko/20100101 Firefox/55.0', browser: 'firefox'},
            //360
            {ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36', browser: '360'},
            //2345
            {ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.108 Safari/537.36 2345Explorer/8.8.0.16453', browser: '2345'},
        ];
        var os = [
            {version: 'Windows NT 10.0', os: 'Windows 10'},
            {version: 'Windows NT 6.2', os: 'Windows 8'},
            {version: 'Windows NT 6.1', os: 'Windows 7'},
            {version: 'Windows NT 5.1', os: 'Windows xp'}
        ];
        //随机取ua
        var randomUa = this.randomArr(ua);
        //随机取os
        var randomOs = this.randomArr(os);
        //替换ua种的os
        randomUa.ua = randomUa.ua.replace('Windows NT 10.0', randomOs.version);
        helper.getStorage('open_flow', function (data) {
            if (data.type == '7654') {
                helper.setStorage('osProfile', randomOs.os);
                helper.setStorage('browserCategory', randomUa.browser);
            }
        });
        return randomUa.ua;
    }

    /**
     * 设置UA
     */
    setUa() {
        var ua = this.getRandomUA();
        chrome.webRequest.onBeforeSendHeaders.addListener(
            function (details) {
                for (var i = 0; i < details.requestHeaders.length; i++) {
                    if (details.requestHeaders[i].name === 'User-Agent' || details.requestHeaders[i].name === 'Cookie') {
                        details.requestHeaders[i].value = ua;
                        break;
                    }
                }
                return {requestHeaders: details.requestHeaders};
            },
            {urls: ['<all_urls>']},
            ['blocking', 'requestHeaders']
        )
    }

    /**
     * 随机取数组元素
     * @param arr
     * @returns {*}
     */
    randomArr(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    /**
     * 取消下载
     * @param callback
     */
    cancelDoenload(callback) {
        chrome.downloads.onCreated.addListener(function (downloadItem) {
            chrome.downloads.cancel(downloadItem.id, function () {
                console.log('cancel download');
                if (typeof callback == 'function') callback();
            })
        });
    }

}

var helper = new Helper();