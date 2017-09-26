const app = getApp()


Page({
  data: {
    inputShowed: false,
    inputVal: "",
    pageNum: 0,
    pageCount: 20,
    areaid:null
  },
  onLoad: function (options) {
    this.setData({ areaid: options.areaid});
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var self = this;
    this.setData({
      inputVal: e.detail.value
    });
    wx.request({
      url: 'https://www.sharetasty.com:8443/client/NewCommunityService/searchNotesByKeyword3',
      data: {
        type: 0,
        token: app.globalData.token,
        pageNum: self.data.pageNum,
        pageCount: self.data.pageCount,
        areaid: self.data.areaid,
        isFuzz:1
      },
      success: function (res) {
        console.log(res,"搜索接口")
      }
    })
  }
});