// pages/deliver/index/index.js
var amapFile = require('../../../utils/amap-wx.js');
var startPoint;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始派送按钮位置 下同
    buttonTop: 281.59991455078125,  
    buttonLeft: 232.39996337890625,
    windowHeight: '',  
    windowWidth: '',
    //派送
    isDeliver:false,
    buttomtext:"派送",
    //时间
    currentTime:"15:05",//当前时间
    passTime:"30",//已过时间
    lastTime:"16:00",//最晚时间
    //地图路线规划
    markers: [{
      iconPath: "../../../icons/first.png",
      id: 0,
      latitude: 39.989643,
      longitude: 116.481028,
      width: 23,
      height: 33
    },{
      iconPath: "../../../icons/way.png",
      id: 1,
      latitude: 39.90816,
      longitude: 116.434446,
      width: 24,
      height: 34
    },{
      iconPath: "../../../icons/end.png",
      id: 2,
      latitude: 39.8000,
      longitude: 116.408775,
      width: 24,
      height: 34
    }
  ],
    distance: '',
    cost: '',
    polyline: []
    },


  buttonStart: function (e) {
    startPoint = e.touches[0]
  },
  buttonMove: function (e) {
    var endPoint = e.touches[e.touches.length - 1]
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX
    //判断是移动否超出屏幕
    if (buttonLeft+50 >= this.data.windowWidth){
      buttonLeft = this.data.windowWidth-50;
    }
    if (buttonLeft<=0){
      buttonLeft=0;
    }
    if (buttonTop<=0){
      buttonTop=0
    }
    if (buttonTop + 50 >= this.data.windowHeight){
      buttonTop = this.data.windowHeight-50;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
    })
  },
  buttonEnd: function (e) {

  },
  //点击开始派送按钮
  deliverStart:function(){

  const{isDeliver}=this.data;

  const text=!isDeliver?"卸货":"派送";
  this.setData({isDeliver:!isDeliver,buttomtext:text});
   if(isDeliver){
     wx.navigateTo({
       url: '../unload/unload',
     })
   }
  },

  drawline(){
    var that = this;
    // var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({key: 'd761d2b7544fb04ddf783a0196fab4d3'});
    myAmapFun.getDrivingRoute({
      origin: '116.481028,39.989643',
      waypoints:'116.481028,39.8000',
      destination: '116.408775,39.90816',
      success: function(data){
        var points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if(data.paths[0] && data.paths[0].distance){
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if(data.taxi_cost){
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
          
      },
      fail: function(info){

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    this.drawline();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 屏幕宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 高度,宽度 单位为px
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth
        })
      }
    })
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