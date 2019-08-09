let config = require("./config.js");
// 存取查Sessionkey
// 保存到缓存
let saveSession = function (sessionId, member, openid, unionid, uid) {
  // console.log(sessionId, member, openid, unionid)
  wx.setStorageSync("sessionkey", sessionId) //保存sessionid
  if (member){
    wx.setStorageSync("member", member) //保存member
  }
  wx.setStorageSync("openid", openid) //保存openid
  if (unionid){
    wx.setStorageSync("unionid", unionid) //unionid
  }
  if(uid){
    wx.setStorageSync("uid", uid);
  }
  wx.setStorageSync("sessiondate", Date.parse(new Date())) //保存当前时间，
}
// 过期后清除
let removeLocalSession = function() {
  wx.removeStorageSync("sessionkey")
  wx.removeStorageSync("member")
  wx.removeStorageSync("openid")
  wx.removeStorageSync("sessiondate")
}
//member、sessionid过期后重新调取微信登录获取用户sessionid等-获取后跳转授权页
let redirectIndex = function() {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionid
      wx.setStorageSync('user_code', res.code)
      console.log(res.code)
      
      wx.request({
        url: config.getSessionkey + res.code,
        method: 'GET',
        success: function(res) {
          console.log("funPage res")
          console.log(res)
          if (res.data.data.sessionId == undefined) {
            wx.showToast({
              title: '网络异常',
            })
          }
          if (!wx.getStorageSync("member")){
            console.log("func Page go login")
            wx.redirectTo({
              url: '/pages/login/login',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }
          saveSession(res.data.data.sessionId, res.data.data.member, res.data.data.openid, res.data.data.unionid);
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          console.log('结束');
        }
      })
    }
  })
}
let share = function(e) {
  // onShareAppMessage(e) {
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
  // }
}
//获取用户session等信息页面不跳转
let getSessionIndex = function() {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionid
      wx.setStorageSync('user_code', res.code)
      wx.request({
        url: config.getSessionkey + res.code,
        method: 'GET',
        success: function(res) {
          console.log('321')
          console.log(res)
          if (res.data.data.sessionId == undefined) {
            wx.showToast({
              title: '网络异常',
            })
          }
          console.log("getSessionIndex")
          console.log(res)
          saveSession(res.data.data.sessionId, res.data.data.member, res.data.data.openid, res.data.data.unionid);
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          console.log('结束');
        }
      })
    }
  })
}



