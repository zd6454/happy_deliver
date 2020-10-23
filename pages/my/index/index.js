// pages/my/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {myinfo:"我的信息",url:"../info/info",icon:"../../../icons/info.png"},
      {myinfo:"异常订单",url:"../bad_order/bad_order",icon:"../../../icons/bad_order.png"},
      {myinfo:"我的轨迹",url:"",icon:"../../../icons/tranc.png"},
      {myinfo:"我的车号",url:"../my_number/my_number",icon:"../../../icons/number.png"},
    ],
    index:0,
    avatarUrl:"",
  },
  switchto(e){
   const{items}=this.data;
   const{index}=e.target.dataset;
   wx.navigateTo({
     url: items[index].url,
   })
  },
  getAvatar(){
    wx.cloud.getTempFileURL({
      fileList: ['cloud://happy-deliver-n19h9.6861-happy-deliver-n19h9-1303910703/user_avatar/1111.jpg'],
      success: res => {
        // get temp file URL
        console.log(res.fileList)
        this.setData({
          avatarUrl:res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getAvatar();
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

  }
})