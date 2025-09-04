// pages/users/login.js
Page({

    data: {
      username:'',
      password: '',
      showPassword: false
    },
    onShow(){
        wx.clearStorageSync();
    },
    togglePassword() {
      this.setData({ showPassword: !this.data.showPassword });
    },
    loginout(){
        wx.cloud.callFunction({
            name:'login',
            data:{
                username:this.data.username,
                password:this.data.password,
            },
            success: function(res) {
                if(res.result.ok){
                    wx.setStorage({
                        key:"username",
                        data:res.result.username
                    })
                    wx.setStorage({
                        key:"user_id",
                        data:res.result._id
                    })
                    wx.switchTab({
                      url: './home',
                    })
                    console.log('完成');
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
    },

    // loginout(){
    //   wx.request({
    //     url: 'https://yipbxw4tpi.gzg.sealos.run/api/login',
    //     data:{
    //         "username":this.data.username,
    //         "password":this.data.password,
    //     },
    //     method:'POST',
    //     header:{
    //         'content-type':'application/json'
    //     },
    //     success:function (res) {
    //         console.log(res.data);
    //         if(res.data.ok){
    //             wx.setStorage({
    //                 key:"userid",
    //                 data:res.data.userId
    //             })
    //             wx.setStorage({
    //               key:"username",
    //               data:res.data.username
    //           })
    //             wx.setStorage({
    //                 key:"user_token",
    //                 data:res.data.token
    //             })
    //             wx.redirectTo({
    //               url: '../index/home',
    //             })
    //         }else{
    //           wx.showModal({
    //               title: '提示',
    //               content: res.data.error,
    //               showCancel:false,
    //               confirmText: '知道了'
    //           })
    //         }
            
    //     }
    //   })
    // },
    registerout(){
        wx.navigateTo({
          url: './register',
        })
    },
    firstloginout(){
        wx.navigateTo({
            url: '../firstusers/firstlogin',
          })
    },
    
    thiswxloginout(){
        wx.showModal({
          title: '提醒',
          content: '确保此微信注册过',
          success: (res) => {
            if(res.confirm){
                wx.redirectTo({
                  url: '../index/index',
                })
            }  
        }
        })
    }
  })