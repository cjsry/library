# 图书馆借阅小程序

图书馆借阅小程序是一个基于微信小程序和云开发的应用，旨在为图书馆用户提供快捷借阅和归还图书功能（内置了信誉系统），以及管理员快捷添加和管理图书。

## 声明
本小程序主要完成了功能上的实现，界面设计和用户体验上还有待提升，欢迎各位大佬提出宝贵意见和建议。

## 功能特点

- **书籍借阅和归还**：快捷借阅和归还，未归还会影响信誉，影响后期借阅
- **书籍查询**：提前可查询馆内图书存在与存量
- **用户系统**：基于微信小程序的用户授权和登录
- **管理系统**：分两级的管理系统，顶层管理次级管理系统，次级负责图书管理和用户管理

## 技术架构

### 前端（小程序）

- 基于微信小程序原生开发
- 使用微信云开发SDK进行云函数调用和数据库操作

### 后端（云开发）

- **云函数**
    - `add_book`:次级管理员添加图书
    - `addfirstuser`:顶级管理添加次级管理
    - `advancelogin`:普通用户快捷登录（使用openid）
    - `book_borrow`:普通用户借阅书籍
    - `book_data`:次级管理者管理图书获取图书数据
    - `book_data_user`:普通用户获取图书数据
    - `book_delete`:次级管理者删除图书信息
    - `book_disreturn_user`:普通用户登录初始化检测是否有逾期未归还书籍
    - `book_modify`:次级管理者修改图书信息
    - `book_return`:普通用户归还图书
    - `changepermission`:顶级管理更改次级管理权限（不删除账户，可以撤销修改）
    - `clearfirstuser`:顶级管理删除次级管理
    - `first_change`:次级管理修改账户信息
    - `firstlogin`:顶级管理与次级管理登录
    - `firstuser_data`:顶级管理获取次级管理信息
    - `login`:普通用户账号密码登录
    - `register`:普通用户注册
    - `user_credit_change`:次级管理者修改普通用户信誉值
    - `user_permission_change`:次级管理者修改普通用户借阅权限
    - `user_update`:普通用户登录检查是否有新逾期未归还图书(会扣除信誉分并限制借阅)
    - `users_data`:次级管理者管理普通用户获取用户信息
    
    
    
    
    

- **数据库**
    - `onlyuser`:存储唯一顶级管理账户信息
    - `firstusers`:存储次级管理账户信息
    - `users`:存储普通账户信息
    - `books`:存储书籍信息
        
## 项目结构

```
library/
├── cloudfunctions/            # 云函数目录
│   ├── add_book/      
│   ├── addfirstuser/        
│   ├── advancelogin/             
│   ├── book_borrow/
│   ├── book_data/
│   ├── book_data_user/
│   ├── book_delete/
│   ├── book_disreturn_user/
│   ├── book_modify/
│   ├── book_return/
|   ├── changepermission/
│   ├── clearfirstuser/
│   ├── first_change/
│   ├── firstlogin/
│   ├── firstuser_data/
│   ├── login/
│   ├── register/
│   ├── user_credit_change/
│   ├── user_permission_change/
│   ├── user_update/
│   ├── users_data/
├── miniprogram/               # 小程序前端代码
│   ├── images/                # 图片资源
│   ├── pages/                 # 页面
│   │   ├─firstusers           # 二级管理员页面
│   │   ├─index                # 首页
│   │   ├─onlyuser             # 顶级管理员页面
│   │   └─users                # 用户页面
│   ├── app.js                 # 小程序入口文件
│   ├── app.json               # 小程序全局配置
│   └── app.wxss               # 小程序全局样式
├── project.config.json        # 项目配置文件
└── README.md                  # 项目说明文档
```

## 安装和使用

### 前提条件

- 微信开发者工具
- 微信云开发账号

### 安装步骤

1. 克隆本仓库到本地
   ```bash
   
   ```

2. 使用微信开发者工具打开项目

3. 在微信开发者工具中，点击"云开发"按钮，开通云开发服务

