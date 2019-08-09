// pages/cangpinxiangqing/cangpinxiangqing.js
const myaudio = wx.createInnerAudioContext();
let timer;
let isplay;
const config = require("../../config/config.js");
const jianding = require("../../config/function.js");
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    isplay:false,
    hiddenmodalput: true, 
    pingjianzan: '',
    experExpertise: '',
    replay: '',
    cangpinFabulous: '',
    zhuanjiaFabulous: '',
    zhuanjiais_likes: 0,
    parent_id:0
  },
  // 点击评鉴点赞按钮
  clickjianZan: function(e) {
    let that = this;
    let cangpindianzan = this.data.cangpindianzan;
    let pingjianzan = this.data.pingjianzan;
    let oIf = e.currentTarget.dataset.if;
    if (oIf == 0) {
      //藏品点赞
      if (cangpindianzan == 1) {
        wx.showToast({
          title: '赞过了要坚定立场哦',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      } else {
        let data = {
          thing_id: this.data.thingid,
          from_type: 1
        }
        wx.request({
          url: config.appraisallikes, 
          method: "POST",
          data: data,
          header: {
            'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              cangpinFabulous: that.data.cangpinFabulous + 1,
              is_likes: 1,
              cangpindianzan: 1,
            })
            wx.showToast({
              title: '点赞成功',
              icon: 'none',
              duration: 1000,
              mask: true,
            })
          },fail: function (res) {
            console.log('shibai')
          }
        })
      }
    } else {
      let pingjianFabulousType = this.data.zhuanjiais_likes;
      //评鉴点赞
      if (pingjianFabulousType == 1) {
        wx.showToast({
          title: '赞过了要坚定立场哦',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      } else {
        let data = {
          reply_id: this.data.replay.id,
        }
        
        let thing_id = this.data.thingid;
        wx.request({
          url: config.replylikes,
          data: data,
          method: "POST",
          header: {
            'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.setData({
              zhuanjiaFabulous: Number(that.data.zhuanjiaFabulous) + 1,
              pingjianFabulousType: 1,
              zhuanjiais_likes: 1,
            })
            wx.showToast({
              title: '点赞成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }, fail: function (res) {
            console.log('shibai')
          }
        })
      }
    }
  },
  // 点击偷偷看
  onClickTTK: function(e) {
    this.setData({
      shifoufufei: true
    })
  },
  // 点击查看大图
  onClickImg: function(e) {
    let index = e.currentTarget.dataset.index;
    let imgArr = this.data.cangpinBigImg;
    wx.previewImage({
      current: imgArr[index], // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },
  // 点击听语音
  onClickTYY: function(e) {
    // let voice_small = this.data.replay.voice_small;
    let that = this;
    // let isplay = false;
// console.log(88888)
    // myaudio.autoplay = true
    // myaudio.src = voice_small
    myaudio.play(() => {
      console.log('开始播放')
    })
    timer = setInterval(function() {
      that.setData({
        voice_small: true,
        isplay: true,
        yuyinText: myaudio.currentTime.toFixed(0) + 's/' + myaudio.duration.toFixed(0) + 's'
      })
    }, 1000)
    console.log(isplay)
  },
  // 点击停止语音
  onClickStop: function(e) {

    clearInterval(timer);
    myaudio.pause(()=>{
      myaudio.destroy();
    
    });
    
    this.setData({
      isplay: false,
      yuyinText: myaudio.duration.toFixed(0) + 's',
    })
    
console.log(6666)

  },
  //点击评论
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  onClickpinglun: function (e) {
    console.log("sss")
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true 
    });
    this.data.parent_id=0;
  },
  shuru: function (e) {
    let shuru
    this.setData({
      shuru: e.detail.value
    })
  },
  
  //确认  
  confirm: function (e) {
    if (!this.data.shuru){
      wx.showToast({
        title: '请输入评论内容',
        icon:'none'
      })
      return;
    };
    let data = {
      thing_id: this.data.thingid,
      desc: this.data.shuru,
      parent_id: this.data.parent_id,
      from_type: 1
    }
    let thing_id = this.data.thingid;
    // return;
    //提交评论
    wx.request({
      url: config.thingevalu, 
      method: "POST",
      data: data,
      header: {
        'Cookie': 'PHPSESSID=' + wx.getStorageSync('sessionkey') + ';member=' + wx.getStorageSync('member'),
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.status==0) {
          hiddenmodalput: true
          wx.redirectTo({
            url: '/pages/cangpinxiangqing/cangpinxiangqing?thing_id=' + thing_id,
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }
        if (res.data.status == 99) {
          hiddenmodalput: true
          wx.showToast({
            title: '尊敬的用户，由于您违反平台规定，现已被禁言',
            icon: 'none',
          })
        }
        
      }
    })
    this.data.parent_id=0;
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let data = {
      thing_id: options.thing_id
    }
    this.data.uid=wx.getStorageSync("uid")
    jianding.cangbaoquan(data, function(res) {
      console.log(res)
      let thing_type = '';
      let kanzhenjia = '';
      switch (parseInt(res.data[0].type)) {
        case 0:
          thing_type = '1v1';
          break;
        case 3:
          thing_type = '抢单';
          break;
        case 4:
          thing_type = '悬赏';
          break;
        case 5:
          thing_type = '晒宝';
          break;
      }
      switch (parseInt(res.data[0].result_type)) {
        case 1:
          kanzhenjia = '../../qietu/kanzhen.png';
          break;
        case 2:
          kanzhenjia = '../../qietu/kanjia.png';
          break;
        case 3:
          kanzhenjia = '../../qietu/cunyi.png';
          break;
      }
      
      if(res.data[0].appraisal_reply[0]){
        myaudio.src = res.data[0].appraisal_reply[0].voice_small;
        // myaudio.autoplay=true;
        // myaudio.pause();
        var timer = setInterval(function () {
          if (myaudio.duration.toFixed(0) != 0) {
            that.setData({
              yuyinText: myaudio.duration.toFixed(0) + 's'
            })
            clearInterval(timer);
            timer = null;
          };
        }, 1000)
      }
      
      
      
      // if (res.data[0].appraisal_reply[0]) {
        
      // console.log(res.data[0]);
        // return
      // }
      that.setData({
        
        // appraisalReply: res.data[0]
        thingid: res.data[0].thing_id,
        fadanAvatar: res.data[0].user_img,
        cangpinDesc: res.data[0].desc,
        fadanName: res.data[0].vip_name,
        cangpinImg: res.data[0].thumb_img,
        cangpinBigImg: res.data[0].img,
        fadanTime: res.data[0].time_text,
        is_likes: res.data[0].is_likes,
        cangpindianzan: res.data[0].is_likes ? '1' : '2',
        pingjianFabulousType: res.data[0].appraisal_reply.is_likes ? '1' : '2',
        pingjianzan: res.data[0].appraisal_reply.id,
        fadanType: thing_type,
        cangpinFabulous: res.data[0].likes_num,
        cangpinComment: res.data[0].evalu_num,
        expert: res.data[0].appraisal_reply,
        experExpertise: res.data[0].specialty,
        replay: res.data[0].appraisal_reply[0],
        pinglunliuyan: res.data[0].thing_evalu
      })
      if (res.data[0].appraisal_reply[0]) {
        that.setData({
          zhuanjiaFabulous: res.data[0].appraisal_reply[0].likes_num,
          zhuanjiais_likes: res.data[0].appraisal_reply[0].is_likes,
        })
      }
    }, function(err) {
      console.log(res)
      
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
    myaudio.src = this.data.yuyinlaiyuan;
    var that = this;
    // GetList(that);
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
    this.setData({
　　　changeon: "下拉中"
　　})
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
  },
  answerTap:function(e){
    if(e.currentTarget.dataset.vip_id==this.data.uid) return ;
    this.data.parent_id=e.currentTarget.dataset.id;
    this.setData({
      hiddenmodalput:false
    })
  }
})