// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const crypto = require('crypto-js');

const db=cloud.database()
const users=db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    if (!event.username || !event.password) {
        return { 
          ok:false,
          error: "用户名或密码不能为空"
         };
    }

    const hashedPassword = crypto.SHA256(event.password).toString(crypto.enc.Hex)
    const currentTime = new Date() // 获取当前时间

    const thisuser= await users.where({
        username:event.username,
        password:hashedPassword
    }).get();

    if(thisuser.data && thisuser.data.length>0){
        const userData = thisuser.data[0]  // 获取第一条用户记录
        await users.doc(userData._id).update({
            data: {
              updatetime: currentTime // 更新最近登录时间
            }
        })
        return{
            ok:true,
            username:userData.username,
            _id:userData._id,
            msg:'登录成功'
        }
    }else{
        return { 
            ok: false,
            error: "用户名或密码错误"  
        };
    }
}