// pages/kuaisujianbao/kuaisujianbao.js
const config = require('../../config/config.js');
const jianding = require('../../config/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miaoshuNum: 0,
    cangpinImgList: [
      '../../qietu/addimg.png',
    ],
    youhuijuan: '',
    shifouniming: false,
    xuanzefenlei: [],
    fenleiIdArr: [],
    selectFenlei: "",
    selectFenleiId: "0",
    dianjixuanzefenlei: 0,
    youhuijuanId: '',
    quedingselect: '',
    quedingselectID: '',
    user_coupon_id: '',
    price: '',
    user_nocoupon: '',
  },


  // 藏品描述
  cangpinmiaoshu: function(e) {
    e.detail.value = e.detail.value.replace(/^\s+|\s+$/g, '');
    this.setData({
      miaoshuNum: e.detail.value.length,
      miaoshuText: e.detail.value
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
  // 选择分类
  xuanzefenlei: function(e) {
    this.setData({
      dianjixuanzefenlei: 1
    })
  },
  // 选中分类
  selectFenlei: function(e) {
    let fenleiArr = this.data.xuanzefenlei;
    let fenleiIdArr = this.data.fenleiIdArr;
    if(fenleiIdArr[e.detail.value[0]]!=999){
      this.setData({
        quedingselect: fenleiArr[e.detail.value[0]],
        quedingselectID: fenleiIdArr[e.detail.value[0]]
      })
    }
  },
  // 确定选择分类
  quedingselect: function(e) {
    let that = this;
    console.log(that.data.quedingselectID)
    this.setData({
      selectFenlei: that.data.quedingselect,
      selectFenleiId: that.data.quedingselectID,
      dianjixuanzefenlei: 0
    })
  },
  // 取消选择分类
  quxiaoselect: function(e) {
    let that = this;
    this.setData({
      dianjixuanzefenlei: 0
    })
  },
  //鉴宝金额
  jianbaojine: function(e) {
    let that = this;
    this.setData({
      apprailsalPrice: e.data.data.apprailsal_getorder_price,
    })
    console.log(apprailsalPrice)
  },
  // 跳转优惠券页面
  toCoupon: function(e) {
    console.log(this.data)
    if (this.data.comeFrom == 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/Coupon/Coupon?fromto=0',
      })
    }

  },
  // 是否匿名
  shifouniming: function(e) {
    this.setData({
      shifouniming: e.detail.value
    })
  },
  // 提交信息
  tijiaoxinxi: function(e) {
    let that = this;
    console.log(that.data.miaoshuText =="")
    // 判断描述文字的字数
    if (that.data.miaoshuNum <= 0 || that.data.miaoshuNum >= 501 || that.data.miaoshuText == "") {
      wx.showToast({
        title: '请填写藏品描述，以便专家了解藏品',
        icon: 'none',
        mask: 'true'
      })
      return;
    } else if (that.data.cangpinImgList.length <= 4) { // 判断上传图片数量
      wx.showToast({
        title: '请上传至少4张藏品照片，以便专家鉴宝',
        icon: 'none',
        mask: 'true'
      })
      return;
    } else if (that.data.cangpinImgList.length >= 10) { // 判断上传图片数量
      wx.showToast({
        title: '最多上传9张藏品图片',
        icon: 'none',
        mask: 'true'
      })
      return;
    }
    if (that.data.shifouniming) {
      let shifouniming = 1;
    } else {
      let shifouniming = 0;
    }
    wx.showLoading({
      title: '正在上传信息',
      mask: true,
    })
    // console.log(e)
    // console.log(that)
    // return
    let data = {
      type: 3,
      desc: that.data.miaoshuText,
      // is_anonymous: that.data.shifouniming,
      user_coupon_id: that.data.user_coupon_id,
      catg_id: that.data.selectFenleiId,
      from_type : 1,
      sign: ''
    }
    // console.log(data)
    // return
    let imgArr = that.data.cangpinImgList
   
    // 上传图片
    let promise = [];
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
      data.img = JSON.stringify(imgIds);
      // 上传信息
      jianding.getMiyao(data, function (res) {
        data.sign = res.data.info;
        jianding.jianbaoshenqingtijiao(data, function (res) {
          //上传图片成功后调起支付
          if (res.status == 0) {
            //调起JSAPI支付
            console.log(res);
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
                'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
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
    
    let that = this;
    // console.log(options)
    let comeFrom = 0;
    this.setData({
      selectFenleiId: wx.getStorageSync('fenleiId'),
      selectFenlei: wx.getStorageSync('fenleiName'),
      quedingselect: wx.getStorageSync('fenleiName'),
      quedingselectID: wx.getStorageSync('fenleiId'),
      comeFrom: comeFrom
    });
    let keyong = [];
    let apprailsalPrice = '';
    let pages = getCurrentPages();
    wx.request({
      url: config.jianbaojine,
      data: '',
      header: {
        'content-type': 'application/json' // 默认值
      },
      
      success: function (res) {
        jianding.getyouhuijuan(0, 3, 30, function (res) {
          if (res.status == 1006) {
            that.setData({
              couponsNum: 0,
            })
          } else {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].state == 0) {
                keyong[keyong.length] = res.data[i];
              }
            }
            // console.log
            that.setData({
              couponsNum: keyong.length,
            })
          }
        })
        that.setData({
          apprailsalPrice: res.data.data.apprailsal_getorder_price,
        })
      },
    })
    

    //专家列表
    wx.request({
      url: config.zhuanjialiebiao,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        let data = res.data.data;
        let fenleiArr = ['请选择分类'];
        let fenleiIdArr = ['999'];
        for (let i = 0; i < data.length; i++) {
          fenleiArr.push(data[i].name)
          fenleiIdArr.push(data[i].id)
        }
        that.setData({
          xuanzefenlei: fenleiArr,
          fenleiIdArr: fenleiIdArr
        })
        console.log(that.data.xuanzefenlei, that.data.fenleiIdArr)
      },
      fail: function(res) {
        console.log(res + "错误")
      },
      complete: function(res) {
        console.log("结束")
      },
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
    // this.onLoad();
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