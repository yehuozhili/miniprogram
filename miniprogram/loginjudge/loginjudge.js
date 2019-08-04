import { $wuxDialog } from '../miniprogram_npm/wux-weapp/index'
const moment=require('../utils/moment.min.js');
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl:null,
    userInfo:null,
    openid:null
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  attached: function () {
    let that = this;
    function mySetTime() {
      let nowtime = moment().format("YYYY年MM月DD日 HH时mm分ss秒");
      that.setData({
        nowtime: nowtime
      })
    }
    setInterval(mySetTime, 1000);

    if (app.globalData.userInfo) {
      this.setData({
        avatarUrl: app.globalData.avatarUrl,
        userInfo: app.globalData.userInfo,
      })
      return
    } else {


      // wx.getSetting({
      //   success: res => {
      //     if (res.authSetting['scope.userInfo']) {
      //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      //       wx.getUserInfo({
      //         success: res => {
      //           app.globalData.avatarUrl = res.userInfo.avatarUrl;
      //           app.globalData.userInfo = res.userInfo;
      //           this.setData({
      //             avatarUrl: res.userInfo.avatarUrl,
      //             userInfo: res.userInfo
      //           })

      //           // 调用云函数
      //           wx.cloud.callFunction({
      //             name: 'login',
      //             data: {},
      //             success: res => {
      //               console.log('[云函数] [login] user openid: ', res.result.openid)
      //               app.globalData.openid = res.result.openid;
      //               this.setData({
      //                 openid: res.result.openid
      //               })
      //             },
      //             fail: err => {
      //               console.error('[云函数] [login] 调用失败', err)
      //             }
      //           })
      //         }
      //       })
      //     }
      //   }
      // })
    }
  }
})
