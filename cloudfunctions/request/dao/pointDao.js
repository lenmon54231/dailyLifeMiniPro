const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const collection = db.collection('point')
const _ = db.command
class pointDao {
  constructor() {}
  getPoint(id) {
    return new Promise((resolve, reject) => {
      collection
        .where(id)
        .get()
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  createPoint(data) {
    return new Promise((resolve, reject) => {
      collection
        .add({ data })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  updatePoint(id, point) {
    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .update({
          data: {
            point: _.inc(point),
          },
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports = pointDao
