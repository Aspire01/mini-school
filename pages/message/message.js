// pages/message/message.js
let that;
let Format = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[],   //留言列表
    switchOne: true,  //tab1开关
    switchTwo: false, //tab2开关
    coeImg:0,         //上传图片的次数
    imgUrl:null,       //上传后的图片
    index:1,          //列表页数
    totalPage: 0,     //服务器总页数
    isEmpty:false,    //请求的列表是否为空
    favourIsSelect:true,          //点赞是否可用
    disFavourIsSelect:true,       //反对是否可用
  },

  // 获取导航按钮1
  getTabOne: (event) => {
    if (event.currentTarget.dataset.id == 0) {
      that.setData({
        switchOne: true,
        switchTwo: false
      });
    }
  },

  // 获取导航按钮2
  getTabTwo: (event) => {
    if (event.currentTarget.dataset.id == 1) {
      that.setData({
        switchOne: false,
        switchTwo: true
      });
    }
  },

  // 请求留言墙列表
  getMessage: () => {
    // 请求
    wx.request({
      url: app.globalData.g_interface + 'User/getMessageList',
      header: {
        "content-type": "application/json"
      },
      data: {
        uid: app.globalData.uid,
        p: that.data.index++
      },
      success(res) {
        // 判断是否有res
        if (res) {
          console.log(res);
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
          // 判断是否遍历列表
          if (res.data.info.length > 0) { //如果请求到的列表有新内容
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
            console.log(that.data.messageList);
          }
        }
      }
    });
  },

  // 赞
  favour: (event) => {
    console.log(event);
    let index = event.currentTarget.dataset.commentId;
    let favour = that.data.messageList[index].favour;
    let messageItemFavour = 'messageList[' + index +'].favour';
    let messageIsFavour = 'messageList[' + index + '].if_favour';
    // 查看是否登录
    if (app.isLogin()) {
      if (that.data.favourIsSelect) { //如果可以点击赞
        // 点赞并上传服务器
        wx.request({
          url: app.globalData.g_interface + 'User/favourThisMessage',
          header: {
            "conternt-type": "application/json"
          },
          data: {
            uid: app.globalData.uid,
            messageId: event.currentTarget.dataset.id
          },
          success(res) {
            console.log(res);
            if (res.data.status == 1) {
              that.setData({
                [messageItemFavour]: parseInt(favour) + 1,
                [messageIsFavour]:1,
                disFavourIsSelect: false
              });
            } else if (res.data.status == 0) {
              that.setData({
                [messageItemFavour]: parseInt(favour) - 1,
                [messageIsFavour]: 0,
                disFavourIsSelect: true
              });
            }
          }
        });
      } else {
        app.showInfo('您已经评价过了', app.globalData.g_warnImg);
      }
    } else {
      app.showInfo('请先登录账号', app.globalData.g_warnImg);
    }
  },

  // 踩
  disFavour: (event) => {
    let index = event.currentTarget.dataset.commentId;
    let disFavour = that.data.messageList[index].disfavour;
    let messageItemDisFavour = 'messageList[' + index + '].disfavour';
    let messageIsDisFavour = 'messageList[' + index + '].if_disfavour';
    // 查看是否登录
    if (app.isLogin()) {
      if (that.data.disFavourIsSelect) { //如果可以点击踩
        // 踩并上传服务器
        wx.request({
          url: app.globalData.g_interface + 'User/disfavourThisMessage',
          header: {
            "conternt-type": "application/json"
          },
          data: {
            uid: app.globalData.uid,
            messageId: event.currentTarget.dataset.id
          },
          success(res) {
            console.log(res);
            if (res.data.status == 1) {
              that.setData({
                [messageItemDisFavour]: parseInt(disFavour) + 1,
                [messageIsDisFavour]:1,
                favourIsSelect: false
              });
            } else if (res.data.status == 0) {
              that.setData({
                [messageItemDisFavour]: parseInt(disFavour) - 1,
                [messageIsDisFavour]: 0,
                favourIsSelect: true
              });
            }
          }
        });
      } else {
        app.showInfo('您已经评价过了', app.globalData.g_warnImg);
      }
    } else {
      app.showInfo('请先登录账号', app.globalData.g_warnImg);
    }
  },

  // 选择图片
  chooseImage: () => {
    // 查看是否登录
    if(app.isLogin()) {
      if(that.data.coeImg < 1){
        wx.chooseImage({
          count:1,
          sourceType:['album', 'camera'],
          success: function(res) {
            const tempFilePath = res.tempFilePaths[0];
            that.setData({
              tempImgPath: tempFilePath
            });
            that.uploadImg(tempFilePath);
          },
        })
      }
    } else {
      app.showInfo('请先登录账号', app.globalData.g_warnImg);
    }
  },

  // 上传图片
  uploadImg: (tempFilePath) => {
    wx.uploadFile({
      url: app.globalData.g_interface + 'User/uploadPic',
      filePath: tempFilePath,
      name: 'file',
      header: {
        "content-type": "multipart/form-data"
      },
      formData: {
        uid: app.globalData.uid
      },
      success(res){
        let image = JSON.parse(res.data);      //解析成json对象 

        console.log(image.imgurl);
        that.setData({
          coeImg: 1,
          imgUrl: image.imgurl
        });
        // console.log(that.data.imgUrl);
      }
    })
  },

  // 提交表单
  submitForm: (event) => {
    // 查看是否登录
    if (app.isLogin()) {
      let text = event.detail.value.textarea;
      wx.request({
        url: app.globalData.g_interface + 'User/postMessageInfo',
        header: {
          "content-type": "application/json"
        },
        data: {
          uid: app.globalData.uid,
          content: text,
          picUrl: that.data.imgUrl
        },
        success(res){
          // 将留言请求页数和列表归位
          that.setData({
            index: 1,
            messageList: []
          });
          // 提交成功后自动切换回留言墙选项卡
          if (res.data.status == 1) {
            that.setData({
              switchOne: true,
              switchTwo: false
            });
          }
          // 调用过渡动画
          app.onShowToast();
          // 请求留言列表
          that.getMessage();
        }
      })
    } else {
      app.showInfo('请先登录账号', app.globalData.g_warnImg);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    that = this;
    // 调用过渡动画
    app.onShowToast();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取留言列表
    that.getMessage();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 获取留言列表
    that.getMessage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 获取留言列表
    that.getMessage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})