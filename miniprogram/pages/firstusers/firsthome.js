// pages/firstusers/firsthome.js
Page({
    data: {

    },
    usermanager(){
        wx.redirectTo({
          url: './usermanager',
        })
    },
    bookmanager(){
        wx.redirectTo({
          url: './bookmanager',
        })
    },
    selfmanager(){
        wx.redirectTo({
          url: './selfmanager',
        })
    },
    loginout(){
        wx.redirectTo({
          url: '../users/login',
        })
    }
 
})