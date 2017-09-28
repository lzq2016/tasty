// pages/findDetail/findDetail.js
const app = getApp()

let col1H = 0;
let col2H = 0;

Page({

  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    preImage: [],
    col1: [],
    col2: [],
    loadingShow: false,
    pageNum: 0,
    pageCount: 20,
    hotTopic_id:null,
    name: "暂无数据",
    content1:"暂无数据"
  },
  onLoad: function (options) {
    var self = this;
    self.setData({ hotTopic_id: options.hotTopic_id});
    wx.request({
      url: 'https://www.sharetasty.com/client/CommunityService/searchHotTopicNotes',
      data: {
        token: app.globalData.token,
        pageNum: self.data.pageNum,
        pageCount: self.data.pageCount,
        hotTopic_id: options.hotTopic_id
      },
      success: function (res) {
        console.log(res.data.result, "热门话题详情页接口");
        self.setData({ pageNum: self.data.pageNum + 1 });
        var images = [];
        res.data.result.forEach(function (item) {
          self.setData({ 
            name: item.name,
            content1:item.content1
             });
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
  loading: function () {

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
    this.setData({
      loadingCount: self.data.preImage.length,
      images: self.data.preImage
    });
  },
  onReachBottom: function () {
    console.log(8888888888)
    var self = this;
    wx.request({
      url: 'https://www.sharetasty.com/client/CommunityService/searchHotTopicNotes',
      data: {
        token: app.globalData.token,
        pageNum: self.data.pageNum,
        pageCount: self.data.pageCount,
        hotTopic_id: self.data.hotTopic_id
      },
      success: function (res) {
        self.setData({ pageNum: self.data.pageNum + 1 });
        var images = [];
        self.data.preImage.forEach(function (item) {
          images.push(item);
        });
        res.data.result.forEach(function (item) {
          images.push({
            pic: item.img_s,
            title: item.title,
            content: item.content,
            headPortrait: item.headPortrait,
            nickname: item.nickname,
            count: item.praised_count,
            height: 0
          });
        });
        self.setData({ preImage: images });
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
  }

})