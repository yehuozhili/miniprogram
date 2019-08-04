// miniprogram/pages/auth/auth.js
import { $wuxDialog } from '../../miniprogram_npm/wux-weapp/index';
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  },
  openType() {
    $wuxDialog().open({
      resetOnClose: true,
      title: '提示',
      content: '获取用户基本信息',
      buttons: [
      {
        text: '确定',
        type: 'primary',
        openType: 'getUserInfo',
        onGetUserInfo(e) {
          app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
          app.globalData.userInfo = e.detail.userInfo;
           // 调用云函数
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              // console.log('[云函数] [login] user openid: ', res.result.openid)
              app.globalData.openid = res.result.openid;
              wx.switchTab({
                url: '/pages/index/index',
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
              wx.showModal({
                title: '授权失败',
                content: '请重新授权',
                showCancel:false,
                success(res) {
                  console.log(res);
                }

              })
            }
          })
        },
      },
      ],
    })
  },
})