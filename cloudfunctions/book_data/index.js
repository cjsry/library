// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const books = db.collection("books")

// 云函数入口函数
exports.main = async (event, context) => {
    const queryCondition = {};
    
    // 修改点：对 bookName 使用正则表达式模糊匹配
    if (event.bookName) {
        queryCondition.bookName = db.RegExp({
            regexp: event.bookName,
            options: 'i'
        });
    }
    
    if (event.index) {
        queryCondition.index = event.index;
    }

    try {
        let res;
        if (Object.keys(queryCondition).length === 0) {
            console.log('无查询条件，查询全部书籍');
            res = await books.get();
        } else {
            console.log('存在查询条件:', queryCondition);
            res = await books.where(queryCondition).get();
        }
        
        console.log('查询结果:', res.data);
        return {
            success: true,
            data: res.data
        }
        
    } catch (err) {
        console.error('查询失败:', err);
        return {
            success: false,
            error: err.message
        }
    }
}