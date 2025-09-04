// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()
const books=db.collection("books")

// 云函数入口函数
exports.main = async (event, context) => {
    
    await books.add({
        data:{
            borrow_logs:[],
            borrow:{},
            bookName:event.bookName, 
            bookDes:event.bookDes,
            category:event.category,
            bookAuthor:event.bookAuthor,
            publicationYear:event.publicationYear,
            press:event.press,
            fileIDs: event.fileIDs,
            index:event.index,
            inlibrary:true
        }
    })
    return {
        success:true
    }
}