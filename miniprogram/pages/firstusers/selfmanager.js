// pages/firstusers/selfmanager.js

Page({


    data: {
        changeshow:false,
        _id:'',
        firstusername:'',
        showpassword1:false,
        showpassword2:false,
        showpassword3:false,
        password1:'',
        password2:'',
        password3:''
    },
    onLoad(){
        this.setData({
            _id:wx.getStorageSync('firstuser_id'),
            firstusername:wx.getStorageSync('firstusername')
        })
    },
    loginout(){
        wx.redirectTo({
          url: '../users/login',
        })
    },
    closechange(){
        this.setData({
            showpassword1:false,
            showpassword2:false,
            showpassword3:false,
            password1:'',
            password2:'',
            password3:'',
            changeshow:false,
        })
    },
    togglePassword1() {
        this.setData({ showpassword1: !this.data.showpassword1 });
    },
    togglePassword2() {
        this.setData({ showpassword2: !this.data.showpassword2 });
    },
    togglePassword3() {
        this.setData({ showpassword3: !this.data.showpassword3 });
    },
    changedata(){
        this.setData({
            changeshow:true
        })
    },
    goback(){
        wx.redirectTo({
          url: './firsthome',
        })
    },
    change_confirm(){
        if (!this.data.password3||!this.data.password1||!this.data.password2) {
            wx.showModal({
                title: '提示',
                content: '三种密码不能为空',
                showCancel:false,
                confirmText: '知道了'
            })
        }else{
            this.passwordcheck()
        }
    },
    passwordcheck(){
        if (!(this.data.password3===this.data.password2)) {
            wx.showModal({
                title: '提示',
                content: '两次新密码不同',
                showCancel:false,
                confirmText: '知道了'
            })
        }else{
            if (this.data.password1===this.data.password2) {
                wx.showModal({
                    title: '提示',
                    content: '新旧密码相同',
                    showCancel:false,
                    confirmText: '知道了'
                })
            }else{
                this.firstchange()
            }
        }
    },
    firstchange(){
        wx.cloud.callFunction({
            name:'first_change',
            data:{
                _id:this.data._id,
                password:this.data.password2,
                password1:this.data.password1
            }
        }).then(res=>{
            if(res.result.success){
                wx.showToast({
                    title: '修改成功', 
                    icon: 'success', 
                    duration: 2000  
                }),
                wx.redirectTo({
                  url: '../users/login',
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