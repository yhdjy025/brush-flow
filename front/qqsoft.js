$(function () {
    helper.getStorage('open_flow', function (data) {
        if (data.select && data.select == 1 && data.type && data.type == 'qqsoft') {
            setTimeout(function () {
                let downBtn = document.getElementsByClassName('detail-install-normal');
                if (downBtn.length > 0) {
                    let code = 'document.getElementsByClassName("detail-install-normal")[0].click();';
                    helper.runJsByTag(code, 'download-file');
                }
            }, 5000)
        }
    })
})