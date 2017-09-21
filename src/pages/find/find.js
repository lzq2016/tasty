

Page({
    data: {
        list: [],
        array: [{
            message: 'foo',
        }, {
            message: 'bar'
        }]
    },
    onLoad: function () {
        var self = this;
        wx.request({
            url: 'https://www.sharetasty.com:8443/client/CommunityService/searchHotTopic',
            data: {
                pageNum: 0,
                pageCount: 10
            },
            success: function (res) {
                console.log(res.data,"发现接口")
                if (res.data.resultstate == 1) {
                    self.setData({list:res.data.result});
                }
            }
        })
    }
})
