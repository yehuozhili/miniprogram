const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  datea=event.dateA;
  dateb=event.dateB;
  openid=event.openid;
  return await db.collection('onetime').where({
    _openid: event.openid,
    calendar: _.gte(dateb).and(_.lte(datea))
  }).get()

}