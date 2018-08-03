
var helper = new Helper();

var interval = null;
var time = 30;
$(function () {
    helper.getStorage('open_flow', function (data) {
        //更改分辨率
        changeScreen();
        //取时间间隔
        time = data.time ? data.time : time;
        if (data.select && data.select == 1) {
            setTimeout(function () {
                //页面向下随机滚动
                window.scrollTo(0, Math.floor(Math.random()*1000));
                //取网页里的所有链接
                var links = $('#J_dh_body').find('a');
                //从其中随机选一个链接打开
                var clickDom = links[Math.floor(Math.random()*links.length)];
                clickDom.click();
                //5秒钟后
                setTimeout(function () {
                    //关闭打开的链接
                    closeActiveTab();
                    //清理浏览器缓存
                    //clearCache()；
                    //刷新页面
                    window.location.reload();
                }, time * 1000 - 5000);
            }, 5000);
        }
    });
});

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
    var random = screens[Math.floor(Math.random()*screens.length)];
    newScreen.width = random.width;
    newScreen.height = random.height;
    return newScreen;
}

function changeScreen() {
    var newScreen = setScreen();
    $('body').find('#set-screen').remove();
    var html = "<a id='set-screen' href='javascript:;' onclick='window.screen = "+JSON.stringify(newScreen)+";'></a>"
    $('body').append(html);
    document.getElementById('set-screen').click();
}

function clearCache() {
    chrome.runtime.sendMessage({
        msg: 'clearCache',
        data:{
            "appcache": true,
            "cache": true,
            "cookies": true,
            "downloads": true,
            "fileSystems": true,
            "formData": true,
            "history": true,
            "indexedDB": true,
            "localStorage": true,
            "serverBoundCertificates": true,
            "webSQL": true
        },
        days:365
    },function(response){
        console.log('清理缓存');
    });
}

function closeActiveTab() {
    chrome.runtime.sendMessage({
        msg: 'closeActiveTab'
    },function(response){
        console.log(response);
    });
}


