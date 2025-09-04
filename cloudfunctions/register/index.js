// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const crypto = require('crypto-js');

const db=cloud.database()
const users=db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const queryResult= await users.where({
        username:event.username
    }).count();

    console.log(queryResult);

    if (queryResult.total>0) {
        return { 
          ok: false,
          error: '用户名已存在'  
        };
    }

    const queryResult2= await users.where({
        openid:wxContext.OPENID
    }).count();

    console.log(queryResult2);

    if (queryResult2.total>0) {
        return { 
          ok: false,
          error: '当前微信已注册过'  
        };
    }

    const hashedPassword = crypto.SHA256(event.password).toString(crypto.enc.Hex)
    const currentTime = new Date()

    console.log(event.username,hashedPassword,wxContext.OPENID);

    const addResult = await users.add({
        data:{
            username:event.username,
            password:hashedPassword,
            openid:wxContext.OPENID,
            borrow:{},
            borrow_permission:true,
            borrow_logs:[],
            time_out_logs:[],
            updatetime: currentTime,
            credit:100,
            borrow_num_max:5,
            borrow_num_remain:5
        }          
    })
    return {
        ok: true,
        _id: addResult._id, // 新添加文档的ID
        openid: wxContext.OPENID,
        username: event.username,
        msg: '注册成功'
    }

}