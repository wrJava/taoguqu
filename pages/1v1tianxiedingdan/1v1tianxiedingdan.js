// pages/1v1tianxiedingdan/1v1tianxiedingdan.js
const config = require('../../config/config.js');
const jianding = require('../../config/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miaoshuNum: 0,
    miaoshuText: '',
    cangpinImgList: [
      '../../qietu/addimg.png',
    ],
    youhuijuan: 0,
    youhuijuanId: '',
    shifouniming: false,
    selectExpertise: 0,
    expertise: [],
    user_coupon_id: '',
    price: '',
    user_nocoupon: '',
  },
  // 藏品描述
  cangpinmiaoshu: function (e) {
    var that=this
    e.detail.value = e.detail.value.replace(/^\s+|\s+$/g, '');
    this.data.miaoshuText = e.detail.value;
    console.log(e)
    this.setData({
      miaoshuNum: e.detail.cursor
    })
  },
  // 选择图片
  xuanzetupian: function(e) {
    let that = this;
    let cangpinImgList = [];
    let bdtp = that.data.cangpinImgList;
    let oHs = 0;
    for (let i = 0; i < bdtp.length; i++) {
      if (bdtp[i] != '../../qietu/addimg.png') {
        cangpinImgList[cangpinImgList.length] = bdtp[i]
      }
    }
    wx.chooseImage({
      count: (9 - cangpinImgList.length),
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res.tempFilePaths);
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          cangpinImgList[cangpinImgList.length] = res.tempFilePaths[i];
        }
        if (cangpinImgList.length <= 4) {
          oHs = 0;
        } else {
          oHs = 1;
        }
        if (cangpinImgList.length <= 8) {
          cangpinImgList[cangpinImgList.length] = '../../qietu/addimg.png';
        }
        that.setData({
          cangpinImgList: cangpinImgList,
          oHs: oHs
        })
      },
      fail: function(res) {
        console.log("错误" + res)
      },
      complete: function(res) {
        console.log("结束")
      }
    })
  },
  // 预览 图片
  yulantupian: function(e) {
    let that = this;
    let imgArr = [];
    let index = e.currentTarget.dataset.index;
    for (let i = 0; i < that.data.cangpinImgList.length; i++) {
      if (that.data.cangpinImgList[i] != "../../qietu/addimg.png") {
        imgArr[imgArr.length] = that.data.cangpinImgList[i];
      }
    }
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log("失败" + res);
      },
      complete: function(res) {
        console.log("结束");
      }
    })
  },
  // 删除图片；
  deleteImg: function(e) {
    let imgArr = [];
    let that = this;
    for (let i = 0; i < that.data.cangpinImgList.length; i++) {
      if (i != e.currentTarget.dataset.index && this.data.cangpinImgList[i] != '../../qietu/addimg.png') {
        imgArr[imgArr.length] = that.data.cangpinImgList[i];
      }
    }
    imgArr[imgArr.length] = '../../qietu/addimg.png';
    that.setData({
      cangpinImgList: imgArr
    })
  },
  // 是否匿名
  shifouniming: function(e) {
    this.setData({
      shifouniming: e.detail.value
    })
  },
  // 点击选择专长
  selectExpertise: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectExpertise: index
    })
  },
  // 点击选择优惠卷
  selectCoupon: function(e) {
    let that = this;
    let data = {};
    data.miaoshuText = that.data.miaoshuText;
    data.selectExpertise = that.data.selectExpertise;
    data.shifouniming = that.data.shifouniming;
    data.cangpinImgList = that.data.cangpinImgList;
    console.log(data);
    wx.setStorageSync('1v1', data);
    if (that.data.comeFrom == 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/Coupon/Coupon?fromto=1',
      })
    }
  },
  // 提交按钮
  tijiao: function(e) {
    let that = this;
    let data = {
      // 描述文字
      desc: that.data.miaoshuText,
      // 文字字数
      descNum: that.data.miaoshuNum,
      // 图片地址
      imgArr: that.data.cangpinImgList,
      // 图片数量
      imgArrNum: that.data.cangpinImgList.length,
      // 专家id
      zhuanjiaId: wx.getStorageSync('1v1zhuanjiaId').id,
      // 专家名字
      zhuanjiaName: wx.getStorageSync('1v1zhuanjiaId').name,
      // 专家价格
      zhuanjiaPrice: wx.getStorageSync('1v1zhuanjiaId').price,
      // 专长分类
      zhuanjiaFenlei: wx.getStorageSync('1v1zhuanjiaId').specialty_arr[that.data.selectExpertise],
      // 优惠券
      youhuijuan: that.data.youhuijuan,
      // 优惠券id
      youhuijuanId: that.data.youhuijuanId,
      // 是否匿名
      ifniming: that.data.shifouniming,
    }
    // 判断字数
    if (data.descNum <= 0 || data.descNum >= 501) {
      wx.showToast({
        title: '请填写藏品描述，以便专家了解藏品',
        icon: 'none'
      })
      return;
    }
    if (data.imgArrNum - 1 < 4) {
      wx.showToast({
        title: '请上传至少4张藏品照片，以便专家鉴宝',
        icon: 'none'
      })
      return;
    } else if (data.imgArrNum >= 10) { // 判断上传图片数量
      wx.showToast({
        title: '最多上传9张藏品图片',
        icon: 'none',
        mask: 'true'
      })
      return;
    }
    wx.showLoading({
      title: '正在上传信息',
    })
    let shifouniming;
    if (that.data.shifouniming) {
      shifouniming = 1;
    } else {
      shifouniming = 0;
    }
    let updata = {
      type: 0,
      expert_id: wx.getStorageSync('1v1zhuanjiaId').id,
      desc: that.data.miaoshuText,
      is_anonymous: shifouniming,
      user_coupon_id: that.data.user_coupon_id,
      from_type : 1,
      sign: ''
    }
    let promise = [];
    let imgArr = that.data.cangpinImgList
    
    // 上传图片
    let imgIds = [];
    for (let i = 0; i < imgArr.length; i++) {

      if (imgArr[i] != '../../qietu/addimg.png') {
        promise[i] = new Promise(function (resolve, reject) {
          jianding.upDataImg(imgArr[i], function (res) {
            imgIds.push(res);
            resolve(res);
            //     // imgId.push(res.split('img_id":"')[1].split('","s_url"')[0])
          });
        });
      }
    }
    Promise.all(promise).then(function (res) {
      // success
      console.log(imgIds);
      updata.img = JSON.stringify(imgIds);
      // console.log(updata)
      // 上传信息
      jianding.getMiyao(updata, function (res) {
        updata.sign = res.data.info;
        // console.log(updata)
        jianding.zhuanjiajianbao(updata, function (res) {
          //上传图片成功后调起支付
          if (res.status == 0) {
            //调起JSAPI支付
            wx.request({
              url: config.payorder,
              method: "POST",
              data: {
                out_trade_no: res.data,
                body: "淘古趣鉴宝",
                total_fee: res.pay_money * 100,
                openid: wx.getStorageSync('openid'),
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
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

                      if (res.errMsg == 'requestPayment:ok') {
                        wx.showToast({
                          title: '支付成功',
                        })
                        wx.redirectTo({
                          url: '/pages/paysuccess/paysuccess',
                          success: function (e) {
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad();
                          }
                        })
                      }
                    },
                    'fail': function (res) {
                      console.log(res)
                      wx.showToast({
                        title: '支付失败',
                      })
                      wx.redirectTo({
                        url: '/pages/payfail/payfail',
                        success: function (e) {
                          var page = getCurrentPages().pop();
                          if (page == undefined || page == null) return;
                          page.onLoad();
                        }
                      })
                    },
                    'complete': function (res) {
                      console.log(res)
                    }
                  })
              },
              fail: function (res) {
                console.log("错误");
                that.setData({
                  dataList: res.data.data
                })
              },
              complete: function () {
                console.log("结束");
              }
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 1000)
        }, function (err) {
          console.log(err)
          setTimeout(function () {
            wx.hideLoading();
          }, 1000)
          wx.showToast({
            title: '上传失败请稍后重试',
            mask: true,
            icon: 'none'
          })
        });
      },
        function (err) {
          console.log(err)
        })
    }, function (value) {
      // failure
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let fromto = options.fromto;
    let that = this;
    let keyong = [];
    this.setData({
      comeFrom: fromto,
      zhuanjiaData: wx.getStorageSync('1v1zhuanjiaId'),
      expertise: wx.getStorageSync('1v1zhuanjiaId').specialty_arr
    })
    jianding.getyouhuijuan(0, 0, 30, function (res) {
      if (res.status == 1006) {
        that.setData({
          couponsNum: 0,
        })
      } else {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].state == 0 && res.data[i].state) {
            keyong[keyong.length] = res.data[i];
          }
        }
        that.setData({
          couponsNum: keyong,
        })
      }
    })
    if (wx.getStorageSync('1v1') != "") {
      this.setData({
        // cangpinImgList: wx.getStorageSync('1v1').cangpinImgList,
        miaoshuText: wx.getStorageSync('1v1').miaoshuText,
        selectExpertise: wx.getStorageSync('1v1').selectExpertise,
        shifouniming: wx.getStorageSync('1v1').shifouniming
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
    this.onLoad()
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