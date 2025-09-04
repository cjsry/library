Page({
    data: {
  
    },
    onLoad:function (options) {
        wx.cloud.callFunction({
            name:'advancelogin',
            data:{

            },
            success: function (res){
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
                    wx.switchTab({
                      url: '../users/home',
                    })
                }else{
                    wx.redirectTo({
                      url: '../users/login',
                    })
                }
            }
        })
        // wx.request({
        //   url: 'https://yipbxw4tpi.gzg.sealos.run/api/login',
        //   data:{
        //       'token': wx.getStorageSync('user_token'),
              
        //   },
        //   method:'POST',
        //   header:{
        //       'Content-Type':'application/json'
        //   },
        //   success:function (res) {
        //       console.log(res.data)
        //       if(res.data.ok){
        //           wx.redirectTo({
        //             url: '../index/home',
        //           })
        //       }else{
        //           wx.redirectTo({
        //             url: './login',
        //           })
        //       }
              
        //   }
  
        // })
    }
  })