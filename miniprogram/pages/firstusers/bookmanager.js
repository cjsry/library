// pages/firstusers/bookmanager.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        array:[
            '文学类（小说、散文、诗歌等）',
            '科技类（计算机、工程、医学等）',
            '社科类（经济、政治、心理学等）',
            '历史类（世界史、中国史、传记等）',
            '艺术类（绘画、音乐、摄影等）',
            '生活类（烹饪、健康、家居等）',
            '少儿类（儿童文学、绘本、科普等）',
            '教育类（教材、教辅、教育理论等）'
        ],
        array2:[
            '文学类（小说、散文、诗歌等）',
            '科技类（计算机、工程、医学等）',
            '社科类（经济、政治、心理学等）',
            '历史类（世界史、中国史、传记等）',
            '艺术类（绘画、音乐、摄影等）',
            '生活类（烹饪、健康、家居等）',
            '少儿类（儿童文学、绘本、科普等）',
            '教育类（教材、教辅、教育理论等）',
            '全部'
        ],
        managershow:false,
        addshow:false,
        borrow_show:false,
        borrow_detail:[],
        log_show:false,
        log_detail:[],
        modify_show:false,
        modify_tempFileURLs:[],
        modify_id:'',
        modify_bookName:'',
        modify_bookDes:'',
        modify_index:'',
        modify_category:'',
        modify_bookAuthor:'',
        modify_publicationYear:'',
        modify_press:'',
        modify_fileIDs:[],
        temp_fileIDs:[],
        tableData: [],    // 表格数据
        columns: [],      // 表头配置
        bookName_search:'',
        category_search:'',
        index2:'8',
        files: [],
        fileIDs: [],
        index:'',
        category:'',
        bookName:'',
        bookDes:'',
        press:'' ,//书籍出版社
        publicationYear:'' , //书籍出版年
        bookAuthor:'', //书籍作者
    },

    chooseImage: function (e) {
        if(this.data.files.length >= 2){
            wx.showToast({
                title: '警告：只能上传两张图片!',
                icon: 'none',
                duration: 2000
            })
        } else {
            var that = this;
            wx.chooseImage({
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    console.log('上传图片的参数', that.data.files.concat(res.tempFilePaths))
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    that.setData({
                        files: that.data.files.concat(res.tempFilePaths)
                    });
                    console.log(that.data.files);
                }
            })
        }
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    cancelImage: function (e) {
        if(this.data.files.length == 0){
        } else {
            var that = this;
            that.data.files.pop();
            that.setData({
                files: that.data.files
            });
            // console.log(that.data.files);
        }
    },













    handleSubmit:function(){
        wx.showLoading({
            title: '提交中',
        })
        this.setData({category:this.data.array[this.data.index]})
        console.log(this.data.category);
        const promiseArr = []
        let { files, bookName, bookDes, bookAuthor,index,category, publicationYear, press, scanCode } = this.data
        
        //只能一张张上传 遍历临时的图片数组
        for (let i = 0; i < this.data.files.length; i++) {
            let filePath = this.data.files[i]
            let suffix = filePath.match(/\/([^\/]+)$/)[1]; // 正则表达式，获取文件扩展名
            console.log('扩展名',suffix)
            //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
            promiseArr.push(new Promise((reslove, reject) => {
                wx.cloud.uploadFile({
                cloudPath: "book_image/" + suffix,
                filePath: filePath, // 文件路径
            }).then(res => {
                // get resource ID
                console.log(res.fileID)
                this.setData({
                    fileIDs: this.data.fileIDs.concat(res.fileID)
                })
                reslove()
                }).catch(error => {
                console.log(error)
                })
            }))
        }
        Promise.all(promiseArr).then(res => {
            this.addbook()
        })
       
    },

    addbook(){
        wx.cloud.callFunction({
            name:'add_book',
            data:{
                files:this.data.files,
                bookName:this.data.bookName, 
                bookDes:this.data.bookDes,
                index:this.data.index,
                category:this.data.category,
                bookAuthor:this.data.bookAuthor,
                publicationYear:this.data.publicationYear,
                press:this.data.press,
                fileIDs: this.data.fileIDs
            }
        }).then(res=>{
            if(res.result.success){
                this.clear()
                wx.showModal({
                    title: '提示',
                    content: '添加成功',
                    confirmText:'继续添加',
                    cancelText:'退出',
                    success: (res) => {
                        if (res.cancel) {
                            this.setData({addshow:false})
                        }
                    }
                })
                wx.hideLoading()

                
            }
        })

    },
     addshow(){
        this.setData({addshow:!this.data.addshow})
        this.clear()
    },
    clear(){
        this.setData({
            borrow_show:false,
            borrow_detail:[],
            log_show:false,
            log_detail:[],
            modify_show:false,
            modify_id:'',
            modify_bookName:'',
            modify_bookDes:'',
            modify_index:'',
            modify_category:'',
            modify_bookAuthor:'',
            modify_publicationYear:'',
            modify_press:'',
            modify_fileIDs:[],  
            files: [],
            index:'',
            index2:'8',
            bookName: '',
            bookName_search:'',
            bookDes: '',
            category:'',
            fileIDs: [],
            press: '',//书籍出版社
            publicationYear: '', //书籍出版年
            bookAuthor: '', //书籍作者

        })
    },
   



    managershow(){
        this.setData({managershow:!this.data.managershow})
        if(this.data.managershow){
            this.get_bookdata()
        }
        this.clear()
        // console.log(this.data.managershow);
    },
    get_bookdata(a,b){
        wx.cloud.callFunction({
            name: 'book_data',
            data: {
                bookName:a,
                index:b
            }
        }).then(res => {
            if (res.result.success) {
                this.processData(res.result.data)
                console.log(res.result.data);
            }
        }).catch(console.error)
    },
    processData(rawData){
        // const columns = Object.keys(rawData[0]).map(key => ({
        //     title: key,
        //     key: key
        // }))
    
        this.setData({
            // columns,
            tableData: rawData,
        })
        // console.log(this.data.columns);
        console.log(this.data.tableData);
    },

    




    select(){
        // this.get_bookdata()
        // this.setData({category_search:this.data.array[this.data.index2]})
        console.log(this.data.bookName_search,this.data.index2);
        if((this.data.index2 !=='8')||this.data.bookName_search){
            console.log('存在');
            if(this.data.index2=='8'){
                this.setData({index2:''})
            }
            this.get_bookdata(this.data.bookName_search,this.data.index2)
            
        }else{
            this.get_bookdata()
        }
    },

    imageshow:function(event){
        const fuser_index=event.currentTarget.dataset.index;
        wx.cloud.getTempFileURL({
            fileList:this.data.tableData[fuser_index].fileIDs,
            success: res => {
                // 2. 提取所有临时链接
                const tempFileURLs = res.fileList.map(item => item.tempFileURL);
                
                
                // 3. 预览图片（支持滑动切换）
                wx.previewImage({
                  urls: tempFileURLs,  // 所有图片链接
                  current: tempFileURLs[0]  // 默认显示第一张
                });
            },
            fail: err => {
                console.error("获取临时链接失败", err);
                wx.showToast({ title: "图片加载失败", icon: "none" });
            }
        
        })
    },
    borrow_show_change(){
        this.setData({borrow_show:!this.data.borrow_show})
    },
    borrowdetail(event){
        const fuser_index=event.currentTarget.dataset.index;
        this.setData({
            borrow_detail:this.data.tableData[fuser_index].borrow
        })
        this.borrow_show_change()
        // console.log(this.data.borrow_show);
    },
    log_show_change(){
        this.setData({log_show:!this.data.log_show})
    },
    log_detail(event){
        const fuser_index=event.currentTarget.dataset.index;
        this.setData({
            log_detail:this.data.tableData[fuser_index].borrow_logs
        })
        // console.log(this.data.log_detail.length);
        if(this.data.log_detail.length){
            this.log_show_change()
        }else{
            wx.showToast({
              title: '该书从未被借出呢！',
              icon:'none',
              duration:2000
            })
        }
    },
    modify_show_change(){
        this.setData({modify_show:!this.data.modify_show})
    },
    modify(event){
        const fuser_index=event.currentTarget.dataset.index;
        // console.log(this.data.tableData[fuser_index].fileIDs);
        wx.cloud.getTempFileURL({
            fileList:this.data.tableData[fuser_index].fileIDs,
            success: res => {
                // 2. 提取所有临时链接
                const tempFileURLs = res.fileList.map(item => item.tempFileURL);
                // console.log(tempFileURLs);
                this.setData({
                    modify_tempFileURLs:tempFileURLs
                })
                // console.log(this.modify_tempFileURLs);
            },
            fail: err => {
                console.error("获取临时链接失败", err);
                wx.showToast({ title: "图片加载失败", icon: "none" });
            }

        })
        this.setData({
            modify_id:this.data.tableData[fuser_index]._id,
            modify_bookName:this.data.tableData[fuser_index].bookName,
            modify_bookDes:this.data.tableData[fuser_index].bookDes,
            modify_index:this.data.tableData[fuser_index].index,
            modify_category:this.data.tableData[fuser_index].category,
            modify_bookAuthor:this.data.tableData[fuser_index].bookAuthor,
            modify_publicationYear:this.data.tableData[fuser_index].publicationYear,
            modify_press:this.data.tableData[fuser_index].press,
            modify_fileIDs:Array.from(this.data.tableData[fuser_index].fileIDs),
            temp_fileIDs:Array.from(this.data.tableData[fuser_index].fileIDs)
        }),()=>{}
        console.log("temp_fileIDs0",this.data.temp_fileIDs);
        
        // console.log(this.data.modify);
        this.modify_show_change()  
    },
    modify_back(){
        this.modify_show_change() 
    },
    chooseImage_modify: function (e) {
        if(this.data.modify_tempFileURLs.length >= 2){
            wx.showToast({
                title: '警告：只能上传两张图片!',
                icon: 'none',
                duration: 2000
            })
        } else {
            var that = this;
            wx.chooseImage({
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    console.log(res.tempFilePaths);
                    console.log('上传图片的参数', that.data.modify_tempFileURLs.concat(res.tempFilePaths))
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    that.setData({
                        modify_tempFileURLs: that.data.modify_tempFileURLs.concat(res.tempFilePaths)
                    });
                    // console.log(that.data._tempFileURLs);
                }
            })
        }
    },
    cancelImage_modify: function (e) {
        if(this.data.modify_tempFileURLs.length == 0){
        } else {
            var that = this;
            that.data.modify_tempFileURLs.pop();
            that.data.modify_fileIDs.pop();
            that.setData({
                modify_tempFileURLs: that.data.modify_tempFileURLs,
                modify_fileIDs:that.data.modify_fileIDs
            }),()=>{};
            // console.log(that.data.files);
        }
    },

    modify_confirm:function(){
        wx.showLoading({
            title: '提交中',
        })
        
        console.log('temp_fileIDs:',this.data.temp_fileIDs);
        this.setData({
            modify_category:this.data.array[this.data.modify_index],
            modify_fileIDs:[]
        }),()=>{
            
        }
        console.log('tempFileURLs',this.data.modify_tempFileURLs);
        const promiseArr = []
        // let { files, bookName, bookDes, bookAuthor,index,category, publicationYear, press, scanCode } = this.data
            
        //只能一张张上传 遍历临时的图片数组



        for (let i = 0; i < this.data.modify_tempFileURLs.length; i++) {
            const url =this.data.modify_tempFileURLs[i];
            const tempUrlPattern = /^https:\/\/([a-z0-9-]+)\.tcb\.qcloud\.la\/([^?]+)(?:\?|$)/;
            const match = url.match(tempUrlPattern);
                
            if (match){
                const [_, envId, filePath] = match;
                

                // 提取核心环境ID（cloud1-0g82nlp30c7dcd52）
                const coreEnvId = envId.split('-').slice(1, 3).join('-');
                    
                // 构建标准fileID
                const fileID= `cloud://${coreEnvId}.${envId}/${filePath}`;
                this.data.modify_fileIDs.push(fileID)
                this.setData({modify_fileIDs:this.data.modify_fileIDs}),()=>{}
                console.log('modify_fileIDs2',this.data.modify_fileIDs);
            }else{
                let filePath = this.data.modify_tempFileURLs[i]
                console.log('filePath',filePath)
                let suffix = filePath.match(/\/([^\/]+)$/)[1]; // 正则表达式，获取文件扩展名
                console.log('扩展名',suffix)
                //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
                promiseArr.push(new Promise((reslove, reject) => {
                    wx.cloud.uploadFile({
                    cloudPath: "book_image/" + suffix,
                    filePath: filePath, // 文件路径
                }).then(res => {
                    // get resource ID
                    console.log('添加的',res.fileID)
                    this.data.modify_fileIDs.push(res.fileID)
                    this.setData({modify_fileIDs:this.data.modify_fileIDs}),()=>{}

                    console.log('modify_fileIDs3',this.data.modify_fileIDs);
                    reslove()
                    }).catch(error => {
                    console.log(error)
                    })
                }))
            } 

        
                
        }





        Promise.all(promiseArr).then(res => {
            console.log("modify_fileIDs4",this.data.modify_fileIDs);
            console.log("temp_fileIDs5",this.data.temp_fileIDs);
            const difference = this.data.temp_fileIDs.filter(item => !this.data.modify_fileIDs.includes(item));
            console.log('difference',difference);
            wx.cloud.deleteFile({
                fileList: difference, // 要删除的 FileID 数组
                success: res => {
                    console.log('删除成功', res);
                    // wx.showToast({ title: '删除成功', icon: 'success' });
                },
                fail: err => {
                    console.error('删除失败', err);
                    // wx.showToast({ title: '删除失败', icon: 'none' });
                }
            });
            this.modify_book()
        })
        
       
    },
    modify_book(){
        wx.cloud.callFunction({
            name:'book_modify',
            data:{
                _id:this.data.modify_id,
                bookName:this.data.modify_bookName, 
                bookDes:this.data.modify_bookDes,
                index:this.data.modify_index,
                category:this.data.modify_category,
                bookAuthor:this.data.modify_bookAuthor,
                publicationYear:this.data.modify_publicationYear,
                press:this.data.modify_press,
                fileIDs: this.data.modify_fileIDs
            }
        }).then(res=>{
            if(res.result.success){
                
                wx.showModal({
                    title: '提示',
                    content: '修改成功',
                    showCancel:false,
                    confirmText:'知道了',
                })
                this.clear()
                this.get_bookdata()
                wx.hideLoading()

                
            }
        })
    },
    book_delete(){
        wx.showModal({
            title: '警告',
            content: '确认删除该书，删除后无法恢复！！',
            confirmText:'确认',
            cancelText:'取消',
            complete: (res) => {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name:'book_delete',
                        data:{
                            _id:this.data.modify_id
                        }
                    }).then(res=>{
                        if(res.result.success){
                            
                            wx.showModal({
                                title: '提示',
                                content: '删除成功',
                                showCancel:false,
                                confirmText:'知道了',
                            })
                            this.clear()
                            this.get_bookdata()
                        }
                    })
                }
                if (res.cancel) {
                
                }
            }
        })
    },
    goback(){
        wx.redirectTo({
          url: './firsthome',
        })
    }

  
})