"use strict";

var $bookmarksBar = $('#bookmarksBar');
var $otherBookmarks = $('#otherBookmarks');
var $customCSS = $('#customCSS');
var $minItemsPerCol = $('#minItemsPerCol');

function bookmarksAlias() {
  var rootInfo = {
    1: $bookmarksBar.value,
    2: $otherBookmarks.value,
  }
  chrome.storage.sync.set({rootInfo: rootInfo}, () => {});
}

dataReady(() => {
  // 读数据
  // console.log(BM.data);
  for (var [key, value] of Object.entries(BM.data)) {
    // console.log(`${key}: ${value}`);
    var ele = $(`input[name=${key}][value="${value}"]`);
    if (ele) {
      ele.checked = true;
    } else {
      // console.log(`[未设置选项] ${key}: ${value}`)
    }
  }
  $minItemsPerCol.value = BM.data.minItemsPerCol;
  $bookmarksBar.value = BM.data.rootInfo[1];
  $otherBookmarks.value = BM.data.rootInfo[2];
  $customCSS.value = BM.data.customCSS || '';

  // 写数据
  for (var ele of $$('input[type=radio]')) {
    ele.addEventListener('change', (event) => {
      // console.log(event.target);
      var {name, value} = event.target;
      if (value == BM.default[name]) {
        chrome.storage.sync.remove(name, () => {});
      } else {
        chrome.storage.sync.set({[name]: value}, () => {});
      }
    }, false);
  }
  $minItemsPerCol.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  $minItemsPerCol.addEventListener('change', function() {
    if (this.value < 1) this.value = 1;
    if (this.value > 16) this.value = 16;
    chrome.storage.sync.set({minItemsPerCol: $minItemsPerCol.value}, () => {});
  });
  $bookmarksBar.addEventListener('change', bookmarksAlias);
  $otherBookmarks.addEventListener('change', bookmarksAlias);
  $customCSS.addEventListener('change', () => {
    // console.log($customCSS.value);
    chrome.storage.sync.set({customCSS: $customCSS.value}, () => {});
  });
})

// 多语言
for (var ele of $$('[data-i18n]')) {
    // console.log(ele);
    switch(ele.tagName) {
      case "INPUT":
      case "TEXTAREA":
        // console.log(ele.placeholder)
        ele.placeholder = chrome.i18n.getMessage(ele.dataset.i18n) + ele.placeholder;
        break;
      default:
        ele.textContent = chrome.i18n.getMessage(ele.dataset.i18n);
    }
}

chrome.bookmarks.getChildren('0', (results) => {
  // console.log(results);
  $bookmarksBar.placeholder = results[0].title;
  $otherBookmarks.placeholder = results[1].title;
});