/**
 * @description 将全局变量和函数都存放在对象中，减少全局变量的使用
 */
const loginJs = {};

/**
 * @description 用户登录
 * @param {object} data 服务端返回的json数据（已经转换为了js对象）
 */
loginJs.login = (data) => {
    try {
        if (!(data instanceof Object)) {
            throw {
                message: '服务器返回的数据格式错误'
            };
        }
        
        commonObj.showMsg(data);
    } catch (ex) {
        console.error(ex.message);
        layer.msg('出现了未知错误，建议重启浏览器。', {
            icon: 5
        });
    }
};

/**
 * @description 表单提交事件
 * @param {object} e 事件对象
 */
loginJs.submitHandle = (e) => {
    //禁止表单的默认事件
    e.preventDefault();

    //获取账号密码并去掉首尾的空格
    const userName = $('#userName').val().trim();
    const userPwd = $('#userPwd').val().trim();

    //验证账号的正则表达式
    const regExpName = /^[a-zA-Z0-9]{3,6}$/;

    if (!regExpName.test(userName)) {
        layer.msg('仅支持3-6位数字、字母组合的账号', {
            time: 800,
            icon: 5
        });

        //选中错误文本
        $('#userName').select();
        return false;
    }

    //验证密码的正则表达式
    const regExpPwd = /^([a-zA-Z])([a-zA-Z0-9]{5,15})$/;

    if (!regExpPwd.test(userPwd)) {
        layer.msg('仅支持6-16位数字、字母组合的密码且以字母开头', {
            time: 800,
            icon: 5
        });

        //选中错误文本
        $('#userPwd').select();
        return false;
    }

    //将账号密码提交给服务端验证
    ajax('/userLogin', {
        userName,
        userPwd
    }, loginJs.login, 'get');
};

$(function () {
    //表单提交
    $('#login').submit(loginJs.submitHandle);
});