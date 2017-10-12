// pages/noteDetail/noteDetail.js

const app = getApp()
let col1H = 0;
let col2H = 0;
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
    shoucangImg:"/images/shoucang.png",
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    preImage: [],
    col1: [],
    col2: [],
    loadingShow: false,
    adcode:null,
    bannerImgs:[],
    bannerHeights:[],
    currentBanner:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "options")
    var self = this;
    self.setData({
      note_id: options.note_id,
      adcode: app.globalData.adcode
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.windowWidth,"页面宽度")
        console.log(res.windowHeight,"页面高度")
        self.setData({
          imgWidth: (res.windowWidth-10)/3 + "px",
          imgHeight: res.windowHeight*0.25 + "px",
          titleImgHeight: res.windowHeight * 0.4 + "px",
          titleImgWidth: res.windowWidth
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
        self.setData({ pageNum: self.data.pageNum + 1 });
        var images = [];
        res.data.result.noteList.forEach(function (item) {
          images.push({
            pic: item.img_s,
            title: item.title,
            content: item.content,
            headPortrait: item.headPortrait,
            nickname: item.nickname,
            count: item.praised_count,
            note_id: item.note_id,
            height: 0
          });
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
  bannerLoad: function (e) {
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.titleImgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale + "px";      //自适应高度
    let img = {
      src: e.target.dataset.src,
      width:imgWidth+"px",
      height: imgHeight
    };
    let imgs = this.data.bannerImgs;
    let height = this.data.bannerHeights;
    imgs.push(img);
    height.push(imgHeight);
    this.setData({ 
      bannerImgs:imgs,
      bannerHeights: height
      });
  },
  bindchange: function (e) {
    this.setData({ currentBanner: e.detail.current })
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

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

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
    this.setData({
      loadingShow: true
    });
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
    this.setData({
      loadingShow: false
    });
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