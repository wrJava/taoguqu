// pages/zhuanjiaxiangqing/zhuanjiaxiangqing.js
const config = require("../../config/config.js");
const jianding = require("../../config/function.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 专家头像加载失败
  zjtxjzsb: function () {
    let data = 'datas.headimg';
    this.setData({
      [data]: '../../qietu/avatar.png'
    })
  },
  // 专家风采图片加载失败
  zjfztpjzsb: function (e) {
    let index = e.currentTarget.dataset.index;
    let data = 'datas.styleimg[' + index + ']';
    this.setData({
      [data]: "../../qietu/authticate_place@2x.png"
    })
  },
  //点击放大专家风采图片
  clickBig: function (e) {
    let that = this;
    let imgArr = [];

    console.log(that)
    // return
    let index = e.currentTarget.dataset.index;
    for (let i = 0; i < that.data.datas.styleimg.length; i++) {
      if (that.data.datas.styleimg[i] != "../../qietu/addimg.png") {
        imgArr[imgArr.length] = that.data.datas.styleimg[i];
      }
    }
    console.log(imgArr[index])
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log("失败" + res);
      },
      complete: function (res) {
        console.log("结束");
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url:  config.zhuanjiadanye + options.id,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // res.data.data[0].styleimg.push("../../qietu/authticate_place@2x.png");
        if (res.data.data[0].styleimg.length <= 9) {
          that.setData({
            ifzjfc: 0
          })
        } else {
          that.setData({
            ifzjfc: 1
          })
        }
        that.setData({
          datas: res.data.data[0]
        })
        console.log(that.data);
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
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