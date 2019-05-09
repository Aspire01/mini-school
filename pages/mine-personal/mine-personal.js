// pages/mine-personal/mine-personal.js
let that;
let app = getApp();
let Format = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:null,    //昵称
    avatarUrl: null,  //头像
    country: null,    //城市
    resigterTime: null,  //注册时间
    uid: null,        //用户id
    switchOne: false,  //tab1开关
    switchTwo: true, //tab2开关
    messageList: [],  //留言列表
    index: 1,         //当前请求页数
    isEmpty: false,   //是否还有新的消息,若无利用此变量显示结尾
    emptyInfoSwitch:false //空留言开关
  },

  // 获取导航按钮1
  getTabOne: (event) => {
    if (event.currentTarget.dataset.id == 0) {
      console.log(event.currentTarget.dataset.id);
      that.setData({
        switchOne: true,
        switchTwo: false
      });
    }
  },

  // 获取导航按钮2
  getTabTwo: (event) => {
    if (event.currentTarget.dataset.id == 1) {
      console.log(event.currentTarget.dataset.id);
      that.setData({
        switchOne: false,
        switchTwo: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    that = this;
    
    // 判断用户想打开的选项卡是哪个
    if (options.tabSwitch == 1) {
      that.setData({
        switchOne: true,
        switchTwo: false
      });
    } else if (options.tabSwitch == 2) {
      that.setData({
        switchOne: false,
        switchTwo: true
      });
    }

    // 请求用户信息
    wx.request({
      url: app.globalData.g_interface + 'User/getUserInfo',
      data: {
        uid: app.globalData.uid
      },
      header: {
        "content-type": "application/json"
      },
      success (res) {
        console.log(res.data.country);
        if (res) {
          // 将用户注册时间和城市存入data
          that.setData({
            resigterTime: res.data.time.substring(0, 10),
            country: res.data.country
          });
        }
      }
    });

    // 将存在全局和缓存中的用户数据和用户id放入data
    that.setData({
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      uid: wx.getStorageSync('indexSetting').uid
    });

    // 请求我的留言
    wx.request({
      url: app.globalData.g_interface + 'User/getMyMessage',
      data: {
        uid: app.globalData.uid,
        p: that.data.index++
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        if (res) {
          console.log(res.data);
          // 判断是否有内容
          if (res.data.info.length > 0) { //如果请求到的列表不为空
            // 判断是否显示lastinfo
            if (res.data.totalPage < that.data.index) { //如果页数大于总页数
              that.setData({
                isEmpty: true
              });
            } else {
              that.setData({
                isEmpty: false
              });
            }
            // 遍历显示留言列表
            let list = that.data.messageList;
            for (let i = 0; i < res.data.info.length; i++) {
              res.data.info[i].time = Format.formatTime(new Date(res.data.info[i].time * 1000)).substring(5);
              res.data.info[i].commentId = i;
              list.push(res.data.info[i]);
            }
            that.setData({
              messageList: list
            });
          } else {
            that.setData({
              emptyInfoSwitch: true
            });
          }
        }
      }
    });
  },

  // 赞
  favour: (event) => {
    console.log(event);
    // let index = event.currentTarget.dataset.commentId;
    // let favour = that.data.messageList[index].favour;
    // let messageItemFavour = 'messageList[' + index + '].favour';
    // let messageIsFavour = 'messageList[' + index + '].if_favour';
    // // 查看是否登录
    // if (app.isLogin()) {
    //   if (that.data.favourIsSelect) { //如果可以点击赞
    //     // 点赞并上传服务器
    //     wx.request({
    //       url: app.globalData.g_interface + 'User/favourThisMessage',
    //       header: {
    //         "conternt-type": "application/json"
    //       },
    //       data: {
    //         uid: app.globalData.uid,
    //         messageId: event.currentTarget.dataset.id
    //       },
    //       success(res) {
    //         console.log(res);
    //         if (res.data.status == 1) {
    //           that.setData({
    //             [messageItemFavour]: parseInt(favour) + 1,
    //             [messageIsFavour]: 1,
    //             disFavourIsSelect: false
    //           });
    //         } else if (res.data.status == 0) {
    //           that.setData({
    //             [messageItemFavour]: parseInt(favour) - 1,
    //             [messageIsFavour]: 0,
    //             disFavourIsSelect: true
    //           });
    //         }
    //       }
    //     });
    //   } else {
    //     app.showInfo('您已经评价过了', app.globalData.g_warnImg);
    //   }
    // } else {
    //   app.showInfo('请先登录账号', app.globalData.g_warnImg);
    // }
  },

  // 踩
  disFavour: (event) => {
    console.log(event);
    // let index = event.currentTarget.dataset.commentId;
    // let disFavour = that.data.messageList[index].disfavour;
    // let messageItemDisFavour = 'messageList[' + index + '].disfavour';
    // let messageIsDisFavour = 'messageList[' + index + '].if_disfavour';
    // // 查看是否登录
    // if (app.isLogin()) {
    //   if (that.data.disFavourIsSelect) { //如果可以点击踩
    //     // 踩并上传服务器
    //     wx.request({
    //       url: app.globalData.g_interface + 'User/disfavourThisMessage',
    //       header: {
    //         "conternt-type": "application/json"
    //       },
    //       data: {
    //         uid: app.globalData.uid,
    //         messageId: event.currentTarget.dataset.id
    //       },
    //       success(res) {
    //         console.log(res);
    //         if (res.data.status == 1) {
    //           that.setData({
    //             [messageItemDisFavour]: parseInt(disFavour) + 1,
    //             [messageIsDisFavour]: 1,
    //             favourIsSelect: false
    //           });
    //         } else if (res.data.status == 0) {
    //           that.setData({
    //             [messageItemDisFavour]: parseInt(disFavour) - 1,
    //             [messageIsDisFavour]: 0,
    //             favourIsSelect: true
    //           });
    //         }
    //       }
    //     });
    //   } else {
    //     app.showInfo('您已经评价过了', app.globalData.g_warnImg);
    //   }
    // } else {
    //   app.showInfo('请先登录账号', app.globalData.g_warnImg);
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})