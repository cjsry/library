// pages/users/register.js
Page({
    data: {
      username:'',
      password1: '',
      password2:'',
      showPassword1: false,
      showPassword2: false
    },
    togglePassword1() {
      this.setData({ showPassword1: !this.data.showPassword1 });
    },
    togglePassword2() {
      this.setData({ showPassword2: !this.data.showPassword2 });
    },
  
    registerend(){
        if (!this.data.username||!this.data.password1||!this.data.password2) {
            wx.showModal({
                title: '提示',
                content: '用户名或两次密码不能为空',
                showCancel:false,
                confirmText: '知道了'
            })
        }else{
            if (!(this.data.password1==this.data.password2)) {
                wx.showModal({
                    title: '提示',
                    content: '两次密码不一致，请重新输入',
                    showCancel:false,
                    confirmText: '知道了'
                })
            }else{
                wx.cloud.callFunction({
                    name:'register',
                    data:{
                        username:this.data.username,
                        password:this.data.password1,
                    },
                    success: function(res) {
                        console.log(res);
                        if(res.result.ok){
                            wx.setStorage({
                                key:"useropenid",
                                data:res.result.openid
                            })
                            wx.setStorage({
                                key:"username",
                                data:res.result.username
                            })
                            wx.setStorage({
                                key:"user_id",
                                data:res.result._id
                            })
                            wx.redirectTo({
                              url: './home',
                            })
                        }else{
                            wx.showModal({
                                title: '提示',
                                content: res.result.error,
                                showCancel:false,
                                confirmText: '知道了'
                            })
                        }
                    }
                
            })
        }
        
        }
    }    
  })