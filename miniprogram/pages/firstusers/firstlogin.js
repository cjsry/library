// pages/users/firstlogin.js
Page({

    data: {
        username:'',
        password: '',
        showPassword: false
    },
    togglePassword() {
        this.setData({ showPassword: !this.data.showPassword });
    },
    loginout(){
        wx.cloud.callFunction({
            name:'firstlogin',
            data:{
                username:this.data.username,
                password:this.data.password,
            },
            success: function(res) {
                if(res.result.ok){
                    wx.setStorage({
                        key:"firstusername",
                        data:res.result.firstusername
                    })
                    wx.setStorage({
                        key:"firstuser_id",
                        data:res.result._id
                    })
                    wx.redirectTo({
                    url: '../'+res.result.url,
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: res.result.error,
                        showCancel:false,
                        confirmText: '知道了'
                    })
                }
            },
        })
    }

})