// pages/Coupon/Coupon.js
const config = require("../../config/config.js");
const jianding = require("../../config/function.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    availablCoupons: [],
    invalidationRoll: [],
    alreadylCoupons:[],
    ifyouhuijuan: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    let keyong = [];
    let bukeyong = [];
    jianding.getmycoupon(function(res) {
      if (res.data.status == 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].state == 0) {
            keyong.push(res.data.data[i])
          } else{
            bukeyong.push(res.data.data[i])
          }
        }
        that.setData({
          ifyouhuijuan: true,
          availablCoupons: keyong,
          invalidationRoll: bukeyong
        })
      }else{
        that.setData({
          ifyouhuijuan: false
        })
      }
      wx.hideLoading({})
    }, function() {
      wx.hideLoading({})
      wx.showToast({
        title: '获取优惠券失败',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    if (e.from == "button") {
      console.log(e.garget);
    } else {
      console.log("右上角");
    }
    return {
      title: "邀您体验淘古趣鉴宝",
      path: "/pages/index/index",
      imageUrl: "../../qietu/Share@2x.png",
      success: function(res) {
        console.log("success");
      },
      fail: function(res) {
        console.log("fail");
      },
      complete: function(res) {
        // 不管成功失败都会执行  
        console.log("结束")
      }
    }
  }
})