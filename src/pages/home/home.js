// pages/others/waterfall/waterfall.js
const app = getApp()

var cityData = require('citydata.js');
var cityInit = require('cityInit.js');

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
    citysData: cityData.citysData,
    multiArray: [],
    multiIndex: [0, 0],
    selectCity: "北京"
  },
  bindMultiPickerChange: function (e) {
    var self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    console.log(this.data.multiArray[1][e.detail.value[1]])
    this.setData({ selectCity: self.data.multiArray[1][e.detail.value[1]].name })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        // console.log(data.multiIndex[0], "13333333")
        // console.log(cityData.citysData[data.multiIndex[0]].citys, "121212")
        data.multiArray[1] = cityData.citysData[data.multiIndex[0]].citys;
        break;
    }
    this.setData(data);
  },
  onLoad: function () {
    var self = this;
    this.setData({ multiArray: cityInit.citysData });
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              var latitude = res.latitude
              var longitude = res.longitude
              wx.request({
                url: 'https://apis.map.qq.com/ws/geocoder/v1/',
                data: {
                  location: res.latitude + ',' + res.longitude,
                  key: "O2JBZ-CPCC4-6K6UQ-XPDQJ-4LCPE-NZBWJ",
                  get_poi: 0
                },
                success: function (res) {
                  console.log(res.data.result.ad_info.adcode, "location");
                  // self.globalData.token = res.data.result.ad_info.adcode; 
                  wx.request({
                    url: 'https://www.sharetasty.com:8443/client/NewCommunityService/searchNotesIndex3',
                    data: {
                      type: 1,
                      token: app.globalData.token,
                      pageNum: 0,
                      pageCount: 20,
                      areaid: res.data.result.ad_info.adcode,
                      latitude: latitude,
                      longitude: longitude
                    },
                    success: function (res) {
                      console.log(res.data.result, "1345");
                      var images = [];
                      res.data.result.notes.forEach(function (item) {
                        images.push({
                           pic: item.img_s, 
                           title: item.title, 
                           content: item.content, 
                           headPortrait: item.headPortrait,
                           nickname:item.nickname,
                           count:item.praised_count, 
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
                }
              })
            }
          })
        }
      }
    })
    // if (res.authSetting['scope.userLocation']) {
    //     wx.getLocation({
    //         type: 'wgs84',
    //         success: function (res) {
    //             var latitude = res.latitude
    //             var longitude = res.longitude
    //             wx.request({
    //                 url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    //                 data: {
    //                     location: res.latitude + ',' + res.longitude,
    //                     key: "O2JBZ-CPCC4-6K6UQ-XPDQJ-4LCPE-NZBWJ",
    //                     get_poi: 0
    //                 },
    //                 success: function (res) {
    //                     // console.log(res.data.result.ad_info.adcode,"location");
    //                     // self.globalData.token = res.data.result.ad_info.adcode;                                    
    //                 }
    //             })
    //         }
    //     })
    // }
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
      { pic: "/imagesDemo/1.png", height: 0 },
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
  }

})