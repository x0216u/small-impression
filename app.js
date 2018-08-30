//app.js
App({
  onLaunch: function () {
    console.info("APP.启动");
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {

        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  //index 页面调用
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo && this.globalData.openid) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //获取缓存数据
      var globalData = wx.getStorageSync("globalData");
      if (false && globalData) {
        getApp().globalData = globalData;
        typeof cb == "function" && cb(globalData.userInfo);
        console.info("已获取缓存");
      }
      else {
        //调用登录接口
        wx.login({
          success: function (loginres) {
            console.info("loginres.code=" + loginres.code);
            if (loginres.code) {

              wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                  console.log(res.userInfo)
                  that.globalData.userInfo = res.userInfo;
                  that.globalData.userInfo.encryptedData = res.encryptedData;//
                  that.globalData.userInfo.iv = res.iv;//
                  that.globalData.userInfo.code = loginres.code == null ? "" : loginres.code;

                  typeof cb == "function" && cb(that.globalData.userInfo);

                  that.getOpenid(res.encryptedData, res.iv, loginres.code);
                }
              })//end of wx.getUserInfo
            }
            else {
              console.log("false")
            }
          }
        });
      }
    }
  },

  getOpenid: function (encryptedData, iv, code) {
    var uinfo = this.globalData.userInfo;
    wx.request({
      url: getApp().globalData.appHost + '/getOpenid.aspx',
      data: { "encryptedData": encryptedData, "iv": iv, "code": code },
      method: 'GET',
      success: function (res) {
        //保存openid和portalid
        getApp().globalData.openid = res.data.openid;
        console.info("获取到OpenId res.data.openid=" + res.data.openid);
        getApp().globalData.portalid = res.data.portalid;
        //缓存数据globalData
        var globalData = {
          userInfo: uinfo,
          openid: res.data.openid,
          portalid: res.data.portalid, //服务器端用户id
          appHost: 'https://www.healthcloud.net.cn/portal/tapi',
        }
        wx.setStorageSync("globalData", globalData);
        console.info("已缓存globalData")
      },
    })
  },

  getToken: function () {
    var token = getApp().globalData.token;
    if (token == null) {
      token = "12345678901234567890000";
    }
    return token;
  },

  globalData: {
    userInfo: null,
    openid: null,
    portalid: null, //服务器端用户id
    token: null,
    appByClinicId: 0,
    appVersion: "1.0.0",
    appHost: 'https://www.healthcloud.net.cn/portal/tapi',
  }
})