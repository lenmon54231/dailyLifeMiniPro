Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper',
    }
  },

  data: {
    background: [],
    quickTabList: [
      { name: '看纪录片', icon: 't-icon-ziyuan13' },
      { name: '知识消化器', icon: 't-icon-ziyuan10' },
      { name: '不纠结', icon: 't-icon-ziyuan12' },
      { name: '记账', icon: 't-icon-ziyuan13' },
      { name: '出错', icon: 't-icon-ziyuan16' },
      { name: '医疗疾病史', icon: 't-icon-ziyuan13' },
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
})
