var times = 10;
$(function () {
    helper.getStorage('open_flow', function (data) {
        console.log('------------7654------------');
        //更改系统类型
        changeOsType();
        //更改浏览器
        changeBrowser();
        //取时间间隔
        if (data.select && data.select == 1 && data.urls.url7654 && data.urls.url7654.open) {
            //给70%的转化率
            var isReal = helper.random(0, 10);
            if (isReal <= 3)
                return false;
            continueClick();
        }
    });
});


function changeOsType() {
    helper.getStorage('osProfile', function (data) {
        var jsCode = 'GLOBAL.Util.getOsType = function(){return "' + data.osProfile + '"};';
        helper.runJsByTag(jsCode, 'change-os');
    });
}

function changeBrowser() {
    helper.getStorage('browserCategory', function (data) {
        var jsCode = 'GLOBAL.Util.getBrowserType = function(){return "' + data.browserCategory + '"};';
        helper.runJsByTag(jsCode, 'change-broswer');
    })
}


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
            var links = $('#J_dh_body').find('a');
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
                $('#J_search_input').val(ret);
                setTimeout(function () {
                    document.getElementById('J_search_submit_btn').click();
                }, 500);
            });
        }
        //调用自己实现循环
        //continueClick();
    }, helper.randomSeconds(10) * 1000)
}





