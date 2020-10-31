/**
 * @description 路由模块：处理客户端请求
 * @date 2020-10-28
 * @author wansongtao
 */

/**
 * @description 将全局函数和全局变量保存到对象中，减少全局变量的使用
 */
const models = {};

//引入模块
models.express = require('express');
models.path = require('path');
models.logicalProcessing = require('../controllers/logicalProcessing');
models.token = require('../controllers/token');

/**
 * @description 一个路由实例
 */
const router = models.express.Router();

//返回静态资源，修改默认页面为login.html
router.use(models.express.static(models.path.join(__dirname, '../../public'), {index: 'login.html'}));

//定义一个接口返回用户上传的资源
// router.use('/uploads', models.express.static(models.path.join(__dirname, '../../uploads')));

//用户登录接口
router.get('/userLogin', async (req, res) => {
    let message = {};
    
    //等待models.logicalProcessing.login()函数返回值后，在执行后面的代码
    message = await models.logicalProcessing.login(req.query);
    
    if(message.code === 201) {
        //登录成功，设置token
        let tokenStr = models.token.createToken();

        message.token = tokenStr;
    }
    
    //返回信息给客户端
    res.send(message);

    //登录成功返回首页
    // res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

/**
 * @description 当用户访问/dynamicPage下的页面时，返回渲染好的页面(测试)
 */
router.get('/dynamicPage/:who', async (req, res) => {
    if(!models.token.verifyToken(unescape(req.cookies.authorization))) {
        //当用户未登录就访问该文件夹下的资源时，跳转回登录页面(借助一个中间页)
        res.sendFile(models.path.join(__dirname, '../dynamicPage/temporary.html'));
        return false;
    }

    if(req.params.who === 'index.html') {
        users = await models.logicalProcessing.getHeros();

        if(users.code) {
            //返回错误信息给客户端
            res.send(users);
            return false;
        }

        //服务器渲染后，再返回给客户端
        res.render(models.path.join(__dirname, '../dynamicPage/index.html'), {
            users
        });

        return;
    }
    // console.log(req.cookies.authorization);
});

//导出模块，这样别的模块才可以引用这个模块，并使用其中的方法
module.exports = router;