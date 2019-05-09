//index.js
//获取应用实例
const app = getApp()
let that = this;

Page({
  data: {
    motto: '进入校友录',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uid:''
  },

  // 前往tab页中的热点
  goToTab: function () {
    wx.switchTab({
      url: '/pages/hotspot/hospot',
    })
  },

  // 钩子函数
  onLoad: function (e) {
    wx.hideShareMenu()
    that = this;
    console.log(e);
    if (e.uid) {
      conosle.log('邀请第一步成功');
    }
    // （系统）
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

    // 用户登录,获取登录码
    wx.login({
      success: function (res) {
        app.globalData.g_code = res.code;

        // 获取用户信息
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            let userInfo = res.userInfo;
            let nickName = userInfo.nickName;
            let avatarUrl = userInfo.avatarUrl;
            let gender = userInfo.gender; //性别 0：未知、1：男、2：女
            let province = userInfo.province;
            let city = userInfo.city;
            let country = userInfo.country;
            let encryptedData = res.encryptedData;  //加密信息
            let iv = res.iv

            // 将保密信息和登录状态存到全局中
            app.globalData.g_encryptedData = encryptedData;
            app.globalData.g_isLogin = true;
            app.globalData.g_iv = iv;

            // 第二次到以后自动从缓存中寻找是否有uid(第一次在109行附近)
            let indexSetting = wx.getStorageSync('indexSetting');
            if (indexSetting) {
              // 若有userSetting则获取缓存内的userSetting的uid,并存入data和全局中
              that.setData({
                uid: indexSetting.uid
              });
              app.globalData.uid = indexSetting.uid;
            } else {  
              //若没有则创建空的userSetting对象,并将里面的uid设为0，存入缓存
              let indexSetting = {};
              indexSetting.uid = 0;
              wx.setStorageSync('indexSetting', indexSetting);
              // 将新生成的uid（0）存在data中
              that.setData({
                uid: indexSetting.uid
              });
            }

            // 上传用户信息和唯一标识符
            wx.request({
              url: app.globalData.g_interface + 'User/postUserinfo',
              data: {
                nickName: nickName,
                avatarUrl: avatarUrl,
                gender: gender,
                province: province,
                city: city,
                uid: 123456,
                encryptedData: encryptedData,
                code: app.globalData.g_code,
                iv: iv
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                if (res) {
                  console.log(res);
                  let indexSetting = {};
                  // 第一次设置uid
                  indexSetting.uid = res.data.uid;
                  // 将uid容器存入缓存        
                  wx.setStorageSync('indexSetting', indexSetting);
                  // 存入全局
                  app.globalData.uid = res.data.uid;
                }
              }
            });
          }
        })
      }
    });
  },

  // 获取用户信息（系统）
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
