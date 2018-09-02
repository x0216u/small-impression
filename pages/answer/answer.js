// pages/answer/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wait: 10, //60s 答题时间
    all:1,
    now:0,
    que_type:'单选',
    rightIndex: 'B',
    que_image:'/icons/img/sanya.jpg',
    que_title:'这是三亚哪个景区',
    que_answer: [{ index: 'A', content: '天涯海角', checked:false},
      { index: 'B', content: '大小洞天', checked: false },
      { index: 'C', content: '千古情', checked: false }
    ],
    isWait:true,
    havaChoose:false,
    isAChecked:false,
    isBChecked: false,
    isCChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadTime()
  },
  chooseAnswer:function(event){
    var choose_tag = this.data.havaChoose;
    var isWait = this.data.isWait;
    if (choose_tag || !isWait)
      return;
    var index = event.currentTarget.dataset.index;
    var que_answer = this.data.que_answer;
    var isRgiht = false;
    for (var i = 0; i < que_answer.length;i++){
      var que_index = que_answer[i].index;
      if (index == que_index)
        que_answer[i].checked = true
    }
    this.setData({ que_answer: que_answer, havaChoose: true })
    if (index == this.data.rightIndex){
      this.showRight()
    }
    else{
      this.showError()
    }
    var now = this.data.now + 1;
    this.setData({
      now: now,
      isWait: false
    })

  },
  showRight:function(){
    wx.showToast({
      title: '正确：+100金币',
      icon: 'none',
      duration: 2000
    }) 
  },
  showError: function () {
    wx.showToast({
      title: '错误：+50金币',
      icon: 'none',
      duration: 2000
    })
  },
  showTimer:function(){

  },
  /*
 *读取60秒
 */
  loadTime: function () {
    var that = this;
    var waitSecond = that.data.wait;
    var isWait = that.data.isWait;
    waitSecond--;
    if (waitSecond != 0 && isWait) {
      that.setData({
        wait: waitSecond
      })
      setTimeout(function () {
        that.loadTime()
      }, 1000)
    } else {
      if (isWait){
        var now = that.data.now + 1;
        that.setData({
          wait: 0,
          now:now,
          isWait: false
        })
        that.showError()
      }
    }
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