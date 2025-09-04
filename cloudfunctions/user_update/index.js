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
    let book_arr = []
    const user =await users.doc(event._id).get()

    console.log(user.data);
    const array = user.data.borrow
    const array_logs = user.data.borrow_logs
    console.log(array);
    
    // console.log(credit);
    // const borrow_num_max = user.data.borrow_num_max
    // console.log(borrow_num_max);
    // const borrow_num_remain = user.data.borrow_num_remain
    // console.log(borrow_num_remain);
    for (const item of array) {
        console.log(item);
        if(!item.timeout){
            if(item.expect_return_time<currentTime){
                const book_id = item._id
                console.log(book_id);
                const book = await books.doc(book_id).get()
                book_arr.push(book.data.bookName)
                const book_logs_length = book.data.borrow_logs.length
                console.log('book_logs_length:',book_logs_length,typeof(book_logs_length));


                await books.doc(book_id).update({
                    data:{
                        'borrow.timeout':true,
                        [`borrow_logs.${book_logs_length-1}.timeout`]:true
                    }
                })
                let borrow_logs_index 
                let borrow_index
                array_logs.forEach((item1, index) => {
                    if(item1._id==book_id&&!item1.retuen){
                        borrow_logs_index=index
                    }
                });
                array.forEach((item1, index) => {
                    if(item1._id==book_id&&!item1.retuen){
                        borrow_index=index
                    }
                });
                console.log(borrow_logs_index,typeof(borrow_logs_index));
                // const logs_index = borrow_logs_index
                await users.doc(event._id).update({
                    data: {
                        [`borrow_logs.${borrow_logs_index}.timeout`]: true,
                        [`borrow.${borrow_index}.timeout`]: true,
                        credit:_.inc(-10),
                        borrow_permission:false
                    }
                })


                
            }
        }else{
            book_arr.push(item.bookname)

        }
    }

    const change_user  = await users.doc(event._id).get()
    const credit = change_user.data.credit
    const borrow_length = change_user.data.borrow.length
    let num_max
    
    if(credit==100){
        num_max=5
    }else if(credit>=90){
        num_max=4
    }else if(credit>=80){
        num_max=3
    }else if(credit>=70){
        num_max=2
    }else if(credit>=60){
        num_max=1
    }else{
        num_max=0
    }
    let num_remain
    if(num_max>=borrow_length){
        num_remain=num_max-borrow_length
    }else{
        num_remain=0
    }
    
    console.log('num_max','num_remain',num_max,num_remain);
    console.log(book_arr);

    await users.doc(event._id).update({
        data:{
            borrow_num_max:num_max,
            borrow_num_remain:num_remain,
        }
    })


    console.log('credit:',credit);



    return {
        success:true,
        book_arr,
        credit

    }
}