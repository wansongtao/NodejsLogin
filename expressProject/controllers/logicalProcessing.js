/**
 * @description 逻辑处理
 * @date 2020-10-29
 * @author wansongtao
 */

/**
 * @description 将全局函数和全局变量保存到对象中，减少全局变量的使用
 */
const logicalProcessing = {};

//引入数据库模块
logicalProcessing.database = require('../models/databaseConn');

/**
 * @description 验证用户登录(异步函数)
 * @param {string} userName 账号
 * @param {number} userPwd 密码
 * @returns 状态码和具体信息 {code: 200, msg: '成功'}
 */
logicalProcessing.login = async ({
    userName,
    userPwd
}) => {
    if (typeof userName !== 'string' || typeof userPwd !== 'string') {
        return {
            code: 401,
            msg: '登录信息有误'
        };
    }

    let message = {},
        data = [];

    //查询该账户是否注册了
    let queryStr = "select id from users where isdelete = '0' and account = ?";

    data = await logicalProcessing.database.query(queryStr, [userName]);

    if (data[0]) {
        //查询密码是否正确
        queryStr = "select id from users where isdelete = '0' and account = ? and pwd = ?";

        data = await logicalProcessing.database.query(queryStr, [userName, userPwd]);

        message = logicalProcessing.returnMessage(data);

    } else if (!data[0] && data !== false) {
        message = {
            code: 301,
            msg: '该账户未注册，请先注册！'
        };
    } else {
        message = {
            code: 504,
            msg: '服务器繁忙，请稍后再试'
        };
    }

    return message;
};

/**
 * @description 查询数据中的所有英雄，并返回相应数据
 */
logicalProcessing.getHeros = async () => {
    let data = [];

    //查询英雄信息
    let queryStr = "select id, name, gender from heros where isdelete = '0'";

    data = await logicalProcessing.database.query(queryStr);

    if (data[0]) {
        return data;
    } else if (data === false) {
        return {
            code: 504,
            msg: '服务器繁忙，请稍后再试'
        };
    } else {
        return {
            code: 505,
            msg: '未查找到任何数据'
        };
    }
};

/**
 * @description 根据查询到的数据返回信息
 * @param {object} data 查询返回的数据
 * @returns 返回一个对象 {code: 200, msg: 'message'}
 */
logicalProcessing.returnMessage = (data) => {
    let message = {};

    if (data[0]) {
        message = {
            code: 201,
            msg: '登录成功'
        };
    } else if (!data[0] && data !== false) {
        message = {
            code: 302,
            msg: '密码错误'
        };
    } else {
        message = {
            code: 504,
            msg: '服务器繁忙，请稍后再试'
        };
    }
    return message;
};

//导出模块，这样别的模块才可以引用这个模块，并使用其中的方法
module.exports = logicalProcessing;