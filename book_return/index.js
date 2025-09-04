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
    const currentuser =await users.doc(event._id).get()
    const user_borrow_logs = currentuser.data.borrow_logs
    
    const currentbook =await books.doc(event.book_id).get()
    console.log(currentuser);
    console.log(currentbook);
    console.log(currentbook.data.borrow.expect_return_time);
    if(currentTime>currentbook.data.borrow.expect_return_time){
        await users.doc(event._id).update({
            data:{
                time_out_logs:_.push({
                    _id:event.book_id,
                    bookname:currentbook.data.bookName,
                    borrow_time:currentbook.data.borrow.borrow_time,
                    expect_return_time:currentbook.data.borrow.expect_return_time,
                    expect_time:currentbook.data.borrow.expect_time,
                    return_time:currentTime,
                    credit_punish:-10
                })              
            }
        })
    }else{
        const borrow_t = currentbook.data.borrow.borrow_time
        console.log(currentTime);
        console.log(borrow_t);
        console.log(currentTime-borrow_t);
        if(currentuser.data.credit<98&&currentTime-borrow_t>24*60*60*1000){
            await users.doc(event._id).update({
                data:{
                    credit:_.inc(2)            
                }
            })
        } 
    }

    
    

    let borrow_logs_index
    console.log(event.book_id);
    user_borrow_logs.forEach((item,index)=>{
         console.log(item);
        
        if(item._id==event.book_id&&!item.return){
            borrow_logs_index=index
            
        }
    })
    console.log(borrow_logs_index);
    await users.doc(event._id).update({
        data:{
            borrow:_.pull({
                _id:event.book_id
            }),
            [`borrow_logs.${borrow_logs_index}.return`]:true,
            [`borrow_logs.${borrow_logs_index}.return_time`]:currentTime,
            borrow_num_remain:_.inc(1)
        },
        
        
    })

    const change_user = await users.doc(event._id).get()
    const user_borrow = change_user.data.borrow

    let timeout_num=0
    user_borrow.forEach((item,index)=>{
        if(item.timeout){
            timeout_num=timeout_num+1
        }
    })
    console.log(timeout_num);
    if(timeout_num==0){
        await users.doc(event._id).update({
            data:{
                borrow_permission:true
            }
        })
    }


    
    const logs_length = currentbook.data.borrow_logs.length


    await books.doc(event.book_id).update({
        data:{
            borrow:_.set({}),
            inlibrary:true,
            [`borrow_logs.${logs_length-1}.return`]:true,
            [`borrow_logs.${logs_length-1}.return_time`]:currentTime
        }
    })






    return{
        success:true,
        msg:'归还成功'
    }
    
    
}