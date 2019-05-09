//app.js
let that;
App({
  onLaunch: function () {
    that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    uid: null,
    userInfo: null,
    g_interface:'http://campus.weirong100.com/Api/',
    g_encryptedData: null,
    g_unionid: null,
    g_code:null,
    g_shareSwitch:0,
    g_totalSignMoney:null,
    g_isLogin:false,
    g_warnImg:'/images/warn.png'
  },

  // 过渡动画
  onShowToast: () => {
    wx.showToast({
      title: '请稍后',
      icon: 'loading',
      duration: 500,
    })
  },

  // 信息提示
  showInfo: (title, image) => {
    wx.showToast({
      title: title,
      image: image,
      duration: 500,
    })
  },

  // 判断用户是否登录
  isLogin: () => {
    return that.globalData.g_isLogin;
  }
})