//为兼容firefox和chrome
var base_url = 'https://survey.yhdjy.cn/brush/';
var applyTask_url = 'applyTask';
if (typeof chrome == 'undefined') {
    var chrome = browser;
}

var selectedUa = {};

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
     * 设置代理
     * @param callback
     */
    setProxy(ip, port, callback) {
        helper.cancelProxy();
        var config = {
            mode: 'fixed_servers',
            rules: {
                /*proxyForHttp: {
                    host: ip,
                    port: Math.floor(port)
                },
                proxyForHttps: {
                    host: ip,
                    port: Math.floor(port)
                },*/
                singleProxy: {
                    scheme: 'socks5',
                    host: ip,
                    port: Math.floor(port)
                }
            }
        };
        chrome.proxy.settings.set({
            value: config,
            scope: 'regular'
        }, function () {
            console.log('>>>>proxy success');
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    /**
     * 监听代理错误
     * @param callback
     */
    onProxyError(callback) {
        chrome.proxy.onProxyError.addListener(function (detail) {
            console.log(detail.error);
            callback();
        });
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
            {
                ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko',
                browser: 'IE',
                core: 'ie_10.0'
            },
            {
                ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E)',
                browser: 'IE',
                core: 'ie_10.0'
            },
            {
                ua: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E)',
                browser: 'IE',
                core: 'ie_9.0'
            },
            {
                ua: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E)',
                browser: 'IE',
                core: 'ie_8.0'
            },
            //QQ
            {
                ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.3427.400 QQBrowser/9.6.12201.400',
                browser: 'QQ',
                core: 'qqbrowser_9.6.12201.400'
            },
            //chrome
            {
                ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
                browser: 'chrome',
                core: 'chrome_66'
            },
            //firefox
            {ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:55.0) Gecko/20100101 Firefox/55.0',
                browser: 'firefox',
                core: 'firefox_55'
            },
            //360
            {
                ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
                browser: '360',
                core: '360chrome_55.0'
            },
            //2345
            {
                ua: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.108 Safari/537.36 2345Explorer/8.8.0.16453',
                browser: '2345',
                core: '2345explorer_8.8.0.16453'
            },
        ];
        var os = [
            {version: 'Windows NT 10.0', os: 'Windows 10', os2: 'windows_10'},
            {version: 'Windows NT 6.2', os: 'Windows 8', os2: 'windows_8'},
            {version: 'Windows NT 6.1', os: 'Windows 7', os2: 'windows_7'},
            {version: 'Windows NT 5.1', os: 'Windows xp', os2: 'windows_xp'}
        ];
        //随机取ua
        var randomUa = this.randomArr(ua);
        //随机取os
        var randomOs = this.randomArr(os);
        //替换ua种的os
        randomUa.ua = randomUa.ua.replace('Windows NT 10.0', randomOs.version);
        randomUa.os = randomOs;
        helper.getStorage('open_flow', function (data) {
            if (data.type == '7654') {
                helper.setStorage('osProfile', randomOs.os);
                helper.setStorage('browserCategory', randomUa.browser);
            }
        });
        return randomUa;
    }

    /**
     * 设置UA
     */
    setUa() {
        chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
                if (!selectedUa.ua) {
                    selectedUa = helper.getRandomUA();
                }
                for (var i = 0; i < details.requestHeaders.length; i++) {
                    if (details.requestHeaders[i].name === 'User-Agent' || details.requestHeaders[i].name === 'Cookie') {
                        details.requestHeaders[i].value = selectedUa.ua;
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
     * 拦截请求 修改参数
     */
    beforeRequest() {
        chrome.webRequest.onBeforeRequest.addListener(function (details) {
                helper.getStorage('selected_screen', function (rand) {
                    if (rand.bodyWH) {
                        if (details.url.indexOf('pb.sogou.com/pv.gif?') != -1)  {
                            var url = details.url.replace(/mtmvp=.*?\&/, 'mtmvp=' + rand.bodyWH + '&');
                            return {redirectUrl: url};
                        }
                        if (details.url.indexOf('www.hao123.com/images/track.gif') != -1) {
                            if (!selectedUa.os) {
                                selectedUa = helper.getRandomUA();
                            }
                            var url = details.url.replace(/os=.*?\&/, 'os=' + selectedUa.os.os2 + '&');
                            url = details.url.replace(/browser=.*?\&/, 'browser=' + selectedUa.os.core + '&');
                            console.log(url)
                            return {redirectUrl: url};
                        }
                    }
                });
            },
            {urls: ['<all_urls>']},
            ['blocking']
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
     * 随机数
     * @param min
     * @param max
     * @returns {number}
     */
    random(min, max) {
        return Math.round(min + Math.random() * max);
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

    /**
     * 随机生成分辨率
     */
    getScreen() {
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
        let rdScreen = this.randomArr(screens);
        let rdBit = this.randomArr(screenBit);
        var bwidth = rdScreen.width - helper.random(10, 200);
        var bheight = rdScreen.height - helper.random(10, 200);
        var bodyWH = bwidth + 'x' + bheight;

        var rand = {
            rdScreen: rdScreen,
            rdBit: rdBit,
            bodyWH: bodyWH
        };
        this.setStorage('selected_screen', rand);
        return rand;
    }

}

var helper = new Helper();