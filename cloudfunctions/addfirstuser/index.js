// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const crypto = require('crypto-js');

const db=cloud.database()
const firstusers=db.collection("firstusers")


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const queryResult= await firstusers.where({
        username:event.firstname
    }).count();

    if (queryResult.total>0) {
        return { 
          success: false,
          error: '管理户名已存在'  
        };
    }

    const hashedPassword = crypto.SHA256(event.password).toString(crypto.enc.Hex)

    const addResult = await firstusers.add({
        data:{
            username:event.firstname,
            password:hashedPassword,
            permission:true
        }          
    })
    return {
        success:true
    }
}