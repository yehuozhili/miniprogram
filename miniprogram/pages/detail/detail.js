// miniprogram/pages/detail/detail.js
const moment = require('../../utils/moment.min.js')
import {
  $wuxToptips
} from '../../miniprogram_npm/wux-weapp/index'
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'Spinner.gif',
    options: {
      onetime: '单次计划',
      daytime: '每日计划',
      weektime: '每周计划',
      monthtime: '每月计划'
    },
    adddate: [],
    adddatedisplay: "请选择",
    duration: null,
    timingstate: 'static',
    differtime: null,
    internaltime: null,
    displaydiff: '0小时0分钟0秒'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    wx.getStorage({
      key: this.options.name,
      success(res) {
        let mydata = res.data;
        mydata.plan = that.data.options[that.options.type]; //类型
        mydata.type = mydata.type + '.png'
        that.setData(mydata);

        if (that.data.starttime) { //如果有，说明正在计时，计算显示时间
          function calcudiff() {
            let starttime = moment(that.data.starttime);
            let internaltime = moment(that.data.internaltime);
            let differtime = internaltime.diff(starttime, 'seconds');
            differtime = moment.duration(differtime, 'seconds')
            let hours = Math.floor(differtime.asHours()) //2
            let minute = Math.floor(differtime.asMinutes()) - hours * 60 //121
            let second = Math.floor(differtime.asSeconds()) - minute * 60 //7261s
            let fdiffer = hours + '小时' + minute + '分钟' + second + '秒';
            console.log(fdiffer);
            that.setData({
              displaydiff: fdiffer,
              differtime: differtime
            })
          }

          getApp().globalData.timer = setInterval(calcudiff, 1000);
          console.log(getApp().globalData.timer);
          that.setData({//改变按钮状态
            timingstate: 'start'
          })
        }
      }
    });

    function Internaltime() {
      let internaltime = moment();
      that.setData({
        internaltime: internaltime
      })
    };
    setInterval(Internaltime, 1000);
 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(getApp().globalData.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onConfirm: function(e) {
    let that = this;
    let achievevalue = e.detail.value;
    console.log(e);
    console.log(achievevalue, 'achieve')
    wx.showModal({
      title: '确认添加到投入时间吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          let docid = that.data._id;
          if (that.data.plan === '单次计划') {
            let currentdocument = db.collection('onetime').doc(docid)
            currentdocument.get().then(
              res => {
                console.log(res);
                let oringintime;
                res.data.duration ? (oringintime = res.data.duration) : (oringintime = [0, 0]);
                let hours = parseInt(achievevalue[0]);
                let minutes = parseInt(achievevalue[1]);
                let jinw;
                ((oringintime[1] + minutes) >= 60) ? (jinw = 1) : (jinw = 0);
                let newminutes, newhours;
                jinw === 1 ? (newminutes = oringintime[1] + minutes - 60) : (newminutes = oringintime[1] + minutes)
                jinw === 1 ? (newhours = oringintime[0] + hours + 1) : (newhours = oringintime[0] + hours)
                let fresult = [newhours, newminutes];
                console.log(fresult);
                currentdocument.update({ 
                    data: {
                      duration: fresult
                    }
                  })
                  .then(res => {
                    console.log(res);
                    that.setData({
                      duration: fresult
                    })
                    $wuxToptips().success({
                      hidden: false,
                      text: `成功增加${achievevalue[0]}小时${achievevalue[1]}分钟`,
                      duration: 3000,
                      success() {},
                    })
                  })
                  .catch(e => {
                    console.log(e);
                    wx.showToast({
                      title: String(e),
                      icon:none
                    })
                  })
              }
            ).catch(e => wx.showToast({
              title: String(e),
              icon:none
            }))
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delplan: function(e) {
    console.log(e);
    let that = this;
    let docid = that.data._id;
    wx.showModal({
      title: '是否确认删除此计划？',
      success: function(res) {
        if (res.confirm) {
          let docid = that.data._id;
          if (that.data.plan === '单次计划') {
            let currentdocument = db.collection('onetime').doc(docid);
            currentdocument.remove().then(
              res => {
                console.log(res);
                wx.showModal({
                  title: '删除成功',
                  showCancel: false,
                  success: function(res) {
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }
                })
              }
            ).catch(e => {
              wx.showToast({
                title: String(e),
                icon:none
              })
            })
          }
        } else if (res.cancel) {}
      },

    })
  },
  remind: function() {
    wx.showToast({
      title: '功能正在开发',
    })
  },
  toTiming: function(e) {
    let that = this;
    let docid = that.data._id;
    if (this.data.timingstate === 'static') {
      let starttime = moment();

      function calcudiff() {
        let internaltime = moment(that.data.internaltime);
        let differtime = internaltime.diff(starttime, 'seconds');
        differtime = moment.duration(differtime, 'seconds')
        let hours = Math.floor(differtime.asHours()) //2
        let minute = Math.floor(differtime.asMinutes()) - hours * 60 //121
        let second = Math.floor(differtime.asSeconds()) - minute * 60 //7261s
        let fdiffer = hours + '小时' + minute + '分钟' + second + '秒'
        that.setData({
          displaydiff: fdiffer,
          differtime: differtime
        })
      }
      getApp().globalData.timer = setInterval(calcudiff, 1000);

      this.setData({
        timingstate: 'start',
      });

      //入库
      if (that.data.plan === '单次计划') {
        let currentdocument = db.collection('onetime').doc(docid);
        console.log(starttime);
        starttime=starttime.format('YYYY-MM-DD HH:mm:ss')
        currentdocument.update({
            data: {
              starttime: starttime//点开始入库starttime ，重新加载拉取数据库
            }
          })
          .then(res => {
            console.log(res);
            $wuxToptips().success({
              hidden: false,
              text: `数据库已记录此次计时`,
              duration: 3000,
              success() {
                that.setData({
                  starttime:starttime
                })
              },
            })
          })
          .catch(e => {
            console.log(e);
            wx.showToast({
              title: String(e),
              icon:none
            })
          })

      }
    } else {//计时状态-----------------
      let differtime = that.data.differtime;//取需要增加时间 
      let duration = this.data.duration;//累计时间
      this.setData({
        timingstate: 'static',
        displaydiff: '0小时0分钟0秒'
      }) //清空starttime字段 //清空timer //更新时间duration 
      clearInterval(getApp().globalData.timer);
      if (that.data.plan === '单次计划') {
        let currentdocument = db.collection('onetime').doc(docid);
        //此时肯定有startime 
        let starttime = that.data.starttime;
        that.setData({
          starttime:null
        }); 
        //获取以前累计时间，把differtime加上 入库更新时间
  
        if(!duration){
          duration=[0,0]
        }
        //换成秒
        let duringsecond=duration[0]*60*60+duration[1]*60;
        let toast=differtime;
        let disphour=Math.floor(toast.asHours());
        let dispminute=Math.floor(toast.asMinutes())-disphour*60
        differtime = differtime.asSeconds();
        let tmp =differtime+duringsecond;
        duringsecond=moment.duration(tmp,'seconds');
        let hours = Math.floor(duringsecond.asHours());
        let minutes=Math.floor( duringsecond.asMinutes()-hours*60);
        that.setData({
          duration:[hours,minutes]
        });
        currentdocument.update({
          data:{
            duration: [hours, minutes],
            starttime: null
          }
        }).then(res=>{
          $wuxToptips().success({
            hidden: false,
            text: `成功增加${disphour}小时${dispminute}分钟`,
            duration: 3000,
            success() {
            }
          })
          }).catch(e => {
            console.log(e);
            wx.showToast({
              title: String(e),
              icon: none
            })
          })
          

      }
    }

  }
})