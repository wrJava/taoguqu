// pages/zhuanjialiebiao/zhuanjialiebiao.js
let zhuanjiapage = 1;
let zhuanjiatype = 0;
let zhuanjiavalue = '';
let config = require('../../config/config.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftArray: ['全部专家'],
    leftIndex: 0,
    rightArray: ['默认', '按热度排序', '按鉴定数排序','按价格排序'],
    rightIndex: 0,
    leftSanjiao: false,
    rightSanjiao: false
  },
  // 筛选排序
  bindCasPickerChange: function(e) {
    let lr = e.currentTarget.dataset.lr;
    // 判断筛选还是排序
    if (lr == "left") {
      console.log('选的是', this.data.leftArray[e.detail.value]);
      // 判断是否取消选择
      if (e.detail.value != undefined) {
        this.setData({
          leftSanjiao: false,
          rightSanjiao: false,
          leftIndex: e.detail.value
        })
        
        // 获取选中的项目
        let select = this.data.leftArray[e.detail.value];
        zhuanjiavalue = this.data.leftArray[e.detail.value];
        zhuanjiapage=0;
        this.zhuanjialiebiao(zhuanjiapage, zhuanjiatype, zhuanjiavalue);
        // console.log(this.data.pipei[select]);
      } else {
        this.setData({
          leftSanjiao: false,
          rightSanjiao: false
        })
      }
    } else {
      console.log('选的是', this.data.rightArray[e.detail.value]);
      if (e.detail.value != undefined) {
        this.setData({
          leftSanjiao: false,
          rightSanjiao: false,
          rightIndex: e.detail.value
        })
        if (this.data.rightArray[e.detail.value] == "按价格排序") {
          zhuanjiatype = 3;
          zhuanjiapage = 1;
          this.zhuanjialiebiao(zhuanjiapage, zhuanjiatype, zhuanjiavalue);
        } else if (this.data.rightArray[e.detail.value] == "按热度排序") {
          zhuanjiatype = 1;
          zhuanjiapage = 1;
          this.zhuanjialiebiao(zhuanjiapage, zhuanjiatype, zhuanjiavalue);
        } else if (this.data.rightArray[e.detail.value] == "按鉴定数排序") {
          zhuanjiatype = 2;
          zhuanjiapage = 1;
          this.zhuanjialiebiao(zhuanjiapage, zhuanjiatype, zhuanjiavalue);
        }else {
          zhuanjiatype = 0;
          zhuanjiapage = 1;
          this.zhuanjialiebiao(zhuanjiapage, zhuanjiatype, zhuanjiavalue);
        }
      } else {
        this.setData({
          leftSanjiao: false,
          rightSanjiao: false
        })
      }
    }
  },
  // 变换三角
  sanjiaobianhuan: function(e) {
    let qufen = e.currentTarget.dataset.lr;
    if (qufen == "left") {
      this.setData({
        leftSanjiao: true
      })
    } else {
      this.setData({
        rightSanjiao: true
      })
    }
  },
  // 跳转专家单页
  tozhuanjiadanye: function(e) {
    let zhuanjiaData = {
      id: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      price: e.currentTarget.dataset.price,
      specialty_arr: e.currentTarget.dataset.specialty_arr
    }
    wx.setStorageSync('1v1zhuanjiaId', zhuanjiaData)
    wx.navigateTo({
      url: '/pages/zhuanjiadanye/zhuanjiadanye?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    zhuanjiapage=1;
    zhuanjiatype = 0;
    zhuanjiavalue = '';
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let that = this;
    wx.request({
      url: config.zhuanjialiebiao,
      data: {},
      header: {
        'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
      },
      method: 'GET',
      success: function(res) {
        if (res.data.status == "0") {
          let name = ['全部专家'];
          // let pipei = {};
          for (let i = 0; i < res.data.data.length; i++) {
            name.push(res.data.data[i].name);
            // pipei[res.data.data[i].name] = res.data.data[i].id
          }
          that.setData({
            leftArray: name,
            // pipei: pipei
          })
          // console.log(res.data.data)
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
      }
    })
    if (zhuanjiavalue == '全部专家'){
      zhuanjiavalue = '';
    }
    console.log(zhuanjiavalue);
    // 请求专家列表
    this.zhuanjialiebiao(zhuanjiapage, zhuanjiatype, zhuanjiavalue);

  },
  // 请求专家列表
  zhuanjialiebiao: function(page, type, value) {
    let that = this;
    if(value == "全部专家"){
        value='';
    }
    wx.request({
      url: config.shaixuanzhuanjia + page + '&type=' + type + '&value=' + value,
      method: 'GET',
      header: {
        'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member')
      },
      success: function(res) {
        console.log(res.data)
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        if (res.data.status == "0") {
          // 处理专家标签最多显示三个
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].specialty_arr.length > 3) {
              res.data.data[i].specialty_arr = res.data.data[i].specialty_arr.slice(0, 3);
            }
          }
          if (page == 0||page==1) {
            that.setData({
              zhuanjialiebiao: res.data.data
            })
          } else {
            let data = that.data.zhuanjialiebiao;
            for (let i = 0; i < res.data.data.length; i++) {
              data.push(res.data.data[i])
            }
            that.setData({
              zhuanjialiebiao: data
            })
          }
        } else {
          // zhuanjiatype = 0;
          // zhuanjiapage = 0;
          // zhuanjiavalue = '';
          wx.showToast({
            title: '没有更多数据',
            icon: 'none',
          })
        }
        console.log(that.data.zhuanjialiebiao)
        wx.hideLoading();
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 头像错误
  touxiangcuowu: function(e) {
    let index = "zhuanjialiebiao[" + e.currentTarget.dataset.index + "].headimg";
    this.setData({
      [index]: '../../qietu/avatar.png'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
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
    zhuanjiapage++;
    this.zhuanjialiebiao(zhuanjiapage, zhuanjiatype, zhuanjiavalue);
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