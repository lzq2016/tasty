const app = getApp()


Page({
  data: {
    inputShowed: false,
    inputVal: "",
    pageNum: 0,
    pageCount: 20,
    areaid: null,
    list: []
  },
  onLoad: function (options) {
    this.setData({ areaid: options.areaid });
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
      url: 'https://www.sharetasty.com/client/NewCommunityService/searchNotesByKeyword3',
      data: {
        type: 0,
        token: app.globalData.token,
        pageNum: self.data.pageNum,
        pageCount: self.data.pageCount,
        areaid: self.data.areaid,
        isFuzz: 1,
        keyword: self.data.inputVal
      },
      success: function (res) {
        console.log(res, "搜索接口")
        if (res.data.result) {
          self.setData({
            list: res.data.result
          });
        }
      }
    })
  },
  getSearchResult: function (e) {
    console.log(e.currentTarget.dataset.id)
    var self = this;
    // app.globalData.searchResult = 1;
    self.data.list.forEach(function (item) {
      if (item.note_id == e.currentTarget.dataset.id)
      { 
        app.globalData.searchResult = item;
      }
    });
  }
});