// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
if (typeof chrome == 'undefined') {
    var chrome = browser;
}
var getip_url = 'https://survey.yhdjy.cn/admin/getip';
$(function () {
    //初始化选项
    chrome.storage.local.get('open_flow', function (data) {
        if (data.open_flow) {
            if (data.open_flow.select == 1) {
                $('#open-flow').attr('checked', true);
            }
            $('#time-interval').val(data.open_flow.time ? data.open_flow.time : 30);
            if (data.open_flow.type) {
                $('input[value='+data.open_flow.type+']').attr('checked', true);
            }
        }
    });

    //初始化
    chrome.storage.local.get('ip_list', function (data) {
        if (data.ip_list) {
            var count = data.ip_list.count ? data.ip_list.count : 0;
            $('#count-ip').text(count);
            //清空代理统计
            $('#clear-count').on('click', function () {
                var ip_list = data.ip_list;
                ip_list.count = 0;
                chrome.storage.local.set({ip_list: ip_list});
                $('#count-ip').text(0);
            })
        }
    });
    //代理ip
    $('#show-ip').load(getip_url);
    //修改数据
    $('#open-flow,#time-interval,input[name=type]').on('change', function () {
        var time = $('#time-interval').val();
        var status = {
            select: $('#open-flow').is(':checked') ? 1 : 0,
            type: $('input[name=type]:checked').val(),
            time: time ? time : 30
        };
        console.log(status)
        chrome.storage.local.set({open_flow: status});
    });
})

