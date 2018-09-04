var times = 0;
$(function () {
    helper.getStorage('open_flow', function (data) {
        console.log('------------duba------------');
        if (data.select && data.select == 1) {
            //给70%的转化率
            var isReal = helper.random(0, 10);
            if (isReal <= 3)
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
    if (times > 10) return false;
    times ++;
    setTimeout(function () {
        var type = helper.random(0, 3);
        if (1 == type) {
            //点击
            var links = $('#main').find('a');
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
                $('#search_keyword').val(ret);
                setTimeout(function () {
                    document.getElementsByClassName('btn_search')[0].click();
                }, 500)
            });
        }
        //调用自己实现循环
        continueClick();
    }, helper.random(0, 20)*1000)
}