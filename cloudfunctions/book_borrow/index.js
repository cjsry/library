// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const users = db.collection("users")
const books = db.collection("books")
const currentTime = new Date() // 获取当前时间
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event._id,event.book_id,event.expect_time);
    const expect_return_time = new Date(currentTime.getTime() + event.expect_time * 24 * 60 * 60 * 1000);
    console.log(currentTime,expect_return_time);
    const currentuser = await users.doc(event._id).get()
    const currentbook = await books.doc(event.book_id).get()

    console.log(currentbook);

    // console.log(currentuser);
    // console.log(currentuser.borrow_permission);

    if(currentuser.data.borrow_permission){
        if(currentuser.data.borrow_num_remain){
            await users.doc(event._id).update({
                data:{
                    borrow: _.push({
                        _id:event.book_id,
                        bookname:currentbook.data.bookName,
                        borrow_time:currentTime,
                        expect_return_time:expect_return_time,
                        expect_time:event.expect_time,
                        timeout:false
                    }),
                    borrow_logs:_.push({
                        _id:event.book_id,
                        bookname:currentbook.data.bookName,
                        borrow_time:currentTime,
                        expect_return_time:expect_return_time,
                        expect_time:event.expect_time,
                        timeout:false,
                        return:false
                    }),
                    borrow_num_remain:_.inc(-1)
                }
            })
            await books.doc(event.book_id).update({
                data:{
                    'borrow._id':event._id,
                    'borrow.borrow_time':currentTime ,
                    'borrow.expect_return_time': expect_return_time,
                    'borrow.username': currentuser.data.username,
                    'borrow.timeout':false ,
                    'borrow.expect_time': event.expect_time,
                    inlibrary:false,
                    borrow_logs:_.push({
                        _id:event._id,
                        username:currentuser.data.username,
                        borrow_time:currentTime,
                        expect_return_time:expect_return_time,
                        expect_time:event.expect_time,
                        timeout:false,
                        return:false
                    })
                }
            })
            return {
                success:true,
                expect_return_time:expect_return_time,
                msg:'借阅成功,请及时归还'
            }



        }else{
            return{
                success:false,
                msg:'已借阅至当前信誉值最大值图书，请归还后再继续借阅'
            }
        }

    }else{
        return{
            success:false,
            msg:'无借阅权限，请检查是否有未归还书本，如没有，请联系管理员'
        }
    }

    
}