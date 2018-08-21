/**
 * @var open_flow 这个变量是存在localstorage里的
 *      'time' => 时间间隔
 *      'select' => 是否开启刷流量功能
 *      'type' => 刷流量类型  2345、7654、qq软件管家
 */

'use strict';

helper.cancelProxy();

var interval1 = null;
helper.setUa();
///检测状态
setInterval(function () {
    helper.getStorage('open_flow', function (data) {
        helper.randomSeconds(data.time ? data.time : 30)
        if (data.select == 1) {
            if (interval1 == null) {    //如果未启动
                start(data);
            }
        } else if (interval1 != null) {
            clearInterval(interval1);
            console.log('------stop----------')
            helper.cancelProxy();       //推出代理
            interval1 = null;           //清空定时器
        }
    });
}, 1000);

//启动刷流量
function start(data) {
    console.log('----------start--------');
    let times = helper.randomSeconds(data.time ? data.time : 30);
    interval1 = setInterval(function () {
        //设置useragent 其实是用webRequest接口拦截请求 修改header里的UA
        helper.setUa();
        spider(data);
    }, times * 1000);
}

///循环刷
function spider(data) {
    //查找所有打开的浏览器标签
    chrome.tabs.query({}, function (tabs) {
        var tabsId = [];
        var mainTab = null;
        for (let tab of tabs) {
            tabsId.push(tab.id);
        }
        if (mainTab != null && data.urls) {
            //设置代理
            helper.setProxy(function () {
                //清理缓存 cookie storage登 各种缓存
                helper.clearCache(function () {
                    //重新打开要刷流量的网站
                     $.each(data.urls, function (i, v) {
                         if (v.open) {
                             chrome.tabs.create({url: v.url});
                         }
                     })
                    //关闭之前的旧的所有页面
                    chrome.tabs.remove(tabsId);
                });
            });
        }
    });
}
