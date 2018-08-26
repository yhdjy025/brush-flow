//为兼容firefox和chrome
if (typeof chrome == 'undefined') {
    var chrome = browser;
}

var selectedUa = '';

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

    /**
     * 随机取数组元素
     * @param arr
     * @returns {*}
     */
    randomArr(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
}

var helper = new Helper();