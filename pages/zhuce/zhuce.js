let config = require('../../config/config.js')
const jianding = require('../../config/function.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoujihao: "",
    yanzhengma: "",
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61
  },
  userinfo: function (e) {
    
  },

  
  //验证码
  yanzhengma: function(e) {
    let yanzhengma
    this.setData({
      yanzhengma: e.detail.value
    })
    
    
  },
  //手机号
  shoujihao: function (e) {
    let shoujihao = e.detail.value
    this.setData({
      shoujihao: e.detail.value
    })
    if (shoujihao.length === 11) {
      let checkedNum = this.checkPhoneNum(shoujihao)
      // console.log(checkedNum)
    }
  },
  //手机号正则验证
  checkPhoneNum: function (shoujihao) {
    let str = /^1\d{10}$/
    if (str.test(shoujihao)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return false
    }
  },
  //验证码发送验证
  checkPhone: function () {
    var that = this;
    var currentTime = '';
    var interval;
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: '获取验证码',
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '获取验证码',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1)
  },

  fasong: function(e) {
    if (this.data.shoujihao == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        mask: 'true'
      })
      this.checkPhone();
    }else{
      //发送成功倒计时
      var that = this;
      var currentTime2 = that.data.currentTime
      var interval;
      interval = setInterval(function () {
        currentTime2--;
        that.setData({
          time: currentTime2 + '秒'
        })
        if (currentTime2 <= 0) {
          clearInterval(interval)
          that.setData({
            time: '重新发送',
            currentTime2: 60,
            disabled: false
          })
        }
      }, 1000)

      let data = {
        mobile: this.data.shoujihao,
        type: 5,
      }
      jianding.getMiyao(data, function (res) {
        // console.log(res)
        // return
        data.sign = res.data.info;
        //发送验证码
        wx.request({
          url: config.fasong,
          data: data,
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // console.log(res.data)
            console.log(res)
            if (res.data.status == 0) {
              wx.showToast({
                title: '发送成功',
              })
              
            }
            if (res.data.status == 99) {
              wx.showToast({
                title: '发送失败，手机号格式不正确或已注册',
                icon: 'none',
                // success: res.disabled = false,
              })
              
            }
            
          }
        })
        
      }, function (value) {
        cosole.log(value)
      });
    }
    
     
 
  },

  getVerificationCode() {
    this.fasong();
    var that = this
    that.setData({
      disabled: true
    })
  },
  
  bangding: function (e) {
    let data = {
      mobile: this.data.shoujihao,
      code: this.data.yanzhengma,
    }
    let info = {
      mobile: this.data.shoujihao,
      passwd: '',
      code: this.data.yanzhengma,
      user_name: this.data.shoujihao,
      type: 2,
      openid: wx.getStorageSync('unionid'),
      from_type:1
    }
    // return;
    //验证验证码
    wx.request({
      url: config.yanzheng, 
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.status == 0){
          //验证成功后注册并登陆
          wx.request({
            url: config.zhuce, //仅为示例，并非真实的接口地址
            data: info,
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              // console.log("res")
              // console.log(res)
              if (res.data.status == 0) {
                wx.showToast({
                  title: '注册成功', 
                })
                wx.switchTab({
                  url: '/pages/index/index',
                })
              } else if (res.data.status == 1){
                wx.showToast({
                  title: '绑定成功',
                })
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
              
            }
          })
        }else{
          wx.showToast({
            title: '验证码错误',
            icon:'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
        console.log("avatarUrl "+res.userInfo.avatarUrl)
      },
    })
    if (!wx.getStorageSync('unionid')){
      app.onLaunch();
    }
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