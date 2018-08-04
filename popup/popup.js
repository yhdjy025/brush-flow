// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
if (typeof chrome == 'undefined') {
    var chrome = browser;
}
var getip_url = 'https://survey.yhdjy.cn/admin/getip';

chrome.storage.local.get('open_flow', function (data) {
    if (data.open_flow) {
        if (data.open_flow.select == 1) {
            $('#open-flow').attr('checked', true);
            $('#time-interval').val(data.open_flow.time);
        }
    }
});

chrome.storage.local.get('ip_list', function (data) {
    if (data.ip_list) {
        if (data.ip_list.count) {
            $('#count-ip').text(data.ip_list.count);
        }
    }
});

$('#show-ip').load(getip_url);

$(function () {

    $('#open-flow,#time-interval').change(function () {
        var time = $('#time-interval').val();
        var status = {
            select: $('#open-flow').is(':checked') ? 1 : 0,
            time: time ? time : 30
        };
        console.log(status)

        chrome.storage.local.set({open_flow: status});
    })
})