// 检查是否过期
let checkSessionTimeout = function() {
  var sessionid = wx.getStorageSync('sessionkey')
  var member = wx.getStorageSync('member')
  if (sessionid == null || sessionid == undefined || sessionid == "") {
    console.log("session is empty")
    redirectIndex()
    console.log("222222")
    // requestsessionid();
    // checkSessionOk();
    return false
  }
  if (member == null || member == undefined || member == "") {
    console.log("member is empty")
    redirectIndex();
    console.log("222222")
    // checkSessionOk();
    return false
  }
  var sessionTime = wx.getStorageSync('sessiondate')
  var aftertimestamp = Date.parse(new Date())
  let SESSION_TIMEOUT = 60 * 60 * 1000;
  console.log(aftertimestamp - sessionTime)
  if (aftertimestamp - sessionTime >= SESSION_TIMEOUT) {
    removeLocalSession()
    return false
  }
  return true
}
// 如果过期重新获取
let checkSessionOk = function() {
  console.log("check session ok?...")
  var sessionOk = checkSessionTimeout()
  if (!sessionOk) {
    requestsessionid();
  }
}
// 重新获取
let requestsessionid = function() {
  console.log('重新获取')
  wx.request({
    url: config.requestsessionid,
    success: res => {
      console.log(res.data);
      wx.setStorageSync("sessionkey", res.data.data.sessionId) //保存sessionid
      wx.setStorageSync("member", res.data.data.member) //保存cookie  member
      wx.setStorageSync("openid", res.data.data.openid) //保存cookie  openid
      wx.setStorageSync("unionid", res.data.data.unionid) //保存cookie  unionid
      wx.setStorageSync("sessiondate", Date.parse(new Date())) //保存当前时间，
      saveSession();
      return;
    },
    fail: err => {
      console.log(err)
      return;

    }
  })
}
// 每隔XX时间检查一次
let checkcrosstime = function() {
  let time = 5 * 60 * 1000;
  setInterval(checkSessionTimeout, time)
}
// 上传图片
let upDataImg = function(path, cb, fail_cb) {
  wx.uploadFile({
    url: config.upDataImg,
    filePath: path,
    name: 'file',
    formData: {
      'user': 'test'
    },
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      console.log(555555555555);
      var data = JSON.parse(res.data);
      //console.log(data.data.img_id);
      //do something
      typeof cb == 'function' && cb(data.data.img_id);
    },
    fail: function(err) {
      typeof fail_cb == 'function' && fail_cb(err);
    }
  })
}
// 快速鉴宝
let jianbaoshenqingtijiao = function(data, cb, fail_cb) {
  wx.request({
    url: config.shenqingtijiao,
    data: data,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
      'enctype': "multipart/form-data"
    },
    method: 'POST',
    success: function(res) {
      console.log(res.data.status)
      if (res.data.status == 1007) {
        redirectIndex()
      }
      if (res.data.status == 0) {
        typeof cb == "function" && cb(res.data);
      } else {
        typeof cb == "function" && cb(res.data);
        wx.showToast({
          title: '上传失败请稍后重试',
          mask: true,
          icon: 'none'
        })
        console.log(res.data.error);
      }
    },
    fail: function(err) {
      typeof fail_cb == "function" && fail_cb(err);
    },
    complete: function() {
      console.log('结束')
    }
  })
}
// 获取秘钥
let getMiyao = function(data, cb, fail_cb) {
  wx.request({
    url: config.getMiyao,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
    },
    method: 'POST',
    data: data,
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == 'function' && cb(res.data);
    },
    fail: function(err) {
      typeof fail_cb == 'function' && fail_cb(err);
    },
    complete: function() {
      console.log('结束')
    }
  })
}
// 我的订单
let wodedingdan = function(page, cb, fail_cb) {
  wx.request({
    url: config.myoder + page,
    method: "GET",
    data:{
      type:1
    },
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
    },
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == 'function' && cb(res.data);
    },
    fail: function(res) {
      console.log("错误");
      typeof fail_cb == 'function' && fail_cb(res);
    },
    complete: function() {
      console.log("结束");
    }
  })
}
// 藏宝圈
let cangbaoquan = function(data, cb, fail_cb) {
  wx.request({
    url: config.cangbaoquan,
    data: data,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
    },
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == 'function' && cb(res.data);
    },
    fail: function(err) {
      typeof fail_cb == 'function' && fail_cb(res);
    },
    complete: function() {
      console.log('结束')
    }
  })
}
// 取消订单
let quxiaodingdan = function(data, cb, fail_cb) {
  wx.request({
    url: config.quxiaodingdan,
    method: 'POST',
    data: data,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
    },
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == 'function' && cb(res.data);
    },
    fail: function(err) {
      typeof fail_cb == 'function' && fail_cb(res);
    },
    complete: function() {
      console.log('结束')
    }
  })
}
// 1v1鉴宝
let zhuanjiajianbao = function(data, cb, fail_cb) {
  wx.request({
    url: config.shenqingtijiao,
    data: data,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
      'enctype': "multipart/form-data"
    },
    method: 'POST',
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == "function" && cb(res.data);
    },
    fail: function(err) {
      typeof fail_cb == "function" && fail_cb(err);
    },
    complete: function() {
      console.log('结束')
    }
  })
}
// 专家单页
let zhuanjiadanye = function(id, cb, fail_cb) {
  wx.request({
    url: config.zhuanjiadanye + id,
    method: 'GET',
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == "function" && cb(res.data);

    },
    fail: function(err) {
      typeof fail_cb == "function" && fail_cb(err);
    }
  })
}
// 获取优惠券
let getyouhuijuan = function(onType, appraisal_type, price, cb, fail_cb) {
  wx.request({
    url: config.youhuijuan + '&type=' + onType + '&appraisal_type=' + appraisal_type + '&price=' + price,
    method: 'GET',
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
      'enctype': "multipart/form-data"
    },
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == "function" && cb(res.data);
    },
    fail: function(err) {
      typeof fail_cb == "function" && fail_cb(err);
    },
    complete: function() {
      console.log("结束");
    }
  })
}
// 支付
let payorder = function(out_trade_no, body, total_fee, openid) {
  wx.request({
    url: config.payorder,
    data: data,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
      'Content-Type': "application/x-www-form-urlencoded"
    },
    method: 'POST',
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      console.log(res)
    },
    fail: function(err) {
      console.log(err)
    },
    complete: function() {
      console.log('结束')
    }
  })
}

// 校验验证码
let yanzheng = function(data, cb, fail_cb) {
  wx.request({
    url: config.fasong,
    data: data,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
      'Content-Type': "application/x-www-form-urlencoded"
    },
    method: 'POST',
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      console.log(res)
    },
    fail: function(err) {
      console.log(err)
    },
    complete: function() {
      console.log('结束')
    }
  })
}
// 鉴宝金额
let jianbaojine = function(cb, fail_cb) {
  wx.request({
    url: config.jianbaojine,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
      'Content-Type': "application/x-www-form-urlencoded"
    },
    method: 'POST',
    success: function(res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      console.log(res)
    },
    fail: function(err) {
      console.log(err)
    },
    complete: function() {
      console.log('结束')
    }
  })
}
//获取我的优惠券
let getmycoupon = function (cb, fail_cb) {
  wx.request({
    url: config.getmycoupon,
    header: {
      'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
    },
    method: 'GET',
    success: function (res) {
      if (res.data.status == 1007) {
        redirectIndex()
      }
      typeof cb == 'function' && cb(res);
    },
    fail: function (err) {
      typeof fail_cb == 'function' && fail_cb(res);
    },
    complete: function () {
      console.log('结束')
    }
  })
}

module.exports = {
  saveSession,
  removeLocalSession,
  checkSessionTimeout,
  checkSessionOk,
  checkcrosstime,
  upDataImg,
  jianbaoshenqingtijiao,
  getMiyao,
  cangbaoquan,
  wodedingdan,
  quxiaodingdan,
  zhuanjiajianbao,
  zhuanjiadanye,
  getyouhuijuan,
  payorder,
  yanzheng,
  jianbaojine,
  redirectIndex,
  getmycoupon,
  getSessionIndex
}