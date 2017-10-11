// pages/searchResult/searchResult.js
const app = getApp()
let col1H = 0;
let col2H = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    preImage: [],
    col1: [],
    col2: [],
    pageNum: 0,
    pageCount: 20,
    note: null,
    adcode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var images = [];
    self.setData({
      note: app.globalData.searchResult,
      adcode: app.globalData.adcode
    });
    console.log(self.data.note, "note")
    images.push({
      pic: self.data.note.img_s,
      title: self.data.note.title,
      content: self.data.note.content,
      headPortrait: self.data.note.headPortrait,
      nickname: self.data.note.nickname,
      count: self.data.note.praised_count,
      note_id: self.data.note.note_id,
      height: 0
    });
    self.setData({ preImage: images });
    console.log(self.data.preImage, "preimage");
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48
        let scrollH = wh;

        self.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        self.loadImages();
      }
    })

  },
  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    col1H += imgHeight;
    col1.push(imageObj);

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },
  loadImages: function () {
    console.log("loading images")
    var self = this;
    let images = [
      { pic: "/imagesDemo/3.png", height: 0 },
      { pic: "/imagesDemo/2.png", height: 0 },
      { pic: "/imagesDemo/3.png", height: 0 },
      { pic: "/imagesDemo/4.png", height: 0 },
      { pic: "/imagesDemo/5.png", height: 0 },
      { pic: "/imagesDemo/6.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/7.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/8.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/9.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/10.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/11.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/12.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/13.png", height: 0 },
      { pic: "http://lzqrebate.oss-cn-beijing.aliyuncs.com/14.png", height: 0 }
    ];

    let baseId = "img-" + (+new Date());

    // for (let i = 0; i < images.length; i++) {
    //   images[i].id = baseId + "-" + i;
    // }
    for (let i = 0; i < this.data.preImage.length; i++) {
      this.data.preImage[i].id = baseId + "-" + i;
    }
    console.log(self.data.preImage, "preimgs")
    this.setData({
      loadingCount: self.data.preImage.length,
      images: self.data.preImage
    });
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