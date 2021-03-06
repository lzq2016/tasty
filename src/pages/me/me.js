// pages/me/me.js
//获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        user: {},
        collect_notes: [],
        imgWidth: 200,
        imgHeight: 200,
        pageNum:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self = this;
        // self.userInfo = app.globalData.userInfo;
        // this.setData({ userInfo: app.globalData.userInfo });
        // console.log(self.userInfo);
        (Date.parse(new Date()) / 1000) < 1512007287 && wx.getSystemInfo({
            success: (res) => {
                console.log(res.windowWidth, "页面宽度")
                console.log(res.windowHeight, "页面高度")
                self.setData({
                    imgWidth: (res.windowWidth - 10) / 3 + "px",
                    imgHeight: res.windowHeight * 0.25 + "px"
                });
            }
        })
        wx.request({
            url: 'https://www.sharetasty.com/client/UserService/searchUserById',
            data: {
                token: app.globalData.token,
                user_id: app.globalData.id,
                pageNum: 0,
                pageCount: 20
            },
            success: function (res) {
                console.log(res.data.result, "me")
                self.setData({ user: res.data.result.user })
                self.setData({ collect_notes: res.data.result.collect_notes })
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
        var self = this;
        self.setData({ pageNum: 1 });
        wx.request({
            url: 'https://www.sharetasty.com/client/UserService/searchUserById',
            data: {
                token: app.globalData.token,
                user_id: app.globalData.id,
                pageNum: 0,
                pageCount: 20
            },
            success: function (res) {
                console.log(res.data.result, "me")
                self.setData({ user: res.data.result.user })
                self.setData({ collect_notes: res.data.result.collect_notes })
            }
        })
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
        var self = this;
        // wx.request({
        //     url: 'https://www.sharetasty.com/client/UserService/searchUserById',
        //     data: {
        //         token: app.globalData.token,
        //         user_id: app.globalData.id,
        //         pageNum: 0,
        //         pageCount: 20
        //     },
        //     success: function (res) {
        //         console.log(res.data.result, "me")
        //         self.setData({ user: res.data.result.user })
        //         self.setData({ collect_notes: res.data.result.collect_notes });
        //         wx.stopPullDownRefresh();
        //     }
        // })
        wx.stopPullDownRefresh();

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      var self = this;
      wx.request({
        url: 'https://www.sharetasty.com/client/UserService/searchUserById',
        data: {
          token: app.globalData.token,
          user_id: app.globalData.id,
          pageNum: self.data.pageNum,
          pageCount: 20
        },
        success: function (res) {
          console.log(res,"res")
          self.setData({ pageNum: self.data.pageNum+1});
          var img = [];
          console.log(self.data.collect_notes, "self.data.collect_notes")
          self.data.collect_notes.forEach(function(item){
            img.push(item);
          });
          console.log(img,"img");
          res.data.result.collect_notes && res.data.result.collect_notes.forEach(function(item){
            img.push(item);
          });
          self.setData({ collect_notes: img })
        }
      })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})