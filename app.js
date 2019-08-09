let config = require("./config/config.js");
const jianding = require("./config/function.js");
const Promise = require("./utils/promise.js");
//app.js
App({
  data: {

  },

  onLaunch: function() {
    let that = this;
    // this.refresh();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionid
        // console.log(res)
        wx.setStorageSync('user_code', res.code)
        // console.log(wx.getStorageSync('user_code'))
        wx.request({
          url: config.getSessionkey + res.code,
          method: 'GET',
          success: function(res) {
            if (res.data.data.sessionId == undefined) {
              wx.showToast({
                title: '网络异常',
              })
            }
            jianding.saveSession(res.data.data.sessionId, res.data.data.member, res.data.data.openid, res.data.data.unionid, res.data.data.uid);
            if (!res.data.data.unionid){
              console.log("no unionid")
              // 获取用户信息
              // wx.getSetting({
              //   success: res => {
              //     console.log(res.authSetting)
              //     if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      withCredentials: true,
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        that.globalData.userInfo = res.userInfo;
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        // if (this.userInfoReadyCallback){
                        //   this.userInfoReadyCallback(res)
                        // }
                        wx.request({
                          url: config.getUserUnionid,
                          header: {
                            'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
                          },
                          method: "POST",
                          data: {
                            encryptedData: res.encryptedData,
                            iv: res.iv,
                            rawData: res.rawData,
                            signature: res.signature,
                          },
                          success: function (res) {
                            console.log("res")
                            console.log(res)
                            // console.log("unionid=" + JSON.parse(res.data).unionld)
                            jianding.saveSession(res.data.data.sessionId, res.data.data.member, res.data.data.openid, res.data.data.unionid, res.data.data.uid);        
                            if (!res.data.data.member){
                              wx.redirectTo({
                                url: '/pages/login/login',
                              })
                            }
                            
                            // console.log("unionid="+wx.getStorageSync('unionid'))
                          },
                          fail: function (res) {
                            console.log(res);
                          },
                          complete: function (res) {
                            // console.log('结束');
                          }
                        })
                      }
                    })
              //     }else{
              //       console.log(2)
              //     }
              //   }
              // })
            }
            

            // jianding.checkcrosstime();
          },
          fail: function(res) {
            console.log(res);
          },
          complete: function(res) {
            // console.log('结束');
          }
        })
      }
    })
    
  },
  globalData: {
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
    },
  }
})