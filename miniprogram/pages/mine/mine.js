const app = getApp()
import { fetch } from '../../utils/fetch'
Page({
  data: {
    currentPoint: null,
    userId: app.globalData.userInfo.userId,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    punchGoalList: null,
    slideButtons: [
      {
        text: '修改',
        data: 'edit',
      },
      {
        type: 'warn',
        data: 'delete',
        text: '删除',
      },
    ],
    slideView: false,
    slideViewBoundary: null,
    isFirstStepDone: true,
    isSecondStepDone: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'), // 如需尝试获取用户信息可改为false
  },
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
    this.getCurrentPoint()
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res, '1111111')
        fetch({
          url: 'login',
          method: 'POST',
          data: { userInfo: res.userInfo },
        }).then((res) => {
          console.log(res, '2222')
          app.toast(res.msg)
          if (res.code !== 200) return
          wx.setStorageSync('userInfo', res.data)
          app.globalData.userInfo = res.data
          app.event.emit('login')
          this.setData({ userInfo: res.data, hasUserInfo: true })
          this.getData(res.data.userId)
        })
      },
    })
  },
  getData(userId) {
    fetch({
      url: 'punchgoals',
      method: 'GET',
      data: { userId },
    }).then((res) => {
      for (const item of res.data.list) {
        if (item.endTime && new Date(item.endTime) < new Date()) {
          item.isEnd = true
        }
      }
      this.setData({ punchGoalList: res.data.list })
    })
  },
  getCurrentPoint() {
    if (this.data.userId) {
      fetch({
        url: 'point',
        method: 'GET',
        data: { userId: this.data.userId },
      }).then((res) => {
        console.log(res.data.data, '111')
        if (res.code == '200' && res.data && res.data.data) {
          this.data.currentPoint =
            res.data.data.length > 0 ? res.data.data[0].point : null
        }
        this.setData({ currentPoint: res.data.data[0].point })
      })
    }
  },
  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: (res) => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: (err) => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      },
    })
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole',
            })
          },
          fail: (e) => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          },
        })
      },
      fail: (e) => {
        console.error(e)
      },
    })
  },
  gotoMyTask: function () {
    console.log('1')
    wx.navigateTo({
      url: '../myTask/myTask',
    })
  },
})
