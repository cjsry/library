// pages/onlyusers/firstuser_manager.js
Page({
    data: {
      tableData: [],    // 表格数据
      columns: [],      // 表头配置
      showpassword1:false,
      showpassword2:false,
      password1:'',
      password2:'',
      managername:'',
      add_show:true
    },
  
    onShow() {
        this.closeadd(),
        this.fetchData()
    },
  
    // 获取云数据库数据
    fetchData() {
        wx.cloud.callFunction({
            name: 'firstuser_data',
            data: {
            
            }
        }).then(res => {
            if (res.result.success) {
                this.processData(res.result.data)
                console.log(res.result.data);
            }
        }).catch(console.error)
    },
  
    // 处理数据为表格格式
    processData(rawData) {
        // 动态生成表头（取第一条数据的字段）
        const columns = Object.keys(rawData[0]).map(key => ({
            title: key,
            key: key
        }))
    
        this.setData({
            columns,
            tableData: rawData,
        })
    },
  
    changepms:function(event){
        const fuser_id=event.currentTarget.dataset.id;
        const fuser_index=event.currentTarget.dataset.index;
        if(this.data.tableData[fuser_index].permission){
            wx.showModal({
                title: '提示',
                content: '确定要取消该管理员权限吗？',
                success: (res) => {
                    if(res.confirm){
                        this.permission_change(fuser_id)
                    }  
                }
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '确定要赋予管理员权限吗？',
                success: (res) => {
                    if(res.confirm){
                        this.permission_change(fuser_id)
                    }  
                }
            })
        }
    },

    permission_change(id){
        wx.cloud.callFunction({
            name:'changepermission',
            data:{
                _id:id
            }
        }).then(res => {
            if (res.result.success) {
                this.fetchData()
            }
        }).catch(console.error)       
    },

    clear:function(event){
        const fuser_id=event.currentTarget.dataset.id;
        const fuser_index=event.currentTarget.dataset.index;

        wx.showModal({
            title: '警告',
            content: '确定要删除该管理员，删除后不可恢复',
            success: (res) => {
                if(res.confirm){
                    this.firstuser_clear(fuser_id)
                }   
            }
        })
        
    },
    firstuser_clear(id){
        wx.cloud.callFunction({
            name:'clearfirstuser',
            data:{
                _id:id
            }
        }).then(res => {
            if (res.result.success) {
                this.fetchData()
            }
        }).catch(console.error)
    },

    togglePassword1() {
        this.setData({ showpassword1: !this.data.showpassword1 });
    },
    togglePassword2() {
        this.setData({ showpassword2: !this.data.showpassword2 });
    },
    changeaddshow(){
        this.setData({add_show:true})
    },
    loginout(){
        wx.clearStorageSync();
        wx.redirectTo({
          url: '../users/login',
        })
    },
    closeadd(){
        this.setData({
            showpassword1:false,
            showpassword2:false,
            password1:'',
            password2:'',
            managername:'',
            add_show:false
        })
    },
    add_confirm(){
        if (!this.data.managername||!this.data.password1||!this.data.password2) {
            wx.showModal({
                title: '提示',
                content: '用户名或两次密码不能为空',
                showCancel:false,
                confirmText: '知道了'
            })
        }else{
            if(this.data.password1==this.data.password2){
                this.addfirstuser()
            }else{
                wx.showModal({
                    title: '提示',
                    content: '两次密码不一致，请重新输入',
                    showCancel:false,
                    confirmText: '知道了'
                })
            }
        }
    },
    addfirstuser(){
        wx.cloud.callFunction({
            name: 'addfirstuser',
            data: {
                firstname:this.data.managername,
                password:this.data.password1
            }
        }).then(res => {
            if (res.result.success) {
                this.closeadd(),
                this.fetchData(),
                wx.showToast({
                    title: '添加成功', 
                    icon: 'success', 
                    duration: 2000  
                })
            }else{
                wx.showModal({
                    title: '提示',
                    content: res.result.error,
                    showCancel:false,
                    confirmText: '知道了'
                })
            }
        }).catch(console.error)
    }
})

