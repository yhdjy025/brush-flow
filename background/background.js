// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
chrome.proxy.settings.clear({scope: 'regular'});
helper.getStorage('open_flow', function (data) {
    if (data.select == 1) {
        helper.setUa();
        switch (data.type) {
            case '7654':
                spider(data);
                break;
            case '2345':
                spider(data);
                break;
            case 'qqsoft':
                helper.cancelDoenload();
                //spider(data);
                break;
            default:
                return false;
                break;
        }
    }
})

function spider(data) {
    var times = data.time ? data.time : 30;
    var interval1 = setInterval(function () {
        chrome.tabs.query({}, function (tabs) {
            var tabsId = [];
            var mainTab = null;
            for (let tab of tabs) {
                tabsId.push(tab.id);
                if (data.type == '2345') {
                    if (tab.url.indexOf('hao.7654.com') != -1) {
                        mainTab = tab.id;
                    }
                }
                if (data.type == '7654') {
                    if (tab.url.indexOf('2345.com') != -1) {
                        mainTab = tab.id;
                    }
                }
                if (data.type == 'qqsoft') {
                    if (tab.url.indexOf('pc.qq.com') != -1) {
                        mainTab = tab;
                    }
                }
            }
            if (mainTab != null) {
                helper.setProxy(function () {
                    helper.clearCache(function () {
                        console.log(mainTab)
                        chrome.tabs.create({url: mainTab.url});
                        chrome.tabs.remove(tabsId);
                    });
                });
            }
        });
    }, times * 1000);
}
