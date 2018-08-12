var interval = null;
$(function () {
    helper.getStorage('open_flow', function (data) {
        console.log('------------7654------------');
        //更改分辨率
        helper.setScreen();
        //更改系统类型
        changeOsType();
        //更改浏览器
        changeBrowser();
        //取时间间隔
        if (/*data.select && data.select == 1 && */data.type && data.type == '7654') {
            setTimeout(function () {
                //页面向下随机滚动
                window.scrollTo(0, helper.random(1000));
                while (true) {
                    var links = $('#J_dh_body').find('a');
                    if (links.length > 0) {
                        helper.randomKeywords(function (ret) {
                            $('#J_search_input').val(ret);
                            $('#J_search_submit_btn').click();
                        });
                        //从其中随机选一个链接打开(因为导航要求是打开以后 还要又持续点击才算数)
                        setTimeout(function () {
                            window.scrollTo(0, helper.random(0, 1000));
                            var clickDom1 = helper.randomArr(links);
                            clickDom1.click();
                        }, 3000);
                        setTimeout(function () {
                            var clickDom2 = helper.randomArr(links);
                            clickDom2.click();
                        }, 6000);
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
    helper.runJsByTag(jsCode, 'change-os');
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
    helper.runJsByTag(jsCode, 'change-broswer');
}





