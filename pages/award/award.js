// pages/award/award.js
let canRoll = true, //加控制，防止用户点击两次
  num = 1, //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转
  lotteryArrLen = 0, //放奖品的数组的长度
  lottery = ['奖品1', '奖品2', '奖品3']; //放奖品
var context = wx.createCanvasContext('firstCanvas')
var colors = ['#9e9bd2', '#f7a172', '#F1A68E', '#a3d8d6', '#a035b6', '#3A97EA', '#FAA167', '#63CA97', '#9A50B3'];
Page({
  data: {
    circleList: [], //圆点数组
    awardList: [{name: '拍立得套装',color: colors[0]},
    {
      name: '旅行便携套装',
      color: colors[1]
    },
    {
      name: '1000金币',
      color: colors[2]
    },
    {
      name: '400金币',
      color: colors[3]
    },
    {
      name: '50金币',
      color: colors[4]
    }
    ], //奖品数组
    colorCircleFirst: '#FFDF2F', //圆点颜色1
    colorCircleSecond: '#FE4D32' //圆点颜色2
  },
  onReady: function(e) {
   
    var that = this;
    //定义人名和对应的颜色
    var data = this.data.awardList;
    // 使用 wx.createContext 获取绘图上下文 context
    var rale = wx.getSystemInfoSync().windowWidth / 750
    var len = data.length;
    var angle = 360 / len;
    var w = 750 * rale
    var h = 750 * rale
    var radius = 300 * rale
    var ctx = context;
    for (var i = 0; i < len; i++) {
      var item = data[i];
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.arc(w / 2, h / 2, radius, angle * i * Math.PI / 180, (angle + angle * i) * Math.PI / 180); //绘制扇形，注意下一个扇形比上一个扇形多一个itemsArc的角度。
      ctx.closePath();
      if (i % 2 == 0) {
        ctx.setFillStyle("#FBF1A9");
      } else {
        ctx.setFillStyle("#fbb936");
      }
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.setFontSize(12); //设置文字字号大小
      ctx.setFillStyle("#fff"); //设置文字颜色
      ctx.setTextAlign("center"); //使文字垂直居中显示
      ctx.setTextBaseline("middle"); //使文字水平居中显示
      ctx.translate(w / 2, h / 2); //将原点移至圆形圆心位置
      ctx.rotate((angle * (i + 2) - 20) * Math.PI / 180); //旋转文字，从 i+2 开始，因为扇形是从数学意义上的第四象限第一个开始的，文字目前的位置是在圆心正上方，所以起始位置要将其旋转2个扇形的角度让其与第一个扇形的位置一致。
      ctx.fillText(item.name, 0, -(h / 2 * 0.8));
      ctx.restore(); //保存绘图上下文，使上一个绘制的扇形保存住。
     

    }
    that.loadImage();
    ctx.draw();
  },
  loadImage:function() { //绘制奖品图片，与绘制文字方法一致。

    let that = this;
    let data = this.data.awardList;
    let Num = data.length;
    let angel  = 360 / len;
    let ctx = context;
    for (let i = 0; i < Num; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(w1, h1);
      ctx.rotate(itemsArc * (i + 2) * Math.PI / 180);
      ctx.drawImage("/icons/img/award.jpg", -(w1 * 0.2), -(h1 * 0.6), (w1 * 0.4), (h1 * 0.2));
      ctx.restore();
    }

  },
  onLoad: function(opt) {
    var _this = this;
    //圆点设置，顺时针设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    var zero_point = {
      left: 375,
      top: 375
    }
    var radius = 325
    for (var i = 0; i < 24; i++) {
      var theta = Math.PI / 12 //angel 15 度
      var angel = theta * i
      var small_radius = 10

      topCircle = zero_point.top - radius * Math.cos(angel) - small_radius
      leftCircle = zero_point.left - radius * Math.sin(angel) - small_radius

      circleList.push({
        topCircle: topCircle,
        leftCircle: leftCircle
      });
    }
    this.setData({
      circleList: circleList
    })
    //圆点闪烁
    setInterval(function() {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FE4D32',
        })
      }
    }, 500)
    // this.setPlateData(); //执行设置转盘表面的文字
    // let that = this;
    // let aniData = wx.createAnimation({ //创建动画对象
    //   duration: 2000,
    //   timingFunction: 'ease'
    // });
    // this.aniData = aniData; //将动画对象赋值给this的aniData属性
  },
  setPlateData() { //设置奖品数组
    lotteryArrLen = lottery.length; //获取奖品数组的长度，用来判断
    if (lotteryArrLen < 2) { //数组的奖品只有一个，扩展数组的长度到4
      let evenArr = new Array(4); //创建一个数组，方便操作。
      for (let i = 0; i < 4; i) {
        if (i % 2 == 1) { //这里为什么要取1是为了在默认的界面将指针放在谢谢的地方，防止别人拿着中奖的截图来要奖品
          evenArr[i] = lottery[0]; //将原数组的内容赋值到新的数组
        } else {
          evenArr[i] = '谢谢' //在数组中间隔插入谢谢
        }
      }
      lottery = [...evenArr]; //将整合好的数组赋值给lottery数组
    } else { //数组中的奖品超过1个，则正常扩展数组，扩展的数组为原来的2倍
      let dataLen = 0; //用来放原来数组的索引
      let evenArr = new Array(lotteryArrLen * 2); //创建扩展数组
      for (let i = 0; i < (lotteryArrLen * 2); i) {
        if (i % 2 == 1) {
          evenArr[i] = lottery[dataLen]; //将原来数组的值赋值给新数组
          dataLen; //原来数组的索引加一
        } else {
          evenArr[i] = '谢谢'
        }
      }
      lottery = [...evenArr]; //将整合好的数组赋值给lottery数组
    }

    lotteryArrLen = lottery.length; //获取新的数组长度
    this.setData({
      lottery: lottery //设置好值，用于页面展示
    })
  },
  startRollTap() { //开始转盘
    let that = this;
    if (canRoll) {
      canRoll = false;
      let aniData = this.aniData; //获取this对象上的动画对象
      let rightNum = ~~(Math.random() * lotteryArrLen); //生成随机数
      console.log(`随机数是${rightNum}`);
      console.log(`奖品是：${lottery[rightNum]}`);
      aniData.rotate(3600 * num - 360 / lotteryArrLen * rightNum).step(); //设置转动的圈数
      this.setData({
        aniData: aniData.export()
      })
      num;
      canRoll = true;
    }
  }
})