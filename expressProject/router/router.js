/**
 * @description 路由模块：处理客户端请求
 * @date 2020-10-28
 * @author wansongtao
 */

//引入模块
const models = {};
models.express = require('express');
models.path = require('path');
models.logicalProcessing = require('../controllers/logicalProcessing');
models.token = require('../controllers/token');

//创建一个路由实例
const router = models.express.Router();

//返回静态资源，修改默认页面为login.html
router.use(models.express.static(models.path.join(__dirname, '../../public'), {index: 'login.html'}));

//定义一个接口返回用户上传的资源
router.use('/uploads', models.express.static(models.path.join(__dirname, '../../uploads')));

//用户登录接口
router.get('/userLogin', async (req, res) => {
    let message = {};
    
    message = await models.logicalProcessing.login(req.query);
    
    if(message.code === 201) {
        //登录成功，设置token
        let tokenStr = models.token.createToken();

        message.token = tokenStr;
    }
    
    res.send(message);

    //登录成功返回首页
    // res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

/**
 * @description 当用户访问/dynamicPage下的页面时，返回渲染好的页面
 */
router.get('/dynamicPage/:who', async (req, res) => {
    if(!models.token.verifyToken(unescape(req.cookies.authorization))) {
        //当用户未登录就访问该文件夹下的资源时，跳转回登录页面
        res.sendFile(models.path.join(__dirname, '../dynamicPage/temporary.html'));
        return false;
    }

    if(req.params.who === 'index.html') {
        users = await models.logicalProcessing.getHeros();

        if(users.code) {
            //返回错误
            res.send(users);
            return false;
        }

        //服务器渲染
        res.render(models.path.join(__dirname, '../dynamicPage/index.html'), {
            users
        });

        return;
    }
    // console.log(req.cookies.authorization);
});

module.exports = router;