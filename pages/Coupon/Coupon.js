// pages/Coupon/Coupon.js
const config = require("../../config/config.js");
const jianding = require("../../config/function.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupons:[],
    // coupons: [{
    //   "coupon_id": "1",
    //   "type": "0",
    //   "title": "年费会员超级福利",
    //   "desc": "鉴定通用",
    //   "price": "30",
    //   "limit_price": "20",
    //   "end_time": "2017-07-08",
    //   "state": "0"
    // }, {
    //   "coupon_id": "2",
    //   "type": "0",
    //   "title": "年费会员超级福利",
    //   "desc": "鉴定通用",
    //   "price": "30",
    //   "limit_price": "0",
    //   "end_time": "2017-07-08",
    //   "state": "1"
    // }, {
    //   "coupon_id": "3",
    //   "type": "0",
    //   "title": "年费会员超级福利",
    //   "desc": "鉴定通用",
    //   "price": "30",
    //   "limit_price": "0",
    //   "end_time": "2017-07-08",
    //   "state": "0"
    // }, {
    //   "coupon_id": "4",
    //   "type": "0",
    //   "title": "年费会员超级福利",
    //   "desc": "鉴定通用",
    //   "price": "30",
    //   "limit_price": "1",
    //   "end_time": "2017-07-08",
    //   "state": "0"
    // }, {
    //   "coupon_id": "5",
    //   "type": "0",
    //   "title": "年费会员超级福利",
    //   "desc": "鉴定通用",
    //   "price": "30",
    //   "limit_price": "30",
    //   "end_time": "2017-07-08",
    //   "state": "1"
    // }, {
    //   "coupon_id": "6",
    //   "type": "0",
    //   "title": "年费会员超级福利",
    //   "desc": "鉴定通用",
    //   "price": "30",
    //   "limit_price": "0",
    //   "end_time": "2017-07-08",
    //   "state": "0"
    // }],
    availablCoupons: [],
    invalidationRoll: [],
    noCoupons: false,
    bushiyongyouhuijuan: '../../qietu/buxuanze@2x.png', //xuanzhongyuan.png
    couponBg: '../../qietu/coupon@2x.png',
    couponBg999: "../../qietu/Combined@2x.png",
    ifyouhuijuan:true
  },
  // 选择优惠卷
  selectCoupon: function(e) {
    let index = e.currentTarget.dataset.index;
    let availablCoupons = this.data.availablCoupons;
    console.log(availablCoupons)//返回4张可用的优惠券
    for (let i = 0; i < availablCoupons.length; i++) {
      if (i == index) {
        availablCoupons[i].bushiyongyouhuijuan = '../../qietu/xuanzhongyuan.png'
      } else {
        availablCoupons[i].bushiyongyouhuijuan = '../../qietu/buxuanze@2x.png'
      }
    }
    this.setData({
      availablCoupons: availablCoupons,
      bushiyongyouhuijuan: "../../qietu/buxuanze@2x.png",
      couponsType: 1,
    })
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      user_coupon_id: e.currentTarget.dataset.user_coupon_id,
      price: e.currentTarget.dataset.price,
    })
    if (this.data.comeFrom == 1) {
      wx.navigateBack({
        url: '/pages/1v1tianxiedingdan/1v1tianxiedingdan?fromto=1&user_coupon_id=' + e.currentTarget.dataset.user_coupon_id + '&price=' + e.currentTarget.dataset.price,
      })
    } else {
      
      wx.navigateBack({
        url: '/pages/kuaisujianbao/kuaisujianbao?fromto=0&user_coupon_id=' + e.currentTarget.dataset.user_coupon_id + '&price=' + e.currentTarget.dataset.price,
        
      })
    }
  },
  // 不使用优惠卷
  clickbushiyong: function(e) {
    let availablCoupons = this.data.availablCoupons;
    for (let i = 0; i < availablCoupons.length; i++) {
      availablCoupons[i].bushiyongyouhuijuan = '../../qietu/buxuanze@2x.png'
    }
    this.setData({
      availablCoupons: availablCoupons,
      bushiyongyouhuijuan: "../../qietu/xuanzhongyuan.png",
      couponsType: 0,
    })
    //navigateBack返回页面时保留上一页面数据
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      user_coupon_id: '',
      price: '',
      user_nocoupon: 1,
    })
    if (this.data.comeFrom == 1) {
      //1v1
      wx.navigateBack({
        url: '/pages/1v1tianxiedingdan/1v1tianxiedingdan?fromto=1&user_nocoupon=' + '1',
      })
    } else {
      //抢单
      wx.navigateBack({
        url: '/pages/kuaisujianbao/kuaisujianbao?fromto=0&user_nocoupon=' + '1',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let Coupons = that.data.coupons;
    let keyong = [];
    let bukeyong = [];
    let fromto = options.fromto;
    console.log(fromto)
    // return;
    if(fromto == 1){
      //1v1优惠券
      jianding.getyouhuijuan(0, 0, 30, function (res) {
        console.log(res)
        if (res.status != 0) {
          that.setData({
            ifyouhuijuan: false,
          })
        } else {
          that.setData({
            ifyouhuijuan: true,
            coupons: res.data
          })
          for (let i = 0; i < that.data.coupons.length; i++) {
            if (that.data.coupons[i].state == 0) {
              that.data.coupons[i].bushiyongyouhuijuan = '../../qietu/buxuanze@2x.png';
              keyong[keyong.length] = that.data.coupons[i];
            } else {
              that.data.coupons[i].yiguoqi = '../../qietu/guoqiIcon@2x.png';
              bukeyong[bukeyong.length] = that.data.coupons[i];
            }
            that.setData({
              'availablCoupons': keyong,
              'invalidationRoll': bukeyong,
              'comeFrom': fromto
            })
          }
        }
      }, function (err) {
        console.log(err)
      })
    }else{
      //抢单优惠券
      jianding.getyouhuijuan(0, 3, 30, function (res) {
        console.log(res)
        if (res.status != 0) {
          that.setData({
            ifyouhuijuan: false,
          })
        } else {
          that.setData({
            ifyouhuijuan: true,
            coupons: res.data
          })
          for (let i = 0; i < that.data.coupons.length; i++) {
            if (that.data.coupons[i].state == 0) {
              that.data.coupons[i].bushiyongyouhuijuan = '../../qietu/buxuanze@2x.png';
              keyong[keyong.length] = that.data.coupons[i];
            } else {
              that.data.coupons[i].yiguoqi = '../../qietu/guoqiIcon@2x.png';
              bukeyong[bukeyong.length] = that.data.coupons[i];
            }
            that.setData({
              'availablCoupons': keyong,
              'invalidationRoll': bukeyong,
              'comeFrom': fromto
            })
          }
        }
      }, function (err) {
        console.log(err)
      })
    }
    
    
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