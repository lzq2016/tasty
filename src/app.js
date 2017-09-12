//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        var self = this;

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            console.log(res.userInfo, "userinfo");

                            // 登录
                            wx.login({
                                success: res => {
                                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                    if (res.code) {
                                        // wx.request({
                                        //     url: 'https://api.weixin.qq.com/sns/jscode2session',
                                        //     data: {
                                        //         appid: "wx5594f96e8f1d7639",
                                        //         secret: "29332ca8353c013c14ab74e1e7714bc1",
                                        //         js_code: res.code,
                                        //         grant_type: "authorization_code"
                                        //     },
                                        //     success: function (res) {
                                        //         console.log(res);
                                        //     }
                                        // }),
                                        wx.request({
                                            url: 'https://www.sharetasty.com:8443/client/UserService/userLoginByOther4',
                                            data: {
                                                type: "weixing",
                                                otherId: res.code,
                                                headPortrait: this.globalData.userInfo.avatarUrl,
                                                nickname: this.globalData.userInfo.nickName
                                            },
                                            success: function (res) {
                                                self.globalData.token = res.data.result.token;
                                                self.globalData.id = res.data.result.id;
                                            }
                                        })
                                    } else {
                                        console.log('获取用户登录态失败！' + res.errMsg)
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    onShow: function (options) {
        // Do something when show.
    },
    onHide: function () {
        // Do something when hide.
    },
    onError: function (msg) {
        console.log(msg)
    },
    globalData: {
        userInfo: null,
        token: null,
        id: null,
        openId:null
    }
})