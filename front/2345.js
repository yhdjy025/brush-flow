var timer = null;
$(function () {
    helper.getStorage('open_flow', function (data) {
        console.log('------------2345------------');
        //更改分辨率
        helper.setScreen();
        if (data.select && data.select == 1 && data.type && data.type == '2345') {
            //给50%的转化率
            var isReal = helper.random(0, 10);
            if (isReal < 5)
                return false;
            //页面向下随机滚动
            continueClick();
        }
    });
});

/**
 * 持续点击操作
 */
function continueClick() {
    setTimeout(function () {
        var type = helper.random(0, 3);
        if (1 == type) {
            //点击
            var links = $('#w_wp').find('a');
            if (links.length > 0) {
                setTimeout(function () {
                    window.scrollTo(0, helper.random(0, 1000));
                    var clickDom1 = helper.randomArr(links);
                    clickDom1.click();
                }, 500);
            }
        }  else {
            //搜索
            helper.randomKeywords(function (ret) {
                $('#J_schInbox').find('input[name=word]').val(ret);
                setTimeout(function () {
                    document.getElementById('j_search_sbm').click();
                }, 500)
            });
        }
        //调用自己实现循环
        continueClick();
    }, helper.randomSeconds(20)*1000)
}