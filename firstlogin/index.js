const cloud = require('wx-server-sdk')
const crypto = require('crypto-js') // 添加加密库
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const firstUsers = db.collection("firstusers") // 重命名变量
const onlyUser = db.collection("onlyuser")

exports.main = async (event, context) => {
  try {
    // 参数校验
    if (!event.username || !event.password) {
        return { 
            ok: false, 
            error: "用户名或密码不能为空" 
        }
    }

    const hashedPwd = crypto.SHA256(event.password).toString(crypto.enc.Hex)

    // 1. 先检查 onlyuser 集合
    const onlyUserRes = await onlyUser.where({
      onlyname: event.username,
      password: hashedPwd
    }).get()

    if (onlyUserRes.data.length > 0) {
      return {
        ok: true,
        url: 'onlyuser/firstuser_manager'
      }
    }

    // 2. 检查 firstusers 集合
    const firstUserRes = await firstUsers.where({
      username: event.username,
      password: hashedPwd
    }).get()
    // console.log(firstUserRes.data);
    if (firstUserRes.data.length > 0) {
        if(firstUserRes.data[0].permission){
            return {
                ok: true,
                url: 'firstusers/firsthome',
                firstusername: firstUserRes.data[0].username,
                _id:firstUserRes.data[0]._id
            }
        }else{
            return { 
                ok: false, 
                error: "您的管理权限被取消了，请联系总管理员" 
            }
        }
        
    }

    // 3. 全部验证失败
    return { 
        ok: false, 
        error: "用户名或密码错误" 
    }

  } catch (err) {
    console.error('云函数错误:', err)
    return { 
        ok: false, 
        error: "服务器内部错误" 
    }
  }
}