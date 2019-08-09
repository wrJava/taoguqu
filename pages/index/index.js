//index.js
//获取应用实例
const app = getApp()
const config = require('../../config/config.js');
const jianding = require('../../config/function.js');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isOpen:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    // 查看是否授权
    if (!wx.getStorageSync("member")){
      app.onLaunch();
    }
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // console.log(res)
            }
          })
        } else {
          console.log("index page go login")
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
  onShow:function(){

  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(this.data.userInfo);
  },
  onShareAppMessage(e) {
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
  },
  paixu: function() {
    var arr = [9, 8, 7, 6, 5, 1, '在', '我', '里', '阿', 'z', 'a', 'h', 'm'];
    arr.sort(function(a, b) {
      return a.toString().localeCompare(b)
    }) //[1, 5, 6, 7, 8, 9, "阿", "里", "我", "在", "a", "h", "m", "z"];
    console.log(arr);

    var obj = {
      name: "zhangsan",
      age: 8,
      ace: 5,
      nbme: "lisi"
    }; //要排序的对象
    var newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    console.log(newkey)
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
    }
    console.log(newObj);
    var str = '';
    for (var i in newObj) {
      console.log(i);
      console.log(newObj[i]);
      str += i + "=" + newObj[i] + '&';
    }
    console.log(str);
  },
  // 跳转链接
  tiaozhuan: function(e) {
    let url = e.currentTarget.dataset.url;
    if (url == "/pages/myOder/myOder") {
      wx.switchTab({
        url: url,
      });
    } else {
      wx.navigateTo({
        url: url,
      });
    }
  }
  
})