// pages/comment-template/comment-template.js
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articId:null,     //文章id
    articTitle:null,  //文章标题
    nickName: null    //昵称
  },

  // 返回热点详情页
  backHotspotDetail: () => {
    wx.navigateTo({
      url: '../hotspot-detail/hotspot-detail?articId=' + that.data.articId,
    })
  },

  // 用户点击提交
  submitForm: (event) => {
    // 用户输入的数据
    let text = event.detail.value.textarea;
    wx.request({
      url: app.globalData.g_interface + 'News/postComment',
      header: {
        "content-type": "application/json"
      },
      data: {
        uid: app.globalData.uid,
        aid: that.data.articId,
        content: text
      },
      success(res) {
        console.log(res.data);
        if (res.data.status == 1) {
          // 前往评论区
          wx.navigateTo({
            url: `../hotspot-detail-comment/hotspot-detail-comment?articId=${that.data.articId}&articTitle=${that.data.articTitle}`,
          });
          // 交互
          app.showInfo('发送成功');
        } else {
          // 交互
          app.showInfo('发送失败', app.globalData.g_warnImg);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    that = this;
    console.log(options);
    that.setData({
      articId: options.articId,
      articTitle: options.articTitle,
      nickName: app.globalData.userInfo.nickName
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
})