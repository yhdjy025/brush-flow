var interval = null;
$(function () {
    helper.getStorage('open_flow', function (data) {
        //更改分辨率
        helper.setScreen();
        //更改系统类型
        changeOsType();
        //更改浏览器
        changeBrowser();
        //取时间间隔
        if (data.select && data.select == 1 && data.type && data.type == '7654') {
            setTimeout(function () {
                //页面向下随机滚动
                window.scrollTo(0, helper.random(1000));
                while (true) {
                    var links = $('#J_dh_body').find('a');
                    if (links.length > 0) {
                        //从其中随机选一个链接打开
                        var clickDom1 = helper.randomArr(links);
                        clickDom1.click();
                        var clickDom2 = helper.randomArr(links);
                        clickDom2.click();
                        break;
                    }
                }
            }, 5000);
        }
    });
});


function changeOsType() {
    var os = [
        'Windows 10',
        'Windows 8',
        'Windows 7',
        'Windows XP'
    ];
    var randomOs = helper.randomArr(os);
    var jsCode = 'GLOBAL.Util.getOsType = function(){return "' + randomOs + '"};';
    runJs(jsCode, 'change-os');
}

function changeBrowser() {
    var browser = [
        'IE',
        'firefox',
        'chrome',
        '360',
        'QQ',
        '2345',
        'sogou',
        'liebao',
        'UC'
    ];
    var randomBroswer = helper.randomArr(browser);
    var jsCode = 'GLOBAL.Util.getBrowserType = function(){return "' + randomBroswer + '"};';
    runJs(jsCode, 'change-broswer');
}





