// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const users = db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
    if(event.username||event.index){
       
        if(event.username&&event.borrow_permission){
            console.log('1');
            console.log('存在',event.index,event.borrow_permission);
            try {
                const res = await users.where({
                    username:event.username,
                    borrow_permission:event.borrow_permission
                }).get()
                return {
                    success: true,
                    data: res.data
                }
            } catch (err) {
                return {
                    success: false,
                    error: err.message
                }
            }
        }else{
            if(event.username){
                console.log('2');
                try {
                    const res = await users.where({
                        username:event.username,
                    }).get()
                    return {
                        success: true,
                        data: res.data
                    }
                } catch (err) {
                    return {
                        success: false,
                        error: err.message
                    }
                }
            }else{
                console.log('3');
                try {
                    const res = await users.where({
                        borrow_permission:event.borrow_permission
                    }).get()
                    return {
                        success: true,
                        data: res.data
                    }
                } catch (err) {
                    return {
                        success: false,
                        error: err.message
                    }
                }
            }
        }
    }else{
        console.log('不存在');
        try {
            const res = await users.get()
            return {
                success: true,
                data: res.data
            }
        } catch (err) {
            return {
                success: false,
                error: err.message
            }
        }
    }
    
}