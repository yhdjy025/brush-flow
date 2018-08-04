// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
chrome.proxy.settings.clear({scope: 'regular'});

var times = 30;
chrome.storage.local.get('open_flow', function (data) {
    if (data.open_flow && data.open_flow.time) {
        times = data.open_flow.time;
    }
    var interval1 = setInterval(function () {
        chrome.tabs.query({}, function (tabs) {
            var mainTab = null;
            var otherTab = [];
            for (let tab of tabs) {
                if (tab.url.indexOf('hao.7654.com') == -1) {
                    otherTab.push(tab.id);
                } else {
                    mainTab = tab.id;
                }
            }
            if (mainTab != null) {
                chrome.tabs.remove(otherTab);
                changeIp(function () {
                    clearCache(function () {
                        chrome.tabs.executeScript(mainTab, {code: 'window.location.reload()'});
                    })
                });
            }
        })
    }, times * 1000);
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

function getIp(callback) {
    chrome.proxy.settings.clear({scope: 'regular'})
    chrome.storage.local.get('ip_list', function (data) {
        var url = 'http://proxy.httpdaili.com/apinew.asp?sl=10&noinfo=true&ddbh=198267548378067011';
        var ajax = new XMLHttpRequest();
        ajax.open('get', url);
        ajax.send();
        return ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var content = ajax.responseText;
                content = content.replace(' ', '');
                var ips = content.split(/\n/);
                var result = [];
                for (let ip of ips) {
                    if (ip != '') {
                        result.push(ip);
                    }
                }
                var save = result;
                if (data.ip_list && data.ip_list.ips) {
                    var ip = data.ip_list.ips[0];
                    if (result.indexOf(ip) != -1) {
                        save = data.ip_list.ips;
                    }
                }
                console.log(data.ip_list)
                var use = save.pop();
                var count = data.ip_list.count ? data.ip_list.count++ : 1;
                chrome.storage.local.set({ip_list: {ips: save, count: count}});
                callback(use)
            }
        }
    })
}

function changeIp(callback) {
    getIp(function (ip) {
        ip = ip.split(':');
        var config = {
            mode: 'fixed_servers',
            rules: {
                proxyForHttp: {
                    host: ip[0],
                    port: Math.floor(ip[1])
                }
            }
        };
        //console.log(config)
        chrome.proxy.settings.set({
            value: config,
            scope: 'regular'
        }, function () {
            if (typeof callback == 'function') {
                callback()
            }
        });
    });
}