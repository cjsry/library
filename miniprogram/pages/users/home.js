// pages/users/home.js
Page({


    data: {
        array:[
            '文学类（小说、散文、诗歌等）',
            '科技类（计算机、工程、医学等）',
            '社科类（经济、政治、心理学等）',
            '历史类（世界史、中国史、传记等）',
            '艺术类（绘画、音乐、摄影等）',
            '生活类（烹饪、健康、家居等）',
            '少儿类（儿童文学、绘本、科普等）',
            '教育类（教材、教辅、教育理论等）',
            '全部'
        ],
        array2:[
            '在馆',
            '被借出',
            '全部'
        ],
        bookName_search:'',
        index:'8',
        index2:'2',
        tableData:[],
        _id:'',
        expect_time_show:false,
        expect_time:1,
        temp_index:0,
        credit:100
    },
    onLoad(){
       
    },
    onShow(){
        try {
            const value = wx.getStorageSync('user_id');
            console.log('获取成功:', value);
            this.setData({_id:value}),()=>{}
        } catch (err) {
            console.error('获取失败:', err);
        }
        // console.log(this.data._id);
        this.update_user_data()
        this.get_bookdata()
    },
    update_user_data(){
        // console.log(this.data._id);
        wx.cloud.callFunction({
            name:'user_update',
            data:{
                _id:this.data._id
            }
        }).then(res => {
            if (res.result.success) {
                this.setData({credit:res.result.credit}),()=>{}
                console.log(this.data.credit);
                if(res.result.book_arr.length>0){

                    wx.showModal({
                      title: '警告',
                      content: '您借阅的'+res.result.book_arr[0]+'等书已超时，请立即归还，否则无法继续借阅',
                      confirmText:'知道了',
                      showCancel:false
                    })
                }
            }
        }).catch(console.error)
    },
    

   
    expect_time_show_change(){
        this.setData({
            expect_time_show:!this.data.expect_time_show,
            expect_time:1
        })
    },
    borrow_book(event){
        const fuser_index=event.currentTarget.dataset.index;
        this.setData({temp_index:fuser_index}),()=>{}
        this.expect_time_show_change()
        


        
    },

    borrow_confirm(){
        wx.showLoading({
            title: '提交中',
        })
        wx.cloud.callFunction({
            name:'book_borrow',
            data:{
                _id:this.data._id,
                book_id:this.data.tableData[this.data.temp_index]._id,
                expect_time:this.data.expect_time
            }
        }).then(res => {
            wx.hideLoading()
            if (res.result.success) {
                wx.showModal({
                    title: '提示',
                    content: res.result.msg,
                    confirmText:'知道了',
                    showCancel:false
                  })
                
            }else{
                wx.showModal({
                  title: '提示',
                  content: res.result.msg,
                  confirmText:'知道了',
                  showCancel:false
                })
            }
        }).catch(console.error)
        this.get_bookdata()
        this.expect_time_show_change()
        
    },

    select(){
        // this.get_bookdata()
        // this.setData({category_search:this.data.array[this.data.index2]})
        console.log(this.data.bookName_search,this.data.index2);
        if((this.data.index !=='8')||this.data.bookName_search||(this.data.index2 !==2)){
            console.log('存在');
            const temp_index = this.data.index
            const temp_index2 = this.data.index2
            if(this.data.index=='8'){
                this.setData({index:''}),()=>{}
            }
            if(this.data.index2=='2'){
                this.setData({index2:''}),()=>{}
            }
            this.get_bookdata(this.data.bookName_search,this.data.index,this.data.index2)
            this.setData({
                index:temp_index,
                index2:temp_index2
            })
        }else{
            this.get_bookdata()
        }
    },
    get_bookdata(a,b,c){
        wx.cloud.callFunction({
            name: 'book_data_user',
            data: {
                bookName:a,
                index:b,
                index2:c
            }
        }).then(res => {
            if (res.result.success) {
                this.processData(res.result.data)
                console.log(res.result.data);
            }
        }).catch(console.error)
    },
    processData(rawData){
        // const columns = Object.keys(rawData[0]).map(key => ({
        //     title: key,
        //     key: key
        // }))
    
        this.setData({
            // columns,
            tableData: rawData,
        })
        // console.log(this.data.columns);
        console.log(this.data.tableData);
    },
    book_detail(event){
        const fuser_index=event.currentTarget.dataset.index;
        const book_data = this.data.tableData[fuser_index]
        console.log(fuser_index);
        wx.redirectTo({
          url: `./book_detail?book_data=${encodeURIComponent(JSON.stringify(book_data))}`
        })
    }

  
})