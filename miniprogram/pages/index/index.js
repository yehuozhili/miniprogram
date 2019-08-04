// pages/index/index.js
const moment = require('../../utils/moment.min.js');
const app = getApp();
Component({
  data: {

  },
  //页面将tabBar中的selected记录值更改，达到tabBar页面跳转图标更换
  pageLifetimes: {
    show() {
      let that = this
      this.onPullDownRefresh=function(){
        wx.showNavigationBarLoading() //在标题栏中显示加
        let openid = app.globalData.openid;
        let calendar = moment().format('YYYY-MM-DD')
        let senddata = {
          openid: openid,
          calendar: calendar
        }
        //获取今天的
        wx.cloud.callFunction({
          name: 'getaddone',
          data: senddata
        }).then(res => {
          console.log(res);
          that.setData({
            todaydata: res.result.data
          });
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }).catch(e => {
          console.log(e);
          wx.showToast({
            title: String(e),
          })
        });
      };
      //跳转详情
      this.onetime=function(e){
        console.log(e);
        let onetimeIndex=e.target.dataset.index;
        wx.setStorage({
          key: `onetime${onetimeIndex}`,
          data: that.data.todaydata[onetimeIndex],
        })
        wx.navigateTo({
          url: `/pages/detail/detail?name=onetime${onetimeIndex}&&type=onetime`,
        })
      }


      this.getTabBar().setData({
        selected: 0
      });

      
      let openid = app.globalData.openid;
      let calendar = moment().format('YYYY-MM-DD')
      let senddata = {
        openid: openid,
        calendar: calendar
      }
      //获取今天的
      wx.cloud.callFunction({
        name: 'getaddone',
        data: senddata
      }).then(res => {
        console.log(res);
        this.setData({
          todaydata: res.result.data
        })
      }).catch(e => {
        console.log(e);
        wx.showToast({
          title: String(e),
          icon:'none'
        })
      });
    },
    
  },
  attached: function() {
 
  },
  created: function() {
    this.onShareAppMessage = function (res) {
      return {
        title: '我正在使用这个小程序管理每天计划',
        path: '/pages/index/index',
        success: function () { },
        fail: function () { }
      }
    }
  },
  method:function(){
  
  }
})