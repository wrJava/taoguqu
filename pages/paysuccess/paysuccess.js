let config = require('../../config/config.js')
const jianding = require('../../config/function.js')
Page({
//查看订单
  chakandingdan: function(e) {
    wx.switchTab({
      url: '/pages/myOder/myOder',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      } 
    })
  }
})