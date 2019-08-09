// pages/cangpinfenlei/cangpinfenlei.js
const config = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 图片加载失败
  tpjzsb: function(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let data = 'datas.data[' + index + '].img';
    console.log(index)
    
    this.setData({
      [data]: "../../qietu/authticate_place@2x.png"
    })
    console.log(data)
    return;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // /mobile/appraisal?a=getexpertcats
    let that = this;
    wx.request({
      url: config.cangpinfenlei,
      data: {},
      method: 'GET',
      success: function(res) {
        console.log(res)
        if (res.data.status == "0") {
          that.setData({
            datas: res.data
          })
          console.log(that.data.datas)
        } else {
          wx.showModal({
            title: '请求失败',
            content: '当前服务异常，请稍后再试',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log("结束")
      }
    })
    
  },
  // 选择分类
  xuanzefenlei: function(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.fenlei;
    wx.setStorageSync('fenleiId', id);
    wx.setStorageSync('fenleiName', name);
    wx.navigateTo({
      url: '/pages/kuaisujianbao/kuaisujianbao?fenleiId=' + id + '&fenleiName=' +
        name,
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