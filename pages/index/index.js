//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  chooseTime:0,
  isLogin:false,
  },
  chooseFirst(){
  this.setData({
    chooseTime:0,
    isLogin:true,
  })
  },
  chooseSecond(){
    this.setData({
      chooseTime:1,
      isLogin:true,
    })
  },
  onLoad: function () {
  
  },
  
})
