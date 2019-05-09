// pages/hotspot-detail-comment/hotspot-detail-comment.js
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [], //评论列表
    isEmpty: false, //请求的评论列表是否为空
    total: null, //评论个数
    articId: null, //文章id
    articTitle: null, //文章标题
    index: 1, //评论请求页
    totalPage: null //评论总页数
  },

  // 返回热点详情页
  backHotspotDetail: () => {
    wx.navigateTo({
      url: '../hotspot-detail/hotspot-detail?articId=' + that.data.articId,
    })
  },

  // 返回顶部
  goToTop: (event) => {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  // 回到底部
  goToBottom: () => {
    wx.createSelectorQuery().select('#container').boundingClientRect((rect) => {
      console.log(rect);
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },

  // 前往评论窗口
  goToCommentWin: () => {
    wx.navigateTo({
      url: `../comment-window/comment-window?articId=${that.data.articId}&articTitle=${that.data.articTitle}`,
    })
  },

  // 获取热点评论
  getHotspotComment: () => {
    wx.request({
      url: app.globalData.g_interface + 'News/getArticleComment',
      header: {
        "content-type": "application/json"
      },
      data: {
        aid: that.data.articId,
        p: that.data.index
      },
      success(res) {
        console.log(res);
        // 记录总评论页数和条数
        that.setData({
          total: res.data.total,
          totalPage: res.data.totalPage
        });
        // 判断
        if (that.data.total > 0) {
          // 遍历列表
          let list = that.data.commentList;
          for (let i = 0; i < res.data.common.length; i++) {
            list.push(res.data.common[i]);
          }
          // 传进data
          that.setData({
            commentList: list,
            index: that.data.index + 1,
            isEmpty: false
          });

          // 评论总页数要大于等于请求页数
          if (that.data.totalPage >= that.data.index) {
            that.setData({
              isFinish: false,
            });
          } else {
            that.setData({
              isFinish: true,
            });
          }
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
  onLoad: function(options) {
    wx.hideShareMenu()
    that = this;
    // 将传来的文章id和文章标题存入data
    that.setData({
      articId: options.articId,
      articTitle: options.articTitle,
    });
    // 获取热点评论
    that.getHotspotComment();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 获取热点评论
    that.getHotspotComment();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})