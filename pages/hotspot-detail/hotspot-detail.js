// pages/hotspot-detail/hotspot-detail.js
let WxParse = require('../../lib/wxParse/wxParse.js');
let Format = require('../../utils/util.js');
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articId: null,//当前文章id
    favour: 0,    //当前文章点赞数
    comment: 0,   //当前文章评论数
    time: '',   //发布时间
    caption: '', //文章标题
    favourStatus: 0,  //点赞状态
    nickName:null,        //用户昵称
  },

  // 将得到的html内容转化成wxml
  getWxml: (content) => {    
    let article = content;
    let res = WxParse.wxParse('article', 'html', article, that, 17);
    return res;
  },

  // 赞/取消赞
  togglePraise: () => {
    wx.request({
      url: app.globalData.g_interface + 'News/postFavour',
      data: {
        uid: app.globalData.uid,
        aid: that.data.articId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res) {
          console.log(res);
          let info = res.data.info; //保存点赞消息
          if (res.data.status === 1) { //如果点赞成功
            // 更新点赞状态和点赞数
            that.setData({
              favourStatus: true,
              favour: parseInt(that.data.favour) + 1
            });
          } else if (res.data.status === 0) { //如果取消点赞
            // 更新点赞状态和点赞数
            that.setData({
              favourStatus: false,
              favour: that.data.favour - 1
            });
          }
        }
      }
    })
  },

  // 前往评论窗口
  goToCommentWin: () => {
    wx.navigateTo({
      url: `../comment-window/comment-window?articId=${that.data.articId}&articTitle=${that.data.caption}`,
    })
  },

  // 前往评论区
  goToComment: () => {
    wx.navigateTo({
      url: `../hotspot-detail-comment/hotspot-detail-comment?articId=${that.data.articId}&articTitle=${that.data.caption}`,
    })
  },

  // 请求点赞状态

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    that = this;
    // 将文章id存入data
    that.setData({
      articId: options.articId,
      nickName: app.globalData.userInfo.nickName
    });
    // 调用交互
    app.onShowToast();
    // 请求指定文章
    wx.request({
      url: app.globalData.g_interface + 'News/articleApi',
      data: {
        uid: app.globalData.uid,
        article_id: options.articId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res) {
          console.log(res.data);
          // 获取时间
          let time = Format.formatTime(new Date(res.data.add_time * 1000));
          // 转义内容
          that.getWxml(res.data.content);
          // 将时间,标题,赞,评论数存入data区
          that.setData({
            time,
            caption: res.data.title,
            favour: res.data.favour,
            comment: res.data.comment_total,
            favourStatus: res.data.if_favour
          });
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '快来跟我一起抢沙发吧！',
      path: '/pages/hotspot-detail/hotspot-detail?uid=' + app.globalData.uid + '&articId' + articId
    }
  }
})