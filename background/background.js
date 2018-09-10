/**
 * @var open_flow 这个变量是存在localstorage里的
 *      'time' => 时间间隔
 *      'select' => 是否开启刷流量功能
 */
'use strict';
//取消代理
var runingFlag = 0;     //正在刷标志
var proxyFlag = 0;      //代理标志
var timer = null;
///检测状态
setInterval(function () {
    helper.getStorage('open_flow', function (data) {
        if (data.select == 1) {
            if (runingFlag == 0) {    //如果未启动
                console.log('----------start--------');
                clearInterval(timer);
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
    if (runingFlag == 1) return false;
    helper.cancelProxy();
    runingFlag = 1;
    proxyFlag = 0;
    $.ajax({            //请求任务
        type: 'POST',
        url: base_url + applyTask_url,
        data: {group: data.group},
        dataType: 'json',
        success: function (ret) {
            if (1 == ret.status) {
                var task = ret.data;
                //休眠
                if (task.type == 'sleep') {
                    timer = setInterval(function () {
                        var timestrap = Date.parse(new Date()) / 1000;
                        var sub = timestrap - task.time;
                        if (timestrap > task.time && sub > task.seconds) {
                            clearInterval(timer);
                            closeAllTabs(true);
                        }
                    }, 1000)
                } else {
                    try {
                        selectedUa = helper.getRandomUA();
                        selectedScreen = helper.getScreen();
                    } catch (e) {
                        console.log('set ua and screen error' + e.toString());
                    }
                    //设置代理
                    helper.setProxy(task.proxy.IP, task.proxy.Port, task.proxy.Type, function () {
                        proxyFlag = 1;
                        //清理缓存 cookie storage登 各种缓存
                        helper.clearCache(function () {
                            setTimeout(function () {
                                try {
                                    $.each(task.urls, function (i, v) {
                                        chrome.windows.create({
                                                url: v.url,
                                                width: selectedScreen.bodyWH.width,
                                                height: selectedScreen.bodyWH.height
                                            });
                                    });
                                } catch (e) {
                                    console.log('create tab error' + e.toString());
                                }
                                //检测代理是否失效
                                var closrAllFlag = 0;
                                timer = setInterval(function () {
                                    var timestrap = Date.parse(new Date()) / 1000;
                                    if (timestrap > task.proxy.ExpireTimeStramp && closrAllFlag == 0) {
                                        closeAllTabs(false);
                                        closrAllFlag = 1;
                                    }
                                    var sub = timestrap - task.time;
                                    if (timestrap > task.time && sub > task.seconds) {
                                        clearInterval(timer);
                                        closeAllTabs(true);
                                    }
                                }, 1000)
                            }, 3000);
                        });
                    });
                }
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
    console.log('-----------proxy error---------------');
    closeAllTabs(false);
    helper.cancelProxy();
    if (0 == proxyFlag) {
        clearInterval(timer);
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
            try {
                chrome.tabs.remove(tabids);
            } catch (e) {
                console.log('close table error' + e.toString());
            }
        }

        if (true == reBrush) {
            runingFlag = 0;
        }
    });
}

