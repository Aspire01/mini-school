// pages/mine/mine.js
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    functionListOne:[
      { id:0, iconFont: 'icon-money', desc: '我的金币' },
      { id: 1, iconFont: 'icon-haoyou', desc: '我邀请的好友' }
    ],
    functionListTwo: [
      { id: 2, iconFont: 'icon-pinglun', desc: '我的评论' },
      { id: 3, iconFont: 'icon-liuyan', desc: '我的留言墙' }
    ],
    functionListThree: [
      { id: 4, iconFont: 'icon-fenxiang', desc: '分享给好友' },
      { id: 5, iconFont: 'icon-shezhi', desc: '清理缓存' },
      { id: 6, iconFont: 'icon-guanyu', desc: '关于' },
      { id: 7, iconFont: 'icon-zhuxiao', desc: '注销' }
    ],
    isLogin:false,
    nickName:null,
    avatarUrl:null,
    isSign:false,
    money:0,
    tapNum:0,
    moneySum:0,
    version:1.11
  },

  // 登录
  loginFun: () => {
    // 登录
    wx.login({
      success(res) {
        app.globalData.g_isLogin = true;
        that.setData({
          isLogin: app.isLogin()
        });
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo;
            // 显示用户信息
            that.showUserInfo();
          }
        })
      }
    })
  },

  // 显示用户信息并请求签到记录查看今天是否签到
  showUserInfo: () => {
    if (app.globalData.userInfo) {
      that.setData({
        isLogin: true,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      });
    }
    // 请求签到记录查看今天是否签到
    that.getSignInRecord();
  },

  // 签到记录
  getSignInRecord: () => {
    wx.request({
      url: app.globalData.g_interface + 'Sign/getSignDetail',
      data: {
        uid: app.globalData.uid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          isSign: res.data.is_sign,
          money: res.data.sign_record[0].reward_gold
        });
      }
    });
  },

  // 进入用户个人中心
  goToPersonalCenter: (tabSwitch) => {
    let Switch = parseInt(tabSwitch);
    // 跳转到指定页
    wx.navigateTo({
      url: `../mine-personal/mine-personal?tabSwitch=` + tabSwitch,
    })
  },

  // 进入签到页面
  goToSignIn: () => {
    wx.switchTab({
      url: "../signIn/signIn",
    })
  },

  // 功能区点击事件集
  tapSet: (event) => {
    if (that.data.isLogin){
      let index = event.currentTarget.dataset.index
      switch (index) {
        case 0:                       // 查看我的金币
          that.managerMoney();
          break;
        case 1:                       // 跳转到我邀请的好友
          that.goToMyFriends();
          break;
        case 2:                       // 跳转到个人中心详情-我的评论
          that.goToPersonalCenter(1);
          break;
        case 3:                       // 跳转到个人中心详情-我的留言墙
          that.goToPersonalCenter(2);
          break;
        case 4:                       // 不做处理(交给button来分享)
          break;
        case 5:                       // 清除缓存
          that.showClearStorage();
          break;
        case 6:                       // 查看软件版本
          that.showModal('软件版本', `版本号: V${that.data.version}`);
          break;
        case 7:                       // 退出登录
          that.logout();
      }
    } else {
      app.showInfo('请先登录账号', app.globalData.g_warnImg);
    }
  },

  // 检查金币
  managerMoney: () => {
    if (that.data.moneySum) {
      that.showModal('我的金币', `金币数量:${that.data.moneySum}个!`);
    } else {
      that.showModal('我的金币', `您还未签过到，仓库里空荡荡的~`);
    }
  },

  // 查看我的金币/软件版本
  showModal: (caption, info) => {
    wx.showModal({
      title: caption,
      content: info,
    })
  },

  // 跳转到邀请-我的好友
  goToMyFriends: () => {
    app.globalData.g_shareSwitch = 1;
    wx.switchTab({
      url: "../share/share",
    })
  },

  // 清理缓存模块
  showClearStorage: () => {
    wx.removeStorage({
      key: 'logs',
      success: function(res) {
        wx.showToast({
          title: '缓存清理成功!',
        })
      },
    });
  },

  // 退出登录
  logout: () => {
    app.globalData.g_isLogin = false;
    that.setData({
      isLogin: app.isLogin()
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否为登录状态
    if (app.isLogin()) {
      // 更新data中的登录状态
      that.setData({
        isLogin: app.isLogin()
      });
      // 显示用户信息并请求签到记录查看今天是否签到
      that.showUserInfo();
      // 获取金币的总数量
      if (app.globalData.g_totalSignMoney) {  //如果全剧终有总金币数则直接获取
        that.setData({
          moneySum: app.globalData.g_totalSignMoney
        });
      } else {
        // 请求签到记录
        wx.request({
          url: app.globalData.g_interface + 'Sign/getSignDetail',
          data: {
            uid: app.globalData.uid
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            app.globalData.g_totalSignMoney = res.data.total_sign_gold;  //将签到获得的总金币存入全局
            // 从全局获取金币总数
            that.setData({
              moneySum: app.globalData.g_totalSignMoney
            });
          }
        });
      }
    }
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