// pages/addMission/addMission.js
import { $wuxCalendar, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index';
const moment = require('../../utils/moment.min.js');
const rule =(value)=>(value?false:true);
const db = wx.cloud.database();
let  today=moment().format("YYYY-MM-DD");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current:[],
    list:[
      { text:'仅展示使用'},
      { text:'仅展示使用'},
      { text:'仅展示使用'},
      { text:'仅展示使用'}
    ],
    value0: null,
    typelist:[
      {
        value:'work',
        label: '工作'
      },{
        value: 'study',
        label: '学习'
      },{
        value: 'sleep',
        label: '睡觉'
      }, {
        value: 'eat',
        label: '吃饭'
      }, {
        value: 'meeting',
        label: '开会'
      }, {
        value: 'physical',
        label: '锻炼'
      }, {
        value: 'entertainment',
        label: '娱乐'
      },{
        value: 'commuting',
        label: '通勤'
      }, {
        value: 'other',
        label: '其他'
      }
    ],
    typevalue:[],
    typedisplayvalue:'请选择',
    text0:null,
    calendarValue0:[],
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
    // let date = moment().format('YYYY-MM-DD HH:mm');
    // let myyear = moment().year()+30;
    // let maxdate = moment().year(myyear).format('YYYY-MM-DD HH:mm');
    // this.setData({
    //   minDate:date,
    //   maxDate:maxdate
    // })
    console.log(this)
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
  onLoad() {

  },

  onChange(e) {
    this.setData({
      error: rule(e.detail.value),
      value0: e.detail.value,
    })
  },
  onError() {
    wx.showModal({
      title: '计划名称不能为空',
      showCancel: !1,
    })
  },
  textChange(e){
    this.setData({
      text0: e.detail.value,
    })
  },
  openCalendar() {
    const now = new Date()
    const minDate = now.getTime()-24*60*60*1000
    $wuxCalendar('#wux-calendar').open({
      value: this.data.calendarValue0,
      minDate,
      onChange: (values, displayValues) => {
        this.setData({
          calendarValue0: displayValues
        })
      },
    })
  },
  onSubmit(e) {
    if (!this.data.value0 || this.data.calendarValue0.length === 0||this.data.typevalue.length===0){
      $wuxToptips('#wux-toptips1').error({
        hidden: false,
        text: '计划名称，类型，选择日期不能为空',
        duration: 3000,
        success() { },
      })
      return
    }
    let openid = getApp().globalData.openid;
    if(!openid){
      wx.showModal({
        title: '未获取到openid',
        content: '请重新授权',
        showCancel:false,
        success(){
          wx.redirectTo({
            url: '/pages/auth/auth',
          })
        }
      })
    }
    let calendarvalue = this.data.calendarValue0[0];
    let senddata = {
      openid:openid,
      title:this.data.value0,
      type :this.data.typevalue[0],
      text :this.data.text0,
      calendar:calendarvalue,
      duration:null,
      starttime:null,
    }
    console.log(senddata);
    db.collection('onetime').add({
      data:senddata
    }).then(res=>{
      console.log(res);
      if(res.errMsg==='collection.add:ok'){
        wx.showModal({
          title: '插入数据成功',
          content: '',
          showCancel:false,
          success(){
            console.log(calendarvalue,today);
            if(calendarvalue===today){
              wx.switchTab({
                url: '/pages/index/index',
              })
            }else{
              wx.switchTab({
                url: '/pages/myProject/myProject',
              })
            }
         
          }
        })
      }
    }).catch(e=>{console.log(e);wx.showToast({
      title:String(e),
    })})
  },
  typeConfirm0(e){
    this.setData({
      typevalue:e.detail.value,
      typedisplayvalue:e.detail.label
    })
  }
  
})