// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  let count = event.count;
  if (count < 1) {
    return await db.collection('onetime').where({
      _openid: event.openid
    }).orderBy('calendar','desc').limit(13).get()
  } else {
    return await db.collection('onetime').where({
      _openid: event.openid
    }).orderBy('calendar','desc').skip(count).limit(13).get()
  }

}