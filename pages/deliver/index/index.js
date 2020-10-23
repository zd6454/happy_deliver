// pages/deliver/index/index.js
var amapFile = require('../../../utils/amap-wx.js');
var startPoint;
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var key='6N7BZ-Z6533-RVL3F-YY3R2-O6MKT-BTFE6';
var  qqmapsdk = new QQMapWX({
  key:key
});
const mapCtx = wx.createMapContext('myMap');
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
    polyline: [],
    latitude:"39.989643",
    longitude:"116.481028",
    staticmapUrl:"",
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
    let that=this;
  this.getCenterLocation();
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy
      console.log(res,"88");
      that.setData({
       latitude:latitude,
       longitude:longitude,
      })
       that.moveToLocation(longitude,latitude);
    }
  })
  const{isDeliver}=this.data;

  const text=!isDeliver?"卸货":"派送";
  this.setData({isDeliver:!isDeliver,buttomtext:text});
   if(isDeliver){
     wx.navigateTo({
       url: '../unload/unload',
     })
   }
  },
  //获取静态地图
  getStaticMap(){
    let that=this;
    const {markers}=this.data;
    var myAmapFun = new amapFile.AMapWX({key:'	d761d2b7544fb04ddf783a0196fab4d3'});
    myAmapFun.getStaticmap({
      zoom:3,
      markers:markers,
      traffic:1,
      success:res=>{
        console.log(res,"staticmap");
        that.setData({
          staticmapUrl:res.url,
        })
      },
      fail:err=>{
       console.log(err,"staticmap");
      }
    })
  },
  //地图划线操作高德版
  drawline(){
    var that = this;
    const {latitude,longitude}=this.data;
    const extensions="extensions=all&";
    const origin='origin='+longitude+','+latitude+'&';
    const destination='destination=116.408775,39.90816&';
    const key='key=6fa11bd81ec9556c0182ee27e1c61328'
    const hight='hight=1.6&';
    const load='load=0.9&';
    const waypoints='waypoints=116.481028,39.8000&';
    const url= 'https://restapi.amap.com/v3/direction/driving?&strategy=9&'
    +origin+waypoints+destination+extensions+key;
    wx.request({
      url: url,
      success:res=>{
        console.log(res,"data2")
        var points = [];
        const data=res.data.route;
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
      }
    })
  },
  
  getCenterLocation: function () {
    mapCtx.getCenterLocation({
      success: function(res){
        console.log(res,"center")
      },
      fail:err=>{
        console.log(err);
      }
    })
  },
  moveToLocation: function (t1,t2) {
    let that=this;
    that.drawline();
    mapCtx.moveToLocation({
      longitude:t1,
      latitude:t2,
      success:res=>{
        console.log(res,"success");
      },
      faile:err=>{
        console.log(err);
      },
      complete:res=>{
        console.log(res);
      }
    })
  },
  translateMarker: function() {
    mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude:23.10229,
        longitude:113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude:23.10229,
        longitude:113.3345211,
      }, {
        latitude:23.00229,
        longitude:113.3345211,
      }]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
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
   this.getStaticMap();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.getStaticMap();
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