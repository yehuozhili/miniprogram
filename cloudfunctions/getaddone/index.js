// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.collection('onetime').where({
      _openid: event.openid, // 填入当前用户 openid
      calendar:event.calendar
    }).get()
}