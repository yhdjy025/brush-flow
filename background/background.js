// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


/*
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ color: '#3aa757' }, function() {
        console.log('The color is green.');
    });
});*/


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.msg == 'clearCache') {		//如果是清理命令
        var days = request.days;
        console.log(request)
        toclean(days, request.data);	//则调用执行清除方法
    }
    if (request.msg == 'closeActiveTab') {
        chrome.tabs.query({active: true}, function (tab) {
            console.log(tab[0].id)
            chrome.tabs.remove(tab[0].id);
        })
    }
    sendResponse({farewell: true});		//返回信息
});

function toclean(days,data) {
    var millisecondsPerWeek = 1000 * 60 * 60 * 24 * days;
    var ago = (new Date()).getTime() - millisecondsPerWeek;
    chrome.browsingData.remove({since: ago}, data, function () {
    });
}