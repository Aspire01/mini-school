// pages/share/share.js
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabOne:true,
    tabTwo:false,
    contentImg:null,   //请求的内容图片
    imagelist: [],    //内容图片列表（长按操作）
    modalHiddenOne: true,  //模态框是否关闭
    modalHiddenTwo: true,  //模态框是否关闭
    wechatImg:'/images/wechat.png',
    posterImg:'/images/poster.png',
    isLogin:false,           //登录状态
    index: 1,                //请求页数
    friendList:[],            //请求好友列表
    isEmpty: false
  },

  // 获取导航按钮1
  getTabOne: (event) => {
    console.log(event.currentTarget.dataset.id);
    if (event.currentTarget.dataset.id === 0) {
      that.setData({
        tabOne: true,
        tabTwo: false
      });
    }
  },

  // 获取导航按钮2
  getTabTwo: (event) => {
    console.log(event.currentTarget.dataset.id);
    if (event.currentTarget.dataset.id === 1) {
      that.setData({
        tabOne: false,
        tabTwo: true
      });
    }
  },

  // 展示图片模态框1
  showImgModal: () => {
    // 查看是否登录
    if (app.isLogin()) {
      that.setData({
        modalHiddenOne: false
      });
    } else {
      app.showInfo('请先登录账号', app.globalData.g_warnImg);
    }
  },

  // 点击模态框1取消
  modalOneCandel: function () {
    this.setData({
      modalHiddenOne: true
    })
  },

  // 点击模态框1确认
  modalOneConfirm: function () {
    this.setData({
      modalHiddenOne: true
    })
  },

  // 长按操作图片
  previewImage: function (event) {
    let current = event.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.imagelist // 需要预览的图片http链接列表
    })
  },

  // 邀请说明(展示图片模态框2)
  description: () => {
    that.setData({
      modalHiddenTwo: false
    });
  },

  // 点击模态框2取消
  modalTwoCandel: function () {
    this.setData({
      modalHiddenTwo: true
    })
  },

  // 点击模态框2确认
  modalTwoConfirm: function () {
    this.setData({
      modalHiddenTwo: true
    })
  },

  // 没登录发出toast
  isLogin: () => {
    // console.log(app.isLogin());
    if (app.isLogin() == false){
      app.showInfo('请先登录账号', app.globalData.g_warnImg);
    }
  },

  // 获取邀请到的好友的列表
  getFriendList: () => {
    wx.request({
      url: app.globalData.g_interface + 'User/getApprenticeDetail',
      header: {
        "content-type": "application/json"
      },
      data: {
        uid: app.globalData.uid,
        p: that.data.index++
      },
      success(res){
        console.log(res);
        if (res.data.info.length > 0) {
          that.setData({
            friendList: res.data.info,
            isEmpty: false
          });
        } else {
          that.setData({
            isEmpty: true
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    that = this;
    // 获取海报图片
    wx.request({
      url: app.globalData.g_interface + 'User/getPoster',
      data: {
        uid: app.globalData.uid
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        if (res) {
          let item = "imagelist[0]";
          that.setData({
            contentImg: res.data.qrcode_url,
            [item]: res.data.qrcode_url
          });
        }
      }
    });
    // 获取邀请到的好友的列表
    that.getFriendList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 更新data区里的登录状态
    that.setData({
      isLogin: app.isLogin()
    });
    // tab开关
    if (app.globalData.g_shareSwitch == 1) {
      that.setData({
        tabOne: false,
        tabTwo: true
      });
    } else {
      that.setData({
        tabOne: true,
        tabTwo: false
      });
    }
    // 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.g_shareSwitch = 0;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快来跟我一起抢金币吧！',
      path: '/pages/Welcome/Welcome?uid=' + app.globalData.uid
    }
  }
})