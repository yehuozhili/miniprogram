const app = getApp();
Component({
  //数据
  data: {
    selected: 0,//当前tabBar页面
    color: "##2c2c2c",//未选中tabBar时的文字颜色
    selectedColor: "#d4237a",//选中时tabBar文字颜色
    addImgPath: '/pages/images/add.png',//添加发布图标
    // tabBar对象集合
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/pages/images/time1.png",
        selectedIconPath: "/pages/images/time2.png",
        text: "今天计划"
      },
      {
        pagePath: "/pages/myProject/myProject",
        iconPath: "/pages/images/list1.png",
        selectedIconPath: "/pages/images/list2.png",
        text: "我的计划"
      },
      {
        pagePath: "/pages/analyseView/analyseView",
        iconPath: "/pages/images/analyse1.png",
        selectedIconPath: "/pages/images/analyse2.png",
        text: "统计查看"
      },
      {
        pagePath: "/pages/about/about",
        iconPath: "/pages/images/about1.png",
        selectedIconPath: "/pages/images/about2.png",
        text: "关于作者"
      }
    ]
  },

  methods: {
    // tabBar切换事件
    tab_bar_index(e) {
      const url = e.currentTarget.dataset.path
      wx.switchTab({ url })
    },
    

    // 发布添加按钮跳转
    tab_bar_add() {
      var url = "/pages/addMission/addMission"
      wx.navigateTo({ url })
    }
  }

 
})