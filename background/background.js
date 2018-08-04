// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg == 'closeActiveTab') {
        setTimeout(function () {
            chrome.tabs.query({}, function (tabs) {
                var mainTab;
                for (let tab of tabs) {
                    if (tab.url.indexOf('hao.7654.com') == -1) {
                        chrome.tabs.remove(tab.id);
                    } else {
                        mainTab = tab.id;
                    }
                }
                clearCache(function () {
                    chrome.tabs.reload(mainTab)
                })
            })
        }, request.timeOut);
    }
    sendResponse({farewell: true});		//返回信息
});


//清理缓存
function clearCache(callback) {
    var data = {
        "appcache": true,
        "cache": true,
        "cookies": true,
        "downloads": true,
        "fileSystems": true,
        "formData": true,
        "history": true,
        "indexedDB": true,
        "localStorage": true,
        "serverBoundCertificates": true,
        "webSQL": true
    };
    var days = 365;
    var millisecondsPerWeek = 1000 * 60 * 60 * 24 * days;
    var ago = (new Date()).getTime() - millisecondsPerWeek;
    chrome.browsingData.remove({since: ago}, data, function () {
        if (typeof callback == 'function') {
            callback();
        }
    });
}