4. 创建以下数据库集合：
   - `onlyuser`：顶级管理员集合
   - `firstusers`：二级管理员集合
   - `users`：普通用户集合
   - `books`：书籍集合

5. 初始化数据库数据：
   - 顶级管理员账号：`admin`，密码：`自行设置`必须自行存储在数据库，密码使用SHA256后转换为16进制加密后存入数据库(如想更改账号，请更改云函数[firstlogin])

6. 上传并部署云函数：
   - 在微信开发者工具中，右键点击cloudfunctions目录下的每个云函数
   - 选择"上传并部署：所有文件"

7. 编译运行小程序

### 数据库结构


#### onlyuser 集合

```json
{
    "_id":"用户id",
    "username":"用户名",
    "password":"SHA256后转换为16进制加密后的密码"
}
```

#### firstusers 集合

```json
{
    "_id":"用户id",
    "username":"用户名",
    "password":"SHA256后转换为16进制加密后的密码",
    "permission":"是否有管理权限"
}
```

#### users 集合

```json
{
    "_id":"用户id",
    "username":"用户名",
    "password":"SHA256后转换为16进制加密后的密码",
    "openid":"微信固定唯一openid",
    "updatetime":{"$date":"最近登录时间"},
    "credit":'信誉值',
    "borrow_logs":[
        {
            "expect_time":"借阅时长",
            "return":"是否归还",
            "return_time":{"$date":"归还时间"},  //当归还后添加此字段
            "timeout":"是否超时",
            "_id":"被借阅书籍id",
            "bookname":"被借阅书籍名称",
            "borrow_time":{"$date":"借阅时间"},
            "expect_return_time":{"$date":"预计归还时间"}
        }
    ], //借阅记录
    "borrow":[
        {
            "expect_time":"借阅时长",
            "timeout":"是否超时",
            "_id":"被借阅书籍id",
            "bookname":"被借阅书籍名称",
            "borrow_time":{"$date":"借阅时间"},
            "expect_return_time":{"$date":"预计归还时间"}
        }
    ],
    "borrow_permission":"是否有借阅权限",
    "time_out_logs":[
        {
            "_id":"书籍id",
            "bookname":"被借阅书籍名称",
            "borrow_time":{"$date":"借阅时间"},
            "expect_return_time":{"$date":"预计归还时间"},
            "expect_time":"7",
            "return_time":{"$date":"归还时间"},  //归还后才会新增此字段
            "credit_punish":-10
        }
    ],  //违约记录
    "borrow_num_max":"最大借阅数量",
    "borrow_num_remain":"剩余可借阅数量"
}
```

#### books 集合

```json
{
    "_id":"书籍id",
    "borrow_logs":[
        {
            "_id":"借阅人id",
            "username":"借阅人用户名",
            "borrow_time":{"$date":"借阅时间"},
            "expect_return_time":{"$date":"最晚归还时间"},
            "expect_time":"预计借阅时长",
            "timeout":"是否超时",
            "return":"是否已归还",
            "return_time":{"$date":"归还时间"}  //当归还后添加此字段
        }
    ], //借阅记录
    "bookName":"书籍名称",
    "bookDes":"书籍介绍",
    "category":"书籍分类",
    "bookAuthor":"作者",
    "publicationYear":"出版年份",
    "press":"出版社",
    "fileIDs":[书籍预览图片(云存储地址)],
    "index":"书籍分类序号",
    "inlibrary":"是否在馆",
    "borrow":{
        "_id":"借阅人id",
        "username":"借阅人用户名",
        "borrow_time":{"$date":"借阅时间"},
        "expect_return_time":{"$date":"最晚归还时间"},
        "expect_time":"预计借阅时长",
        "timeout":"是否超时"
    } //当且仅当用户借阅是有内容，用户归还后将自动清空
}
```

## 联系方式

如有任何问题或建议，请通过以下方式联系我：


- 发送邮件至：2533358414@qq.com

## 致谢

感谢所有为本项目做出贡献的开发者！
