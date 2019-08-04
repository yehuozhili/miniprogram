const app=getApp();
const db = wx.cloud.database()

Component({
  data: {
    onetimedata: null,
    current: 'tab1',
    scrollheight:0,
    count:0,//单次下拉刷新
    loadstate:0,//加载状态
  },

  pageLifetimes: {
    show() {
      let that = this;
      let openid = app.globalData.openid;
      if(app.globalData.onetimedata){
        this.setData({
          onetimedata:app.globalData.onetimedata,
          count:app.globalData.onetimecount
        })
      }else{
        let senddata = {
          openid: openid,
          count: 0
        }
        //获取初始,如果有全局,就拿全局,没有就设定上
        wx.cloud.callFunction({
          name: 'getaddoneall',
          data: senddata
        }).then(res => {
          console.log(res);
          app.globalData.onetimedata = res.result.data
          that.setData({
            onetimedata: res.result.data
          });
        }).catch(e => {
          console.log(e);
          wx.showToast({
            title: String(e),
            icon: 'none'
          })
        });
      }
      //tabbar设定
      this.getTabBar().setData({
        selected: 1
      });

      //单次项目跳转
      this.onetime = function (e) {
        console.log(e);
        let onetimeIndex = e.target.dataset.index;
        wx.setStorage({
          key: `onetime${onetimeIndex}`,
          data: that.data.onetimedata[onetimeIndex],
        })
        wx.navigateTo({
          url: `/pages/detail/detail?name=onetime${onetimeIndex}&&type=onetime`,
        })
      };


      //切换选项卡
      this.onChange=function(e) {
        this.setData({
          current: e.detail.key
        })
      };

      //触发滑块设定
      let height2=wx.getSystemInfoSync().windowHeight-170;
      this.setData({
        scrollheight:height2
      });

      //下拉滑块加载
      this.scrollonetime=function(e){
        if(that.data.loadstate){
          return
        }
        else{
          that.setData({
            loadstate:1
          })
          wx.showToast({
            title: '正在加载',
            icon:'loading'
          })
          let count = that.data.count + 1;
          app.globalData.onetimecount=count;
          that.setData({
            count: count
          })
          console.log(count);
          let senddata = {
            openid: openid,
            count: count * 13//修改这个需要修改云函数的返回limit
          }
          let originlist = that.data.onetimedata;
          wx.cloud.callFunction({
            name: 'getaddoneall',
            data: senddata
          }).then(res => {
            if(res.result.data.length===0){
              wx.showToast({
                title: '已经到底了',
                icon:'none'
              })
              app.globalData.onetimecount=app.globalData.onetimecount-1//如果是空的 返回成最后的count次数
              console.log('xx',app.globalData.onetimecount)
              that.setData({
                count:app.globalData.onetimecount
              })
            }
            let myobj = res.result.data;
            let originlen=Number(originlist.length);
            let tmpobj={}
            for(let i in myobj){
              tmpobj[originlen+Number(i)]=myobj[i]
            }
            Object.assign(originlist,tmpobj)
            app.globalData.onetimedata=originlist;
            that.setData({
              onetimedata: originlist,
              loadstate:0
            });
          }).catch(e => {
            console.log(e);
            wx.showToast({
              title: String(e),
              icon: 'none'
            })
          });

        }
      

      }
      this.scrolltoprefresh=function(e){//刷新后更新下拉的count值
        if (that.data.loadstate) {
          return
        }else{
          that.setData({
            loadstate: 1
          })
          wx.showToast({
            title: '刷新中',
            icon: 'loading'
          })
  
          let senddata = {
            openid: openid,
            count: 0
          }

          wx.cloud.callFunction({
            name: 'getaddoneall',
            data: senddata
          }).then(res => {
            if (res.result.data.length === 0) {
              wx.showToast({
                title: '没有数据',
                icon: 'none'
              })
            }
            app.globalData.onetimecount = 0// 更新count次数
            that.setData({
              count: 0
            })
            app.globalData.onetimedata = res.result.data;
            that.setData({
              onetimedata: res.result.data,
              loadstate: 0
            });
          }).catch(e => {
            console.log(e);
            wx.showToast({
              title: String(e),
              icon: 'none'
            })
          });

        }
      }
    }
  },
  created: function () {
    this.onShareAppMessage = function (res) {
      return {
        title: '我正在使用这个小程序管理每天计划',
        path: '/pages/index/index',
        success: function () { },
        fail: function () { }
      }
    }
  }
})