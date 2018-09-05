//为兼容firefox和chrome
var getip_url = 'https://survey.yhdjy.cn/brush/getip';
var getKeywords_url = 'https://survey.yhdjy.cn/brush/getKeywords';
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
        this.getStorage('selected_screen', function (rand) {
            var newScreen = {};
            $.each(window.screen, function (i, v) {
                newScreen[i] = v;
            })
            newScreen.width = rand.rdScreen.width;
            newScreen.height = rand.rdScreen.height;
            newScreen.availWidth = rand.rdScreen.width;
            newScreen.pixelDepth = rand.rdBit;
            newScreen.colorDepth = rand.rdBit;
            var jsCode = 'window.screen = ' + JSON.stringify(newScreen) + ';';
            helper.runJsByTag(jsCode, 'change-screen');
            var bodyset = setInterval(function () {
                if (document.body) {
                    var bodyWH = rand.bodyWH;
                    var offsetWidth = bodyWH.width + document.body.offsetWidth - document.body.clientWidth;
                    var offsetHeight = bodyWH.height + document.body.offsetHeight - document.body.clientHeight;
                    var jsCode = 'redefineProperties(document.body, {clientHeight: {value:'+bodyWH.height
                        +'}, clientWidth: {value:'+bodyWH.width+'}, offsetWidth: {value:'+offsetWidth
                        +'}, offsetHeight: {value:'+offsetHeight+'}});';
                    helper.runJsByTag(jsCode, 'change-bodyWG');
                    clearInterval(bodyset);
                }
            }, 1)
        });
    }

    setUa() {
        helper.getStorage('flow_ua', function (data) {
            var jsCode = 'redefineProperties(navigator, {platform: {value:"'+data.platform
                +'"}, userAgent: {value:"'+data.ua+'"}, deviceMemory: {value: '+ data.memory+'}})'
            helper.runJsByTag(jsCode, 'change-ua');
        });
    }

    /**
     * 运行js
     * @param jsCode
     * @param id
     * 因为 插件js是不能直接调用网页的js的 所以这里通过页面插入一个元素调用js
     */
    runJsByTag(jsCode, id) {
        $('#'+id).remove();
        var oldtag = document.getElementById(id);
        /*if (oldtag.length > 0) {
            oldtag.remove();
        }*/
        var tag = document.createElement('script');
        tag.id = id;
        tag.innerHTML = jsCode;
        document.documentElement.appendChild(tag)
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
        return arr[this.random(0, arr.length - 1)];
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
     * 获取随机关键词
     * @param callback
     */
    randomKeywords(callback) {
        var keyarr = ["短时强僵尸出没", "秦俊杰杨紫分手", "冲绳7万人集会", "搬家给差评遭报复", "教科书式老赖刑满", "蒙古国列车脱轨", "本田圭佑出任主帅", "男童卖冰棍买手表", "杀害情夫女子归案", "伊朗试射弹道导弹", "郑嘉颖陈凯琳结婚", "答题卡未被调包", "杭州绕城高速事故", "皇马3-1米兰", "山体崩塌前10分", "辽宁将召回高诗岩", "浦东机场坠亡辟谣", "青州发生车祸", "台风蓝色预警", "美大豆船靠港卸货", "鲁能3球员被三停", "奈保尔逝世", "曼彻斯特发生枪击", "秦俊杰工作室声明", "日偏食", "无证德牧咬伤少年", "谢霆锋旧照曝光", "泰达权健共用球场", "林更新否认已婚", "阿联酋足协致歉", "不罚登巴巴吴金贵", "诺奖得主 崔各庄", "抵制天价片酬声明", "千岛群岛发生地震", "南海6次警告美军", "滴滴司机曝光外挂", "克拉克森 亚运会", "陕西球迷围堵大巴", "西雅图飞机被盗", "误发黄海沉船消息", "男童商场扶梯坠下", "美国航空整改信息", "渣渣辉形象被盗用", "拼车拼到两条大狗", "切尔西开门红", "房山山体塌方", "日本议员入境被拒", "英军工厂爆炸", "准大学生划伤豪车", "顺风车加价起冲突", "中国新说唱", "鹿晗退出节目录制", "网红沙滩再发事故", "拼车拼到两条大狗", "人工智能", "王东明", "红旗l5", "毒狗药异烟肼", "卫生纸制馒头", "渣渣辉形象被盗用", "詹姆斯当教育部长", "张艺谋谈奥运假唱", "两分钟空降仨鸡蛋", "网购玩具枪案再审", "黑龙江炭疽疫情", "5900条假睫毛", "水立方将变冰立方", "台风路径实时发布系统", "黄海重大军事活动", "吻戏鉴定师", "中超", "空降排总成绩第二", "澳门赌场", "泰国和尚炫富被判", "英超直播", "海鲜哥救溺水女孩", "记者暗访走私冻肉", "加拿大枪击事件", "转让女儿救儿子", "卖麋鹿肉老板被拘", "风车动漫", "全国企业信用信息公示系统", "首张区块链发票", "若风自曝恋情", "龙目岛被地震抬高", "农村淘宝", "王思聪调侃杨超越", "人民币对美元汇率", "逼十岁女儿写作文", "437人上班时被抓", "玩扭扭车遭碾死", "吉林孙艳军被公诉", "拜仁20-2", "电商卖家自曝刷单", "高分拒绝清华北大", "清北本科落户争议", "中超积分榜", "十天前的外卖", "葛优躺侵权案二审", "马思纯欧豪分手", "高分拒绝清华北大", "拼车拼到两条大狗", "无人机刺杀总统案", "马高潮执行死刑", "女子曝光霸王家规", "张馨予宣布结婚", "渣渣辉形象被盗用", "大连海参被热死", "网红杀鱼弟自杀", "玩扭扭车遭碾死", "卢凯彤坠楼身亡", "邱淑贞看病被偶遇", "献血疼成表情包", "医生交接失误", "王思聪调侃杨超越", "星巴克 比特币", "拜仁20-2", "爱情公寓 盗墓片", "吴卓林被曝卖垃圾", "韩女性抗议偷拍", "马思纯欧豪分手", "清北本科落户争议", "网友向刘翔道歉", "马蓉发声明", "卫生纸制馒头", "杀妻藏尸案再开庭", "贾跃亭财产被冻结", "鹿晗退出节目录制", "十天前的外卖", "张艺谋谈奥运假唱", "中国学生被赶下机", "贷7000元还36万", "网红沙滩再发事故", "马思纯给鸭子扇风", "大陆将向金门供水", "抵制天价片酬声明", "支付宝上线拼团", "庆丰包子铺混改", "437人上班时被抓", "葛优躺侵权案二审", "吻戏鉴定师", "转让女儿救儿子", "华为回应退出美国", "摩拜女员工举报", "爱情公寓回应退票", "女孩直播割腕", "埃及新狮身人面像", "诺奖得主 崔各庄", "新型塑料袋溶于水", "滴滴司机曝光外挂", "网红沙滩再发事故", "拼车拼到两条大狗", "人工智能", "王东明", "红旗l5", "毒狗药异烟肼", "卫生纸制馒头", "詹姆斯当教育部长", "两分钟空降仨鸡蛋", "网购玩具枪案再审", "黑龙江炭疽疫情", "5900条假睫毛", "台风路径实时发布系统", "黄海重大军事活动", "吻戏鉴定师", "空降排总成绩第二", "澳门赌场", "泰国和尚炫富被判", "海鲜哥救溺水女孩", "记者暗访走私冻肉", "加拿大枪击事件", "转让女儿救儿子", "卖麋鹿肉老板被拘", "全国企业信用信息公示系统", "首张区块链发票", "龙目岛被地震抬高", "农村淘宝", "人民币对美元汇率", "逼十岁女儿写作文", "437人上班时被抓", "玩扭扭车遭碾死", "吉林孙艳军被公诉", "电商卖家自曝刷单", "高分拒绝清华北大", "清北本科落户争议", "十天前的外卖", "中秋节", "女子曝光霸王家规", "马高潮执行死刑", "鸿运国际", "百度指数", "印度威胁苹果封网", "英仙座流星雨", "香港挂牌", "美金对人民币的汇率", "大连海参被热死", "女孩直播割腕", "9斤螃蟹收900元", "人民币汇率", "无人机刺杀总统案"];
        if (typeof callback == 'function') {
            callback(helper.randomArr(keyarr));
        }
        return false;
        $.get(getKeywords_url, function (ret) {
            if (typeof callback == 'function') {
                callback(ret);
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
}

var helper = new Helper();
helper.runJsByTag("var redefineProperties = Object.defineProperties;");
//更改分辨率
helper.setUa();
helper.setScreen();
