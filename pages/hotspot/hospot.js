// pages/hotspot/hospot.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articList:[], //文章列表
    index:1,      //请求页
    url: app.globalData.g_interface + 'News/newsApi',
    isEmpty: false,
    isFinish: false
  },

  // 跳转文章详情
  getArticDetail: (event) => {
    // 获取文章id
    let articId = event.currentTarget.dataset.articId;

    // 跳转到指定页
    wx.navigateTo({
      url: '../hotspot-detail/hotspot-detail?articId=' + articId,
    })
    
  },

  // 获取文章列表
  getArticList: () => {
    // 请求
    wx.request({
      url: that.data.url,
      data: {
        p: that.data.index++
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res) {
          console.log(res.data);
          /*
            * 因为onload的success回调函数是异步方法，不会立即执行
            * 我们需要that.data.total的值是在onload的success回调函数赋值之后的正确的值
            * 所以我们将关于that.data.total的判断语句放在onshow的回调函数中
            * onshow的回调函数一定在onload的回调函数之后，所以这里的that.data.total已经是正确的值了
            * 如果that.data.total的值小于当前文章请求次数+1（每次请求完index自动+1）的值，那么我们就显示lastinfo模块
            */
          // 判断是否显示lastinfo
          if (res.data.totalPage < that.data.index){
            that.setData({
              isEmpty: true
            });
          } else {
            that.setData({
              isEmpty: false
            });
          }

          // 判断是否遍历列表
          if (res.data.info.length > 0) { //如果请求的列表里有新文章
            // 将数据遍历并赋值到文章列表
            let list = that.data.articList;
            for (let i = 0; i < res.data.info.length; i++) {
              list.push(res.data.info[i]);
            }
            that.setData({
              articList: list,
            });
          }
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    that = this;
    // 调用过渡动画
    app.onShowToast();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取文章列表
    that.getArticList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 再次请求获取文章列表
    that.getArticList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 再次请求获取文章列表
    that.getArticList();
  },
})