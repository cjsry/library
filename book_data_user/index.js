// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command;
const books = db.collection("books")

// 云函数入口函数
exports.main = async (event, context) => {
    
    let arr = [true, false];

    if (event.index2 == '0') {
        arr = [true];
    } else if (event.index2 == '1') {
        arr = [false];
    }

    const queryCondition = {
        inlibrary: _.in(arr)
    };

    // 修改点：对 bookName 使用正则表达式模糊匹配
    if (event.bookName) {
        // 创建正则表达式，'i' 表示不区分大小写
        queryCondition.bookName = db.RegExp({
            regexp: event.bookName, // 要匹配的文本
            options: 'i'            // 选项：i-不区分大小写
        });
    }
    
    if (event.index) {
        queryCondition.index = event.index;
    }

    if (!event.bookName && !event.index && !event.index2) {
        console.log('无任何过滤条件，查询全部书籍');
        try {
            const res = await books.get()
            return {
                success: true,
                data: res.data
            }
        } catch (err) {
            console.error('查询全部失败:', err);
            return {
                success: false,
                error: err.message
            }
        }
    } else {
        console.log('存在过滤条件，条件为:', queryCondition);
        try {
            const res = await books.where(queryCondition).get()
            console.log(res.data);
            return {
                success: true,
                data: res.data
            }
        } catch (err) {
            console.error('条件查询失败:', err);
            return {
                success: false,
                error: err.message
            }
        }
    }
}