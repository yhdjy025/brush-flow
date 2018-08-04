var helper = new Helper();

var interval = null;
var time = 30;
$(function () {
    helper.getStorage('open_flow', function (data) {
        //更改分辨率
        changeScreen();
        //更改系统类型
        changeOsType();
        //更改浏览器
        changeBrowser();
        //取时间间隔
        time = (data.time ? data.time : time) * 1000;
        console.log(time)
        if (data.select && data.select == 1) {
            setTimeout(function () {
                //页面向下随机滚动
                window.scrollTo(0, randomNum(1000));
                while(true) {
                    var links = $('#J_dh_body').find('a');
                    if (links.length > 0) {
                        //从其中随机选一个链接打开
                        var clickDom1 = randomArr(links);
                        clickDom1.click();
                        var clickDom2 = randomArr(links);
                        clickDom2.click();
                        closeActiveTab(time - 5000);
                        break;
                    }
                }
            }, 5000);
        }
    });
});

//生成分辨率
function setScreen() {
    var newScreen = {};
    $.each(window.screen, function (i, v) {
        newScreen[i] = v;
    })
    var screens = [
        {width: 2560, height: 1600},
        {width: 1920, height: 1080},
        {width: 1600, height: 1200},
        {width: 1600, height: 900},
        {width: 1440, height: 900},
        {width: 1366, height: 768}
    ];
    var random = randomArr(screens);
    newScreen.width = random.width;
    newScreen.height = random.height;
    newScreen.availWidth = random.width;
    return newScreen;
}

//更改分辨率
function changeScreen() {
    var newScreen = setScreen();
    var jsCode = 'window.screen = ' + JSON.stringify(newScreen) + ';';
    runJs(jsCode, 'change-screen');
}


//关闭tab
function closeActiveTab(timeOut) {
    chrome.runtime.sendMessage({
        msg: 'closeActiveTab',
        timeOut: timeOut
    }, function (response) {
        console.log(response);
    });
}

function changeOsType() {
    var os = [
        'Windows 10',
        'Windows 8',
        'Windows 7',
        'Windows XP'
    ];
    var randomOs = randomArr(os);
    var jsCode = 'GLOBAL.Util.getOsType = function(){return "'+randomOs+'"};';
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
    var randomBroswer = randomArr(browser);
    var jsCode = 'GLOBAL.Util.getBrowserType = function(){return "'+randomBroswer+'"};';
    runJs(jsCode, 'change-broswer');
}


function runJs(jsCode, id) {
    $('body').find('#' + id).remove();
    var html = "<a id='" + id + "' href='javascript:;' onclick='" + jsCode + "'></a>"
    $('body').append(html);
    document.getElementById(id).click();
}

//随机取数组元素
function randomArr(arr) {
    return arr[randomNum(arr.length)];
}

//生成随机数
function randomNum(max) {
    return Math.floor(Math.random() * max);
}


