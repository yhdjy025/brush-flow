/**
 * @var open_flow 这个变量是存在localstorage里的
 *      'time' => 时间间隔
 *      'select' => 是否开启刷流量功能
 */
'use strict';
//取消代理
helper.cancelProxy();

helper.setUa();
helper.beforeRequest();
helper.getScreen();
var runingFlag = 0;     //正在刷标志
var proxyFlag = 0;      //代理标志
///检测状态
setInterval(function () {
    helper.getStorage('open_flow', function (data) {
        if (data.select == 1) {
            if (runingFlag == 0) {    //如果未启动
                console.log('----------start--------');
                runingFlag = 1;
                applyTask(data);
            }
        } else if (runingFlag == 1 && data.select != 1) {
            console.log('------stop----------')
            helper.cancelProxy();       //推出代理
            runingFlag = 0;
        }
    });
}, 2000);

//获取任务
function applyTask(data) {
    helper.cancelProxy();
    proxyFlag = 0;
    $.ajax({            //请求任务
        type: 'POST',
        url: base_url + applyTask_url,
        data: {group: data.group},
        dataType: 'json',
        success: function (ret) {
            if (1 == ret.status) {
                var task = ret.data;
                selectedUa = helper.getRandomUA();
                helper.getScreen();
                //设置代理
                helper.setProxy(task.proxy.IP, task.proxy.Port, function () {
                    proxyFlag = 1;
                    //清理缓存 cookie storage登 各种缓存
                    helper.clearCache(function () {
                        setTimeout(function () {
                            $.each(task.urls, function (i, v) {
                                chrome.windows.create({url: v.url});
                            });
                            //检测代理是否失效
                            var closrAllFlag = 0;
                            var timer = setInterval(function () {
                                var timestrap = Date.parse(new Date()) / 1000;
                                if (timestrap > task.proxy.ExpireTimeStramp && closrAllFlag == 0) {
                                    closeAllTabs(false);
                                    closrAllFlag = 1;
                                }
                                if (timestrap > task.time) {
                                    closeAllTabs(true);
                                    clearInterval(timer);
                                }
                            }, 1000)
                        }, 1000);
                    });
                });
            }
        },
        error: function (ret) {
            console.log('-----------post error---------------');
            setTimeout(function () {
                closeAllTabs(true);
            }, 20 * 1000);
        }
    })
}


//处理代理失败
helper.onProxyError(function () {
    if (0 == proxyFlag) {
        console.log('-----------proxy error---------------');
        setTimeout(function () {
            closeAllTabs(true);
        }, 20 * 1000);
    }
});

//关闭所有窗口
function closeAllTabs(reBrush) {
    chrome.tabs.query({}, function (tabs) {
        var tabids = [];
        for (let tab of tabs) {
            tabids.push(tab.id);
        }
        if (tabids.length > 0) {
            chrome.tabs.remove(tabids);
        }

        if (true == reBrush) {
            runingFlag = 0;
        }
    });
}

