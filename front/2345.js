$(function () {
    helper.getStorage('open_flow', function (data) {
        console.log('------------2345------------');
        //更改分辨率
        helper.setScreen();
        if (data.select && data.select == 1 && data.type && data.type == '2345') {
            setTimeout(function () {
                //页面向下随机滚动
                window.scrollTo(0, helper.random(0, 1000));
                while(true) {
                    var links = $('#content').find('a');
                    if (links.length > 0) {
                        console.log(links)
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