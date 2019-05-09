// pages/signIn/signIn.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayList: [{
        money: 1,
        day: 1,
        signStatus: false
      },
      {
        money: 2,
        day: 2,
        signStatus: false
      },
      {
        money: 3,
        day: 3,
        signStatus: false
      },
      {
        money: 4,
        day: 4,
        signStatus: false
      },
      {
        money: 5,
        day: 5,
        signStatus: false
      },
      {
        money: 6,
        day: 6,
        signStatus: false
      },
      {
        money: 7,
        day: 7,
        signStatus: false
      }
    ],
    signRecord: [], //签到记录
    signInfo: '确定签到?', //签到时的提醒消息
    weekSignDays: 0, //周签到天数
    weekSignDaysSwitch: false, //周签到天数开关
    isSign: null  //是否签到
  },

  getSignLn: () => {
    if(!that.data.isSign){  //如果今天没有签过到
      // 调用模态框让用户考虑是否签到
      wx.showModal({
        title: '提醒',
        content: that.data.signInfo,
        success(res) {
          console.log("返回键：" + res.cancel + "\n" + "确定键：" + res.confirm);

          if (res.confirm) {  //如果点击了确认键
            // 请求签到
            wx.request({
              url: app.globalData.g_interface + 'Sign/sign',
              data: {
                uid: app.globalData.uid
              },
              header: {
                'content-type': 'application/json'
              },
              success(res) {
                console.log(res.data.info);
                that.setData({
                  signInfo: res.data.info
                });

                // 获取签到记录
                that.getSignRecord();
              }
            });
          }
          
        }
      });
    }
  },

  // 获取签到记录
  getSignRecord: () => {
    let signRecord = [];
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
        that.setData({
          signRecord: res.data.sign_record,
          isSign: res.data.is_sign
        });
        signRecord = res.data.sign_record;
        // 计算当前签到多少天及金币图标颜色
        that.getSignDays(signRecord);
      }
    });
  },

  // 计算当前签到多少天及金币图标颜色
  getSignDays: (signRecord) => {
    let days = 0; //已经签到的天数
    for (let i = 0; i < signRecord.length; i++) { //筛选最近三十天中签到天数并统计
      if (signRecord[i].reward_gold) {
        days++;
      }
    }
    if (days <= 7) { //计算当前周签到天数为多少
      that.setData({
        weekSignDays: days
      });
    } else {
      if (days % 7 == 0) {
        that.setData({
          weekSignDays: 7
        });
      }else{
        that.setData({
          weekSignDays: days % 7
        });
      }
    }

    // 修改金币颜色
    that.updateStyle();
  },

  // 修改金币的颜色
  updateStyle: () => {
    for (let i = 0; i < that.data.weekSignDays; i++) {
      let index = 'dayList[' + i + '].signStatus';
      that.setData({
        [index]: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    that = this;
    // 调用过渡动画
    app.onShowToast();
    // 获取签到记录
    that.getSignRecord();
  }
  
})