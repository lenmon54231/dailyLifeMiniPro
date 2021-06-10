import { fetch } from '../../utils/fetch'
import { formatDate } from '../../utils/formatDate'
const app = getApp()
Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper',
    }
  },
  data: {
    pointData: {
      _id: null,
      userId: app.globalData.userInfo.userId,
      type: null,
    },
    userId: app.globalData.userInfo.userId,
    currentTartget: {
      _id: null,
      userId: app.globalData.userInfo.userId,
      date: formatDate(new Date()),
      allTarget: [],
    },
    background: [],
    quickTabList: [
      { name: '看纪录片', icon: 't-icon-ziyuan13' },
      { name: '知识消化器', icon: 't-icon-ziyuan10' },
      { name: '不纠结', icon: 't-icon-ziyuan12' },
      { name: '记账', icon: 't-icon-ziyuan13' },
      { name: '出错', icon: 't-icon-ziyuan16' },
      { name: '医疗疾病史', icon: 't-icon-ziyuan13' },
    ],
    // 为什么乌鸦像写字台
    // 每一个不曾起舞的日子，都是对生命的辜负
    // 世界上只有一种真正的英雄主义，那就是看清生活的真相之后，依然热爱生活
    taskList: [
      {
        name: '游泳',
        logo: '',
        url: 'https://limengtupian.oss-cn-beijing.aliyuncs.com/picDemo/ls1.jpg',
        time: formatDate(new Date()),
        type: 1,
        disabled: false,
      },
      {
        name: '吉他',
        logo: '',
        url: 'https://limengtupian.oss-cn-beijing.aliyuncs.com/picDemo/lg1.jpg',
        time: formatDate(new Date()),
        type: 2,
        disabled: false,
      },
      {
        name: '阅读',
        logo: '',
        url: 'https://limengtupian.oss-cn-beijing.aliyuncs.com/picDemo/lr1.jpg',
        time: formatDate(new Date()),
        type: 3,
        disabled: false,
      },
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
  },
  onLoad: function (options) {
    this.innitBC()
    this.getCurrentTarget()
    this.getCurrentPoint()
  },
  innitBC() {
    let bcTem = []
    let randomTime = 4
    let fileName = [
      { name: 'guitar', num: '6' },
      { name: 'ikon', num: '9' },
      { name: 'swim', num: '12' },
    ]
    let baseOssUrl = 'https://limengtupian.oss-cn-beijing.aliyuncs.com/picDemo/'
    for (let i = 0; i < randomTime; i++) {
      let finalUrl = ''
      let fileNameIndex = this.getRandomNumberByRange(0, 2)
      let currentFile = fileName[fileNameIndex]
      let num = this.getRandomNumberByRange(1, currentFile.num)
      finalUrl =
        baseOssUrl +
        currentFile.name +
        '/' +
        currentFile.name.substr(0, 1) +
        num +
        '.jpg'
      if (this.isPicRepeat(finalUrl, bcTem)) {
        randomTime++
      } else {
        bcTem.push(finalUrl)
      }
    }
    console.log(bcTem, '1111111')
    this.setData({
      background: bcTem,
    })
  },
  getCurrentPoint() {
    fetch({
      url: 'point',
      method: 'GET',
      data: { userId: this.data.userId },
    }).then((res) => {
      console.log(res.data.data, '111')
      if (res.code == '200' && res.data && res.data.data) {
        this.data.pointData._id =
          res.data.data.length > 0 ? res.data.data[0]._id : null
      }
    })
  },
  getCurrentTarget() {
    wx.showLoading({})
    fetch({
      url: 'punchgoals',
      method: 'get',
      data: {
        date: formatDate(new Date()),
        userId: this.data.userId,
      },
    })
      .then((res) => {
        if (res.code == '200') {
          let tem = JSON.parse(JSON.stringify(res.data.list))
          if (tem[0]) {
            this.data.currentTartget.allTarget = tem[0] ? tem[0].allTarget : []
            this.data.currentTartget._id = tem[0] ? tem[0]._id : null
            tem[0].allTarget.forEach((e) => {
              this.data.taskList.forEach((a) => {
                console.log(e.type == a.type, '32333')
                if (e.type == a.type) {
                  a.disabled = true
                }
              })
            })
            this.setData({
              taskList: this.data.taskList,
            })
          }
        }
      })
      .finally(() => {
        wx.hideLoading()
      })
  },
  getRandomNumberByRange(start, end) {
    return Math.floor(Math.random() * (end - start) + start)
  },
  isPicRepeat(url, arr) {
    let tem = JSON.parse(JSON.stringify(arr))
    let isRepeat = false
    tem.forEach((e) => {
      if (e == url) {
        isRepeat = true
      }
    })
    return isRepeat
  },
  scroll(e) {
    console.log(e, '12')
  },
  createTarget(e) {
    const { type, name, disabled } = e.currentTarget.dataset.item[0]
    if (disabled) return
    this.data.currentTartget.allTarget.push({
      type: type,
      name: name,
      createTime: new Date().getTime(),
    })
    if (!this.data.currentTartget._id) {
      delete this.data.currentTartget._id
    }
    this.data.pointData.type = type
    let dataTem = JSON.parse(JSON.stringify(this.data.currentTartget))
    let pointDataTem = JSON.parse(JSON.stringify(this.data.pointData))
    console.log(dataTem, pointDataTem, '1111')

    wx.showLoading({})
    let punchgoalsFetch = fetch({
      url: 'punchgoals',
      method: this.data.currentTartget._id ? 'PUT' : 'POST',
      data: dataTem,
    })
    let pointFetch = fetch({
      url: 'point',
      method: this.data.pointData._id ? 'PUT' : 'POST',
      data: pointDataTem,
    })
    this.innitBC()
    this.getCurrentTarget()
    this.getCurrentPoint()

    // fetch({
    //   url: 'punchgoals',
    //   method: this.data.currentTartget._id ? 'PUT' : 'POST',
    //   data: dataTem,
    // }).then((res) => {
    //   this.innitBC()
    //   this.getCurrentTarget()
    // })
  },
})
