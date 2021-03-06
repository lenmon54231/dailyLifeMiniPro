const punchDao = require('../dao/punchDao')
const punchGoalDao = require('../dao/punchGoalDao')

class punchGoalService {
  constructor() {
    this.punchDao = new punchDao()
    this.punchGoalDao = new punchGoalDao()
  }
  async getPunchGoalList(data) {
    const list = await this.punchGoalDao.getPunchGoalList(data)
    return { code: 200, msg: '查询成功', data: { list } }
  }
  async createPunchGoal(data) {
    const res = await this.punchGoalDao.createPunchGoal({ ...data })
    return { code: 200, msg: '新增成功', data: res }
  }
  async updatePunchGoal(data) {
    const id = data._id
    delete data._id
    const res = await this.punchGoalDao.updatePunchGoal(id, data)
    return { code: 200, msg: '修改成功', data: res }
  }
  async deletePunchGoal(id) {
    await this.punchGoalDao.deletePunchGoal(id)
    await this.punchDao.deletePunchByGoal(id)
    return { code: 200, msg: '删除成功' }
  }
}
module.exports = punchGoalService
