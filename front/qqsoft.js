$(function () {
    helper.getStorage('open_flow', function (data) {
        helper.setScreen();
        if (data.select && data.select == 1 && data.type && data.type == 'qqsoft') {
            setTimeout(function () {
                $('.detail-install-normal').click();
            }, 5000)
        }
    })
})