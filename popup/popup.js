// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
if (typeof chrome == 'undefined') {
    var chrome = browser;
}
var base_url = 'https://survey.yhdjy.cn/brush/';
var getAllUrls_url = 'getAllUrls';
var setUrlStatus_url = 'updateUrlStatus';

$(function () {
    //初始化选项
    helper.getStorage('open_flow', function (data) {
        if (data.select == 1) {
            $('#open-flow').attr('checked', true);
        }
        $('#group').val(data.group ? data.group : 'group1');
    })
    
    $.get(base_url + getAllUrls_url, function (ret) {
        if (1 == ret.status) {
            $('#url-list').html(ret.data);
        }
    })

    //更改设置
    $('#open-flow,#group').on('change', function () {
        updateUrl();
    });

    $('#url-list').on('click', '.url-open', function () {
        $(this).toggleClass('btn-success');
        var status = 0;
        if ($(this).hasClass('btn-success')) {
            status = 1;
        }
        var data = {
            id: $(this).attr('data-id'),
            status: status
        };
        $.post(base_url + setUrlStatus_url, data);
    })
})

function updateUrl() {
    var open_flow = {
        select: $('#open-flow').is(':checked') ? 1 : 0,
        group: $('#group').val()
    };
    helper.setStorage('open_flow', open_flow);
}

