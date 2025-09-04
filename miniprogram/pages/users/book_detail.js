// pages/users/book_detail.js
Page({


    data: {
        book_data:{}
    },

    onLoad: function(options) {
        // 每次进入页面都会执行 onLoad
        this._processOptions(options);
    },

    _processOptions: function(options) {
        console.log('接收到新参数:', options);
        // 接收复杂对象
        if (options.book_data) {
            try {
                const book_data = JSON.parse(decodeURIComponent(options.book_data));
                this.setData({ book_data: book_data }),()=>{}                
                console.log(this.data.book_data);
            } catch (error) {
                console.error('JSON 解析错误:', error);
            }
        }
    },
    tabBar_back(){
        wx.switchTab({
          url: './home',
        })
    }
})