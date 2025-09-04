// pages/users/me.js
Page({

  
    data: {
        larger_credit_show:false,
        borrow_logs_show:false,
        timeout_logs_show:false,
        tableData:[],
        _id:''
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

        this.get_user_data()
    },
    get_user_data(){
        wx.cloud.callFunction({
            name:'user_data',
            data:{
                _id:this.data._id
            }
        }).then(res => {
            if (res.result.success) {
                // console.log(res.result.data);
                this.setData({tableData:res.result.data}),()=>{}
                console.log(this.data.tableData);
            }
        }).catch(console.error)
    },

    loginout(){
        wx.redirectTo({
            url: './login',
        })
    },
    larger_credit_show_change(){
        this.setData({larger_credit_show:!this.data.larger_credit_show}),()=>{}
        // console.log(this.data.larger_credit_show);
    },
    borrow_logs_show_change(){
        this.setData({borrow_logs_show:!this.data.borrow_logs_show}),()=>{}
    },
    timeout_logs_show_change(){
        this.setData({timeout_logs_show:!this.data.timeout_logs_show}),()=>{}
    }
})