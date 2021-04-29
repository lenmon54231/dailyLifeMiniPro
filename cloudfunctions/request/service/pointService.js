const pointDao = require('../dao/pointDao')
class pointService {
  constructor() {
    this.pointDao = new pointDao()
  }
  async getPoint(data) {
    let res = await this.pointDao.getPoint({ userId: data.userId })
    return { code: 200, msg: '查询成功', data: res }
  }
  async createPoint(data) {
    let currentPoint = null
    switch (data.type) {
      case 1:
        currentPoint = 5
        break
      case 2:
        currentPoint = 10
        break
      case 3:
        currentPoint = 5
        break
      default:
        break
    }
    let res = await this.pointDao.createPoint({
      userId: data.userId,
      point: currentPoint,
    })
    return { code: 200, msg: '新增成功', data: res }
  }
  async updatePoint(data) {
    let currentPoint = null
    switch (data.type) {
      case 1:
        currentPoint = 5
        break
      case 2:
        currentPoint = 10
        break
      case 3:
        currentPoint = 5
        break
      default:
        break
    }
    const ID = data._id
    // data.point = currentPoint
    // delete data.type
    let res = await this.pointDao.updatePoint(String(ID), Number(currentPoint))
    return { code: 200, msg: '更新成功', data: res }
  }
}
module.exports = pointService
