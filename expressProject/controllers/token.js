/**
 * @description 生成token和验证token
 * @date 2020-10-30
 * @author wansongtao
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
 */
tokenObj.createToken = () => {
    try {
        const token = tokenObj.jsonwebtoken.sign({}, tokenObj.key, {
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
 */
tokenObj.verifyToken = (token) => {
    try {
        tokenObj.jsonwebtoken.verify(token, tokenObj.key);
        return true;
    }
    catch(ex) {
        console.error('verifyToken(): ' + ex.message);
        return false;
    }
};

//导出模块
module.exports = tokenObj;