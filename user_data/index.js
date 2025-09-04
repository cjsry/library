// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const users = db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
    const currentuser = await users.doc(event._id).get()

    return {
        success:true,
        data:currentuser.data
    }
}