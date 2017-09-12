// pages/selectCity/selectCity.js
var app = getApp();

var cityData = require('citydata.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        citysData: cityData.citysData,
        provinces: [],
        citys: [],
        areas: [],
        value: [0, 0, 0],
        name: '',
        show: false
    },
    initData: function () {
        var provinces = [];
        var citys = [];
        var areas = [];

        this.data.citysData.forEach(function (province, i) {
            provinces.push(province.name);
            if (i === 0) {
                citys.push(province.citys[i].name);
                areas = province.citys[i].areas;
            }
        });

        this.setData({
            provinces: provinces,
            citys: citys,
            areas: areas
        });
    },
    bindChange: function (e) {
        var citysData = this.data.citysData;
        var value = this.data.value;
        var current_value = e.detail.value;
        var citys = [];

        var provinceObj = {};
        var cityObj = {};

        provinceObj = citysData[current_value[0]];

        if (value[0] !== current_value[0]) {
            // 滑动省份
            provinceObj.citys.forEach(function (v) {
                citys.push(v.name);
            });
            this.setData({
                citys: citys
            });

            cityObj = provinceObj.citys[0];
            this.setData({
                areas: cityObj.areas,
                value: [current_value[0], 0, 0]
            });

        } else if (value[0] === current_value[0] && value[1] !== current_value[1]) {
            // 滑动城市
            if (current_value[1] >= provinceObj.citys.length) {
                // 数据不存在 跳过
                return;
            }
            cityObj = provinceObj.citys[current_value[1]];
            this.setData({
                areas: cityObj.areas,
                value: [current_value[0], current_value[1], 0]
            });
        } else {
            // 滑动区县
            cityObj = provinceObj.citys[current_value[1]];
            this.setData({
                value: current_value
            });
        }

        this.setData({
            name: provinceObj.name + '-' + cityObj.name + '-' + cityObj.areas[this.data.value[2]]
        });
    },
    setLoading: function () {

        this.data.show?this.setData({ show: false }):this.setData({ show: true });
        console.log(this.data.show)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initData();
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