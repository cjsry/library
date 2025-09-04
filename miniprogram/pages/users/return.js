// pages/users/return.js
Page({

  
    data: {
        _id:'',
        tableData:[],
        return_show:false
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
        this.get_disreturn_bookdata()
    },
    get_disreturn_bookdata(){
        wx.cloud.callFunction({
            name:'book_disreturn_user',
            data:{
                _id:this.data._id
            }
        }).then(res => {
            if (res.result.success) {
                this.setData({tableData:res.result.data}),()=>{}
                console.log(this.data.tableData);
            }
        }).catch(console.error)
    },
    return_book(event){
        const fuser_index=event.currentTarget.dataset.index;
        console.log(this.data.tableData);
        console.log(fuser_index);
        const book_id = this.data.tableData[fuser_index]._id;
        console.log(book_id);
        wx.showModal({
            title: '提示',
            content: '确认要归还吗？',
            complete: (res) => {
                if (res.cancel) {
                
                }
            
                if (res.confirm) {
                this.cloud_return(book_id)
                }
            }
        })
        
    },
    cloud_return(e){
        wx.cloud.callFunction({
            name:'book_return',
            data:{
                _id:this.data._id,
                book_id:e
            }
        }).then(res => {
            if (res.result.success) {
                wx.showModal({
                    title: '提示',
                    content: res.result.msg,
                    confirmText:'知道了',
                    showCancel:false
                })
                this.get_disreturn_bookdata()
            }
        }).catch(console.error)
    }

  
})