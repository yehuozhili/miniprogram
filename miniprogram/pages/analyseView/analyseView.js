import * as echarts from '../../utils/ec-canvas/echarts';
const moment = require('../../utils/moment.min.js');
const app= getApp()
Component({
    data: {
    ec:{},
    ecBar: {}
  },
  pageLifetimes: {
    show() {
      let that =this;
      console.log(this)
      //饼图
      this.echartInit = function (e) {
        //如果需动态改不能存到setdata里
        app.globalData.pieOption = [e.detail.canvas, e.detail.width, e.detail.height]
      }
      //柱状
      this.barechartInit = function (e) {
        app.globalData.barOption = [e.detail.canvas, e.detail.width, e.detail.height]
      }
      this.getTabBar().setData({
        selected: 2
      });
      console.log('xxc')
       //---------pie----------拉取单次今日计划
      let openid = app.globalData.openid;
      let calendar = moment().format('YYYY-MM-DD')
      let senddata = {
        openid: openid,
        calendar: calendar
      }
      wx.cloud.callFunction({
        name: 'getaddone',
        data: senddata
      }).then(res => {
        let todaydata = res.result.data;
        if (todaydata.length === 0) {//今日单次计划为空
          that.setData({
            piedatanull: 1
          })
        } else {
          that.setData({
            todaydata: todaydata,
            piedatanull: 0
          })
          //piedata=[{value:duration,name:title}]
          let piedata = [];
          for (let i in todaydata) {
            let duration = todaydata[i].duration;
            if (duration) {
              duration = duration[0] * 60 + duration[1];//算成分钟
            } else {
              duration = 0;
            }
            let title = todaydata[i].title+'\n'+duration+'分钟';
            let obj = { value: duration, name: title };
            piedata.push(obj);
          };
          that.setData({
            piedata: piedata
          })
          function initChart(canvas, width, height) {
            const chart = echarts.init(canvas, null, {
              width: width,
              height: height
            });
            canvas.setChart(chart);

            let option = {
              backgroundColor: "#ffffff",
              color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
              series: [{
                label: {
                  normal: {
                    fontSize: 14,
                    rich:{}
                  }
                },
                type: 'pie',
                center: ['50%', '50%'],
                radius: [0, '60%'],
                data: piedata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 2, 2, 0.3)'
                  }
                }
              }]
            };

            chart.setOption(option);
            return chart;
          }
          let pieOption = app.globalData.pieOption;
          initChart(pieOption[0],pieOption[1],pieOption[2]);

        }

      }).catch(e => {
        console.log(e);
        wx.showToast({
          title: String(e),
          icon: 'none'
        })
      });

      //------bar-----
      //索引固定,日期中断不管
      let today = moment().format("YYYY-MM-DD");
      let dateindex = [];
      dateindex.push(today);
      for (let i = 1; i < 8; i++) {
        let tmp = moment().subtract(i, 'days').format("YYYY-MM-DD");
        dateindex.push(tmp);
      }
      let bardata={
        openid:openid,
        dateA:today,
        dateB: dateindex[dateindex.length - 1]
      }
      console.log(bardata);
      wx.cloud.callFunction({
        name:'getaddone7d',
        data:bardata
      }).then(res=>{
        console.log(res);
        let mybardata=res.result.data
        let durationindex=[];//收集时间
        for(let i in dateindex){
          let tmp = 0;//下一个日期tmp重置
          for(let k in mybardata){
            if(dateindex[i]==mybardata[k].calendar){//日期相等
              if(mybardata[k].duration){
                tmp=tmp+mybardata[k].duration[0]*60+mybardata[k].duration[1];//换成分
              }
            }
          }
          durationindex.push(tmp);
        }
        console.log(durationindex);
        console.log(dateindex);

        function initBar(canvas, width, height) {
          function getBarOption() {
            return {
              color: ['#37a2da', '#32c5e9', '#67e0e3'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                data: ['投入分钟']
              },
              grid: {
                left: 20,
                right: 20,
                bottom: 15,
                top: 40,
                containLabel: true
              },
              xAxis: [
                {
                  type: 'value',
                  axisLine: {
                    lineStyle: {
                      color: '#999'
                    }
                  },
                  axisLabel: {
                    color: '#666'
                  }
                }
              ],
              yAxis: [
                {
                  type: 'category',
                  axisTick: { show: false },
                  data: dateindex,
                  axisLine: {
                    lineStyle: {
                      color: '#999'
                    }
                  },
                  axisLabel: {
                    color: '#666'
                  }
                }
              ],
              series: [
                {
                  name: '投入分钟',
                  type: 'bar',
                  label: {
                    normal: {
                      show: true,
                      position: 'inside',
                      rich:{}
                    }
                  },
                  data: durationindex
                }
              ]
            };
          }
          const barChart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          canvas.setChart(barChart);
          barChart.setOption(getBarOption());

          return barChart;
        }

        let barOption = app.globalData.barOption;
        initBar(barOption[0], barOption[1], barOption[2]);


      }).catch(e => {
        console.log(e);
        wx.showToast({
          title: String(e),
          icon: 'none'
        })
      });
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