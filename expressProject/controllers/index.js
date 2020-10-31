/**
 * @description 主程序
 * @date 2020-10-28
 * @author wansongtao
 */

const myIndex = {};

//引入express模块
myIndex.express = require('express');

//引入两个中间件模块
myIndex.bodyParser = require('body-parser');
myIndex.cookieParser = require('cookie-parser');

//引入router模块
myIndex.router = require('../router/router');

//创建服务器实例
myIndex.webApp = myIndex.express();

//监听3000窗口
myIndex.webApp.listen(3000, (err) => {
    if (err) {
        throw err;
    }
});

//调用中间件
myIndex.webApp.use(myIndex.bodyParser.urlencoded({extended: false}));
myIndex.webApp.use(myIndex.cookieParser());

//创建一个模板引擎，param1：文件后缀名，param2：模板引擎的主函数
myIndex.webApp.engine('html', require('express-art-template'));

//注册模板引擎，设置使用art这个模板引擎
myIndex.webApp.set('view engine', 'art');

//指定视图所在位置
myIndex.webApp.set('./views', '../dynamicPage');

//调用路由处理请求
myIndex.webApp.use(myIndex.router);

//服务器错误处理
myIndex.webApp.use((err, req, res, next) => {
    console.error('server error: ' + err);
    res.status(500).send({code: 500, msg: '服务器出错了，请稍后再试'});
});

//资源路径错误处理
myIndex.webApp.use((req, res) => {
    res.status(404).send({code: 404, msg: '资源找不到'});
});