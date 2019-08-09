// pages/zhuanjiadanye/zhuanjiadanye.js
const config = require("../../config/config.js");
const jianding = require("../../config/function.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tsts: {
      text: '请打开app',
      op: 0
    }
  },
  // 吐司提示
  tusitishi: function(e) {
    console.log(e);
    let that = this;
    let oIf = e.currentTarget.dataset.btn;
    console.log(oIf)
    if (oIf == 0) {
      wx.showToast({
        title: '线下约见请至app体验   各应用市场搜索淘古趣下载',
        mask: 'true',
        icon: 'none',
      },100)
    } else {
        wx.showToast({
          title: '专家评价请至app体验   各应用市场搜索淘古趣下载',
          mask: 'true',
          icon: 'none',
        }, 100)
    }
  },
  // 跳转1v1填写订单
  to1v1tianxiedingdan: function(e) {
    wx.navigateTo({
      url: '/pages/1v1tianxiedingdan/1v1tianxiedingdan',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setData({
      zhuanjiaid: options.id
    })
    jianding.zhuanjiadanye(options.id, function(res) {
      that.setData({
        datas: res.data[0]
      })
      for (let i = 0; i < res.data[0].evaluate.length; i++) {
        let data = res.data[0].evaluate[i];
        let strat = [];
        for (let j = 0; j < parseInt(data.scores); j++) {
          strat.push("../../qietu/start.png");
        }
        let datas_strat = 'datas.evaluate[' + i + '].scores';
        that.setData({
          [datas_strat]: strat
        })
      }
    }, function(err) {
      console.log(err)
    })
  },
  // 头像加载失败
  avatarerror: function(e) {
    let avarat = 'datas.headimg';
    this.setData({
      [avarat]: '../../qietu/avatar.png'
    })
  },
  // 评论头像加载失败
  pinglunavatarerror: function(e) {
    let index = e.currentTarget.dataset.index;
    let data = 'datas.evaluate[' + index + '].user_img';
    this.setData({
      [data]: "../../qietu/avatar.png"
    })
  },
  // 评论商品加载失败
  plspimg: function(e) {
    let index = e.currentTarget.dataset.index;
    let data = 'datas.evaluate[' + index + '].img';
    this.setData({
      [data]: "../../qietu/authticate_place@2x.png"
    })
  },
  // 跳转到专家详情页
  toxiangqing: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/zhuanjiaxiangqing/zhuanjiaxiangqing?id=' + that.data.zhuanjiaid,
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
    this.onLoad();
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
      success: function (res) {
        console.log("success");
      },
      fail: function (res) {
        console.log("fail");
      },
      complete: function (res) {
        // 不管成功失败都会执行  
        console.log("结束")
      }
    }
  }
})