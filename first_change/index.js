// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const crypto = require('crypto-js');
const db = cloud.database()
const firstusers = db.collection("firstusers")

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const hashedPassword1 = crypto.SHA256(event.password1).toString(crypto.enc.Hex)
    const hashedPassword = crypto.SHA256(event.password).toString(crypto.enc.Hex)

    const user = await firstusers.doc(event._id).get()

    if(user.data.password==hashedPassword1){
        await firstusers.doc(event._id).update({
            data:{
                password:hashedPassword
            }
        })
    
        return {
            success:true
        }
    }else{
        return{
            success:false,
            error:"原密码不正确"
        }
    }

    
}