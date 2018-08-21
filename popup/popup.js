// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
if (typeof chrome == 'undefined') {
    var chrome = browser;
}

$(function () {
    //初始化选项
    chrome.storage.local.get('open_flow', function (data) {
        if (data.open_flow) {
            if (data.open_flow.select == 1) {
                $('#open-flow').attr('checked', true);
            }
            $('#time-interval').val(data.open_flow.time ? data.open_flow.time : 30);
            if (data.open_flow.urls) {
                $.each(data.open_flow.urls, function (name, value) {
                    var input = $('#url-list').find('input[name='+name+']');
                    $(input).val(value.url);
                    if (value.open) {
                        $(input).prev().find('.url-open').addClass('btn-success');
                    }
                });
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

    //初始化代理IP
    chrome.tabs.query({active: true}, function (tab) {
       runJs(tab.id, 'helper.getIp()');
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        //接收IP
        if (request.message == 'sendIp') {
            $('#show-ip').text(request.data);
        }
        //运行js
        if (request.message == 'runJs') {
            runJs(sender.tab.id, request.data, function (ret) {
                sendResponse(ret);
            });
        }
    });

    //更改设置
    $('#open-flow,#time-interval').on('change', function () {
        updateUrl();
    });

    $('#url-list').on('click', '.url-open', function () {
        $(this).toggleClass('btn-success');
        updateUrl();
    })
    $('#url-list').on('change', 'input', function () {
        updateUrl();
    })
})

function updateUrl() {
    var time = $('#time-interval').val();
    var select = $('#open-flow').is(':checked') ? 1 : 0;
    var urls = {};
    $('#url-list').find('input[type=text]').each(function (i, v) {
        var name = $(v).attr('name');
        var url = $(v).val();
        var open = $(v).prev().find('.url-open').hasClass('btn-success');
        urls[name] = {
            url: url,
            open: open
        };
    });
    var open_flow = {
        time: time ? time : 100,
        select: select,
        urls: urls
    };
    chrome.storage.local.set({open_flow: open_flow});
}
//Y运行js
function runJs(tabId, code, callback) {
    chrome.tabs.executeScript(tabId, {
        code: code
    }, function (result) {
        if (typeof callback == 'function') {
            callback(result)
        }
    })
}

