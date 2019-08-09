let config = require('../../config/config.js')
const jianding = require('../../config/function.js')
let page = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    array: [
      '请选择原因',
      '我不想鉴定了',
      '信息填写错误，重新上传',
      '其他原因'
    ],
    myOrder: true,
    discountCount:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page=1;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    let that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userinfo: res.userInfo,
                shouquan: 1
              })
              jianding.wodedingdan(page, function(res) {
                console.log(res)
                if(res.status == 0){
                  if (page == 0 || page == 1) {
                    that.setData({
                      dataList: res.data,
                      myOrder: true,
                    })
                  } else {
                    let data = that.data.dataList;
                    for (let i = 0; i < res.data.length; i++) {
                      data.push(res.data[i])
                    }
                    that.setData({
                      dataList: data,
                      myOrder: true,
                    })
                  }
                  // that.setData({
                  //   dataList: res.data,
                  //   myOrder: true,
                  // })
                }else{
                  if (page<=1){
                    that.setData({
                      myOrder: false,
                    })
                  }else{
                    wx.showToast({
                      title:"没有更多了",
                      icon: 'none'
                    })
                  }
                }
                
              }, function(err) {
                let page = 1;
                that.setData({
                  dataList: res.data,
                  myOrder: true,
                })
                console.log(err);
              })
              jianding.getmycoupon(function (res) {
                console.log(res)
                if(res.data.status==0){
                  var count = 0;
                  for (var i = 0; i < res.data.data.length; i++) {
                    if (res.data.data[i].state == 0) {
                      count++;
                    }
                  }
                  that.setData({
                    discountCount: count
                  });
                }
              }, function (err) {
                console.log(err)
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/bindTel/bandTel',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this;

  },
  // 去支付
  goToPay: function (e) {
    let that = this;
    //调起JSAPI支付
    var pay_idx = e.currentTarget.dataset.idx;
    let date = {
      out_trade_no: e.currentTarget.dataset.out_trade_no,
      body: e.currentTarget.dataset.body,
      total_fee: e.currentTarget.dataset.money * 100,
      openid: wx.getStorageSync('openid'),
    }
    console.log(date)
    wx.request({
      url: config.payorder,
      method: "POST",
      data: {
        out_trade_no: e.currentTarget.dataset.out_trade_no,
        body: "淘古趣鉴宝",
        total_fee: e.currentTarget.dataset.money * 100,
        openid: wx.getStorageSync('openid'),
      },
        
      header: {
        'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res);
        console.log("成功");
        wx.requestPayment(
          {
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function (res) {
              console.log(res);
              // console.log(data)
              if (res.errMsg == 'requestPayment:ok'){
                
                var newDataList = that.data.dataList;
                newDataList[pay_idx].status = 1;
                that.setData({
                  dataList: newDataList
                });

                wx.showToast({
                  title: '支付成功',
                })
                wx.redirectTo({
                  url: '/pages/paysuccess/paysuccess',
                })
              }
              
            },
            'fail': function (res) {
              console.log(res)
              // console.log(data)
              wx.showToast({
                title: '支付失败',
              })
                wx.redirectTo({
                  url: '/pages/payfail/payfail',
                })
             },
            'complete': function (res) {
              console.log(res)
             }
          })
    },
      fail: function(res) {
        console.log("错误");
        that.setData({
          dataList: res.data.data
        })
    },
      complete: function() {
        console.log("结束");
      }
    })

  },
  // 取消订单
  bindPickerChange: function(e) {
    let that = this;
    // console.log(this.data.array[e.detail.value]);
    // console.log(e.currentTarget.dataset.pay_sn);
    if (this.data.array[e.detail.value] == '请选择原因') {
      wx.showToast({
        title: '请选择原因',
        icon: 'loading'
      })
      return;
    }
    this.setData({
      index: e.detail.value
    })
    let data = {
      pay_sn: e.currentTarget.dataset.pay_sn,
      cancle_code: e.detail.value - 1
    }
    jianding.quxiaodingdan(data, function(res) {
      console.log(res);
      if (res.status == 0) {
        var newDataList = that.data.dataList;
        newDataList[e.currentTarget.dataset.value].status = 6;
        that.setData({
          dataList: newDataList
        });
        wx.showToast({
          title: '取消订单成功'
        })
      }
    }, function(err) {
      console.log(err);
    })
  },
  // 查看详情
  viewTheDatails: function(e) {
    console.log("查看详情");
    console.log(e.currentTarget)
    wx.navigateTo({
      url: '/pages/cangpinxiangqing/cangpinxiangqing?thing_id=' + e.currentTarget.dataset.thing_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 去评价
  toEvaluate: function(e) {
    console.log("去评价")
  },
  // 查看评价
  viewEvaluation: function(e) {
    console.log("查看评价")
  },
  // 删除订单
  deleteOrder: function(e) {
    var that=this;
    let data = {
      apply_id: e.currentTarget.dataset.id,
    }
    var del_idx = e.currentTarget.dataset.idx;
    wx.showModal({
      title: '删除订单',
      content: '是否确认删除订单',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: config.deleteOrder,
            method: "GET",
            data: data,
            header: {
              'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res)
              if (res.data.status == 0) {
                // wx.switchTab({
                //   url: '/pages/myOder/myOder',
                //   success: function (e) {
                //     var page = getCurrentPages().pop();
                //     if (page == undefined || page == null) return;
                //     page.onLoad();
                //   }
                // })
                var newDataList = that.data.dataList;
                newDataList.splice(del_idx,1);
                that.setData({
                  dataList: newDataList
                });
                wx.showToast({
                  title: '删除成功'
                })
              }else{
                console.log(console.log(res))
              }

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
    

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
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    page++;
    jianding.wodedingdan(page, function (res) {
      wx.hideLoading()
      console.log(res)
      if (res.status == 0) {
        if (page == 0 || page == 1) {
          that.setData({
            dataList: res.data,
            myOrder: true,
          })
        } else {
          let data = that.data.dataList;
          for (let i = 0; i < res.data.length; i++) {
            data.push(res.data[i])
          }
          that.setData({
            dataList: data,
            myOrder: true,
          })
        }
        // that.setData({
        //   dataList: res.data,
        //   myOrder: true,
        // })
      } else {
        wx.hideLoading()
        if (page <= 1) {
          that.setData({
            myOrder: false,
          })
        } else {
          wx.showToast({
            title: "没有更多了",
            icon: 'none'
          })
        }
      }

    }, function (err) {
      let page = 1;
      that.setData({
        dataList: res.data,
        myOrder: true,
      })
      console.log(err);
    })
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
  },
  discountTap: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 100
    });
    this.animation = animation;
    if (!this.data.isOpen) {
      animation.width("360rpx").step();
      this.setData({
        animationData: animation.export(),
        isOpen: !that.data.isOpen
      })
    } else {
      animation.width(0).step();
      this.setData({
        animationData: animation.export(),
        isOpen: !that.data.isOpen
      })
    }
  },
  // hideDiscount:function(e){
  //   console.log(e.currentTarget)
  //   var animation = wx.createAnimation({
  //     duration: 100
  //   });
  //   this.animation = animation;
  //   animation.width(0).step();
  //   this.setData({
  //     animationData: animation.export(),
  //     isOpen: false
  //   })
  // },
  toCouponTap:function(){
    wx.navigateTo({
      url: '../myCoupon/myCoupon',
    })
  },
  onPullDownRefresh:function(){
    page=1;
    var that=this;
    jianding.wodedingdan(page, function (res) {
      console.log(res)
      if (res.status == 0) {
        if (page == 0 || page == 1) {
          that.setData({
            dataList: res.data,
            myOrder: true,
          })
        } else {
          let data = that.data.dataList;
          for (let i = 0; i < res.data.length; i++) {
            data.push(res.data[i])
          }
          that.setData({
            dataList: data,
            myOrder: true,
          })
        }
        // that.setData({
        //   dataList: res.data,
        //   myOrder: true,
        // })
      } else {
        if (page <= 1) {
          that.setData({
            myOrder: false,
          })
        } else {
          wx.showToast({
            title: "没有更多了",
            icon: 'none'
          })
        }
      }

    }, function (err) {
      let page = 1;
      that.setData({
        dataList: res.data,
        myOrder: true,
      })
      console.log(err);
    })
    jianding.getmycoupon(function (res) {
      console.log(res)
      if (res.data.status == 0) {
        console.log("zz")
        var count=0;
        console.log("length"+res.data.data.length)
        for (var i = 0; i < res.data.data.length;i++){
          if (res.data.data[i].state==0){
            count++;
          }
        }
        that.setData({
          discountCount: count
        });
      }
    }, function (err) {
      console.log(err)
    })
    wx.stopPullDownRefresh();
  }
})