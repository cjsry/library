// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()
const users=db.collection("users")

console.log(users);

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    const thisuser= await users.where({
        openid:wxContext.OPENID
    }).get();

    console.log(thisuser.data);

    const currentTime = new Date() // 获取当前时间

    if(thisuser.data && thisuser.data.length>0){
        const userData = thisuser.data[0]  // 获取第一条用户记录
        await users.doc(userData._id).update({
            data: {
              updatetime: currentTime // 更新最近登录时间
            }
        })
        return{
            ok:true,
            openid:userData.openid,
            username:userData.username,
            _id:userData._id,
            msg:'登录成功'
        }
    }else{
        return { 
            ok: false,
            error: "该用户未注册"  
        };
    }

}