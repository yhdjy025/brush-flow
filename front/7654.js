var times = 0;
//取时间间隔
$(function () {
    helper.getStorage('open_flow', function (data) {
        console.log('------------7654------------');
        if (data.select && data.select == 1) {
            //给70%的转化率
            var isReal = helper.random(0, 10);
            if (isReal <= 3)
                return false;
            continueClick();
        }
    });
});


function changeOsType() {
    helper.getStorage('flow_ua', function (data) {
        var jsCode = 'GLOBAL.Util.getOsType = function(){return "' + data.os.os + '"};';
        console.log(jsCode)
        helper.runJsByTag(jsCode, 'change-os');
    });
}

function changeBrowser() {
    helper.getStorage('flow_ua', function (data) {
        var jsCode = 'GLOBAL.Util.getBrowserType = function(){return "' + data.browser + '"};';
        console.log(jsCode)
        helper.runJsByTag(jsCode, 'change-broswer');
    })
}

/**
 * 持续点击操作
 */
function continueClick() {
    if (times > randTimes) return false;
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
                console.log(ret)
                $('#J_search_input').val(ret);
                setTimeout(function () {
                    document.getElementById('J_search_submit_btn').click();
                }, 500);
            });
        }
        //调用自己实现循环

        continueClick();
    }, helper.random(0, 20) * 1000)
}





