/**
 * @description 生成token和验证token
 * @date 2020-10-30
 * @author wansongtao
 */

/**
 * @description 将全局函数和全局变量保存到对象中，减少全局变量的使用
 */
const tokenObj = {};

//引入模块
tokenObj.jsonwebtoken = require('jsonwebtoken');

/**
 * @description 密钥，用来验证真伪
 */
tokenObj.key = 'wansongtao';

/**
 * @description 生成token
 * @param {object} 推荐传入用户账号，默认空对象。（可选）
 * @returns 返回token或false
 */
tokenObj.createToken = (userName = {}) => {
    try {
        //生成token，并设置过期时间为一小时
        const token = tokenObj.jsonwebtoken.sign(userName, tokenObj.key, {
            expiresIn: '1h'
        });

        return token;
    } catch (ex) {
        console.error('createToken(): error ' + ex.message);
        return false;
    }
};

/**
 * @description 验证token
 * @param {string} token token字符串
 * @returns 返回布尔值，true验证通过，false不通过
 */
tokenObj.verifyToken = (token) => {
    try {
        //验证token
        tokenObj.jsonwebtoken.verify(token, tokenObj.key);
        return true;
    } catch (ex) {
        console.error('verifyToken(): ' + ex.message);
        return false;
    }
};

//导出模块，这样别的模块才可以引用这个模块，并使用其中的方法
module.exports = tokenObj;