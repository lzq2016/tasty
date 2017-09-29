// pages/noteDetail/noteDetail.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    note_id: null,
    pageNum: 1,
    pageCount: 20,
    img_s: null,
    nickname: null,
    headPortrait: null,
    title: null,
    content: null,
    look_count: null,
    collect_count: null,
    praise_count: null,
    img_url: [],
    address: null,
    imgWidth:200,
    imgHeight:200,
    titleImgWidth:200,
    titleImgHeight:200,
    autoplay:false,
    shoucangImg:"/images/shoucang.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "options")
    var self = this;
    self.setData({
      note_id: options.note_id
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.windowWidth,"页面宽度")
        console.log(res.windowHeight,"页面高度")
        self.setData({
          imgWidth: (res.windowWidth-10)/3 + "px",
          imgHeight: res.windowHeight*0.25 + "px",
          titleImgHeight: res.windowHeight * 0.4 + "px",
          titleImgWidth: res.windowWidth + "px"
        });
      }
    })
    wx.request({
      url: 'https://www.sharetasty.com/client/NewCommunityService/searchNoteMsgById4',
      data: {
        note_id: self.data.note_id,
        token: app.globalData.token,
        pageNum: self.data.pageNum,
        pageCount: self.data.pageCount,
        areaid: options.areaid
      },
      success: function (res) {
        console.log(res.data.result, "notedetails");
        self.setData({
          img_s: res.data.result.noteMsg.img_s,
          nickname: res.data.result.noteMsg.nickname,
          headPortrait: res.data.result.noteMsg.headPortrait,
          title: res.data.result.noteMsg.title,
          content: res.data.result.noteMsg.content,
          look_count: res.data.result.noteMsg.look_count,
          collect_count: res.data.result.noteMsg.collect_count,
          praise_count: res.data.result.noteMsg.praise_count,
          img_url: res.data.result.noteMsg.img_url.split(","),
          address: res.data.result.noteMsg.address
        })
      }
    })
  },
  shoucang: function (e) {
    var self = this;
    wx.request({
      url: 'https://www.sharetasty.com/client/CommunityService/collectNote',
      data: {
        note_id: self.data.note_id,
        token: app.globalData.token,
        type: 1
      },
      success: function (res) {
        console.log(res, "shoucang");
        if (res.data.resultstate == 1) {
          self.setData({ shoucangImg:"/images/shoucangSelect.png"});
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 3000
          });
        }
        else {
          wx.showToast({
            title: '收藏失败',
            icon: 'success',
            duration: 2000
          });
        }

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