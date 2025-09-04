// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()
const users=db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
    const user=await users.doc(event._id).get()
    const user_permission=user.data.borrow_permission
    await users.doc(event._id).update({
        data:{
            borrow_permission:!user_permission
        }
        
    })

    return {
        success:true
    }
}