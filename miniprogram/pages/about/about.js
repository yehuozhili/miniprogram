Component({
  //页面将tabBar中的selected记录值更改，达到tabBar页面跳转图标更换
  pageLifetimes: {
    show() {
      this.getTabBar().setData({
        selected: 3
      });

      this.mybind= function() {
        wx.previewImage({
          urls: ['https://img-blog.csdnimg.cn/20190803192211412.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3llaHVvemhpbGk=,size_16,color_FFFFFF,t_70'],
        })
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
  },
 
})