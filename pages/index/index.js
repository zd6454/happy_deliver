//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
  chooseTime:0,
  isLogin:false,
  name:"",
  password:"",
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
  getname(e){
    console.log(e);
    const name=e.detail.value;
    this.setData({ name:name })
  },
  getpasswork(e){
    const password=e.detail.value;
    this.setData({password:password})
  },
  login(){
    const{name,password}=this.data;
  
    db.collection("users").where({
      name:name,
    }).get({
      success:res=>{
        console.log(res);
        if(res.data.length==0){
          wx.showModal({
            title:"账号或密码错误"
          })
        }else{
          wx.switchTab({
            url: '../deliver/index/index',
          })
        }
      },
      fail:err=>{console.log(err)},
    })
  
  
  },
  onLoad: function () {
  
  },
  
})
