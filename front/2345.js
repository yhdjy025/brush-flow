$(function () {
    helper.getStorage('open_flow', function (data) {
        console.log('------------2345------------');
        //更改分辨率
        helper.setScreen();
        if (data.select && data.select == 1 && data.type && data.type == '2345') {
            setTimeout(function () {
                //页面向下随机滚动
                while (true) {
                    var links = $('#w_wp').find('a');
                    if (links.length > 0) {
                        helper.randomKeywords(function (ret) {
                            $('#J_schInbox').find('input[name=word]').val(ret);
                            setTimeout(function () {
                                document.getElementById('j_search_sbm').click();
                            }, 500)
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