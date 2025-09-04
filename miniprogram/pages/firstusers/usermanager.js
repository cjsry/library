// pages/firstusers/usermanager.js
Page({


    data: {
        array:[
            '允许',
            '不允许',
            '全部'
        ],
        convey_array:[
            true,
            false,
            ''
        ],
        numberArray: Array.from({length: 100}, (_, i) => i + 1),
        index:'2',
        tableData:[],
        columns:[],
        now_borrow_show:false,
        now_borrow_detail:{},
        borrow_log_show:false,
        borrow_log_detail:{},
        time_out_show:false,
        timeout_log_detail:[],
        credit_change_show:false,
        new_credit:50,
        temp_id:'',
        username_search:''
    },
    onShow(){
        this.get_data()
    },
    get_data(a,b,c){
        wx.cloud.callFunction({
            name: 'users_data',
            data: {
                username:a,
                index:b,
                borrow_permission:c
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
    goback(){
        wx.redirectTo({
          url: './firsthome',
        })
    },
    now_borrow_show_change(){
        this.setData({now_borrow_show:!this.data.now_borrow_show})
    },
    now_borrow_detail(event){
        const fuser_index=event.currentTarget.dataset.index;
        this.setData({
            now_borrow_detail:this.data.tableData[fuser_index].borrow
        })
        this.now_borrow_show_change()
    },
    borrow_log_show_change(){
        this.setData({borrow_log_show:!this.data.borrow_log_show})
    },
    borrow_log_detail(event){
        const fuser_index=event.currentTarget.dataset.index;
        this.setData({borrow_log_detail:this.data.tableData[fuser_index].borrow_logs})
        this.borrow_log_show_change()
    },
    time_out_show_change(){
        this.setData({time_out_show:!this.data.time_out_show})
    },
    time_out_log_detail(event){
        const fuser_index=event.currentTarget.dataset.index;
        this.setData({timeout_log_detail:this.data.tableData[fuser_index].time_out_logs})
        this.time_out_show_change()
    },
    credit_change_show_change(){
        this.setData({credit_change_show:!this.data.credit_change_show})
    },
    credit_change(event){
        const fuser_id=event.currentTarget.dataset.id;
        const fuser_index=event.currentTarget.dataset.index;
        this.setData({
            temp_id:fuser_id,
            new_credit:this.data.tableData[fuser_index].credit
        }),()=>{}
        this.credit_change_show_change()
    },
    credit_change_onload(){
        console.log(this.data.temp_id,this.data.new_credist);
        wx.cloud.callFunction({
            name:'user_credit_change',
            data:{
                _id:this.data.temp_id,
                credit:this.data.new_credit
            }
        }).then(res => {
            if (res.result.success) {
                this.setData({
                    credit_change_show:false,
                    temp_id:'',
                })
                this.get_data()
            }
        }).catch(console.error)

    },
    permission_change1:function(event){
        const fuser_id=event.currentTarget.dataset.id;
        const fuser_index=event.currentTarget.dataset.index;
        console.log(this.data.tableData[fuser_index].borrow_permission);
        if(this.data.tableData[fuser_index].borrow_permission){
            wx.showModal({
                title: '提示',
                content: '确定要取消该用户借阅权限吗？',
                success: (res) => {
                    if(res.confirm){
                        this.permission_change(fuser_id)
                    }  
                }
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '确定要恢复该用户借阅权限吗？为避免bug，请也恢复部分信誉值。',
                success: (res) => {
                    if(res.confirm){
                        this.permission_change(fuser_id)
                    }  
                }
            })
        }
    },
    permission_change(e){
        wx.cloud.callFunction({
            name:'user_permission_change',
            data:{
                _id:e
            }
        }).then(res => {
            if (res.result.success) {
                this.get_data()
            }
        }).catch(console.error)
    },
    select(){
        // this.get_bookdata()
        // this.setData({category_search:this.data.array[this.data.index2]})
        console.log(this.data.username_search,this.data.index);
        if((this.data.index !=='2')||this.data.username_search){
            console.log('存在');
            if(this.data.index2=='2'){
                this.setData({index:''}),()=>{}
            }
            this.get_data(this.data.username_search,this.data.index,this.data.convey_array[this.data.index])
            
        }else{
            this.get_data()
        }

    }


    

 
})