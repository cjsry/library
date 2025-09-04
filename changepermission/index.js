// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const firstUsers = db.collection("firstusers")

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const doc = await firstUsers.doc(event._id).get()
    const currentPermission = doc.data.permission
    console.log(currentPermission);
    await firstUsers.doc(event._id).update({
        data:{
            permission:!currentPermission
        }
    })
    console.log(doc.data.permission);
    return {
        success:true
    }
}