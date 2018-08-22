/**
 * @var open_flow 这个变量是存在localstorage里的
 *      'time' => 时间间隔
 *      'select' => 是否开启刷流量功能
 *      'type' => 刷流量类型  2345、7654、qq软件管家
 */

'use strict';

helper.cancelProxy();

var openFlag = 0;
helper.setUa();
///检测状态
setInterval(function () {
    helper.getStorage('open_flow', function (data) {
        helper.randomSeconds(data.time ? data.time : 30)
        if (data.select == 1) {
            if (openFlag == 0) {    //如果未启动
                console.log('----------start--------');
                openFlag = 1;       //避免重复开启
                start();
            }
        } else if (openFlag == 1) {
            console.log('------stop----------')
            helper.cancelProxy();       //推出代理
            openFlag = 0;
        }
    });
}, 1000);

//启动刷流量
function start() {
    if (0 == openFlag) return false;
    //载读取一次，为了可是随时改时间，而不用重启
    helper.getStorage('open_flow', function (data) {
        var isOpenUrl = 0;
        $.each(data.urls, function (i, v) {
            if (v.open) {
                isOpenUrl = 1;
                chrome.tabs.create({url: v.url});
            }
        });
        if (0 == isOpenUrl) return false;
        let times = helper.randomSeconds(data.time ? data.time : 30);
        //为了岁时间间隔 所以用setTimeout
        setTimeout(function () {
            //拦截设置UA
            helper.setUa();
            spider(data);
        }, times * 1000);
    });
}

///循环刷
function spider(data) {
    //查找所有打开的浏览器标签
    try {
        chrome.tabs.getAllInWindow(function (tabs) {
            var tabsId = [];
            for (let tab of tabs) {
                tabsId.push(tab.id);
            }
            if (tabsId.length > 0) {
                //设置代理
                helper.setProxy(function () {
                    //清理缓存 cookie storage登 各种缓存
                    helper.clearCache(function () {
                        //关闭之前的旧的所有页面
                        chrome.tabs.remove(tabsId);
                        //循环调用
                        start();
                    });
                });
            }
        });
    } catch (e) {
        console.log(e)
        openFlag = 0;   //出错了后让守护进程重试
    }
}
